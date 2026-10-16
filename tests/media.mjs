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
    await context.close();
  }
  console.log("PASS: full poster composition, consistent rounded frames and readable note typography at 360/820/1440px.");
} finally { await browser.close(); }
