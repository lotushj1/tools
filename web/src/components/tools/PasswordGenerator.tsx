"use client";

import { useState, useCallback } from "react";
import { KeyRound, Copy, Check, RefreshCw, Shield, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

// ─── Types ───────────────────────────────────────────────
interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

// ─── Character sets ──────────────────────────────────────
const CHARS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  uppercaseSafe: "ABCDEFGHJKLMNPQRSTUVWXYZ", // no I, O
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  lowercaseSafe: "abcdefghjkmnpqrstuvwxyz", // no i, l, o
  numbers: "0123456789",
  numbersSafe: "23456789", // no 0, 1
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

// ─── Password strength ──────────────────────────────────
function getStrength(
  password: string,
  opts: PasswordOptions
): { level: number; labelKey: string; color: string } {
  let poolSize = 0;
  if (opts.uppercase) poolSize += 26;
  if (opts.lowercase) poolSize += 26;
  if (opts.numbers) poolSize += 10;
  if (opts.symbols) poolSize += 27;

  const entropy = password.length * Math.log2(poolSize || 1);

  if (entropy < 28) return { level: 0, labelKey: "pwd.strengthWeak", color: "bg-red-500" };
  if (entropy < 36) return { level: 1, labelKey: "pwd.strengthFair", color: "bg-orange-500" };
  if (entropy < 60) return { level: 2, labelKey: "pwd.strengthGood", color: "bg-yellow-500" };
  if (entropy < 80) return { level: 3, labelKey: "pwd.strengthStrong", color: "bg-green-500" };
  return { level: 4, labelKey: "pwd.strengthVeryStrong", color: "bg-emerald-600" };
}

// ─── Generate password ───────────────────────────────────
function generatePassword(opts: PasswordOptions): string {
  let pool = "";
  const required: string[] = [];

  if (opts.uppercase) {
    const set = opts.excludeAmbiguous ? CHARS.uppercaseSafe : CHARS.uppercase;
    pool += set;
    required.push(set);
  }
  if (opts.lowercase) {
    const set = opts.excludeAmbiguous ? CHARS.lowercaseSafe : CHARS.lowercase;
    pool += set;
    required.push(set);
  }
  if (opts.numbers) {
    const set = opts.excludeAmbiguous ? CHARS.numbersSafe : CHARS.numbers;
    pool += set;
    required.push(set);
  }
  if (opts.symbols) {
    pool += CHARS.symbols;
    required.push(CHARS.symbols);
  }

  if (pool.length === 0) return "";

  const arr = new Uint32Array(opts.length);
  crypto.getRandomValues(arr);

  // Ensure at least one char from each required set
  const chars: string[] = [];
  for (let i = 0; i < required.length && i < opts.length; i++) {
    const set = required[i];
    chars.push(set[arr[i] % set.length]);
  }

  // Fill rest from full pool
  for (let i = chars.length; i < opts.length; i++) {
    chars.push(pool[arr[i] % pool.length]);
  }

  // Shuffle (Fisher-Yates)
  const shuffleArr = new Uint32Array(chars.length);
  crypto.getRandomValues(shuffleArr);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = shuffleArr[i] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}

// ─── Main Component ──────────────────────────────────────
export default function PasswordGenerator() {
  const { t } = useLanguage();

  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });

  const [password, setPassword] = useState(() => generatePassword({
    length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: false,
  }));
  const [copied, setCopied] = useState(false);
  const [batchPasswords, setBatchPasswords] = useState<string[]>([]);
  const [batchCopied, setBatchCopied] = useState<number | null>(null);

  const strength = getStrength(password, options);

  const handleGenerate = useCallback(() => {
    const pwd = generatePassword(options);
    setPassword(pwd);
    setCopied(false);
  }, [options]);

  const handleOptionChange = useCallback(
    (key: keyof PasswordOptions, value: number | boolean) => {
      const newOpts = { ...options, [key]: value };
      // Ensure at least one charset is selected
      if (!newOpts.uppercase && !newOpts.lowercase && !newOpts.numbers && !newOpts.symbols) {
        return;
      }
      setOptions(newOpts);
      setPassword(generatePassword(newOpts));
      setCopied(false);
    },
    [options]
  );

  const copyToClipboard = useCallback(async (text: string, onDone: () => void) => {
    try {
      await navigator.clipboard.writeText(text);
      onDone();
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      onDone();
    }
  }, []);

  const handleCopy = useCallback(() => {
    copyToClipboard(password, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [password, copyToClipboard]);

  const handleBatchGenerate = useCallback(
    (count: number) => {
      const passwords: string[] = [];
      for (let i = 0; i < count; i++) {
        passwords.push(generatePassword(options));
      }
      setBatchPasswords(passwords);
      setBatchCopied(null);
    },
    [options]
  );

  const handleBatchCopy = useCallback(
    (index: number) => {
      copyToClipboard(batchPasswords[index], () => {
        setBatchCopied(index);
        setTimeout(() => setBatchCopied(null), 2000);
      });
    },
    [batchPasswords, copyToClipboard]
  );

  const handleCopyAll = useCallback(() => {
    copyToClipboard(batchPasswords.join("\n"), () => {
      setBatchCopied(-1);
      setTimeout(() => setBatchCopied(null), 2000);
    });
  }, [batchPasswords, copyToClipboard]);

  // Color each character by type
  const renderPassword = (pwd: string) =>
    pwd.split("").map((ch, i) => {
      let color = "text-text";
      if (/[A-Z]/.test(ch)) color = "text-blue-600";
      else if (/[a-z]/.test(ch)) color = "text-text";
      else if (/[0-9]/.test(ch)) color = "text-orange-600";
      else color = "text-pink-600";
      return (
        <span key={i} className={color}>
          {ch}
        </span>
      );
    });

  return (
    <div className="space-y-6">
      {/* ── Generated Password ── */}
      <div className="clay-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <KeyRound className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-text text-lg">
            {t("pwd.resultTitle")}
          </span>
        </div>

        {/* Password display */}
        <div className="relative bg-gray-50 rounded-xl border-2 border-black/10 p-4 mb-4">
          <div className="font-mono text-lg sm:text-xl font-bold break-all leading-relaxed pr-20">
            {renderPassword(password)}
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              onClick={handleGenerate}
              className="p-2.5 rounded-xl border-2 border-black/10 bg-white text-text/60 hover:border-primary hover:text-primary transition-all"
              title={t("pwd.regenerate")}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className={`p-2.5 rounded-xl border-2 transition-all ${
                copied
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-black/10 bg-white text-text/60 hover:border-primary hover:text-primary"
              }`}
              title={copied ? t("pwd.copied") : t("pwd.copy")}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Strength bar */}
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-text/40" />
          <div className="flex gap-1 flex-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all ${
                  i <= strength.level ? strength.color : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="font-body text-sm text-text/70 min-w-[60px] text-right">
            {t(strength.labelKey)}
          </span>
        </div>
      </div>

      {/* ── Settings ── */}
      <div className="clay-card p-6">
        <div className="font-heading font-bold text-text text-lg mb-5">
          {t("pwd.settingsTitle")}
        </div>

        {/* Length slider */}
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <label className="font-body text-sm text-text/70">
              {t("pwd.lengthLabel")}
            </label>
            <span className="font-body text-sm font-bold text-primary">
              {options.length}
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={64}
            step={1}
            value={options.length}
            onChange={(e) => handleOptionChange("length", Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between font-body text-xs text-text/40 mt-1">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        {/* Character options */}
        <div className="space-y-3">
          {[
            { key: "uppercase" as const, labelKey: "pwd.uppercase", hint: "A-Z" },
            { key: "lowercase" as const, labelKey: "pwd.lowercase", hint: "a-z" },
            { key: "numbers" as const, labelKey: "pwd.numbers", hint: "0-9" },
            { key: "symbols" as const, labelKey: "pwd.symbols", hint: "!@#$%..." },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-black/5 bg-white hover:border-black/15 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="font-body text-sm text-text">
                  {t(item.labelKey)}
                </span>
                <span className="font-mono text-xs text-text/40">{item.hint}</span>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  handleOptionChange(item.key, !options[item.key]);
                }}
                className={`w-10 h-6 rounded-full transition-all relative cursor-pointer ${
                  options[item.key] ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    options[item.key] ? "left-5" : "left-1"
                  }`}
                />
              </div>
            </label>
          ))}

          {/* Exclude ambiguous */}
          <label className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-black/5 bg-white hover:border-black/15 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="font-body text-sm text-text">
                {t("pwd.excludeAmbiguous")}
              </span>
              <span className="font-mono text-xs text-text/40">0OoIl1</span>
            </div>
            <div
              onClick={(e) => {
                e.preventDefault();
                handleOptionChange("excludeAmbiguous", !options.excludeAmbiguous);
              }}
              className={`w-10 h-6 rounded-full transition-all relative cursor-pointer ${
                options.excludeAmbiguous ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                  options.excludeAmbiguous ? "left-5" : "left-1"
                }`}
              />
            </div>
          </label>
        </div>
      </div>

      {/* ── Batch Generate ── */}
      <div className="clay-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-text text-lg">
            {t("pwd.batchTitle")}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {[5, 10, 20].map((count) => (
            <button
              key={count}
              onClick={() => handleBatchGenerate(count)}
              className="px-4 py-2 rounded-xl border-2 border-black bg-white text-text font-body text-sm font-bold shadow-[2px_2px_0_black] hover:shadow-[3px_3px_0_black] hover:-translate-y-0.5 transition-all active:shadow-none active:translate-y-0"
            >
              {t("pwd.generate")} {count} {t("pwd.unit")}
            </button>
          ))}
        </div>

        {batchPasswords.length > 0 && (
          <>
            <div className="flex justify-end mb-2">
              <button
                onClick={handleCopyAll}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all ${
                  batchCopied === -1
                    ? "bg-green-500 text-white"
                    : "bg-white text-text border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {batchCopied === -1 ? (
                  <>
                    <Check className="w-3 h-3" /> {t("pwd.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> {t("pwd.copyAll")}
                  </>
                )}
              </button>
            </div>
            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {batchPasswords.map((pwd, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-black/5 bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <code className="font-mono text-sm break-all flex-1 mr-2">
                    {renderPassword(pwd)}
                  </code>
                  <button
                    onClick={() => handleBatchCopy(i)}
                    className={`flex-shrink-0 p-1.5 rounded-lg transition-all ${
                      batchCopied === i
                        ? "bg-green-500 text-white"
                        : "text-text/30 hover:text-primary opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {batchCopied === i ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setBatchPasswords([])}
              className="mt-3 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-body text-text/50 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              {t("pwd.clearBatch")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
