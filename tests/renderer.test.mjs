import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

test("canvas skips hidden or tiny panels and paints a visible board", () => {
  const scope = { window: {} };
  vm.runInNewContext(readFileSync(new URL("../public/demos/pyscreen/renderer.js", import.meta.url), "utf8"), scope);
  let shapes = 0;
  const context = new Proxy({}, { get: (_, method) => method === "roundRect" ? (...args) => {
    assert.ok(args[4] >= 0, "roundRect radius must be nonnegative");
    shapes++;
  } : () => {} });
  const frame = { background: "#fff", objects: [{ type: "rect", x: 2, y: 4, width: 2, height: 2, color: "green" }] };
  for (const [width, height] of [[0, 0], [32, 320], [320, 32], [48, 48]]) {
    scope.window.PyScreenRenderer.drawFrame({ clientWidth: width, clientHeight: height, getContext: () => context }, { width: 16, height: 16 }, frame);
  }
  assert.equal(shapes, 0);
  scope.window.PyScreenRenderer.drawFrame({ clientWidth: 320, clientHeight: 320, getContext: () => context }, { width: 16, height: 16 }, frame);
  assert.equal(shapes, 2, "board and rectangle are painted");
});
