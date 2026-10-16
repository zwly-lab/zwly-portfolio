"use client";

import { useSyncExternalStore } from "react";

function subscribe(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-site-opening"] });
  return () => observer.disconnect();
}

// Route preparation must not compete with the first visible 3D frames.
export function useOpeningPrefetch() {
  return useSyncExternalStore(subscribe, () => !document.documentElement.hasAttribute("data-site-opening"), () => false);
}
