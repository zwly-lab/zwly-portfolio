"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ActiveUnderline } from "./ActiveUnderline";

const categories = ["全部", "应用工具", "教学可视化", "视觉创作"] as const;

export function ProjectCollection({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("全部");
  const filters = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const previous = useRef<Map<string, DOMRect> | null>(null);
  const visible = projects.filter((project) => category === "全部" || project.category === category);
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
    cards?.forEach((card) => {
      const before = positions.get(card.dataset.project!);
      const after = card.getBoundingClientRect();
      card.animate(before ? [
        { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px)` },
        { transform: "none" },
      ] : [{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
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
    <div ref={grid} id="filtered-projects" className="project-grid">{visible.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
  </>;
}
