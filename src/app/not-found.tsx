import Link from "@/components/NavigationLink";
export default function NotFound() {
  return <main id="main-content" className="container empty-page"><header className="page-header"><p className="section-label">404</p><h1>这一页还未写下。</h1><p>页面不存在，或地址已发生变化。</p></header><Link className="text-link" href="/">回到首页</Link></main>;
}