import assert from "node:assert/strict";

const origin = process.argv[2] ?? "http://localhost:3000";
const pages = [
  ["/", "Ideas into", "ZWLY Lab"],
  ["/projects", "作品，持续生长。", "作品"],
  ["/about", "保持好奇，认真构建。", "关于"],
  ["/blog", "记录，也是一种构建。", "手记"],
  ["/projects/campus-takeout", "Campus Takeout", "Campus Takeout"],
  ["/projects/pyscreen", "PyScreen", "PyScreen"],
  ["/projects/kmp-visualizer", "KMP 算法可视化", "KMP 算法可视化"],
  ["/projects/linked-list-merge", "有序链表二路归并", "有序链表二路归并"],
  ["/projects/gdp-timeline", "全球 GDP 时间轴", "全球 GDP 时间轴"],
  ["/projects/jd-protocol-engine", "JD Protocol Engine", "JD Protocol Engine"],
  ["/projects/ai-writing-coach", "AI Writing Coach", "AI Writing Coach"],
  ["/projects/ai-agent-lab", "AI Agent Lab", "AI Agent Lab"],
  ["/blog/building-in-public", "给作品一个可以访问的地方", "给作品一个可以访问的地方"],
  ["/blog/less-but-clearer", "少一点装饰，多一点清晰", "少一点装饰，多一点清晰"],
];
for (const [path, heading, title] of pages) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.match(html, /<html[^>]*lang="zh-CN"/);
  assert.ok(html.includes(heading), path + " heading");
  assert.ok(html.includes("<title>" + title), path + " metadata");
  assert.ok(html.includes('id="main-content"'), path + " skip-link target");
  assert.ok(html.includes('href="https://github.com/zwly-lab"'), path + " contact");
  assert.ok(!html.includes('href="#"'), path + " inert link");
  const styles = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => tag).filter((tag) => tag.includes('rel="stylesheet"')).map((tag) => tag.match(/href="([^"]+)"/));
  assert.ok(styles.length > 0, path + " stylesheet");
  for (const [, href] of styles) assert.equal((await fetch(new URL(href.replaceAll("&amp;", "&"), origin))).status, 200, href);
}
for (const path of ["/missing-page", "/projects/missing-project", "/blog/missing-note"]) {
  assert.equal((await fetch(new URL(path, origin))).status, 404, path);
}
for (const path of ["/demos/kmp/index.html", "/demos/kmp/src/app.js", "/demos/linked-list/index.html", "/demos/pyscreen/index.html", "/demos/pyscreen/playground.html", "/demos/pyscreen/playground-worker.mjs", "/demos/pyscreen/pyodide/pyodide.mjs", "/demos/pyscreen/pyodide/python_stdlib.zip", "/demos/gdp/index.html", "/images/projects/jd-dashboard.png", "/videos/jd-product-film.mp4"]) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  assert.ok((await response.arrayBuffer()).byteLength > 0, path + " empty asset");
}
const wasm = await fetch(new URL("/demos/pyscreen/pyodide/pyodide.asm.wasm", origin));
assert.equal(wasm.status, 200);
assert.match(wasm.headers.get("content-type"), /application\/wasm/);
assert.deepEqual(new Uint8Array(await wasm.arrayBuffer()).slice(0, 4), new Uint8Array([0, 97, 115, 109]));
console.log(`PASS: ${pages.length} pages, metadata, CSS, links, 3 missing routes and 12 demo/media assets including WebAssembly.`);
