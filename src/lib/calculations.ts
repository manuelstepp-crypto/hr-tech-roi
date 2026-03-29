import { SalesParams, DataPoint, KFSolutionId } from "./types";
import { KF_SOLUTIONS } from "./kf-solutions";

// S-Kurve für Produktivitäts-Ramp-Up (0→1 über rampMonths)
function sCurve(month: number, rampMonths: number): number {
  if (rampMonths === 0) return 1;
  const midpoint = rampMonths / 2;
  const steepness = 6 / rampMonths;
  return 1 / (1 + Math.exp(-steepness * (month - midpoint)));
}

// Berechnet die kombinierten KF-Auswirkungen
export function calcKFImpact(
  activeSolutions: KFSolutionId[],
  solutionCosts?: Record<KFSolutionId, number>
): {
  rampReductionPct: number;
  contributionBoostPct: number;
  recruitingCostReductionPct: number;
  monthlyLicenseCost: number;
  totalImplementationCost: number;
} {
  // Additive Steigerungen, aber mit Diminishing Returns bei mehreren Tools
  let rampRed = 0;
  let contribBoost = 0;
  let recruitRed = 0;
  let monthlyLicense = 0;
  let implCost = 0;

  activeSolutions.forEach((id) => {
    const sol = KF_SOLUTIONS[id];
    rampRed += sol.impact.rampReductionPct;
    contribBoost += sol.impact.contributionBoostPct;
    recruitRed += sol.impact.recruitingCostReductionPct;
    // Nutze editierbare Kosten wenn vorhanden, sonst Standardwert
    monthlyLicense += solutionCosts ? solutionCosts[id] : sol.impact.monthlyCostPerUser;
    implCost += sol.impact.implementationCost;
  });

  // Diminishing Returns bei mehreren kombinierten Tools (max 80% pro Kategorie)
  const diminish = (v: number, max: number) => max * (1 - Math.exp((-v / max) * 1.5));
  return {
    rampReductionPct: diminish(rampRed, 70),
    contributionBoostPct: diminish(contribBoost, 70),
    recruitingCostReductionPct: Math.min(recruitRed, 30),
    monthlyLicenseCost: monthlyLicense,
    totalImplementationCost: implCost,
  };
}

export function calculateROI(params: SalesParams, months = 36): DataPoint[] {
  const monthlySalary = params.ote / 12;
  const baseInitialCosts =
    params.recruitingCosts + params.onboardingCosts + params.equipmentCosts;

  const kfImpact = calcKFImpact(params.activeSolutions, params.solutionCosts);
  const kfInitialCosts = kfImpact.totalImplementationCost;
  const recruitSaving = params.recruitingCosts * (kfImpact.recruitingCostReductionPct / 100);
  const kfRecruitingCosts = params.recruitingCosts - recruitSaving;

  // Effektive Ramp-Zeit mit KF
  const effectiveRamp = params.rampMonths * (1 - kfImpact.rampReductionPct / 100);
  const baseRamp = params.rampMonths;

  const data: DataPoint[] = [];
  let baseline = -baseInitialCosts;
  let withKF = -(kfRecruitingCosts + params.onboardingCosts + params.equipmentCosts + kfInitialCosts);

  data.push({ month: 0, baseline: Math.round(baseline), withKF: Math.round(withKF) });

  for (let m = 1; m <= months; m++) {
    // Baseline
    const prodBase = sCurve(m, baseRamp);
    const monthlyReturnBase =
      params.monthlyContribution * prodBase - monthlySalary - params.monthlyToolsCost;
    baseline += monthlyReturnBase;

    // Mit KF Tools
    const prodKF = sCurve(m, effectiveRamp);
    const boostedContribution =
      params.monthlyContribution * (1 + kfImpact.contributionBoostPct / 100);
    const monthlyReturnKF =
      boostedContribution * prodKF -
      monthlySalary -
      params.monthlyToolsCost -
      kfImpact.monthlyLicenseCost;
    withKF += monthlyReturnKF;

    data.push({
      month: m,
      baseline: Math.round(baseline),
      withKF: Math.round(withKF),
    });
  }

  return data;
}

export function findBreakEven(
  data: DataPoint[],
  key: "baseline" | "withKF"
): number | null {
  for (let i = 1; i < data.length; i++) {
    if (data[i][key] >= 0 && data[i - 1][key] < 0) {
      const prev = data[i - 1][key];
      const curr = data[i][key];
      const fraction = -prev / (curr - prev);
      return Math.round((data[i - 1].month + fraction) * 10) / 10;
    }
  }
  return null;
}

export function calcROIAt(data: DataPoint[], month: number, key: "baseline" | "withKF"): number {
  const point = data.find((d) => d.month === month);
  return point ? point[key] : 0;
}
