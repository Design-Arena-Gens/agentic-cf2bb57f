import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "领用状态面板",
  description: "快速查看哪些资源已被领取、哪些仍然可用"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <body className="bg-slate-900 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
