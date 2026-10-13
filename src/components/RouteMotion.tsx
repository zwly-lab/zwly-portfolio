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
    if (!initial && typeof document.startViewTransition === "function") return;
    const main = document.querySelector<HTMLElement>("#main-content");
    const heading = main?.querySelector<HTMLElement>("h1");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!main || !heading || preference.matches) return;
    const title = heading.querySelector<HTMLElement>(".hero-name") ?? heading;
    const subtitle = heading.querySelector<HTMLElement>(".hero-subtitle");
    const animations = [title.animate([
      { clipPath: "inset(0 12% 0 0)" },
      { clipPath: "inset(0)" },
    ], motionTiming("enter"))];
    if (subtitle) animations.push(subtitle.animate([
      { clipPath: "inset(0 0 18% 0)", opacity: .55, transform: "translateY(6px)" },
      { clipPath: "inset(0)", opacity: 1, transform: "none" },
    ], { ...motionTiming("change"), delay: 80, fill: "backwards" }));
    const intro = heading.nextElementSibling;
    if (intro?.tagName === "P") animations.push(intro.animate([{ opacity: .65 }, { opacity: 1 }], { ...motionTiming("change"), delay: subtitle ? 120 : 40, fill: "backwards" }));
    const overview = main.querySelector<HTMLElement>(".overview-images");
    if (overview) animations.push(overview.animate([{ opacity: .7, clipPath: "inset(0 0 5%)" }, { opacity: 1, clipPath: "inset(0)" }], { ...motionTiming("enter"), delay: 160, fill: "backwards" }));
    // Interaction takes priority over the entrance, before selection measures its geometry.
    const stop = () => animations.forEach((animation) => animation.cancel());
    main.addEventListener("pointerdown", stop, { once: true });
    main.addEventListener("keydown", stop, { once: true });
    return () => { stop(); main.removeEventListener("pointerdown", stop); main.removeEventListener("keydown", stop); };
  }, [pathname]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => { if (preference.matches) document.getAnimations().forEach((animation) => animation.cancel()); };
    preference.addEventListener("change", stop);
    return () => preference.removeEventListener("change", stop);
  }, []);
  return null;
}
