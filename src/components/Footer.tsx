import Link from "next/link";
import { Arrow } from "./Arrow";
import { site } from "@/data/site";

export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-invite"><p>把下一个想法，做成作品。</p><a className="text-link" href={site.github}>在 GitHub 找到我 <Arrow /></a></div><div className="footer-bottom"><Link className="wordmark" href="/">ZWLY Lab.</Link><p>© 2026 ZWLY Lab</p></div></div></footer>;
}
