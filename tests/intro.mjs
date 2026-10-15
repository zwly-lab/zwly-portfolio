// Optional external Playwright runtime; no project dependency or running server is added.
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href : "playwright");
const origin = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
const errors = [];
let passed = 0;
async function fixture(options = {}) {
  const context = await browser.newContext({ viewport: { width: options.width || 1440, height: 1000 }, reducedMotion: options.reduce ? "reduce" : "no-preference", javaScriptEnabled: options.js !== false });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(options => {
    window.introLog = [];
    window.introAnimations = [];
    window.introDecodes = [];
    window.otherEntries = [];
    if (options.seen) sessionStorage.setItem("zwly-home-intro-v1", "1");
    if (options.blocked) {
      Storage.prototype.getItem = Storage.prototype.setItem = () => { throw new DOMException("Storage disabled", "SecurityError"); };
    }
    if (options.hidden) { Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" }); Object.defineProperty(document, "hidden", { configurable: true, get: () => true }); }
    // A restored document can already be scrolled when layout effects run.
    if (options.scrolled) Object.defineProperty(window, "scrollY", { configurable: true, get: () => 150 });
    const animate = Element.prototype.animate;
    Element.prototype.animate = function(frames, timing) {
      const owned = this.matches(".site-header .wordmark, .hero-name, .hero-subtitle, .hero-intro > p, .hero-intro > .text-link, .overview-work, .overview-work img");
      const animation = animate.call(this, frames, timing);
      if (this.matches("#main-content h1")) window.otherEntries.push({ duration: timing.duration, delay: timing.delay || 0 });
      if (owned) {
        window.introLog.push({ target: this.matches(".overview-work img") ? "image" : this.className || this.tagName, duration: timing.duration, delay: timing.delay || 0, frames });
        window.introAnimations.push(animation);
        animation.pause();
      }
      return animation;
    };
    if (options.decode) {
      const decode = HTMLImageElement.prototype.decode;
      const complete = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "complete");
      Object.defineProperty(HTMLImageElement.prototype, "complete", { configurable: true, get() { return this.closest(".overview-work") ? false : complete.get.call(this); } });
      HTMLImageElement.prototype.decode = function() {
        if (!this.closest(".overview-work")) return decode.call(this);
        if (options.decode === "fail") return Promise.reject(new Error("Expected image decode failure"));
        return new Promise(resolve => window.introDecodes.push(resolve));
      };
    }
  }, options);
  return { page, context };
}
async function usable(page) {
  assert.equal(await page.locator(".hero-name").innerText(), "Vibe Coding.");
  assert.ok(await page.locator(".hero-intro > p").isVisible(), "summary remains in layout");
  assert.equal(await page.locator(".overview-work").count(), 3);
  assert.equal(await page.locator(".overview-images").getAttribute("aria-busy"), "false", "initial content never waits for images");
  assert.equal(await page.locator('[role="progressbar"]').count(), 0, "intro has no artificial progress gate");
  assert.equal(await page.locator(".hero-intro > .text-link").getAttribute("href"), "/projects");
  const layout = await page.evaluate(() => {
    const link = document.querySelector(".hero-intro > .text-link");
    const rectangle = link.getBoundingClientRect();
    const style = getComputedStyle(link);
    return { width: rectangle.width, height: rectangle.height, pointerEvents: style.pointerEvents, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
  });
  assert.ok(layout.width > 20 && layout.height > 10 && layout.pointerEvents !== "none", "real navigation remains operable");
  assert.equal(layout.overflow, false, "intro creates no horizontal overflow");
}
async function entered(page) {
  await page.waitForFunction(() => window.introLog.some(item => item.target === "hero-name"));
}
async function settled(page) {
  await page.waitForLoadState("load");
  await page.waitForTimeout(400);
}
async function stopped(page) {
  await page.waitForFunction(() => window.introAnimations.length > 0 && window.introAnimations.every(animation => animation.playState === "idle"));
  assert.equal(await page.locator(".hero-name").evaluate(element => getComputedStyle(element).clipPath), "none", "cancel reveals the SSR baseline");
}
async function check(name, options, run) {
  const { page, context } = await fixture(options);
  try { await run(page); passed++; console.log("PASS:", name); }
  finally { await context.close(); }
}
try {
  for (const width of [1440, 390]) {
    await check(`first visit timing and usable content ${width}`, { width }, async page => {
      await page.goto(origin); await entered(page); await usable(page);
      const log = await page.evaluate(() => window.introLog);
      const expected = [["wordmark", 300, 0], ["hero-name", 480, 40], ["hero-subtitle", 300, 100], ["P", 300, 160], ["text-link", 300, 200]];
      for (const [target, duration, delay] of expected) {
        const matches = log.filter(item => item.target === target);
        assert.equal(matches.length, 1, target + " animates once");
        assert.equal(matches[0].duration, duration, target + " duration");
        assert.equal(matches[0].delay, delay, target + " delay");
      }
      assert.equal(log.find(item => item.target === "hero-name").frames[0].clipPath, "inset(0 100% 0 0)");
      const works = log.filter(item => item.target.startsWith("overview-work "));
      assert.equal(works.length, 3);
      assert.deepEqual(works.map(item => item.delay), [160, 220, 280]);
      assert.ok(works.every(item => item.duration === 480 && "transform" in item.frames[0] && "clipPath" in item.frames[0]));
      assert.ok(log.every(item => item.delay + item.duration <= 800), "first entry completes within 800ms");
      assert.equal(await page.locator(".overview-images").evaluate(element => element.getAnimations().length), 0, "parent overview does not compete");
      assert.equal(await page.evaluate(() => sessionStorage.getItem("zwly-home-intro-v1") !== null), true);
      await page.evaluate(() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true })));
      await stopped(page); await usable(page);
      await page.reload(); await settled(page);
      assert.equal(await page.evaluate(() => window.introLog.length), 0, "seen session never replays full intro");
      await page.getByRole("link", { name: "作品", exact: true }).click();
      await page.waitForURL("**/projects"); await page.goBack(); await page.waitForURL(origin + "/");
      await settled(page);
      assert.equal(await page.evaluate(() => window.introLog.some(item => item.target === "wordmark")), false, "client navigation back never replays full intro");
    });
    await check(`reduced motion ${width}`, { width, reduce: true }, async page => {
      await page.goto(origin); await settled(page); await usable(page);
      assert.equal(await page.evaluate(() => window.introLog.length), 0);
    });
    await check(`no JavaScript baseline ${width}`, { width, js: false }, async page => {
      await page.goto(origin); await usable(page);
      assert.equal(await page.locator(".hero-name").evaluate(element => getComputedStyle(element).clipPath), "none");
      await page.locator(".hero-intro > .text-link").click(); await page.waitForURL("**/projects");
    });
  }
  for (const [name, options, suffix] of [["fragment", {}, "/#work-title"], ["restored scroll", { scrolled: true }, "/"], ["hidden document", { hidden: true }, "/"]]) {
    await check(name + " skips long intro", options, async page => {
      await page.goto(origin + suffix); await settled(page); await usable(page);
      assert.equal(await page.evaluate(() => window.introLog.some(item => item.target === "wordmark")), false);
    });
  }
  await check("blocked sessionStorage remains usable", { blocked: true }, async page => {
    await page.goto(origin); await entered(page); await usable(page);
    await page.keyboard.press("Tab"); await stopped(page);
  });
  for (const event of ["keyboard", "wheel", "pointer", "touchmove", "scroll", "reduce", "hidden"]) {
    await check(event + " cancels initial owned animations and late decode", { decode: "slow" }, async page => {
      await page.goto(origin); await entered(page); await usable(page);
      await page.waitForFunction(() => window.introDecodes.length === 3);
      if (event === "keyboard") await page.keyboard.press("Tab");
      else if (event === "wheel") await page.mouse.wheel(0, 80);
      else if (event === "pointer") await page.locator(".site-header").dispatchEvent("pointerdown");
      else if (event === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
      else if (event === "hidden") await page.evaluate(() => {
        Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
        Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
        document.dispatchEvent(new Event("visibilitychange"));
      });
      else await page.evaluate(type => document.dispatchEvent(new Event(type, { bubbles: true })), event);
      await stopped(page);
      const before = await page.evaluate(() => window.introLog.length);
      await page.evaluate(() => window.introDecodes.forEach(resolve => resolve()));
      await page.waitForTimeout(80);
      assert.equal(await page.evaluate(() => window.introLog.length), before, "late decode cannot revive canceled entry");
      if (event === "reduce") await page.emulateMedia({ reducedMotion: "no-preference" });
      if (event === "hidden") await page.evaluate(() => { Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" }); Object.defineProperty(document, "hidden", { configurable: true, get: () => false }); });
      await page.getByRole("button", { name: "应用作品", exact: true }).click();
      await page.waitForFunction(() => document.querySelector('.overview-applications[aria-busy="false"]'));
      assert.ok(await page.evaluate(() => window.introLog.length > 8), "later showcase transitions still animate");
    });
  }
  await check("slow decode only fades images after decode", { decode: "slow" }, async page => {
    await page.goto(origin); await entered(page); await usable(page);
    await page.waitForFunction(() => window.introDecodes.length === 3);
    assert.equal(await page.evaluate(() => window.introLog.filter(item => item.target === "image").length), 0);
    await page.evaluate(() => window.introDecodes.forEach(resolve => resolve()));
    await page.waitForFunction(() => window.introLog.filter(item => item.target === "image").length === 3);
    const fades = await page.evaluate(() => window.introLog.filter(item => item.target === "image"));
    assert.ok(fades.every(item => item.duration === 300 && item.frames.every(frame => Object.keys(frame).every(key => key === "opacity"))), "late images receive only a 300ms opacity fade");
  });
  await check("failed images preserve navigation and content", { decode: "fail" }, async page => {
    await page.route("**/_next/image*", route => route.abort("failed"));
    await page.goto(origin); await entered(page); await usable(page);
    await page.keyboard.press("Tab"); await stopped(page);
    await page.locator(".hero-intro > .text-link").click(); await page.waitForURL("**/projects");
  });
  await check("other page direct entry retains ordinary heading motion", {}, async page => {
    await page.goto(origin + "/about"); await settled(page);
    assert.ok(await page.locator("h1").isVisible());
    assert.deepEqual(await page.evaluate(() => window.otherEntries), [{ duration: 480, delay: 0 }]);
    assert.equal(await page.evaluate(() => window.introLog.some(item => item.target === "wordmark")), false);
  });
  await check("late hydration preserves already painted content", {}, async page => {
    await page.route("**/_next/static/**/*.js", async route => {
      await new Promise(resolve => setTimeout(resolve, 1600));
      await route.continue();
    });
    try {
      await page.goto(origin, { waitUntil: "domcontentloaded" });
      await usable(page);
      await page.waitForFunction(() => sessionStorage.getItem("zwly-home-intro-v1") === "1");
      const paint = await page.evaluate(() => {
        const first = performance.getEntriesByName("first-contentful-paint")[0];
        return { first: first?.startTime, now: performance.now(), log: window.introLog };
      });
      assert.ok(paint.first > 0 && paint.now - paint.first > 500, "real delayed JavaScript hydrates after visible content");
      assert.deepEqual(paint.log, [], "late hydration cannot hide already painted text");
      await usable(page);
      await page.locator(".hero-intro > .text-link").click();
      await page.waitForURL("**/projects");
      assert.ok(await page.locator("h1").isVisible(), "real navigation remains usable after delayed hydration");
    } finally { await page.unrouteAll({ behavior: "wait" }); }
  });
  assert.deepEqual(errors, [], "no page runtime errors");
  console.log(`PASS: ${passed} first-visit intro browser scenarios.`);
} finally { await browser.close(); }



