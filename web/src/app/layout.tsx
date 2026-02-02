import type { Metadata } from "next";
import "./globals.css";
import AgentationProvider from "@/components/AgentationProvider";

const siteUrl = "https://lotushj1.github.io/tools";
const siteName = "Vibe Tools";
const siteDescription =
  "免費實用線上小工具集：QR Code 產生器、文字處理、抽獎扭蛋機、幸運輪盤、番茄鐘、倒數計時器，即開即用、無需安裝";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vibe Tools - 免費實用小工具集",
    template: "%s | Vibe Tools",
  },
  description: siteDescription,
  keywords: [
    "線上工具",
    "免費工具",
    "QR Code 產生器",
    "文字處理",
    "抽獎工具",
    "輪盤",
    "番茄鐘",
    "倒數計時器",
    "Vibe Tools",
    "Vibe Coding",
  ],
  authors: [{ name: "Create Home", url: "https://creatorhome.tw" }],
  creator: "Create Home",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: siteUrl,
    siteName: siteName,
    title: "Vibe Tools - 免費實用小工具集",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Tools - 免費實用小工具集",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        {children}
        <AgentationProvider />
      </body>
    </html>
  );
}
