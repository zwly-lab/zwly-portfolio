"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ActiveUnderline } from "./ActiveUnderline";
import { Arrow } from "./Arrow";

const views = [
  { label: "交互式学习", text: "从代码执行到算法回退，让知识的变化过程可以被看见。", items: [
    { title: "PyScreen · Python 练习台", src: "/images/projects/pyscreen.png", width: 1440, height: 1000, slug: "pyscreen", alt: "真实 Python 练习台：任务、代码和运行反馈" },
    { title: "KMP · 字符串匹配", src: "/images/projects/kmp.png", width: 1440, height: 810, slug: "kmp-visualizer", alt: "KMP 真实演示：前缀与后缀的关系" },
  ] },
  { label: "应用与界面", text: "围绕点餐与本地任务，把信息组织成可以继续操作的路径。", items: [
    { title: "JD · 本地任务控制台", src: "/images/projects/jd-dashboard.png", width: 1600, height: 1000, slug: "jd-protocol-engine", alt: "JD 本地任务控制台的实际界面" },
    { title: "Campus · 校园点餐", src: "/images/projects/campus-menu.png", width: 392, height: 714, slug: "campus-takeout", alt: "已有校园点餐菜单截图" },
  ] },
  { label: "视觉与表达", text: "从日常灵感到产品信息，以不同的画幅探索构图和叙事。", items: [
    { title: "旅行与日常", src: "/images/posters/travel-diary.png", width: 1122, height: 1402, slug: "poster-collection", alt: "旅行日记原作：圣托里尼拼贴" },
    { title: "产品视觉", src: "/images/posters/jd-overview.png", width: 794, height: 1123, slug: "poster-collection", alt: "已有 JD 产品海报：A4 画幅的信息构图" },
  ] },
];

export function HeroShowcase() {
  const [selected, setSelected] = useState(0);
  const controls = useRef<HTMLDivElement>(null);
  const view = views[selected];
  return <div className="hero-showcase portfolio-showcase">
    <div ref={controls} className="showcase-choices" role="group" aria-label="切换作品方向"><ActiveUnderline target={controls} value={view.label} />{views.map((item, index) => <button key={item.label} type="button" aria-pressed={index === selected} aria-controls="portfolio-overview" onClick={() => setSelected(index)}>{item.label}</button>)}</div>
    <div id="portfolio-overview" key={view.label} className={"overview-images overview-view-" + selected}>
      {view.items.map((item, index) => <Link key={item.src} href={"/projects/" + item.slug} className="overview-work"><Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes={index === 0 ? "(max-width: 760px) 60vw, 580px" : "(max-width: 760px) 30vw, 300px"} loading={selected === 0 ? "eager" : "lazy"} /><span>{item.title}<Arrow /></span></Link>)}
    </div>
    <p className="overview-description" role="status">{view.text}</p>
  </div>;
}
