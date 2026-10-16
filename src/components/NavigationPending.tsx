"use client";

import { useLinkStatus } from "next/link";
import { createPortal } from "react-dom";

export function NavigationPending() {
  const { pending } = useLinkStatus();
  return pending ? createPortal(<div className="navigation-pending" role="status"><span className="sr-only">正在打开页面</span></div>, document.body) : null;
}
