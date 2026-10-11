import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { posts } from "@/data/posts";
export const metadata: Metadata = { title: "手记" };
export default function BlogPage() {
  const archive = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return <main id="main-content" className="container page-body">
    <header className="page-header"><h1>记录，也是一种构建。</h1><p>开发记录与已有学习笔记精选。从实际作品出发，记录方法、判断和验证边界。</p></header>
    {/* Title/date archive adapted from antfu.me ListPosts; MIT notice in licenses/. */}
    <ul className="note-archive">{archive.map((post) => <li key={post.slug}><Link href={"/blog/" + post.slug}>
      <Image src={post.cover.src} alt={post.cover.caption} width={post.cover.width} height={post.cover.height} sizes="(max-width: 760px) 96px, 180px" />
      <div><p className="article-meta">{post.sourceNote ? "学习与实践" : "构建记录"}</p><h2>{post.title}</h2><p>{post.summary}</p></div>
      <div className="archive-date"><time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time><Arrow /></div>
    </Link></li>)}</ul>
  </main>;
}
