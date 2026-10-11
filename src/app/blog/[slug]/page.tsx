import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/data/posts";
export const dynamicParams = false;
export function generateStaticParams() { return posts.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  return { title: post?.title ?? "手记未找到", description: post?.summary };
}
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  return <main id="main-content" className="container"><header className="page-header"><Link href="/blog" className="text-link back-link">返回手记</Link><h1>{post.title}</h1><p>{post.summary}</p></header><article className="article prose"><p className="article-meta"><time dateTime={post.date}>{post.date}</time> · ZWLY Lab</p>{post.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}</article></main>;
}
