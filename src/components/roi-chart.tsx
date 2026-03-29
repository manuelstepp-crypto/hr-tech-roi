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
} from "recharts";
import { DataPoint } from "@/lib/types";
import { findBreakEven } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ROIChartProps {
  data: DataPoint[];
  showTechCurve: boolean;
}

function formatEUR(value: number): string {
  return `${(value / 1000).toFixed(0)}k €`;
}

export function ROIChart({ data, showTechCurve }: ROIChartProps) {
  const breakEven = findBreakEven(data, "cumulative");
  const breakEvenTech = showTechCurve ? findBreakEven(data, "cumulativeWithTech") : null;

  // Interpolierte Werte für Break-Even-Dots
  const breakEvenY = 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">ROI-Verlauf</CardTitle>
        <div className="flex gap-6 text-sm text-muted-foreground">
          {breakEven !== null ? (
            <span>
              Break-Even: <strong className="text-foreground">{breakEven} Monate</strong>
            </span>
          ) : (
            <span className="text-destructive">Kein Break-Even in 36 Monaten</span>
          )}
          {showTechCurve && breakEvenTech !== null && (
            <span>
              Mit Technologie:{" "}
              <strong className="text-blue-600">{breakEvenTech} Monate</strong>
              {breakEven !== null && (
                <span className="text-emerald-600 ml-1">
                  ({(breakEven - breakEvenTech).toFixed(1)} Monate früher)
                </span>
              )}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
            <defs>
              <linearGradient id="gradientBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gradientTech" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="month"
              label={{ value: "Monate", position: "insideBottomRight", offset: -5 }}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis
              tickFormatter={formatEUR}
              label={{ value: "Kumuliert (€)", angle: -90, position: "insideLeft", offset: -5 }}
            />
            <Tooltip
              formatter={(value, name) => [
                typeof value === "number" ? `${value.toLocaleString("de-DE")} €` : value,
                name === "cumulative" ? "Ohne Technologie" : "Mit Technologie",
              ]}
              labelFormatter={(label) => `Monat ${label}`}
            />
            <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1.5} strokeOpacity={0.4} />

            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2.5}
              fill="url(#gradientBase)"
              name="cumulative"
            />

            {showTechCurve && (
              <Area
                type="monotone"
                dataKey="cumulativeWithTech"
                stroke="#3b82f6"
                strokeWidth={2.5}
                strokeDasharray="6 3"
                fill="url(#gradientTech)"
                name="cumulativeWithTech"
              />
            )}

            {breakEven !== null && (
              <ReferenceDot
                x={Math.round(breakEven)}
                y={breakEvenY}
                r={6}
                fill="hsl(var(--chart-1))"
                stroke="white"
                strokeWidth={2}
              />
            )}
            {showTechCurve && breakEvenTech !== null && (
              <ReferenceDot
                x={Math.round(breakEvenTech)}
                y={breakEvenY}
                r={6}
                fill="#3b82f6"
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
