"use client";

import { useEffect, useState } from "react";

export function ArticleToc({ titles }: { titles: string[] }) {
  const [current, setCurrent] = useState("section-1");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const sections = titles.map((_, index) => document.getElementById("section-" + (index + 1))).filter((section) => section !== null);
    let frame = 0;
    function update() {
      const article = document.querySelector(".reading-layout article");
      if (article) {
        const { top, bottom } = article.getBoundingClientRect();
        const distance = bottom - window.innerHeight - (top - 160);
        setProgress(distance > 0 ? Math.round(Math.max(0, Math.min(1, (160 - top) / distance)) * 100) : bottom <= window.innerHeight ? 100 : 0);
      }
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
  return <nav className="article-toc" aria-label="文章目录"><h2>本文目录</h2><div className="reading-position" role="progressbar" aria-label="文章阅读位置" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
    {/* Adapted from Maxime Heckel's MiniProgressCircular; MIT notice in licenses/. */}
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" strokeWidth="2" fill="none" className="progress-track" /><circle cx="10" cy="10" r="8" strokeWidth="2" fill="none" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress / 100} className="progress-value" /></svg><span>阅读位置 {progress}%</span>
  </div><ol>{titles.map((title, index) => {
    const id = "section-" + (index + 1);
    return <li key={title}><a href={"#" + id} aria-current={current === id ? "location" : undefined}>{title}</a></li>;
  })}</ol></nav>;
}
