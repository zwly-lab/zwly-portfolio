---
name: ZWLY Lab — Vibe Coding Portfolio
description: A light editorial collection of applications, interactive experiments, and visual work built through AI collaboration.
colors:
  paper-white: "#fff"
  charcoal-ink: "#202621"
  forest-green: "#345646"
  quiet-copy: "#626c66"
  fine-rule: "#dce0da"
  soft-field: "#eef2ec"
  media-field: "#f3f4ef"
typography:
  display:
    fontFamily: "var(--font-archivo), PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(48px, 5.3vw, 76px)"
    fontWeight: 580
    lineHeight: 1.15
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "var(--font-archivo), PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(40px, 4.6vw, 64px)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.03em"
  title:
    fontFamily: "var(--font-archivo), PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "29px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "-0.025em"
  body:
    fontFamily: "var(--font-archivo), PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-archivo), PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.035em"
  link:
    fontFamily: "var(--font-archivo), PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
rounded:
  spotlight: "14px"
  spotlight-mobile: "8px"
components:
  button-primary:
    backgroundColor: "{colors.forest-green}"
    textColor: "{colors.paper-white}"
    rounded: "0"
    padding: "10px 20px"
    height: "44px"
  direction-choice:
    backgroundColor: "transparent"
    textColor: "{colors.quiet-copy}"
    typography: "{typography.label}"
    rounded: "0"
    padding: "8px 0"
    height: "44px"
  direction-choice-selected:
    backgroundColor: "transparent"
    textColor: "{colors.forest-green}"
    typography: "{typography.label}"
  text-link:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal-ink}"
    typography: "{typography.link}"
    rounded: "0"
    padding: "10px 0"
    height: "44px"
  overview-preview:
    backgroundColor: "{colors.media-field}"
    textColor: "{colors.charcoal-ink}"
    rounded: "0"
    height: "310px"
---

# Design System: ZWLY Lab — Vibe Coding Portfolio

## Overview

**Creative North Star: "The Working Collection"**

The site presents Vibe Coding as a considered body of finished and in-progress work. Its white editorial field, charcoal type, restrained forest-green emphasis, fine rules, and generous whitespace keep real interfaces and original artwork ahead of decorative effects.

The world is quiet but active: selection, disclosure, and gallery motion explain a state change and then settle. It avoids avatars, fake consoles, invented metrics, ambient particles, and decorative device renders. Claims stay attached to visible work and explicit evidence boundaries.

**Key Characteristics:**

- Light editorial surfaces with forest-green interaction emphasis.
- Real applications, interactive experiments, and original visual work share one collection.
- Stable media geometry and native controls make state changes legible.
- Chinese-first copy uses self-hosted Archivo with system Chinese fallbacks.

## Colors

The palette is deliberately narrow: `paper-white` and pale fields carry content, `charcoal-ink` and `quiet-copy` establish hierarchy, `fine-rule` separates real content changes, and `forest-green` marks emphasis and interaction.

### Primary

- **Forest Green:** Reserved for selected states, focus outlines, active rules, links, and the highlighted word in the hero.

### Neutral

- **Paper White:** The page and component ground.
- **Charcoal Ink:** Primary text and high-confidence labels.
- **Quiet Copy:** Supporting descriptions, metadata, and unselected controls.
- **Fine Rule:** One-pixel separators, frames, and resting underlines.
- **Soft Field:** Footer and demo-stage backing.
- **Media Field:** A calm neutral mat behind screenshots in the homepage overview.

**The Green as Evidence Rule.** Use green to show selection, focus, or a meaningful route into the work; it is not a decorative wash.

**The Canonical Color Rule.** The frontmatter hex values are the normative runtime colors. Tonal ramps in `.impeccable/design.json` are optional synthesized UI-editor preview metadata, not application tokens.

## Typography

**Display Font:** Archivo (with PingFang SC, Microsoft YaHei, sans-serif fallback)

**Body Font:** Archivo (with PingFang SC, Microsoft YaHei, sans-serif fallback)

**Character:** A single variable sans family keeps Chinese and Latin text direct and contemporary. Weight, scale, line-height, and muted color create the editorial hierarchy instead of a second display face.

### Hierarchy

- **Display** (580, `clamp(48px, 5.3vw, 76px)`, 1.15): The Vibe Coding hero identity; mobile uses `clamp(42px, 11.6vw, 64px)`.
- **Headline** (500, `clamp(40px, 4.6vw, 64px)`, 1.3): Page-level headings outside the hero.
- **Title** (500, 29px, 1.5): Section and collection headings; nearby contexts tune this between 23px and 36px.
- **Body** (400, 16px, 1.85): Explanations and narrative copy; reading layouts are bounded to 720–760px.
- **Label** (400, 13px, 0.035em tracking): Metadata, section labels, and compact selection controls.

**The One Family Rule.** Keep Archivo and the established Chinese fallbacks across display, body, labels, and controls; create hierarchy with the existing scale rather than introducing another typeface.

## Layout

The main container is capped at 1288px and subtracts 104px from the viewport; at 760px and below it subtracts 48px. The homepage hero uses a `.85fr / 1.3fr` editorial split. Its showcase uses a `1.3fr / 1fr` composition, with 150px secondary media frames giving interaction and visual work more presence. The default “精选一览” contains JD, PyScreen, and the travel artwork, while four controls switch among mixed, interaction, application, and visual directions.

Shared previews retain their geometry during selection changes through a 560ms native Web Animations transition. On mobile, the mixed overview gives the first work a full-width image and retains two smaller image previews underneath, with 48px-high title links. Other directions retain a main image and secondary text links. The mobile collection opening is compact enough to show its first work image and title together at 360px and 390px widths.

Cases place detailed scope and technology facts after leading media. Notes use a shorter opening and a crop of the real completed merge; original screenshots remain available in the actual demonstration. The about page anchors its approach in real PyScreen error and recovery records. Preview crops change composition only, not the original media bytes or claims.

The homepage live demo remains a stable `1fr / 1.3fr` two-column region on wide screens and collapses to one column at 760px. Its intro and fallback screenshot are visible while the embedded demo is closed; opening the demo changes only the stage content. Collection grids move from three columns to two at 1050px and one at 760px. The compact navigation tightens at 440px and wraps only below 350px.

## Elevation & Depth

The system uses no box shadows. Depth comes from white and pale tonal fields, one-pixel rules, media cropping, and changes in scale. Focus remains explicit with a two-pixel forest-green outline and six-pixel outline offset.

**The Flat by Default Rule.** Keep surfaces flat at rest; use rules, spacing, and tonal fields to express structure.

## Shapes

Most containers, media, controls, and cards are square-edged. Fine borders frame screenshots and demo stages. Focus uses the global two-pixel outline and six-pixel offset; its width is not a corner-radius token. The process spotlight is the deliberate exception: 14px on desktop and 8px on mobile, where it behaves as an annotation over real interface evidence.

## Components

### Buttons

- **Primary action:** A square forest-green button with white text, 10px × 20px padding, and a 44px minimum height. Hover and active states reduce opacity to .85 and .7.
- **Direction choice:** A transparent 13px label with a 44px minimum height. Unselected text is quiet; hover, focus, and `aria-pressed="true"` turn the label and bottom rule green.
- **Focus:** All buttons use the global visible outline; focus is never communicated by color alone.

### Links

- **Text link:** A 44px-high inline route with a fine resting underline. Hover and keyboard focus draw the green underline from left to right and may move the arrow 2px up and right.
- **Reduced motion:** The underline and arrow update without transition when reduced motion is requested.

### Cards / Containers

- **Work card:** Flat, square, and separated by a fine bottom rule. Its heading turns green and its media border becomes green on hover or keyboard focus; pressed cards reduce opacity.
- **Content order:** Work cards lead with title and description, then place category/status and the arrow below them. Note cards lead with title and summary, then place note type/date and the arrow below them; neither card uses eyebrow metadata above its title.
- **Media container:** Real screenshots use a pale field, `object-fit: contain`, and a fine border where the surrounding context needs a frame. Phone and desktop evidence keep their own proportions.
- **Live demo stage:** A fine bordered soft field shows the real KMP screenshot until the user opens the iframe. Ready, loading, and error copy occupies a bordered status row without changing the surrounding introduction.

**The Identity Before Metadata Rule.** Put the work or note title and its summary before category, status, note type, date, or technology metadata.

### Navigation

The wordmark and compact horizontal links share the Archivo stack. Current, hovered, and keyboard-focused routes use forest green and a fine underline. The white navigation remains available at the top while browsing; article anchors reserve space below it. The navigation stays on one row through 440px and wraps only below 350px.

### Directional Overview

The signature overview offers four text choices and reuses preview identity by image source. The first mixed view shows JD, PyScreen, and travel work together. Requested choices respond immediately while the existing decoded previews remain usable. Next.js responsive image props prepare the destination images before the composition changes; only the latest request can commit, and a failed load retains the previous view with retry feedback. The stage reserves a consistent height across directions. Mobile also retains the second image instead of a text-only preview.

When a selection keeps an existing preview, its old and new bounds drive the 560ms geometry transition with a top-left transform origin. New previews and their captions unfold together over 560ms after 40ms, from an 18% bottom inset and an 8px offset. A new selection measures the current animated geometry, opacity and clipping before cancelling it, so interrupted movement continues from the visible state. The filtered collection uses the same interruption principle with 560ms arrivals and sibling delays capped at 60ms. Reduced-motion users receive decoded final compositions without spatial animation; loading, failure and action feedback remain explicit.

### Process Spotlight

The task, code, and result steps share one overlay with fixed base geometry. State classes preserve that approved geometry by applying `translateX(...) scaleX(...)`; only `transform` transitions for 460ms with the arrival easing. Reduced-motion browsers remove the transition.

### Page and Image Motion

- **Timing:** CSS owns 140ms immediate feedback, 220ms small disclosures/decoration, 460ms routine layout changes, 560ms image compositions and entrances, and 180ms departures. Native animations read these tokens with both seconds and milliseconds supported. Arrivals use `cubic-bezier(.22, .68, .24, 1)`; departures use `cubic-bezier(0.4, 0, 1, 1)`.
- **Homepage opening:** A lightweight pale cover and the real ZWLY Lab wordmark appear before hydration. Once ready, the opposing cover rows withdraw, the centered wordmark becomes the header wordmark, wrapped title lines reveal, and navigation/introduction/content arrive within one 2400ms scene. Three real works start as one centered stack, expand toward the measured showcase region, and land in their original frames. The real page remains frontal, sharp and unframed; the works clear readable text as the cover opens. Preparation decodes images, settles the local font and warms the homepage-only Three.js renderer before the shared scene clock starts. An 8000ms readiness watchdog handles unavailable resources; a visible, keyboard-accessible skip button and all normal input release the cover immediately. Loading time does not consume playback. Input cancels pending or active motion and cannot trigger a late takeover. The signature and all owned CSS/native animations share one epoch. Opposing row scale and masked 105%-to-zero title translation are adapted from Codrops CoverPageTransition (MIT), without GSAP or SplitType. Native transforms remain the single motion source and CSS fallback: synchronized 2220ms travel, 8-degree local tilt, 72px depth spacing (48px mobile), bounded scale/spread. WebGL 2 adds a 10px extruded body, 12px rounded corners, a fine bevel, restrained clearcoat, an area light and one directional shadow map. Emissive screenshot surfaces preserve the original colors under lighting. The transparent canvas matches the actual CSS perspective surface and image crops; lighting, thickness and shadow blend in on lift and away before the <1px DOM handoff. Pixel ratio is capped at 1.5 (1.25 mobile), with 1024px/512px shadow maps. Renderer chunks load alongside homepage scripts; textures and shaders warm before playback and no new shader variant compiles during landing. GPU resources and context are disposed after completion/interruption; context loss resumes matching CSS positions. Reduced motion, no JavaScript, direct/history/hash browsing and ordinary route transitions keep their established paths. A separate 3100ms running watchdog releases a stalled scene.
- **Page navigation:** React 19.3 ViewTransition covers route content while navigation and footer remain outside the named boundary. Old content departs over 180ms, then new content arrives over 460ms with a single 6px offset and 12px bottom reveal. The old snapshot retains its original width and viewport position, including scroll offset; the group settles to destination geometry immediately instead of morphing a whole page's height. Route changes do not replay the heading entrance. Native routing owns prefetch, history, errors and cancellation; no links are intercepted.
- **Scrolling:** Smooth scrolling is limited to in-page targets. Next's `data-scroll-behavior` marker allows route navigation to override it. Adjacent articles use `#top`; browser history retains the reading position. Scroll restoration and snapshot motion do not compete.
- **State explanations:** Direction, product-step and live-demo status text update immediately and arrive over 220ms. The closed demo screenshot uses the same short arrival without retaining an invisible iframe. Gallery series use native details height interpolation in both directions when supported, with a static native fallback.
- **Selection underline:** First placement is immediate. Selection markers measure the text label, stay centered, and extend 4px beyond each side, independent of the larger click target. Navigation, direction choices and collection filters share this geometry. Subsequent selection changes travel for 460ms.
- **Gallery:** A single displayed order drives series rendering, image navigation and the 1–18 counter, including collapsed variants and archived concepts. A viewport-bounded stage keeps the panel and toolbar/controls stable across portrait and landscape artwork. The original aspect ratio and viewport-bounded width reserve image geometry before decoding. The existing responsive thumbnail fills that frame until the full image loads. Opening uses 560ms; image navigation uses 460ms. Closing preserves the current transform and opacity and takes 180ms, together with backdrop, panel and control departure. An unchanged image returns to its visible opener; a changed image fades, preserving the native dialog's return focus to the original opener.
- **Live motion preference:** Switching to reduced motion cancels in-flight page animations as well as CSS effects; an interrupted gallery close still releases the modal and restores focus. Embedded teaching runtimes retain their separate, user-controlled educational timing.
- **Linked titles:** Project, note, featured-note, note-list, and article-navigation titles keep a transparent one-pixel underline at rest. Hover and keyboard focus reveal the underline in the current text color while the existing 140ms color and 220ms decoration feedback run.
- **Preview images:** Work, note, poster, overview, featured-note and linked about-page previews scale to `1.018` over 460ms. Keyboard focus enables the response; pointer hover enables it only for fine pointers that support hover. The effect exists only when reduced motion is not requested.
- **Home visual prints:** The two `.visual-print` images use native CSS view timelines to unfold from `clip-path: inset(8% 6%)` to no inset across `entry 15%` through `entry 100%`. Browsers without the required `animation-timeline` and `animation-range` support keep the images static, and reduced-motion users receive no animation.
- **Collection focus:** Hover on a fine pointer or keyboard focus keeps the selected work preview clear and lowers only neighbouring media opacity. Titles, descriptions and controls retain their normal contrast.
- **Mobile visual series:** The three featured series become native horizontal snap rails at 760px and below, with a partial next preview, real scroll-position count, previous/next controls and Home/End/arrow navigation. Equal-height paper frames contain each original aspect ratio without cropping and keep captions near the controls. Desktop, variants and archived concepts retain their grids. Reduced motion changes position immediately; opening and closing a picture retains the original trigger focus.
- **Demo action:** The same button changes from opening to cancel-loading, collapse or return-to-preview according to the real iframe state. It reserves label width and uses the existing short arrival; there is no simulated progress. The desktop visual introduction stays within its own section while the two prints unfold.
- **Clickable feedback:** Actual links, enabled buttons and disclosures acknowledge a press with short opacity feedback and stable hit targets. Disabled and `aria-disabled` buttons receive no enabled press effect. Text links and arrows respond to keyboard focus as well as hover; visual-print entrances use opacity and a linked caption underline, leaving their scroll-driven clipping independent.

These additions use native Web Animations and CSS only; they add no runtime dependency.

## Do's and Don'ts

### Do:

- **Do** lead with real interfaces, operable demos, original visual work, and clearly labeled historical or exploratory material.
- **Do** keep the white, charcoal, forest-green, Archivo, fine-rule, and generous-whitespace identity across new surfaces.
- **Do** preserve keyboard states, native dialog focus and Escape behavior, interruptible selection motion, and immediate reduced-motion updates.
- **Do** keep source references in `docs/design-references.md` and reuse notices in `licenses/`.
- **Do** treat desktop and mobile rendering, demo ready/error states, rapid image changes, gallery focus restoration, and reduced motion as verification boundaries.

### Don't:

- **Don't** invent roles, prompts, metrics, clients, testimonials, or completed outcomes that the visible work cannot support.
- **Don't** add an avatar, fake console, ambient particle background, autoplay, or decorative device mockup.
- **Don't** replace distinct phone, desktop, visual-series, and reading proportions with one uniform media box.
- **Don't** treat reference-site permission as permission to reuse external articles or media.
