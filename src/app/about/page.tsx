import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
export const metadata: Metadata = { title: "关于" };
export default function AboutPage() {
  return <main id="main-content" className="container page-body">
    <header className="page-header"><h1>把复杂的过程，<br className="desktop-break" />做成可以理解的作品。</h1><p>我在 ZWLY Lab 构建教学工具、应用界面与视觉作品。比起列出使用过的技术，我更关心：一个人能否看懂正在发生什么，并找到下一步。</p></header>
    <section className="about-intro" aria-labelledby="about-approach">
      <figure className="project-media"><Link href="/projects/pyscreen"><Image src="/images/projects/pyscreen.png" alt="PyScreen 实际运行画面：代码、变量、执行轨迹与画布同时呈现" width={1440} height={1000} sizes="(max-width: 760px) 100vw, 760px" /></Link><figcaption>PyScreen · 用同一个工作区连接代码与反馈</figcaption></figure>
      <div className="about-statement"><h2 id="about-approach">先让过程可见，<br />再让操作成立。</h2><p>代码运行、指针回退、订单流转，都是屏幕背后的过程。我尝试把它们拆成可以观察的步骤，让界面帮助理解，而不只是展示结果。</p><p>这也意味着保留暂停、错误和使用边界。能在浏览器中操作的作品提供演示；依赖微信或本地服务的项目，用实际截图与视频说明进展。</p><Link className="text-link" href="/projects/pyscreen">从 PyScreen 看这项实践</Link></div>
    </section>
    <section className="about-practices" aria-label="实践方向">
      <article className="about-practice"><h2>让抽象知识可以观察</h2><div><p>PyScreen 把 Python 代码、变量、执行轨迹与画布放在一起。KMP 和链表归并演示则保留暂停与单步，让学习者回到一次比较、一次指针移动，检查过程怎样形成结果。</p><p className="article-meta">Python、Pyodide、Canvas 与 JavaScript，服务于具体的学习反馈。</p><div className="about-practice-links"><Link className="text-link" href="/projects/pyscreen">Python 练习台</Link><Link className="text-link" href="/projects/kmp-visualizer">KMP 可视化</Link><Link className="text-link" href="/projects/linked-list-merge">链表归并</Link></div></div></article>
      <article className="about-practice"><h2>让应用流程有明确的下一步</h2><div><p>校园点餐围绕商品、规格、购物车与订单组织操作；本地任务控制台把状态、日志与恢复入口放进同一个工作区。我关心信息怎样支持一个真实动作，也保留它所依赖的运行环境。</p><p className="article-meta">点餐完整流程需要微信与后端；任务控制台在本站提供截图和静音视频。</p><div className="about-practice-links"><Link className="text-link" href="/projects/campus-takeout">校园点餐</Link><Link className="text-link" href="/projects/jd-protocol-engine">本地任务控制台</Link></div></div></article>
      <article className="about-practice"><h2>让视觉表达有内容依据</h2><div><p>旅行拼贴、风景插画与产品海报，让我尝试不同的画幅、文字层次和叙事方式。作品保留完整画面；界面概念与 AI 视觉作品说明创作方向，产品能力仍以真实运行画面为依据。</p><p className="article-meta">已有视觉作品与提示词笔记，分别保留作品结果和方法的验证边界。</p><div className="about-practice-links"><Link className="text-link" href="/projects/poster-collection">浏览视觉作品</Link><Link className="text-link" href="/blog/chinese-product-posters">中文海报的排版判断</Link></div></div></article>
    </section>
    <section className="about-working-note"><h2>记录，是为了下一次判断。</h2><p>手记整理已有课程笔记与项目实践：为什么这样做，有什么可以对照，哪些部分还需要验证。探索中的方向也留在作品集里，明确标注进展。</p><Link className="text-link" href="/blog">阅读学习与构建手记</Link></section>
  </main>;
}
