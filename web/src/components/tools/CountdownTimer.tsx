"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Calendar,
  Palette,
  Copy,
  Check,
  Code,
  Eye,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

// ─── Types ───────────────────────────────────────────────
interface ThemeOption {
  id: string;
  nameKey: string;
  bg: string;
  cardBg: string;
  digitBg: string;
  digitText: string;
  labelText: string;
  titleText: string;
  border: string;
  shadow: string;
  accent: string;
}

type EmbedTab = "iframe" | "html";
type SizeOption = "sm" | "md" | "lg";

// ─── Theme presets ───────────────────────────────────────
const themes: ThemeOption[] = [
  {
    id: "orange",
    nameKey: "countdown.themeOrange",
    bg: "transparent",
    cardBg: "#FFFBF5",
    digitBg: "#FFF7ED",
    digitText: "#EA580C",
    labelText: "#9A3412",
    titleText: "#9A3412",
    border: "#000000",
    shadow: "#000000",
    accent: "#F97316",
  },
  {
    id: "dark",
    nameKey: "countdown.themeDark",
    bg: "transparent",
    cardBg: "#1E1E2E",
    digitBg: "#2A2A3E",
    digitText: "#FFFFFF",
    labelText: "#A0A0B8",
    titleText: "#FFFFFF",
    border: "#3A3A50",
    shadow: "#000000",
    accent: "#818CF8",
  },
  {
    id: "blue",
    nameKey: "countdown.themeBlue",
    bg: "transparent",
    cardBg: "#F0F7FF",
    digitBg: "#DBEAFE",
    digitText: "#1D4ED8",
    labelText: "#3B82F6",
    titleText: "#1E40AF",
    border: "#000000",
    shadow: "#000000",
    accent: "#3B82F6",
  },
  {
    id: "pink",
    nameKey: "countdown.themePink",
    bg: "transparent",
    cardBg: "#FFF5F7",
    digitBg: "#FFE4EC",
    digitText: "#DB2777",
    labelText: "#EC4899",
    titleText: "#BE185D",
    border: "#000000",
    shadow: "#000000",
    accent: "#EC4899",
  },
  {
    id: "green",
    nameKey: "countdown.themeGreen",
    bg: "transparent",
    cardBg: "#F0FDF4",
    digitBg: "#DCFCE7",
    digitText: "#16A34A",
    labelText: "#22C55E",
    titleText: "#166534",
    border: "#000000",
    shadow: "#000000",
    accent: "#22C55E",
  },
  {
    id: "minimal",
    nameKey: "countdown.themeMinimal",
    bg: "transparent",
    cardBg: "#FFFFFF",
    digitBg: "#F3F4F6",
    digitText: "#111827",
    labelText: "#6B7280",
    titleText: "#111827",
    border: "#000000",
    shadow: "#000000",
    accent: "#6B7280",
  },
];

const sizeConfigs: Record<SizeOption, { digit: number; label: number; title: number; gap: number; padding: number; blockPad: string; radius: number }> = {
  sm: { digit: 28, label: 10, title: 13, gap: 8, padding: 16, blockPad: "8px 12px", radius: 12 },
  md: { digit: 40, label: 12, title: 16, gap: 12, padding: 24, blockPad: "12px 18px", radius: 16 },
  lg: { digit: 56, label: 14, title: 20, gap: 16, padding: 32, blockPad: "16px 24px", radius: 20 },
};

// ─── Helper: generate countdown values ───────────────────
function getCountdown(targetDate: string) {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return { days, hours, minutes, seconds, expired: false };
}

// ─── Helper: pad number ──────────────────────────────────
function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

// ─── Helper: generate random ID ──────────────────────────
function randomId(): string {
  return Math.random().toString(36).substring(2, 8);
}

// ─── Generate pure HTML embed snippet ────────────────────
function generateHtmlSnippet(
  title: string,
  targetDate: string,
  expiredText: string,
  theme: ThemeOption,
  size: SizeOption,
  showDays: boolean,
  showHours: boolean,
  showMinutes: boolean,
  showSeconds: boolean
): string {
  const id = randomId();
  const s = sizeConfigs[size];
  const siteUrl = "https://lotushj1.github.io/tools";

  const units: { key: string; label: string; show: boolean }[] = [
    { key: "d", label: "天", show: showDays },
    { key: "h", label: "時", show: showHours },
    { key: "m", label: "分", show: showMinutes },
    { key: "s", label: "秒", show: showSeconds },
  ];

  const visibleUnits = units.filter((u) => u.show);

  const blocksHtml = visibleUnits
    .map(
      (u) =>
        `<div style="background:${theme.digitBg};border:2px solid ${theme.border};border-radius:${s.radius - 4}px;padding:${s.blockPad};text-align:center;min-width:${s.digit + 20}px;box-shadow:3px 3px 0 ${theme.shadow}">` +
        `<div id="cd${u.key}${id}" style="font-size:${s.digit}px;font-weight:800;color:${theme.digitText};line-height:1.2;font-family:'Fredoka',system-ui,sans-serif">00</div>` +
        `<div style="font-size:${s.label}px;color:${theme.labelText};margin-top:4px;font-family:'Nunito',system-ui,sans-serif">${u.label}</div>` +
        `</div>`
    )
    .join("\n    ");

  const separatorsHtml = visibleUnits
    .slice(0, -1)
    .map(
      () =>
        `<div style="font-size:${s.digit * 0.7}px;font-weight:800;color:${theme.digitText};align-self:center;padding-bottom:${s.label + 8}px;font-family:'Fredoka',system-ui,sans-serif">:</div>`
    )
    .join("\n    ");

  // Interleave blocks and separators
  const interleaved: string[] = [];
  visibleUnits.forEach((u, i) => {
    interleaved.push(
      `<div style="background:${theme.digitBg};border:2px solid ${theme.border};border-radius:${s.radius - 4}px;padding:${s.blockPad};text-align:center;min-width:${s.digit + 20}px;box-shadow:3px 3px 0 ${theme.shadow}">` +
        `<div id="cd${u.key}${id}" style="font-size:${s.digit}px;font-weight:800;color:${theme.digitText};line-height:1.2;font-family:'Fredoka',system-ui,sans-serif">00</div>` +
        `<div style="font-size:${s.label}px;color:${theme.labelText};margin-top:4px;font-family:'Nunito',system-ui,sans-serif">${u.label}</div>` +
        `</div>`
    );
    if (i < visibleUnits.length - 1) {
      interleaved.push(
        `<div style="font-size:${s.digit * 0.7}px;font-weight:800;color:${theme.digitText};align-self:center;padding-bottom:${s.label + 8}px;font-family:'Fredoka',system-ui,sans-serif">:</div>`
      );
    }
  });

  const unitKeys = visibleUnits.map((u) => `"${u.key}"`).join(",");

  return `<!-- Countdown Timer - Made with Vibe Tools -->
<div id="ct${id}" style="background:${theme.cardBg};border:3px solid ${theme.border};border-radius:${s.radius}px;padding:${s.padding}px;text-align:center;box-shadow:4px 4px 0 ${theme.shadow};display:inline-block;font-family:system-ui,sans-serif">
  ${title ? `<div style="font-size:${s.title}px;font-weight:700;color:${theme.titleText};margin-bottom:${s.gap + 4}px;font-family:'Fredoka',system-ui,sans-serif">${title}</div>` : ""}
  <div id="ctb${id}" style="display:flex;align-items:flex-start;justify-content:center;gap:${s.gap}px">
    ${interleaved.join("\n    ")}
  </div>
  <div style="margin-top:${s.gap + 4}px;font-size:10px;color:${theme.labelText};opacity:0.6;font-family:'Nunito',system-ui,sans-serif">
    <a href="${siteUrl}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">Made with Vibe Tools</a>
  </div>
</div>
<script>
(function(){
  var T=new Date("${targetDate}").getTime(),E="${expiredText}",U=[${unitKeys}],I="${id}";
  function p(n){return n<10?"0"+n:""+n}
  function u(){
    var d=T-Date.now();
    if(d<=0){
      var b=document.getElementById("ctb"+I);
      if(b)b.innerHTML='<div style="font-size:${s.title}px;font-weight:700;color:${theme.accent};padding:${s.padding}px;font-family:Fredoka,system-ui,sans-serif">'+E+'</div>';
      return;
    }
    var D=Math.floor(d/864e5),H=Math.floor(d%864e5/36e5),M=Math.floor(d%36e5/6e4),S=Math.floor(d%6e4/1e3);
    var v={d:D,h:H,m:M,s:S};
    U.forEach(function(k){var e=document.getElementById("cd"+k+I);if(e)e.textContent=k==="d"?(""+v[k]):p(v[k])});
  }
  u();setInterval(u,1000);
})();
</script>`;
}

// ─── Main Component ──────────────────────────────────────
export default function CountdownTimer() {
  const { t } = useLanguage();

  // Settings
  const [title, setTitle] = useState("早鳥優惠倒數");
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(23, 59, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [expiredText, setExpiredText] = useState("活動已結束");
  const [selectedTheme, setSelectedTheme] = useState("orange");
  const [size, setSize] = useState<SizeOption>("md");
  const [showDays, setShowDays] = useState(true);
  const [showHours, setShowHours] = useState(true);
  const [showMinutes, setShowMinutes] = useState(true);
  const [showSeconds, setShowSeconds] = useState(true);

  // UI state
  const [embedTab, setEmbedTab] = useState<EmbedTab>("html");
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(getCountdown(targetDate));
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const theme = themes.find((th) => th.id === selectedTheme) || themes[0];
  const s = sizeConfigs[size];

  // Live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Generate embed code
  const getEmbedCode = useCallback((): string => {
    if (embedTab === "html") {
      return generateHtmlSnippet(
        title,
        targetDate,
        expiredText,
        theme,
        size,
        showDays,
        showHours,
        showMinutes,
        showSeconds
      );
    }

    // iframe
    const params = new URLSearchParams({
      date: targetDate,
      title: title,
      expired: expiredText,
      theme: selectedTheme,
      size: size,
      d: showDays ? "1" : "0",
      h: showHours ? "1" : "0",
      m: showMinutes ? "1" : "0",
      s: showSeconds ? "1" : "0",
    });

    const siteUrl = "https://lotushj1.github.io/tools";
    const iframeHeight = size === "sm" ? 140 : size === "md" ? 190 : 240;

    return `<iframe src="${siteUrl}/tools/countdown-embed?${params.toString()}" style="border:none;width:100%;max-width:500px;height:${iframeHeight}px" title="Countdown Timer"></iframe>`;
  }, [embedTab, title, targetDate, expiredText, theme, selectedTheme, size, showDays, showHours, showMinutes, showSeconds]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getEmbedCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = getEmbedCode();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Preview units
  const visibleUnits: { key: string; label: string; value: number }[] = [];
  if (showDays) visibleUnits.push({ key: "d", label: t("countdown.days"), value: countdown.days });
  if (showHours) visibleUnits.push({ key: "h", label: t("countdown.hours"), value: countdown.hours });
  if (showMinutes) visibleUnits.push({ key: "m", label: t("countdown.minutes"), value: countdown.minutes });
  if (showSeconds) visibleUnits.push({ key: "s", label: t("countdown.seconds"), value: countdown.seconds });

  return (
    <div className="space-y-6">
      {/* ── Settings ── */}
      <div className="clay-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-text text-lg">{t("countdown.basicSettings")}</span>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block font-body text-sm text-text/70 mb-1.5">
              {t("countdown.titleLabel")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("countdown.titlePlaceholder")}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-black/10 bg-white font-body text-text focus:outline-none focus:border-primary"
            />
          </div>

          {/* Target date */}
          <div>
            <label className="block font-body text-sm text-text/70 mb-1.5">
              {t("countdown.dateLabel")}
            </label>
            <input
              type="datetime-local"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-black/10 bg-white font-body text-text focus:outline-none focus:border-primary"
            />
          </div>

          {/* Expired text */}
          <div>
            <label className="block font-body text-sm text-text/70 mb-1.5">
              {t("countdown.expiredLabel")}
            </label>
            <input
              type="text"
              value={expiredText}
              onChange={(e) => setExpiredText(e.target.value)}
              placeholder={t("countdown.expiredPlaceholder")}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-black/10 bg-white font-body text-text focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* ── Appearance ── */}
      <div className="clay-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Palette className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-text text-lg">{t("countdown.appearanceSettings")}</span>
        </div>

        {/* Theme selector */}
        <div className="mb-4">
          <label className="block font-body text-sm text-text/70 mb-2">{t("countdown.themeLabel")}</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {themes.map((th) => (
              <button
                key={th.id}
                onClick={() => setSelectedTheme(th.id)}
                className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${
                  selectedTheme === th.id
                    ? "border-black bg-primary/5"
                    : "border-black/10 bg-white"
                }`}
              >
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ background: th.digitBg }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ background: th.accent }}
                  />
                </div>
                <span className="font-body text-xs text-text/70">{t(th.nameKey)}</span>
                {selectedTheme === th.id && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mb-4">
          <label className="block font-body text-sm text-text/70 mb-2">{t("countdown.sizeLabel")}</label>
          <div className="flex gap-2">
            {(["sm", "md", "lg"] as SizeOption[]).map((opt) => (
              <button
                key={opt}
                onClick={() => setSize(opt)}
                className={`px-4 py-2 rounded-xl border-2 font-body text-sm transition-all ${
                  size === opt
                    ? "border-black bg-primary/10 text-primary font-bold"
                    : "border-black/10 bg-white text-text/70"
                }`}
              >
                {opt === "sm" ? t("countdown.sizeSmall") : opt === "md" ? t("countdown.sizeMedium") : t("countdown.sizeLarge")}
              </button>
            ))}
          </div>
        </div>

        {/* Display toggles */}
        <div>
          <label className="block font-body text-sm text-text/70 mb-2">{t("countdown.displayLabel")}</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: t("countdown.days"), state: showDays, setter: setShowDays },
              { label: t("countdown.hours"), state: showHours, setter: setShowHours },
              { label: t("countdown.minutes"), state: showMinutes, setter: setShowMinutes },
              { label: t("countdown.seconds"), state: showSeconds, setter: setShowSeconds },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => item.setter(!item.state)}
                className={`px-4 py-2 rounded-xl border-2 font-body text-sm transition-all ${
                  item.state
                    ? "border-black bg-primary/10 text-primary font-bold"
                    : "border-black/10 bg-white text-text/40 line-through"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Live Preview ── */}
      <div className="clay-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Eye className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-text text-lg">{t("countdown.preview")}</span>
        </div>

        <div className="flex justify-center py-6 bg-gray-50 rounded-xl border-2 border-black/10">
          {/* Preview card */}
          <div
            style={{
              background: theme.cardBg,
              border: `3px solid ${theme.border}`,
              borderRadius: `${s.radius}px`,
              padding: `${s.padding}px`,
              textAlign: "center",
              boxShadow: `4px 4px 0 ${theme.shadow}`,
              display: "inline-block",
            }}
          >
            {/* Title */}
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

            {/* Countdown digits */}
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

                    {/* Separator */}
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

            {/* Watermark */}
            <div
              style={{
                marginTop: `${s.gap + 4}px`,
                fontSize: "10px",
                color: theme.labelText,
                opacity: 0.6,
                fontFamily: "'Nunito', system-ui, sans-serif",
              }}
            >
              Made with Vibe Tools
            </div>
          </div>
        </div>
      </div>

      {/* ── Embed Code ── */}
      <div className="clay-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Code className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-text text-lg">{t("countdown.embedTitle")}</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setEmbedTab("html")}
            className={`flex-1 px-4 py-2.5 rounded-xl border-2 font-body text-sm transition-all ${
              embedTab === "html"
                ? "border-black bg-primary/10 text-primary font-bold"
                : "border-black/10 bg-white text-text/70"
            }`}
          >
            {t("countdown.tabHtml")}
          </button>
          <button
            onClick={() => setEmbedTab("iframe")}
            className={`flex-1 px-4 py-2.5 rounded-xl border-2 font-body text-sm transition-all ${
              embedTab === "iframe"
                ? "border-black bg-primary/10 text-primary font-bold"
                : "border-black/10 bg-white text-text/70"
            }`}
          >
            {t("countdown.tabIframe")}
          </button>
        </div>

        {/* Hint */}
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-body ${
          embedTab === "html"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-blue-50 text-blue-700 border border-blue-200"
        }`}>
          {embedTab === "html" ? (
            <>{t("countdown.hintHtml")}</>
          ) : (
            <>{t("countdown.hintIframe")}</>
          )}
        </div>

        {/* Code block */}
        <div className="relative">
          <pre className="p-4 bg-gray-900 text-gray-100 rounded-xl text-xs font-mono overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap break-all">
            {getEmbedCode()}
          </pre>
          <button
            onClick={copyToClipboard}
            className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all ${
              copied
                ? "bg-green-500 text-white"
                : "bg-white text-text border border-gray-300"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                {t("countdown.copied")}
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                {t("countdown.copy")}
              </>
            )}
          </button>
        </div>

        {/* Usage tips */}
        <div className="mt-4 p-4 bg-accent-light/30 rounded-xl">
          <p className="font-body text-sm font-bold text-text mb-2">{t("countdown.usageTitle")}</p>
          <ol className="space-y-1 font-body text-sm text-text/70 list-decimal list-inside">
            <li>{t("countdown.usage1")}</li>
            <li>{t("countdown.usage2")}</li>
            <li>{t("countdown.usage3")}</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
