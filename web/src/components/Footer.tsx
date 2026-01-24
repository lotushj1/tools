import { Wrench, Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-primary/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading text-lg font-bold text-text">
              Vibe Tools
            </span>
          </Link>

          {/* Copyright */}
          <p className="font-body text-sm text-text/60">
            © {new Date().getFullYear()} Vibe Coding Tools. Made with ❤️
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-text/70" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 text-text/70" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
