"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { Arrow } from "./Arrow";

export function PosterGallery({ posters }: { posters: NonNullable<Project["gallery"]> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const thumbnails = useRef<(HTMLImageElement | null)[]>([]);
  const source = useRef<DOMRect | null>(null);
  const direction = useRef(0);
  const animation = useRef<Animation | null>(null);
  const closing = useRef(false);
  const [index, setIndex] = useState<number | null>(null);
  const poster = index === null ? null : posters[index];

  function open(index: number) {
    if (dialog.current?.open) return;
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
    const motion = element.animate([{ transform, opacity: start ? 1 : 0 }, { transform: "none", opacity: 1 }], {
      duration: start ? 400 : 220, easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    });
    animation.current = motion;
    return () => motion.cancel();
  }, [index]);

  function change(next: number) {
    if (closing.current || index === null || next < 0 || next >= posters.length || next === index) return;
    direction.current = next > index ? 1 : -1;
    setIndex(next);
  }

  async function close() {
    if (closing.current || !dialog.current?.open) return;
    const element = image.current;
    const destination = index === null ? null : thumbnails.current[index]?.getBoundingClientRect();
    closing.current = true;
    if (element && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const current = element.getBoundingClientRect();
      animation.current?.cancel();
      const base = element.getBoundingClientRect();
      const toThumbnail = destination && destination.bottom > 0 && destination.top < window.innerHeight;
      const motion = element.animate([
        { transform: `translate(${current.left - base.left}px, ${current.top - base.top}px) scale(${current.width / base.width}, ${current.height / base.height})`, opacity: 1 },
        { transform: toThumbnail ? `translate(${destination.left - base.left}px, ${destination.top - base.top}px) scale(${destination.width / base.width}, ${destination.height / base.height})` : "none", opacity: toThumbnail ? 1 : 0 },
      ], { duration: 220, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" });
      animation.current = motion;
      // Cancellation (including navigation) must still release the native modal.
      await motion.finished.catch(() => {});
    }
    dialog.current?.close();
    animation.current?.cancel();
    closing.current = false;
  }

  return <>
    <section className="poster-grid" aria-label="海报与视觉作品展示">{posters.map((item, itemIndex) => <figure key={item.src} className="project-media">
      <button className="poster-open" type="button" aria-haspopup="dialog" aria-label={"放大查看：" + item.title} onClick={() => open(itemIndex)}><Image ref={(element) => { thumbnails.current[itemIndex] = element; }} src={item.src} alt={item.title} width={item.width} height={item.height} sizes="(max-width: 760px) 100vw, 628px" /><span className="poster-open-label">放大查看 <Arrow /></span></button>
      <figcaption>{item.title} · <a href={item.src} target="_blank" rel="noopener noreferrer">查看原图 <Arrow /></a></figcaption>
    </figure>)}</section>
    <dialog ref={dialog} className="poster-dialog" aria-labelledby="poster-dialog-title" onCancel={(event) => { event.preventDefault(); void close(); }} onClose={() => { closing.current = false; setIndex(null); }} onClick={(event) => { if (event.target === event.currentTarget) void close(); }} onKeyDown={(event) => {
      if (index === null) return;
      if (event.key === "ArrowRight") { event.preventDefault(); change(index + 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); change(index - 1); }
    }}>
      <div className="lightbox-toolbar"><h2 id="poster-dialog-title">{poster?.title ?? "视觉作品"}</h2><button type="button" onClick={() => void close()}>关闭</button></div>
      {poster && <Image ref={image} key={poster.src} className="lightbox-image" src={poster.src} alt={poster.title} width={poster.width} height={poster.height} sizes="90vw" />}
      <div className="lightbox-controls"><button type="button" disabled={index === null || index === 0} onClick={() => change((index ?? 0) - 1)}>上一张</button><p role="status">{index === null ? 0 : index + 1} / {posters.length}</p><button type="button" disabled={index === null || index === posters.length - 1} onClick={() => change((index ?? 0) + 1)}>下一张</button></div>
    </dialog>
  </>;
}
