"use client";

import { useEffect } from "react";
const connection = typeof navigator !== "undefined" ? (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection : undefined;
// Begin eligible downloads during hydration, alongside image preparation.
const depthModule = typeof document !== "undefined" && document.documentElement.hasAttribute("data-site-opening") && !connection?.saveData && !["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "")
  ? import("@/lib/opening-depth").catch(() => null)
  : null;

export function OpeningDepth() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-site-opening")) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    const prepare = async () => {
      try {
        if (cancelled) return;
        const depth = await depthModule;
        if (cancelled) return;
        if (!depth) throw new Error("Opening depth unavailable");
        dispose = await depth.createOpeningDepth();
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
