// Optional browser runtime, shared with gallery.mjs; no package dependency.
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href : "playwright");
const origin = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
try {
  for (const width of [390, 360]) {
    for (const reducedMotion of ["no-preference", "reduce"]) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion });
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(origin + "/projects/poster-collection");
      const rails = page.locator(".gallery-rail");
      assert.equal(await rails.count(), 3, "only the three featured series become rails");
      assert.equal(await page.locator(".poster-open").count(), 18, "all originals remain available");
      for (const rail of await rails.all()) {
        const track = rail.locator(".gallery-rail-track");
        const status = rail.getByRole("status");
        const count = await track.locator(":scope > figure").count();
        const previous = rail.locator(".gallery-rail-controls button").first();
        const next = rail.locator(".gallery-rail-controls button").last();
        await rail.scrollIntoViewIfNeeded();
        await track.evaluate(element => element.scrollTo({ left: 0, behavior: "instant" }));
        await page.waitForFunction(({ id, value }) => document.getElementById(id)?.nextElementSibling?.querySelector("[role=status]")?.textContent === value, { id: await track.getAttribute("id"), value: `1 / ${count}` });
        const dimensions = await track.evaluate(element => ({ width: element.clientWidth, first: element.children[0].getBoundingClientRect().width, nextLeft: element.children[1].getBoundingClientRect().left - element.getBoundingClientRect().left, scroll: element.scrollWidth }));
        assert.ok(dimensions.first < dimensions.width && dimensions.nextLeft < dimensions.width, "a partial next artwork previews the native horizontal rail");
        assert.ok(dimensions.scroll > dimensions.width);
        const frames = await track.locator(".poster-open").evaluateAll(async buttons => {
          return Promise.all(buttons.map(async button => {
            const image = button.querySelector("img");
            await image.decode();
            const frame = button.getBoundingClientRect();
            const artwork = image.getBoundingClientRect();
            return {
              height: frame.height,
              ratioError: Math.abs(artwork.height - artwork.width * image.naturalHeight / image.naturalWidth),
              contained: artwork.left >= frame.left - 1 && artwork.right <= frame.right + 1 && artwork.top >= frame.top - 1 && artwork.bottom <= frame.bottom + 1,
            };
          }));
        });
        assert.ok(frames.every(frame => Math.abs(frame.height - frames[0].height) <= 1), "different artwork formats share the same mobile frame height within each series");
        assert.ok(frames.every(frame => frame.ratioError <= 1), "mobile artwork preserves its intrinsic aspect ratio within one pixel");
        assert.ok(frames.every(frame => frame.contained), "complete artwork stays inside its frame");
        await next.focus();
        const y = await page.evaluate(() => scrollY);
        await next.press("Enter");
        if (reducedMotion === "reduce") {
          assert.ok(await track.evaluate(element => {
            const target = element.scrollLeft + element.children[1].getBoundingClientRect().left - element.getBoundingClientRect().left;
            return Math.abs(element.scrollLeft - Math.min(target, element.scrollWidth - element.clientWidth)) < 1;
          }), "reduced motion reaches the next artwork immediately");
        }
        await page.waitForFunction(id => document.getElementById(id)?.nextElementSibling?.querySelector("[role=status]")?.textContent?.startsWith("2 /"), await track.getAttribute("id"));
        assert.ok(await track.evaluate(element => element.scrollLeft > 0), "button navigation really scrolls the element");
        assert.equal(await page.evaluate(() => scrollY), y, "button navigation does not move the vertical page");
        await track.focus();
        await track.press("End");
        await page.waitForFunction(({ id, value }) => document.getElementById(id)?.nextElementSibling?.querySelector("[role=status]")?.textContent === value, { id: await track.getAttribute("id"), value: `${count} / ${count}` });
        await page.waitForFunction(id => {
          const element = document.getElementById(id);
          return element && Math.abs(element.scrollLeft - (element.scrollWidth - element.clientWidth)) < 1;
        }, await track.getAttribute("id"));
        await next.focus();
        assert.equal(await next.getAttribute("aria-disabled"), "true");
        const end = await track.evaluate(element => element.scrollLeft);
        await next.press("Enter");
        assert.equal(await track.evaluate(element => element.scrollLeft), end, "end boundary is guarded");
        assert.ok(await next.evaluate(element => element === document.activeElement), "boundary button retains focus");
        // Scroll directly: status must follow the native scroll event, not button state.
        await track.evaluate(element => element.scrollTo({ left: 0, behavior: "instant" }));
        await page.waitForFunction(id => document.getElementById(id)?.nextElementSibling?.querySelector("[role=status]")?.textContent?.startsWith("1 /"), await track.getAttribute("id"));
        assert.equal(await status.textContent(), `1 / ${count}`);
        await previous.focus();
        await previous.press("Enter");
        assert.equal(await track.evaluate(element => element.scrollLeft), 0);
        assert.ok(await previous.evaluate(element => element === document.activeElement));
        await track.focus();
        await track.press("ArrowRight");
        await page.waitForFunction(id => document.getElementById(id)?.nextElementSibling?.querySelector("[role=status]")?.textContent?.startsWith("2 /"), await track.getAttribute("id"));
        await track.press("Home");
        await page.waitForFunction(id => document.getElementById(id)?.scrollLeft === 0, await track.getAttribute("id"));
        const opener = track.locator(".poster-open").first();
        await opener.click();
        await page.getByRole("button", { name: "下一张", exact: true }).click();
        await page.keyboard.press("Escape");
        await page.locator("dialog").waitFor({ state: "hidden" });
        assert.ok(await opener.evaluate(element => element === document.activeElement), "modal returns focus to the original rail artwork");
      }
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await desktop.goto(origin + "/projects/poster-collection");
  assert.equal(await desktop.locator(".gallery-rail-controls").first().isVisible(), false, "desktop keeps the existing gallery grid");
  const noScript = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noScript.goto(origin + "/projects/poster-collection");
  assert.equal(await noScript.locator(".poster-open").count(), 18, "original artwork is rendered without client JavaScript");
  assert.ok(await noScript.locator(".gallery-rail-track img").first().isVisible(), "SSR artwork stays visible");
  console.log("PASS: native rails at 390/360, normal/reduced motion, actual scroll status, partial previews, keyboard boundaries/focus, stable page scroll, all 18 originals and desktop grid.");
} finally {
  await browser.close();
}
