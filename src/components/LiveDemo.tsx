"use client";

import Image from "next/image";
import { useState } from "react";
import { Arrow } from "./Arrow";

export function LiveDemo() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  return <section className="live-demo" aria-labelledby="demo-title">
    <div className="demo-intro"><div><h2 id="demo-title">打开作品，试一下。</h2><p>以 KMP 为例：修改字符、单步前进，观察失配时指针如何回退。通过实际操作理解作品。</p></div><div className="demo-actions"><button type="button" aria-expanded={open} aria-controls="live-demo-stage" onClick={() => { setOpen(!open); setState("loading"); }}>{open ? "收起演示" : "在此体验"}</button><a className="text-link" href="/demos/kmp/index.html">打开完整演示 <Arrow /></a></div></div>
    <div id="live-demo-stage" className="demo-stage">
      {open ? <><p className="demo-state" role="status"><span key={state} className="state-arrival">{state === "ready" ? "演示已就绪 · 可修改输入，也可暂停与单步操作" : state === "error" ? "演示未能打开。请使用上方完整演示链接，或收起后重试。" : "正在加载演示；也可通过上方链接打开完整页面。"}</span></p><iframe src="/demos/kmp/index.html" title="可操作的 KMP 字符串匹配演示" onLoad={(event) => setState(event.currentTarget.contentDocument?.getElementById("app")?.dataset.ready === "true" ? "ready" : "error")} /></> : <Image src="/images/projects/kmp.png" alt="KMP 演示实际界面：从前缀与后缀的关系开始理解算法" width={1440} height={810} sizes="(max-width: 760px) 100vw, 1288px" />}
    </div>
  </section>;
}
