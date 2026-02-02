"use client";

import { Sparkles, Rocket } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-24 h-24 bg-accent-gold/20 rounded-full blur-2xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-light border-2 border-primary/20 mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-body text-sm font-medium text-text">
            {t("hero.badge")}
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-text mb-6 text-balance">
          {t("hero.title1")}
          <span className="block mt-2 text-primary">
            {t("hero.title2")}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl font-body text-text/70 mb-10 max-w-2xl mx-auto text-balance">
          {t("hero.subtitle1")}
          <br className="hidden md:block" />
          {t("hero.subtitle2")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="clay-button-primary text-lg px-8 py-4">
            <Rocket className="w-5 h-5" />
            {t("hero.cta")}
          </button>
          <button className="clay-button bg-white/50 border-2 border-primary/20 text-text px-8 py-4">
            {t("hero.viewAll")}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="font-heading text-3xl font-bold text-primary">10+</div>
            <div className="font-body text-sm text-text/60">{t("hero.statTools")}</div>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl font-bold text-primary">Free</div>
            <div className="font-body text-sm text-text/60">{t("hero.statFree")}</div>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl font-bold text-primary">Fast</div>
            <div className="font-body text-sm text-text/60">{t("hero.statFast")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
