"use client";

import { Wrench, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();

  const toggleLang = () => setLocale(locale === "zh" ? "en" : "zh");

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center border-2 border-black shadow-clay">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading text-xl font-bold text-text">
            Vibe Tools
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/tools"
            className="font-body font-medium text-text/80"
          >
            {t("header.allTools")}
          </Link>
          <Link
            href="#features"
            className="font-body font-medium text-text/80"
          >
            {t("header.features")}
          </Link>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black/10 bg-white font-body text-sm font-medium text-text/80 transition-all"
            aria-label="Switch language"
          >
            <Globe className="w-4 h-4" />
            {locale === "zh" ? "EN" : "中文"}
          </button>
          <button className="clay-button-primary">
            {t("header.explore")}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? t("header.closeMenu") : t("header.openMenu")}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-background border-b border-primary/10">
          <Link
            href="/tools"
            className="block py-2 font-body font-medium text-text/80"
          >
            {t("header.allTools")}
          </Link>
          <Link
            href="#features"
            className="block py-2 font-body font-medium text-text/80"
          >
            {t("header.features")}
          </Link>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 py-2 font-body font-medium text-text/80"
          >
            <Globe className="w-4 h-4" />
            {locale === "zh" ? "Switch to English" : "切換為中文"}
          </button>
          <button className="clay-button-primary w-full">
            {t("header.explore")}
          </button>
        </div>
      )}
    </header>
  );
}
