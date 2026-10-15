import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition, RouteMotion } from "@/components/RouteMotion";
import { SiteOpening } from "@/components/SiteOpening";
import "./globals.css";
const archivo = localFont({ src: "../../public/fonts/Archivo.woff2", variable: "--font-archivo", display: "swap", weight: "100 900" });

// Decide before first paint so slow hydration cannot cover an already-readable page.
const openingScript = `(() => {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  if (location.pathname !== "/" || location.hash || scrollY > 0 || document.hidden || preference.matches || performance.getEntriesByType("navigation")[0]?.type === "back_forward") return;
  const root = document.documentElement;
  const events = ["pointerdown", "keydown", "wheel", "touchmove", "scroll", "pagehide", "resize"];
  const animations = [];
  let timer;
  let depthReady;
  const stop = () => {
    root.removeAttribute("data-site-opening");
    root.removeAttribute("data-opening-artifacts");
    root.removeAttribute("data-opening-layout");
    root.removeAttribute("data-opening-depth");
    clearTimeout(timer);
    animations.forEach(animation => animation.cancel());
    document.removeEventListener("DOMContentLoaded", arrange);
    document.removeEventListener("opening-depth-ready", depthReady);
    events.forEach(type => window.removeEventListener(type, stop, true));
    window.removeEventListener("animationend", finish);
    document.removeEventListener("visibilitychange", unavailable);
    preference.removeEventListener("change", unavailable);
  };
  const finish = event => { if (event.animationName === "site-unveil") stop(); };
  const unavailable = () => { if (document.hidden || preference.matches) stop(); };
  const arrange = async () => {
    if (!root.hasAttribute("data-site-opening") || !Element.prototype.animate) return;
    const targets = [...document.querySelectorAll(".portfolio-showcase [data-preview] .overview-frame")];
    const previews = [...document.querySelectorAll("[data-opening-preview]")];
    if (targets.length !== 3 || previews.length !== 3) { stop(); return; }
    try { await Promise.all([...previews.map(preview => { const image = preview.querySelector("img"); image.loading = "eager"; return image.decode(); }), document.fonts.ready]); }
    catch { stop(); return; }
    await new Promise(requestAnimationFrame);
    if (!root.hasAttribute("data-site-opening")) return;
    const camera = document.querySelector(".site-camera");
    // Measure the real landing frames at the neutral camera, without painting that pose.
    camera.style.transform = "none";
    const destinations = targets.map(target => target.getBoundingClientRect());
    camera.style.removeProperty("transform");
    previews.forEach((preview, index) => {
      const bounds = destinations[index];
      Object.assign(preview.style, { left: bounds.left + "px", top: bounds.top + "px", width: bounds.width + "px", height: bounds.height + "px" });
    });
    await new Promise(resolve => {
      depthReady = resolve;
      document.addEventListener("opening-depth-ready", depthReady, { once: true });
      root.setAttribute("data-opening-layout", "ready");
      document.dispatchEvent(new Event("opening-layout-ready"));
    });
    if (!root.hasAttribute("data-site-opening")) return;
    previews.forEach((preview, index) => {
      const bounds = destinations[index];
      const position = index - 1;
      const depth = (innerWidth <= 760 ? 72 : 112) * (index + 1);
      const scale = Math.min(innerWidth * (innerWidth <= 760 ? .44 : .56), 330) / bounds.width;
      const x = (innerWidth <= 760 ? document.documentElement.clientWidth * .5 : innerWidth * .54) - bounds.left - bounds.width / 2;
      const y = innerHeight * .48 - bounds.top - bounds.height / 2;
      const spread = Math.min(innerWidth * (innerWidth <= 760 ? .11 : .16), 200) * position;
      const animation = preview.animate([
        { transform: "translate3d(" + x + "px," + (y + 80) + "px," + depth + "px) rotateX(12deg) rotateY(" + position * 8 + "deg) rotateZ(" + position * 12 + "deg) scale(" + scale * .84 + ")", opacity: 0, filter: "blur(1px)", boxShadow: "0 0 0 #182b2000, 0 0 0 #182b2000", offset: 0, easing: "cubic-bezier(.22, .6, .36, 1)" },
        { transform: "translate3d(" + (x + spread) + "px," + (y + Math.abs(position) * 26) + "px," + (depth + 12) + "px) rotateX(12deg) rotateY(" + position * 8 + "deg) rotateZ(" + position * 10 + "deg) scale(" + scale + ")", opacity: 1, filter: "blur(0px)", boxShadow: "8px 32px 42px -10px #182b2052, 2px 8px 12px -4px #182b2033", offset: .25, easing: "ease-in-out" },
        { transform: "translate3d(" + (x + spread * 1.04) + "px," + (y + Math.abs(position) * 22 - 4) + "px," + (depth + 12) + "px) rotateX(12deg) rotateY(" + position * 8 + "deg) rotateZ(" + position * 9 + "deg) scale(" + scale + ")", opacity: 1, filter: "blur(0px)", boxShadow: "8px 32px 42px -10px #182b2052, 2px 8px 12px -4px #182b2033", offset: .48, easing: "cubic-bezier(.45, 0, .2, 1)" },
        { transform: "translate3d(0,0,0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)", opacity: 1, filter: "blur(0px)", boxShadow: "0 0 0 #182b2000, 0 0 0 #182b2000", offset: 1 },
      ], { duration: 2220, delay: index * 30, fill: "both" });
      animations.push(animation);
    });
    root.setAttribute("data-opening-artifacts", "ready");
    root.setAttribute("data-site-opening", "active");
    const epoch = document.timeline.currentTime;
    [...animations, ...camera.getAnimations({ subtree: true }).filter(animation => ["opening-camera", "opening-focus", "site-unveil", "opening-label", "opening-light"].includes(animation.animationName))].forEach(animation => { animation.startTime = epoch; });
    clearTimeout(timer);
    timer = setTimeout(stop, 3100);
  };
  events.forEach(type => window.addEventListener(type, stop, { capture: true, passive: true }));
  window.addEventListener("animationend", finish);
  document.addEventListener("visibilitychange", unavailable);
  preference.addEventListener("change", unavailable);
  root.setAttribute("data-site-opening", "pending");
  document.addEventListener("DOMContentLoaded", arrange, { once: true });
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
      <a className="skip-link" href="#main-content">跳到内容</a>
      <div className="site-camera"><div className="site-page"><Navbar /><RouteMotion /><PageTransition>{children}</PageTransition><Footer /></div><SiteOpening /></div>
    </body>
  </html>;
}
