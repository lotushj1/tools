import { QrCode, Type } from "lucide-react";
import ToolCard from "./ToolCard";

const tools = [
  {
    title: "QR Code 產生器",
    description: "將任意文字或網址轉換為 QR Code，支援自訂樣式與下載",
    icon: QrCode,
    href: "/tools/qr-generator",
  },
  {
    title: "文字處理工具",
    description: "字數計算、中英加空格、行間加空白，一鍵完成文字排版",
    icon: Type,
    href: "/tools/text-processor",
  },
];

export default function ToolsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-accent-light/30">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text mb-4">
            工具列表
          </h2>
          <p className="font-body text-text/70 max-w-xl mx-auto">
            免費實用的小工具，即開即用
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
