import Image from "next/image";
import Link from "next/link";
import { HeroShowcase } from "@/components/HeroShowcase";
import { Arrow } from "@/components/Arrow";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { NoteCard } from "@/components/NoteCard";
import { posts } from "@/data/posts";
import { LiveDemo } from "@/components/LiveDemo";

export default function Home() {
  const selectedPosts = ["motion-for-understanding", "chinese-product-posters"].map((slug) => posts.find((post) => post.slug === slug)!);
  return <main id="main-content" className="container home-page">
    <section className="hero hero-editorial" aria-labelledby="hero-title">
      <div className="hero-intro"><h1 id="hero-title">让想法，<br />成为<span className="accent">可体验</span>的作品。</h1><p>教学工具、应用界面与视觉创作。<br />这里呈现我的作品、构建判断与持续探索。</p><Link className="text-link" href="/projects">浏览作品集 <Arrow /></Link></div>
      <HeroShowcase />
    </section>
    <section className="home-products" aria-labelledby="work-title">
      <div className="section-header"><div><h2 id="work-title">精选作品，值得展开。</h2><p className="section-description">从学习反馈到任务界面，看看不同问题怎样成为作品。</p></div><Link className="text-link" href="/projects">查看全部作品 <Arrow /></Link></div>
      <div className="project-grid selected-work">{["pyscreen", "campus-takeout", "jd-protocol-engine"].map((slug) => <ProjectCard key={slug} project={projects.find((project) => project.slug === slug)!} />)}</div>
    </section>
    <LiveDemo />
    <div className="experiment-links"><Link href="/projects/kmp-visualizer">KMP：理解失配回退 <Arrow /></Link><Link href="/projects/linked-list-merge">链表：跟随节点归并 <Arrow /></Link><Link href="/projects/gdp-timeline">数据练习：历史时间轴 <Arrow /></Link></div>
    <section className="visual-interlude" aria-labelledby="visual-title">
      <div className="visual-intro"><h2 id="visual-title">也给灵感，<br />留一点空间。</h2><p>日常片段、纸张、水彩与光。<br />从同一个场景，探索不同的视觉表达。</p><Link className="text-link" href="/projects/poster-collection">走进视觉作品 <Arrow /></Link></div>
      <Link href="/projects/poster-collection" className="visual-print"><Image src="/images/posters/travel-diary.png" alt="旅行日记拼贴：海岛日落与纸张构图" width={1122} height={1402} sizes="(max-width: 760px) 46vw, 360px" /><span>旅行与日常</span></Link>
      <Link href="/projects/poster-collection" className="visual-print watercolor-print"><Image src="/images/posters/watercolor-space.png" alt="风筝与歌声的水彩留白构图" width={845} height={1860} sizes="(max-width: 760px) 46vw, 300px" /><span>水彩与留白</span></Link>
    </section>
    <section className="home-writing" aria-labelledby="notes-title"><div className="section-header"><div><h2 id="notes-title">把判断，写进过程里。</h2><p className="section-description">从交互反馈到视觉表达，记录具体的方法与边界。</p></div><Link className="text-link" href="/blog">阅读手记 <Arrow /></Link></div><div className="notes-grid">{selectedPosts.map((post) => <NoteCard key={post.slug} post={post} />)}</div></section>
    <section className="home-about"><h2>从理解问题开始，<br />以可以验证的作品继续。</h2><Link className="text-link" href="/about">了解我的构建方式 <Arrow /></Link></section>
  </main>;
}
