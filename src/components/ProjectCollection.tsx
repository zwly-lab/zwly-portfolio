"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

const categories = ["全部", "应用工具", "教学可视化", "视觉创作"] as const;

export function ProjectCollection({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("全部");
  const visible = projects.filter((project) => category === "全部" || project.category === category);
  const groups = [
    { title: "代表作品", description: "从学习反馈到任务界面，展开具体的问题与设计取舍。", slugs: ["pyscreen", "campus-takeout", "jd-protocol-engine"] },
    { title: "学习与实验", description: "用可操作的过程理解算法，用历史资料练习可视化。", slugs: ["kmp-visualizer", "linked-list-merge", "gdp-timeline"] },
    { title: "视觉创作", description: "按系列观看原作、构图与方向探索。", slugs: ["poster-collection"] },
    { title: "探索中的方向", description: "仍处于概念研究，没有可用产品。", slugs: ["ai-writing-coach", "ai-agent-lab"] },
  ];
  return <>
    <div className="collection-toolbar">
      <div className="project-filters" role="group" aria-label="按作品类型筛选">
        {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} aria-controls="filtered-projects" onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <p className="article-meta" role="status">{category} · {visible.length} 件作品</p>
    </div>
    <div key={category} id="filtered-projects" className="collection-results">{groups.map((group) => {
      const items = group.slugs.map((slug) => visible.find((project) => project.slug === slug)).filter((item): item is Project => !!item);
      if (!items.length) return null;
      return <section key={group.title} className={"work-group " + (group.title === "探索中的方向" ? "work-explorations" : group.title === "视觉创作" ? "work-visuals" : "")}><div className="work-group-header"><h2>{group.title}</h2><p>{group.description}</p></div><div className="project-grid">{items.map((project) => <ProjectCard key={project.slug} project={project} />)}</div></section>;
    })}</div>
  </>;
}
