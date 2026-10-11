import type { Metadata } from "next";
import { ContentBreadcrumb } from "@/components/ContentBreadcrumb";
import Image from "next/image";
import { notFound } from "next/navigation";
import { posts } from "@/data/posts";
import { ArticleToc } from "@/components/ArticleToc";
import { ArticleNavigation } from "@/components/ArticleNavigation";
import { NoteExample } from "@/components/NoteExample";
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
  const position = posts.indexOf(post);
  return <main id="main-content" className="container"><header className="page-header case-header article-header"><ContentBreadcrumb href="/blog" label="手记" title={post.title} /><p className="article-meta"><time dateTime={post.date}>{post.date}</time> · ZWLY Lab</p><h1>{post.title}</h1><p>{post.summary}</p></header><div className="reading-layout"><aside className="reading-aside"><figure className="article-cover"><Image src={post.cover.src} alt={post.cover.caption} width={post.cover.width} height={post.cover.height} sizes="240px" /><figcaption>{post.cover.caption}</figcaption></figure><ArticleToc titles={post.sections.map((section) => section.title)} /></aside><article className="article prose">{post.sourceNote && <p className="article-meta">来源：{post.sourceNote}</p>}{post.sections.map((section, index) => <section key={section.title} id={"section-" + (index + 1)}><h2>{section.title}</h2><p>{section.text}</p>{index === 0 && <NoteExample slug={post.slug} />}</section>)}<ArticleNavigation previous={posts[position - 1]} next={posts[position + 1]} /></article></div></main>;
}
