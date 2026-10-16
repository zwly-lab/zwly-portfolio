import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition, RouteMotion } from "@/components/RouteMotion";
import { SiteOpening } from "@/components/SiteOpening";
import { siteUrl } from "@/lib/metadata";
import "./globals.css";
const archivo = localFont({ src: "../../public/fonts/Archivo.woff2", variable: "--font-archivo", display: "swap", weight: "100 900" });

// Choose the lightweight cover before paint; readiness and visible playback have separate clocks.
const openingScript = `(() => {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  if (location.pathname !== "/" || location.hash || scrollY > 0 || document.hidden || preference.matches || performance.getEntriesByType("navigation")[0]?.type === "back_forward") return;
  const root = document.documentElement;
  const replay = new URLSearchParams(location.search).get("opening") === "replay";
  try {
    if (sessionStorage.getItem("zwly-opening-seen") && !replay) {
      root.setAttribute("data-site-return", "");
      const arrive = () => setTimeout(() => root.removeAttribute("data-site-return"), 450);
      document.addEventListener("DOMContentLoaded", arrive, { once: true });
      return;
    }
  } catch {}
  const events = ["click", "pointerdown", "keydown", "wheel", "touchmove", "scroll", "pagehide", "resize"];
  const animations = [];
  let timer;
  let depthReady;
  const stop = () => {
    try { sessionStorage.setItem("zwly-opening-seen", "1"); } catch {}
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
    const destinations = targets.map(target => target.getBoundingClientRect());
    const stageLeft = Math.min(...destinations.map(bounds => bounds.left));
    const stageRight = Math.max(...destinations.map(bounds => bounds.right));
    const stageWidth = stageRight - stageLeft;
    const centerX = (stageLeft + stageRight) / 2;
    const centerY = destinations[0].top + destinations[0].height / 2;
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
      const depth = (innerWidth <= 760 ? 48 : 72) * (index + 1);
      const scale = Math.min(stageWidth * (innerWidth <= 760 ? .5 : .4), 330) / bounds.width;
      const x = centerX - bounds.left - bounds.width / 2;
      const y = centerY - bounds.top - bounds.height / 2;
      const spread = Math.min(stageWidth * (innerWidth <= 760 ? .13 : .23), 180) * position;
      const openingScale = Math.min(innerWidth * .48, 280) / bounds.width;
      const openingPose = "translate3d(" + (document.documentElement.clientWidth / 2 - bounds.left - bounds.width / 2 + position * 18) + "px," + (innerHeight * .57 - bounds.top - bounds.height / 2) + "px," + depth + "px) rotateX(8deg) rotateY(" + position * 5 + "deg) rotateZ(" + position * 6 + "deg) scale(" + openingScale + ")";
      const animation = preview.animate([
        { transform: openingPose, opacity: 0, filter: "blur(0px)", boxShadow: "0 0 0 #182b2000, 0 0 0 #182b2000", offset: 0 },
        { transform: openingPose, opacity: 1, filter: "blur(0px)", boxShadow: "5px 20px 32px -10px #182b203d, 1px 5px 8px -4px #182b2026", offset: .09, easing: "cubic-bezier(.22, .6, .36, 1)" },
        { transform: "translate3d(" + (x + spread) + "px," + (y + Math.abs(position) * 26) + "px," + (depth + 12) + "px) rotateX(8deg) rotateY(" + position * 5 + "deg) rotateZ(" + position * 10 + "deg) scale(" + scale + ")", opacity: 1, filter: "blur(0px)", boxShadow: "5px 20px 32px -10px #182b203d, 1px 5px 8px -4px #182b2026", offset: .34, easing: "ease-in-out" },
        { transform: "translate3d(" + (x + spread * 1.04) + "px," + (y + Math.abs(position) * 22 - 4) + "px," + (depth + 12) + "px) rotateX(8deg) rotateY(" + position * 5 + "deg) rotateZ(" + position * 9 + "deg) scale(" + scale + ")", opacity: 1, filter: "blur(0px)", boxShadow: "5px 20px 32px -10px #182b203d, 1px 5px 8px -4px #182b2026", offset: .52, easing: "cubic-bezier(.45, 0, .2, 1)" },
        { transform: "translate3d(0,0,0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)", opacity: 1, filter: "blur(0px)", boxShadow: "0 0 0 #182b2000, 0 0 0 #182b2000", offset: 1 },
      ], { duration: 2220, fill: "both" });
      animations.push(animation);
    });
    const signature = document.querySelector(".site-opening-signature");
    const wordmark = document.querySelector(".site-header > .wordmark");
    const mark = wordmark.getBoundingClientRect();
    const font = getComputedStyle(wordmark);
    Object.assign(signature.style, { left: mark.left + "px", top: mark.top + "px", fontSize: font.fontSize, lineHeight: font.lineHeight });
    const markScale = Math.min(80, Math.max(48, innerWidth * .056)) / parseFloat(font.fontSize);
    const markPose = "translate(" + (document.documentElement.clientWidth / 2 - mark.left - mark.width * markScale / 2) + "px," + (innerHeight * .27 - mark.top - mark.height * markScale / 2) + "px) scale(" + markScale + ")";
    animations.push(signature.animate([{ transform: markPose, offset: 0 }, { transform: markPose, offset: .12, easing: "cubic-bezier(.76, 0, .24, 1)" }, { transform: "translate(0,0) scale(1)", offset: .46 }, { transform: "translate(0,0) scale(1)" }], { duration: 2820, fill: "both" }));
    root.setAttribute("data-opening-artifacts", "ready");
    root.setAttribute("data-site-opening", "active");
    const sequence = [...animations, ...camera.getAnimations({ subtree: true }).filter(animation => animation.animationName === "site-unveil" || animation.animationName?.startsWith("opening-"))];
    sequence.forEach(animation => { animation.pause(); animation.currentTime = 0; });
    // Settle activation styles before starting the shared visible clock.
    await new Promise(requestAnimationFrame);
    if (!root.hasAttribute("data-site-opening")) return;
    const epoch = document.timeline.currentTime;
    sequence.forEach(animation => { animation.play(); animation.startTime = epoch; });
    document.dispatchEvent(new Event("opening-play"));
    clearTimeout(timer);
    timer = setTimeout(stop, 3520);
  };
  events.forEach(type => window.addEventListener(type, stop, { capture: true, passive: true }));
  window.addEventListener("animationend", finish);
  document.addEventListener("visibilitychange", unavailable);
  preference.addEventListener("change", unavailable);
  root.setAttribute("data-site-opening", "pending");
  document.addEventListener("DOMContentLoaded", arrange, { once: true });
  timer = setTimeout(stop, 8000);
})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
