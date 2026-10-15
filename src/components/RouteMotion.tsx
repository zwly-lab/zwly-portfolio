"use client";

import { useEffect, useLayoutEffect, useRef, ViewTransition } from "react";
import { usePathname } from "next/navigation";
import { motionTiming } from "@/lib/motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return <ViewTransition default="route-content" onUpdate={({ name }) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const group = document.getAnimations().find((animation) => (animation.effect as KeyframeEffect)?.pseudoElement === `::view-transition-group(${name})`);
    const frames = (group?.effect as KeyframeEffect | null)?.getKeyframes();
    if (!group || !frames?.length || typeof frames[0].transform !== "string" || typeof frames.at(-1)?.transform !== "string" || typeof frames[0].width !== "string") return;
    const before = new DOMMatrix(String(frames[0].transform));
    const after = new DOMMatrix(String(frames.at(-1)?.transform));
    // Keep the old snapshot at its original viewport position, including scroll offset.
    group.finish();
    const motion = document.documentElement.animate([
      { transform: `translate(${before.e - after.e}px, ${before.f - after.f}px)`, width: frames[0].width, opacity: 1 },
      { transform: `translate(${before.e - after.e}px, ${before.f - after.f}px)`, width: frames[0].width, opacity: 0 },
    ], { ...motionTiming("exit"), pseudoElement: `::view-transition-old(${name})`, fill: "both" });
    return () => motion.cancel();
  }}>{children}</ViewTransition>;
}

export function RouteMotion() {
  const pathname = usePathname();
  const entered = useRef(false);
  useLayoutEffect(() => {
    const initial = !entered.current;
    entered.current = true;
    // The pre-paint page opening owns the whole initial homepage composition.
    if (initial && pathname === "/") return;
    if (!initial && typeof document.startViewTransition === "function") return;
    const main = document.querySelector<HTMLElement>("#main-content");
    const heading = main?.querySelector<HTMLElement>("h1");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!main || !heading) return;
    if (preference.matches) return;
    const title = heading.querySelector<HTMLElement>(".hero-name") ?? heading;
    const subtitle = heading.querySelector<HTMLElement>(".hero-subtitle");
    const animations = [title.animate([
      { clipPath: "inset(0 12% 0 0)" },
      { clipPath: "inset(0)" },
    ], { ...motionTiming("enter"), fill: "backwards" })];
    if (subtitle) animations.push(subtitle.animate([
      { clipPath: "inset(0 0 18% 0)", opacity: .55, transform: "translateY(6px)" },
      { clipPath: "inset(0)", opacity: 1, transform: "none" },
    ], { ...motionTiming("change"), delay: 80, fill: "backwards" }));
    const intro = heading.nextElementSibling;
    if (intro?.tagName === "P") animations.push(intro.animate([{ opacity: .65 }, { opacity: 1 }], { ...motionTiming("change"), delay: subtitle ? 120 : 40, fill: "backwards" }));
    const overview = main.querySelector<HTMLElement>(".overview-images");
    if (overview) animations.push(overview.animate([{ opacity: .7, clipPath: "inset(0 0 5%)" }, { opacity: 1, clipPath: "inset(0)" }], { ...motionTiming("enter"), delay: 160, fill: "backwards" }));
    // Interaction takes priority over the entrance, before selection measures its geometry.
    const stop = () => { animations.forEach((animation) => animation.cancel()); };
    const stopWhenUnavailable = () => { if (preference.matches || document.hidden) stop(); };
    document.addEventListener("pointerdown", stop, { once: true, capture: true });
    document.addEventListener("keydown", stop, { once: true, capture: true });
    window.addEventListener("wheel", stop, { once: true, passive: true });
    window.addEventListener("touchmove", stop, { once: true, passive: true });
    window.addEventListener("scroll", stop, { once: true, passive: true });
    preference.addEventListener("change", stopWhenUnavailable);
    document.addEventListener("visibilitychange", stopWhenUnavailable);
    return () => {
      stop();
      document.removeEventListener("pointerdown", stop, true);
      document.removeEventListener("keydown", stop, true);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("scroll", stop);
      preference.removeEventListener("change", stopWhenUnavailable);
      document.removeEventListener("visibilitychange", stopWhenUnavailable);
    };
  }, [pathname]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => { if (preference.matches) document.getAnimations().forEach((animation) => animation.cancel()); };
    preference.addEventListener("change", stop);
    return () => preference.removeEventListener("change", stop);
  }, []);
  return null;
}
