// Optional browser check: use an existing Playwright installation, no runtime dependency.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href : "playwright");

async function main() {
  const origin = process.argv[2] || "http://localhost:3000";
  const output = process.argv[3];
  if (output) await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
  try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(origin);
  const palette = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return Object.fromEntries(["ink", "muted", "accent", "background", "footer"].map((key) => [key, style.getPropertyValue("--" + key).trim()]));
  });
  const luminance = (hex) => {
    const full = hex.length === 4 ? hex.slice(1).split("").map((digit) => digit + digit).join("") : hex.slice(1);
    const channels = full.match(/../g).map((pair) => parseInt(pair, 16) / 255).map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  for (const text of ["ink", "muted", "accent"]) for (const surface of ["background", "footer"]) {
    const values = [luminance(palette[text]), luminance(palette[surface])];
    const ratio = (Math.max(...values) + .05) / (Math.min(...values) + .05);
    assert.ok(ratio >= 4.5, text + " contrast on " + surface + ": " + ratio);
  }
  const routes = [
    ["/", "home"], ["/projects", "works"], ["/projects/pyscreen", "case"],
    ["/projects/campus-takeout", null], ["/projects/jd-protocol-engine", null],
    ["/projects/poster-collection", "gallery"], ["/about", "about"],
    ["/blog", "notes"], ["/blog/motion-for-understanding", "article"],
    ["/projects/ai-agent-lab", null],
  ];
  for (const width of [1440, 390, 820, 360]) {
    await page.setViewportSize({ width, height: width < 760 ? 844 : 1000 });
    for (const [route, name] of routes) {
      const response = await page.goto(origin + route);
      assert.equal(response.status(), 200, route);
      await page.evaluate(async () => {
        document.querySelectorAll("img").forEach((image) => { image.loading = "eager"; });
        await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
        await document.fonts.ready;
      });
      const checks = await page.evaluate(() => ({
        width: innerWidth, content: document.documentElement.scrollWidth,
        broken: [...document.images].filter((image) => !image.naturalWidth).map((image) => image.src),
      }));
      assert.ok(checks.content <= checks.width + 1, route + " overflow at " + width);
      assert.deepEqual(checks.broken, [], route + " image load at " + width);
      if (width < 760 && route === "/projects") {
        const title = await page.locator(".work-card h3").first().boundingBox();
        assert.ok(title && title.y + title.height < 844, "first work image and title fit the mobile opening viewport at " + width);
      }
      if (width < 760 && route === "/") {
        assert.equal(await page.locator(".overview-selected img").evaluateAll(images => images.filter(image => getComputedStyle(image).display !== "none" && image.getBoundingClientRect().height > 0).length), 3, "all three creative directions retain image previews on mobile");
        assert.equal(await page.locator(".overview-work").evaluateAll(cards => cards.every(card => {
          const parent = card.getBoundingClientRect(), frame = card.querySelector(".overview-frame").getBoundingClientRect();
          return frame.left >= parent.left - 1 && frame.right <= parent.right + 1;
        })), true, "preview frames stay within their columns and preserve mobile gutters");
      }
      if (width < 760 && ["/projects/pyscreen", "/projects/campus-takeout", "/projects/jd-protocol-engine"].includes(route)) {
        const image = await page.locator("main img").first().boundingBox();
        assert.ok(image && image.y < 550, "real case media arrives early on mobile: " + route);
      }
      if (output && name && [1440, 390].includes(width)) {
        if (route === "/") {
          await page.locator(".demo-stage > img").scrollIntoViewIfNeeded();
          await page.evaluate(() => scrollTo(0, 0));
          await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        }
        await page.screenshot({ path: path.join(output, "redesign-" + name + "-" + (width === 1440 ? "desktop" : "mobile") + ".png"), fullPage: true, animations: "disabled", timeout: 10000 });
        if (route === "/") await page.screenshot({ path: path.join(output, "redesign-home-" + (width === 1440 ? "desktop" : "mobile") + "-first.png"), animations: "disabled", timeout: 10000 });
      }
    }
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin);
  await page.getByRole("link", { name: "作品", exact: true }).click();
  await page.waitForURL(origin + "/projects");
  await page.waitForFunction(() => document.getAnimations().some((animation) => animation.effect?.pseudoElement?.startsWith("::view-transition-new(")));
  assert.equal(await page.locator("h1").evaluate(element => element.getAnimations().length), 0, "route snapshot does not stack a second title entrance");
  await page.waitForFunction(() => !document.getAnimations().some((animation) => animation.effect?.pseudoElement?.startsWith("::view-transition-")));
  assert.equal(await page.locator("h1").evaluate((element) => getComputedStyle(element).clipPath), "none", "route title finishes fully visible");
  const card = page.locator(".work-card").first();
  const frameWidth = await card.locator(".thumbnail-frame").evaluate((element) => element.getBoundingClientRect().width);
  await card.hover();
  await page.waitForFunction(() => new DOMMatrix(getComputedStyle(document.querySelector(".work-card img")).transform).a > 1.01);
  assert.equal(await card.locator(".thumbnail-frame").evaluate((element) => element.getBoundingClientRect().width), frameWidth, "preview feedback does not resize its frame");
  assert.notEqual(await card.locator("h3").evaluate((element) => getComputedStyle(element).textDecorationColor), "rgba(0, 0, 0, 0)", "hover emphasizes linked title");
  await page.goto(origin);
  const print = page.locator(".visual-print img").first();
  await print.scrollIntoViewIfNeeded();
  if (await page.evaluate(() => CSS.supports("animation-timeline", "view()") && CSS.supports("animation-range", "entry 0% entry 100%"))) {
    await page.waitForFunction(() => ["inset(0px)", "inset(0%)", "inset(0% 0%)"].includes(getComputedStyle(document.querySelector(".visual-print img")).clipPath));
  }
  await page.goto(origin);
  assert.ok((await page.locator("h1").textContent()).includes("Vibe Coding."));
  assert.equal(await page.locator("#portfolio-overview .overview-work").count(), 3, "three directions visible by default");
  await page.getByRole("button", { name: "应用作品", exact: true }).click();
  assert.ok((await page.locator("#portfolio-overview").textContent()).includes("Campus"));
  await page.getByRole("button", { name: "视觉创作", exact: true }).click();
  assert.ok((await page.locator("#portfolio-overview").textContent()).includes("产品视觉"));
  for (const name of ["精选一览", "交互实验", "应用作品", "精选一览"]) await page.getByRole("button", { name, exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "精选一览", exact: true }).getAttribute("aria-pressed"), "true");
  assert.equal(await page.locator("#portfolio-overview .overview-work").count(), 3, "rapid direction changes keep the final selection");
  assert.equal(await page.locator("iframe").count(), 0, "runtime is not loaded for passive viewing");
  const demoBefore = await page.locator(".demo-intro").evaluate((element) => element.getBoundingClientRect().top + scrollY);
  const stageBefore = await page.locator(".demo-stage").evaluate((element) => element.getBoundingClientRect().width);
  await page.getByRole("button", { name: "在此体验", exact: true }).click();
  await page.locator(".demo-state").filter({ hasText: "演示已就绪" }).waitFor();
  assert.ok(Math.abs((await page.locator(".demo-intro").evaluate((element) => element.getBoundingClientRect().top + scrollY)) - demoBefore) < 2, "opening keeps introduction anchored");
  assert.ok(Math.abs((await page.locator(".demo-stage").evaluate((element) => element.getBoundingClientRect().width)) - stageBefore) < 2, "opening keeps stage width");
  await page.getByRole("button", { name: "收起演示", exact: true }).click();
  assert.equal(await page.locator("iframe").count(), 0, "closing removes the demo runtime");

  await page.goto(origin + "/projects");
  assert.equal(await page.locator("#filtered-projects .work-card").count(), 9);
  assert.equal(await page.locator("#filtered-projects [data-project]").count(), 9);
  await page.getByRole("button", { name: "应用工具", exact: true }).click();
  assert.equal(await page.locator("#filtered-projects .work-card").count(), 4);
  await page.waitForFunction(() => {
    const line = document.querySelector(".project-filters .active-underline").getBoundingClientRect();
    const selected = document.querySelector('.project-filters [aria-pressed="true"]').getBoundingClientRect();
    return Math.abs(line.left - selected.left) < 2 && Math.abs(line.width - selected.width) < 2;
  });
  assert.ok((await page.locator("#filtered-projects").textContent()).includes("探索中的方向"));
  await page.getByRole("button", { name: "教学可视化", exact: true }).click();
  assert.equal(await page.locator("#filtered-projects .work-card").count(), 4);

  await page.goto(origin + "/projects/pyscreen");
  await page.getByRole("button", { name: "看反馈", exact: false }).click();
  assert.ok((await page.locator("#process-explanation").textContent()).includes("x 从 2 变成 3"));
  assert.equal(await page.locator('.process-artwork.result').count(), 1);
  await page.waitForFunction(() => {
    const image = document.querySelector(".process-artwork img").getBoundingClientRect();
    const box = document.querySelector(".process-spotlight").getBoundingClientRect();
    return (box.left + box.right) / 2 > image.left + image.width * .7 && box.right <= image.right + 8;
  });
  if (output) await page.screenshot({ path: path.join(output, "redesign-case-feedback-desktop.png"), fullPage: true, animations: "disabled" });
  for (const name of ["改代码", "读任务", "看反馈"]) await page.getByRole("button", { name, exact: false }).click();
  assert.equal(await page.locator('.process-artwork.result').count(), 1, "rapid steps keep final feedback selection");

  await page.goto(origin + "/projects/poster-collection");
  const trigger = page.getByRole("button", { name: "放大查看：旅行拼贴 · 圣托里尼", exact: true });
  await trigger.click();
  assert.equal(await page.locator("dialog").evaluate((dialog) => dialog.open), true);
  assert.equal(await page.locator(".lightbox-controls p").textContent(), "1 / 18");
  await page.keyboard.press("ArrowLeft");
  for (let step = 0; step < 3; step++) await page.keyboard.press("ArrowRight");
  await page.locator(".lightbox-controls p").filter({ hasText: "4 / 18" }).waitFor();
  for (let step = 0; step < 20; step++) await page.keyboard.press("ArrowLeft");
  await page.locator(".lightbox-controls p").filter({ hasText: "1 / 18" }).waitFor();
  assert.equal(await page.getByRole("button", { name: "上一张", exact: true }).isDisabled(), true);
  await page.keyboard.press("Escape");
  await page.locator("dialog").waitFor({ state: "hidden" });
  assert.equal(await trigger.evaluate((element) => element === document.activeElement), true, "Escape restores focus to origin");
  await page.getByText("展开四套界面概念", { exact: true }).click();
  await page.getByRole("button", { name: "放大查看：网站概念 · Style B 极简编辑", exact: true }).waitFor({ state: "visible" });
  assert.equal(await page.getByRole("button", { name: "放大查看：网站概念 · Style B 极简编辑", exact: true }).isVisible(), true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await trigger.click();
  await page.keyboard.press("ArrowRight");
  await page.locator(".lightbox-controls p").filter({ hasText: "2 / 18" }).waitFor();
  assert.equal(await page.locator("dialog").evaluate((element) => getComputedStyle(element).animationName), "none");
  assert.equal(await page.locator(".lightbox-image").evaluate((element) => element.getAnimations().length), 0);
  await page.keyboard.press("Escape");
  await page.goto(origin);
  assert.equal(await page.locator("h1").evaluate((element) => element.getAnimations().length), 0, "reduced motion skips route title animation");
  assert.equal(await page.locator(".visual-print img").first().evaluate((element) => getComputedStyle(element).animationName), "none", "reduced motion shows full static artwork");
  await page.getByRole("button", { name: "应用作品", exact: true }).click();
  assert.equal(await page.locator("#portfolio-overview").evaluate((element) => element.getAnimations({ subtree: true }).length), 0, "reduced motion keeps direction changes immediate");
  await page.goto(origin + "/projects/pyscreen");
  assert.equal(await page.locator(".process-spotlight").evaluate((element) => getComputedStyle(element).transitionDuration), "0s");
  await page.goto(origin + "/blog/motion-for-understanding");
  await page.getByText("展开归并步骤", { exact: true }).click();
  assert.equal(await page.locator(".feedback-example").evaluate((element) => element.open), true);
  assert.equal(await page.getByText("收起归并步骤", { exact: true }).isVisible(), true);
  await page.getByText("收起归并步骤", { exact: true }).click();
  assert.equal(await page.locator(".feedback-example").evaluate((element) => element.open), false);
  assert.deepEqual(errors, [], "browser runtime errors");
  console.log("PASS: 40 page/viewport checks, route/title/image motion, intact images, portfolio directions, project filtering, live demo, rapid gallery navigation/bounds/focus, reduced motion.");
  } finally { await browser.close(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
