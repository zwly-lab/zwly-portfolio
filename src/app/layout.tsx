import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition, RouteMotion } from "@/components/RouteMotion";
import { SiteOpening } from "@/components/SiteOpening";
import "./globals.css";
const archivo = localFont({ src: "../../public/fonts/Archivo.ttf", variable: "--font-archivo", display: "swap", weight: "100 900" });

// Decide before first paint so slow hydration cannot cover an already-readable page.
const openingScript = `(() => {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  if (location.pathname !== "/" || location.hash || scrollY > 0 || document.hidden || preference.matches || performance.getEntriesByType("navigation")[0]?.type === "back_forward") return;
  const root = document.documentElement;
  const events = ["pointerdown", "keydown", "wheel", "touchmove", "scroll", "pagehide", "resize"];
  const animations = [];
  let timer;
  const stop = () => {
    root.removeAttribute("data-site-opening");
    root.removeAttribute("data-opening-artifacts");
    clearTimeout(timer);
    animations.forEach(animation => animation.cancel());
    document.removeEventListener("DOMContentLoaded", arrange);
    events.forEach(type => window.removeEventListener(type, stop, true));
    window.removeEventListener("animationend", finish);
    document.removeEventListener("visibilitychange", unavailable);
    preference.removeEventListener("change", unavailable);
  };
  const finish = event => { if (event.animationName === "site-unveil") stop(); };
  const unavailable = () => { if (document.hidden || preference.matches) stop(); };
  const arrange = () => {
    if (!root.hasAttribute("data-site-opening") || !Element.prototype.animate) return;
    const targets = [...document.querySelectorAll(".portfolio-showcase [data-preview] .overview-frame")];
    const previews = [...document.querySelectorAll("[data-opening-preview]")];
    if (targets.length !== 3 || previews.length !== 3) return;
    const camera = document.querySelector(".site-camera").getAnimations().find(animation => animation.animationName === "opening-camera");
    const epoch = camera?.startTime ?? document.timeline.currentTime;
    const current = camera?.currentTime ?? 0;
    // Measure the real landing frames at the neutral camera, without painting that pose.
    if (camera) { camera.pause(); camera.currentTime = 2400; }
    const destinations = targets.map(target => target.getBoundingClientRect());
    if (camera) { camera.currentTime = current; camera.play(); camera.startTime = epoch; }
    previews.forEach((preview, index) => {
      const bounds = destinations[index];
      const position = index - 1;
      const depth = (innerWidth <= 760 ? 28 : 48) * (index + 1);
      const scale = Math.min(innerWidth * .56, 330) / bounds.width;
      const x = innerWidth * (innerWidth <= 760 ? .5 : .54) - bounds.left - bounds.width / 2;
      const y = innerHeight * .48 - bounds.top - bounds.height / 2;
      const spread = Math.min(innerWidth * .16, 200) * position;
      Object.assign(preview.style, { left: bounds.left + "px", top: bounds.top + "px", width: bounds.width + "px", height: bounds.height + "px" });
      const animation = preview.animate([
        { transform: "translate3d(" + x + "px," + (y + 80) + "px," + depth + "px) rotateX(4deg) rotateY(" + position * 3 + "deg) rotateZ(" + position * 12 + "deg) scale(" + scale * .84 + ")", opacity: 0, filter: "blur(1px)", boxShadow: "0 0 0 #20262100", offset: 0, easing: "cubic-bezier(.22, .6, .36, 1)" },
        { transform: "translate3d(" + (x + spread) + "px," + (y + Math.abs(position) * 26) + "px," + (depth + 12) + "px) rotateX(4deg) rotateY(" + position * 3 + "deg) rotateZ(" + position * 10 + "deg) scale(" + scale + ")", opacity: 1, filter: "blur(0px)", boxShadow: "0 18px 32px #20262124", offset: .32, easing: "cubic-bezier(.45, 0, .2, 1)" },
        { transform: "translate3d(0,0,0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)", opacity: 1, filter: "blur(0px)", boxShadow: "0 0 0 #20262100", offset: 1 },
      ], { duration: 2220, delay: index * 30, fill: "both" });
      animation.startTime = epoch;
      animations.push(animation);
    });
    root.setAttribute("data-opening-artifacts", "ready");
  };
  events.forEach(type => window.addEventListener(type, stop, { capture: true, passive: true }));
  window.addEventListener("animationend", finish);
  document.addEventListener("visibilitychange", unavailable);
  preference.addEventListener("change", unavailable);
  root.setAttribute("data-site-opening", "active");
  document.addEventListener("DOMContentLoaded", arrange, { once: true });
  timer = setTimeout(stop, 3100);
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
      <a className="skip-link" href="#main-content">跳到内容</a>
      <div className="site-camera"><div className="site-page"><Navbar /><RouteMotion /><PageTransition>{children}</PageTransition><Footer /></div><SiteOpening /></div>
    </body>
  </html>;
}
