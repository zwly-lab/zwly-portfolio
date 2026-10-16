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
    window.openingComposed = [];
    window.openingMarkError = null;
    document.addEventListener("opening-play", () => queueMicrotask(() => {
      window.openingComposed = [...document.querySelectorAll("[data-opening-preview]")].map(preview => {
        const bounds = preview.getBoundingClientRect();
        return Math.abs((bounds.left + bounds.right) / 2 - document.documentElement.clientWidth / 2) < 70 && bounds.top > innerHeight * .35 && bounds.bottom < innerHeight * .85;
      });
    }));
    window.prefetchDuringOpening = 0;
    const fetch = window.fetch;
    window.fetch = function(input, init) {
      const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
      if ((headers.has("next-router-prefetch") || headers.has("next-router-segment-prefetch")) && document.documentElement.hasAttribute("data-site-opening")) window.prefetchDuringOpening++;
      return fetch.call(this, input, init);
    };
    window.depthDraws = 0;
    window.depthCompilesDuringFlight = 0;
    window.pendingDepthDraws = 0;
    window.landedDepthDraws = 0;
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
            if (this.canvas.isConnected && document.documentElement.dataset.siteOpening === "pending") window.pendingDepthDraws++;
            if (document.documentElement.getAttribute("data-site-opening") === "active") {
              window.depthDraws++;
              const time = document.querySelector("[data-opening-preview]")?.getAnimations().find(animation => !(animation instanceof CSSAnimation))?.currentTime;
              if (Number(time) > 2260) window.landedDepthDraws++;
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
    if (options.slowActivation) {
      const getAnimations = Element.prototype.getAnimations;
      Element.prototype.getAnimations = function(...args) {
        const result = getAnimations.apply(this, args);
        if (this.matches(".site-camera") && !window.activationDelayed) {
          window.activationDelayed = true;
          const end = performance.now() + 200;
          while (performance.now() < end) { /* Simulate expensive style activation. */ }
        }
        return result;
      };
      document.addEventListener("opening-play", () => requestAnimationFrame(() => {
        window.firstFlightTime = document.querySelector("[data-opening-preview]").getAnimations().find(animation => !(animation instanceof CSSAnimation))?.currentTime;
      }), { once: true });
    }
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
      const mark = document.querySelector(".site-opening-signature").getBoundingClientRect(), destinationMark = document.querySelector(".site-header > .wordmark").getBoundingClientRect();
      window.openingMarkError = Math.max(...["left", "top", "width", "height"].map(key => Math.abs(mark[key] - destinationMark[key])));
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
      if (curtain && main && header && document.documentElement.dataset.siteOpening === "active") {
        if (document.documentElement.dataset.openingDepth === "ready" && document.documentElement.dataset.siteOpening === "active") window.depthSeen = true;
        const preview = document.querySelector("[data-opening-preview]");
        const transform = new DOMMatrix(getComputedStyle(preview).transform);
        const camera = new DOMMatrix(getComputedStyle(document.querySelector(".site-camera")).transform);
        const focus = getComputedStyle(document.querySelector(".site-page"));
        const intro = document.querySelector(".hero-intro").getBoundingClientRect();
        const planes = [...document.querySelectorAll("[data-opening-preview]")].map(element => {
          const matrix = new DOMMatrix(getComputedStyle(element).transform);
          const radius = Math.abs(matrix.m13) * element.offsetWidth / 2 + Math.abs(matrix.m23) * element.offsetHeight / 2;
          const bounds = element.getBoundingClientRect();
          return { near: matrix.m43 + radius, far: matrix.m43 - radius, left: bounds.left, top: bounds.top, right: bounds.right, bottom: bounds.bottom };
        });
        const decoded = [...document.querySelectorAll("[data-opening-preview] img")].every(image => image.complete && image.naturalWidth > 0);
        const contained = [...document.querySelectorAll("[data-opening-preview]")].every(element => { const bounds = element.getBoundingClientRect(); return bounds.left >= -1 && bounds.right <= document.documentElement.clientWidth + 1; });
        const clearOfIntro = planes.every(bounds => bounds.left >= intro.right + 16 || bounds.right <= intro.left - 16 || bounds.top >= intro.bottom + 16 || bounds.bottom <= intro.top - 16);
        const cover = new DOMMatrix(getComputedStyle(document.querySelector(".site-opening-cover > span")).transform).m22;
        const line = new DOMMatrix(getComputedStyle(document.querySelector(".hero-name .opening-line-content")).transform).m42;
        const navigation = Number(getComputedStyle(document.querySelector(".site-nav")).opacity);
        window.openingFrames.push({ followingOpacity: Number(getComputedStyle(document.querySelector(".live-demo")).opacity), time: performance.now(), decoded, contained, clearOfIntro, cover, line, navigation, pageOpacity: focus.opacity, pageShadow: focus.boxShadow, light: Number(getComputedStyle(preview, "::after").opacity), opacity: Number(getComputedStyle(preview).opacity), cameraTilt: Math.atan2(camera.m23, camera.m22), cameraDepth: camera.m43, previewDepth: transform.m43, planes, blur: Number(focus.filter.match(/blur\(([\d.]+)px\)/)?.[1] || 0), rotation: Math.atan2(transform.b, transform.a), overflow: document.documentElement.scrollWidth > innerWidth + 1, pointer: getComputedStyle(curtain).pointerEvents });
      }
      if (performance.now() < 14000) requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  }, options);
  try { await run(page); passed++; console.log("PASS:", name); }
  finally { await context.close(); }
}
async function settled(page) {
  await page.waitForFunction(() => !document.documentElement.hasAttribute("data-site-opening"));
  assert.equal(await page.locator(".site-opening").evaluate(element => getComputedStyle(element).display), "none");
  assert.equal(await page.locator(".site-opening-signature").evaluate(element => getComputedStyle(element).display), "none");
  assert.equal(await page.getByRole("button", { name: "跳过开场" }).count(), 0);
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
    await check(`opaque cover skips without clicking a hidden link ${width}`, { width }, async page => {
      await page.route("**/_next/image*", async route => { await new Promise(resolve => setTimeout(resolve, 850)); await route.continue(); });
      await page.goto(origin, { waitUntil: "domcontentloaded" });
      assert.equal(await page.evaluate(() => document.documentElement.dataset.siteOpening), "pending");
      const bounds = await page.locator(".hero-intro > .text-link").boundingBox();
      await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      await settled(page);
      await page.locator(".overview-work img").evaluateAll(images => Promise.all(images.map(image => image.decode())));
      assert.equal(new URL(page.url()).pathname, "/");
      assert.equal(await page.evaluate(() => window.artifactAnimations.length), 0);
      await usable(page);
    });
  }
  await check("revealed homepage links stay usable after the staged handoff", {}, async page => {
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await settled(page);
    await usable(page);
  });
  for (const width of [360, 820]) {
    await check(`showcase stays clear of the introduction ${width}`, { width }, async page => {
      await page.goto(origin); await settled(page);
      const frames = await page.evaluate(() => window.openingFrames);
      assert.ok(frames.length > 5 && frames.every(frame => frame.contained && (frame.cover > .01 || frame.clearOfIntro) && frame.cameraTilt === 0));
      assert.ok(await page.evaluate(() => window.openingComposed.length === 3 && window.openingComposed.every(Boolean)));
      await usable(page);
    });
  }
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
      assert.equal(await page.evaluate(() => window.prefetchDuringOpening), 0, "route prefetch waits until the whole-page opening finishes");
      assert.equal(await page.evaluate(() => window.pendingDepthDraws), 0, "ready handoff does not run a duplicate pending render loop");
      assert.equal(await page.evaluate(() => window.landedDepthDraws), 0, "landed artwork is retained without repainting through the page reveal");
      assert.equal(await page.locator(".site-depth-canvas").count(), 0, "the short-lived renderer is released after landing");
      assert.equal(await page.evaluate(() => window.depthContexts.every(context => context.isContextLost())), true, "GPU contexts are released after landing");
      assert.ok(frames.every(frame => frame.cameraTilt === 0 && frame.cameraDepth === 0 && frame.blur === 0 && frame.pageOpacity === "1" && frame.pageShadow === "none"), "the page remains frontal, sharp and unframed throughout the physical card scene");
      assert.ok(frames.every(frame => frame.cover > .01 || frame.clearOfIntro), "floating work clears the headline and action when the cover has opened");
      assert.ok(await page.evaluate(() => window.openingComposed.length === 3 && window.openingComposed.every(Boolean)), "the opening starts with one centered work stack");
      assert.ok(frames.some(frame => frame.cover > .95 && frame.line > 20 && frame.navigation < .1) && frames.some(frame => frame.cover < .01 && frame.line < 1 && frame.navigation > .99), "the cover, heading lines and navigation reveal the entire homepage within the shared scene");
      assert.ok(await page.evaluate(() => window.openingMarkError !== null && window.openingMarkError < 1), "the centered signature becomes the actual header wordmark within one pixel");
      assert.ok(frames.some(frame => frame.previewDepth > 20), "work lifts off the page in depth");
      assert.ok(frames.every(frame => frame.cover >= .999 || frame.previewDepth < 1), "the homepage cover stays shut until the cards have finished landing");
      assert.ok(frames.every(frame => frame.followingOpacity === 0), "the next homepage section never appears underneath an unfinished opening");
      const lit = frames.filter(frame => frame.previewDepth > 20 && frame.opacity > .8);
      assert.ok(lit.some(frame => frame.light > .8) && frames.at(-1).light < .05, "directional surface light fades away as the works land");
      const unfolded = frames.filter(frame => frame.previewDepth > 20);
      const collisions = unfolded.filter(frame => frame.planes.some((plane, index) => frame.planes.slice(index + 1).some(other => other.left < plane.right && other.right > plane.left && other.top < plane.bottom && other.bottom > plane.top && other.far <= plane.near && plane.far <= other.near)));
      assert.ok(unfolded.length > 2 && collisions.length === 0, "overlapping previews keep separate depth planes: " + JSON.stringify(collisions.slice(0, 1)));
      assert.ok(frames.every(frame => !frame.overflow), "camera never creates horizontal scrolling");
      assert.ok(frames.some(frame => Math.abs(frame.rotation) > .1), "real previews first form a rotated image stack");
      const landed = await page.evaluate(() => window.openingLanded);
      assert.equal(landed.length, 3);
      assert.ok(landed.every(item => item.error < 1 && item.sameImage && item.sameFit && item.sameRadius), "all previews hand off to the same image, crop, rounded corners and destination within one pixel");
      assert.ok(frames.every(frame => frame.pointer === "none"), "the transparent opening stage never traps a visitor action");
      assert.equal(await page.evaluate(() => window.headingEntries.length), 0, "no competing title entrance on hydration");
      assert.equal(await page.evaluate(() => window.openingRuns), 1);
      await page.reload();
      await settled(page);
      assert.equal(await page.evaluate(() => window.openingRuns), 0, "same-session reload uses a short arrival instead of replaying the full cover");
      assert.equal(await page.locator(".site-depth-canvas").count(), 0, "return visit creates no depth surface");
      await page.locator('a[href="/?opening=replay"]').click();
      await page.waitForURL(origin + "/?opening=replay");
      await settled(page);
      assert.equal(await page.evaluate(() => window.openingRuns), 1, "manual replay restores the complete opening");
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
  for (const connection of [{ effectiveType: "3g", saveData: false }, { effectiveType: "4g", saveData: true }]) {
    await check(`lightweight opening on ${connection.saveData ? "data saver" : "slow connection"}`, {}, async page => {
      await page.addInitScript(connection => Object.defineProperty(navigator, "connection", { value: connection }), connection);
      const chunks = [];
      page.on("response", response => {
        if (new URL(response.url()).pathname.includes("/chunks/") && response.url().endsWith(".js")) chunks.push(response.text());
      });
      await page.goto(origin); await settled(page); await usable(page);
      assert.equal(await page.evaluate(() => window.artifactAnimations.length), 3, "the complete CSS card opening still plays");
      assert.equal(await page.evaluate(() => window.depthContexts.length), 0, "no GPU preparation delays slow connections");
      assert.ok((await Promise.all(chunks)).every(text => !text.includes("site-depth-canvas")), "omit the heavy depth module download");
    });
  }
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
  await check("expensive activation cannot consume the first visible frames", { slowActivation: true }, async page => {
    await page.goto(origin); await settled(page);
    assert.equal(await page.evaluate(() => window.activationDelayed), true);
    assert.ok(await page.evaluate(() => window.firstFlightTime >= 0 && window.firstFlightTime < 80), "the visible clock starts after the 200ms activation fixture, not before it");
    await usable(page);
  });
  await check("late hydration cannot consume the visible scene before it starts", {}, async page => {
    await page.route("**/_next/static/**/*.js", async route => { await new Promise(resolve => setTimeout(resolve, 1600)); await route.continue(); });
    await page.goto(origin); await settled(page);
    const state = await page.evaluate(() => ({ runs: window.openingRuns, duration: window.openingFrames.at(-1)?.time - window.openingFrames[0]?.time, entries: window.headingEntries }));
    assert.equal(state.runs, 1);
    assert.ok(state.duration >= 2600 && state.duration < 3100, "the full scene plays after delayed scripts rather than spending its duration while loading");
    assert.deepEqual(state.entries, []);
    await usable(page);
  });
  await check("five-second image loading preserves a skippable cover and the full opening", {}, async page => {
    await page.route("**/_next/image*", async route => { await new Promise(resolve => setTimeout(resolve, 5000)); await route.continue(); });
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2200);
    assert.equal(await page.evaluate(() => document.documentElement.dataset.siteOpening), "pending", "the old 1.8s cutoff cannot cancel a not-yet-ready scene");
    assert.equal(await page.evaluate(() => window.artifactAnimations.length), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollHeight > innerHeight * 2 && getComputedStyle(document.querySelector(".site-camera")).transform === "none"), "preparation preserves the normal document geometry");
    assert.ok(await page.getByRole("button", { name: "跳过开场" }).isVisible(), "a real skip action remains available during slow preparation");
    await settled(page);
    assert.equal(await page.evaluate(() => window.artifactAnimations.length), 3);
    assert.ok(await page.evaluate(() => window.openingFrames.every(frame => frame.decoded) && window.openingFrames.at(-1).time - window.openingFrames[0].time >= 2600), "slow media still receives a complete decoded opening");
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
  await check("assistive click on skip releases the cover during preparation", {}, async page => {
    await page.route("**/_next/image*", async route => { await new Promise(resolve => setTimeout(resolve, 850)); await route.continue(); });
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "跳过开场" }).evaluate(button => button.click());
    await settled(page);
    assert.equal(await page.evaluate(() => window.artifactAnimations.length), 0);
    await usable(page);
  });
  await check("unavailable media cannot leave preparation pending forever", {}, async page => {
    const held = [];
    await page.route("**/_next/image*", route => held.push(route));
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await settled(page);
    assert.equal(await page.evaluate(() => window.artifactAnimations.length), 0);
    await Promise.all(held.map(route => route.abort("failed")));
    await page.unrouteAll({ behavior: "ignoreErrors" });
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
    assert.equal(await page.evaluate(() => window.headingEntries[0].duration), 560);
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
