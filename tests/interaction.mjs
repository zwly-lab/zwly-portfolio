import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href : "playwright");
const origin = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
async function checkMarker(page, selector) {
  await page.waitForFunction(selector => {
    const group = document.querySelector(selector), selected = group?.querySelector('[aria-current], [aria-pressed="true"]'), line = group?.querySelector('.active-underline');
    if (!selected || !line?.style.transform) return false;
    const label = selected.querySelector('[data-underline-label]').getBoundingClientRect(), marker = line.getBoundingClientRect();
    return Math.abs(label.left - marker.left - 4) < 1 && Math.abs(marker.right - label.right - 4) < 1;
  }, selector);
  const geometry = await page.locator(selector).evaluate(group => {
    const selected = group.querySelector('[aria-current], [aria-pressed="true"]'), label = selected.querySelector('[data-underline-label]').getBoundingClientRect(), line = group.querySelector('.active-underline').getBoundingClientRect();
    return { left: label.left - line.left, right: line.right - label.right, top: line.top - (selected.getBoundingClientRect().bottom - 2) };
  });
  assert.ok(Math.abs(geometry.left - 4) < 1 && Math.abs(geometry.right - 4) < 1 && Math.abs(geometry.top) < 1, 'selection marker follows the actual label with equal 4px overhangs');
}
try {
  for (const width of [360, 820, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    for (const route of ["/projects", "/about", "/blog"]) {
      await page.goto(origin + route);
      await page.waitForFunction(() => document.querySelector(".site-nav .active-underline")?.style.transform, null, { timeout: 8000 });
      const geometry = await page.locator(".site-nav").evaluate(nav => {
        const selected = nav.querySelector("[aria-current]"), label = selected.querySelector("[data-underline-label]"), line = nav.querySelector(".active-underline").getBoundingClientRect();
        const text = label.getBoundingClientRect(), hit = selected.getBoundingClientRect();
        return { left: line.left - text.left, width: line.width - text.width, top: line.top - (hit.bottom - 2), hit: hit.width, opacity: getComputedStyle(nav.querySelector(".active-underline")).opacity };
      });
      assert.ok(Math.abs(geometry.left + 4) < 1 && Math.abs(geometry.width - 8) < 1 && Math.abs(geometry.top) < 1 && geometry.opacity === "1", "initial navigation marker is centered with equal overhangs, including direct entry");
      assert.ok(geometry.hit >= 44, "text alignment preserves the larger pointer target");
    }
    await page.goto(origin + '/projects');
    for (const label of ['全部', '应用工具', '交互实验', '视觉创作']) {
      await page.getByRole('button', { name: label, exact: true }).click();
      await checkMarker(page, '.project-filters');
    }
    await page.goto(origin);
    for (const label of ['精选一览', '交互实验', '应用作品', '视觉创作']) {
      await page.getByRole('button', { name: label, exact: true }).click();
      await page.waitForFunction(() => document.querySelector('#portfolio-overview')?.getAttribute('aria-busy') === 'false');
      await checkMarker(page, '.showcase-choices');
    }
    await page.goto(origin + "/projects/poster-collection");
    await page.locator(".case-navigation").scrollIntoViewIfNeeded();
    const layout = await page.locator(".case-navigation").evaluate(nav => ({
      gap: nav.getBoundingClientRect().top - nav.previousElementSibling.getBoundingClientRect().bottom,
      cards: [...nav.querySelectorAll("a")].map(link => {
        const title = link.querySelector("strong"), arrow = title.querySelector("svg"), first = link.firstElementChild;
        const titleBox = title.getBoundingClientRect(), arrowBox = arrow.getBoundingClientRect();
        const range = document.createRange(); range.selectNodeContents(title.firstChild);
        const lines = [...range.getClientRects()];
        return { aligned: Math.abs(first.getBoundingClientRect().left - titleBox.left) < 1, arrowTop: arrowBox.top - titleBox.top, line: parseFloat(getComputedStyle(title).lineHeight), right: link.getBoundingClientRect().right, lastLine: lines.at(-1)?.width ?? 0, wrapped: lines.length > 1, fontSize: parseFloat(getComputedStyle(title).fontSize) };
      }), overflow: document.documentElement.scrollWidth > innerWidth + 1,
    }));
    assert.ok(layout.gap >= 40 && !layout.overflow, "gallery summary and onward navigation keep breathing room without overflow");
    assert.ok(layout.cards.every(card => card.aligned && card.arrowTop >= 0 && card.arrowTop < card.line && card.right <= width), "onward labels, titles and summaries align left, with arrows on the title's first line");
    assert.ok(layout.cards.every(card => !card.wrapped || card.lastLine >= card.fontSize * 4), "long titles do not leave two Chinese characters stranded on a separate line");
    await page.close();
  }
  console.log("PASS: initial text-aligned navigation markers, 44px targets and readable onward links at 360/820/1440px.");
} finally { await browser.close(); }
