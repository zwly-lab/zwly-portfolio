import type { Metadata } from "next";
import { ProjectCollection } from "@/components/ProjectCollection";
import { projects } from "@/data/projects";
export const metadata: Metadata = { title: "作品" };
export default function ProjectsPage() {
  return <main id="main-content" className="container page-body"><header className="page-header"><h1>值得展开的作品。</h1><p>先看代表作品，再走进实验与视觉创作。在线工具可以直接体验；本地应用通过真实界面和演示了解。</p></header><ProjectCollection projects={projects} /></main>;
}
