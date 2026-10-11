import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { ProjectCard } from "@/components/ProjectCard";
import { TechStack } from "@/components/TechStack";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function Home() {
  return (
    <main id="main-content" className="container">
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title"><span>Ideas into</span><span className="accent">intelligent</span><span>products.</span></h1>
        <div className="hero-intro">
          <h2>AI Native Full Stack Developer</h2>
          <p>以代码实现想法，以 AI 拓展可能。<br />探索 AI、全栈开发与真实问题之间的连接。</p>
          <div className="link-group"><Link className="text-link" href="/projects">浏览作品 <Arrow /></Link><a className="text-link secondary" href={site.github}>GitHub <Arrow /></a></div>
        </div>
      </section>
      <section aria-labelledby="work-title">
        <div className="section-header"><p className="section-label">01 / SELECTED WORK</p><h2 id="work-title">作品，持续生长。</h2><Link className="text-link" href="/projects">查看全部作品 <Arrow /></Link></div>
        <div>{projects.slice(0, 3).map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
      </section>
      <section className="practice" aria-labelledby="practice-title"><p className="section-label">02 / PRACTICE</p><h2 id="practice-title">保持好奇，认真构建。</h2><TechStack /></section>
    </main>
  );
}
