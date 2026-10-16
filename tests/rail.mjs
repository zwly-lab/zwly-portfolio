// Optional browser runtime; no package dependency.
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href : "playwright");
const origin = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
try {
  for (const width of [1440, 390, 360]) {
    for (const reducedMotion of ["no-preference", "reduce"]) {
      const page = await browser.newPage({ viewport: { width, height: width > 760 ? 1000 : 844 }, reducedMotion });
      page.setDefaultTimeout(15000);
      console.log(`Checking rails at ${width}px (${reducedMotion})`);
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(origin + "/projects/poster-collection");
      const rails = page.locator(".gallery-rail");
      assert.equal(await rails.count(), 2, "only the two three-work series become rails");
      assert.equal(await page.locator(".poster-open").count(), 8, "near duplicates are omitted from public rendering");
      assert.equal(await page.getByRole("region", { name: "水彩与留白，可左右浏览" }).count(), 0, "a single work needs no carousel");
      for (const rail of await rails.all()) {
        const track = rail.locator(".gallery-rail-track");
        const id = await track.getAttribute("id");
        const previous = rail.locator(".gallery-rail-controls button").first();
        const next = rail.locator(".gallery-rail-controls button").last();
        const waitPosition = async index => {
          await page.waitForFunction(({ id, index }) => {
            const element = document.getElementById(id);
            const card = element?.children[index];
            if (!element || !card) return false;
            const target = Math.max(0, Math.min(element.scrollWidth - element.clientWidth, card.offsetLeft + card.offsetWidth / 2 - element.clientWidth / 2));
            return Math.abs(element.scrollLeft - target) < 1 && element.nextElementSibling.querySelector("[role=status]").textContent === `${index + 1} / 3`;
          }, { id, index }, { timeout: 15000 });
          await track.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        };
        const placeArtwork = async placement => {
          await track.evaluate((element, placement) => {
            const card = element.children[0];
            const height = card.querySelector(".poster-open").offsetHeight;
            const header = document.querySelector(".site-header").getBoundingClientRect().bottom;
            const top = placement === "above" ? innerHeight - height + 80 : placement === "below" ? header - 80 : header + (innerHeight - header - height) / 2;
            window.scrollBy({ top: card.getBoundingClientRect().top - top, behavior: "instant" });
          }, placement);
          await track.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        };
        await rail.scrollIntoViewIfNeeded();
        await waitPosition(0);
        assert.ok(await next.isVisible(), "desktop and mobile both expose navigation");
        assert.ok(await track.evaluate(element => element.scrollWidth > element.clientWidth), "the track really overflows");
        const frames = [];
        for (const button of await track.locator(".poster-open").all()) {
          // Offscreen rail art is intentionally lazy: visit it before asking it to decode.
          await button.scrollIntoViewIfNeeded();
          frames.push(await button.evaluate(async button => {
            const image = button.querySelector("img");
            await Promise.race([image.decode(), new Promise((_, reject) => setTimeout(() => reject(new Error(`Artwork did not decode: ${image.alt}`)), 15000))]);
            return { height: button.offsetHeight, ratioError: Math.abs(image.offsetHeight - image.offsetWidth * image.naturalHeight / image.naturalWidth), contained: image.offsetWidth <= button.clientWidth && image.offsetHeight <= button.clientHeight };
          }));
        }
        await track.focus();
        await track.press("Home");
        await waitPosition(0);
        if (width !== 360) {
          for (const [placement, index, deltaY] of [["above", 0, 40], ["below", 2, -40]]) {
            await track.press(index === 0 ? "Home" : "End");
            await waitPosition(index);
            await placeArtwork(placement);
            const before = await track.evaluate(element => ({ left: element.scrollLeft, y: scrollY, turns: [...element.children].map(card => card.style.getPropertyValue("--rail-turn")) }));
            assert.equal(await track.evaluate((element, deltaY) => {
              const event = new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true });
              element.dispatchEvent(event);
              return event.defaultPrevented;
            }, deltaY), false, `${placement}: a clipped artwork must not capture vertical wheel input`);
            const pointer = await track.evaluate(element => {
              const card = element.querySelector("[data-active=true]");
              const rect = card.getBoundingClientRect();
              const header = document.querySelector(".site-header").getBoundingClientRect().bottom;
              return { x: rect.left + rect.width / 2, y: (Math.max(header, rect.top) + Math.min(innerHeight, rect.top + card.querySelector(".poster-open").offsetHeight)) / 2 };
            });
            await page.mouse.move(pointer.x, pointer.y);
            await page.mouse.wheel(0, deltaY);
            await page.waitForFunction(y => Math.abs(scrollY - y) > 1, before.y);
            await waitPosition(index);
            assert.ok(Math.abs(await track.evaluate(element => element.scrollLeft) - before.left) < 1, `${placement}: the page scrolls before the rail advances`);
            assert.deepEqual(await track.locator("figure").evaluateAll(cards => cards.map(card => card.style.getPropertyValue("--rail-turn"))), before.turns, `${placement}: partial visibility does not change artwork rotation`);
          }
          await track.press("Home");
          await waitPosition(0);
        }
        await placeArtwork("ready");
        assert.ok(frames.every(frame => Math.abs(frame.height - frames[0].height) <= 1), "mixed formats share an equal frame height");
        assert.ok(frames.every(frame => frame.ratioError <= 2 && frame.contained), "complete images retain their intrinsic ratio");
        await next.focus();
        const y = await page.evaluate(() => scrollY);
        await next.press("Enter");
        await waitPosition(1);
        assert.equal(await page.evaluate(() => scrollY), y, "rail controls do not move the vertical page");
        assert.equal(await track.locator("figure[data-active=true]").count(), 1, "actual scroll marks one nearest work");
        if (reducedMotion === "reduce") assert.ok(await track.locator("figure, .poster-open").evaluateAll(cards => cards.every(card => getComputedStyle(card).transform === "none")), "reduced motion keeps the artwork flat");
        else assert.ok(await track.locator("figure").evaluateAll(cards => cards.some(card => Math.abs(parseFloat(card.style.getPropertyValue("--rail-turn"))) > .1)), "depth responds to the actual scroll centers");
        await track.focus();
        await track.press("End");
        await waitPosition(2);
        await next.focus();
        assert.equal(await next.getAttribute("aria-disabled"), "true");
        const end = await track.evaluate(element => element.scrollLeft);
        await next.press("Enter");
        assert.ok(Math.abs(await track.evaluate(element => element.scrollLeft) - end) <= 1, "the final next button does not wrap (allow one pixel of native snap rounding)");
        assert.ok(await next.evaluate(element => element === document.activeElement), "a boundary retains keyboard focus");
        const outward = await track.evaluate(element => {
          const event = new WheelEvent("wheel", { deltaY: 300, bubbles: true, cancelable: true });
          element.dispatchEvent(event);
          return event.defaultPrevented;
        });
        assert.equal(outward, false, "an outward wheel at the end yields to normal page scrolling");
        await track.focus();
        await track.press("Home");
        await waitPosition(0);
        assert.equal(await previous.getAttribute("aria-disabled"), "true");
        assert.equal(await track.evaluate(element => {
          const event = new WheelEvent("wheel", { deltaY: -300, bubbles: true, cancelable: true });
          element.dispatchEvent(event);
          return event.defaultPrevented;
        }), false, "the beginning also yields outward wheel input");
        await track.hover();
        await placeArtwork("ready");
        for (const input of [{ deltaX: 100, deltaY: 0 }, { deltaY: 100, ctrlKey: true }]) {
          assert.equal(await track.evaluate((element, input) => {
            const event = new WheelEvent("wheel", { ...input, bubbles: true, cancelable: true });
            element.dispatchEvent(event);
            return event.defaultPrevented;
          }, input), false, "native horizontal scrolling and pinch zoom are not intercepted");
        }
        await waitPosition(0);
        const wheelY = await page.evaluate(() => scrollY);
        await page.mouse.wheel(0, 100);
        await waitPosition(1);
        assert.equal(await page.evaluate(() => scrollY), wheelY, "one standard mouse notch advances a work without scrolling the page");
        if (reducedMotion === "no-preference") {
          await track.focus();
          await track.press("Home");
          await waitPosition(0);
          await track.evaluate(element => {
            for (let index = 0; index < 3; index++) element.dispatchEvent(new WheelEvent("wheel", { deltaY: 100, bubbles: true, cancelable: true }));
          });
          await waitPosition(1);
          await page.mouse.wheel(0, 100);
          await page.waitForFunction(id => {
            const element = document.getElementById(id);
            return element.scrollLeft > element.children[1].offsetLeft + element.children[1].offsetWidth / 2 - element.clientWidth / 2 + 20;
          }, id, { timeout: 15000 });
          await track.evaluate(element => element.dispatchEvent(new WheelEvent("wheel", { deltaY: -100, bubbles: true, cancelable: true })));
          await waitPosition(1);
        }
        await track.focus();
        await track.press("Home");
        await waitPosition(0);
        await track.press("ArrowRight");
        await waitPosition(1);
        await track.press("ArrowLeft");
        await waitPosition(0);
        const opener = track.locator(".poster-open").first();
        await opener.click();
        await page.getByRole("button", { name: "下一张", exact: true }).click();
        await page.keyboard.press("Escape");
        await page.locator("dialog").waitFor({ state: "hidden" });
        assert.ok(await opener.evaluate(element => element === document.activeElement), "the modal returns focus to its rail opener");
      }
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
  const shortPage = await browser.newPage({ viewport: { width: 390, height: 400 }, reducedMotion: "reduce" });
  await shortPage.goto(origin + "/projects/poster-collection");
  const shortTrack = shortPage.locator(".gallery-rail-track").first();
  await shortTrack.waitFor({ state: "visible" });
  await shortPage.waitForFunction(() => document.querySelector(".gallery-rail-track").dataset.overflow === "true");
  for (const ready of [false, true]) {
    await shortTrack.evaluate((element, ready) => {
      const card = element.children[0];
      const height = card.querySelector(".poster-open").offsetHeight;
      const header = document.querySelector(".site-header").getBoundingClientRect().bottom;
      if (height <= innerHeight - header) throw new Error("Short viewport must be smaller than the artwork");
      const top = ready ? header + (innerHeight - header - height) / 2 : header + 40;
      window.scrollBy({ top: card.getBoundingClientRect().top - top, behavior: "instant" });
    }, ready);
    await shortTrack.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await shortTrack.evaluate(element => {
      const event = new WheelEvent("wheel", { deltaY: 100, bubbles: true, cancelable: true });
      element.dispatchEvent(event);
      return event.defaultPrevented;
    }), ready, "an oversized artwork becomes ready only when it fills the usable short viewport");
  }
  await shortPage.waitForFunction(() => document.querySelector(".gallery-rail-controls [role=status]").textContent === "2 / 3");
  await shortPage.close();
  const noScript = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noScript.goto(origin + "/projects/poster-collection");
  assert.equal(await noScript.locator(".poster-open").count(), 8, "curated artwork is server rendered");
  assert.equal(await noScript.locator(".gallery-series figcaption a").count(), 8, "every work keeps its original-image link without JavaScript");
  assert.ok(await noScript.locator(".gallery-rail-track img").first().isVisible(), "native scrolling content stays visible without JavaScript");
  assert.equal(await noScript.locator(".gallery-rail-controls").first().isVisible(), false, "without JavaScript the native rail omits inert navigation buttons");
  console.log("PASS: two native rails on desktop/390/360, curated content, actual scroll and depth, reduced-motion flatness, wheel boundaries, keyboard, complete artwork, modal focus and no-JavaScript originals.");
} finally { await browser.close(); }
