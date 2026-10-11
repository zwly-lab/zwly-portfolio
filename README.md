# ZWLY Lab Portfolio

A light, editorial portfolio built with Next.js 16.4, React 19.3, TypeScript and Tailwind CSS 4.

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
- `src/data/posts.ts`: dated notes and article sections.
- `src/data/site.ts`: GitHub contact link and practice areas.
- `src/components`: navigation, footer, project rows and stack display.
- `src/app/globals.css`: shared design tokens, typography and responsive layout.

The Campus Takeout entry is being iterated; AI Writing Coach and AI Agent Lab are explicitly exploration directions. Five existing results have been added: PyScreen, KMP, linked-list merge, the GDP timeline, and JD Protocol Engine. The homepage keeps three selected entries. No fabricated metrics or contact addresses are included.

## Existing results

| Result | Public presentation | Source |
| --- | --- | --- |
| PyScreen | Browser Python playground and course index | `E:/Python/Book/teaching-tools/pyscreen-package/src/pyscreen/web` |
| KMP | Self-contained interactive algorithm demo | `E:/Python/kmp-algorithm-visualizer` |
| Linked-list merge | Interactive stable merge animation | `E:/Python/linked-list-merge-visualizer/启动-有序链表二路归并.html` |
| GDP timeline | Historical 1960–2019 chart, adapted for viewport resizing | `E:/Python/BaseProject/动态图/1960-2019全球GDP前8国家.html` |
| JD Protocol Engine | Existing dashboard screenshot and silent product film | `E:/Python/Order/JD/assets/screenshots`, `marketing/video/output` |

The standalone demos are copied into `public/demos`; original projects are untouched. PyScreen uses a local Pyodide 0.27.8 runtime, with upstream files unchanged and license/source notices retained in `public/demos/pyscreen/pyodide`. Its server-only screen link was omitted and internal links use relative paths. The copied renderer skips hidden/tiny canvases; the mobile preview has a bounded height to prevent intrinsic canvas resize growth. A regression test covers the drawing boundary. The first Python run loads about 14 MB of runtime assets. GDP loads ECharts from the original pyecharts CDN and uses historical exercise data. JD's business operations require local services and login; only reviewed presentation assets are published, without credentials or business records. The silent video preserves the reviewed release video stream from apple-product-film-30s-no-bgm.mp4 and removes all audio without re-encoding.

Desktop pygame games have no available browser runtime or verified screenshots in this environment. BigData, PySpark and scraped third-party pages are not copied wholesale. Campus Takeout remains a project overview because its working UI depends on the WeChat environment and backend.

## Validate

```sh
npm run lint
npm run typecheck
npm run build
npm run start
# In a second terminal:
npm test
```

The smoke test checks 14 routes, metadata, stylesheet availability, contact links, 3 missing routes and 12 demo/media resources, including the WebAssembly signature and MIME type. It can check a deployment with `npm test -- https://zwly-lab.vercel.app`.

GitHub Actions runs install, lint, types, build and the production smoke test on pushes to `main` and pull requests. Actions are pinned to immutable revisions. Browser checks cover actual navigation and widths of 1440, 971, 390 and 320 pixels.

## Vercel

Live site: https://zwly-lab.vercel.app · Public repository: https://github.com/zwly-lab/zwly-portfolio

Vercel project `zwly-lab` is on the Hobby plan and connected to this GitHub repository. Use the Next.js preset, repository root, Node.js 24, `npm ci` and `npm run build`. No environment variables, database or paid domain are required. The production branch is `main`; pushing to it triggers deployment to the free `.vercel.app` address.

Keep credentials and `.vercel` metadata out of Git. Production publishing should follow the matching user authorization.

## Known limits

This version does not include a CMS, contact form, visitor analytics or large animation/UI dependencies. Content is deliberately maintained in TypeScript files.

As of 2026-10-11, `npm audit --omit=dev` reports no known vulnerabilities. The full audit reports 5 high-severity entries in the development-only ESLint → fast-glob → micromatch → braces chain (GHSA-vfj7-8cjw-p6xm). The latest braces release is still 3.0.3, within the advisory range; npm suggests a breaking framework-lint downgrade, which is not applied. Recheck upstream patches when updating tooling.

The original Style B image was not retained in the referenced conversation. The implementation follows the explicitly confirmed light editorial direction and a fresh concept in that style. System fonts replace raster-generated lettering; exploration status labels are intentional additions for factual accuracy.
