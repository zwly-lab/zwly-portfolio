# ZWLY Lab Portfolio

- Next.js App Router, TypeScript, Tailwind CSS. Keep the light editorial visual language: white background, charcoal typography, green emphasis, fine rules, generous whitespace.
- Page routes live in `src/app`; shared UI in `src/components`; editable content in `src/data`.
- Keep project exploration status explicit. Do not invent demos, screenshots, personal metrics, contact addresses or completed capabilities.
- Use existing components and CSS tokens. Add a dependency only when the requested behavior needs it.
- Validate with `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test` against a running production build. Check desktop and mobile in a real browser for UI changes.
- `main` is the intended Vercel production branch. External publishing and Git writes require matching user authorization.
- Keep secrets, `.env*`, `.vercel`, build output, dependency folders and QA scratch files out of Git.
