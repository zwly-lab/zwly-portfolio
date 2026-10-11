"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ActiveUnderline } from "./ActiveUnderline";
import { Arrow } from "./Arrow";

const views = [
  { label: "代码 → 画面", src: "/images/projects/pyscreen.png", width: 1440, height: 1000, kind: "workspace", title: "PyScreen · 从代码到画面", alt: "PyScreen 实际界面局部：Python 代码与画布", href: "/projects/pyscreen", action: "/demos/pyscreen/playground.html?level=6", actionLabel: "立即体验" },
  { label: "文字 → 过程", src: "/images/projects/kmp.png", width: 1440, height: 810, kind: "diagram", title: "KMP · 让匹配过程可以看见", alt: "KMP 实际演示：观察前缀与后缀的关系", href: "/projects/kmp-visualizer", action: "/demos/kmp/index.html", actionLabel: "逐步体验" },
  { label: "灵感 → 海报", src: "/images/posters/travel-diary.png", width: 1122, height: 1402, kind: "art", title: "旅行日记 · 从风景到视觉表达", alt: "已有旅行日记拼贴作品：海岛日落、纸张与手写文字", href: "/projects/poster-collection", action: "/projects/poster-collection", actionLabel: "浏览原作" },
] as const;

export function HeroShowcase() {
  const [selected, setSelected] = useState(0);
  const controls = useRef<HTMLDivElement>(null);
  const view = views[selected];
  return <figure className="hero-showcase">
    <div ref={controls} className="showcase-choices" role="group" aria-label="切换创作视角"><ActiveUnderline target={controls} value={view.href} />{views.map((item, index) => <button key={item.label} type="button" aria-pressed={index === selected} aria-controls="hero-artwork" onClick={() => setSelected(index)}>{item.label}</button>)}</div>
    <Link id="hero-artwork" key={view.src} className={"hero-preview showcase-frame " + view.kind} href={view.href} aria-label={"了解：" + view.title}><Image src={view.src} alt={view.alt} width={view.width} height={view.height} sizes="(max-width: 760px) 100vw, 760px" loading={selected === 0 ? "eager" : "lazy"} /></Link>
    <figcaption><span role="status">{view.title}</span><Link className="text-link" href={view.action}>{view.actionLabel} <Arrow /></Link></figcaption>
  </figure>;
}
