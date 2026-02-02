"use client";

import { Rocket, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="clay-card p-10 md:p-16 text-center relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-6">
            <Rocket className="w-8 h-8 text-white" />
          </div>

          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text mb-4 text-balance">
            {t("cta.title")}
          </h2>

          <p className="font-body text-text/70 text-lg mb-8 max-w-xl mx-auto">
            {t("cta.subtitle")}
          </p>

          <button className="clay-button-primary text-lg px-10 py-4">
            {t("cta.button")}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
