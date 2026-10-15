# Portfolio presentation references

Current direction is the Vibe Coding extension below; earlier sections remain
as a chronological record and do not override the current layout.

## Vibe Coding identity and quality calibration (2026-10-12)

The user confirmed a Vibe Coding portfolio. This extends Style B rather than
borrowing an award winner's identity: Vibe Coding becomes the main heading;
the first view shows applications, interaction and visual work simultaneously.
Shared media retains its relationship across four choices. Mobile keeps a readable
primary image and descriptive secondary entries. Plain technology lines replace
boxed tags; live-demo introduction and stage widths stay anchored when opened.

| Reference and verified status | Applied principle | Boundary |
| --- | --- | --- |
| [Lovable Editorial Studio](https://lovable.dev/en/templates/websites/portfolio/editorial-portfolio), [live template](https://editorial-portfolio-9d8e325b.lovable.app/) | Work/archive/method hierarchy and editorial spacing | No copied portrait, identity, availability claims or text |
| [Lovable Green Design](https://lovable.dev/templates/websites/portfolio/graphic-designer-5), [live template](https://graphic-designer-05.lovable.app/) | One forest-green identity and selected-work navigation | Live template mixes example identities; no wholesale content reuse |
| [The Way of Code](https://www.thewayofcode.com/), [Anthropic artifact case](https://claude.com/resources/articles/build-artifacts) | A Vibe Coding collection where the artifact itself carries the experience | No copied poetry, artwork, numbered chapters or bulk WebGL runtime |
| [8bit AI / Awwwards](https://www.awwwards.com/sites/8bit-ai), [live site](https://8bit.ai/) — Site of the Day 2025-07-21 and Developer Award | One purposeful authored motion within a clear visual language | No particles, camera travel or claims of our own award |
| [Bézier / Webby official list](https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-visual-design-function?years=0), [creator case](https://www.buildinamsterdam.com/case/bezier) — 2025 Webby Winner, Best Visual Design – Function | Real interaction proves the artifact; keep inline demonstration | No font-store features, commerce or copied type assets |
| [Stefan Vitasović Portfolio25 / FWA](https://thefwa.com/cases/stefan-vitasovic-portfolio25-p3), [live site](https://stefanvitasovic.dev/) — FWA of the Day 2025-09-28 | Author identity can be distinct without an avatar; terse portfolio navigation | No copied kinetic signature, glitch effect or annual-winner claim |

Official recognition entries and selected live views were checked; this does not
certify every external site's mobile, performance or accessibility behavior.
The website uses its own media, existing licensed components and native Web
Animations. External references inform design decisions; their source code,
images and writing are not bundled. Award-level is a requested quality benchmark,
not an objective claim that this portfolio has won or will win an award.

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

The release integrates the previously published interaction refinement: bounded
native Web Animations connect gallery thumbnails to the modal and move images in
the navigation direction. Reduced-motion browsers update directly. An active
selection ref keeps rapid key presses ordered; cancellation still releases the
native modal and restores focus. Shared underlines and retained-card layout
animation now connect navbar, portfolio directions and work filters. The native
disclosure retains its state labels, licensed chevron and progressive size animation.
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

## Site-wide continuity refinement (2026-10-11)

The subsequent refinement expands resource screening to design, navigation, layouts, components, dynamic components, icons and motion. See [resource-screening.md](resource-screening.md) for the 20 entry URLs, access limitations, selected implementations and pinned license provenance.

It supersedes the earlier gallery-only opacity behavior: thumbnail expansion/return and directional navigation now use bounded native Web Animations. Work filtering animates retained-card positions; a shared selection underline connects the global navbar, homepage preview controls, filters and article directory. Native disclosure gains a state label, a licensed chevron and progressive CSS size animation. Global link/card feedback reaches all routes. The editorial palette, real media, native keyboard behavior and reduced-motion paths remain the design authority.

## Whole-page opening (2026-10-15)

Primary references reviewed for the opening:

- [Brittany Chiang v4](https://github.com/bchiang7/v4), pinned revision `539cef0bf60cad438499a69d76dba2c27cc16c9a`, `src/components/loader.js` and `sections/hero.js`: establish identity before unveiling the site. Keep the previously recorded MIT notice; no upstream runtime or new artwork is copied.
- [Codrops Grid Flow Effect](https://github.com/codrops/GridFlowEffect/) and its [author's explanation](https://tympanus.net/codrops/2023/07/27/grid-flow-animation/): treat the artifact composition as one related scene rather than independent flourishes.
- [R—K ’26 implementation case study](https://tympanus.net/codrops/2026/04/07/r-k-26-the-thinking-and-code-behind-a-portfolio-led-by-presence/): overlap the identity and page reveals to make one continuous entrance.

The initial 760ms wordmark/title/card sequence did not meet the clarified brief: it animated individual first-screen elements, and its session flag could suppress subsequent attempts to see it. It is replaced by one 1200ms whole-page scene. An existing forest-green surface and the real site name form a cover, which lifts as the complete navigation/body/footer settle together. This is a short opening, not asset-loading progress; it does not wait for images or framework hydration. The decision runs before first paint, so delayed framework scripts cannot hide content later. Full reload replays the scene; client/history navigation preserves the normal route transition. All input, hidden/reduced-motion states and a bounded fallback release it. No JavaScript leaves ordinary server-rendered content visible. No upstream artwork, sound or WebGL scene is imported.

## Product-led image-stack opening refinement (2026-10-15)

The flat signature/curtain sequence was too uniform for the clarified brief. This pass reuses the stack-to-composition idea with the portfolio's three actual featured artifacts. They briefly unfold and then land in their measured homepage frames while four paper columns reveal the page. The signature is staggered by letter, and leaves before it can overlap revealed content. The complete composition finishes at 1700ms. Navigation/body share opacity, leaving destination geometry static.

- [Image Stack Entrance Animations](https://tympanus.net/codrops/2024/04/10/image-stack-entrance-animations/), by deadrabbbbit: staged arrival, spread and bounded offsets. Reviewed `js/index.js` in [the linked author repository](https://github.com/d3adrabbit/EntranceAnimationForImages/tree/a9db36d3c8030513fc45346f3b65466d81dc7480). Re-expressed the choreography with native keyframes and measured real destinations rather than importing GSAP, its infinite circular loop or its media. Its MIT notice is retained in `licenses/codrops-image-stack-MIT.txt`.
- [Bisous author case study](https://tympanus.net/codrops/2026/06/29/inside-bisous-designing-an-editorial-experience-for-cinematic-cgi/): curated imagery carries the opening into the homepage. Adopted continuity using the same responsive preview, crop and final frame. The live site returned a firewall 403 during the browser visit, so this comparison relies on the author's explanation, not a claimed live acceptance.
- [Eduard Bodak](https://www.eduardbodak.com/) and [his implementation walkthrough](https://tympanus.net/codrops/2025/07/29/built-to-move-a-closer-look-at-the-animations-behind-eduard-bodaks-portfolio/): actual browser captures showed the identity changing scale/position into the page. The walkthrough informed bounded card rotation and mobile adaptation. Do not copy the scroll setup or infinite floating motion into this short opening.
- [Cyd Stumpel](https://cydstumpel.nl/) and [the Awwwards transition entry](https://www.awwwards.com/inspiration/default-page-transition-cyd-stumpel-portfolio-2025): inspected the live typography-led composition; its expressive type remains recognizable across navigation and content. Keep our own Archivo identity and real artifacts; no portrait, stickers, credentials or artwork are reused.

The Codrops live demo also returned a browser security challenge. Its readable article plus pinned MIT source were used; there was no attempt to bypass protection or run a cloned external project. All media remains our existing local work, and no runtime dependency is added. Browser acceptance now checks the real handoff within one pixel, same selected image resource and object-fit, early interruption before DOM readiness, resize cleanup and navigation during failed images.

## Continuous perspective-camera opening (2026-10-15)

Reviewed [zero / @twoclipping's original prompt and video](https://x.com/twoclipping/status/2110329502676951367) in the browser. The prompt describes a 14.5-second offline WebGL promotional film with a continuous camera, lifted UI planes, depth of field and a return to a hero card. We inspected the flight, overhead and closing key frames. Its instructions are reference material, not application requirements.

The user approved a short live-web adaptation: one continuous spatial camera, a small amount of elevation and shadow, and a focus handoff into the usable homepage. The actual page and preview copies now share a single parent camera over 2400ms. It uses CSS perspective and native keyframes rather than a captured-page video, WebGL renderer, third-party branding, fonts, audio or offline multi-sample blur. No runtime dependency or new external media is added. The existing real page supplies the identity and content.

The first batched desktop/mobile inspection exposed interpenetrating image planes and an abrupt rounding release. Distinct depth spacing and smaller local tilt now keep overlapping previews separate; rounding/shadow fade to the neutral page and labels appear during landing. Acceptance measures the actual depth ranges and <1px final image handoff. The camera briefly uses a first-viewport crop; input and completion must restore the complete document, covered by the real PageDown regression. This replaces the prior paper-column and duplicate-signature scene.

### Playback fidelity and light refinement

The user reported that real playback did not resemble the unfolded screenshot. A cold-load timing probe and delayed-image fixture reproduced the discrepancy: images arriving about a second late could miss the recognizable fan entirely while the scene clock was already advancing. The previous screenshot paused the timeline and therefore concealed that timing risk. The scene now waits for preview decoding and local font readiness within a bounded 1600ms preparation budget, then starts all owned timelines together; failed/over-budget preparation goes straight to the normal page. A live drifting fan passage makes the composition readable rather than a single favorable frozen frame. New regression assertions require at least 600ms of recognizable, fully decoded flight without pausing animations.

The same refinement strengthens authored CSS depth and lighting: greater separated elevation, restrained local X/Y tilt, directional ambient/contact shadows and a temporary surface/edge highlight, all fading during landing. Mobile spread is inset from the viewport and the highlight stays translucent enough to preserve dark UI detail. These are CSS depth cues, not physically based WebGL lighting. No source media, runtime dependency or factual product content was replaced.

### Physical rounded cards, after the user's realism feedback

The user explicitly requested more realistic floating cards, allowed Three.js and asked for rounded corners. The final version adds Three.js 0.186.1 (MIT), lazy-loaded only for this homepage opening, and matching development types. It uses real extruded rounded geometry, a narrow bevel, physical clearcoat, an area light and one directional shadow map. The reference contracts are the [official physical-material documentation](https://threejs.org/docs/pages/MeshPhysicalMaterial.html), [shadow guide](https://threejs.org/manual/pages/shadows.html), [area-light example](https://threejs.org/examples/webgl_lights_rectarealight.html), and [renderer cleanup documentation](https://threejs.org/docs/pages/WebGLRenderer.html). No HDRI, external artwork or other project was downloaded.

The renderer follows the existing native transforms rather than inventing a second animation. It rasterizes the same decoded screenshots with their exact object-fit and PyScreen crop, then removes physical lighting/depth near landing to meet the 12px rounded DOM frames. Initialization is bounded at 2600ms; missing WebGL uses the CSS scene, while over-budget preparation goes directly to browsing. GPU context loss returns to the matching native poses. Pixel ratio is capped at 1.5 and all owned GPU resources are disposed when the scene ends.

Variance shadows produced visible diagonal self-shadow artifacts during the desktop/mobile check. The final implementation uses biased PCF sampling and a lighter receiver; browser tests sample the actual WebGL framebuffer away from the cards to catch full-page shadow artifacts, alongside real draw calls, rounded DOM landing, context loss and resource cleanup. These checks complement visual inspection; they do not establish physical-device frame rates.

### Startup and playback performance

The user's startup feedback triggered a separate performance pass. A shader-instrumented browser regression reproduced four compilations during flight. Surface/shadow prewarming now happens before the common clock starts, and the clearcoat stays above zero until disposal so landing does not switch shader variants. The same regression now requires zero in-flight compilations. Reused matrices/native animation references reduce frame allocations; mobile uses a 1.25 pixel-ratio cap and 512px shadow map, while desktop retains 1.5/1024px.

The renderer bridge moved from the global layout to the homepage, and its Three.js chunk loads in parallel with homepage route scripts instead of a post-hydration import waterfall. Preparation now has an 1800ms cap. The original self-hosted Archivo TTF is retained as the source; the runtime uses a 73,688-byte WOFF2 at the existing normal width instead of the 658,596-byte two-axis TTF. FontTools 4.63.0 pins the unused width axis at its default 100 and preserves all glyphs and the 100–900 weight axis. Read-back checks confirm identical glyph coverage and complete horizontal metrics at weights 100, 400, 600 and 900. The original OFL notice is retained. Callback-interval probes are environment-specific and are not a claim about visitors' hardware frame rates.

## Grounded composition and slow-load correction (2026-10-15)

The user reported that the whole-page inclination felt artificial and the opening expired during loading. The previous 24-degree page tilt, page blur, reduced opacity, outer rounding and board-like shadow are removed. The stable editorial page now anchors the scene; only the actual three works lift, gather and return. Their fan derives from the showcase bounds rather than the viewport center, keeping navigation, identity and primary action clear on desktop and mobile. Physical light and thickness grow from a flat initial pose and fade at the same native destination. The studio reflection is restrained and the screenshot material remains mostly emissive, preserving dark UI and artwork colors.

The old 1800ms preparation cap could skip an opening whose resources were still loading. Preparation now leaves the ordinary document visible and usable, with a separate 8000ms resource watchdog. Decoding, font readiness and shader warm-up precede the full 2400ms playback clock. Real user input cancels preparation or playback and prevents a late scene. Five-second image and delayed-script regressions require a complete decoded scene, while initial and final frame measurements prevent teleportation. This supersedes the page-camera and preparation behavior described in the earlier entries; the existing font/chunk/shader optimizations remain.

## Gallery opening and whole-homepage reveal (2026-10-15)

The user approved a complete opening leading into the homepage, with reuse from other work. The new sequence uses a lightweight first-paint cover, a centered real-work stack, and the existing site wordmark. When resources are ready, the cover opens, the wordmark moves into its actual header position, existing title lines rise through their masks, and navigation, introduction and work selection enter on the same clock. The stack expands into the showcase and lands in its original rounded frames. Total playback remains 2400ms, with no new dependency or external artwork. The 8000ms preparation bound and interruption paths remain, with an explicit skip button, including assistive click support. This replaces the previous visible-page preparation and frame-lift opening; the document stays full height and frontal beneath the cover.

Reference comparison and concrete reuse:

- [Codrops CoverPageTransition](https://github.com/codrops/CoverPageTransition), revision `28b793b46454d4af382803d082e7e7009574248d`: `src/css/base.css` opposing top/bottom transform origins and overlay rows, `src/js/index.js` row scale sequencing, and `src/js/textLinesReveal.js` wrapped 105%-to-zero line translation. Adapted into native CSS and the existing shared Web Animations clock; the two existing headline lines replace runtime text splitting. MIT notice retained in `licenses/codrops-cover-page-transition-MIT.txt`. Source inspected through targeted read-only fetches; the external repository was not installed or executed locally.
- [Image Stack Entrance Animations](https://tympanus.net/codrops/2024/04/10/image-stack-entrance-animations/) and [author repository](https://github.com/d3adrabbit/EntranceAnimationForImages), revision `a9db36d3c8030513fc45346f3b65466d81dc7480`: inspected the live demo and `js/index.js`. Adopted the conceptual progression from one focal stack into a broader composition. No source copied from this project; its circular carousel, loops, 180-degree flips, large blur, media and GSAP dependency were unsuitable for this short editorial opening.
- [Eduard Bodak](https://www.eduardbodak.com/) and the [author's walkthrough](https://tympanus.net/codrops/2025/07/29/built-to-move-a-closer-look-at-the-animations-behind-eduard-bodaks-portfolio/): revisited the live layout and author-defined spatial relationships. Retained responsive frame-based destinations and input/reduced-motion handling. The live browser showed a magenta graphics artifact, so its rendered WebGL is not claimed as performance acceptance or reused.
- [Olha Lazarieva / Max Milkin author case study](https://tympanus.net/codrops/2025/12/02/two-portfolios-one-process-where-design-motion-and-code-come-together/): informed a restrained opening that continues the site's typography and pacing. No source copied; text rings, PixiJS and the timed percentage counter are excluded. This comparison uses the author's case study, without claiming live-site verification.
