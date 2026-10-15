// Optional external Playwright runtime; no project dependency or running server is added.
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href : "playwright");
const origin = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
const errors = [];
let passed = 0;
async function check(name, options, run) {
  const context = await browser.newContext({ viewport: { width: options.width || 1440, height: 1000 }, reducedMotion: options.reduce ? "reduce" : "no-preference", javaScriptEnabled: options.js !== false });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(options => {
    window.openingFrames = [];
    window.openingRuns = 0;
    window.headingEntries = [];
    window.artifactAnimations = [];
    window.openingLanded = [];
    const animate = Element.prototype.animate;
    Element.prototype.animate = function(frames, timing) {
      if (this.matches("#main-content h1, .hero-name")) window.headingEntries.push({ duration: timing.duration, delay: timing.delay || 0 });
      const animation = animate.call(this, frames, timing);
      if (this.matches("[data-opening-preview]")) window.artifactAnimations.push(animation);
      return animation;
    };
    if (options.hidden) Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    if (options.scrolled) Object.defineProperty(window, "scrollY", { configurable: true, get: () => 150 });
    if (options.blocked) Storage.prototype.getItem = Storage.prototype.setItem = () => { throw new DOMException("Storage disabled", "SecurityError"); };
    let previous = false;
    new MutationObserver(() => {
      const active = document.documentElement?.hasAttribute("data-site-opening");
      if (active && !previous) window.openingRuns++;
      if (active && !previous && options.cancelEarly) queueMicrotask(() => window.dispatchEvent(new Event("pointerdown")));
      previous = active;
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ["data-site-opening"] });
    let handled = false;
    document.addEventListener("animationstart", event => {
      if (event.animationName !== "site-unveil" || handled) return;
      handled = true;
      if (options.stall) document.querySelector(".site-opening").getAnimations().forEach(animation => animation.pause());
      if (options.cancel) setTimeout(() => {
        if (options.cancel === "reduce") {
          // The test runner changes the real media preference after this signal.
          window.readyForReduction = true;
        } else if (options.cancel === "hidden") {
          Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
          document.dispatchEvent(new Event("visibilitychange"));
        } else window.dispatchEvent(new Event(options.cancel));
      }, 80);
    }, true);
    document.addEventListener("animationend", event => {
      if (event.animationName !== "site-unveil") return;
      window.openingLanded = [...document.querySelectorAll("[data-opening-preview]")].map(preview => {
        const target = [...document.querySelectorAll(".portfolio-showcase [data-preview]")].find(item => item.dataset.preview === preview.dataset.openingPreview).querySelector(".overview-frame");
        const bounds = preview.getBoundingClientRect(), destination = target.getBoundingClientRect();
        return { error: Math.max(...["left", "top", "width", "height"].map(key => Math.abs(bounds[key] - destination[key]))), sameImage: preview.querySelector("img").currentSrc === target.querySelector("img").currentSrc, sameFit: getComputedStyle(preview.querySelector("img")).objectFit === getComputedStyle(target.querySelector("img")).objectFit };
      });
    }, true);
    function sample() {
      const curtain = document.querySelector(".site-opening");
      const main = document.querySelector("#main-content");
      const header = document.querySelector(".site-header");
      if (curtain && main && header && document.documentElement.hasAttribute("data-site-opening")) {
        const preview = document.querySelector("[data-opening-preview]");
        const transform = new DOMMatrix(getComputedStyle(preview).transform);
        const camera = new DOMMatrix(getComputedStyle(document.querySelector(".site-camera")).transform);
        const focus = getComputedStyle(document.querySelector(".site-page"));
        const planes = [...document.querySelectorAll("[data-opening-preview]")].map(element => {
          const matrix = new DOMMatrix(getComputedStyle(element).transform);
          const radius = Math.abs(matrix.m13) * element.offsetWidth / 2 + Math.abs(matrix.m23) * element.offsetHeight / 2;
          return { near: matrix.m43 + radius, far: matrix.m43 - radius };
        });
        window.openingFrames.push({ time: performance.now(), cameraTilt: Math.atan2(camera.m23, camera.m22), cameraDepth: camera.m43, previewDepth: transform.m43, planes, blur: Number(focus.filter.match(/blur\(([\d.]+)px\)/)?.[1] || 0), rotation: Math.atan2(transform.b, transform.a), overflow: document.documentElement.scrollWidth > innerWidth + 1, pointer: getComputedStyle(curtain).pointerEvents });
      }
      if (performance.now() < 5000) requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  }, options);
  try { await run(page); passed++; console.log("PASS:", name); }
  finally { await context.close(); }
}
async function settled(page) {
  await page.waitForFunction(() => !document.documentElement.hasAttribute("data-site-opening"));
  assert.equal(await page.locator(".site-opening").evaluate(element => getComputedStyle(element).display), "none");
  assert.equal(await page.locator("#main-content").evaluate(element => getComputedStyle(element).transform), "none");
  assert.equal(await page.locator(".site-camera").evaluate(element => getComputedStyle(element).transform), "none");
  assert.equal(await page.locator(".site-page").evaluate(element => getComputedStyle(element).filter), "none");
  assert.ok(await page.evaluate(() => document.documentElement.scrollHeight > innerHeight * 2), "full document height is released after entry");
  assert.equal(await page.evaluate(() => document.documentElement.hasAttribute("data-opening-artifacts")), false);
  assert.equal(await page.locator(".portfolio-showcase .overview-frame").first().evaluate(element => getComputedStyle(element).visibility), "visible");
}
async function usable(page) {
  assert.equal(await page.locator(".hero-name").innerText(), "Vibe Coding.");
  assert.equal(await page.locator(".overview-work").count(), 3);
  assert.equal(await page.locator(".overview-images").getAttribute("aria-busy"), "false");
  assert.equal(await page.locator('[role="progressbar"]').count(), 0);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
  await page.locator(".hero-intro > .text-link").click();
  await page.waitForURL("**/projects");
}
try {
  for (const width of [1440, 390]) {
    await check(`whole-page reveal, reload and client return ${width}`, { width }, async page => {
      await page.goto(origin);
      await settled(page);
      const frames = await page.evaluate(() => window.openingFrames);
      assert.ok(frames.length > 5, "actual CSS opening paints several frames");
      assert.equal(await page.evaluate(() => document.querySelector(".site-page").parentElement === document.querySelector(".site-opening").parentElement), true, "real page and artifacts share one camera");
      assert.ok(frames.some(frame => frame.cameraTilt > .08 && frame.cameraDepth < -20), "the real page starts inside a tilted spatial view");
      assert.ok(frames.every((frame, index) => !index || frame.cameraTilt <= frames[index - 1].cameraTilt + .002), "camera continuously straightens without reversing");
      assert.ok(frames.some(frame => frame.previewDepth > 20), "work lifts off the page in depth");
      const unfolded = frames.filter(frame => frame.time - frames[0].time < 900 && frame.previewDepth > 20);
      assert.ok(unfolded.length > 2 && unfolded.every(frame => frame.planes.slice(1).every((plane, index) => plane.far > frame.planes[index].near)), "overlapping previews keep separate depth planes instead of cutting through each other");
      assert.ok(frames.some(frame => frame.blur > .5) && frames.at(-1).blur < .05, "focus passes from work to the readable page");
      assert.ok(frames.every(frame => !frame.overflow), "camera never creates horizontal scrolling");
      assert.ok(frames.some(frame => Math.abs(frame.rotation) > .1), "real previews first form a rotated image stack");
      const landed = await page.evaluate(() => window.openingLanded);
      assert.equal(landed.length, 3);
      assert.ok(landed.every(item => item.error < 1 && item.sameImage && item.sameFit), "all previews hand off to the same image, crop and actual destination within one pixel");
      assert.ok(frames.every(frame => frame.pointer === "none"), "curtain never captures a visitor action");
      assert.equal(await page.evaluate(() => window.headingEntries.length), 0, "no competing title entrance on hydration");
      assert.equal(await page.evaluate(() => window.openingRuns), 1);
      await page.reload();
      await settled(page);
      assert.equal(await page.evaluate(() => window.openingRuns), 1, "full reload visibly replays instead of consulting an old session flag");
      await usable(page);
      await page.getByRole("link", { name: "ZWLY Lab 首页", exact: true }).click();
      await page.waitForURL(origin + "/");
      assert.equal(await page.evaluate(() => document.documentElement.hasAttribute("data-site-opening")), false, "client return keeps normal routing");
      assert.equal(await page.evaluate(() => window.openingRuns), 1);
    });
    await check(`reduced motion ${width}`, { width, reduce: true }, async page => {
      await page.goto(origin); await settled(page); await usable(page);
      assert.equal(await page.evaluate(() => window.openingRuns), 0);
    });
    await check(`no JavaScript baseline ${width}`, { width, js: false }, async page => {
      await page.goto(origin); await settled(page); await usable(page);
    });
  }
  for (const [name, options, suffix] of [["fragment", {}, "#work-title"], ["restored scroll", { scrolled: true }, ""], ["background document", { hidden: true }, ""]]) {
    await check(name + " preserves direct browsing", options, async page => {
      await page.goto(origin + suffix); await settled(page);
      assert.equal(await page.evaluate(() => window.openingRuns), 0);
    });
  }
  await check("storage failure cannot suppress or block the page", { blocked: true }, async page => {
    await page.goto(origin); await settled(page);
    assert.equal(await page.evaluate(() => window.openingRuns), 1); await usable(page);
  });
  for (const cancel of ["keydown", "pointerdown", "wheel", "touchmove", "scroll", "hidden", "reduce"]) {
    await check(cancel + " interrupts before hydration or selection", { cancel }, async page => {
      if (cancel === "reduce") {
        await page.goto(origin, { waitUntil: "domcontentloaded" });
        await page.waitForFunction(() => window.readyForReduction);
        await page.emulateMedia({ reducedMotion: "reduce" });
      } else await page.goto(origin);
      await settled(page);
      assert.equal(await page.evaluate(() => window.openingRuns), 1);
      const frames = await page.evaluate(() => window.openingFrames);
      assert.ok(frames.length > 0 && frames.at(-1).time - frames[0].time < 1000, "input skips instead of waiting for the full opening");
      if (cancel !== "reduce") {
        await page.getByRole("button", { name: "应用作品", exact: true }).click();
        await page.waitForFunction(() => document.querySelector('.overview-applications[aria-busy="false"]'));
      }
    });
  }
  await check("late hydration does not postpone or replay the opening", {}, async page => {
    await page.route("**/_next/static/**/*.js", async route => { await new Promise(resolve => setTimeout(resolve, 1600)); await route.continue(); });
    await page.goto(origin); await settled(page);
    const state = await page.evaluate(() => ({ runs: window.openingRuns, last: window.openingFrames.at(-1)?.time, paint: performance.getEntriesByName("first-contentful-paint")[0]?.startTime, entries: window.headingEntries }));
    assert.equal(state.runs, 1);
    assert.ok(state.paint !== undefined && state.last - state.paint < 3100, "opening finishes independently of the delayed framework bundle");
    assert.deepEqual(state.entries, []);
    await usable(page);
  });
  await check("slow images do not prolong the opening", {}, async page => {
    await page.route("**/_next/image*", async route => { await new Promise(resolve => setTimeout(resolve, 5000)); await route.continue(); });
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await settled(page);
    assert.equal(await page.locator(".overview-work img").first().evaluate(image => image.complete), false);
    await usable(page);
  });
  await check("missing animation completion cannot leave a cover behind", { stall: true }, async page => {
    await page.goto(origin); await settled(page); await usable(page);
  });
  await check("input before DOM readiness cannot revive artifact motion later", { cancelEarly: true }, async page => {
    await page.goto(origin); await settled(page);
    assert.equal(await page.evaluate(() => window.artifactAnimations.length), 0);
    await usable(page);
  });
  await check("viewport changes release measured artifact geometry", {}, async page => {
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => window.artifactAnimations.length === 3);
    await page.setViewportSize({ width: 640, height: 844 });
    await settled(page);
    assert.equal(await page.evaluate(() => window.artifactAnimations.every(animation => animation.playState === "idle")), true);
    await usable(page);
  });
  await check("real PageDown skips the camera and immediately scrolls the full document", {}, async page => {
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => window.artifactAnimations.length === 3);
    await page.keyboard.press("PageDown");
    await settled(page);
    await page.waitForFunction(() => scrollY > 0);
  });
  await check("failed artwork does not block entry or real navigation", {}, async page => {
    await page.route("**/_next/image*", route => route.abort("failed"));
    await page.goto(origin); await settled(page); await usable(page);
  });
  await check("other page entry retains its ordinary heading animation", {}, async page => {
    await page.goto(origin + "/about");
    await page.waitForFunction(() => window.headingEntries.length > 0);
    assert.equal(await page.evaluate(() => window.openingRuns), 0);
    assert.equal(await page.evaluate(() => window.headingEntries[0].duration), 480);
  });
  await check("browser history does not replay the opening", {}, async page => {
    await page.goto(origin); await settled(page);
    await page.goto(origin + "/about");
    await page.goBack(); await settled(page);
  });
  assert.deepEqual(errors, [], "no browser runtime errors");
  console.log(`PASS: ${passed} whole-page opening browser scenarios.`);
} finally { await browser.close(); }
