"use client";

import Image, { getImageProps } from "next/image";
import Link from "@/components/NavigationLink";
import { useLayoutEffect, useRef, useState } from "react";
import { ActiveUnderline } from "./ActiveUnderline";
import { Arrow } from "./Arrow";
import { motionTiming } from "@/lib/motion";
import { featuredImages, featuredPreviews, previewSizes } from "@/data/featured";
import { useOpeningPrefetch } from "@/lib/useOpeningPrefetch";

const views = [
  { label: "精选一览", kind: "selected", text: "应用、交互与视觉，同一个作品集里的三种探索。选择方向，继续展开。", items: featuredPreviews },
  { label: "交互实验", kind: "learning", text: "从代码执行到算法回退，让知识的变化过程可以被看见。", items: [
    { title: "PyScreen · Python 练习台", src: "/images/projects/pyscreen.png", width: 1440, height: 1000, slug: "pyscreen", alt: "真实 Python 练习台：任务、代码和运行反馈" },
    { title: "KMP · 字符串匹配", src: "/images/projects/kmp-matching.png", width: 1440, height: 810, slug: "kmp-visualizer", alt: "KMP 真实演示：next 数组与字符逐步比较" },
  ] },
  { label: "应用作品", kind: "applications", text: "围绕点餐与本地任务，把信息组织成可以继续操作的路径。", items: [
    { title: "JD · 本地任务控制台", src: "/images/projects/jd-dashboard.png", width: 1600, height: 1000, slug: "jd-protocol-engine", alt: "JD 本地任务控制台的实际界面" },
    { title: "Campus · 校园点餐", src: "/images/projects/campus-menu.png", width: 392, height: 714, slug: "campus-takeout", alt: "已有校园点餐菜单截图" },
  ] },
  { label: "视觉创作", kind: "visual", text: "从日常灵感到产品信息，以不同的画幅探索构图和叙事。", items: [
    { title: "旅行与日常", src: "/images/posters/travel-diary.png", width: 1122, height: 1402, slug: "poster-collection", alt: "旅行日记原作：圣托里尼拼贴" },
    { title: "产品视觉", src: "/images/posters/jd-overview.png", width: 794, height: 1123, slug: "poster-collection", alt: "已有 JD 产品海报：A4 画幅的信息构图" },
  ] },
];

export function HeroShowcase() {
  const prefetch = useOpeningPrefetch();
  const [selected, setSelected] = useState(0);
  const [requested, setRequested] = useState(0);
  const [failed, setFailed] = useState(false);
  const request = useRef(0);
  const requestedIndex = useRef(0);
  const controls = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const previous = useRef<Map<string, { bounds: DOMRect; opacity: string; clipPath: string }> | null>(null);
  const view = views[selected];
  useLayoutEffect(() => () => { request.current++; }, []);
  async function select(next: number) {
    if (next === requestedIndex.current) return;
    requestedIndex.current = next;
    setRequested(next);
    setFailed(false);
    const version = ++request.current;
    if (next === selected) return;
    try {
      await Promise.all(views[next].items.map((item, index) => {
        const { props } = getImageProps({ src: featuredImages[item.src] ?? item.src, alt: item.alt, width: item.width, height: item.height, sizes: previewSizes(index) });
        const image = new window.Image();
        image.sizes = props.sizes ?? "";
        image.srcset = props.srcSet ?? "";
        image.src = props.src;
        return image.decode();
      }));
    } catch {
      if (version === request.current) { requestedIndex.current = selected; setRequested(selected); setFailed(true); }
      return;
    }
    if (version !== request.current) return;
    previous.current = new Map(Array.from(grid.current?.querySelectorAll<HTMLElement>("[data-preview]") ?? [], (item) => {
      const bounds = item.getBoundingClientRect();
      const { opacity, clipPath } = getComputedStyle(item);
      item.getAnimations().forEach((animation) => animation.cancel());
      return [item.dataset.preview!, { bounds, opacity, clipPath }];
    }));
    setSelected(next);
  }
  useLayoutEffect(() => {
    const positions = previous.current;
    previous.current = null;
    if (!positions || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = grid.current?.querySelectorAll<HTMLElement>("[data-preview]");
    items?.forEach((item) => {
      const before = positions.get(item.dataset.preview!);
      const after = item.getBoundingClientRect();
      item.animate(before ? [
        { transform: `translate(${before.bounds.left - after.left}px, ${before.bounds.top - after.top}px) scale(${before.bounds.width / after.width}, ${before.bounds.height / after.height})`, opacity: before.opacity, clipPath: before.clipPath },
        { transform: "none", opacity: 1, clipPath: "inset(0)" },
      ] : [{ opacity: 0, transform: "translateY(8px)", clipPath: "inset(0 0 18%)" }, { opacity: 1, transform: "none", clipPath: "inset(0)" }], { ...motionTiming("enter"), delay: before ? 0 : 40, fill: "backwards" });
    });
    return () => { items?.forEach((item) => item.getAnimations().forEach((animation) => animation.cancel())); };
  }, [selected]);
  return <div className="hero-showcase portfolio-showcase">
    <div ref={controls} className="showcase-choices" role="group" aria-label="切换作品方向"><ActiveUnderline target={controls} value={views[requested].label} />{views.map((item, index) => <button key={item.label} type="button" aria-pressed={index === requested} aria-controls="portfolio-overview" onClick={() => void select(index)}>{item.label}</button>)}</div>
    <div ref={grid} id="portfolio-overview" aria-busy={requested !== selected} className={"overview-images overview-" + view.kind}>
      {view.items.map((item, index) => <Link prefetch={prefetch ? undefined : false} data-preview={item.src} key={item.src} href={"/projects/" + item.slug} className={"overview-work overview-work--" + item.slug}><div className="overview-frame"><Image src={featuredImages[item.src] ?? item.src} alt={item.alt} width={item.width} height={item.height} sizes={previewSizes(index)} preload={selected === 0 && index === 0} loading={selected === 0 && index === 0 ? undefined : "eager"} /></div><span>{item.title}<Arrow /></span></Link>)}
    </div>
    <p className="overview-description" role="status"><span key={requested !== selected ? "loading" : failed ? "error" : view.kind} className="state-arrival">{requested !== selected ? "正在加载" + views[requested].label + "预览，当前作品仍可打开。" : failed ? "预览未能加载。请重试切换，或通过浏览作品集入口继续。" : view.text}</span></p>
  </div>;
}
