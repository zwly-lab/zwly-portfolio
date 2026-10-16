import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { ContentBreadcrumb } from "@/components/ContentBreadcrumb";
import { notFound } from "next/navigation";
import { posts } from "@/data/posts";
import { ArticleNavigation } from "@/components/ArticleNavigation";
import { NoteExample } from "@/components/NoteExample";
export const dynamicParams = false;
export function generateStaticParams() { return posts.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) return { title: "未找到" };
  return pageMetadata({ path: "/blog/" + slug, title: post.title + " · ZWLY Lab", description: post.summary, image: post.cover });
}
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const position = posts.indexOf(post);
  return <main id="main-content" className="container note-reading">
    <header className="page-header article-header"><ContentBreadcrumb href="/blog" label="手记" title={post.title} /><h1>{post.title}</h1><p>{post.summary}</p><div className="article-meta"><time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time> · ZWLY Lab · {post.sourceNote ? "学习与实践" : "构建记录"}</div></header>
    <article className="article prose">
      {post.sections.map((section, index) => <section key={section.title} id={"section-" + (index + 1)}><h2>{section.title}</h2><p>{section.text}</p>{index === 0 && <NoteExample slug={post.slug} />}</section>)}
      {post.sourceNote && <footer className="article-source"><h2>这篇手记的来源</h2><p>{post.sourceNote}</p></footer>}
      <ArticleNavigation previous={posts[position - 1]} next={posts[position + 1]} />
    </article>
  </main>;
}
