import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ToolsSection from "@/components/ToolsSection";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const siteUrl = "https://lotushj1.github.io/tools";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Vibe Tools",
  url: siteUrl,
  description:
    "免費實用線上小工具集：QR Code 產生器、文字處理、抽獎扭蛋機、幸運輪盤、番茄鐘、倒數計時器",
  creator: {
    "@type": "Organization",
    name: "Create Home",
    url: "https://creatorhome.tw",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <ToolsSection />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
