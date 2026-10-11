// Adapted from magicuidesign/portfolio ProjectCard; MIT notice in licenses/.
import Link from "next/link";
import Image from "next/image";
import { Arrow } from "./Arrow";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cover = project.image ?? project.gallery?.[0];
  return (
    <Link href={"/projects/" + project.slug} className="work-card">
      {cover && <Image className="project-thumbnail" src={cover.src} alt={project.title + (project.status === "exploring" ? "概念预览" : "效果预览")} width={cover.width} height={cover.height} sizes="(max-width: 760px) 100vw, (max-width: 1050px) 50vw, 400px" />}
      <div className="work-card-body">
        <div className="card-heading"><span className="section-label">{String(index + 1).padStart(2, "0")} / {project.status === "exploring" ? "探索方向" : project.demo ? "在线体验" : "成果展示"}</span><Arrow /></div>
        <h3>{project.title}</h3><p>{project.description}</p>
        <div className="card-tags">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
    </Link>
  );
}
