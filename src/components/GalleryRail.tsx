"use client";

import { Children, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

export function GalleryRail({ children, label }: { children: ReactNode; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const id = useId();
  const count = Children.count(children);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    let frame = 0;
    function update() {
      if (!element) return;
      const cards = Array.from(element.children) as HTMLElement[];
      const left = element.getBoundingClientRect().left;
      const max = element.scrollWidth - element.clientWidth;
      const nearest = cards.reduce((best, card, index) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[best].getBoundingClientRect().left - left) ? index : best, 0);
      setPosition(max > 1 && element.scrollLeft >= max - 1 ? count - 1 : nearest);
    }
    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    element.addEventListener("scroll", schedule, { passive: true });
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    };
  }, [count]);

  function go(next: number) {
    const element = track.current;
    if (!element || next < 0 || next >= count) return;
    const card = element.children[next] as HTMLElement;
    element.scrollTo({ left: element.scrollLeft + card.getBoundingClientRect().left - element.getBoundingClientRect().left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return <div className="gallery-rail">
    <div ref={track} id={id} className="poster-grid series-grid gallery-rail-track" tabIndex={0} role="region" aria-label={label + "，可左右浏览"} onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return;
      if (!track.current || track.current.scrollWidth <= track.current.clientWidth) return;
      const next = event.key === "ArrowRight" ? position + 1 : event.key === "ArrowLeft" ? position - 1 : event.key === "Home" ? 0 : event.key === "End" ? count - 1 : null;
      if (next === null) return;
      event.preventDefault();
      go(next);
    }}>{children}</div>
    <div className="gallery-rail-controls">
      {/* aria-disabled keeps keyboard focus on a navigation button at either end. */}
      <button type="button" aria-label={label + "：上一张"} aria-controls={id} aria-disabled={position === 0} onClick={() => go(position - 1)}>上一张</button>
      <p role="status" aria-live="polite" aria-atomic="true">{position + 1} / {count}</p>
      <button type="button" aria-label={label + "：下一张"} aria-controls={id} aria-disabled={position === count - 1} onClick={() => go(position + 1)}>下一张</button>
    </div>
  </div>;
}
