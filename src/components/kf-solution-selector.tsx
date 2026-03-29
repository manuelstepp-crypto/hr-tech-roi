"use client";

import { KFSolutionId, SalesParams } from "@/lib/types";
import { KF_SOLUTIONS, KF_SOLUTION_ORDER } from "@/lib/kf-solutions";

interface Props {
  params: SalesParams;
  onChange: (params: SalesParams) => void;
}

export function KFSolutionSelector({ params, onChange }: Props) {
  const toggle = (id: KFSolutionId) => {
    const isActive = params.activeSolutions.includes(id);
    const next = isActive
      ? params.activeSolutions.filter((s) => s !== id)
      : [...params.activeSolutions, id];
    onChange({ ...params, activeSolutions: next });
  };

  const updateCost = (id: KFSolutionId, cost: number) => {
    onChange({
      ...params,
      solutionCosts: { ...params.solutionCosts, [id]: cost },
    });
  };

  return (
    <div className="space-y-3">
      {KF_SOLUTION_ORDER.map((id) => {
        const sol = KF_SOLUTIONS[id];
        const isActive = params.activeSolutions.includes(id);

        return (
          <div
            key={id}
            className={`rounded-lg border-2 transition-all duration-200 overflow-hidden ${
              isActive
                ? `${sol.bgColor} shadow-sm`
                : "bg-white border-gray-200"
            }`}
          >
            {/* Header Row */}
            <button
              onClick={() => toggle(id)}
              className="w-full text-left px-4 py-3 flex items-start gap-3"
            >
              {/* Checkbox */}
              <div
                className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-colors ${
                  isActive
                    ? "bg-gray-900 border-gray-900"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isActive && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-semibold text-sm ${isActive ? sol.color : "text-gray-700"}`}>
                    {sol.name}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    {sol.focus}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{sol.tagline}</p>
              </div>
            </button>

            {/* Expanded content when active */}
            {isActive && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-200/60">
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-2 pt-3">
                  {sol.impact.keyStats.map((stat) => (
                    <div key={stat.label} className="bg-white/70 rounded-md p-2">
                      <div className={`text-base font-bold ${sol.color}`}>{stat.value}</div>
                      <div className="text-[10px] text-gray-500 leading-tight">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Beschreibung */}
                <p className="text-xs text-gray-600 leading-relaxed">{sol.impact.description}</p>

                {/* Monatliche Lizenzkosten */}
                <div className="flex items-center gap-2 bg-white/60 rounded-md px-3 py-2">
                  <span className="text-xs text-gray-500 flex-1">Monatliche Lizenzkosten</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={params.solutionCosts[id]}
                      onChange={(e) => updateCost(id, Number(e.target.value))}
                      className="w-20 text-right text-sm font-mono border border-gray-200 rounded px-2 py-0.5 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                      min={0}
                      step={10}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-xs text-gray-400">€/Monat</span>
                  </div>
                </div>

                {/* Impact Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {sol.impact.rampReductionPct > 0 && (
                    <span className="text-[10px] bg-white/80 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      ↗ {sol.impact.rampReductionPct}% kürzere Einarbeitung
                    </span>
                  )}
                  {sol.impact.contributionBoostPct > 0 && (
                    <span className="text-[10px] bg-white/80 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      ↗ +{sol.impact.contributionBoostPct}% Business-Beitrag
                    </span>
                  )}
                  {sol.impact.recruitingCostReductionPct > 0 && (
                    <span className="text-[10px] bg-white/80 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      ↘ −{sol.impact.recruitingCostReductionPct}% Recruiting-Kosten
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
