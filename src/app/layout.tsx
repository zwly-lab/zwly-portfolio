import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition, RouteMotion } from "@/components/RouteMotion";
import "./globals.css";
const archivo = localFont({ src: "../../public/fonts/Archivo.ttf", variable: "--font-archivo", display: "swap", weight: "100 900" });

// Decide before first paint so slow hydration cannot cover an already-readable page.
const openingScript = `(() => {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  if (location.pathname !== "/" || location.hash || scrollY > 0 || document.hidden || preference.matches || performance.getEntriesByType("navigation")[0]?.type === "back_forward") return;
  const root = document.documentElement;
  const events = ["pointerdown", "keydown", "wheel", "touchmove", "scroll", "pagehide"];
  let timer;
  const stop = () => {
    root.removeAttribute("data-site-opening");
    clearTimeout(timer);
    events.forEach(type => window.removeEventListener(type, stop, true));
    window.removeEventListener("animationend", finish);
    document.removeEventListener("visibilitychange", unavailable);
    preference.removeEventListener("change", unavailable);
  };
  const finish = event => { if (event.animationName === "site-unveil") stop(); };
  const unavailable = () => { if (document.hidden || preference.matches) stop(); };
  events.forEach(type => window.addEventListener(type, stop, { capture: true, passive: true }));
  window.addEventListener("animationend", finish);
  document.addEventListener("visibilitychange", unavailable);
  preference.addEventListener("change", unavailable);
  root.setAttribute("data-site-opening", "active");
  timer = setTimeout(stop, 1800);
})();`;

export const metadata: Metadata = {
  title: { default: "ZWLY Lab — Vibe Coding 作品集", template: "%s · ZWLY Lab" },
  description: "ZWLY Lab 的 Vibe Coding 作品集：与 AI 协作，把想法做成应用、交互实验与视觉作品。浏览真实成果、体验演示，阅读构建与迭代手记。",
  openGraph: { title: "ZWLY Lab — Vibe Coding 作品集", description: "与 AI 协作，把想法做成作品。应用、交互实验、视觉创作与构建手记。", locale: "zh_CN", type: "website" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN" data-scroll-behavior="smooth" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: openingScript }} /></head>
    <body className={archivo.variable}>
      <div className="site-opening" aria-hidden="true"><div><div className="site-opening-name"><span>ZWLY Lab.</span></div><p>Vibe Coding 作品集</p></div></div>
      <a className="skip-link" href="#main-content">跳到内容</a><Navbar /><RouteMotion /><PageTransition>{children}</PageTransition><Footer />
    </body>
  </html>;
}
