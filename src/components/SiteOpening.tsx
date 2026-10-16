import Image from "next/image";
import { featuredImages, featuredPreviews, previewSizes } from "@/data/featured";

export function SiteOpening() {
  return <><div className="site-opening" aria-hidden="true">
    <div className="site-opening-cover"><span /><span /></div>
    {/* Copies stay lazy on other routes; the homepage controller requests them before flight. */}
    {featuredPreviews.map((item, index) => <div key={item.src} data-opening-preview={item.src} suppressHydrationWarning className={"site-opening-artifact overview-work--" + item.slug}>
      <div className="overview-frame"><Image src={featuredImages[item.src]} alt="" width={item.width} height={item.height} sizes={previewSizes(index)} loading="lazy" suppressHydrationWarning /></div>
    </div>)}
  </div><div className="site-opening-signature wordmark" aria-hidden="true" suppressHydrationWarning>ZWLY Lab.</div><button className="site-opening-skip" type="button">跳过开场</button></>;
}
