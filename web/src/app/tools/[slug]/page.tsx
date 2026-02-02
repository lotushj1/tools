import Link from "next/link";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolPageHeader from "@/components/ToolPageHeader";

// Dynamically import tool components (client-side only)
const QRCodeGenerator = dynamic(
  () => import("@/components/tools/QRCodeGenerator"),
  { ssr: false }
);

const TextProcessor = dynamic(
  () => import("@/components/tools/TextProcessor"),
  { ssr: false }
);

const LotteryMachine = dynamic(
  () => import("@/components/tools/LotteryMachine"),
  { ssr: false }
);

const SpinWheel = dynamic(
  () => import("@/components/tools/SpinWheel"),
  { ssr: false }
);

const PomodoroTimer = dynamic(
  () => import("@/components/tools/PomodoroTimer"),
  { ssr: false }
);

const CountdownTimer = dynamic(
  () => import("@/components/tools/CountdownTimer"),
  { ssr: false }
);

const siteUrl = "https://lotushj1.github.io/tools";

// Tool data with SEO-specific fields
const toolsData: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  "qr-generator": {
    title: "QR Code 產生器",
    description:
      "免費線上 QR Code 產生器，將任意文字或網址轉換為 QR Code，支援自訂顏色樣式與 PNG/SVG 下載",
    keywords: ["QR Code", "QR Code 產生器", "二維碼", "免費 QR Code"],
  },
  "text-processor": {
    title: "文字處理工具",
    description:
      "免費線上文字處理工具，字數計算、中英文自動加空格、行間加空白符號，一鍵完成社群貼文排版",
    keywords: ["文字處理", "字數計算", "中英加空格", "社群排版"],
  },
  lottery: {
    title: "抽獎扭蛋機",
    description:
      "免費線上抽獎工具，輸入名單或匯入 CSV，扭蛋機動畫隨機抽出幸運得獎者，公平公正",
    keywords: ["抽獎", "扭蛋機", "線上抽獎", "隨機抽選", "抽獎工具"],
  },
  "spin-wheel": {
    title: "幸運輪盤",
    description:
      "免費線上幸運輪盤，自訂輪盤選項，轉動輪盤隨機抽選，支援手動或自動停止",
    keywords: ["輪盤", "幸運輪盤", "轉盤抽獎", "隨機選擇"],
  },
  pomodoro: {
    title: "番茄鐘",
    description:
      "免費線上番茄鐘計時器，自訂專注與休息時間，搭配音效提醒，提升工作與學習效率",
    keywords: ["番茄鐘", "Pomodoro", "專注計時器", "時間管理"],
  },
  countdown: {
    title: "倒數計時器",
    description:
      "免費線上倒數計時器，設定目標日期產生精美倒數卡片，支援嵌入網站，適用於商品販售與募資活動",
    keywords: ["倒數計時", "倒數計時器", "嵌入計時器", "募資倒數", "活動倒數"],
  },
};

export function generateStaticParams() {
  return Object.keys(toolsData).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolsData[slug];

  if (!tool) {
    return { title: "工具不存在" };
  }

  const pageUrl = `${siteUrl}/tools/${slug}`;

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      type: "website",
      locale: "zh_TW",
      url: pageUrl,
      siteName: "Vibe Tools",
      title: `${tool.title} - Vibe Tools`,
      description: tool.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} - Vibe Tools`,
      description: tool.description,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = toolsData[slug];

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-text mb-4">
            工具不存在
          </h1>
          <Link href="/" className="text-primary hover:underline">
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  // JSON-LD structured data for each tool
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.description,
    url: `${siteUrl}/tools/${slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TWD",
    },
    creator: {
      "@type": "Organization",
      name: "Create Home",
      url: "https://creatorhome.tw",
    },
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          <ToolPageHeader slug={slug} />

          {/* Tool Interface */}
          {slug === "qr-generator" && <QRCodeGenerator />}
          {slug === "text-processor" && <TextProcessor />}
          {slug === "lottery" && <LotteryMachine />}
          {slug === "spin-wheel" && <SpinWheel />}
          {slug === "pomodoro" && <PomodoroTimer />}
          {slug === "countdown" && <CountdownTimer />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
