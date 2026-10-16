import Link from "@/components/NavigationLink";
import { Arrow } from "./Arrow";
import { site } from "@/data/site";

/* eslint-disable @next/next/no-html-link-for-pages -- Replay needs a fresh document to run the prepaint opening. */
export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-invite"><p>把下一个想法，做成作品。</p><a className="text-link" href={site.github}>GitHub · 代码与更新 <Arrow /></a></div><div className="footer-bottom"><Link className="wordmark" href="/">ZWLY Lab.</Link><div className="footer-paths"><Link href="/projects">继续浏览作品</Link><a href="/?opening=replay">重播开场</a><p>© 2026 ZWLY Lab</p></div></div></div></footer>;
}
