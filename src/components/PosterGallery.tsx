"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { Arrow } from "./Arrow";
import { motionTiming } from "@/lib/motion";
import { GalleryRail } from "./GalleryRail";

export function PosterGallery({ posters }: { posters: NonNullable<Project["gallery"]> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const image = useRef<HTMLImageElement>(null);
  const thumbnails = useRef<(HTMLImageElement | null)[]>([]);
  const source = useRef<DOMRect | null>(null);
  const direction = useRef(0);
  const animation = useRef<Animation | null>(null);
  const closing = useRef(false);
  const activeIndex = useRef<number | null>(null);
  const opener = useRef<number | null>(null);
  const groups = [
    { title: "旅行与日常", text: "纸张、手写标记和暖色，串起海岛与餐桌的记忆。", selected: ["travel-diary.png", "food-diary-corgi.png", "santorini-illustration.png"] },
    { title: "水彩与留白", text: "留下风筝与歌声，用一张完整画面呈现水彩的轻盈与留白。", selected: ["watercolor-kites.png"] },
    { title: "产品视觉", text: "同一个产品，面对 A4、竖屏与横屏，重新组织信息。", selected: ["jd-overview.png", "jd-recovery.png", "jd-privacy.png"] },
    { title: "早期版式", text: "最初的 Style B 概念，记录这个网站轻色、编辑式排版的起点。图中的界面与数字属于早期构想。", selected: ["portfolio-style-b.png"], archive: true },
  ].map((group) => ({ ...group, items: group.selected.flatMap((file) => posters.filter((item) => item.src.endsWith(file))) }));
  const displayedPosters = groups.flatMap((group) => group.items);
  const poster = index === null ? null : displayedPosters[index];

  function open(index: number) {
    if (dialog.current?.open) return;
    activeIndex.current = index;
    opener.current = index;
    source.current = thumbnails.current[index]?.getBoundingClientRect() ?? null;
    direction.current = 0;
    setIndex(index);
    dialog.current?.showModal();
  }

  useLayoutEffect(() => {
    const element = image.current;
    if (index === null || !element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = source.current;
    source.current = null;
    const end = element.getBoundingClientRect();
    const transform = start && end.width && end.height
      ? `translate(${start.left - end.left}px, ${start.top - end.top}px) scale(${start.width / end.width}, ${start.height / end.height})`
      : `translateX(${direction.current * 32}px)`;
    const motion = element.animate([{ transform, opacity: start ? 1 : .4 }, { transform: "none", opacity: 1 }], motionTiming(start ? "enter" : "change"));
    animation.current = motion;
    return () => motion.cancel();
  }, [index]);

  function change(next: number) {
    const current = activeIndex.current;
    if (closing.current || !dialog.current?.open || current === null || next < 0 || next >= displayedPosters.length || next === current) return;
    // Move focus before disabling its button; Chrome otherwise sends it to body.
    const boundary = next === 0 ? ".lightbox-controls button:first-child" : next === displayedPosters.length - 1 ? ".lightbox-controls button:last-child" : null;
    if (boundary && document.activeElement === dialog.current.querySelector(boundary)) dialog.current.querySelector<HTMLButtonElement>(".lightbox-toolbar button")?.focus();
    direction.current = next > current ? 1 : -1;
    activeIndex.current = next;
    setIndex(next);
  }

  async function close() {
    if (closing.current || !dialog.current?.open) return;
    const element = image.current;
    const destination = activeIndex.current === opener.current && opener.current !== null ? thumbnails.current[opener.current]?.getBoundingClientRect() : null;
    closing.current = true;
    if (element && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const current = element.getBoundingClientRect();
      const opacity = getComputedStyle(element).opacity;
      animation.current?.cancel();
      const base = element.getBoundingClientRect();
      const toThumbnail = destination && destination.bottom > 0 && destination.top < window.innerHeight && destination.right > 0 && destination.left < window.innerWidth;
      dialog.current.dataset.closing = "true";
      const motion = element.animate([
        { transform: `translate(${current.left - base.left}px, ${current.top - base.top}px) scale(${current.width / base.width}, ${current.height / base.height})`, opacity },
        { transform: toThumbnail ? `translate(${destination.left - base.left}px, ${destination.top - base.top}px) scale(${destination.width / base.width}, ${destination.height / base.height})` : "none", opacity: toThumbnail ? 1 : 0 },
      ], { ...motionTiming("exit"), fill: "forwards" });
      animation.current = motion;
      // Cancellation (including navigation) must still release the native modal.
      await motion.finished.catch(() => {});
    }
    dialog.current?.close();
    animation.current?.cancel();
    closing.current = false;
  }

  return <>
    {groups.map((group) => {
      const { items } = group;
      const render = (items: typeof posters, rail = false) => {
        const figures = items.map((item) => <figure key={item.src} className="project-media">
        <button className="poster-open" type="button" aria-haspopup="dialog" aria-label={"放大查看：" + item.title} onClick={() => open(displayedPosters.indexOf(item))}><Image ref={(element) => { thumbnails.current[displayedPosters.indexOf(item)] = element; }} src={item.src} alt={item.title} width={item.width} height={item.height} sizes="(max-width: 760px) 100vw, 420px" /><span className="poster-open-label">放大查看 <Arrow /></span></button>
        <figcaption>{item.title}<a href={item.src} target="_blank" rel="noopener noreferrer">查看原图 <Arrow /></a></figcaption>
        </figure>);
        return rail ? <GalleryRail label={group.title}>{figures}</GalleryRail> : <div className="poster-grid series-grid">{figures}</div>;
      };
      return <section key={group.title} className={"gallery-series " + (group.archive ? "gallery-archive" : "")} aria-label={group.title}><div className="gallery-series-header"><h2>{group.title}</h2><p>{group.text}</p></div>
        {group.archive ? <details><summary>展开最初的版式方向</summary>{render(items)}</details> : render(items, items.length > 1)}
      </section>;
    })}
    <dialog ref={dialog} className="poster-dialog" aria-labelledby="poster-dialog-title" onCancel={(event) => { event.preventDefault(); void close(); }} onClose={() => { activeIndex.current = null; opener.current = null; animation.current?.cancel(); closing.current = false; delete dialog.current?.dataset.closing; setIndex(null); }} onClick={(event) => { if (event.target === event.currentTarget) void close(); }} onKeyDown={(event) => {
      if (activeIndex.current === null) return;
      if (event.key === "ArrowRight") { event.preventDefault(); change(activeIndex.current + 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); change(activeIndex.current - 1); }
    }}>
      <div className="lightbox-toolbar"><h2 id="poster-dialog-title">{poster?.title ?? "视觉作品"}</h2><button className="lightbox-icon-button lightbox-close" type="button" aria-label="关闭" title="关闭（Esc）" onClick={() => void close()}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button></div>
      <div className="lightbox-stage">{poster && <Image ref={(element) => {
        image.current = element;
        const thumbnail = thumbnails.current[index!]?.currentSrc || thumbnails.current[index!]?.src;
        if (element && !element.complete && thumbnail) element.style.backgroundImage = `url("${thumbnail}")`;
      }} key={poster.src} className="lightbox-image" src={poster.src} alt={poster.title} width={poster.width} height={poster.height} sizes="90vw" style={{ aspectRatio: `${poster.width} / ${poster.height}`, width: `min(100%, calc((100dvh - 220px) * ${poster.width / poster.height}))` }} onLoad={(event) => { event.currentTarget.style.backgroundImage = "none"; }} />}</div>
      <div className="lightbox-controls"><button className="lightbox-icon-button lightbox-previous" type="button" aria-label="上一张" title="上一张（←）" disabled={index === null || index === 0} onClick={() => { if (activeIndex.current !== null) change(activeIndex.current - 1); }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg></button><p role="status" aria-live="polite" aria-atomic="true">{index === null ? 0 : index + 1} / {displayedPosters.length}</p><button className="lightbox-icon-button lightbox-next" type="button" aria-label="下一张" title="下一张（→）" disabled={index === null || index === displayedPosters.length - 1} onClick={() => { if (activeIndex.current !== null) change(activeIndex.current + 1); }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></button></div>
    </dialog>
  </>;
}
