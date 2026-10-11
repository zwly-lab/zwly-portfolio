import type { Metadata } from "next";
import { NoteCard } from "@/components/NoteCard";
import { posts } from "@/data/posts";
export const metadata: Metadata = { title: "手记" };
export default function BlogPage() {
  return <main id="main-content" className="container page-body"><header className="page-header"><p className="section-label">NOTES & THOUGHTS</p><h1>记录，也是一种构建。</h1><p>开发记录与已有学习笔记精选。用封面找到主题，再读摘要、方法与验证边界。</p></header><div className="notes-grid">{posts.map((post) => <NoteCard key={post.slug} post={post} />)}</div></main>;
}
