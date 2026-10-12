import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { posts } from "@/data/posts";
export const metadata: Metadata = { title: "手记" };
export default function BlogPage() {
  const archive = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const featured = posts.find((post) => post.slug === "motion-for-understanding")!;
  const collections = [
    { title: "学习与实践", description: "从已有笔记出发，把方法放回具体的图表、界面与视觉作品。", entries: archive.filter((post) => post.sourceNote && post !== featured) },
    { title: "构建记录", description: "保留作品集第一版的选择，也为下一次判断留下依据。", entries: archive.filter((post) => !post.sourceNote) },
  ];
  return <main id="main-content" className="container page-body">
    <header className="page-header note-index-header"><h1>把构建中的判断，<br className="desktop-break" />留下来。</h1><p>与 AI 协作，需要把想法说明白，也需要判断实际结果。这里从真实作品与已有笔记出发，记录界面、图表和视觉表达的选择。</p></header>
    <Link className="note-feature" href={"/blog/" + featured.slug}>
      <Image src={featured.cover.src} alt={featured.cover.caption} width={featured.cover.width} height={featured.cover.height} sizes="(max-width: 760px) 100vw, 720px" />
      <div className="note-feature-copy"><h2>{featured.title}</h2><p className="article-meta"><time dateTime={featured.date}>{featured.date.replaceAll("-", ".")}</time> · 交互与反馈</p><p>{featured.summary}</p><p className="note-feature-judgment">一次运动应该解释一次状态变化。从哪里来，怎样变化，最终落在哪里，都要跟随真实的操作结果。</p><span className="text-link">读这篇手记 <Arrow /></span></div>
    </Link>
    {collections.map((collection) => <section className="note-section" key={collection.title} aria-label={collection.title}>
      <div className="section-header"><h2>{collection.title}</h2><p>{collection.description}</p></div>
      {/* Title/date archive adapted from antfu.me ListPosts; MIT notice in licenses/. */}
      <ul className="note-list">{collection.entries.map((post) => <li key={post.slug}><Link href={"/blog/" + post.slug}>
        <div className="note-list-copy"><h3>{post.title}</h3><p>{post.summary}</p></div>
        <div className="archive-date"><time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time><Arrow /></div>
      </Link></li>)}</ul>
    </section>)}
  </main>;
}
