"use client";

import { Wrench, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center border-2 border-gray-800 shadow-clay">
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
            所有工具
          </Link>
          <Link
            href="#features"
            className="font-body font-medium text-text/80"
          >
            功能特色
          </Link>
          <button className="clay-button-primary">
            開始探索
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "關閉選單" : "開啟選單"}
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
            所有工具
          </Link>
          <Link
            href="#features"
            className="block py-2 font-body font-medium text-text/80"
          >
            功能特色
          </Link>
          <button className="clay-button-primary w-full">
            開始探索
          </button>
        </div>
      )}
    </header>
  );
}
