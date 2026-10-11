import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { posts } from "@/data/posts";
export const metadata: Metadata = { title: "手记" };
export default function BlogPage() {
  return <main id="main-content" className="container page-body"><header className="page-header"><p className="section-label">NOTES & THOUGHTS</p><h1>记录，也是一种构建。</h1><p>关于开发、设计与 AI 的思考。从小问题开始，把过程写下来。</p></header><div>{posts.map((post) => <Link className="note-row" key={post.slug} href={"/blog/" + post.slug}><time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time><div><h2>{post.title}</h2><p>{post.summary}</p></div><Arrow /></Link>)}</div></main>;
}