import Image from "next/image";
import Link from "next/link";
import { HeroShowcase } from "@/components/HeroShowcase";
import { Arrow } from "@/components/Arrow";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { NoteCard } from "@/components/NoteCard";
import { posts } from "@/data/posts";
import { LiveDemo } from "@/components/LiveDemo";
import { OpeningDepth } from "@/components/OpeningDepth";

import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata({ path: "/", title: "ZWLY Lab — Vibe Coding 作品集", description: "与 AI 协作，把想法做成作品。浏览应用、交互实验与视觉创作，亲手体验演示，阅读构建手记。" });

export default function Home() {
  const selectedPosts = ["motion-for-understanding", "chinese-product-posters"].map((slug) => posts.find((post) => post.slug === slug)!);
  return <main id="main-content" className="container home-page">
    <OpeningDepth />
    <section className="hero hero-editorial" aria-labelledby="hero-title">
      <div className="hero-intro"><h1 id="hero-title"><span className="hero-name"><span className="opening-line-content">Vibe Coding.</span></span><span className="hero-subtitle"><span className="opening-line-content">把想法做成<span className="accent">作品</span>。</span></span></h1><p>与 AI 协作，从需求描述到运行验证。<br />这里收集我的应用、交互实验与视觉创作。</p><Link className="text-link" href="/projects">浏览作品集 <Arrow /></Link></div>
      <HeroShowcase />
    </section>
    <LiveDemo />
    <section className="home-products" aria-labelledby="work-title">
      <div className="section-header"><div><h2 id="work-title">应用与交互作品。</h2><p className="section-description">从一个需求出发，走进界面、操作与设计取舍。</p></div><Link className="text-link" href="/projects">查看全部作品 <Arrow /></Link></div>
      <div className="selected-work"><ProjectCard project={projects.find((project) => project.slug === "campus-takeout")!} /><div className="selected-work-links">{["pyscreen", "jd-protocol-engine"].map((slug) => {
        const project = projects.find((item) => item.slug === slug)!;
        return <Link key={slug} href={"/projects/" + slug}><span className="section-label">{project.category} · {project.demo ? "在线体验" : "成果展示"}</span><h3>{project.title}</h3><p>{project.description}</p><span className="text-link">展开作品 <Arrow /></span></Link>;
      })}</div></div>
    </section>
    <div className="experiment-links"><Link href="/projects/kmp-visualizer">KMP：理解失配回退 <Arrow /></Link><Link href="/projects/linked-list-merge">链表：跟随节点归并 <Arrow /></Link><Link href="/projects/gdp-timeline">数据练习：历史时间轴 <Arrow /></Link></div>
    <section className="visual-interlude" aria-labelledby="visual-title">
      <div className="visual-intro"><h2 id="visual-title">视觉创作。</h2><p>日常片段、纸张、水彩与光。<br />从同一个场景，探索不同的视觉表达。</p><Link className="text-link" href="/projects/poster-collection">走进视觉作品 <Arrow /></Link></div>
      <Link href="/projects/poster-collection" className="visual-print"><Image src="/images/posters/travel-diary.png" alt="旅行日记拼贴：海岛日落与纸张构图" width={1122} height={1402} sizes="(max-width: 760px) 46vw, 360px" /><span>旅行与日常</span></Link>
      <Link href="/projects/poster-collection" className="visual-print watercolor-print"><Image src="/images/posters/watercolor-kites.png" alt="风筝与歌声的水彩留白构图" width={919} height={1712} sizes="(max-width: 760px) 46vw, 300px" /><span>水彩与留白</span></Link>
    </section>
    <section className="home-writing" aria-labelledby="notes-title"><div className="section-header"><div><h2 id="notes-title">构建手记。</h2><p className="section-description">保留设计判断，让下一次迭代有据可循。</p></div><Link className="text-link" href="/blog">阅读手记 <Arrow /></Link></div><div className="notes-grid">{selectedPosts.map((post) => <NoteCard key={post.slug} post={post} />)}</div></section>
    <section className="home-about"><h2>一次错误提示，<br />也可以成为设计的起点。</h2><Link className="text-link" href="/about">看我怎样检查反馈与恢复 <Arrow /></Link></section>
  </main>;
}
