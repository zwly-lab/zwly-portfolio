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

The main container is capped at 1288px and subtracts 104px from the viewport; at 760px and below it subtracts 48px. The homepage hero uses a `.85fr / 1.3fr` editorial split. Its showcase uses a `1.8fr / 1fr` composition with a larger first preview and compact secondary entries. The default “精选一览” contains JD, PyScreen, and the travel artwork, while four controls switch among mixed, interaction, application, and visual directions.

Shared previews retain their geometry during selection changes through a 280ms native Web Animations transition. On mobile, the hero becomes one column: the first work keeps a readable image and later works become 48px-high text links, so all directions remain reachable without squeezing three thumbnails into the viewport.

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

The wordmark and compact horizontal links share the Archivo stack. Current, hovered, and keyboard-focused routes use forest green and a fine underline. The navigation stays on one row through 440px and wraps only below 350px.

### Directional Overview

The signature overview offers four text choices and reuses preview identity by image source. The first mixed view shows JD, PyScreen, and travel work together. When a selection keeps an existing preview, its old and new bounds drive the 280ms geometry transition; new previews arrive with a light opacity-and-clip reveal. Reduced-motion users receive the final composition immediately, and a new selection cancels the previous animation before measuring the next one.

### Process Spotlight

The task, code, and result steps share one overlay with fixed base geometry. State classes preserve that approved geometry by applying `translateX(...) scaleX(...)`; only `transform` transitions for 280ms with the arrival easing. Reduced-motion browsers remove the transition.

### Page and Image Motion

- **Route title:** On each pathname change, the first `h1` inside `#main-content` reveals from `clip-path: inset(0 12% 0 0)` to no inset over 320ms with the arrival easing. The native Web Animation is skipped when no heading exists or reduced motion is already active, and is cancelled on route cleanup or a motion-preference change.
- **Linked titles:** Project, note, featured-note, note-list, and article-navigation titles keep a transparent one-pixel underline at rest. Hover and keyboard focus reveal the underline in the current text color while the existing 140ms color and 220ms decoration feedback run.
- **Preview images:** Work, note, poster, and overview previews scale to `1.018` over 280ms. Keyboard focus enables the response; pointer hover enables it only for fine pointers that support hover. The effect exists only when reduced motion is not requested.
- **Home visual prints:** The two `.visual-print` images use native CSS view timelines to unfold from `clip-path: inset(8% 6%)` to no inset across `entry 15%` through `entry 100%`. Browsers without the required `animation-timeline` and `animation-range` support keep the images static, and reduced-motion users receive no animation.

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
