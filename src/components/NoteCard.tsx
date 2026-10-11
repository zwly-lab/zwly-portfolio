// Uses the same media-first card structure; see docs/design-references.md.
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./Arrow";
import type { Post } from "@/data/posts";

export function NoteCard({ post }: { post: Post }) {
  return <Link className="note-card" href={"/blog/" + post.slug}>
    <Image className="note-cover" src={post.cover.src} alt={post.cover.caption} width={post.cover.width} height={post.cover.height} sizes="(max-width: 760px) 100vw, 628px" />
    <div className="card-heading"><p className="section-label">{post.sourceNote ? "学习笔记精选" : "构建记录"} · <time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time></p><Arrow /></div>
    <h2>{post.title}</h2><p>{post.summary}</p>
  </Link>;
}
