"use client";

import { useEffect, useRef, type RefObject } from "react";

// Adapted from Motion Primitives' shared selection background; MIT notice in licenses/.
export function ActiveUnderline({ target, value }: { target: RefObject<HTMLElement | null>; value: string }) {
  const line = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);
  useEffect(() => {
    const group = target.current;
    const marker = line.current;
    if (!group || !marker) return;
    let mounted = true;
    function update() {
      if (!mounted || !group || !marker) return;
      const selected = group.querySelector<HTMLElement>('[aria-current], [aria-pressed="true"]');
      if (selected && !placed.current) marker.style.transition = "none";
      marker.style.opacity = selected ? "1" : "0";
      if (!selected) return;
      const origin = group.getBoundingClientRect();
      const bounds = selected.getBoundingClientRect();
      const label = selected.querySelector<HTMLElement>("[data-underline-label]")?.getBoundingClientRect() ?? bounds;
      const style = getComputedStyle(group);
      // Viewport rectangles include ancestor zoom; the marker needs local CSS pixels.
      const scaleX = origin.width / parseFloat(style.width), scaleY = origin.height / parseFloat(style.height);
      marker.style.width = `${label.width / scaleX + 8}px`;
      marker.style.transform = `translate(${(label.left - origin.left) / scaleX + group.scrollLeft - 4}px, ${(bounds.bottom - origin.top) / scaleY + group.scrollTop - 2}px)`;
      if (!placed.current) {
        marker.getBoundingClientRect();
        marker.style.removeProperty("transition");
        placed.current = true;
      }
    }
    update();
    const observer = new ResizeObserver(update);
    observer.observe(group);
    document.fonts.ready.then(update);
    return () => { mounted = false; observer.disconnect(); };
  }, [target, value]);
  return <span ref={line} className="active-underline" aria-hidden="true" />;
}
