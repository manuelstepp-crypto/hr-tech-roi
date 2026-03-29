"use client";

import { SalesParams, KFSolutionId } from "@/lib/types";
import { KF_SOLUTIONS } from "@/lib/kf-solutions";
import { calcKFImpact } from "@/lib/calculations";

interface Props {
  params: SalesParams;
}

export function QuotaAttainmentBar({ params }: Props) {
  const hasKF = params.activeSolutions.length > 0;
  const kfImpact = calcKFImpact(params.activeSolutions, params.solutionCosts);

  // Basis-Quota-Erreichung (angenommen 60% ohne Tools, branchenüblicher Durchschnitt)
  const baseQuotaAttainment = 60;
  // Mit KF: contribution boost ≈ Proxy für höhere Quota-Erreichung
  const kfQuotaAttainment = Math.min(
    baseQuotaAttainment + kfImpact.contributionBoostPct * 0.6,
    95
  );

  // Spezifische Stats aus aktiven Lösungen sammeln
  const quotaStats: { label: string; value: string; color: string }[] = [];
  params.activeSolutions.forEach((id: KFSolutionId) => {
    const sol = KF_SOLUTIONS[id];
    const stat = sol.impact.keyStats.find(
      (s) => s.label.toLowerCase().includes("quota") || s.label.toLowerCase().includes("ziel") || s.label.toLowerCase().includes("quota")
    );
    if (stat) {
      quotaStats.push({ label: `${sol.name}: ${stat.label}`, value: stat.value, color: sol.color });
    }
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Quota-Erreichung (Benchmark)
        </h3>
        <span className="text-[10px] text-gray-400">Branchen-Durchschnitt als Basis</span>
      </div>

      <div className="space-y-3">
        {/* Baseline */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Ohne KF Tools</span>
            <span className="font-mono font-semibold text-gray-600">{baseQuotaAttainment}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-400 rounded-full transition-all duration-500"
              style={{ width: `${baseQuotaAttainment}%` }}
            />
          </div>
        </div>

        {/* Mit KF */}
        {hasKF && (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-orange-600 font-medium">Mit KF Tools</span>
              <span className="font-mono font-semibold text-orange-600">
                {kfQuotaAttainment.toFixed(0)}%
                <span className="text-emerald-600 ml-1 text-[10px]">
                  (+{(kfQuotaAttainment - baseQuotaAttainment).toFixed(0)}%)
                </span>
              </span>
            </div>
            <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${kfQuotaAttainment}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* KF-spezifische Stats */}
      {quotaStats.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
          {quotaStats.map((s, i) => (
            <div key={i} className="flex items-center justify-between text-[10px]">
              <span className="text-gray-400">{s.label}</span>
              <span className={`font-semibold font-mono ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {!hasKF && (
        <p className="text-[10px] text-gray-400 mt-2">
          Wähle KF Lösungen um zu sehen, wie sich die Quota-Erreichung verändert.
        </p>
      )}
    </div>
  );
}
