import Link from "next/link";
import { Arrow } from "./Arrow";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <Link href={"/projects/" + project.slug} className="project-row"><span className="project-number">{String(index + 1).padStart(2, "0")}</span><div className="project-copy"><h3>{project.title}</h3><p>{project.description}</p></div><div className="project-tech"><p>{project.stack.join(" · ")}</p>{project.status === "exploring" && <span className="project-status">探索方向</span>}</div><Arrow /></Link>;
}