"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { motionTiming } from "@/lib/motion";

export function RouteMotion() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    const main = document.querySelector<HTMLElement>("#main-content");
    const heading = main?.querySelector<HTMLElement>("h1");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!main || !heading || preference.matches) return;
    const animations = [heading.animate([
      { clipPath: "inset(0 12% 0 0)" },
      { clipPath: "inset(0)" },
    ], motionTiming("enter"))];
    const intro = heading.nextElementSibling;
    if (intro?.tagName === "P") animations.push(intro.animate([{ opacity: .65 }, { opacity: 1 }], { ...motionTiming("change"), delay: 40, fill: "backwards" }));
    const overview = main.querySelector<HTMLElement>(".overview-images");
    if (overview) animations.push(overview.animate([{ opacity: .7, clipPath: "inset(0 0 5%)" }, { opacity: 1, clipPath: "inset(0)" }], { ...motionTiming("enter"), delay: 80, fill: "backwards" }));
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
