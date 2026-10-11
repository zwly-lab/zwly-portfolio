import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
  return <main id="main-content" className="container page-body">
    <header className="page-header"><Link href="/projects" className="text-link back-link">返回作品</Link><h1>{project.title}</h1><p>{project.description}</p>{project.demo && <a className="text-link" href={project.demo}>打开在线演示 ↗</a>}</header>
    <section className="editorial-grid"><h2>{project.status === "exploring" ? "探索方向" : "项目概览"}</h2><div className="prose"><p>{project.overview}</p><p className="article-meta">{project.stack.join(" / ")}</p></div></section>
    {project.gallery && <section className="poster-grid" aria-label="海报与视觉作品展示">{project.gallery.map((poster) => <figure key={poster.src} className="project-media">
      <a href={poster.src} target="_blank" rel="noopener noreferrer" aria-label={"查看原图：" + poster.title + "（新标签页）"}><Image src={poster.src} alt={poster.title} width={poster.width} height={poster.height} sizes="(max-width: 760px) 100vw, 628px" /></a>
      <figcaption>{poster.title} · <a href={poster.src} target="_blank" rel="noopener noreferrer">查看原图 ↗</a></figcaption>
    </figure>)}</section>}
    {project.image && <figure className="project-media"><Image src={project.image} alt={project.title + " 本地控制台界面截图"} width={1600} height={1000} sizes="(max-width: 760px) 100vw, 1288px" /><figcaption>本地运行界面 · 静态截图</figcaption></figure>}
    {project.video && <figure className="project-media"><video controls playsInline poster={project.image} preload="metadata" aria-label={project.title + " 产品演示视频"}><source src={project.video} type="video/mp4" /><a href={project.video}>下载产品演示视频</a></video><figcaption>产品演示 · 静音版</figcaption></figure>}
    <section className="editorial-grid"><h2>关注的问题</h2><div className="prose"><ul>{project.focus.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
  </main>;
}
