import type { Metadata } from "next";
import { TechStack } from "@/components/TechStack";
export const metadata: Metadata = { title: "关于" };
export default function AboutPage() {
  return <main id="main-content" className="container page-body"><header className="page-header"><p className="section-label">ABOUT THE LAB</p><h1>保持好奇，认真构建。</h1><p>我关注 AI 与软件工程的结合，探索如何利用人工智能，构建真正解决问题的软件产品。</p></header><section className="editorial-grid"><h2>从想法，到作品。</h2><div className="prose"><p>ZWLY Lab 是一个记录构建过程的地方。这里展示项目，也记录问题、判断和迭代。</p><p>比起罗列工具，我更关心技术如何服务实际场景：让一个流程更顺畅，让一个概念更易理解，让一个想法变成可以体验的软件。</p></div></section><section className="editorial-grid"><h2>正在探索</h2><div className="prose"><ul><li>全栈开发：连接界面、业务逻辑与数据。</li><li>智能应用：把 AI 能力放进有明确目标的使用场景。</li><li>Agent 与开发工具：让协作、验证和迭代更清晰。</li><li>教育实践：让技术支持理解、练习与反馈。</li></ul></div></section><section className="practice"><p className="section-label">TOOLS & PRACTICE</p><h2>用合适的工具，解决具体的问题。</h2><TechStack /></section></main>;
}