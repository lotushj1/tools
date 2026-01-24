import type { Metadata } from "next";
import "./globals.css";
import AgentationProvider from "@/components/AgentationProvider";

export const metadata: Metadata = {
  title: "Vibe Tools - 免費實用小工具集",
  description: "透過 Vibe Coding 製作的各種免費實用小工具，即開即用、簡單好上手",
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
