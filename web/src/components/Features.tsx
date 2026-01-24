import { Zap, Target, Palette, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "即開即用",
    description: "無需安裝、無需註冊，打開網頁就能立即使用所有工具",
  },
  {
    icon: Target,
    title: "專注效率",
    description: "每個工具都經過精心設計，幫助你快速完成任務",
  },
  {
    icon: Palette,
    title: "創意設計",
    description: "美觀的介面設計，讓工作不只是工作，更是一種享受",
  },
  {
    icon: Globe,
    title: "開放免費",
    description: "所有工具完全免費使用，無任何隱藏收費或限制",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text mb-4">
            為什麼選擇 Vibe Tools？
          </h2>
          <p className="font-body text-text/70 max-w-xl mx-auto">
            我們致力於打造最佳的開發者工具體驗
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 mb-6 transition-all group-hover:scale-110 group-hover:border-primary/40">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-heading text-xl font-semibold text-text mb-3">
                {feature.title}
              </h3>
              <p className="font-body text-text/70 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
