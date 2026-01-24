import {
  Palette,
  Type,
  Hash,
  QrCode,
  Clock,
  Calculator,
  FileJson,
  Shuffle,
} from "lucide-react";
import ToolCard from "./ToolCard";

const tools = [
  {
    title: "調色盤產生器",
    description: "快速生成和諧的配色方案，支援多種色彩模式匯出",
    icon: Palette,
    href: "/tools/color-palette",
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "字體配對工具",
    description: "找到完美的字體組合，預覽標題與內文搭配效果",
    icon: Type,
    href: "/tools/font-pairing",
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "UUID 產生器",
    description: "一鍵生成 UUID/GUID，支援批量產生與多種格式",
    icon: Hash,
    href: "/tools/uuid-generator",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "QR Code 產生器",
    description: "將任意文字或網址轉換為 QR Code，支援自訂樣式",
    icon: QrCode,
    href: "/tools/qr-generator",
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "時間戳轉換器",
    description: "Unix 時間戳與日期時間互轉，支援多種格式",
    icon: Clock,
    href: "/tools/timestamp",
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "進位轉換計算機",
    description: "二進位、八進位、十進位、十六進位快速互轉",
    icon: Calculator,
    href: "/tools/base-converter",
    color: "from-red-500 to-pink-500",
  },
  {
    title: "JSON 格式化工具",
    description: "美化、壓縮、驗證 JSON 資料，語法高亮顯示",
    icon: FileJson,
    href: "/tools/json-formatter",
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "隨機資料產生器",
    description: "生成假名字、Email、地址等測試用假資料",
    icon: Shuffle,
    href: "/tools/random-data",
    color: "from-fuchsia-500 to-pink-500",
  },
];

export default function ToolsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-accent-light/30">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text mb-4">
            熱門工具
          </h2>
          <p className="font-body text-text/70 max-w-xl mx-auto">
            精選實用的開發小工具，幫助你提升效率、簡化工作流程
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <button className="clay-button-secondary px-8 py-4 text-lg">
            查看所有工具
          </button>
        </div>
      </div>
    </section>
  );
}
