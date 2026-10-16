// Adapted from the shadcn registry Breadcrumb; MIT notice in licenses/.
import type { ComponentProps } from "react";
import Link from "@/components/NavigationLink";

export function Breadcrumb(props: ComponentProps<"nav">) {
  return <nav aria-label="页面路径" className="breadcrumb" data-slot="breadcrumb" {...props} />;
}
export function BreadcrumbList(props: ComponentProps<"ol">) {
  return <ol data-slot="breadcrumb-list" {...props} />;
}
export function BreadcrumbItem(props: ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" {...props} />;
}
export function BreadcrumbLink(props: ComponentProps<typeof Link>) {
  return <Link data-slot="breadcrumb-link" {...props} />;
}
export function BreadcrumbPage(props: ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" {...props} />;
}
export function BreadcrumbSeparator() {
  return <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m9 5 7 7-7 7" /></svg></li>;
}
