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
    const cards = Array.from(element.children) as HTMLElement[];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let wheelEnd = 0;
    let wheelTarget: number | null = null;
    let wheelDirection = 0;
    let currentIndex = 0;
    function update() {
      if (!element) return;
      const center = element.scrollLeft + element.clientWidth / 2;
      let nearest = 0;
      let distance = Infinity;
      cards.forEach((card, index) => {
        // offset geometry stays stable while CSS turns the artwork in perspective.
        const offset = card.offsetLeft + card.offsetWidth / 2 - center;
        if (Math.abs(offset) < distance) { nearest = index; distance = Math.abs(offset); }
        const amount = reduced.matches ? 0 : Math.max(-1, Math.min(1, offset / element.clientWidth));
        card.style.setProperty("--rail-turn", `${amount * -7}deg`);
        card.style.setProperty("--rail-scale", `${1 - Math.abs(amount) * .06}`);
        card.style.setProperty("--rail-fade", `${1 - Math.abs(amount) * .22}`);
      });
      cards.forEach((card, index) => { card.dataset.active = String(index === nearest); });
      element.dataset.overflow = String(element.scrollWidth > element.clientWidth + 1);
      currentIndex = nearest;
      setPosition(nearest);
    }
    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    function finishWheel(event?: Event) {
      if (!element || wheelTarget === null) return;
      const card = cards[wheelTarget];
      const left = Math.max(0, Math.min(element.scrollWidth - element.clientWidth, card.offsetLeft + card.offsetWidth / 2 - element.clientWidth / 2));
      // A cancelled earlier pan can emit scrollend after a new one has started.
      if (event && Math.abs(element.scrollLeft - left) > 1) return;
      window.clearTimeout(wheelEnd);
      wheelTarget = null;
      wheelDirection = 0;
    }
    function wheel(event: WheelEvent) {
      if (!element || event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      const card = cards[currentIndex];
      const artwork = card.querySelector<HTMLElement>(".poster-open");
      if (!artwork) return;
      // Measure the stable figure, not its rotating/scaling artwork.
      const top = card.getBoundingClientRect().top;
      const bottom = top + artwork.offsetHeight;
      const viewportTop = Math.max(0, document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0);
      const viewportBottom = window.innerHeight;
      const ready = artwork.offsetHeight <= viewportBottom - viewportTop
        ? top >= viewportTop - 1 && bottom <= viewportBottom + 1
        : top <= viewportTop + 1 && bottom >= viewportBottom - 1;
      if (!ready) return;
      const max = element.scrollWidth - element.clientWidth;
      const direction = Math.sign(event.deltaY);
      if (!direction || max < 1 || (direction < 0 && element.scrollLeft <= 1) || (direction > 0 && element.scrollLeft >= max - 1)) return;
      event.preventDefault();
      if (wheelTarget !== null && direction === wheelDirection) {
        const target = cards[wheelTarget];
        const left = Math.max(0, Math.min(max, target.offsetLeft + target.offsetWidth / 2 - element.clientWidth / 2));
        if (Math.abs(element.scrollLeft - left) > 1) return;
        finishWheel();
      }
      wheelTarget = Math.max(0, Math.min(count - 1, (wheelTarget ?? currentIndex) + direction));
      wheelDirection = direction;
      const target = cards[wheelTarget];
      element.scrollTo({ left: target.offsetLeft + target.offsetWidth / 2 - element.clientWidth / 2, behavior: reduced.matches ? "instant" : "smooth" });
      window.clearTimeout(wheelEnd);
      wheelEnd = window.setTimeout(finishWheel, 800);
    }
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    element.addEventListener("scroll", schedule, { passive: true });
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("scrollend", finishWheel);
    reduced.addEventListener("change", schedule);
    update();
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", schedule);
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("scrollend", finishWheel);
      reduced.removeEventListener("change", schedule);
      window.clearTimeout(wheelEnd);
      cancelAnimationFrame(frame);
    };
  }, [count]);

  function go(next: number) {
    const element = track.current;
    if (!element || next < 0 || next >= count) return;
    const card = element.children[next] as HTMLElement;
    element.scrollTo({ left: card.offsetLeft + card.offsetWidth / 2 - element.clientWidth / 2, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
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
