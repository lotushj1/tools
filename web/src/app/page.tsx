import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ToolsSection from "@/components/ToolsSection";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
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
