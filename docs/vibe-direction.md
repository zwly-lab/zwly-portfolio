# Vibe Coding presentation — 2026-10-12

THESIS: A personal collection of applications, interactive experiments and visual works built through AI collaboration. Show the work and the creator's decisions.

OWN-WORLD: Extend the confirmed Style B: white, charcoal, forest green, self-hosted Archivo with Chinese system fallback, fine rules and original media. No avatar, fake console, invented metrics or ambient particle background.

STORY: Portfolio identity and mixed overview → selected applications → one real interactive example → visual series → selected writing → the creator's approach. Product walkthroughs remain in case pages.

FIRST VIEWPORT: Vibe Coding is the heading, with Chinese purpose and AI collaboration stated. Desktop has the JD interface beside PyScreen and an original travel artwork. Mobile keeps one readable preview and two descriptive entry links. All three directions are visible without choosing a tab.

FORM: This extends the existing approved composition and visual world, rather than an open concept tournament. Four direction choices retain shared previews as they move between compositions. Motion follows selection, ends in a stable state and is interruptible; reduced motion updates immediately. No autoplay. The existing filter, gallery and disclosure mechanisms remain.

Quality calibration: Lovable's Editorial/Green portfolio structures, Rick Rubin's The Way of Code collection, 8bit AI (Awwwards SOTD), Bézier (Webby Best Visual Design – Function), Stefan Vitasović Portfolio25 (FWA of the Day). These inform craft, not copied layout/media. Source URLs and exact award status are in design-references.md.

Questions skipped: the user confirmed identity, Style B, no avatar, reference scope and direct implementation; no unsettled product claim requires a new interview. Build and review use the current approved website as their visual authority.

## Requested text, page and image motion

Focal moment: the existing retained-preview direction change remains the main interaction; original visual prints unfold within their frames as that part of the collection enters view.
Continuity: one entry controller connects the heading (480ms), immediate summary (40ms offset) and homepage overview (80ms offset), without delaying navigation or moving the page layout. Interaction cancels entry before selection; shared previews, filters and highlights use 300ms. Gallery images keep their aspect ratio and an existing thumbnail while loading; 180ms departure releases the panel and backdrop together, preserving native return focus.
Feedback: work/note titles gain a fine underline on hover/focus; preview images enlarge 1.8% on fine pointers or keyboard focus inside their existing composition.
Budget: native Web Animations and CSS only, no perpetual loops or new dependency. Scroll-linked masking is limited to two homepage prints and falls back to static full imagery. Reduced motion removes spatial effects and keeps selection, underline and action states.

Page handoff: installed React ViewTransition connects the entire old and new route content, preserving the old viewport geometry. Departure takes 180ms, followed by a 300ms arrival. Direct-load heading entry stays separate, and route changes do not replay it. Navigation stays outside the named boundary for rapid choices. In-page anchor scrolling stays smooth; route changes and browser history restore positions directly. Direction/step/demo explanations, gallery closing, featured-note imagery and about-page linked imagery complete the same feedback language.
