"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ActiveUnderline } from "./ActiveUnderline";
import { motionTiming } from "@/lib/motion";

const categories = ["全部", "应用工具", "教学可视化", "视觉创作"] as const;

export function ProjectCollection({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("全部");
  const filters = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const previous = useRef<Map<string, DOMRect> | null>(null);
  const visible = projects.filter((project) => category === "全部" || project.category === category);
  const groups = [
    { title: "代表作品", description: "从学习反馈到任务界面，展开具体的问题与设计取舍。", slugs: ["pyscreen", "campus-takeout", "jd-protocol-engine"] },
    { title: "学习与实验", description: "用可操作的过程理解算法，用历史资料练习可视化。", slugs: ["kmp-visualizer", "linked-list-merge", "gdp-timeline"] },
    { title: "视觉创作", description: "按系列观看原作、构图与方向探索。", slugs: ["poster-collection"] },
    { title: "探索中的方向", description: "仍处于概念研究，没有可用产品。", slugs: ["ai-writing-coach", "ai-agent-lab"] },
  ];
  function select(item: (typeof categories)[number]) {
    if (item === category) return;
    previous.current = new Map(Array.from(grid.current?.querySelectorAll<HTMLElement>("[data-project]") ?? [], (card) => {
      const bounds = card.getBoundingClientRect();
      card.getAnimations().forEach((animation) => animation.cancel());
      return [card.dataset.project!, bounds];
    }));
    setCategory(item);
  }
  useLayoutEffect(() => {
    const positions = previous.current;
    previous.current = null;
    if (!positions || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = grid.current?.querySelectorAll<HTMLElement>("[data-project]");
    const timing = motionTiming("change");
    cards?.forEach((card) => {
      const before = positions.get(card.dataset.project!);
      const after = card.getBoundingClientRect();
      card.animate(before ? [
        { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px)` },
        { transform: "none" },
      ] : [{ opacity: 0 }, { opacity: 1 }], timing);
    });
    return () => { cards?.forEach((card) => card.getAnimations().forEach((animation) => animation.cancel())); };
  }, [category]);
  return <>
    <div className="collection-toolbar">
      <div ref={filters} className="project-filters" role="group" aria-label="按作品类型筛选">
        <ActiveUnderline target={filters} value={category} />
        {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} aria-controls="filtered-projects" onClick={() => select(item)}>{item}</button>)}
      </div>
      <p className="article-meta" role="status">{category} · {visible.length} 件作品</p>
    </div>
    <div ref={grid} id="filtered-projects" className="collection-results">{groups.map((group) => {
      const items = group.slugs.map((slug) => visible.find((project) => project.slug === slug)).filter((item): item is Project => !!item);
      if (!items.length) return null;
      return <section key={group.title} className={"work-group " + (group.title === "探索中的方向" ? "work-explorations" : group.title === "视觉创作" ? "work-visuals" : "")}><div className="work-group-header"><h2>{group.title}</h2><p>{group.description}</p></div><div className="project-grid">{items.map((project) => <ProjectCard key={project.slug} project={project} />)}</div></section>;
    })}</div>
  </>;
}
