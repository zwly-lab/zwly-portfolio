import Image from "next/image";
import Link from "next/link";

export function NoteExample({ slug }: { slug: string }) {
  if (slug === "motion-for-understanding") return <div className="note-example">
    <h3>试一下：让操作结果立即可见</h3><p>下面是一个展开示例。点击后可以查看步骤，再点击即可收起；这里不执行链表算法。</p>
    <details className="feedback-example"><summary><span className="disclosure-open-text">展开归并步骤</span><span className="disclosure-close-text">收起归并步骤</span>{/* Lucide chevron-down; ISC/MIT notice in licenses/. */}<svg className="disclosure-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary><ol><li>比较两条链表的头节点。</li><li>将较小节点接到结果链表，移动对应指针。</li><li>重复比较；一条链表结束后，接上另一条的剩余部分。</li></ol></details>
    <figure className="note-inline-image"><Image src="/images/projects/linked-list.png" alt="真实归并演示：结果链表连接完成后的界面" width={1440} height={1000} sizes="(max-width: 760px) 100vw, 760px" /><figcaption>真实演示截图 · 展开示例说明步骤，演示页负责执行算法。</figcaption></figure>
    <Link className="text-link" href="/demos/linked-list/index.html">进入真实归并演示</Link>
  </div>;
  if (slug === "photo-to-visual-diary") return <figure className="note-example"><div className="note-image-pair">
    <Image src="/images/posters/travel-family-corgi.png" alt="旅行拼贴参考：人物与陪伴成为画面的中心" width={1122} height={1402} sizes="(max-width: 760px) 50vw, 380px" />
    <Image src="/images/posters/travel-diary.png" alt="旅行拼贴参考：以风景、纸边和手写文字组织画面" width={1122} height={1402} sizes="(max-width: 760px) 50vw, 380px" />
  </div><figcaption>两种已有拼贴构图参考 · 分别观察主体、留白和文字的位置，图片并非同一模板的前后对比。</figcaption></figure>;
  if (slug === "building-in-public") return <div className="note-example"><h3>一个最小的展示顺序</h3><ol className="example-flow"><li>说明使用场景</li><li>展示真实界面</li><li>提供演示或视频</li></ol><Link className="text-link" href="/projects/pyscreen">看看 PyScreen 如何组织介绍</Link></div>;
  return <div className="note-example"><h3>把同一段内容分出层次</h3><div className="type-example"><h4>PyScreen · Python 练习台</h4><p>在浏览器里运行 Python，观察代码怎样改变画面。</p><Link className="text-link" href="/projects/pyscreen">了解使用过程</Link></div><p className="article-meta">示例用标题说明是什么，用一句话说明用途，再提供明确入口。</p></div>;
}
