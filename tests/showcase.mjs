// Optional browser runtime, matching browser.mjs; no package dependency.
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href : "playwright");
const origin = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
const directions = [["精选一览", "selected"], ["交互实验", "learning"], ["应用作品", "applications"], ["视觉创作", "visual"]];
const kmp = '/images/projects/kmp-matching.png';
const poster = '/images/posters/jd-overview.png';

async function scenario(width, reducedMotion, run, options = {}) {
  const context = await browser.newContext({ viewport: { width, height: width < 760 ? 844 : 1000 }, reducedMotion, ...options });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    window.previewMotion = [];
    window.previewDecoding = 0;
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = async function() {
      window.previewDecoding++;
      try { return await decode.call(this); }
      finally { window.previewDecoding--; }
    };
    const animate = Element.prototype.animate;
    Element.prototype.animate = function(frames, options) {
      const animation = animate.call(this, frames, options);
      if (this.matches(".overview-work")) {
        window.previewMotion.push({ source: this.dataset.preview, naturalWidth: this.querySelector("img")?.naturalWidth, frames: animation.effect.getKeyframes(), timing: animation.effect.getTiming() });
        if (window.freezeKmp && this.dataset.preview === "/images/projects/kmp-matching.png") {
          animation.pause(); animation.currentTime = 0;
        }
      }
      return animation;
    };
  });
  try { await run(page, context); assert.deepEqual(errors, [], "showcase has no uncaught browser errors"); }
  finally { await context.close(); }
}

async function ready(page) {
  await page.goto(origin);
  await page.waitForFunction(() => {
    const grid = document.querySelector(".overview-images");
    return grid && [...grid.querySelectorAll("img")].every(image => image.complete && image.naturalWidth > 0) && grid.getAnimations({ subtree: true }).length === 0;
  });
}

async function selected(page, kind) {
  await page.waitForFunction(value => {
    const grid = document.querySelector(".overview-images");
    return grid && grid.classList.contains("overview-" + value) && grid.getAttribute("aria-busy") !== "true";
  }, kind);
}

function choice(page, label) { return page.getByRole("button", { name: label, exact: true }); }

async function gate(page, sources, run) {
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  let held = 0;
  const handler = async route => {
    const source = new URL(route.request().url()).searchParams.get("url");
    if (sources.includes(source)) { held++; await pending; }
    await route.continue();
  };
  await page.route("**/_next/image*", handler);
  try { await run(release, () => held); }
  finally {
    release();
    // Finish held handlers before removing them; no double handling or deadlock.
    await page.unrouteAll({ behavior: "wait" });
  }
}

async function pendingLearning(page) {
  await choice(page, "交互实验").click();
  await page.waitForFunction(() => document.querySelector(".overview-images").getAttribute("aria-busy") === "true");
  assert.equal(await choice(page, "交互实验").getAttribute("aria-pressed"), "true", "requested direction responds before image loading");
  assert.equal(await choice(page, "精选一览").getAttribute("aria-pressed"), "false");
  assert.match(await page.locator(".overview-description").textContent(), /正在加载.*交互实验.*预览/);
  assert.equal(await page.locator(".overview-images").evaluate(grid => grid.classList.contains("overview-selected")), true, "displayed direction stays unchanged while loading");
  assert.equal(await page.locator(".overview-work").count(), 3, "all old previews stay rendered");
  assert.equal(await page.locator(".overview-work").evaluateAll(items => items.every(item => Number(getComputedStyle(item).opacity) > .99 && item.querySelector("img").naturalWidth > 0)), true, "old decoded previews stay visible");
}

try {
  for (const width of [1440, 390]) {
    for (const reducedMotion of ["no-preference", "reduce"]) {
      await scenario(width, reducedMotion, async page => {
        await ready(page);
        const baseline = await page.locator(".overview-images").evaluate(grid => grid.getBoundingClientRect().height);
        assert.ok(baseline > 0, "preview reserves visible space");
        for (const [label, kind] of [...directions.slice(1), directions[0]]) {
          await choice(page, label).click();
          await selected(page, kind);
          await page.waitForFunction(() => document.querySelector(".overview-images").getAnimations({ subtree: true }).length === 0);
          const height = await page.locator(".overview-images").evaluate(grid => grid.getBoundingClientRect().height);
          assert.ok(Math.abs(height - baseline) < 1, `${label} keeps grid height at ${width}px/${reducedMotion}`);
          assert.equal(await choice(page, label).getAttribute("aria-pressed"), "true");
          assert.equal(await page.locator(".overview-work img").evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0 && image.getBoundingClientRect().height > 0 && image.getBoundingClientRect().width > 0 && getComputedStyle(image).display !== "none")), true, "every committed preview image is decoded and visible");
          if (reducedMotion === "reduce") assert.equal(await page.locator(".overview-images").evaluate(grid => grid.getAnimations({ subtree: true }).length), 0);
        }
      });

      await scenario(width, reducedMotion, async page => {
        await gate(page, [kmp], async release => {
          await ready(page);
          await page.evaluate(() => { window.freezeKmp = true; });
          await pendingLearning(page);
          release();
          await selected(page, "learning");
          const motion = await page.evaluate(() => window.previewMotion.filter(entry => entry.source === "/images/projects/kmp-matching.png"));
          const item = page.locator(`[data-preview="${kmp}"]`);
          assert.ok(await item.locator("img").evaluate(image => image.naturalWidth) > 0, "KMP has usable pixels before entrance");
          if (reducedMotion === "reduce") {
            assert.equal(motion.length, 0, "reduced motion omits new-card animations");
            assert.equal(await item.evaluate(element => Number(getComputedStyle(element).opacity)), 1);
          } else {
            assert.equal(motion.length, 1);
            assert.ok(motion[0].naturalWidth > 0, "animation starts only after responsive image decode");
            assert.equal(motion[0].timing.duration, 560);
            assert.equal(motion[0].timing.delay, 40);
            assert.equal(Number(motion[0].frames[0].opacity), 0);
            assert.match(motion[0].frames[0].clipPath, /18%/);
            assert.match(motion[0].frames[0].transform, /8px/);
            assert.equal(await item.evaluate(element => Number(getComputedStyle(element).opacity)), 0, "delay fill keeps new preview hidden at animation start");
            await item.evaluate(element => { const animation = element.getAnimations()[0]; animation.currentTime = 280; });
            const middle = await item.evaluate(element => ({ opacity: Number(getComputedStyle(element).opacity), bounds: element.getBoundingClientRect().toJSON() }));
            assert.ok(middle.opacity > 0 && middle.opacity < 1, "new card has visible intermediate progress");
            assert.ok(middle.bounds.width > 0 && middle.bounds.height > 0);
            await item.evaluate(element => element.getAnimations().forEach(animation => animation.finish()));
          }
        });
      });

      await scenario(width, reducedMotion, async page => {
        await gate(page, [kmp, poster], async release => {
          await ready(page);
          await pendingLearning(page);
          await choice(page, "视觉创作").click();
          await page.waitForFunction(() => document.querySelector('.showcase-choices button[aria-pressed="true"]').textContent === "视觉创作");
          assert.match(await page.locator(".overview-description").textContent(), /正在加载.*视觉创作/);
          await choice(page, "应用作品").click();
          await selected(page, "applications");
          release();
          await page.waitForFunction(() => window.previewDecoding === 0);
          assert.equal(await page.locator(".overview-images").evaluate(grid => grid.classList.contains("overview-applications")), true, "late learning/visual decode cannot replace latest applications request");
          assert.equal(await choice(page, "应用作品").getAttribute("aria-pressed"), "true");
        });
      });

      await scenario(width, reducedMotion, async page => {
        await gate(page, [kmp], async release => {
          await ready(page);
          await pendingLearning(page);
          await choice(page, "精选一览").click();
          await selected(page, "selected");
          assert.doesNotMatch(await page.locator(".overview-description").textContent(), /正在加载/);
          release();
          await page.waitForFunction(() => window.previewDecoding === 0);
          assert.equal(await page.locator(`[data-preview="${kmp}"]`).count(), 0, "canceled late decode cannot mount KMP");
          assert.equal(await choice(page, "精选一览").getAttribute("aria-pressed"), "true");
        });
      });

      await scenario(width, reducedMotion, async page => {
        await gate(page, [kmp], async release => {
          await ready(page);
          await pendingLearning(page);
          await page.getByRole("link", { name: "关于", exact: true }).click();
          await page.waitForURL(origin + "/about");
          release();
          await page.waitForFunction(() => window.previewDecoding === 0);
          assert.equal(await page.locator(".portfolio-showcase").count(), 0, "late decode cannot remount an unmounted showcase");
          await page.getByRole("link", { name: "ZWLY Lab 首页", exact: true }).click();
          await selected(page, "selected");
          assert.equal(await choice(page, "精选一览").getAttribute("aria-pressed"), "true", "returning home starts a fresh default showcase");
        });
      });

      await scenario(width, reducedMotion, async page => {
        let fail = true;
        await page.route("**/_next/image*", route => new URL(route.request().url()).searchParams.get("url") === kmp && fail ? route.abort("failed") : route.continue());
        await ready(page);
        await choice(page, "交互实验").click();
        await page.waitForFunction(() => /未能加载/.test(document.querySelector(".overview-description").textContent));
        assert.match(await page.locator(".overview-description").textContent(), /重试/);
        await selected(page, "selected");
        assert.equal(await choice(page, "精选一览").getAttribute("aria-pressed"), "true", "failed request restores displayed direction control");
        assert.equal(await page.locator(".overview-work").count(), 3);
        fail = false;
        await choice(page, "交互实验").click();
        await selected(page, "learning");
        assert.ok(await page.locator(`[data-preview="${kmp}"] img`).evaluate(image => image.naturalWidth) > 0, "retry performs a usable decode");
        await page.unrouteAll({ behavior: "wait" });
      });
    }
    await scenario(width, "no-preference", async page => {
      await page.goto(origin);
      const cards = page.locator(".overview-work");
      assert.equal(await cards.count(), 3, "SSR baseline keeps real project links without JavaScript");
      assert.equal(await cards.evaluateAll(items => items.every(item => Number(getComputedStyle(item).opacity) === 1 && item.getBoundingClientRect().height > 0)), true);
    }, { javaScriptEnabled: false });
  }
  console.log("PASS: desktop/mobile normal/reduced showcase height, pending-image continuity, responsive decode before entrance, arrival progress/timing, latest-request wins, cancellation/unmount, failed-image retry, and visible no-JS baseline.");
} finally { await browser.close(); }
