"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";

// Adapted from Motion Primitives' shared selection background; MIT notice in licenses/.
export function ActiveUnderline({ target, value }: { target: RefObject<HTMLElement | null>; value: string }) {
  const line = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const group = target.current;
    const marker = line.current;
    if (!group || !marker) return;
    let mounted = true;
    function update() {
      if (!mounted || !group || !marker) return;
      const selected = group.querySelector<HTMLElement>('[aria-current], [aria-pressed="true"]');
      marker.style.opacity = selected ? "1" : "0";
      if (!selected) return;
      const origin = group.getBoundingClientRect();
      const bounds = selected.getBoundingClientRect();
      marker.style.transform = `translate(${bounds.left - origin.left}px, ${bounds.bottom - origin.top - 2}px) scaleX(${bounds.width})`;
    }
    update();
    const observer = new ResizeObserver(update);
    observer.observe(group);
    document.fonts.ready.then(update);
    return () => { mounted = false; observer.disconnect(); };
  }, [target, value]);
  return <span ref={line} className="active-underline" aria-hidden="true" />;
}
