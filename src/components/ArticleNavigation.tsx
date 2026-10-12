// Adapted from timlrx/tailwind-nextjs-starter-blog PostLayout; MIT notice in licenses/.
import Link from "next/link";
import type { Post } from "@/data/posts";

export function ArticleNavigation({ previous, next }: { previous?: Post; next?: Post }) {
  return <nav className="article-navigation" aria-label="继续阅读">
    {previous && <Link href={"/blog/" + previous.slug + "#top"}><span>上一篇</span><strong>{previous.title}</strong></Link>}
    {next && <Link href={"/blog/" + next.slug + "#top"}><span>下一篇</span><strong>{next.title}</strong></Link>}
  </nav>;
}
