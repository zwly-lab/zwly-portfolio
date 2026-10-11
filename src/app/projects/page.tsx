import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";
export const metadata: Metadata = { title: "作品" };
export default function ProjectsPage() {
  return <main id="main-content" className="container page-body"><header className="page-header"><p className="section-label">SELECTED WORK</p><h1>作品，持续生长。</h1><p>从具体问题出发，在构建中学习。这里收录正在迭代的项目，也保留值得继续探索的方向。</p></header><div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div></main>;
}