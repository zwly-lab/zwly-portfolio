"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>("#main-content h1");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!heading || preference.matches) return;
    const animation = heading.animate([
      { clipPath: "inset(0 12% 0 0)" },
      { clipPath: "inset(0)" },
    ], { duration: 320, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    const stop = () => animation.cancel();
    preference.addEventListener("change", stop);
    return () => { animation.cancel(); preference.removeEventListener("change", stop); };
  }, [pathname]);
  return null;
}
