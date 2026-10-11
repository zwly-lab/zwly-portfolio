"use client";

import { useEffect, useRef, useState } from "react";
import { ActiveUnderline } from "./ActiveUnderline";

export function ArticleToc({ titles }: { titles: string[] }) {
  const [current, setCurrent] = useState("section-1");
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => {
    const sections = titles.map((_, index) => document.getElementById("section-" + (index + 1))).filter((section) => section !== null);
    let frame = 0;
    function update() {
      // A short article may not have enough space to scroll its anchor to the top.
      const target = document.getElementById(window.location.hash.slice(1));
      const targetTop = target?.getBoundingClientRect().top;
      if (target && targetTop !== undefined && targetTop >= 0 && targetTop < window.innerHeight / 2) { setCurrent(target.id); return; }
      const section = sections.filter((section) => section.getBoundingClientRect().top <= 160).at(-1) ?? sections[0];
      if (section) setCurrent(section.id);
    }
    function onScroll() { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); window.removeEventListener("hashchange", onScroll); };
  }, [titles]);
  return <nav ref={navigation} className="article-toc" aria-label="文章目录"><ActiveUnderline target={navigation} value={current} /><h2>本文目录</h2><ol>{titles.map((title, index) => {
    const id = "section-" + (index + 1);
    return <li key={title}><a href={"#" + id} aria-current={current === id ? "location" : undefined}>{title}</a></li>;
  })}</ol></nav>;
}
