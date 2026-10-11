import type { Metadata } from "next";
import { ContentBreadcrumb } from "@/components/ContentBreadcrumb";
import Image from "next/image";
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
  return <main id="main-content" className="container"><header className="page-header case-header"><ContentBreadcrumb href="/blog" label="手记" title={post.title} /><h1>{post.title}</h1><p>{post.summary}</p></header><figure className="project-media project-cover"><Image src={post.cover.src} alt={post.cover.caption} width={post.cover.width} height={post.cover.height} sizes="(max-width: 760px) 100vw, 1288px" /><figcaption>{post.cover.caption}</figcaption></figure><div className="reading-layout"><nav className="article-toc" aria-label="文章目录"><h2>本文目录</h2><ol>{post.sections.map((section, index) => <li key={section.title}><a href={"#section-" + (index + 1)}>{section.title}</a></li>)}</ol></nav><article className="article prose"><p className="article-meta"><time dateTime={post.date}>{post.date}</time> · ZWLY Lab</p>{post.sourceNote && <p className="article-meta">来源：{post.sourceNote}</p>}{post.sections.map((section, index) => <section key={section.title} id={"section-" + (index + 1)}><h2>{section.title}</h2><p>{section.text}</p></section>)}</article></div></main>;
}
