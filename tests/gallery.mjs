// Uses the same optional browser runtime as browser.mjs; no package dependency.
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href : "playwright");
const origin = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width < 760 ? 844 : 1000 });
    for (const reducedMotion of ["no-preference", "reduce"]) {
      await page.emulateMedia({ reducedMotion });
      await page.goto(origin + "/projects/poster-collection");
      const triggers = page.locator(".poster-open");
      const order = await triggers.locator("img").evaluateAll(images => images.map(image => image.alt));
      assert.equal(order.length, 18, "all originals remain in the gallery, including collapsed variants/archive");
      assert.equal(new Set(order).size, 18, "each original appears once");
      assert.equal(order[0], "旅行拼贴 · 圣托里尼", "travel diary leads the displayed collection");
      const first = triggers.first();
      await first.click();
      const assertArtwork = async index => {
        await page.waitForFunction(({ title, count }) => document.querySelector(".lightbox-image")?.alt === title && document.querySelector(".lightbox-controls p")?.textContent === count, { title: order[index], count: `${index + 1} / 18` });
        assert.equal(await page.locator("#poster-dialog-title").textContent(), order[index]);
      };
      const stageBounds = () => page.locator(".lightbox-controls").evaluate(element => ({ top: element.getBoundingClientRect().top, bottom: element.getBoundingClientRect().bottom, viewport: innerHeight }));
      await assertArtwork(0);
      assert.equal(await page.getByRole("button", { name: "上一张", exact: true }).isDisabled(), true);
      await page.keyboard.press("ArrowLeft");
      await assertArtwork(0);
      const initial = await stageBounds();
      for (let index = 1; index < order.length; index++) {
        if (index % 2) await page.getByRole("button", { name: "下一张", exact: true }).click();
        else await page.keyboard.press("ArrowRight");
        await assertArtwork(index);
        const current = await stageBounds();
        assert.ok(Math.abs(current.top - initial.top) < 1, "controls stay stable across portrait/landscape originals");
        assert.ok(current.bottom <= current.viewport, "controls remain within the viewport");
      }
      assert.equal(await page.getByRole("button", { name: "下一张", exact: true }).isDisabled(), true);
      assert.equal(await page.locator("dialog").evaluate(dialog => dialog.contains(document.activeElement)), true, "disabling the last next button retains modal focus");
      await page.keyboard.press("ArrowRight");
      await assertArtwork(17);
      await page.keyboard.press("ArrowLeft");
      await assertArtwork(16);
      for (let index = 15; index >= 0; index--) {
        await page.getByRole("button", { name: "上一张", exact: true }).click();
        await assertArtwork(index);
      }
      assert.equal(await page.locator("dialog").evaluate(dialog => dialog.contains(document.activeElement)), true, "disabling the first previous button retains modal focus");
      await page.keyboard.press("ArrowRight");
      await assertArtwork(1);
      await page.keyboard.press("Escape");
      await page.locator("dialog").waitFor({ state: "hidden" });
      assert.equal(await first.evaluate(element => element === document.activeElement), true, "native dialog returns focus to the original opener after navigation");
      // Open every disclosure so original thumbnails can be checked against the same sequence.
      for (const summary of await page.locator(".gallery-series details > summary").all()) await summary.click();
      for (const index of [3, 8, 11, 14, 17]) {
        const trigger = triggers.nth(index);
        await trigger.click();
        await assertArtwork(index);
        if (index < 17) {
          await page.keyboard.press("ArrowRight");
          await assertArtwork(index + 1);
        }
        await page.getByRole("button", { name: "关闭", exact: true }).click();
        await page.locator("dialog").waitFor({ state: "hidden" });
        assert.equal(await trigger.evaluate(element => element === document.activeElement), true, "variant/archive close restores its own thumbnail focus");
      }
    }
  }
  assert.deepEqual(errors, []);
  console.log("PASS: displayed gallery order matches modal count and adjacent navigation across all 18 originals, variants/archive, desktop/mobile, normal/reduced motion, keyboard boundaries, stable controls and original focus restoration.");
} finally { await browser.close(); }
