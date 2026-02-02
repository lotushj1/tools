"use client";

import { Wrench, User, Globe } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-12 border-t border-primary/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading text-lg font-bold text-text">
              Vibe Tools
            </span>
          </Link>

          {/* Copyright */}
          <p className="font-body text-sm text-text/60">
            © {new Date().getFullYear()} Vibe Coding Tools. {t("footer.madeWith")}{" "}
            <a
              href="https://creatorhome.tw/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Create Home
            </a>
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://kevinlearn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center"
              aria-label={t("footer.personalLink")}
              title={t("footer.personalLink")}
            >
              <User className="w-5 h-5 text-text/70" />
            </a>
            <a
              href="https://creatorhome.tw/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center"
              aria-label={t("footer.officialSite")}
              title={t("footer.officialSite")}
            >
              <Globe className="w-5 h-5 text-text/70" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
