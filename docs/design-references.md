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
