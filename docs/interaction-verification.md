# Interaction verification — 2026-10-11

Target: the local `work/portfolio-ux` checkout, production build served at `http://127.0.0.1:3107`. This is not a production deployment verification.

## Executed checks

- `npm run build`, `npm run lint`, `npm run typecheck`: passed after the final CSS correction; lint has no warnings.
- `node --test tests/renderer.test.mjs`: passed the existing canvas visibility check.
- `node tests/smoke.mjs http://127.0.0.1:3107`: passed 17 pages, metadata/visual previews/styles/links, three missing routes, demo/media files, 18 gallery images and WebAssembly/PNG validation.
- Impeccable detector on the changed UI targets: returned an empty finding list.

Real-browser assertion checks were executed through Codex browser controls, not synthetic application events:

| Scenario | Expected result | Observed |
| --- | --- | --- |
| Filter teaching → visual → tools → all | 4 → 1 → 4 → 9 cards; final selection and result count agree | Passed |
| Homepage KMP → poster → keyboard-select Python | Preview routes match each selection; title and image follow | Passed |
| Open first gallery image | Native modal opens; previous is disabled | Passed |
| Click next, then ArrowRight | Position becomes 3 / 18 | Passed |
| Tab from close into modal controls | A modal control receives focus | Passed |
| Escape after gallery navigation | Modal closes; original trigger receives focus | Passed |
| Reopen last gallery image | Next is disabled; explicit close works | Passed |
| Open/close native note disclosure | Open attribute, visible label and chevron agree; Enter closes | Passed |
| Follow note section anchor | Hash and current-directory entry agree after smooth scrolling settles | Passed |
| 390 × 844 viewport | Homepage, work grid and note do not overflow horizontally | Passed |
| Final mobile filter layout | All four filters share the same row | Passed |
| Final mobile gallery bounds | Dialog is inside viewport with positive top/left margins | Passed |
| Emulated reduced motion | Gallery image has zero running animations; hero animation is none; shared underline transition is 0s; Escape still closes | Passed |

Desktop and mobile screenshots were inspected in one initial pass plus a correction pass. The initial mobile modal sat at the upper-left because the reset removed its automatic margins; explicit fixed positioning, fit-content height and automatic margins now center it. Temporary viewport and reduced-motion overrides were reset after verification.

## Limits

No physical phone, Safari/Firefox, screen reader, GPU profiling or public Vercel deployment was tested. Native details still works where the optional size-animation CSS is unsupported. Resource entry pages were read, but not every external demo/video was played or its source licensed. Existing unrelated local edits remain intact. No commit, push or deployment was performed.
