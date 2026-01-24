import type { Metadata } from "next";
import "./globals.css";
import AgentationProvider from "@/components/AgentationProvider";

export const metadata: Metadata = {
  title: "Vibe Coding Tools - 創意編碼小工具集合",
  description: "讓開發更有趣的 Vibe Coding 工具集合，提供各種實用的編碼小工具",
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
