// Uses the same media-first card structure; see docs/design-references.md.
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./Arrow";
import type { Post } from "@/data/posts";

export function NoteCard({ post }: { post: Post }) {
  const cover = <Image className="note-cover" src={post.cover.src} alt={post.cover.caption} width={post.cover.width} height={post.cover.height} sizes="(max-width: 760px) 100vw, 628px" />;
  return <Link className="note-card" href={"/blog/" + post.slug}>
    <div className={"note-cover-frame note-cover-frame--" + post.slug}>{post.slug === "motion-for-understanding" ? <div className="note-result-frame">{cover}</div> : cover}</div>
    <h2>{post.title}</h2><p>{post.summary}</p>
    <div className="card-heading"><p className="section-label">{post.sourceNote ? "学习笔记精选" : "构建记录"} · <time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time></p><Arrow /></div>
  </Link>;
}
