import { pageMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { posts } from "@/data/posts";
export const metadata = pageMetadata({ path: "/blog", title: "手记 · ZWLY Lab", description: "关于界面、数据与视觉的实践手记。每篇留下一个选择，和可以对照的例子。", image: posts.find((post) => post.slug === "motion-for-understanding")!.cover });
export default function BlogPage() {
  const archive = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const featured = posts.find((post) => post.slug === "motion-for-understanding")!;
  const collections = [
    { title: "学习与实践", description: "从已有笔记出发，把方法放回具体的图表、界面与视觉作品。", entries: archive.filter((post) => post.sourceNote && post !== featured) },
    { title: "构建记录", description: "保留作品集第一版的选择，也为下一次判断留下依据。", entries: archive.filter((post) => !post.sourceNote) },
  ];
  return <main id="main-content" className="container page-body">
    <header className="page-header note-index-header"><h1>构建中的判断。</h1><p>关于界面、数据与视觉的实践手记。每篇留下一个选择，和可以对照的例子。</p></header>
    <Link className="note-feature" href={"/blog/" + featured.slug}>
      <div className="note-feature-image"><div className="note-result-frame"><Image src={featured.cover.src} alt="实际归并截图局部：结果链表中的节点与连线" width={featured.cover.width} height={featured.cover.height} sizes="(max-width: 760px) 140vw, 900px" loading="eager" /></div><span>一次归并结束，节点与连线留下过程的结果。</span></div>
      <div className="note-feature-copy"><h2>{featured.title}</h2><p className="article-meta"><time dateTime={featured.date}>{featured.date.replaceAll("-", ".")}</time> · 交互与反馈</p><p>{featured.summary}</p><span className="text-link">读这篇手记 <Arrow /></span></div>
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
