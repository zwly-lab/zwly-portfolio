import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { defaultShareImage, pageMetadata, siteUrl } from "../src/lib/metadata.ts";

test("route metadata keeps canonical, social text and actual image dimensions together", () => {
  const metadata = pageMetadata({
    path: "/projects/pyscreen",
    title: "PyScreen · ZWLY Lab",
    description: "在浏览器里运行 Python。",
    image: { src: "/images/projects/pyscreen.png", width: 1440, height: 1000, caption: "PyScreen 实际运行画面" },
  });
  assert.deepEqual(metadata.title, { absolute: "PyScreen · ZWLY Lab" });
  assert.equal(metadata.alternates.canonical, `${siteUrl}/projects/pyscreen`);
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  for (const social of [metadata.openGraph, metadata.twitter]) {
    assert.equal(social.title, metadata.title.absolute);
    assert.equal(social.description, metadata.description);
    assert.deepEqual(social.images, [{ url: `${siteUrl}/images/projects/pyscreen.png`, width: 1440, height: 1000, alt: "PyScreen 实际运行画面" }]);
  }
});

test("default share image is an existing artwork with measured PNG dimensions", () => {
  const image = readFileSync(new URL(`../public${defaultShareImage.src}`, import.meta.url));
  assert.equal(image.readUInt32BE(16), defaultShareImage.width);
  assert.equal(image.readUInt32BE(20), defaultShareImage.height);
  const metadata = pageMetadata({ path: "/", title: "ZWLY Lab", description: "作品与手记。" });
  assert.equal(metadata.alternates.canonical, `${siteUrl}/`);
  assert.equal(metadata.openGraph.images[0].url, `${siteUrl}${defaultShareImage.src}`);
  assert.equal(metadata.openGraph.images[0].alt, defaultShareImage.caption);
});
