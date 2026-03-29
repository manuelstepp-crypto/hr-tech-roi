"use client";

import { KFSolutionId, SalesParams } from "@/lib/types";
import { KF_SOLUTIONS } from "@/lib/kf-solutions";
import { calcKFImpact } from "@/lib/calculations";

interface Props {
  params: SalesParams;
}

export function ImpactTable({ params }: Props) {
  if (params.activeSolutions.length === 0) return null;

  const combined = calcKFImpact(params.activeSolutions, params.solutionCosts);
  const totalMonthlyCost = params.activeSolutions.reduce(
    (sum, id) => sum + params.solutionCosts[id],
    0
  );

  const rows: { id: KFSolutionId; name: string; ramp: number; contrib: number; recruit: number; monthly: number }[] =
    params.activeSolutions.map((id) => ({
      id,
      name: KF_SOLUTIONS[id].name,
      ramp: KF_SOLUTIONS[id].impact.rampReductionPct,
      contrib: KF_SOLUTIONS[id].impact.contributionBoostPct,
      recruit: KF_SOLUTIONS[id].impact.recruitingCostReductionPct,
      monthly: params.solutionCosts[id],
    }));

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Korn Ferry Impact-Übersicht
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-2 text-gray-400 font-medium">Lösung</th>
              <th className="text-right px-3 py-2 text-gray-400 font-medium">↘ Einarbeitung</th>
              <th className="text-right px-3 py-2 text-gray-400 font-medium">↗ Beitrag</th>
              <th className="text-right px-3 py-2 text-gray-400 font-medium">↘ Recruiting</th>
              <th className="text-right px-4 py-2 text-gray-400 font-medium">Kosten/Mo.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-2.5 font-medium text-gray-700">{row.name}</td>
                <td className="px-3 py-2.5 text-right text-emerald-600 font-mono">−{row.ramp}%</td>
                <td className="px-3 py-2.5 text-right text-emerald-600 font-mono">+{row.contrib}%</td>
                <td className="px-3 py-2.5 text-right text-emerald-600 font-mono">
                  {row.recruit > 0 ? `−${row.recruit}%` : "—"}
                </td>
                <td className="px-4 py-2.5 text-right text-gray-600 font-mono">
                  {row.monthly.toLocaleString("de-DE")} €
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-orange-50 border-t border-orange-100">
              <td className="px-4 py-2.5 font-semibold text-gray-700">Gesamt (kombiniert)</td>
              <td className="px-3 py-2.5 text-right text-orange-600 font-mono font-semibold">
                −{combined.rampReductionPct.toFixed(0)}%
              </td>
              <td className="px-3 py-2.5 text-right text-orange-600 font-mono font-semibold">
                +{combined.contributionBoostPct.toFixed(0)}%
              </td>
              <td className="px-3 py-2.5 text-right text-orange-600 font-mono font-semibold">
                {combined.recruitingCostReductionPct > 0 ? `−${combined.recruitingCostReductionPct.toFixed(0)}%` : "—"}
              </td>
              <td className="px-4 py-2.5 text-right text-orange-600 font-mono font-semibold">
                {totalMonthlyCost.toLocaleString("de-DE")} €
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <p className="text-[10px] text-gray-400">
          * Kombinierte Werte beinhalten Diminishing Returns bei mehreren Tools. Quellen: Korn Ferry Sales Maturity Survey 2024, Supercharging Sales Effectiveness Report.
        </p>
      </div>
    </div>
  );
}
