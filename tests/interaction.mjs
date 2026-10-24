import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href : "playwright");
const origin = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
async function checkMarker(page, selector, zoom = 1) {
  await page.waitForFunction(({ selector, zoom }) => {
    const group = document.querySelector(selector), selected = group?.querySelector('[aria-current], [aria-pressed="true"]'), line = group?.querySelector('.active-underline');
    if (!selected || !line?.style.transform) return false;
    const label = selected.querySelector('[data-underline-label]').getBoundingClientRect(), marker = line.getBoundingClientRect();
    return Math.abs(label.left - marker.left - 4 * zoom) < 1 && Math.abs(marker.right - label.right - 4 * zoom) < 1;
  }, { selector, zoom });
  const geometry = await page.locator(selector).evaluate(group => {
    const selected = group.querySelector('[aria-current], [aria-pressed="true"]'), label = selected.querySelector('[data-underline-label]').getBoundingClientRect(), line = group.querySelector('.active-underline').getBoundingClientRect();
    const zoom = group.getBoundingClientRect().height / parseFloat(getComputedStyle(group).height);
    return { left: label.left - line.left, right: line.right - label.right, top: line.top - (selected.getBoundingClientRect().bottom - 2 * zoom) };
  });
  assert.ok(Math.abs(geometry.left - 4 * zoom) < 1 && Math.abs(geometry.right - 4 * zoom) < 1 && Math.abs(geometry.top) < 1, 'selection marker follows the actual label with equal 4px overhangs at the current display scale');
}
async function checkPaintedMarker(page, selector, line = null) {
  line ??= await page.locator(selector + ' .active-underline').boundingBox();
  const clip = { x: Math.floor(line.x) - (selector ? 12 : 1), y: Math.floor(line.y), width: Math.ceil(line.width) + (selector ? 48 : 2), height: Math.ceil(line.y + line.height) - Math.floor(line.y) };
  const png = await page.screenshot({ clip, scale: 'css' });
  const painted = await page.evaluate(async base64 => {
    const bitmap = await createImageBitmap(await (await fetch('data:image/png;base64,' + base64)).blob());
    const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height;
    const context = canvas.getContext('2d'); context.drawImage(bitmap, 0, 0);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let left = canvas.width, right = -1;
    for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      // A 1px hover line can paint across two half-covered pixel rows.
      if (data[i] < 190 && data[i + 1] < 200 && data[i + 2] < 195) { left = Math.min(left, x); right = Math.max(right, x); }
    }
    bitmap.close();
    return { left, right: right + 1 };
  }, png.toString('base64'));
  assert.ok(Math.abs(painted.left - (line.x - clip.x)) < 1.5 && Math.abs(painted.right - (line.x + line.width - clip.x)) < 1.5, 'painted pixels match the centered geometry: ' + JSON.stringify({ painted, line, clip }));
}
async function checkFeedbackLine(page, control) {
  await control.evaluate(element => Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished)));
  const line = await control.evaluate(element => {
    const label = element.querySelector('[data-underline-label]'), bounds = label.getBoundingClientRect(), hit = element.getBoundingClientRect(), style = getComputedStyle(label, '::after');
    return { content: style.content, width: parseFloat(style.width), left: parseFloat(style.left), x: bounds.left - 4, y: hit.bottom - 1, height: 1, expectedWidth: bounds.width + 8, border: getComputedStyle(element).borderBottomColor };
  });
  assert.ok(line.content !== 'none' && Math.abs(line.width - line.expectedWidth) < 1 && line.left === -4, 'hover and keyboard lines extend equally beyond the text, independent of the click target');
  assert.equal(line.border, 'rgba(0, 0, 0, 0)', 'hover feedback does not leave a second border beneath the moving marker');
  await checkPaintedMarker(page, null, { ...line, width: line.expectedWidth });
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
    const about = page.locator('.site-nav a[href="/about"]');
    await about.hover();
    await checkFeedbackLine(page, about);
    await page.mouse.move(0, 0);
    await about.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    assert.ok(await about.evaluate(element => element.matches(':focus-visible')), 'navigation exposes real keyboard feedback');
    await checkFeedbackLine(page, about);
    await page.locator('.site-nav [aria-current]').hover();
    assert.equal(await page.locator('.site-nav [aria-current] [data-underline-label]').evaluate(label => getComputedStyle(label, '::after').content), 'none', 'the selected navigation item keeps only its shared marker');
    for (const label of ['全部', '应用工具', '交互实验', '视觉创作']) {
      await page.getByRole('button', { name: label, exact: true }).click();
      await checkMarker(page, '.project-filters');
    }
    await page.goto(origin);
    const direction = page.getByRole('button', { name: '交互实验', exact: true });
    await direction.hover();
    await checkFeedbackLine(page, direction);
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
  for (const zoom of [1.25, 1.5, 2]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    await page.addInitScript(zoom => document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.zoom = String(zoom); }), zoom);
    await page.goto(origin + '/projects');
    await checkMarker(page, '.site-nav', zoom);
    await checkPaintedMarker(page, '.site-nav');
    for (const label of ['全部', '视觉创作', '交互实验']) {
      await page.getByRole('button', { name: label, exact: true }).click();
      await checkMarker(page, '.project-filters', zoom);
      await checkPaintedMarker(page, '.project-filters');
    }
    await page.setViewportSize({ width: 780, height: 1000 });
    await checkMarker(page, '.site-nav', zoom);
    await checkMarker(page, '.project-filters', zoom);
    await page.goto(origin);
    await page.getByRole('button', { name: '交互实验', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#portfolio-overview')?.getAttribute('aria-busy') === 'false');
    await checkMarker(page, '.showcase-choices', zoom);
    await page.close();
  }
  for (const deviceScaleFactor of [1.25, 1.5]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor });
    await page.goto(origin + '/projects');
    await checkMarker(page, '.site-nav');
    await checkPaintedMarker(page, '.site-nav');
    const about = page.locator('.site-nav a[href="/about"]');
    await about.hover();
    await checkFeedbackLine(page, about);
    for (const label of ['视觉创作', '全部', '交互实验']) {
      await page.getByRole('button', { name: label, exact: true }).click();
      await checkMarker(page, '.project-filters');
      await checkPaintedMarker(page, '.project-filters');
    }
    for (const label of ['全部', '视觉创作', '交互实验']) await page.getByRole('button', { name: label, exact: true }).click();
    await checkMarker(page, '.project-filters');
    await checkPaintedMarker(page, '.project-filters');
    await page.close();
  }
  console.log("PASS: centered selection, hover and keyboard lines; rapid switching, painted pixels at 125/150/200% zoom and fractional screen densities; 44px targets and readable onward links at 360/820/1440px.");
} finally { await browser.close(); }
