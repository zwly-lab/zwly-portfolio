"use client";

import Link from "@/components/NavigationLink";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ActiveUnderline } from "./ActiveUnderline";
import { Arrow } from "./Arrow";
import { site } from "@/data/site";
import { useOpeningPrefetch } from "@/lib/useOpeningPrefetch";

const links = [{ href: "/projects", label: "作品" }, { href: "/about", label: "关于" }, { href: "/blog", label: "手记" }];
export function Navbar() {
  const pathname = usePathname();
  const prefetch = useOpeningPrefetch();
  const navigation = useRef<HTMLElement>(null);
  return <header className="site-header container"><Link prefetch={prefetch ? undefined : false} className="wordmark" href="/" aria-label="ZWLY Lab 首页">ZWLY Lab.</Link><nav ref={navigation} className="site-nav" aria-label="主导航"><ActiveUnderline target={navigation} value={pathname} />{links.map(({ href, label }) => <Link prefetch={prefetch ? undefined : false} key={href} href={href} aria-current={pathname === href || pathname.startsWith(href + "/") ? "page" : undefined}><span data-underline-label>{label}</span></Link>)}<a href={site.github}><span data-underline-label>GitHub</span> <Arrow /></a></nav></header>;
}
