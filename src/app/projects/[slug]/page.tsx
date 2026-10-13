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
  const relatedReason = relatedSlug === "kmp-visualizer" ? "继续观察单步过程怎样解释失配回退。" : relatedSlug === "jd-protocol-engine" ? "比较手机菜单与桌面控制台怎样组织操作入口。" : relatedSlug === "campus-takeout" ? "换到手机菜单，看看分类、价格与加购怎样相邻。" : "在练习台里对照代码、变量与画面的变化。";
  const noteReason = noteSlug === "chinese-product-posters" ? "对照控制台与海报，理解界面证据怎样进入产品表达。" : noteSlug === "photo-to-visual-diary" ? "了解旅行拼贴背后关于场景、纸边与留白的约束。" : noteSlug === "data-before-charts" ? "补上时间范围、单位与数据来源的阅读方法。" : "继续读状态变化、错误反馈与动效之间的关系。";
  const coverKind = slug === "campus-takeout" ? "phone" : slug === "pyscreen" || slug === "jd-protocol-engine" ? "workspace" : "diagram";

  return <main id="main-content" className={"container page-body case-page case-page--" + (isConcept ? "concept" : project.gallery ? "gallery" : study?.kind ?? "product")}>
    <header className="page-header case-header case-header-v2">
      <ContentBreadcrumb href="/projects" label="作品" title={project.title} />
      <h1>{project.title}</h1><p>{project.gallery ? "AI 生成与风格化视觉 · 18 张已有原作，按系列观看与放大。" : project.description}</p>
      {isConcept && <p className="article-meta">研究方向 · 尚未实现</p>}
      {(project.demo || project.video) && <div className="link-group">
        {project.demo && <a className="text-link" href={project.demo}>体验作品 <Arrow /></a>}
        {project.video && <a className="text-link" href="#product-film">观看操作视频 <Arrow /></a>}
      </div>}
    </header>

    {slug === "pyscreen" ? <ProductWalkthrough /> : project.image && <figure className={"project-media case-cover case-cover--" + coverKind}>
      <Image src={project.image.src} alt={project.title + " · " + project.image.caption} width={project.image.width} height={project.image.height} sizes={coverKind === "phone" ? "(max-width: 760px) 80vw, 392px" : "(max-width: 760px) 100vw, 1288px"} loading="eager" />
      <figcaption>{project.image.caption}{slug === "campus-takeout" && <p>“全部、招牌套餐、家常盖饭、加料、饮料”留在商品上方；每个条目把价格与加购放在一起，底部购物车保持可见。这张截图可核对布局，规格与订单行为仍需微信端验证。</p>}</figcaption>
    </figure>}

    {!project.gallery && <dl className="case-facts">
      <div><dt>展示范围</dt><dd>{isConcept ? "研究方向 · 尚未实现" : study?.label}</dd></div>
      <div><dt>技术组成</dt><dd>{project.stack.join(" / ")}</dd></div>
    </dl>}

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
        <div className="section-header"><h2 id="console-views">总览看当前状态，任务页找具体任务</h2></div>
        <div className="prose"><p>前面的总览把“空闲”和“当前任务：无”放在一起，并保留运行入口。任务页另设搜索、状态筛选与创建入口：把状态判断和任务操作分开，代价是检查细节需要再进一页。</p></div>
        <div className="visual-pair">
          <figure className="project-media"><Image src="/images/projects/jd-tasks.png" alt="实际任务页：搜索框、全部运行中失败筛选，以及还没有任务的空状态和创建任务按钮" width={1600} height={1000} sizes="(max-width: 760px) 100vw, 628px" /><figcaption>任务页回答“有哪些任务” · 创建入口与空列表，2026-09-04</figcaption></figure>
          <figure className="project-media"><Image src="/images/projects/jd-logs.png" alt="实际日志页：来源与INFO WARN ERROR筛选，0条日志及暂无匹配日志的空状态" width={1600} height={1000} sizes="(max-width: 760px) 100vw, 628px" /><figcaption>日志页回答“发生过什么” · 来源与等级筛选，2026-09-04 空状态</figcaption></figure>
        </div>
      </section>}

      <section className="product-walkthrough case-verify" aria-labelledby="case-verify-title">
        <div className="section-header"><h2 id="case-verify-title">{slug === "campus-takeout" ? "接下来，沿完整流程验证" : slug === "jd-protocol-engine" ? "从界面记录到运行证据" : "带着一个问题，试一次"}</h2></div>
        <ol>{study.verify.map((step, index) => <li key={step.title}><span className="step-number" aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
        {project.demo && <a className="text-link" href={project.demo}>打开演示，按步骤观察 <Arrow /></a>}
        {slug === "jd-protocol-engine" && <div className="prose"><p>{study.boundary}</p></div>}
      </section>
      {slug !== "jd-protocol-engine" && <section className="editorial-grid"><h2>现有成果与下一步</h2><div className="prose"><p>{study.boundary}</p></div></section>}
    </>}

    {project.gallery && <section id="visual-works" aria-label="视觉作品系列">
      <PosterGallery posters={project.gallery} />
      <dl className="case-facts">
        <div><dt>展示范围</dt><dd>视觉系列 · 18 张已有原作</dd></div>
        <div><dt>技术组成</dt><dd>{project.stack.join(" / ")}</dd></div>
      </dl>
      <div className="prose"><p className="article-meta">AI 生成与风格化视觉作品。产品海报和网站概念保留当时的表达，不等同于已实现的产品能力。</p></div>
    </section>}

    {isConcept && <>
      <section className="editorial-grid concept-note"><h2>还在研究的问题</h2><div className="prose"><p>{project.overview}</p></div></section>
      <section className="editorial-grid"><h2>先明确判断标准</h2><div className="prose"><ul>{project.focus.map((item) => <li key={item}>{item}</li>)}</ul><p>目前保留的是方向与概念图。下一步需要先做可运行的小任务，留下输入、输出和失败情况，再决定是否扩展为产品。</p></div></section>
    </>}

    <nav className="article-navigation case-navigation" aria-label="继续探索">
      {related && <Link className="text-link" href={"/projects/" + related.slug}><span>继续看作品</span><strong>{related.title} <Arrow /></strong><span>{relatedReason}</span></Link>}
      {note && <Link className="text-link" href={"/blog/" + note.slug}><span>相关方法手记</span><strong>{note.title} <Arrow /></strong><span>{noteReason}</span></Link>}
    </nav>
  </main>;
}
