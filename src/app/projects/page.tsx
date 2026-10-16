import { pageMetadata } from "@/lib/metadata";
import { ProjectCollection } from "@/components/ProjectCollection";
import { projects } from "@/data/projects";
export const metadata = pageMetadata({ path: "/projects", title: "作品 · ZWLY Lab", description: "应用、交互实验与视觉创作。浏览真实成果、操作演示与设计取舍。" });
export default function ProjectsPage() {
  return <main id="main-content" className="container page-body collection-page"><header className="page-header"><h1>作品与实验。</h1><p>应用、交互与视觉。打开一件作品，看看它怎样从想法成为成果。</p></header><ProjectCollection projects={projects} /></main>;
}
