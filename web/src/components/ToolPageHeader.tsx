"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

// Map slug → translation keys
const slugToKeys: Record<string, { titleKey: string; descKey: string }> = {
  "qr-generator": { titleKey: "tool.qr.title", descKey: "tool.qr.desc" },
  "text-processor": { titleKey: "tool.text.title", descKey: "tool.text.desc" },
  lottery: { titleKey: "tool.lottery.title", descKey: "tool.lottery.desc" },
  "spin-wheel": { titleKey: "tool.wheel.title", descKey: "tool.wheel.desc" },
  pomodoro: { titleKey: "tool.pomodoro.title", descKey: "tool.pomodoro.desc" },
  countdown: { titleKey: "tool.countdown.title", descKey: "tool.countdown.desc" },
};

export default function ToolPageHeader({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const keys = slugToKeys[slug];

  return (
    <>
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-text/70 hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-body">{t("toolPage.backHome")}</span>
      </Link>

      {/* Tool Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-text mb-3">
          {keys ? t(keys.titleKey) : slug}
        </h1>
        <p className="font-body text-lg text-text/70">
          {keys ? t(keys.descKey) : ""}
        </p>
      </div>
    </>
  );
}
