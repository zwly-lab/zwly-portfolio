"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ActiveUnderline } from "./ActiveUnderline";
import { Arrow } from "./Arrow";
import { site } from "@/data/site";

const links = [{ href: "/projects", label: "作品" }, { href: "/about", label: "关于" }, { href: "/blog", label: "手记" }];
export function Navbar() {
  const pathname = usePathname();
  const navigation = useRef<HTMLElement>(null);
  return <header className="site-header container"><Link className="wordmark" href="/" aria-label="ZWLY Lab 首页">ZWLY Lab.</Link><nav ref={navigation} className="site-nav" aria-label="主导航"><ActiveUnderline target={navigation} value={pathname} />{links.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(href + "/") ? "page" : undefined}>{label}</Link>)}<a href={site.github}>GitHub <Arrow /></a></nav></header>;
}
