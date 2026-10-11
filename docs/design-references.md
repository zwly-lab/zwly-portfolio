# Portfolio presentation references

Reviewed on 2026-10-11. These sources inform information hierarchy. The MIT Magic UI Portfolio card structure is adapted into the existing ProjectCard, and reused for the shared NoteCard. External image assets and dependencies are not copied.

- [Adham Dannaway — portfolio](https://www.adhamdannaway.com/portfolio): put visual work before long descriptions, keep titles and categories concise.
- [Adham Dannaway — product case](https://www.adhamdannaway.com/portfolio/ui-design-book): alternate product visuals and explanatory sections.
- [Once UI Magic Portfolio](https://github.com/once-ui-system/magic-portfolio): separate home, work, about and blog; use project covers and article covers with clear navigation. Its implementation is not reused.
- [Magic UI portfolio](https://github.com/magicuidesign/portfolio): responsive developer portfolio with centrally maintained content and a blog.

Applied here: real screenshots on home and work listings; product covers before overview text; explicit concept captions for exploration; a work-based About page without avatars or invented career details; article covers and a latest-notes section. Preserve ZWLY's light editorial typography and green accent.

The five new product screenshots are actual saved browser views. PyScreen and linked-list merge come from verified demo interactions in this task; KMP and GDP were captured from the deployed demos. Campus menu is an earlier saved actual interface from 2026-09-08, labeled as historical. It is not a third-party reference image or a claim about the latest app version.

The existing learning notes are reused as selected summaries, not imported wholesale: 《图片提示词-照片转绘与日记》 (2026-09-30) and 《UI交互动效设计清单》 (created 2026-09-12, updated 2026-09-30). Source notes remain unchanged. Public articles retain the unverified-template / design-intent boundaries.

## Source reuse

- Source: `magicuidesign/portfolio`, commit `5ef12e4c8bd0de3e22e89c2181ee77a35925ec8b`, `src/components/project-card.tsx`.
- Reused media-first layout, separate content heading/description, bottom-aligned wrapping technology tags, and link/focus interaction. Adapted to Next Image, the existing Arrow, typed local content and CSS; removed autoplay video, markdown parsing, badge dependencies, fallback `#` links and nested links.
- MIT copyright and full permission notice retained in `licenses/magicui-portfolio-MIT.txt`.
- The notes checklist is applied in the site: consistent grid, complete image previews, visible exploration/source states, stable layout and reduced-motion support. Template summaries remain unverified as documented.

## Design skills refinement (2026-10-11)

Pinned Style B wins over generic skill palette suggestions: preserve white, charcoal, green and hairline editorial rules. Applied frontend-design's clear grid and content discipline, UI/UX Pro Max's touch/contrast/type guidelines, Impeccable's scoped refinement and bounded verification, and shadcn's breadcrumb composition.

The shared `ui/breadcrumb.tsx` is adapted from `npx shadcn@latest view @shadcn/breadcrumb` (2026-10-11), with nav/ol/li semantics, current-page and separator accessibility. The registry's Radix Slot, cn, unused ellipsis and icon dependencies are removed; Next Link and the site's SVG style serve the bounded routing use. Full MIT notice: `licenses/shadcn-ui-MIT.txt`; upstream reference revision `c2a67849be260701852b0977ba15eb5f3a0ce2a4`.

Archivo variable font is self-hosted from Google Fonts `ofl/archivo/Archivo[wdth,wght].ttf`, with `licenses/Archivo-OFL.txt`. Chinese uses the existing system font fallback. No external font requests at runtime or new component dependencies. Article navigation uses native anchor links and a responsive sticky table of contents.

Motion: one 600ms print-like uncover on the homepage preview; 140–220ms link/card feedback and gallery opacity; native smooth section navigation with target-heading feedback. No repeating animation or delayed article reading; reduced-motion disables spatial/reveal motion while retaining state colors.

## Product clarity refinement (2026-10-11)

The homepage now names the actual teaching/tool/visual scope in Chinese, puts its primary actions next to the headline, and uses a cropped view of the actual PyScreen workspace. Crops are CSS presentations of existing screenshots, not invented interfaces. The cards retain the previously adapted Magic UI source and license.

Work listings have three domain filters plus All, pressed-state semantics and a live result count. Six products include their audience, a three-step use/presentation flow, and the actual runtime boundaries. Offline products retain screenshots or the existing silent film. Exploration entries remain explicitly unimplemented.

Article previous/next navigation is adapted from [timlrx/tailwind-nextjs-starter-blog, layouts/PostLayout.tsx](https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/b45bef66b40c63b6f57c15ee8cd090682238df4c/layouts/PostLayout.tsx), revision `b45bef66b40c63b6f57c15ee8cd090682238df4c`. Reused the conditional adjacent-article footer/link structure, adapted to local typed content, Next Link and the incumbent CSS. Full MIT notice: `licenses/timlrx-starter-blog-MIT.txt`. No Contentlayer, analytics, comments, author avatars or dependency graph is imported. `sabin-paudel/portfolio-template` was also inspected but its missing license means no source was reused.

Articles move the oversized cover into a compact desktop sidebar, show dates and summaries before the body, track the current section, and include examples alongside the discussion. The travel images are two independent composition references, not an original/generated comparison. The native details example explains state feedback and links to the actual algorithm demo; it does not pretend to run the algorithm.

The gallery uses native modal dialog behavior ([MDN dialog reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)): explicit close, Escape, focus restoration, previous/next buttons, arrow-key navigation, an announced position and background scroll preservation. Original image links remain available. The modal and example use a 160ms opacity transition, disabled for reduced motion. No additional runtime dependencies.

## Site-wide continuity refinement (2026-10-11)

The subsequent refinement expands resource screening to design, navigation, layouts, components, dynamic components, icons and motion. See [resource-screening.md](resource-screening.md) for the 20 entry URLs, access limitations, selected implementations and pinned license provenance.

It supersedes the earlier gallery-only opacity behavior: thumbnail expansion/return and directional navigation now use bounded native Web Animations. Work filtering animates retained-card positions; a shared selection underline connects the global navbar, homepage preview controls, filters and article directory. Native disclosure gains a state label, a licensed chevron and progressive CSS size animation. Global link/card feedback reaches all routes. The editorial palette, real media, native keyboard behavior and reduced-motion paths remain the design authority.
