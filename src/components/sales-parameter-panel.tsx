"use client";

import { SalesParams } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Props {
  params: SalesParams;
  onChange: (params: SalesParams) => void;
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="relative group inline-flex items-center ml-1">
      <span className="w-4 h-4 rounded-full bg-muted text-muted-foreground text-[10px] font-bold flex items-center justify-center cursor-default select-none leading-none">
        i
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 rounded-md bg-popover border text-popover-foreground text-xs p-2.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 leading-relaxed">
        {text}
      </span>
    </span>
  );
}

function ParamRow({
  label,
  tooltip,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  tooltip: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const formatted =
    unit === "€"
      ? `${value.toLocaleString("de-DE")} €`
      : unit === "%"
      ? `${value} %`
      : `${value} ${unit}`;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Label className="text-xs font-medium text-gray-600">{label}</Label>
          <InfoTooltip text={tooltip} />
        </div>
        <span className="text-xs font-mono text-gray-700 font-semibold">{formatted}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer bg-gray-200 accent-gray-800"
      />
    </div>
  );
}

export function SalesParameterPanel({ params, onChange }: Props) {
  const update = <K extends keyof SalesParams>(key: K, value: SalesParams[K]) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Sales-Parameter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4">
        {/* Rep Economics */}
        <div className="space-y-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rep-Vergütung</p>
          <ParamRow
            label="OTE (On-Target Earnings)"
            tooltip="Gesamtvergütung bei 100% Zielerreichung (Fixgehalt + variable Vergütung). Typisches Sales-OTE liegt bei 20–30% der Quota."
            value={params.ote}
            min={40000}
            max={250000}
            step={5000}
            unit="€"
            onChange={(v) => update("ote", v)}
          />
          <ParamRow
            label="Jährliches Sales-Ziel (Quota)"
            tooltip="Das jährliche Umsatzziel des Sales Reps. Dient als Kontext für die Vergütungsstruktur. Typisch: OTE entspricht 20–30% der Quota."
            value={params.annualQuota}
            min={100000}
            max={2000000}
            step={50000}
            unit="€"
            onChange={(v) => update("annualQuota", v)}
          />
        </div>

        {/* Business Impact */}
        <div className="space-y-3 pt-1 border-t">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pt-1">Business-Beitrag</p>
          <ParamRow
            label="Monatl. Beitrag bei 100% Produktivität"
            tooltip="Der monatliche Wert, den der Sales Rep bei voller Leistung erzeugt — z.B. Deckungsbeitrag aus abgeschlossenen Deals. Der wichtigste Hebel für einen frühen Break-Even."
            value={params.monthlyContribution}
            min={2000}
            max={50000}
            step={1000}
            unit="€"
            onChange={(v) => update("monthlyContribution", v)}
          />
          <ParamRow
            label="Einarbeitungszeit"
            tooltip="Monate bis zur vollen Produktivität. Der Rep folgt einer S-Kurve: langsamer Start, schneller Anstieg in der Mitte, Plateau bei 100%. KF-Tools können diese Zeit deutlich verkürzen."
            value={params.rampMonths}
            min={0}
            max={18}
            step={1}
            unit="Monate"
            onChange={(v) => update("rampMonths", v)}
          />
        </div>

        {/* Einmalige Kosten */}
        <div className="space-y-3 pt-1 border-t">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pt-1">Einmalige Kosten</p>
          <ParamRow
            label="Recruiting-Kosten"
            tooltip="Headhunter-Provision (oft 20–30% des Jahresgehalts), Stellenausschreibungen, Interviews, Background-Checks. KF Select kann diese durch bessere Kandidatenqualität reduzieren."
            value={params.recruitingCosts}
            min={0}
            max={80000}
            step={2500}
            unit="€"
            onChange={(v) => update("recruitingCosts", v)}
          />
          <ParamRow
            label="Onboarding & Training"
            tooltip="Kosten für Onboarding-Programme, Sales-Trainings, Zertifizierungen und interne Ressourcen während der Einarbeitung. KF Sell reduziert diese durch CRM-native Guidance."
            value={params.onboardingCosts}
            min={0}
            max={30000}
            step={500}
            unit="€"
            onChange={(v) => update("onboardingCosts", v)}
          />
          <ParamRow
            label="Equipment & Setup"
            tooltip="Hardware (Laptop, Telefon), Software-Lizenzen, Arbeitsplatz-Setup. Einmalige Investition bei Hiring."
            value={params.equipmentCosts}
            min={0}
            max={15000}
            step={500}
            unit="€"
            onChange={(v) => update("equipmentCosts", v)}
          />
        </div>

        {/* Laufende Kosten */}
        <div className="space-y-3 pt-1 border-t">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pt-1">Laufende Kosten / Monat</p>
          <ParamRow
            label="Tools & CRM (ohne KF)"
            tooltip="Monatliche Kosten für CRM-Lizenzen (Salesforce, HubSpot etc.), Sales-Intelligence-Tools, Kommunikation und sonstige Technik — ohne Korn Ferry Lösungen."
            value={params.monthlyToolsCost}
            min={0}
            max={3000}
            step={50}
            unit="€"
            onChange={(v) => update("monthlyToolsCost", v)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
