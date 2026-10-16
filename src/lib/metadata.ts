import type { Metadata } from "next";

export const siteUrl = "https://zwly-lab.vercel.app";

type ShareImage = {
  src: string;
  width: number;
  height: number;
  caption?: string;
};

export const defaultShareImage: ShareImage = {
  src: "/images/posters/santorini-illustration.png",
  width: 1122,
  height: 1402,
  caption: "ZWLY Lab 视觉作品 · 海岛日落插画",
};

export function pageMetadata({ path, title, description, image = defaultShareImage }: {
  path: string;
  title: string;
  description: string;
  image?: ShareImage;
}): Metadata {
  const url = new URL(path, siteUrl).toString();
  const shareImage = {
    url: new URL(image.src, siteUrl).toString(),
    width: image.width,
    height: image.height,
    alt: image.caption ?? title,
  };

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "ZWLY Lab",
      locale: "zh_CN",
      type: "website",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}
