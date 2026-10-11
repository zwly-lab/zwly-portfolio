"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

const categories = ["全部", "应用工具", "教学可视化", "视觉创作"] as const;

export function ProjectCollection({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("全部");
  const visible = projects.filter((project) => category === "全部" || project.category === category);
  return <>
    <div className="collection-toolbar">
      <div className="project-filters" role="group" aria-label="按作品类型筛选">
        {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} aria-controls="filtered-projects" onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <p className="article-meta" role="status">{category} · {visible.length} 件作品</p>
    </div>
    <div key={category} id="filtered-projects" className="project-grid collection-results">{visible.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
  </>;
}
