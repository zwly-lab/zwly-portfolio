import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";
const archivo = localFont({ src: "../../public/fonts/Archivo.ttf", variable: "--font-archivo", display: "swap", weight: "100 900" });

export const metadata: Metadata = {
  title: { default: "ZWLY Lab — 把复杂知识，做成可体验的工具。", template: "%s · ZWLY Lab" },
  description: "ZWLY Lab：教学可视化、全栈应用与 AI 视觉创作。体验真实工具，了解产品成果，阅读构建与学习笔记。",
  openGraph: { title: "ZWLY Lab", description: "把复杂知识，做成可体验的工具。教学可视化、全栈应用与 AI 视觉创作。", locale: "zh_CN", type: "website" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body className={archivo.variable}><a className="skip-link" href="#main-content">跳到内容</a><Navbar />{children}<Footer /></body></html>;
}
