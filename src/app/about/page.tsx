import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TechStack } from "@/components/TechStack";
export const metadata: Metadata = { title: "关于" };
export default function AboutPage() {
  return <main id="main-content" className="container page-body">
    <header className="page-header"><h1>保持好奇，认真构建。</h1><p>从教学工具、应用开发到视觉表达，把想法做成可以观察、操作和继续迭代的作品。</p></header>
    <div className="visual-pair"><figure className="project-media"><Link href="/projects/pyscreen"><Image src="/images/projects/pyscreen.png" alt="教育实践：PyScreen 的实际运行画面" width={1440} height={1000} sizes="(max-width: 760px) 100vw, 628px" /></Link><figcaption>教育与开发 · 把运行过程变成可观察的反馈</figcaption></figure><figure className="project-media"><Link href="/projects/poster-collection"><Image src="/images/posters/portfolio-style-b.png" alt="视觉与设计：ZWLY Lab Style B 概念图" width={1448} height={1086} sizes="(max-width: 760px) 100vw, 628px" /></Link><figcaption>视觉与设计 · 从概念中寻找清晰的表达</figcaption></figure></div>
    <section className="editorial-grid"><h2>从想法，到作品。</h2><div className="prose"><p>ZWLY Lab 记录我如何理解问题、组织界面并验证结果。作品介绍保留真实截图和使用边界，手记把本地学习与项目实践整理成可以回看的方法。</p><p>我更关心技术如何服务具体场景：让一个流程更顺畅，让一个概念更易理解，让一个想法变成可以体验的软件。</p></div></section>
    <section className="editorial-grid"><h2>用作品说明实践</h2><ul className="evidence-list">
      <li><h3>让学习过程可以看见</h3><p>PyScreen 把代码、变量与画布放在一起；算法演示让指针和匹配过程可以逐步观察。</p><Link className="text-link" href="/projects/pyscreen">体验 Python 练习台</Link></li>
      <li><h3>把应用流程落到界面</h3><p>校园点餐小程序连接商品、规格、购物车与订单。这里保留迭代截图，完整流程需要微信与后端环境。</p><Link className="text-link" href="/projects/campus-takeout">查看点餐产品介绍</Link></li>
      <li><h3>让产品表达有实际依据</h3><p>本地控制台通过任务、状态和日志组织信息；截图、视频与海报展示不同层次的产品表达。</p><Link className="text-link" href="/projects/jd-protocol-engine">查看控制台与演示视频</Link></li>
      <li><h3>把经验整理成可复用的方法</h3><p>从第二大脑精选数据可视化、中文排版、视觉提示词与交互动效笔记，说明方法及其验证边界。</p><Link className="text-link" href="/blog">阅读学习与构建手记</Link></li>
    </ul></section>
    <section className="practice"><h2>用合适的工具，解决具体的问题。</h2><TechStack /></section>
  </main>;
}
