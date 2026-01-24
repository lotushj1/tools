import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Dynamically import tool components (client-side only)
const QRCodeGenerator = dynamic(
  () => import("@/components/tools/QRCodeGenerator"),
  { ssr: false }
);

// Tool data - in a real app, this would come from a database or API
const toolsData: Record<string, { title: string; description: string }> = {
  "color-palette": {
    title: "調色盤產生器",
    description: "快速生成和諧的配色方案，支援多種色彩模式匯出",
  },
  "font-pairing": {
    title: "字體配對工具",
    description: "找到完美的字體組合，預覽標題與內文搭配效果",
  },
  "uuid-generator": {
    title: "UUID 產生器",
    description: "一鍵生成 UUID/GUID，支援批量產生與多種格式",
  },
  "qr-generator": {
    title: "QR Code 產生器",
    description: "將任意文字或網址轉換為 QR Code，支援自訂樣式",
  },
  "timestamp": {
    title: "時間戳轉換器",
    description: "Unix 時間戳與日期時間互轉，支援多種格式",
  },
  "base-converter": {
    title: "進位轉換計算機",
    description: "二進位、八進位、十進位、十六進位快速互轉",
  },
  "json-formatter": {
    title: "JSON 格式化工具",
    description: "美化、壓縮、驗證 JSON 資料，語法高亮顯示",
  },
  "random-data": {
    title: "隨機資料產生器",
    description: "生成假名字、Email、地址等測試用假資料",
  },
};

export function generateStaticParams() {
  return Object.keys(toolsData).map((slug) => ({ slug }));
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

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text/70 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body">返回首頁</span>
          </Link>

          {/* Tool Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-text mb-3">
              {tool.title}
            </h1>
            <p className="font-body text-lg text-text/70">{tool.description}</p>
          </div>

          {/* Tool Interface */}
          {slug === "qr-generator" ? (
            <QRCodeGenerator />
          ) : (
            <div className="clay-card p-8 md:p-12">
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-4xl">🚧</span>
                </div>
                <h2 className="font-heading text-2xl font-semibold text-text mb-3">
                  工具開發中
                </h2>
                <p className="font-body text-text/70 max-w-md mx-auto">
                  這個工具正在開發中，敬請期待！
                  <br />
                  完成後將在這裡提供完整的功能介面。
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
