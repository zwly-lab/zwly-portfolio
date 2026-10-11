import Link from "next/link";
import { HeroShowcase } from "@/components/HeroShowcase";
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
        <div className="hero-intro">
          <h1 id="hero-title"><span>把复杂知识，</span><span>做成<span className="accent hero-emphasis">可体验</span></span><span>的工具。</span></h1>
          <p>用教学可视化帮助理解，用全栈应用解决问题，<br className="desktop-break" />也用 AI 探索视觉表达。</p>
          <div className="link-group"><Link className="text-link" href="/projects">浏览作品 <Arrow /></Link><a className="text-link secondary" href={site.github}>GitHub <Arrow /></a></div>
        </div>
        <HeroShowcase />
      </section>
      <section aria-labelledby="work-title">
        <div className="section-header"><h2 id="work-title">作品，持续生长。</h2><Link className="text-link" href="/projects">查看全部作品 <Arrow /></Link></div>
        <div className="project-grid">{projects.filter(({ slug }) => ["pyscreen", "campus-takeout", "poster-collection"].includes(slug)).map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
      </section>
      <section className="practice" aria-labelledby="practice-title"><h2 id="practice-title">保持好奇，认真构建。</h2><TechStack /></section>
      <section className="practice" aria-labelledby="notes-title"><h2 id="notes-title">构建中的手记。</h2><div className="notes-grid">{posts.slice(0, 2).map((post) => <NoteCard key={post.slug} post={post} />)}</div><Link className="text-link" href="/blog">阅读全部手记 <Arrow /></Link></section>
    </main>
  );
}
