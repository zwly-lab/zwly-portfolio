# Portfolio presentation references

Current direction is the portfolio-wide redesign below; earlier sections remain
as a chronological record and do not override the current layout.

## Portfolio-wide redesign (2026-10-11)

The whole portfolio leads, not one product's marketing page. Home has paired
previews for learning tools, applications/interfaces and visual expression.
Detailed task/code/feedback annotation belongs to PyScreen's own case.
The previous independent reviews informed hierarchy, evidence gaps, Chinese
reading density and quieter concept archives. Existing filters, demo states,
gallery controls and licensed source adaptations remain in use.

Primary product references: [Linear](https://linear.app/) for process narration,
[Apple's Chinese product page](https://www.apple.com.cn/macbook-air/) for media
scale, [Stripe](https://stripe.com/payments) for value/implementation reading
layers, [Vercel Observability](https://vercel.com/products/observability) for real
state objects, and [Ant Design motion](https://ant.design/docs/spec/motion-cn/)
for shared cognition/feedback rules. These are design patterns, not copied source
or media. No enterprise claims, customer logos or benchmark numbers are imported.

Personal portfolio references: Joshua Baker (case argument), Ben Mingo (image
curation), Rauno (work/prototype hierarchy), Emil Kowalski (purposeful feedback),
Maxime Heckel (examples next to explanations), Anthony Fu (focus/archive),
Shu Ding (contribution scope), Sukka and Innei (problem-led engineering writing).
Chinese design sites portfolio.zioydesign.com.cn and echolin.com.cn/design are
supplementary for Chinese case framing and visual-series organization.
Do not copy unverified-license code, articles or imagery. Historical Shiro
designs are not evidence about Innei's current site.

Media evidence added this round: public/images/projects/pyscreen-error.png is an
unaltered 1440×1000 browser capture. In level 6, entering an incomplete x =
assignment and running produced line-1 SyntaxError and a locate-line button.
Replacing it with the two-frame movement code and running again yielded x=3,
y=4, 2/2 frames and 15 trace steps. This verifies the observed interaction,
not educational effectiveness. Original upstream demo code remains untouched.

The gallery uses a progressively enhanced native
[View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition).
Unsupported/reduced-motion browsers update directly. An active selection ref
keeps rapid key presses ordered while pending transitions are interrupted.
Closing invalidates deferred updates and preserves the native focus restoration.
No animation dependency was added.

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

## Expanded local discovery and licensed reuse (2026-10-11)

Used Basic Memory against the connected second-brain project to follow note/index links, not just filename searches. Newly reviewed sources include 算法数据结构学习资源索引, 数据可视化与大数据资源索引, AI与生产力工具索引, 代码索引, 技术学习路线图, 黑马Python-10-数据可视化折线图 and JD Protocol Engine-宣传资产同步记录. A separate Hindsight recall returned no matches for this query; that store is independent and is not evidence that the notes do not exist. Original notes and assets are unchanged.

The user's URL / animation resources are the canonical 优质外部工具与资源导航 and UI交互动效设计清单 in the Second Brain. Followed their external references, including [Minimal Gallery](https://minimal.gallery/), [Landing Love](https://www.landing.love/), [Design Spells](https://designspells.com/) and [Fluid Functionalism dialog](https://www.fluidfunctionalism.com/docs/dialog). Not all links in the resource collection were tested.

| Source | Applied result |
| --- | --- |
| Data visualization index + Python course learning notes | Original, selected article “画图之前，先读懂数据”; historical GDP preview and actual demo; explicit source/unit verification limits |
| Code index + JD marketing asset record (2026-09-04) | Original article “中文产品海报：先把字排清楚”; existing ratio examples; two actual saved task/log screenshots, clearly labeled historical empty states |
| UI interaction checklist | Actual pressed-state work filters, conditional embedded KMP, loading/ready feedback, bounded gallery navigation and reduced-motion handling |
| Joshua Baker [The Dots case](https://www.joshuabaker.com/work/the-dots/) | Product walkthrough organization and evidence-linked About page; reference only, no copied assets, personal history or source |
| [Brittany Chiang](https://brittanychiang.com/) | Animated link underline for pointer and keyboard focus |
| [Maxime Heckel](https://blog.maximeheckel.com/) | Circular article reading position with scroll/anchor navigation |
| [Anthony Fu](https://antfu.me/) | Compact title/date archive with local image previews |

Also reviewed [Lee Robinson](https://leerob.com/), [Paco Coursey](https://paco.me/) and [Josh Comeau](https://www.joshwcomeau.com/) for clear writing navigation, restrained feedback and playable demonstrations. Their source/assets are not imported. Once UI's current noncommercial license is not used as a code-reuse permission.

Specific code adaptations, with full notices retained:
- bchiang7/v4, revision 539cef0bf60cad438499a69d76dba2c27cc16c9a, src/styles/mixins.js inlineLink: one-pixel underline appearing on hover/focus. Adapted to scaleX and the incumbent tokens; retained visible keyboard focus and reduced motion. licenses/brittany-portfolio-MIT.txt.
- maximeheckel/blog.maximeheckel.com, revision ccbb3def76870a1b8feaa4506c5877d24fd7bdfd, core/components/DynamicTOC/MiniProgressCircular.tsx: 20px SVG circular progress, r=8, stroke=2 and -90-degree orientation. Adapted to native SVG without the upstream animation dependency. licenses/maxime-blog-MIT.txt.
- antfu/antfu.me, revision e3ff0442327a24b1f389982a19ec8aca704d9245, src/components/ListPosts.vue: descending-date iteration and title/date article archive. Adapted to semantic ul/li + Next Link, own previews and summaries; no Vue router, year animation, external article content or avatar imported. licenses/antfu-site-MIT.txt.

Capability discovery covered the existing memory MCPs, AAS read-only skill catalog and installed GitHub/Vercel integrations. Selected React performance guidance for conditional loading/passive scroll listeners and accessibility guidance for keyboard/focus/state feedback. No plugin or dependency installation, credentials, local service backend or copied third-party runtime is required.

Motion now follows real events: 220ms filter-result appearance, gallery open/image changes, conditional demo appearance, link hover/focus and the existing single homepage reveal. Native dialog preserves Escape and focus restoration; article state is tied to real scroll position. Spatial/reveal effects are disabled under prefers-reduced-motion. No scroll hijacking or recurring decorative animation.


## Review-driven browsing path (2026-10-11)

Reviewed the current rendered homepage plus code from visual editing, first-visitor/content and interaction/accessibility perspectives. Three independent reviewers were read-only; implementation and browser acceptance remain with the primary agent.

Removed the repeated PyScreen featured card: the hero has PyScreen, while the next section introduces campus application, JD console and visual work. The same hero frame now has three user-controlled views (code to canvas, text to process, inspiration to poster); no autoplay. The 400ms clipping transition keeps a stable frame, selection remains visible and reduced-motion removes the reveal. Poster listing crops are explicitly previews; full original images remain in the gallery.

Cases now connect to another available work in their domain and a relevant article. The six public articles are curated summaries; the original Second Brain is not published in full. About links claims to actual work.

Found and fixed two runtime issues in the embedded KMP path: a static #app node did not prove script initialization, so ready now requires a marker written only after reset/render succeeds; reduced-motion bypasses scene waiting and flying-value timers. Narrow-screen controls/inputs get at least 44px targets without changing the underlying algorithm.

Verification for the runtime correction: blocking the actual KMP app script produced a Script loadingFailed event and left the static root present but the initialization marker absent. Restoring the script set ready=true. Replacing the embedded document with a missing same-origin page produced the error message; closing/reopening restored the real demo. Network emulation and temporary DOM changes were removed. At 375px, visible KMP controls/inputs measured 44px tall; reduced-motion advanced directly to STEP 1 with no scene/flying tokens, and reset returned STEP 0. Reviewed 21 page/viewport combinations at 375/820/1440px with no document overflow or broken loaded images. Darkened the secondary text token so it also clears 4.5:1 on the tinted footer background.

A final online article check exposed a clamped-scroll edge case: clicking section 3 in the short poster article could leave section 2 active while the browser did not retain the fragment. The TOC now remembers the click target independently of the fragment and releases it on manual wheel/touch/scroll-key input. Fresh local regression checks passed the clamped desktop anchor, Control+Home returning to section 1, and a 375px mobile anchor.
