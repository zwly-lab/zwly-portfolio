import type { Metadata } from "next";
import { ProjectCollection } from "@/components/ProjectCollection";
import { projects } from "@/data/projects";
export const metadata: Metadata = { title: "作品" };
export default function ProjectsPage() {
  return <main id="main-content" className="container page-body"><header className="page-header"><h1>作品，持续生长。</h1><p>体验教学工具，了解应用成果，浏览视觉创作。每件作品保留实际进展与使用边界。</p></header><ProjectCollection projects={projects} /></main>;
}
