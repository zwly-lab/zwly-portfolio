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
    window.depthDraws = 0;
    window.depthCompilesDuringFlight = 0;
    window.depthContexts = [];
    window.depthSeen = false;
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      if (options.noWebGL && type === "webgl2") return null;
      const context = getContext.call(this, type, ...args);
      if (type === "webgl2" && context && !window.depthContexts.includes(context)) {
        window.depthContexts.push(context);
        const compileShader = context.compileShader;
        context.compileShader = function(shader) { if (document.documentElement.dataset.siteOpening === "active") window.depthCompilesDuringFlight++; return compileShader.call(this, shader); };
        for (const method of ["drawElements", "drawArrays"]) {
          const draw = context[method];
          context[method] = function(...args) {
            const result = draw.apply(this, args);
            if (document.documentElement.getAttribute("data-site-opening") === "active") {
              window.depthDraws++;
              const time = document.querySelector("[data-opening-preview]")?.getAnimations().find(animation => !(animation instanceof CSSAnimation))?.currentTime;
              if (window.depthCornerAlpha === undefined && Number(time) > 500 && context.getParameter(context.FRAMEBUFFER_BINDING) === null) {
                const pixel = new Uint8Array(4);
                window.depthCornerAlpha = 0;
                for (const x of [20, Math.floor(context.drawingBufferWidth / 2), context.drawingBufferWidth - 20]) {
                  context.readPixels(x, context.drawingBufferHeight - 20, 1, 1, context.RGBA, context.UNSIGNED_BYTE, pixel);
                  window.depthCornerAlpha = Math.max(window.depthCornerAlpha, pixel[3]);
                }
              }
            }
            return result;
          };
        }
      }
      return context;
    };
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
        return { error: Math.max(...["left", "top", "width", "height"].map(key => Math.abs(bounds[key] - destination[key]))), sameRadius: getComputedStyle(preview.querySelector(".overview-frame")).borderRadius === getComputedStyle(target).borderRadius && getComputedStyle(target).borderRadius === "12px", sameImage: preview.querySelector("img").currentSrc === target.querySelector("img").currentSrc, sameFit: getComputedStyle(preview.querySelector("img")).objectFit === getComputedStyle(target.querySelector("img")).objectFit };
      });
    }, true);
    function sample() {
      const curtain = document.querySelector(".site-opening");
      const main = document.querySelector("#main-content");
      const header = document.querySelector(".site-header");
      if (curtain && main && header && document.documentElement.hasAttribute("data-site-opening")) {
        if (document.documentElement.dataset.openingDepth === "ready" && document.documentElement.dataset.siteOpening === "active") window.depthSeen = true;
        const preview = document.querySelector("[data-opening-preview]");
        const transform = new DOMMatrix(getComputedStyle(preview).transform);
        const camera = new DOMMatrix(getComputedStyle(document.querySelector(".site-camera")).transform);
        const focus = getComputedStyle(document.querySelector(".site-page"));
        const planes = [...document.querySelectorAll("[data-opening-preview]")].map(element => {
          const matrix = new DOMMatrix(getComputedStyle(element).transform);
          const radius = Math.abs(matrix.m13) * element.offsetWidth / 2 + Math.abs(matrix.m23) * element.offsetHeight / 2;
          return { near: matrix.m43 + radius, far: matrix.m43 - radius };
        });
        const decoded = [...document.querySelectorAll("[data-opening-preview] img")].every(image => image.complete && image.naturalWidth > 0);
        const contained = [...document.querySelectorAll("[data-opening-preview]")].every(element => { const bounds = element.getBoundingClientRect(); return bounds.left >= -1 && bounds.right <= document.documentElement.clientWidth + 1; });
        window.openingFrames.push({ time: performance.now(), decoded, contained, light: Number(getComputedStyle(preview, "::after").opacity), opacity: Number(getComputedStyle(preview).opacity), cameraTilt: Math.atan2(camera.m23, camera.m22), cameraDepth: camera.m43, previewDepth: transform.m43, planes, blur: Number(focus.filter.match(/blur\(([\d.]+)px\)/)?.[1] || 0), rotation: Math.atan2(transform.b, transform.a), overflow: document.documentElement.scrollWidth > innerWidth + 1, pointer: getComputedStyle(curtain).pointerEvents });
      }
      if (performance.now() < 6500) requestAnimationFrame(sample);
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
    await check(`delayed images preserve the visible unfolded composition ${width}`, { width }, async page => {
      await page.route("**/_next/image*", async route => { await new Promise(resolve => setTimeout(resolve, 850)); await route.continue(); });
      await page.goto(origin); await settled(page);
      const frames = await page.evaluate(() => window.openingFrames);
      const flying = frames.filter(frame => frame.previewDepth > 20 && frame.opacity > .05);
      assert.ok(flying.length > 5 && flying.every(frame => frame.decoded), "all three images are decoded before visible flight starts");
      const unfolded = flying.filter(frame => Math.abs(frame.rotation) > .08 && frame.opacity > .8);
      assert.ok(unfolded.length > 5 && unfolded.at(-1).time - unfolded[0].time >= 600, "the real unpaused stack stays recognizable for at least 600ms");
      assert.ok(flying.every(frame => frame.contained), "every image stays inside the viewport instead of relying on horizontal clipping");
      await usable(page);
    });
    await check(`whole-page reveal, reload and client return ${width}`, { width }, async page => {
      await page.goto(origin);
      await settled(page);
      const frames = await page.evaluate(() => window.openingFrames);
      assert.ok(frames.length > 5, "actual CSS opening paints several frames");
      assert.equal(await page.evaluate(() => document.querySelector(".site-page").parentElement === document.querySelector(".site-opening").parentElement), true, "real page and artifacts share one camera");
      assert.equal(await page.evaluate(() => window.depthSeen && window.depthDraws > 10), true, "real WebGL card geometry and shadow passes render during the opening");
      assert.equal(await page.evaluate(() => window.depthCornerAlpha <= 2), true, "the shadow receiver stays transparent away from the cards without full-page shadow acne");
      assert.equal(await page.evaluate(() => window.depthCompilesDuringFlight), 0, "shadow and surface shaders are warmed before the opening starts");
      assert.equal(await page.locator(".site-depth-canvas").count(), 0, "the short-lived renderer is released after landing");
      assert.equal(await page.evaluate(() => window.depthContexts.every(context => context.isContextLost())), true, "GPU contexts are released after landing");
      assert.ok(frames.some(frame => frame.cameraTilt > .08 && frame.cameraDepth < -20), "the real page starts inside a tilted spatial view");
      assert.ok(frames.every((frame, index) => !index || frame.cameraTilt <= frames[index - 1].cameraTilt + .002), "camera continuously straightens without reversing");
      assert.ok(frames.some(frame => frame.previewDepth > 20), "work lifts off the page in depth");
      const lit = frames.filter(frame => frame.previewDepth > 20 && frame.opacity > .8);
      assert.ok(lit.some(frame => frame.light > .8) && frames.at(-1).light < .05, "directional surface light fades away as the works land");
      const unfolded = frames.filter(frame => frame.time - frames[0].time < 900 && frame.previewDepth > 20);
      assert.ok(unfolded.length > 2 && unfolded.every(frame => frame.planes.slice(1).every((plane, index) => plane.far > frame.planes[index].near)), "overlapping previews keep separate depth planes instead of cutting through each other");
      assert.ok(frames.some(frame => frame.blur > .5) && frames.at(-1).blur < .05, "focus passes from work to the readable page");
      assert.ok(frames.every(frame => !frame.overflow), "camera never creates horizontal scrolling");
      assert.ok(frames.some(frame => Math.abs(frame.rotation) > .1), "real previews first form a rotated image stack");
      const landed = await page.evaluate(() => window.openingLanded);
      assert.equal(landed.length, 3);
      assert.ok(landed.every(item => item.error < 1 && item.sameImage && item.sameFit && item.sameRadius), "all previews hand off to the same image, crop, rounded corners and destination within one pixel");
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
  await check("WebGL unavailable retains the CSS opening and usable homepage", { noWebGL: true }, async page => {
    await page.goto(origin); await settled(page);
    assert.equal(await page.evaluate(() => window.depthSeen), false);
    assert.equal(await page.evaluate(() => window.artifactAnimations.length), 3);
    await usable(page);
  });
  await check("GPU context loss returns to the matching CSS card positions", {}, async page => {
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.documentElement.dataset.siteOpening === "active" && document.querySelector(".site-depth-canvas"));
    await page.locator(".site-depth-canvas").evaluate(canvas => canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })));
    assert.equal(await page.locator(".site-depth-canvas").count(), 0);
    assert.equal(await page.locator("[data-opening-preview]").first().evaluate(element => getComputedStyle(element).visibility), "visible");
    await settled(page); await usable(page);
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
    assert.equal(await page.evaluate(() => window.artifactAnimations.length), 0, "over-budget image preparation skips flight instead of showing empty planes");
    await usable(page);
  });
  await check("input during image preparation cannot revive the scene after decoding", {}, async page => {
    await page.route("**/_next/image*", async route => { await new Promise(resolve => setTimeout(resolve, 850)); await route.continue(); });
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-site-opening")), "pending");
    await page.keyboard.press("Escape");
    await settled(page);
    await page.locator(".overview-work img").evaluateAll(images => Promise.all(images.map(image => image.decode())));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await page.evaluate(() => window.artifactAnimations.length), 0);
    assert.equal(await page.evaluate(() => document.documentElement.hasAttribute("data-site-opening")), false);
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
    assert.equal(await page.evaluate(() => window.artifactAnimations.length), 0);
  });
  await check("other page entry retains its ordinary heading animation", {}, async page => {
    await page.goto(origin + "/about");
    await page.waitForFunction(() => window.headingEntries.length > 0);
    assert.equal(await page.evaluate(() => window.openingRuns), 0);
    assert.equal(await page.evaluate(() => window.headingEntries[0].duration), 480);
    assert.equal(await page.locator("[data-opening-preview] img").evaluateAll(images => images.every(image => image.loading === "lazy")), true, "other routes do not eagerly request the decorative opening copies");
  });
  await check("browser history does not replay the opening", {}, async page => {
    await page.goto(origin); await settled(page);
    await page.goto(origin + "/about");
    await page.goBack(); await settled(page);
  });
  assert.deepEqual(errors, [], "no browser runtime errors");
  console.log(`PASS: ${passed} whole-page opening browser scenarios.`);
} finally { await browser.close(); }
