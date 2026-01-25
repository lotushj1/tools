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

const TextProcessor = dynamic(
  () => import("@/components/tools/TextProcessor"),
  { ssr: false }
);

// Tool data - in a real app, this would come from a database or API
const toolsData: Record<string, { title: string; description: string }> = {
  "qr-generator": {
    title: "QR Code 產生器",
    description: "將任意文字或網址轉換為 QR Code，支援自訂樣式",
  },
  "text-processor": {
    title: "文字處理工具",
    description: "字數計算、中英加空格、行間加空白，一鍵完成文字排版",
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
          {slug === "qr-generator" && <QRCodeGenerator />}
          {slug === "text-processor" && <TextProcessor />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
