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
    if (!main || !heading) return;
    const opening = initial && pathname === "/";
    if (opening) {
      try {
        const seen = sessionStorage.getItem("zwly-home-intro-v1");
        sessionStorage.setItem("zwly-home-intro-v1", "1");
        if (seen) return;
      } catch { /* Session storage is optional; it never gates the page. */ }
      if (location.hash || scrollY > 0 || document.hidden) return;
      // Late hydration must not hide content visitors have already started reading.
      const painted = performance.getEntriesByName("first-contentful-paint")[0];
      if (painted && performance.now() - painted.startTime > 500) return;
    }
    if (preference.matches) return;
    let stopped = false;
    const title = heading.querySelector<HTMLElement>(".hero-name") ?? heading;
    const subtitle = heading.querySelector<HTMLElement>(".hero-subtitle");
    const animations = [title.animate([
      { clipPath: opening ? "inset(0 100% 0 0)" : "inset(0 12% 0 0)" },
      { clipPath: "inset(0)" },
    ], { ...motionTiming("enter"), delay: opening ? 40 : 0, fill: "backwards" })];
    if (subtitle) animations.push(subtitle.animate([
      { clipPath: "inset(0 0 18% 0)", opacity: .55, transform: "translateY(6px)" },
      { clipPath: "inset(0)", opacity: 1, transform: "none" },
    ], { ...motionTiming("change"), delay: opening ? 100 : 80, fill: "backwards" }));
    const intro = heading.nextElementSibling;
    if (intro?.tagName === "P") animations.push(intro.animate([{ opacity: .65 }, { opacity: 1 }], { ...motionTiming("change"), delay: opening ? 160 : subtitle ? 120 : 40, fill: "backwards" }));
    const overview = main.querySelector<HTMLElement>(".overview-images");
    if (opening) {
      const brand = document.querySelector(".site-header .wordmark");
      if (brand) animations.push(brand.animate([{ opacity: .55, clipPath: "inset(0 35% 0 0)" }, { opacity: 1, clipPath: "inset(0)" }], motionTiming("change")));
      const link = main.querySelector(".hero-intro > .text-link");
      if (link) animations.push(link.animate([{ opacity: .55, transform: "translateY(3px)" }, { opacity: 1, transform: "none" }], { ...motionTiming("change"), delay: 200, fill: "backwards" }));
      overview?.querySelectorAll(".overview-work").forEach((card, index) => {
        animations.push(card.animate([{ transform: "translateY(12px)", clipPath: "inset(0 0 18%)" }, { transform: "none", clipPath: "inset(0)" }], { ...motionTiming("enter"), delay: 160 + index * 60, fill: "backwards" }));
        const image = card.querySelector("img");
        if (image && !image.complete) void image.decode().then(() => {
          if (!stopped && !preference.matches) animations.push(image.animate([{ opacity: .55 }, { opacity: 1 }], motionTiming("change")));
        }).catch(() => { /* The native image fallback remains visible if decoding fails. */ });
      });
    } else if (overview) animations.push(overview.animate([{ opacity: .7, clipPath: "inset(0 0 5%)" }, { opacity: 1, clipPath: "inset(0)" }], { ...motionTiming("enter"), delay: 160, fill: "backwards" }));
    // Interaction takes priority over the entrance, before selection measures its geometry.
    const stop = () => { stopped = true; animations.forEach((animation) => animation.cancel()); };
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
