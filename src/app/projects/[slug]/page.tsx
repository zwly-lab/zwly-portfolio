import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return { title: project?.title ?? "作品未找到", description: project?.description };
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return <main id="main-content" className="container page-body"><header className="page-header"><Link href="/projects" className="text-link back-link">返回作品</Link><h1>{project.title}</h1><p>{project.description}</p></header><section className="editorial-grid"><h2>{project.status === "exploring" ? "探索方向" : "项目概览"}</h2><div className="prose"><p>{project.overview}</p><p className="article-meta">{project.stack.join(" / ")}</p></div></section><section className="editorial-grid"><h2>关注的问题</h2><div className="prose"><ul>{project.focus.map((item) => <li key={item}>{item}</li>)}</ul></div></section></main>;
}
