import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/Arrow";
import { ContentBreadcrumb } from "@/components/ContentBreadcrumb";
import { PosterGallery } from "@/components/PosterGallery";
import { ProductWalkthrough } from "@/components/ProductWalkthrough";
import { cases } from "@/data/cases";
import { posts } from "@/data/posts";
import { projects } from "@/data/projects";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return { title: project?.title ?? "作品未找到", description: project?.description };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const study = cases[slug];
  const isConcept = project.status === "exploring";
  const relatedSlug = slug === "pyscreen" ? "kmp-visualizer" : slug === "campus-takeout" ? "jd-protocol-engine" : slug === "jd-protocol-engine" ? "campus-takeout" : "pyscreen";
  const related = projects.find((item) => item.slug === relatedSlug);
  const noteSlug = slug === "jd-protocol-engine" ? "chinese-product-posters" : slug === "poster-collection" ? "photo-to-visual-diary" : slug === "gdp-timeline" ? "data-before-charts" : "motion-for-understanding";
  const note = posts.find((item) => item.slug === noteSlug);
  const coverKind = slug === "campus-takeout" ? "phone" : slug === "pyscreen" || slug === "jd-protocol-engine" ? "workspace" : "diagram";

  return <main id="main-content" className={"container page-body case-page case-page--" + (isConcept ? "concept" : project.gallery ? "gallery" : study?.kind ?? "product")}>
    <header className="page-header case-header case-header-v2">
      <ContentBreadcrumb href="/projects" label="作品" title={project.title} />
      <h1>{project.title}</h1><p>{project.description}</p>
      <dl className="case-facts">
        <div><dt>展示范围</dt><dd>{isConcept ? "研究方向 · 尚未实现" : project.gallery ? "视觉系列 · 已有原作" : study?.label}</dd></div>
        <div><dt>技术组成</dt><dd>{project.stack.join(" / ")}</dd></div>
      </dl>
      <div className="link-group">
        {project.demo && <a className="text-link" href={project.demo}>体验作品 <Arrow /></a>}
        {project.video && <a className="text-link" href="#product-film">观看操作视频 <Arrow /></a>}
        {project.gallery && <a className="text-link" href="#visual-works">进入视觉系列 <Arrow /></a>}
      </div>
    </header>

    {slug === "pyscreen" ? <ProductWalkthrough /> : project.image && <figure className={"project-media case-cover case-cover--" + coverKind}>
      <Image src={project.image.src} alt={project.title + " · " + project.image.caption} width={project.image.width} height={project.image.height} sizes={coverKind === "phone" ? "(max-width: 760px) 80vw, 392px" : "(max-width: 760px) 100vw, 1288px"} loading="eager" />
      <figcaption>{project.image.caption}</figcaption>
    </figure>}

    {study && <>
      <section className="editorial-grid case-lead" aria-labelledby="case-question"><h2 id="case-question">{study.question}</h2><div className="prose"><p>{study.context}</p></div></section>

      {study.kind === "product" && project.video && <figure id="product-film" className="project-media case-evidence">
        <video controls playsInline poster={project.image?.src} preload="none" aria-label={project.title + " 已有静音操作视频"}><source src={project.video} type="video/mp4" /><a href={project.video}>下载操作视频</a></video>
        <figcaption>已有本地操作记录 · 静音 · 可暂停、拖动进度</figcaption>
      </figure>}

      <section className="case-decisions" aria-labelledby="case-decisions-title">
        <div className="section-header"><h2 id="case-decisions-title">{study.kind === "algorithm" ? "让过程可以被看清" : study.kind === "data" ? "图表怎样组织信息" : "界面中的选择与取舍"}</h2></div>
        <div className="case-decision-grid">{study.decisions.map((decision) => <div className="case-decision" key={decision.title}><h3>{decision.title}</h3><p>{decision.text}</p></div>)}</div>
      </section>

      {slug === "pyscreen" && <section className="feature-detail case-evidence">
        <div><h2>让错误指向可以修改的一行</h2><p>在练习台输入不完整的赋值语句 x = 并运行，界面显示第 1 行 SyntaxError，并提供定位入口。修正代码后再次运行，画布生成两帧，变量回到 x = 3、y = 4。</p><p>这次实际操作说明了错误与恢复路径；它不是课堂学习效果的评估。</p><a className="text-link" href="/images/projects/pyscreen-error.png" target="_blank" rel="noopener noreferrer">放大查看错误反馈 <Arrow /></a></div>
        <figure className="project-media"><Image src="/images/projects/pyscreen-error.png" alt="实际输入错误后，练习台显示第1行SyntaxError及定位第1行按钮，画布保持尚未运行状态" width={1440} height={1000} sizes="(max-width: 760px) 100vw, 760px" /><figcaption>本轮浏览器实测 · 语法错误与定位入口，2026-10-11</figcaption></figure>
      </section>}

      {slug === "jd-protocol-engine" && <section className="case-evidence" aria-labelledby="console-views">
        <div className="section-header"><h2 id="console-views">两种检查路径</h2></div>
        <div className="visual-pair">
          <figure className="project-media"><Image src="/images/projects/jd-tasks.png" alt="实际任务列表截图：任务入口与空任务状态" width={1600} height={1000} sizes="(max-width: 760px) 100vw, 628px" /><figcaption>任务页：查看任务入口 · 2026-09-04 空状态截图</figcaption></figure>
          <figure className="project-media"><Image src="/images/projects/jd-logs.png" alt="实际日志面板截图：日志筛选与暂无日志状态" width={1600} height={1000} sizes="(max-width: 760px) 100vw, 628px" /><figcaption>日志页：筛选运行记录 · 2026-09-04 空状态截图</figcaption></figure>
        </div>
      </section>}

      <section className="product-walkthrough case-verify" aria-labelledby="case-verify-title">
        <div className="section-header"><h2 id="case-verify-title">{slug === "campus-takeout" ? "接下来，沿完整流程验证" : slug === "jd-protocol-engine" ? "从界面记录到运行证据" : "带着一个问题，试一次"}</h2></div>
        <ol>{study.verify.map((step, index) => <li key={step.title}><span className="step-number" aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
        {project.demo && <a className="text-link" href={project.demo}>打开演示，按步骤观察 <Arrow /></a>}
      </section>
      <section className="editorial-grid"><h2>现有成果与下一步</h2><div className="prose"><p>{study.boundary}</p></div></section>
    </>}

    {project.gallery && <section id="visual-works" aria-labelledby="visual-works-title">
      <div className="section-header"><h2 id="visual-works-title">从日常记录，到产品表达</h2></div>
      <div className="prose"><p>纸边与手写标记组织旅行和餐桌的记忆，水彩让主体与留白重新取得平衡，产品海报则把界面和信息层次放在一起。下面按系列观看，也可以打开完整原作。</p><p className="article-meta">AI 生成与风格化视觉作品。产品海报和网站概念保留当时的表达，不等同于已实现的产品能力。</p></div>
      <PosterGallery posters={project.gallery} />
    </section>}

    {isConcept && <>
      <section className="editorial-grid concept-note"><h2>还在研究的问题</h2><div className="prose"><p>{project.overview}</p></div></section>
      <section className="editorial-grid"><h2>先明确判断标准</h2><div className="prose"><ul>{project.focus.map((item) => <li key={item}>{item}</li>)}</ul><p>目前保留的是方向与概念图。下一步需要先做可运行的小任务，留下输入、输出和失败情况，再决定是否扩展为产品。</p></div></section>
    </>}

    <nav className="article-navigation case-navigation" aria-label="继续探索">
      {related && <Link className="text-link" href={"/projects/" + related.slug}><span>继续看作品</span><strong>{related.title} <Arrow /></strong></Link>}
      {note && <Link className="text-link" href={"/blog/" + note.slug}><span>相关方法手记</span><strong>{note.title} <Arrow /></strong></Link>}
    </nav>
  </main>;
}
