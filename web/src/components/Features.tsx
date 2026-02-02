"use client";

import { Zap, Target, Palette, Globe, LucideIcon } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const featureKeys: { icon: LucideIcon; titleKey: string; descKey: string }[] = [
  { icon: Zap, titleKey: "features.instant.title", descKey: "features.instant.desc" },
  { icon: Target, titleKey: "features.focus.title", descKey: "features.focus.desc" },
  { icon: Palette, titleKey: "features.design.title", descKey: "features.design.desc" },
  { icon: Globe, titleKey: "features.free.title", descKey: "features.free.desc" },
];

export default function Features() {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text mb-4">
            {t("features.title")}
          </h2>
          <p className="font-body text-text/70 max-w-xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureKeys.map((feature, index) => (
            <div key={index} className="text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-heading text-xl font-semibold text-text mb-3">
                {t(feature.titleKey)}
              </h3>
              <p className="font-body text-text/70 text-sm leading-relaxed">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
