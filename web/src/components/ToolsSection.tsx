"use client";

import { QrCode, Type, Gift, Circle, Timer, Hourglass, LucideIcon } from "lucide-react";
import ToolCard from "./ToolCard";
import { useLanguage } from "@/i18n/LanguageContext";

const tools: { titleKey: string; descKey: string; icon: LucideIcon; href: string }[] = [
  {
    titleKey: "tool.qr.title",
    descKey: "tool.qr.desc",
    icon: QrCode,
    href: "/tools/qr-generator",
  },
  {
    titleKey: "tool.text.title",
    descKey: "tool.text.desc",
    icon: Type,
    href: "/tools/text-processor",
  },
  {
    titleKey: "tool.lottery.title",
    descKey: "tool.lottery.desc",
    icon: Gift,
    href: "/tools/lottery",
  },
  {
    titleKey: "tool.wheel.title",
    descKey: "tool.wheel.desc",
    icon: Circle,
    href: "/tools/spin-wheel",
  },
  {
    titleKey: "tool.pomodoro.title",
    descKey: "tool.pomodoro.desc",
    icon: Timer,
    href: "/tools/pomodoro",
  },
  {
    titleKey: "tool.countdown.title",
    descKey: "tool.countdown.desc",
    icon: Hourglass,
    href: "/tools/countdown",
  },
];

export default function ToolsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-accent-light/30">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text mb-4">
            {t("tools.sectionTitle")}
          </h2>
          <p className="font-body text-text/70 max-w-xl mx-auto">
            {t("tools.sectionSubtitle")}
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {tools.map((tool) => (
            <ToolCard
              key={tool.href}
              title={t(tool.titleKey)}
              description={t(tool.descKey)}
              icon={tool.icon}
              href={tool.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
