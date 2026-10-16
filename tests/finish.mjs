// Uses the same optional browser runtime as browser.mjs.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href : "playwright");
const origin = process.argv[2] || "http://localhost:3000";
const output = process.argv[3];
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
try {
  const first = await browser.newContext();
  const page = await first.newPage();
  const modules = [];
  page.on("response", response => {
    if (response.url().includes("/static/chunks/") && response.url().endsWith(".js")) modules.push(response.text().then(text => text.includes("site-depth-canvas") ? response.url() : null));
  });
  await page.goto(origin);
  await page.waitForFunction(() => sessionStorage.getItem("zwly-opening-seen") === "1");
  const depthChunks = (await Promise.all(modules)).filter(Boolean);
  assert.equal(depthChunks.length, 1, "first visit actually downloads the isolated depth module");
  await first.close();
  for (const reduced of [false, true]) {
    const context = await browser.newContext({ reducedMotion: reduced ? "reduce" : "no-preference" });
    if (!reduced) await context.addInitScript(() => sessionStorage.setItem("zwly-opening-seen", "1"));
    const page = await context.newPage();
    const requested = [];
    page.on("request", request => requested.push(request.url()));
    await page.goto(origin);
    await page.waitForFunction(() => !document.documentElement.hasAttribute("data-site-return"));
    await page.getByRole("button", { name: "交互实验", exact: true }).click();
    await page.waitForFunction(() => document.querySelector("#portfolio-overview")?.getAttribute("aria-busy") !== "true");
    assert.equal(requested.some(url => depthChunks.includes(url)), false, "return and reduced-motion visits omit the heavy depth chunk");
    await context.close();
  }
  for (const width of [360, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(origin);
    const layout = await page.evaluate(() => ({
      demo: document.querySelector(".live-demo").offsetTop,
      products: document.querySelector(".home-products").offsetTop,
      nav: [...document.querySelectorAll(".site-nav a")].map(a => ({ width: a.getBoundingClientRect().width, height: a.getBoundingClientRect().height })),
      cards: document.querySelectorAll(".selected-work > .work-card").length,
      entries: document.querySelectorAll(".selected-work-links > a").length,
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    assert.ok(layout.demo < layout.products, "interactive experience precedes the second application selection");
    assert.deepEqual([layout.cards, layout.entries], [1, 2]);
    assert.equal(layout.overflow, false);
    assert.ok(layout.nav.every(target => target.width >= 44 && target.height >= 44), "navigation touch targets remain at least 44px: " + JSON.stringify(layout.nav));
    if (output) {
      await fs.mkdir(output, { recursive: true });
      await page.locator("img").evaluateAll(images => Promise.all(images.map(image => { image.loading = "eager"; return image.decode(); })));
      await page.locator(".home-products").screenshot({ path: path.join(output, `finish-products-${width}.jpg`) });
      await page.screenshot({ path: path.join(output, `finish-home-${width}.jpg`), fullPage: true });
    }
    await page.goto(origin + "/projects/jd-protocol-engine");
    const film = page.locator("#product-film");
    assert.equal(await film.getAttribute("open"), null);
    await film.locator("summary").click();
    await film.locator("video").waitFor({ state: "visible" });
    assert.equal(await film.locator("video").getAttribute("preload"), "none");
    await page.goto(origin + "/projects/poster-collection");
    assert.equal(await page.locator(".gallery-series-header h3").count(), 0);
    assert.ok(await page.locator(".gallery-series-header h2").count() > 0);
    await context.close();
  }
  console.log("PASS: isolated 3D download, lightweight return/reduced-motion visits, curated home, 44px navigation, native film disclosure and gallery headings at 360/390/1440px.");
} finally { await browser.close(); }
