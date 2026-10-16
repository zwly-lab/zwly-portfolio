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
    { title: "旅行与日常", text: "纸张、手写标记和暖色，串起海岛与餐桌的记忆。", items: posters.filter((item) => /food-|travel-|santorini-/.test(item.src)), selected: ["travel-diary.png", "food-diary-corgi.png", "santorini-illustration.png"] },
    { title: "水彩与留白", text: "保留歌声与风筝，比较主体位置、画面重心和留白。", items: posters.filter((item) => item.src.includes("watercolor-")) },
    { title: "产品视觉", text: "同一个产品，面对 A4、竖屏与横屏，重新组织信息。", items: posters.filter((item) => item.src.includes("/jd-")) },
    { title: "界面方向归档", text: "四套早期网站概念，记录方向选择。概念图中的界面与数字不代表实际产品状态。", items: posters.filter((item) => item.src.includes("portfolio-style-")), archive: true },
  ].map((group) => {
    const featured = group.selected ? group.selected.map((file) => group.items.find((item) => item.src.endsWith(file))!).filter(Boolean) : group.items;
    return { ...group, featured, variants: group.items.filter((item) => !featured.includes(item)) };
  });
  const displayedPosters = groups.flatMap((group) => [...group.featured, ...group.variants]);
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
      const { featured, variants } = group;
      const render = (items: typeof posters, rail = false) => {
        const figures = items.map((item) => <figure key={item.src} className="project-media">
        <button className="poster-open" type="button" aria-haspopup="dialog" aria-label={"放大查看：" + item.title} onClick={() => open(displayedPosters.indexOf(item))}><Image ref={(element) => { thumbnails.current[displayedPosters.indexOf(item)] = element; }} src={item.src} alt={item.title} width={item.width} height={item.height} sizes="(max-width: 760px) 100vw, 420px" /><span className="poster-open-label">放大查看 <Arrow /></span></button>
        <figcaption>{item.title}<a href={item.src} target="_blank" rel="noopener noreferrer">查看原图 <Arrow /></a></figcaption>
        </figure>);
        return rail ? <GalleryRail label={group.title}>{figures}</GalleryRail> : <div className="poster-grid series-grid">{figures}</div>;
      };
      return <section key={group.title} className={"gallery-series " + (group.archive ? "gallery-archive" : "")} aria-label={group.title}><div className="gallery-series-header"><h2>{group.title}</h2><p>{group.text}</p></div>
        {group.archive ? <details><summary>展开四套界面概念</summary>{render(featured)}</details> : <>{render(featured, true)}{variants.length > 0 && <details><summary>查看这个系列的其他 {variants.length} 张作品</summary>{render(variants)}</details>}</>}
      </section>;
    })}
    <dialog ref={dialog} className="poster-dialog" aria-labelledby="poster-dialog-title" onCancel={(event) => { event.preventDefault(); void close(); }} onClose={() => { activeIndex.current = null; opener.current = null; animation.current?.cancel(); closing.current = false; delete dialog.current?.dataset.closing; setIndex(null); }} onClick={(event) => { if (event.target === event.currentTarget) void close(); }} onKeyDown={(event) => {
      if (activeIndex.current === null) return;
      if (event.key === "ArrowRight") { event.preventDefault(); change(activeIndex.current + 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); change(activeIndex.current - 1); }
    }}>
      <div className="lightbox-toolbar"><h2 id="poster-dialog-title">{poster?.title ?? "视觉作品"}</h2><button type="button" onClick={() => void close()}>关闭</button></div>
      <div className="lightbox-stage">{poster && <Image ref={(element) => {
        image.current = element;
        const thumbnail = thumbnails.current[index!]?.currentSrc || thumbnails.current[index!]?.src;
        if (element && !element.complete && thumbnail) element.style.backgroundImage = `url("${thumbnail}")`;
      }} key={poster.src} className="lightbox-image" src={poster.src} alt={poster.title} width={poster.width} height={poster.height} sizes="90vw" style={{ aspectRatio: `${poster.width} / ${poster.height}`, width: `min(100%, calc((100dvh - 220px) * ${poster.width / poster.height}))` }} onLoad={(event) => { event.currentTarget.style.backgroundImage = "none"; }} />}</div>
      <div className="lightbox-controls"><button type="button" disabled={index === null || index === 0} onClick={() => { if (activeIndex.current !== null) change(activeIndex.current - 1); }}>上一张</button><p role="status">{index === null ? 0 : index + 1} / {displayedPosters.length}</p><button type="button" disabled={index === null || index === displayedPosters.length - 1} onClick={() => { if (activeIndex.current !== null) change(activeIndex.current + 1); }}>下一张</button></div>
    </dialog>
  </>;
}
