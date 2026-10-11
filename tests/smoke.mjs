import assert from "node:assert/strict";

const origin = process.argv[2] ?? "http://localhost:3000";
const pages = [
  ["/", "Ideas into", "ZWLY Lab"],
  ["/projects", "作品，持续生长。", "作品"],
  ["/about", "保持好奇，认真构建。", "关于"],
  ["/blog", "记录，也是一种构建。", "手记"],
  ["/projects/campus-takeout", "Campus Takeout", "Campus Takeout"],
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
console.log("PASS: 9 pages, metadata, CSS assets, contact links and 3 missing routes.");
