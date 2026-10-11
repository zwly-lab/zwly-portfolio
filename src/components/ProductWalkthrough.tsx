"use client";

import Image from "next/image";

import { useState } from "react";
import { Arrow } from "./Arrow";

const views = [
  { label: "读任务", text: "先预测，再动手。把方块从 (2, 4) 向右移动一格，观察位置为什么改变。", region: "task" },
  { label: "改代码", text: "修改 Python，让变量与绘图调用发生联系。代码保留在当前浏览器中，可以继续试。", region: "code" },
  { label: "看反馈", text: "同一份执行，连接画布、变量和轨迹。回看两帧，就能对照 x 从 2 变成 3。", region: "result" },
] as const;

export function ProductWalkthrough() {
  const [selected, setSelected] = useState(0);
  const view = views[selected];
  return <div className="hero-showcase process-showcase">
    <figure className={"process-artwork " + view.region}>
      <Image src="/images/projects/pyscreen.png" alt="PyScreen 实际运行界面：左侧练习任务、中间 Python 代码、右侧画布、变量与执行轨迹" width={1440} height={1000} sizes="(max-width: 760px) 100vw, 900px" loading="eager" />
      <span className="process-spotlight" aria-hidden="true" />
      <figcaption>实际运行画面 · 选择步骤，查看对应区域</figcaption>
    </figure>
    <div className="process-copy">
      <h2>让执行过程，<br />成为理解的线索。</h2>
      <p>PyScreen · Python 练习台</p>
      <div className="showcase-choices process-choices" role="group" aria-label="选择产品步骤">
        {views.map((item, index) => <button key={item.label} type="button" aria-pressed={selected === index} aria-controls="process-explanation" onClick={() => setSelected(index)}><span>{index + 1}</span>{item.label}<Arrow /></button>)}
      </div>
      <p id="process-explanation" className="process-explanation" role="status">{view.text}</p>

      <a className="text-link secondary" href="/demos/pyscreen/playground.html?level=6">打开练习台 <Arrow /></a>
    </div>
  </div>;
}
