import type { Metadata } from "next";
import { ContentBreadcrumb } from "@/components/ContentBreadcrumb";
import { Arrow } from "@/components/Arrow";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { PosterGallery } from "@/components/PosterGallery";

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
    <header className="page-header case-header"><ContentBreadcrumb href="/projects" label="作品" title={project.title} /><p className="article-meta">{project.category} · {project.status === "exploring" ? "探索中" : project.demo ? "可在线体验" : "成果展示"}</p><h1>{project.title}</h1><p>{project.description}</p>{project.demo && <a className="text-link" href={project.demo}>打开在线演示 <Arrow /></a>}{!project.demo && project.video && <a className="text-link" href="#product-film">观看产品演示 <Arrow /></a>}</header>
    {project.image && <figure className="project-media project-cover"><Image src={project.image.src} alt={project.title + " · " + project.image.caption} width={project.image.width} height={project.image.height} sizes="(max-width: 760px) 100vw, 1288px" /><figcaption>{project.image.caption}</figcaption></figure>}
    <section className="editorial-grid"><h2>{project.status === "exploring" ? "探索方向" : "产品介绍"}</h2><div className="prose"><p>{project.overview}</p><p className="article-meta">{project.stack.join(" / ")}</p></div></section>
    {project.steps && <section className="product-walkthrough" aria-labelledby="walkthrough-title"><div className="section-header"><h2 id="walkthrough-title">从输入到结果</h2></div><p className="prose">{project.audience}</p><ol>{project.steps.map((step, index) => <li key={step.title}><span className="step-number" aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></section>}
    {project.slug === "pyscreen" && <section className="feature-detail"><div><h2>代码怎样变成画面？</h2><p>编辑区与画布放在一起，运行后可以对照变量和执行轨迹。下面放大实际截图中的工作区，完整界面保留在上方。</p></div><figure className="project-media"><div className="detail-crop"><Image src="/images/projects/pyscreen.png" alt="PyScreen 实际界面局部：Python 编辑区、画布与变量面板" width={1440} height={1000} sizes="(max-width: 760px) 140vw, 1000px" /></div><figcaption>已有运行截图的局部放大 · 展示代码与画面的对应关系</figcaption></figure></section>}
    {project.gallery && <PosterGallery posters={project.gallery} />}
    {project.video && <figure id="product-film" className="project-media"><video controls playsInline poster={project.image?.src} preload="metadata" aria-label={project.title + " 产品演示视频"}><source src={project.video} type="video/mp4" /><a href={project.video}>下载产品演示视频</a></video><figcaption>产品演示 · 静音版 · 可暂停与拖动进度</figcaption></figure>}
    <section className="editorial-grid"><h2>{project.status === "exploring" ? "设计目标" : "功能与体验"}</h2><div className="prose"><ul>{project.focus.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
  </main>;
}
