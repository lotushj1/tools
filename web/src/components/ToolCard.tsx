import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: string;
}

export default function ToolCard({
  title,
  description,
  icon: Icon,
  href,
  color = "from-primary to-secondary",
}: ToolCardProps) {
  return (
    <Link href={href} className="block">
      <article className="clay-card p-6 h-full flex flex-col">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Content */}
        <h3 className="font-heading text-xl font-semibold text-text mb-2">
          {title}
        </h3>
        <p className="font-body text-text/70 text-sm flex-1 mb-4">
          {description}
        </p>

        {/* Action */}
        <div className="flex items-center gap-2 font-body font-medium text-primary">
          <span>立即使用</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </article>
    </Link>
  );
}
