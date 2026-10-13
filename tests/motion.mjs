// Uses the same optional browser runtime as browser.mjs; no package dependency.
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href : "playwright");
const origin = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    window.motionLog = [];
    const animate = Element.prototype.animate;
    Element.prototype.animate = function(frames, options) {
      window.motionLog.push({ target: this.className || this.tagName, duration: options.duration, delay: options.delay || 0 });
      return animate.call(this, frames, options);
    };
  });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(origin);
    await page.waitForFunction(() => window.motionLog.some(item => item.target === "hero-name"));
    const entry = await page.evaluate(() => ({ log: window.motionLog, css: getComputedStyle(document.querySelector(".overview-images")).animationName }));
    assert.equal(entry.log.filter(item => item.target === "hero-name").length, 1, "name enters once");
    assert.equal(entry.log.filter(item => item.target === "H1").length, 0, "headline leaves do not compete with a parent entrance");
    assert.equal(entry.log.find(item => item.target === "hero-name").duration, 480, "CSS seconds/ms conversion survives production minification");
    assert.equal(entry.log.find(item => item.target === "hero-subtitle").delay, 80, "subtitle follows the name");
    assert.equal(entry.log.find(item => item.target === "hero-subtitle").duration, 300);
    assert.equal(entry.log.find(item => item.target.startsWith("overview-images")).delay, 160, "overview joins the same entry timeline");
    assert.equal(entry.css, "none", "no second CSS entrance overlaps the overview");
    await page.evaluate(() => {
      document.querySelector("h1").getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 100; });
      const button = [...document.querySelectorAll(".showcase-choices button")].find(element => element.textContent === "应用作品");
      button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      button.click();
    });
    await page.waitForFunction(() => document.querySelector(".overview-images").classList.contains("overview-applications"));
    assert.equal(await page.locator("h1").evaluate(element => element.getAnimations({ subtree: true }).length), 0, "interaction releases all headline entrances before selection");
    assert.equal(await page.locator(".overview-images").evaluate(element => element.getAnimations().length), 0);
    await page.waitForFunction(() => document.querySelector(".overview-images").getAnimations({ subtree: true }).length === 0);
    const before = await page.locator('[data-preview="/images/projects/jd-dashboard.png"]').evaluate(element => ({ left: element.getBoundingClientRect().left, top: element.getBoundingClientRect().top, width: element.getBoundingClientRect().width }));
    await page.getByRole("button", { name: "精选一览", exact: true }).click();
    const beginning = await page.locator('[data-preview="/images/projects/jd-dashboard.png"]').evaluate(element => {
      const animation = element.getAnimations()[0];
      animation.pause(); animation.currentTime = 0;
      const bounds = element.getBoundingClientRect();
      return { left: bounds.left, top: bounds.top, width: bounds.width, duration: animation.effect.getTiming().duration };
    });
    for (const key of ["left", "top", "width"]) assert.ok(Math.abs(beginning[key] - before[key]) < 2, "retained preview starts at its old " + key);
    assert.equal(beginning.duration, 300);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(() => document.getAnimations().length === 0);
    assert.equal(await page.locator(".overview-images").evaluate(element => element.getAnimations({ subtree: true }).length), 0, "changing motion preference cancels in-flight selection");
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin + "/projects");
  await page.getByRole("button", { name: "视觉创作", exact: true }).click();
  await page.getByRole("button", { name: "全部", exact: true }).click();
  const interruptedCard = page.locator('[data-project="pyscreen"]');
  const partial = await interruptedCard.evaluate(element => {
    const animation = element.getAnimations()[0];
    animation.pause(); animation.currentTime = 75;
    const bounds = element.getBoundingClientRect(), style = getComputedStyle(element);
    return { opacity: Number(style.opacity), clipPath: style.clipPath, left: bounds.left, top: bounds.top };
  });
  assert.ok(partial.opacity > 0 && partial.opacity < 1, "test interrupts an actual card entrance");
  await page.getByRole("button", { name: "教学可视化", exact: true }).click();
  const continuation = await interruptedCard.evaluate(element => {
    const animation = element.getAnimations()[0];
    animation.pause(); animation.currentTime = 0;
    const bounds = element.getBoundingClientRect(), style = getComputedStyle(element);
    return { opacity: Number(style.opacity), clipPath: style.clipPath, left: bounds.left, top: bounds.top };
  });
  for (const key of ["opacity", "left", "top"]) assert.ok(Math.abs(partial[key] - continuation[key]) < .02, "filter interruption preserves visible " + key);
  assert.equal(continuation.clipPath, partial.clipPath, "filter interruption continues its current reveal mask");
  await page.goto(origin + "/projects/poster-collection");
  const trigger = page.getByRole("button", { name: "放大查看：旅行拼贴 · 圣托里尼", exact: true });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.locator("img").evaluate(image => image.decode());
  await page.route("**/_next/image*", async route => {
    if (Number(new URL(route.request().url()).searchParams.get("w")) >= 1080) await new Promise(resolve => setTimeout(resolve, 1200));
    await route.continue();
  });
  await trigger.click();
  const preview = await page.locator(".lightbox-image").evaluate(element => ({ complete: element.complete, background: getComputedStyle(element).backgroundImage, duration: element.getAnimations()[0]?.effect.getTiming().duration, width: element.offsetWidth, height: element.offsetHeight }));
  assert.equal(preview.complete, false, "test holds the full-resolution response");
  assert.ok(preview.background.startsWith('url('), "loaded thumbnail fills the image throughout entrance");
  assert.equal(preview.duration, 480);
  assert.ok(preview.height > 500 && preview.width > 300, "unloaded artwork reserves a visible full-size frame");
  await page.locator(".lightbox-image").evaluate(element => element.decode());
  assert.equal(await page.locator(".lightbox-image").evaluate(element => getComputedStyle(element).backgroundImage), "none", "full image replaces thumbnail");
  const loadedSize = await page.locator(".lightbox-image").evaluate(element => ({ width: element.offsetWidth, height: element.offsetHeight }));
  assert.deepEqual(loadedSize, { width: preview.width, height: preview.height }, "image decoding does not resize the dialog");
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction(() => document.querySelector(".lightbox-controls p").textContent === "2 / 18");
  await page.evaluate(() => {
    const animation = document.querySelector(".lightbox-image").getAnimations()[0];
    animation.pause(); animation.currentTime = 60;
  });
  const opacity = await page.locator(".lightbox-image").evaluate(element => Number(getComputedStyle(element).opacity));
  await page.keyboard.press("Escape");
  const departure = await page.locator(".lightbox-image").evaluate(element => {
    const animation = element.getAnimations()[0];
    animation.pause(); animation.currentTime = 0;
    const frames = animation.effect.getKeyframes();
    return { from: Number(frames[0].opacity), to: frames.at(-1).opacity, transform: frames.at(-1).transform, duration: animation.effect.getTiming().duration };
  });
  assert.ok(Math.abs(departure.from - opacity) < .02, "interrupting image change preserves its current opacity");
  assert.equal(departure.to, "0", "changed artwork fades instead of flying to a different thumbnail");
  assert.equal(departure.transform, "none");
  assert.equal(departure.duration, 180, "departure is faster than arrival");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("dialog").waitFor({ state: "hidden" });
  assert.equal(await trigger.evaluate(element => element === document.activeElement), true, "mid-exit motion preference still closes and returns focus");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.unrouteAll({ behavior: "wait" });
  await trigger.click();
  await page.keyboard.press("Escape");
  await page.locator("dialog").waitFor({ state: "hidden" });
  await trigger.click();
  assert.equal(await page.locator("dialog").getAttribute("data-closing"), null, "reopen starts with a visible backdrop");
  await page.keyboard.press("Escape");
  await page.locator("dialog").waitFor({ state: "hidden" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width < 760 ? 844 : 1000 });
    await trigger.click();
    for (let step = 0; step < 20; step++) await page.keyboard.press("ArrowLeft");
    await page.waitForFunction(() => document.querySelector(".lightbox-controls p").textContent === "1 / 18");
    const bounds = () => page.evaluate(() => ({
      panel: document.querySelector("dialog").getBoundingClientRect().top,
      toolbar: document.querySelector(".lightbox-toolbar").getBoundingClientRect().top,
      controls: document.querySelector(".lightbox-controls").getBoundingClientRect().top,
      bottom: document.querySelector(".lightbox-controls").getBoundingClientRect().bottom,
      viewport: innerHeight,
    }));
    const initial = await bounds();
    for (let index = 1; index < 18; index++) {
      await page.keyboard.press("ArrowRight");
      await page.waitForFunction(value => document.querySelector(".lightbox-controls p").textContent === value, `${index + 1} / 18`);
      const current = await bounds();
      for (const key of ["panel", "toolbar", "controls"]) assert.ok(Math.abs(current[key] - initial[key]) < 1, `artwork ${index + 1} keeps ${key} stable at ${width}px`);
      assert.ok(current.bottom <= current.viewport, "gallery actions remain within the viewport");
    }
    await page.keyboard.press("Escape");
    await page.locator("dialog").waitFor({ state: "hidden" });
    assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
  }
  assert.deepEqual(errors, []);
  console.log("PASS: coordinated entry, production timing units, interrupted FLIP geometry, live reduced-motion changes, slow-image continuity, interrupted gallery exit/focus/reopen, stable controls across all 18 artworks on desktop/mobile.");
} finally { await browser.close(); }
