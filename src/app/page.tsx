"use client";

import { useState, useMemo } from "react";
import { SalesParams, defaultSalesParams } from "@/lib/types";
import { calculateROI } from "@/lib/calculations";
import { KFSolutionSelector } from "@/components/kf-solution-selector";
import { SalesParameterPanel } from "@/components/sales-parameter-panel";
import { ROIChart } from "@/components/roi-chart";
import { StatsSummary } from "@/components/stats-summary";
import { ImpactTable } from "@/components/impact-table";
import { QuotaAttainmentBar } from "@/components/quota-attainment-bar";

export default function Home() {
  const [params, setParams] = useState<SalesParams>(defaultSalesParams);
  const data = useMemo(() => calculateROI(params), [params]);
  const hasActiveSolutions = params.activeSolutions.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">KF</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">
                Sales ROI Rechner
              </h1>
              <p className="text-[10px] text-gray-400 leading-tight">
                Korn Ferry Talent Suite
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              Sales Roles
            </span>
            {hasActiveSolutions ? (
              <span className="text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded-full font-medium">
                {params.activeSolutions.length} KF Lösung{params.activeSolutions.length !== 1 ? "en" : ""} aktiv
              </span>
            ) : (
              <span className="text-xs text-gray-400 px-2 py-1">
                Keine Lösung gewählt
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
        <div className="flex flex-col xl:flex-row gap-4 lg:gap-6">

          {/* Left Sidebar */}
          <aside className="w-full xl:w-[360px] xl:shrink-0 space-y-4">

            {/* KF Solutions */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="mb-3">
                <h2 className="text-sm font-bold text-gray-900">Korn Ferry Lösungen</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Aktiviere Tools, um den ROI-Impact zu simulieren
                </p>
              </div>
              <KFSolutionSelector params={params} onChange={setParams} />
            </div>

            {/* Quota Attainment */}
            <QuotaAttainmentBar params={params} />

            {/* Sales Parameters */}
            <SalesParameterPanel params={params} onChange={setParams} />

            {/* Source note */}
            <div className="text-[10px] text-gray-300 leading-relaxed px-1">
              Berechnungen basieren auf Korn Ferry Sales Maturity Survey 2024, dem
              Supercharging Sales Effectiveness Report und dem 5th Annual Sales
              Enablement Study. Alle Prozentwerte sind Benchmark-Durchschnittswerte
              aus Korn Ferry Kundenanalysen.
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-4">

            {/* Stats Row */}
            <StatsSummary data={data} hasActiveSolutions={hasActiveSolutions} />

            {/* Chart */}
            <ROIChart data={data} hasActiveSolutions={hasActiveSolutions} />

            {/* Impact Table */}
            {hasActiveSolutions && <ImpactTable params={params} />}

            {/* Call to action when no solutions selected */}
            {!hasActiveSolutions && (
              <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-8 text-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm font-medium">
                  Korn Ferry Lösung aktivieren
                </p>
                <p className="text-gray-400 text-xs mt-1 max-w-xs mx-auto">
                  Wähle links KF Select, Profile Manager, KF Pay oder KF Sell,
                  um zu sehen wie sich der Break-Even verändert.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
