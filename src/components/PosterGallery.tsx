"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { Arrow } from "./Arrow";

export function PosterGallery({ posters }: { posters: NonNullable<Project["gallery"]> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const poster = index === null ? null : posters[index];

  function open(index: number) {
    if (dialog.current?.open) return;
    setIndex(index);
    dialog.current?.showModal();
  }

  return <>
    <section className="poster-grid" aria-label="海报与视觉作品展示">{posters.map((item, itemIndex) => <figure key={item.src} className="project-media">
      <button className="poster-open" type="button" aria-haspopup="dialog" aria-label={"放大查看：" + item.title} onClick={() => open(itemIndex)}><Image src={item.src} alt={item.title} width={item.width} height={item.height} sizes="(max-width: 760px) 100vw, 628px" /></button>
      <figcaption>{item.title} · <a href={item.src} target="_blank" rel="noopener noreferrer">查看原图 <Arrow /></a></figcaption>
    </figure>)}</section>
    <dialog ref={dialog} className="poster-dialog" aria-labelledby="poster-dialog-title" onClose={() => setIndex(null)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={(event) => {
      if (index === null) return;
      if (event.key === "ArrowRight") { event.preventDefault(); setIndex(Math.min(index + 1, posters.length - 1)); }
      if (event.key === "ArrowLeft") { event.preventDefault(); setIndex(Math.max(index - 1, 0)); }
    }}>
      <div className="lightbox-toolbar"><h2 id="poster-dialog-title">{poster?.title ?? "视觉作品"}</h2><button type="button" onClick={() => dialog.current?.close()}>关闭</button></div>
      {poster && <Image key={poster.src} className="lightbox-image" src={poster.src} alt={poster.title} width={poster.width} height={poster.height} sizes="90vw" />}
      <div className="lightbox-controls"><button type="button" disabled={index === null || index === 0} onClick={() => setIndex((value) => Math.max((value ?? 0) - 1, 0))}>上一张</button><p role="status">{index === null ? 0 : index + 1} / {posters.length}</p><button type="button" disabled={index === null || index === posters.length - 1} onClick={() => setIndex((value) => Math.min((value ?? 0) + 1, posters.length - 1))}>下一张</button></div>
    </dialog>
  </>;
}
