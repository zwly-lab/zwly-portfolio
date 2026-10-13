import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
export const metadata: Metadata = { title: "关于" };
export default function AboutPage() {
  return <main id="main-content" className="container page-body">
    <header className="page-header about-header"><h1>把想法，交给实际结果。</h1><p>我与 AI 协作构建应用、交互实验和视觉作品。运行、观察、调整，是我继续判断的方式。</p></header>
    <section className="about-intro" aria-labelledby="about-approach">
      <figure className="project-media"><Link href="/projects/pyscreen"><Image src="/images/projects/pyscreen-error.png" alt="PyScreen 真实错误反馈：第1行 SyntaxError 与定位入口，画布保持尚未运行" width={1440} height={1000} sizes="(max-width: 760px) 100vw, 760px" loading="eager" /></Link><figcaption>一次真实测试：输入 x =，错误指向第 1 行。</figcaption></figure>
      <div className="about-statement"><h2 id="about-approach">让错误指向<br />可以修改的地方。</h2><p>在 PyScreen 中，我把代码、画布和反馈放在同一个工作区。输入不完整的赋值语句后，错误保留在页面，并给出定位入口；修正后可以继续运行。</p><p>这次测试让我可以检查一条具体路径：读到错误，找到对应代码，再回到运行结果。界面是否清楚，需要通过这些真实操作判断。</p><Link className="text-link" href="/projects/pyscreen">查看错误与恢复的实际记录</Link></div>
    </section>
    <figure className="about-result project-media"><Image src="/images/projects/pyscreen.png" alt="修正后运行的真实 PyScreen 界面：画布显示方块，变量 x 为3、y为4" width={1440} height={1000} sizes="(max-width: 760px) 100vw, 600px" /><figcaption><strong>修正后，回到可以观察的结果。</strong>画布生成两帧，变量回到 x = 3、y = 4。这是运行反馈记录，不代表课堂学习效果评估。</figcaption></figure>
    <section className="about-practices" aria-label="实践方向">
      <article className="about-practice"><h2>让抽象知识可以观察</h2><div><p>PyScreen 把 Python 代码、变量、执行轨迹与画布放在一起。KMP 和链表归并演示则保留暂停与单步，让学习者回到一次比较、一次指针移动，检查过程怎样形成结果。</p><p className="article-meta">Python、Pyodide、Canvas 与 JavaScript，服务于具体的学习反馈。</p><div className="about-practice-links"><Link className="text-link" href="/projects/pyscreen">Python 练习台</Link><Link className="text-link" href="/projects/kmp-visualizer">KMP 可视化</Link><Link className="text-link" href="/projects/linked-list-merge">链表归并</Link></div></div></article>
      <article className="about-practice"><h2>让应用流程有明确的下一步</h2><div><p>校园点餐围绕商品、规格、购物车与订单组织操作；本地任务控制台把状态、日志与恢复入口放进同一个工作区。我关心信息怎样支持一个真实动作，也保留它所依赖的运行环境。</p><p className="article-meta">点餐完整流程需要微信与后端；任务控制台在本站提供截图和静音视频。</p><div className="about-practice-links"><Link className="text-link" href="/projects/campus-takeout">校园点餐</Link><Link className="text-link" href="/projects/jd-protocol-engine">本地任务控制台</Link></div></div></article>
      <article className="about-practice"><h2>让视觉表达有内容依据</h2><div><p>旅行拼贴、风景插画与产品海报，让我尝试不同的画幅、文字层次和叙事方式。作品保留完整画面；界面概念与 AI 视觉作品说明创作方向，产品能力仍以真实运行画面为依据。</p><p className="article-meta">已有视觉作品与提示词笔记，分别保留作品结果和方法的验证边界。</p><div className="about-practice-links"><Link className="text-link" href="/projects/poster-collection">浏览视觉作品</Link><Link className="text-link" href="/blog/chinese-product-posters">中文海报的排版判断</Link></div></div></article>
    </section>
    <section className="about-working-note"><h2>记录，是为了下一次判断。</h2><p>手记整理已有课程笔记与项目实践：为什么这样做，有什么可以对照，哪些部分还需要验证。探索中的方向也留在作品集里，明确标注进展。</p><Link className="text-link" href="/blog">阅读学习与构建手记</Link></section>
  </main>;
}
