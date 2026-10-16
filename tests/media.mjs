// Optional Playwright runtime, matching the other browser checks.
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href : "playwright");
const origin = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
try {
  for (const width of [360, 820, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(origin);
    const previews = await page.locator('.portfolio-showcase img').evaluateAll(images => images.map(image => image.currentSrc));
    assert.ok(previews.every(src => decodeURIComponent(src).includes('/_next/static/media/')), 'critical previews use content-hashed immutable sources');
    await page.locator(".note-card").last().scrollIntoViewIfNeeded();
    const poster = page.locator(".note-cover-frame--chinese-product-posters img");
    await poster.evaluate(image => image.decode());
    const fit = await poster.evaluate(image => {
      const style = getComputedStyle(image), bounds = image.getBoundingClientRect(), frame = image.closest(".note-cover-frame").getBoundingClientRect();
      return { fit: style.objectFit, contained: bounds.left >= frame.left && bounds.right <= frame.right && bounds.top >= frame.top && bounds.bottom <= frame.bottom, radius: parseFloat(getComputedStyle(image.closest(".note-cover-frame")).borderRadius), imageRadius: parseFloat(style.borderRadius), ratioError: Math.abs(bounds.width / bounds.height - image.naturalWidth / image.naturalHeight) };
    });
    assert.equal(fit.fit, "contain", "portrait artwork remains complete in its landscape note preview");
    assert.ok(fit.contained && fit.radius >= 12 && fit.imageRadius >= 12 && fit.ratioError < .01, "both the frame and actual complete artwork have rounded corners");
    const card = page.locator(".note-card").last();
    const text = await card.evaluate(card => {
      const heading = card.querySelector("h2"), paragraph = card.querySelector(":scope > p");
      return { leading: parseFloat(getComputedStyle(heading).lineHeight) / parseFloat(getComputedStyle(heading).fontSize), gap: paragraph.getBoundingClientRect().top - heading.getBoundingClientRect().bottom };
    });
    assert.ok(text.leading >= 1.49 && text.gap >= 20, "long Chinese titles keep readable leading and a separate summary");
    await page.goto(origin + '/projects');
    for (const slug of ['kmp-visualizer', 'linked-list-merge']) {
      const image = page.locator(`.work-${slug} .project-thumbnail`);
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(image => image.decode());
      const fit = await image.evaluate(image => {
        const box = image.getBoundingClientRect(), frame = image.parentElement.getBoundingClientRect();
        return { fit: getComputedStyle(image).objectFit, contained: box.left >= frame.left && box.right <= frame.right && box.top >= frame.top && box.bottom <= frame.bottom };
      });
      assert.ok(fit.fit === 'contain' && fit.contained, `${slug}: show complete controls and diagrams without enlargement or negative-offset crops`);
    }
    await context.close();
  }
  console.log("PASS: immutable critical previews, complete algorithm previews, full poster composition, rounded frames and readable note typography at 360/820/1440px.");
} finally { await browser.close(); }
