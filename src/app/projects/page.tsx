import type { Metadata } from "next";
import { ProjectCollection } from "@/components/ProjectCollection";
import { projects } from "@/data/projects";
export const metadata: Metadata = { title: "作品" };
export default function ProjectsPage() {
  return <main id="main-content" className="container page-body"><header className="page-header"><h1>作品与实验。</h1><p>我的 Vibe Coding 成果，按应用、交互与视觉展开。在线工具可以直接体验；本地应用通过真实界面和演示了解，探索中的方向单独归档。</p></header><ProjectCollection projects={projects} /></main>;
}
