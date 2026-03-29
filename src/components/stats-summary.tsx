"use client";

import { DataPoint } from "@/lib/types";
import { findBreakEven, calcROIAt } from "@/lib/calculations";

interface Props {
  data: DataPoint[];
  hasActiveSolutions: boolean;
}

function StatCard({
  label,
  value,
  sub,
  highlight,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  positive?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-1 ${
        highlight
          ? "bg-orange-50 border-orange-200"
          : "bg-white border-gray-200"
      }`}
    >
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
      <p
        className={`text-2xl font-bold tabular-nums ${
          highlight
            ? "text-orange-600"
            : positive === true
            ? "text-emerald-600"
            : positive === false
            ? "text-red-500"
            : "text-gray-800"
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export function StatsSummary({ data, hasActiveSolutions }: Props) {
  const breakEvenBase = findBreakEven(data, "baseline");
  const breakEvenKF = hasActiveSolutions ? findBreakEven(data, "withKF") : null;

  const value24Base = calcROIAt(data, 24, "baseline");
  const value24KF = hasActiveSolutions ? calcROIAt(data, 24, "withKF") : null;
  const value36Base = calcROIAt(data, 36, "baseline");
  const value36KF = hasActiveSolutions ? calcROIAt(data, 36, "withKF") : null;

  const delta24 = value24KF !== null ? value24KF - value24Base : null;
  const delta36 = value36KF !== null ? value36KF - value36Base : null;

  const breakEvenGain =
    breakEvenBase !== null && breakEvenKF !== null
      ? breakEvenBase - breakEvenKF
      : null;

  const fmt = (v: number) => {
    const abs = Math.abs(v);
    const sign = v >= 0 ? "+" : "−";
    if (abs >= 1000000) return `${sign}${(abs / 1000000).toFixed(1)}M €`;
    return `${sign}${Math.round(abs / 1000)}k €`;
  };

  const fmtBreakEven = (v: number | null) =>
    v !== null ? `${v} Mon.` : "> 36 Mon.";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Break-Even ohne KF"
        value={fmtBreakEven(breakEvenBase)}
        sub="Ohne Korn Ferry Tools"
        positive={breakEvenBase !== null && breakEvenBase <= 18}
      />

      {hasActiveSolutions ? (
        <StatCard
          label="Break-Even mit KF"
          value={fmtBreakEven(breakEvenKF)}
          sub={
            breakEvenGain !== null && breakEvenGain > 0
              ? `${breakEvenGain.toFixed(1)} Monate früher`
              : "Kein Unterschied"
          }
          highlight
        />
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-4 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Mit KF Tools</p>
          <p className="text-sm text-gray-400 mt-1">Wähle eine Lösung</p>
        </div>
      )}

      <StatCard
        label="Wert nach 24 Monaten"
        value={fmt(value24Base)}
        sub={
          delta24 !== null
            ? `KF: ${fmt(value24KF!)} (${delta24 >= 0 ? "+" : ""}${Math.round(delta24 / 1000)}k)`
            : "Ohne KF Tools"
        }
        positive={value24Base >= 0}
      />

      <StatCard
        label="Wert nach 36 Monaten"
        value={fmt(value36Base)}
        sub={
          delta36 !== null
            ? `KF: ${fmt(value36KF!)} (${delta36 >= 0 ? "+" : ""}${Math.round(delta36 / 1000)}k)`
            : "Ohne KF Tools"
        }
        positive={value36Base >= 0}
      />
    </div>
  );
}
