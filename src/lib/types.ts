export type KFSolutionId = "kf-select" | "profile-manager" | "kf-pay" | "kf-sell";

export interface SolutionImpact {
  rampReductionPct: number;       // % Reduktion der Einarbeitungszeit
  contributionBoostPct: number;   // % Steigerung des monatl. Business-Beitrags
  recruitingCostReductionPct: number; // % Reduktion der Recruiting-Kosten (bessere Kandidaten)
  monthlyCostPerUser: number;     // Monatliche Lizenzkosten €/User
  implementationCost: number;     // Einmalige Implementierungskosten
  keyStats: { label: string; value: string }[];
  description: string;
  methodology: string;
}

export interface KFSolutionDef {
  id: KFSolutionId;
  name: string;
  tagline: string;
  color: string;
  bgColor: string;
  focus: string; // Wofür ist das Tool
  impact: SolutionImpact;
}

export interface SalesParams {
  // Rep Economics
  ote: number;                    // On-Target Earnings (Jahresgehalt bei 100% Quota)
  annualQuota: number;            // Jährliches Sales-Ziel
  monthlyContribution: number;    // Monatlicher Business-Beitrag bei voller Produktivität
  // Ramp
  rampMonths: number;             // Einarbeitungszeit bis volle Produktivität (Monate)
  // Einmalige Kosten
  recruitingCosts: number;        // Recruiting / Headhunter
  onboardingCosts: number;        // Onboarding & Training
  equipmentCosts: number;         // Hardware, Software-Setup
  // Laufende Kosten
  monthlyToolsCost: number;       // CRM, Tools, Lizenzen (ohne KF)
  // KF Lösungen
  activeSolutions: KFSolutionId[];
  solutionCosts: Record<KFSolutionId, number>; // Monatliche KF-Kosten (editierbar)
}

export interface DataPoint {
  month: number;
  baseline: number;        // Kumuliert ohne KF-Tools
  withKF: number;          // Kumuliert mit ausgewählten KF-Tools
}

export const defaultSalesParams: SalesParams = {
  ote: 80000,
  annualQuota: 500000,
  monthlyContribution: 15000,
  rampMonths: 6,
  recruitingCosts: 20000,
  onboardingCosts: 5000,
  equipmentCosts: 3000,
  monthlyToolsCost: 500,
  activeSolutions: [],
  solutionCosts: {
    "kf-select": 200,
    "profile-manager": 80,
    "kf-pay": 100,
    "kf-sell": 180,
  },
};
