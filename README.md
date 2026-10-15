# ZWLY Lab Portfolio

A light, editorial Vibe Coding portfolio: applications, interactive experiments and visual work created through AI collaboration. Built with Next.js 16.4, React 19.3, TypeScript and Tailwind CSS 4.

## Local development

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production preview: `npm run build`, then `npm run start`.

## Routes

- `/`: introduction, selected work and technical practice.
- `/projects` and `/projects/[slug]`: project directory and detail pages.
- `/about`: interests and approach.
- `/blog` and `/blog/[slug]`: notes and full articles.
- Unknown routes and unknown content slugs return HTTP 404.

## Maintain the content

- `src/data/projects.ts`: projects, technologies, descriptions and exploration status.
- `src/data/cases.ts`: product questions, concrete interface choices, observation paths and evidence boundaries.
- `src/data/posts.ts`: dated notes and article sections.
- `src/data/site.ts`: GitHub contact link and practice areas.
- `src/components`: navigation, footer, shared project/note cards and stack display.
- `src/app/globals.css`: shared design tokens, typography and responsive layout.

The portfolio overview initially shows applications, interactive experiments and visual expression together. Four selectable directions retain shared media as their positions change. Mobile presents one readable preview with descriptive secondary links. Selected work then leads to PyScreen, Campus Takeout and JD Protocol Engine. Product walkthroughs belong in their detail pages. Algorithms/data practice, visual series and unimplemented concepts have separate hierarchy. Existing filters, actual demos, native gallery and licensed link/article components are reused. No fabricated metrics, prompt histories or contact addresses are included. See PRODUCT.md, DESIGN.md and docs/vibe-direction.md for the positioning, composition and motion rules.

## Existing results

| Result | Public presentation | Source |
| --- | --- | --- |
| PyScreen | Browser Python playground and course index | `E:/Python/Book/teaching-tools/pyscreen-package/src/pyscreen/web` |
| KMP | Self-contained interactive algorithm demo | `E:/Python/kmp-algorithm-visualizer` |
| Linked-list merge | Interactive stable merge animation | `E:/Python/linked-list-merge-visualizer/启动-有序链表二路归并.html` |
| GDP timeline | Historical 1960–2019 chart, adapted for viewport resizing | `E:/Python/BaseProject/动态图/1960-2019全球GDP前8国家.html` |
| JD Protocol Engine | Existing dashboard screenshot and silent product film | `E:/Python/Order/JD/assets/screenshots`, `marketing/video/output` |
| Poster collection | 18 curated visual works, original aspect ratios and full-image links | ChatGPT Library image copies, plus three reviewed JD marketing posters; see `docs/visual-assets.md` |

The standalone demos are copied into `public/demos`; original projects are untouched. PyScreen uses a local Pyodide 0.27.8 runtime, with upstream files unchanged and license/source notices retained in `public/demos/pyscreen/pyodide`. Its server-only screen link was omitted and internal links use relative paths. The copied renderer skips hidden/tiny canvases; the mobile preview has a bounded height to prevent intrinsic canvas resize growth. A regression test covers the drawing boundary. The first Python run loads about 14 MB of runtime assets. GDP loads ECharts from the original pyecharts CDN and uses historical exercise data. JD's business operations require local services and login; only reviewed presentation assets are published, without credentials or business records. The silent video preserves the reviewed release video stream from apple-product-film-30s-no-bgm.mp4 and removes all audio without re-encoding.

Desktop pygame games have no available browser runtime or verified screenshots in this environment. BigData, PySpark and scraped third-party pages are not copied wholesale. Campus Takeout has a labeled historical menu screenshot and a product introduction; its working UI depends on the WeChat environment and backend.

## Reused presentation

The media-first project card structure is adapted from the MIT-licensed Magic UI Portfolio and shared across home and work. NoteCard serves both home and notes. The source revision and adaptation details are recorded in `docs/design-references.md`; the full upstream MIT notice is retained in `licenses/magicui-portfolio-MIT.txt`. No external image assets or new UI dependencies are bundled. A shared breadcrumb adapted from the official shadcn registry is used in product and note details, with its MIT notice retained. Typography uses a self-hosted OFL Archivo variable font. Motion connects the selectable portfolio directions, product annotations, work filters, gallery navigation and conditional live demo, with reduced-motion support. Short articles retain adjacent reading links in a single column.

## Curated notes

The notes page features the interaction-feedback article, followed by learning/practice and build-record archives. Short articles use one reading column with in-content examples, source notes and adjacent article links; they do not need a large sticky table of contents. Source names, dates and validation boundaries remain visible. Only rewritten public summaries are included, without vault paths, personal journals or full template dumps; the original vault is unchanged.

## Validate

```sh
npm run lint
npm run typecheck
npm run build
npm run start
# In a second terminal:
npm test
```

The smoke test checks 19 routes with visual previews, metadata, stylesheet availability, contact links, 3 missing routes, 19 demo/media resources and 18 gallery images, including WebAssembly/PNG signatures and MIME types. It can check a deployment with `npm test -- https://zwly-lab.vercel.app`.

GitHub Actions runs install, lint, types, build and the production smoke test on pushes to `main` and pull requests. Actions are pinned to immutable revisions. The optional `node tests/browser.mjs` check uses an existing Playwright installation (set `PLAYWRIGHT_MODULE` to its package directory and `BROWSER_EXECUTABLE` when using system Chrome). It covers 40 route/viewport combinations at widths of 1440, 820, 390 and 360 pixels, intact images, direction selection, filtering, live demo loading, rapid gallery navigation, keyboard focus restoration and reduced motion. An optional second argument selects the origin; a third argument saves screenshots.

With the same browser runtime, `node tests/motion.mjs [origin]` checks coordinated entry, CSS time-unit conversion in production, retained-preview geometry when interrupted, changes to reduced-motion preference during playback, slow-image frame stability, gallery exit opacity, return focus/reopening, and stable toolbar/control positions across all 18 artworks on desktop/mobile. These browser checks complement the CI smoke test; they do not claim physical-device frame-rate measurements.

`node tests/routes.mjs [origin]` checks the actual route snapshot animations on desktop/mobile, original snapshot geometry, departure/arrival sequencing, adjacent article top position, browser back/forward reading restoration, rapid navigation, reduced motion, delayed route content and a browser without View Transitions. Installed React 19.3 handles the transition lifecycle; no custom router or animation dependency is used.

`node tests/gallery.mjs [origin]` compares the displayed gallery order with all 18 successive enlarged originals, including collapsed variants and concepts, on desktop/mobile with normal/reduced motion. It checks keyboard boundaries, original-trigger focus restoration and stable controls. The general browser check also verifies that the first work image and title fit the mobile opening and that the mixed homepage retains three image previews.

`node tests/rail.mjs [origin]` checks the three mobile visual-series rails at 390/360 pixels with normal/reduced motion: actual scroll position, partial next previews, keyboard and button boundaries, stable vertical page position, original image proportions, modal focus restoration, desktop grids and server-rendered artwork without JavaScript. The general browser check also exercises cancelled loading, failed demo recovery, preview focus contrast and article anchors below the sticky navigation.

`node tests/showcase.mjs [origin]` checks all homepage directions on desktop/mobile with normal/reduced motion, consistent stage height, decoded images before entry, slow-load continuity, immediate requested-choice feedback, late request rejection, cancellation, navigation during loading, failed-image retry and visible server rendering without JavaScript. The motion test additionally checks that interrupted filtering preserves opacity, clipping and geometry; route tests verify the single bounded arrival without replaying a title entrance.

`node tests/intro.mjs [origin]` checks the 2400ms camera opening on desktop/mobile: real page and artifacts sharing one camera, continuously straightening perspective, distinct preview depth planes, focus handoff, no horizontal overflow, full document-height restoration, and all three previews landing within one pixel of the same image/crop/frame. It also checks reload/client/history return, reduced motion, no JavaScript, fragments/restored scroll, blocked storage, interruption/resize, cancellation before DOM readiness, real PageDown scrolling, late framework scripts, slow/failed images and a missing completion event. Some state/interruption paths use controlled browser fixtures; physical-device frame rates are not measured.

## Vercel

Live site: https://zwly-lab.vercel.app · Public repository: https://github.com/zwly-lab/zwly-portfolio

Vercel project `zwly-lab` is on the Hobby plan and connected to this GitHub repository. Use the Next.js preset, repository root, Node.js 24, `npm ci` and `npm run build`. No environment variables, database or paid domain are required. The production branch is `main`; pushing to it triggers deployment to the free `.vercel.app` address.

Keep credentials and `.vercel` metadata out of Git. Production publishing should follow the matching user authorization.

## Known limits

This version does not include a CMS, contact form, visitor analytics or large animation/UI dependencies. Content is deliberately maintained in TypeScript files.

As of 2026-10-11, `npm audit --omit=dev` reports no known vulnerabilities. The full audit reports 5 high-severity entries in the development-only ESLint → fast-glob → micromatch → braces chain (GHSA-vfj7-8cjw-p6xm). The latest braces release is still 3.0.3, within the advisory range; npm suggests a breaking framework-lint downgrade, which is not applied. Recheck upstream patches when updating tooling.

The original Style B concept was recovered from the ChatGPT Library image cache during visual collection and archived with Styles A, C and D. The implementation follows the confirmed light editorial direction. Concepts are labeled separately from working product screens. Avatars are excluded at the user’s request; academic files with personal identifiers and third-party source screenshots are not published. The gallery preserves reviewed image bytes and uses Next.js responsive previews with lazy loading. This is a curated selection, not an exhaustive Library export.
