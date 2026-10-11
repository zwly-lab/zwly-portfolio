import Link from "next/link";
import Image from "next/image";
import { Arrow } from "@/components/Arrow";
import { ProjectCard } from "@/components/ProjectCard";
import { TechStack } from "@/components/TechStack";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { NoteCard } from "@/components/NoteCard";
import { posts } from "@/data/posts";

export default function Home() {
  return (
    <main id="main-content" className="container">
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title"><span>Ideas into</span><span className="accent">intelligent</span><span>products.</span></h1>
        <div className="hero-intro">
          <h2>AI Native Full Stack Developer</h2>
          <p>以代码实现想法，以 AI 拓展可能。<br />探索 AI、全栈开发与真实问题之间的连接。</p>
          <div className="link-group"><Link className="text-link" href="/projects">浏览作品 <Arrow /></Link><a className="text-link secondary" href={site.github}>GitHub <Arrow /></a></div>
          <Link className="hero-preview" href="/projects/pyscreen" aria-label="查看 PyScreen 产品介绍"><Image src="/images/projects/pyscreen.png" alt="PyScreen 实际运行：Python 代码与画布" width={1440} height={1000} sizes="(max-width: 760px) 100vw, 560px" loading="eager" /></Link>
        </div>
      </section>
      <section aria-labelledby="work-title">
        <div className="section-header"><h2 id="work-title">作品，持续生长。</h2><Link className="text-link" href="/projects">查看全部作品 <Arrow /></Link></div>
        <div className="project-grid">{projects.slice(0, 3).map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
      </section>
      <section className="practice" aria-labelledby="practice-title"><h2 id="practice-title">保持好奇，认真构建。</h2><TechStack /></section>
      <section className="practice" aria-labelledby="notes-title"><h2 id="notes-title">构建中的手记。</h2><div className="notes-grid">{posts.slice(0, 2).map((post) => <NoteCard key={post.slug} post={post} />)}</div><Link className="text-link" href="/blog">阅读全部手记 <Arrow /></Link></section>
    </main>
  );
}
