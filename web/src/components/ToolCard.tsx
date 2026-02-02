"use client";

import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export default function ToolCard({
  title,
  description,
  icon: Icon,
  href,
}: ToolCardProps) {
  const { t } = useLanguage();

  return (
    <Link href={href} className="block">
      <article className="clay-card p-6 h-full flex flex-col">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 border-2 border-black shadow-clay">
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Content */}
        <h3 className="font-heading text-xl font-semibold text-text mb-2">
          {title}
        </h3>
        <p className="font-body text-text/70 text-sm flex-1 mb-4">
          {description}
        </p>

        {/* Action */}
        <div className="flex items-center gap-2 font-body font-medium text-primary">
          <span>{t("toolCard.useNow")}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </article>
    </Link>
  );
}
