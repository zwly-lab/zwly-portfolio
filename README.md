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

The Campus Takeout entry is being iterated; AI Writing Coach and AI Agent Lab are explicitly exploration directions. The two initial notes describe this portfolio's first version. Add real screenshots and public demos when available. No fabricated metrics, email address or demo links are included.

## Validate

```sh
npm run lint
npm run typecheck
npm run build
npm run start
# In a second terminal:
npm test
```

The smoke test checks 9 routes, metadata, stylesheet availability, contact links and 3 missing routes. It can check a deployment with `npm test -- https://your-project.vercel.app`.

GitHub Actions runs install, lint, types, build and the production smoke test on pushes to `main` and pull requests. Actions are pinned to immutable revisions. Browser checks cover actual navigation and widths of 1440, 971, 390 and 320 pixels.

## Vercel

Use the Next.js preset, repository root, Node.js 24, `npm ci` and `npm run build`. No environment variables, database or paid domain are required. The intended production branch is `main`; when the Git connection is enabled, Vercel handles branch previews and production deployments. Use the generated `.vercel.app` address.

Keep credentials and `.vercel` metadata out of Git. Production publishing should follow the matching user authorization.

## Known limits

This version does not include a CMS, contact form, visitor analytics or large animation/UI dependencies. Content is deliberately maintained in TypeScript files.

As of 2026-10-11, `npm audit --omit=dev` reports no known vulnerabilities. The full audit reports 5 high-severity entries in the development-only ESLint → fast-glob → micromatch → braces chain (GHSA-vfj7-8cjw-p6xm). The latest braces release is still 3.0.3, within the advisory range; npm suggests a breaking framework-lint downgrade, which is not applied. Recheck upstream patches when updating tooling.

The original Style B image was not retained in the referenced conversation. The implementation follows the explicitly confirmed light editorial direction and a fresh concept in that style. System fonts replace raster-generated lettering; exploration status labels are intentional additions for factual accuracy.
