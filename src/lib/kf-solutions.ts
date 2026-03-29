import { KFSolutionDef, KFSolutionId } from "./types";

export const KF_SOLUTIONS: Record<KFSolutionId, KFSolutionDef> = {
  "kf-select": {
    id: "kf-select",
    name: "KF Select",
    tagline: "Predictive Hiring für Sales",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
    focus: "Recruiting & Assessment",
    impact: {
      rampReductionPct: 20,
      contributionBoostPct: 18,
      recruitingCostReductionPct: 15,
      monthlyCostPerUser: 200,
      implementationCost: 2000,
      description:
        "KF Select nutzt wissenschaftlich validierte Assessments, um die besten Sales-Kandidaten zu identifizieren — lange bevor sie ihren ersten Deal schließen. Auf Basis von Milliarden Datenpunkten aus Korn Ferrys Success Profiles werden Persönlichkeit, Kompetenz und kultureller Fit gemessen.",
      methodology:
        "Basiert auf Korn Ferrys Success Profile-Bibliothek mit 11.000+ validierten Rollenprofilen. Kandidaten mit Höchstwertungen zeigen 8× höhere Top-Performer-Wahrscheinlichkeit.",
      keyStats: [
        { label: "Höhere Top-Performer-Wahrscheinlichkeit", value: "8×" },
        { label: "Mehr Reps erreichen volle Quota", value: "+23%" },
        { label: "Reduktion ungewollter Fluktuation", value: "−44%" },
        { label: "Reduktion freiwilliger Fluktuation", value: "−24%" },
      ],
    },
  },

  "profile-manager": {
    id: "profile-manager",
    name: "Profile Manager",
    tagline: "Klare Rollen, klare Erwartungen",
    color: "text-violet-700",
    bgColor: "bg-violet-50 border-violet-200",
    focus: "Rollendefinition & Kompetenzrahmen",
    impact: {
      rampReductionPct: 15,
      contributionBoostPct: 22,
      recruitingCostReductionPct: 10,
      monthlyCostPerUser: 80,
      implementationCost: 3000,
      description:
        "Profile Manager ist das Fundament der gesamten Talent Suite. Er definiert wissenschaftlich, was exzellente Sales-Performance in einer spezifischen Rolle bedeutet — und schafft damit die Grundlage für Hiring, Entwicklung, Coaching und Vergütung.",
      methodology:
        "Zugriff auf 11.000+ validierte Success Profiles mit Skills, Kompetenzen, Leadership-Traits und Work Drivers. Integration in Workday, SAP SuccessFactors und andere HCM-Systeme.",
      keyStats: [
        { label: "Höhere Quota-Erreichung", value: "+25%" },
        { label: "Bessere Win Rates", value: "+17%" },
        { label: "Höhere Revenue-Erreichung", value: "+8%" },
        { label: "Geringere Fluktuation", value: "−17%" },
      ],
    },
  },

  "kf-pay": {
    id: "kf-pay",
    name: "KF Pay",
    tagline: "Vergütung, die Top-Talent hält",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
    focus: "Compensation Intelligence",
    impact: {
      rampReductionPct: 5,
      contributionBoostPct: 8,
      recruitingCostReductionPct: 5,
      monthlyCostPerUser: 100,
      implementationCost: 1500,
      description:
        "KF Pay gibt Zugriff auf die weltgrößte proprietäre Vergütungsdatenbank — 32.000+ Organisationen, 150+ Länder, 31 Millionen Mitarbeiter. Für Sales bedeutet das: marktgerechte OTE-Strukturen, optimierte Base/Variable-Verhältnisse und Pay-Equity-Analysen.",
      methodology:
        "70% der Fortune-500-Unternehmen nutzen Korn Ferry für Compensation-Analysen. Daten werden mehrmals jährlich aktualisiert. EU Pay Transparency Directive zertifiziert.",
      keyStats: [
        { label: "Fortune-500-Unternehmen als Kunden", value: "70%" },
        { label: "Organisationen in der Datenbank", value: "32.000+" },
        { label: "Länder abgedeckt", value: "150+" },
        { label: "Mitarbeiterdaten", value: "31 Mio." },
      ],
    },
  },

  "kf-sell": {
    id: "kf-sell",
    name: "KF Sell",
    tagline: "Miller Heiman direkt im CRM",
    color: "text-orange-700",
    bgColor: "bg-orange-50 border-orange-200",
    focus: "Sales Enablement & Coaching",
    impact: {
      rampReductionPct: 30,
      contributionBoostPct: 28,
      recruitingCostReductionPct: 0,
      monthlyCostPerUser: 180,
      implementationCost: 5000,
      description:
        "KF Sell bringt die bewährte Miller Heiman-Methodik (Strategic Selling with Perspective) direkt in Salesforce und Microsoft Dynamics. Seller bekommen geführte Deal-Strategie live am offenen Opportunity-Record — kein separates Training-Tool, keine Medienbrüche.",
      methodology:
        "Native CRM-Integration mit Blue Sheet (Deal-Strategie), Green Sheet (Call Planning) und AI Assist Bot. Sales Manager erhalten Echtzeit-Coaching-Insights und Pipeline-Transparenz.",
      keyStats: [
        { label: "Höhere Quota-Erreichung (mit Coaching)", value: "+27.9%" },
        { label: "Bessere Win Rates (mit Coaching)", value: "+32.1%" },
        { label: "Mehr Zeit im Verkauf", value: "+23%" },
        { label: "Höhere Win Rates vs. CRM allein", value: "4×" },
      ],
    },
  },
};

export const KF_SOLUTION_ORDER: KFSolutionId[] = [
  "kf-select",
  "profile-manager",
  "kf-pay",
  "kf-sell",
];
