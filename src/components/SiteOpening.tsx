import Image from "next/image";
import { featuredPreviews, previewSizes } from "@/data/featured";

export function SiteOpening() {
  return <div className="site-opening" aria-hidden="true">
    {/* The pre-paint controller measures and positions these before hydration. */}
    {featuredPreviews.map((item, index) => <div key={item.src} data-opening-preview={item.src} suppressHydrationWarning className={"site-opening-artifact overview-work--" + item.slug}>
      <div className="overview-frame"><Image src={item.src} alt="" width={item.width} height={item.height} sizes={previewSizes(index)} loading="lazy" /></div>
    </div>)}
  </div>;
}
