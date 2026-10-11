import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ZWLY Lab — Ideas into intelligent products.", template: "%s · ZWLY Lab" },
  description: "ZWLY Lab，关注 AI 与软件工程的结合。探索全栈开发、智能应用与开发者工具，记录从想法到作品的过程。",
  openGraph: { title: "ZWLY Lab", description: "Ideas into intelligent products. AI 与全栈开发作品集。", locale: "zh_CN", type: "website" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body><a className="skip-link" href="#main-content">跳到内容</a><Navbar />{children}<Footer /></body></html>;
}