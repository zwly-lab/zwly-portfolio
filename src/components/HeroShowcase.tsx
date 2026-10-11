"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ActiveUnderline } from "./ActiveUnderline";
import { Arrow } from "./Arrow";

const scenes = [
  { label: "代码 → 画面", title: "PyScreen · 从代码到画面", slug: "pyscreen", src: "/images/projects/pyscreen.png", alt: "PyScreen 实际界面局部：Python 代码与画布", width: 1440, height: 1000, preview: "workspace", demo: "/demos/pyscreen/playground.html?level=6" },
  { label: "文字 → 过程", title: "KMP · 看见匹配与回退", slug: "kmp-visualizer", src: "/images/projects/kmp.png", alt: "KMP 实际界面：模式匹配与前缀表", width: 1440, height: 1000, preview: "diagram", demo: "/demos/kmp/index.html" },
  { label: "灵感 → 海报", title: "视觉创作 · 旅行日记拼贴", slug: "poster-collection", src: "/images/posters/travel-diary.png", alt: "已有视觉作品：旅行日记拼贴", width: 1122, height: 1402, preview: "poster", demo: null },
];

export function HeroShowcase() {
  const [index, setIndex] = useState(0);
  const controls = useRef<HTMLDivElement>(null);
  const scene = scenes[index];
  return <figure className="hero-showcase">
    <div ref={controls} className="showcase-controls" role="group" aria-label="选择作品预览"><ActiveUnderline target={controls} value={scene.slug} />{scenes.map((item, position) => <button key={item.slug} type="button" aria-pressed={position === index} aria-controls="hero-artwork" onClick={() => setIndex(position)}>{item.label}</button>)}</div>
    <Link id="hero-artwork" key={scene.slug} className="hero-preview" data-preview={scene.preview} href={"/projects/" + scene.slug} aria-label={"查看 " + scene.title + " 产品介绍"}><Image src={scene.src} alt={scene.alt} width={scene.width} height={scene.height} sizes="(max-width: 760px) 100vw, 780px" loading="eager" /></Link>
    <figcaption><span role="status">{scene.title}</span><Link className="text-link" href={scene.demo ?? "/projects/" + scene.slug}>{scene.demo ? "立即体验" : "浏览作品"} <Arrow /></Link></figcaption>
  </figure>;
}
