import Image from "next/image";
import type { CSSProperties } from "react";
import { featuredPreviews, previewSizes } from "@/data/featured";

export function SiteOpening() {
  return <div className="site-opening" aria-hidden="true">
    <div className="site-opening-panels"><span /><span /><span /><span /></div>
    <div className="site-opening-name">{Array.from("ZWLY Lab.").map((letter, index) => <span key={index} style={{ "--letter": index } as CSSProperties}>{letter}</span>)}</div>
    <p className="site-opening-caption">应用、交互与视觉。<br /><span>Vibe Coding 作品集</span></p>
    {/* The pre-paint controller measures and positions these before hydration. */}
    {featuredPreviews.map((item, index) => <div key={item.src} data-opening-preview={item.src} suppressHydrationWarning className={"site-opening-artifact overview-work--" + item.slug}>
      <div className="overview-frame"><Image src={item.src} alt="" width={item.width} height={item.height} sizes={previewSizes(index)} loading="lazy" /></div>
    </div>)}
  </div>;
}
