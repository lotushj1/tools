"use client";

import { useState, useMemo } from "react";
import { ArrowLeftRight, Copy, Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

// ─── Types ───────────────────────────────────────────────
type CategoryId =
  | "length"
  | "weight"
  | "temperature"
  | "area"
  | "volume"
  | "speed"
  | "data"
  | "time";

interface UnitDef {
  id: string;
  labelKey: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

interface Category {
  id: CategoryId;
  labelKey: string;
  icon: string;
  units: UnitDef[];
}

// ─── Unit Data ───────────────────────────────────────────
const linear = (factor: number): Pick<UnitDef, "toBase" | "fromBase"> => ({
  toBase: (v) => v * factor,
  fromBase: (v) => v / factor,
});

const categories: Category[] = [
  {
    id: "length",
    labelKey: "unit.cat.length",
    icon: "📏",
    units: [
      { id: "km", labelKey: "unit.km", ...linear(1000) },
      { id: "m", labelKey: "unit.m", ...linear(1) },
      { id: "cm", labelKey: "unit.cm", ...linear(0.01) },
      { id: "mm", labelKey: "unit.mm", ...linear(0.001) },
      { id: "mile", labelKey: "unit.mile", ...linear(1609.344) },
      { id: "yard", labelKey: "unit.yard", ...linear(0.9144) },
      { id: "foot", labelKey: "unit.foot", ...linear(0.3048) },
      { id: "inch", labelKey: "unit.inch", ...linear(0.0254) },
    ],
  },
  {
    id: "weight",
    labelKey: "unit.cat.weight",
    icon: "⚖️",
    units: [
      { id: "kg", labelKey: "unit.kg", ...linear(1000) },
      { id: "g", labelKey: "unit.g", ...linear(1) },
      { id: "mg", labelKey: "unit.mg", ...linear(0.001) },
      { id: "ton", labelKey: "unit.ton", ...linear(1000000) },
      { id: "lb", labelKey: "unit.lb", ...linear(453.592) },
      { id: "oz", labelKey: "unit.oz", ...linear(28.3495) },
    ],
  },
  {
    id: "temperature",
    labelKey: "unit.cat.temperature",
    icon: "🌡️",
    units: [
      {
        id: "celsius",
        labelKey: "unit.celsius",
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      {
        id: "fahrenheit",
        labelKey: "unit.fahrenheit",
        toBase: (v) => ((v - 32) * 5) / 9,
        fromBase: (v) => (v * 9) / 5 + 32,
      },
      {
        id: "kelvin",
        labelKey: "unit.kelvin",
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    ],
  },
  {
    id: "area",
    labelKey: "unit.cat.area",
    icon: "📐",
    units: [
      { id: "km2", labelKey: "unit.km2", ...linear(1000000) },
      { id: "m2", labelKey: "unit.m2", ...linear(1) },
      { id: "cm2", labelKey: "unit.cm2", ...linear(0.0001) },
      { id: "hectare", labelKey: "unit.hectare", ...linear(10000) },
      { id: "acre", labelKey: "unit.acre", ...linear(4046.8564224) },
      { id: "ft2", labelKey: "unit.ft2", ...linear(0.09290304) },
      { id: "ping", labelKey: "unit.ping", ...linear(3.305785) },
    ],
  },
  {
    id: "volume",
    labelKey: "unit.cat.volume",
    icon: "🧪",
    units: [
      { id: "liter", labelKey: "unit.liter", ...linear(1) },
      { id: "ml", labelKey: "unit.ml", ...linear(0.001) },
      { id: "m3", labelKey: "unit.m3", ...linear(1000) },
      { id: "gallon", labelKey: "unit.gallon", ...linear(3.78541) },
      { id: "quart", labelKey: "unit.quart", ...linear(0.946353) },
      { id: "cup", labelKey: "unit.cup", ...linear(0.236588) },
      { id: "floz", labelKey: "unit.floz", ...linear(0.0295735) },
    ],
  },
  {
    id: "speed",
    labelKey: "unit.cat.speed",
    icon: "🚀",
    units: [
      { id: "kmh", labelKey: "unit.kmh", ...linear(1) },
      { id: "ms", labelKey: "unit.ms", ...linear(3.6) },
      { id: "mph", labelKey: "unit.mph", ...linear(1.60934) },
      { id: "knot", labelKey: "unit.knot", ...linear(1.852) },
    ],
  },
  {
    id: "data",
    labelKey: "unit.cat.data",
    icon: "💾",
    units: [
      { id: "byte", labelKey: "unit.byte", ...linear(1) },
      { id: "kb", labelKey: "unit.kb", ...linear(1024) },
      { id: "mb", labelKey: "unit.mb", ...linear(1048576) },
      { id: "gb", labelKey: "unit.gb", ...linear(1073741824) },
      { id: "tb", labelKey: "unit.tb", ...linear(1099511627776) },
    ],
  },
  {
    id: "time",
    labelKey: "unit.cat.time",
    icon: "⏱️",
    units: [
      { id: "sec", labelKey: "unit.sec", ...linear(1) },
      { id: "min", labelKey: "unit.min", ...linear(60) },
      { id: "hr", labelKey: "unit.hr", ...linear(3600) },
      { id: "day", labelKey: "unit.day", ...linear(86400) },
      { id: "week", labelKey: "unit.week", ...linear(604800) },
    ],
  },
];

// ─── Format number ───────────────────────────────────────
function formatNumber(n: number): string {
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e15 || (abs > 0 && abs < 1e-10)) {
    return n.toExponential(6);
  }
  // Use enough precision but trim trailing zeros
  const str = n.toPrecision(12);
  // Remove trailing zeros after decimal
  if (str.includes(".")) {
    return str.replace(/\.?0+$/, "");
  }
  return str;
}

// ─── Main Component ──────────────────────────────────────
export default function UnitConverter() {
  const { t } = useLanguage();

  const [activeCat, setActiveCat] = useState<CategoryId>("length");
  const [fromUnit, setFromUnit] = useState("km");
  const [toUnit, setToUnit] = useState("m");
  const [inputValue, setInputValue] = useState("1");
  const [copied, setCopied] = useState(false);

  const category = categories.find((c) => c.id === activeCat)!;

  // When changing category, reset units
  const handleCategoryChange = (catId: CategoryId) => {
    setActiveCat(catId);
    const cat = categories.find((c) => c.id === catId)!;
    setFromUnit(cat.units[0].id);
    setToUnit(cat.units[1]?.id || cat.units[0].id);
    setInputValue("1");
  };

  // Swap from/to
  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // Calculate result
  const result = useMemo(() => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return "";
    const from = category.units.find((u) => u.id === fromUnit);
    const to = category.units.find((u) => u.id === toUnit);
    if (!from || !to) return "";
    const base = from.toBase(num);
    const converted = to.fromBase(base);
    return formatNumber(converted);
  }, [inputValue, fromUnit, toUnit, category]);

  // All conversions for reference table
  const allConversions = useMemo(() => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return [];
    const from = category.units.find((u) => u.id === fromUnit);
    if (!from) return [];
    const base = from.toBase(num);
    return category.units
      .filter((u) => u.id !== fromUnit)
      .map((u) => ({
        label: t(u.labelKey),
        value: formatNumber(u.fromBase(base)),
        id: u.id,
      }));
  }, [inputValue, fromUnit, category, t]);

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = result;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Category Tabs ── */}
      <div className="clay-card p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 font-body text-sm transition-all ${
                activeCat === cat.id
                  ? "border-black bg-primary/10 text-primary font-bold shadow-[2px_2px_0_black]"
                  : "border-black/10 bg-white text-text/70 hover:border-black/30"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{t(cat.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Converter ── */}
      <div className="clay-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <ArrowLeftRight className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-text text-lg">
            {t(category.labelKey)}{t("unit.conversion")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          {/* From */}
          <div className="space-y-2">
            <label className="block font-body text-sm text-text/70">
              {t("unit.from")}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-black/10 bg-white font-body text-text focus:outline-none focus:border-primary"
            >
              {category.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {t(u.labelKey)}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl border-2 border-black/10 bg-white font-body text-text text-xl font-bold focus:outline-none focus:border-primary"
            />
          </div>

          {/* Swap button */}
          <div className="flex justify-center md:pb-2">
            <button
              onClick={handleSwap}
              className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0_black] hover:shadow-[3px_3px_0_black] hover:-translate-y-0.5 transition-all active:shadow-none active:translate-y-0"
            >
              <ArrowLeftRight className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* To */}
          <div className="space-y-2">
            <label className="block font-body text-sm text-text/70">
              {t("unit.to")}
            </label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-black/10 bg-white font-body text-text focus:outline-none focus:border-primary"
            >
              {category.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {t(u.labelKey)}
                </option>
              ))}
            </select>
            <div className="relative">
              <div className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 bg-primary/5 font-body text-text text-xl font-bold min-h-[52px]">
                {result || "—"}
              </div>
              {result && (
                <button
                  onClick={copyResult}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-body font-semibold transition-all ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-white text-text border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      {t("unit.copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      {t("unit.copy")}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Formula hint */}
        {result && inputValue && (
          <div className="mt-4 px-4 py-3 bg-accent-light/30 rounded-xl font-body text-sm text-text/70 text-center">
            {inputValue} {t(category.units.find((u) => u.id === fromUnit)!.labelKey)} = {result} {t(category.units.find((u) => u.id === toUnit)!.labelKey)}
          </div>
        )}
      </div>

      {/* ── Quick Reference Table ── */}
      {allConversions.length > 0 && inputValue && !isNaN(parseFloat(inputValue)) && (
        <div className="clay-card p-6">
          <div className="font-heading font-bold text-text text-lg mb-4">
            {t("unit.referenceTitle")}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allConversions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-black/5 bg-white hover:border-black/15 transition-colors"
              >
                <span className="font-body text-sm text-text/70">
                  {item.label}
                </span>
                <span className="font-body text-sm font-bold text-text">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
