"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

// ─── Theme presets (must match CountdownTimer.tsx) ────────
const themes: Record<string, {
  cardBg: string; digitBg: string; digitText: string;
  labelText: string; titleText: string; border: string;
  shadow: string; accent: string;
}> = {
  orange: {
    cardBg: "#FFFBF5", digitBg: "#FFF7ED", digitText: "#EA580C",
    labelText: "#9A3412", titleText: "#9A3412", border: "#000000",
    shadow: "#000000", accent: "#F97316",
  },
  dark: {
    cardBg: "#1E1E2E", digitBg: "#2A2A3E", digitText: "#FFFFFF",
    labelText: "#A0A0B8", titleText: "#FFFFFF", border: "#3A3A50",
    shadow: "#000000", accent: "#818CF8",
  },
  blue: {
    cardBg: "#F0F7FF", digitBg: "#DBEAFE", digitText: "#1D4ED8",
    labelText: "#3B82F6", titleText: "#1E40AF", border: "#000000",
    shadow: "#000000", accent: "#3B82F6",
  },
  pink: {
    cardBg: "#FFF5F7", digitBg: "#FFE4EC", digitText: "#DB2777",
    labelText: "#EC4899", titleText: "#BE185D", border: "#000000",
    shadow: "#000000", accent: "#EC4899",
  },
  green: {
    cardBg: "#F0FDF4", digitBg: "#DCFCE7", digitText: "#16A34A",
    labelText: "#22C55E", titleText: "#166534", border: "#000000",
    shadow: "#000000", accent: "#22C55E",
  },
  minimal: {
    cardBg: "#FFFFFF", digitBg: "#F3F4F6", digitText: "#111827",
    labelText: "#6B7280", titleText: "#111827", border: "#000000",
    shadow: "#000000", accent: "#6B7280",
  },
};

const sizeConfigs: Record<string, {
  digit: number; label: number; title: number; gap: number;
  padding: number; blockPad: string; radius: number;
}> = {
  sm: { digit: 28, label: 10, title: 13, gap: 8, padding: 16, blockPad: "8px 12px", radius: 12 },
  md: { digit: 40, label: 12, title: 16, gap: 12, padding: 24, blockPad: "12px 18px", radius: 16 },
  lg: { digit: 56, label: 14, title: 20, gap: 16, padding: 32, blockPad: "16px 24px", radius: 20 },
};

function pad(n: number): string {
  return n < 10 ? "0" + n : "" + n;
}

function CountdownEmbed() {
  const searchParams = useSearchParams();

  const targetDate = searchParams.get("date") || "";
  const title = searchParams.get("title") || "";
  const expiredText = searchParams.get("expired") || "活動已結束";
  const themeId = searchParams.get("theme") || "orange";
  const sizeId = searchParams.get("size") || "md";
  const showDays = searchParams.get("d") !== "0";
  const showHours = searchParams.get("h") !== "0";
  const showMinutes = searchParams.get("m") !== "0";
  const showSeconds = searchParams.get("s") !== "0";

  const theme = themes[themeId] || themes.orange;
  const s = sizeConfigs[sizeId] || sizeConfigs.md;

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    function calc() {
      const target = new Date(targetDate).getTime();
      const diff = target - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        expired: false,
      };
    }
    setCountdown(calc());
    const timer = setInterval(() => setCountdown(calc()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units: { key: string; label: string; value: number; show: boolean }[] = [
    { key: "d", label: "天", value: countdown.days, show: showDays },
    { key: "h", label: "時", value: countdown.hours, show: showHours },
    { key: "m", label: "分", value: countdown.minutes, show: showMinutes },
    { key: "s", label: "秒", value: countdown.seconds, show: showSeconds },
  ];

  const visibleUnits = units.filter((u) => u.show);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        padding: "8px",
      }}
    >
      <div
        style={{
          background: theme.cardBg,
          border: `3px solid ${theme.border}`,
          borderRadius: `${s.radius}px`,
          padding: `${s.padding}px`,
          textAlign: "center",
          boxShadow: `4px 4px 0 ${theme.shadow}`,
          display: "inline-block",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {title && (
          <div
            style={{
              fontSize: `${s.title}px`,
              fontWeight: 700,
              color: theme.titleText,
              marginBottom: `${s.gap + 4}px`,
              fontFamily: "'Fredoka', system-ui, sans-serif",
            }}
          >
            {title}
          </div>
        )}

        {countdown.expired ? (
          <div
            style={{
              fontSize: `${s.title}px`,
              fontWeight: 700,
              color: theme.accent,
              padding: `${s.padding}px`,
              fontFamily: "'Fredoka', system-ui, sans-serif",
            }}
          >
            {expiredText}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: `${s.gap}px`,
            }}
          >
            {visibleUnits.map((unit, i) => (
              <div key={unit.key} style={{ display: "flex", alignItems: "flex-start", gap: `${s.gap}px` }}>
                <div
                  style={{
                    background: theme.digitBg,
                    border: `2px solid ${theme.border}`,
                    borderRadius: `${s.radius - 4}px`,
                    padding: s.blockPad,
                    textAlign: "center",
                    minWidth: `${s.digit + 20}px`,
                    boxShadow: `3px 3px 0 ${theme.shadow}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: `${s.digit}px`,
                      fontWeight: 800,
                      color: theme.digitText,
                      lineHeight: 1.2,
                      fontFamily: "'Fredoka', system-ui, sans-serif",
                    }}
                  >
                    {unit.key === "d" ? unit.value : pad(unit.value)}
                  </div>
                  <div
                    style={{
                      fontSize: `${s.label}px`,
                      color: theme.labelText,
                      marginTop: "4px",
                      fontFamily: "'Nunito', system-ui, sans-serif",
                    }}
                  >
                    {unit.label}
                  </div>
                </div>
                {i < visibleUnits.length - 1 && (
                  <div
                    style={{
                      fontSize: `${s.digit * 0.7}px`,
                      fontWeight: 800,
                      color: theme.digitText,
                      alignSelf: "center",
                      paddingBottom: `${s.label + 8}px`,
                      fontFamily: "'Fredoka', system-ui, sans-serif",
                    }}
                  >
                    :
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            marginTop: `${s.gap + 4}px`,
            fontSize: "10px",
            color: theme.labelText,
            opacity: 0.6,
            fontFamily: "'Nunito', system-ui, sans-serif",
          }}
        >
          <a
            href="https://lotushj1.github.io/tools"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Made with Vibe Tools
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CountdownEmbedPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#999", fontFamily: "system-ui" }}>Loading...</span>
        </div>
      }
    >
      <CountdownEmbed />
    </Suspense>
  );
}
