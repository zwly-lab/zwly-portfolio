"use client";

import { useEffect } from "react";
import { createOpeningDepth } from "@/lib/opening-depth";

export function OpeningDepth() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-site-opening")) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    const prepare = async () => {
      try {
        if (cancelled) return;
        dispose = await createOpeningDepth();
        if (cancelled) { dispose(); return; }
        root.dataset.openingDepth = "ready";
      } catch {
        if (cancelled) return;
        root.dataset.openingDepth = "fallback";
      }
      document.dispatchEvent(new Event("opening-depth-ready"));
    };
    const stop = () => {
      cancelled = true;
      observer.disconnect();
      document.removeEventListener("opening-layout-ready", prepare);
      dispose?.();
    };
    const observer = new MutationObserver(() => { if (!root.hasAttribute("data-site-opening")) stop(); });
    observer.observe(root, { attributes: true, attributeFilter: ["data-site-opening"] });
    document.addEventListener("opening-layout-ready", prepare, { once: true });
    if (root.hasAttribute("data-opening-layout")) void prepare();
    return stop;
  }, []);
  return null;
}
