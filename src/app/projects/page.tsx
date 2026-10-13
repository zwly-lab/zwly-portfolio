import type { Metadata } from "next";
import { ProjectCollection } from "@/components/ProjectCollection";
import { projects } from "@/data/projects";
export const metadata: Metadata = { title: "作品" };
export default function ProjectsPage() {
  return <main id="main-content" className="container page-body collection-page"><header className="page-header"><h1>作品与实验。</h1><p>应用、交互与视觉。打开一件作品，看看它怎样从想法成为成果。</p></header><ProjectCollection projects={projects} /></main>;
}
