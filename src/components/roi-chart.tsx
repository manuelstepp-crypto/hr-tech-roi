"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  ReferenceDot,
  Legend,
} from "recharts";
import { DataPoint } from "@/lib/types";
import { findBreakEven } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ROIChartProps {
  data: DataPoint[];
  hasActiveSolutions: boolean;
}

function formatEUR(value: number): string {
  if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(1)}M €`;
  return `${(value / 1000).toFixed(0)}k €`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-2">Monat {label}</p>
      {payload.map((entry: { name: string; value: number; color: string }) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
          <span className="text-gray-500">
            {entry.name === "baseline" ? "Ohne KF Tools" : "Mit KF Tools"}:
          </span>
          <span
            className={`font-mono font-semibold ml-auto pl-3 ${
              entry.value >= 0 ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {entry.value >= 0 ? "+" : ""}
            {entry.value.toLocaleString("de-DE")} €
          </span>
        </div>
      ))}
    </div>
  );
};

export function ROIChart({ data, hasActiveSolutions }: ROIChartProps) {
  const breakEvenBase = findBreakEven(data, "baseline");
  const breakEvenKF = hasActiveSolutions ? findBreakEven(data, "withKF") : null;

  const breakEvenBasePoint = breakEvenBase !== null
    ? data.find((d) => d.month === Math.round(breakEvenBase))
    : null;
  const breakEvenKFPoint = breakEvenKF !== null
    ? data.find((d) => d.month === Math.round(breakEvenKF))
    : null;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <CardTitle className="text-base font-semibold">ROI-Verlauf über 36 Monate</CardTitle>
          <div className="flex gap-4 text-xs flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-0.5 bg-gray-400 inline-block" />
              <span className="text-gray-500">Ohne KF Tools</span>
              {breakEvenBase !== null ? (
                <span className="font-semibold text-gray-700">Break-Even: {breakEvenBase} Mon.</span>
              ) : (
                <span className="text-red-500 font-medium">Kein Break-Even in 36 Mon.</span>
              )}
            </div>
            {hasActiveSolutions && (
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-0.5 bg-orange-500 inline-block rounded" />
                <span className="text-gray-500">Mit KF Tools</span>
                {breakEvenKF !== null ? (
                  <>
                    <span className="font-semibold text-orange-600">Break-Even: {breakEvenKF} Mon.</span>
                    {breakEvenBase !== null && (
                      <span className="text-emerald-600 font-semibold">
                        ({(breakEvenBase - breakEvenKF).toFixed(1)} Mon. früher)
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-red-500 font-medium">Kein Break-Even in 36 Mon.</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="gradBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6b7280" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6b7280" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradKF" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              label={{ value: "Monate nach Hiring", position: "insideBottom", offset: -10, fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis
              tickFormatter={formatEUR}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            {hasActiveSolutions && (
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                formatter={(value) => value === "baseline" ? "Ohne KF Tools" : "Mit KF Tools"}
              />
            )}

            {/* Nulllinie */}
            <ReferenceLine y={0} stroke="#d1d5db" strokeWidth={1.5} />

            {/* Baseline-Kurve */}
            <Area
              type="monotone"
              dataKey="baseline"
              stroke="#9ca3af"
              strokeWidth={2}
              fill="url(#gradBase)"
              dot={false}
              activeDot={{ r: 4, fill: "#6b7280" }}
            />

            {/* KF-Kurve */}
            {hasActiveSolutions && (
              <Area
                type="monotone"
                dataKey="withKF"
                stroke="#f97316"
                strokeWidth={2.5}
                fill="url(#gradKF)"
                dot={false}
                activeDot={{ r: 4, fill: "#f97316" }}
              />
            )}

            {/* Break-Even Punkte */}
            {breakEvenBasePoint && (
              <ReferenceDot
                x={Math.round(breakEvenBase!)}
                y={0}
                r={5}
                fill="#6b7280"
                stroke="white"
                strokeWidth={2}
              />
            )}
            {hasActiveSolutions && breakEvenKFPoint && (
              <ReferenceDot
                x={Math.round(breakEvenKF!)}
                y={0}
                r={5}
                fill="#f97316"
                stroke="white"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
