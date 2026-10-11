(function () {
  "use strict";

  const progress = document.createElement("div");
  progress.className = "page-navigation-progress";
  progress.setAttribute("aria-hidden", "true");

  const status = document.createElement("p");
  status.className = "page-navigation-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.setAttribute("aria-atomic", "true");
  status.hidden = true;

  document.body.append(progress, status);

  let slowTimer = 0;

  function reset() {
    window.clearTimeout(slowTimer);
    document.body.classList.remove("is-navigating");
    status.hidden = true;
    status.textContent = "";
  }

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.href === window.location.href) return;
    if (destination.pathname === window.location.pathname && destination.search === window.location.search && destination.hash) return;

    reset();
    document.body.classList.add("is-navigating");
    slowTimer = window.setTimeout(() => {
      status.textContent = "页面加载较慢，当前内容仍保留。可以重新选择导航，或按 Ctrl+R 重试。";
      status.hidden = false;
    }, 1800);
  }, true);

  window.addEventListener("pagehide", reset);
  window.addEventListener("pageshow", reset);
})();
