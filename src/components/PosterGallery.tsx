"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { Project } from "@/data/projects";
import { Arrow } from "./Arrow";

export function PosterGallery({ posters }: { posters: NonNullable<Project["gallery"]> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const poster = index === null ? null : posters[index];
  const transition = useRef<ViewTransition | null>(null);
  const activeIndex = useRef<number | null>(null);
  const groups = [
    { title: "旅行与日常", text: "纸张、手写标记和暖色，串起海岛与餐桌的记忆。", items: posters.filter((item) => /food-|travel-|santorini-/.test(item.src)), selected: ["travel-diary.png", "food-diary-corgi.png", "santorini-illustration.png"] },
    { title: "水彩与留白", text: "保留歌声与风筝，比较主体位置、画面重心和留白。", items: posters.filter((item) => item.src.includes("watercolor-")) },
    { title: "产品视觉", text: "同一个产品，面对 A4、竖屏与横屏，重新组织信息。", items: posters.filter((item) => item.src.includes("/jd-")) },
    { title: "界面方向归档", text: "四套早期网站概念，记录方向选择。概念图中的界面与数字不代表实际产品状态。", items: posters.filter((item) => item.src.includes("portfolio-style-")), archive: true },
  ];

  function change(next: number) {
    if (!dialog.current?.open || next < 0 || next >= posters.length) return;
    activeIndex.current = next;
    transition.current?.skipTransition();
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIndex(next);
      return;
    }
    transition.current = document.startViewTransition(() => {
      if (activeIndex.current === next) flushSync(() => setIndex(next));
    });
    // Interrupting the animation rejects ready; unexpected transition errors still surface.
    void transition.current.ready.catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === "AbortError")) throw error;
    });
  }

  function open(index: number) {
    if (dialog.current?.open) return;
    activeIndex.current = index;
    setIndex(index);
    dialog.current?.showModal();
  }

  return <>
    {groups.map((group) => {
      const featured = group.selected ? group.selected.map((file) => group.items.find((item) => item.src.endsWith(file))!).filter(Boolean) : group.items;
      const variants = group.items.filter((item) => !featured.includes(item));
      const render = (items: typeof posters) => <div className="poster-grid series-grid">{items.map((item) => <figure key={item.src} className="project-media">
        <button className="poster-open" type="button" aria-haspopup="dialog" aria-label={"放大查看：" + item.title} onClick={() => open(posters.indexOf(item))}><Image src={item.src} alt={item.title} width={item.width} height={item.height} sizes="(max-width: 760px) 100vw, 420px" /></button>
        <figcaption>{item.title}<a href={item.src} target="_blank" rel="noopener noreferrer">查看原图 <Arrow /></a></figcaption>
      </figure>)}</div>;
      return <section key={group.title} className={"gallery-series " + (group.archive ? "gallery-archive" : "")} aria-label={group.title}><div className="gallery-series-header"><h3>{group.title}</h3><p>{group.text}</p></div>
        {group.archive ? <details><summary>展开四套界面概念</summary>{render(featured)}</details> : <>{render(featured)}{variants.length > 0 && <details><summary>查看这个系列的其他 {variants.length} 张作品</summary>{render(variants)}</details>}</>}
      </section>;
    })}
    <dialog ref={dialog} className="poster-dialog" aria-labelledby="poster-dialog-title" onClose={() => { activeIndex.current = null; transition.current?.skipTransition(); setIndex(null); }} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={(event) => {
      if (activeIndex.current === null) return;
      if (event.key === "ArrowRight") { event.preventDefault(); change(activeIndex.current + 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); change(activeIndex.current - 1); }
    }}>
      <div className="lightbox-toolbar"><h2 id="poster-dialog-title">{poster?.title ?? "视觉作品"}</h2><button type="button" onClick={() => { transition.current?.skipTransition(); dialog.current?.close(); }}>关闭</button></div>
      {poster && <Image key={poster.src} className="lightbox-image" src={poster.src} alt={poster.title} width={poster.width} height={poster.height} sizes="90vw" />}
      <div className="lightbox-controls"><button type="button" disabled={index === null || index === 0} onClick={() => { if (activeIndex.current !== null) change(activeIndex.current - 1); }}>上一张</button><p role="status">{index === null ? 0 : index + 1} / {posters.length}</p><button type="button" disabled={index === null || index === posters.length - 1} onClick={() => { if (activeIndex.current !== null) change(activeIndex.current + 1); }}>下一张</button></div>
    </dialog>
  </>;
}
