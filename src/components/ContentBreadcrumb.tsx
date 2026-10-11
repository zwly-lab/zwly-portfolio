import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";

export function ContentBreadcrumb({ href, label, title }: { href: string; label: string; title: string }) {
  return <Breadcrumb><BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">首页</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href={href}>{label}</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>{title}</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList></Breadcrumb>;
}
