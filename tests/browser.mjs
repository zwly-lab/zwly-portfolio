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
      if (output && name && [1440, 390].includes(width)) {
        await page.screenshot({ path: path.join(output, "redesign-" + name + "-" + (width === 1440 ? "desktop" : "mobile") + ".png"), fullPage: true, animations: "disabled", timeout: 10000 });
        if (route === "/") await page.screenshot({ path: path.join(output, "redesign-home-" + (width === 1440 ? "desktop" : "mobile") + "-first.png"), animations: "disabled", timeout: 10000 });
      }
    }
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin);
  await page.getByRole("button", { name: "应用与界面", exact: true }).click();
  assert.ok((await page.locator("#portfolio-overview").textContent()).includes("Campus"));
  await page.getByRole("button", { name: "视觉与表达", exact: true }).click();
  assert.ok((await page.locator("#portfolio-overview").textContent()).includes("产品视觉"));
  assert.equal(await page.locator("iframe").count(), 0, "runtime is not loaded for passive viewing");
  await page.getByRole("button", { name: "在此体验", exact: true }).click();
  await page.locator(".demo-state").filter({ hasText: "演示已就绪" }).waitFor();
  await page.getByRole("button", { name: "收起演示", exact: true }).click();
  assert.equal(await page.locator("iframe").count(), 0, "closing removes the demo runtime");

  await page.goto(origin + "/projects");
  assert.equal(await page.locator("#filtered-projects .work-card").count(), 9);
  await page.getByRole("button", { name: "应用工具", exact: true }).click();
  assert.equal(await page.locator("#filtered-projects .work-card").count(), 4);
  assert.ok((await page.locator("#filtered-projects").textContent()).includes("探索中的方向"));
  await page.getByRole("button", { name: "教学可视化", exact: true }).click();
  assert.equal(await page.locator("#filtered-projects .work-card").count(), 4);

  await page.goto(origin + "/projects/pyscreen");
  await page.getByRole("button", { name: "看反馈", exact: false }).click();
  assert.ok((await page.locator("#process-explanation").textContent()).includes("x 从 2 变成 3"));
  assert.equal(await page.locator('.process-artwork.result').count(), 1);

  await page.goto(origin + "/projects/poster-collection");
  const trigger = page.getByRole("button", { name: "放大查看：旅行拼贴 · 圣托里尼", exact: true });
  await trigger.click();
  assert.equal(await page.locator("dialog").evaluate((dialog) => dialog.open), true);
  assert.equal(await page.locator(".lightbox-controls p").textContent(), "6 / 18");
  await page.keyboard.press("ArrowLeft");
  for (let step = 0; step < 3; step++) await page.keyboard.press("ArrowRight");
  await page.locator(".lightbox-controls p").filter({ hasText: "8 / 18" }).waitFor();
  for (let step = 0; step < 20; step++) await page.keyboard.press("ArrowLeft");
  await page.locator(".lightbox-controls p").filter({ hasText: "1 / 18" }).waitFor();
  assert.equal(await page.getByRole("button", { name: "上一张", exact: true }).isDisabled(), true);
  await page.keyboard.press("Escape");
  await page.locator("dialog").waitFor({ state: "hidden" });
  assert.equal(await trigger.evaluate((element) => element === document.activeElement), true, "Escape restores focus to origin");
  await page.getByText("展开四套界面概念", { exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "放大查看：网站概念 · Style B 极简编辑", exact: true }).isVisible(), true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await trigger.click();
  await page.keyboard.press("ArrowRight");
  await page.locator(".lightbox-controls p").filter({ hasText: "7 / 18" }).waitFor();
  assert.equal(await page.locator("dialog").evaluate((element) => getComputedStyle(element).animationName), "none");
  await page.keyboard.press("Escape");
  await page.goto(origin + "/projects/pyscreen");
  assert.equal(await page.locator(".process-spotlight").evaluate((element) => getComputedStyle(element).transitionDuration), "0s");
  assert.deepEqual(errors, [], "browser runtime errors");
  console.log("PASS: 40 page/viewport checks, intact images, portfolio directions, project filtering, live demo, rapid gallery navigation/bounds/focus, reduced motion.");
  } finally { await browser.close(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
