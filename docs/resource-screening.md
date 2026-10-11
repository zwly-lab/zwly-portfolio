# Resource screening and site-wide application

Reviewed 2026-10-11 from the Second Brain's `优质外部工具与资源导航` and `UI交互动效设计清单`, read through Basic Memory. Source notes are unchanged. This pass requested 20 resource entry URLs, followed three Animata component pages, and inspected pinned GitHub source and browser API documentation. Reading a directory is not verification of every component, animation video, or license it links to.

| Resource | Evidence / suitability | Applied or excluded |
| --- | --- | --- |
| [Animata](https://animata.design/components) | Component directory, then Fluid Tabs, Slide Arrow Button and Case Study Card docs | Selection continuity and media-first presentation; reference only, no source copied |
| [Motion Primitives](https://motion-primitives.com) | Site returned 403; GitHub source and license were read instead | Adapted single shared selection background into `ActiveUnderline`; no Motion dependency |
| [React Bits](https://reactbits.dev/get-started/index) | Text, image, gallery and interactive component directory | Compared gallery and text effects; excluded WebGL and cursor effects from this refinement |
| [Magic UI](https://magicui.design/) | Component entry page | Preserve previously adapted portfolio cards; no additional packages |
| [Aceternity UI](https://ui.aceternity.com/components) | Direction-aware interaction, expandable cards, stateful controls and layout directory | Directional image navigation as a design reference; no source or commercial blocks copied |
| [Cult UI](https://www.cult-ui.com/docs) | Direction Aware Tabs, Morph Surface, Expandable Screen directory | Compared continuity patterns; no source copied |
| [MicroInteractions UI](https://www.microinteractionsui.com) | Short entry page | No sufficiently inspected implementation selected |
| [Amicro](https://amicro.vercel.app/) | Fetch did not produce usable content | Excluded from current implementation evidence |
| [Minimal Gallery](https://minimal.gallery/) | Portfolio, editorial, personal and gallery index | Keep generous whitespace and artwork emphasis; no third-party assets copied |
| [Navbar Gallery](https://www.navbar.gallery/) | Static/sticky navigation and pattern directory | Keep visible lightweight navigation, add a shared current-page underline |
| [Footer Design](https://www.footer.design/) | Footer reference directory | Retain concise contact ending; apply global link feedback rather than add a large duplicate footer |
| [Component Gallery](https://component.gallery/) | Component reference directory | Preserve native semantics and existing component responsibilities |
| [Landing Love](https://www.landing.love/) | Minimal and portfolio categories, recording-based inspiration | Reference index only; recordings were not watched or downloaded |
| [Fluid Functionalism](https://www.fluidfunctionalism.com/) | Tabs, accordion, dialog and purposeful state feedback | Unified selection, disclosure and dialog feedback; no source copied |
| [DialKit](https://www.dialkit.dev/) | Real-time tuning tool with a runtime dependency | Not installed: fixed site timings do not need a tuning interface |
| [Simply Buttons](https://simply-buttons.vercel.app/) | Fetch returned no readable body | No source selected |
| [Lucide](https://lucide.dev/guide/static) | Official static SVG documentation and pinned icon/license source | Reused chevron-down geometry for the native disclosure; retained complete ISC and Feather MIT notices |
| [Phosphor](https://phosphoricons.com/) | JavaScript-only catalog entry | Avoid mixing another icon family with existing strokes |
| [shadcn Accordion](https://ui.shadcn.com/docs/components/accordion) | Disclosure composition and state documentation | Reference only; existing native details is sufficient for one example |
| [shadcnblocks](https://www.shadcnblocks.com/) | Layout/block directory | Reference only; no paid blocks, fabricated testimonials or new marketing sections |

## Implementation and provenance

- `ActiveUnderline` adapts the active-id/single absolute selection-background structure in [ibelick/motion-primitives, animated-background.tsx](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/animated-background.tsx). Local geometry and CSS transitions replace `motion/react`, child cloning and generic options. The same component serves the global navbar, homepage preview choices, work filters and article section navigation. Complete notice: `licenses/motion-primitives-MIT.txt`.
- The disclosure uses [Lucide chevron-down](https://github.com/lucide-icons/lucide/blob/70562c1ee1c4fdcf736fe97bc893fb8511927934/icons/chevron-down.svg), matching the site's existing 1.5px stroke. Complete notices, including its Feather derivation: `licenses/lucide-ISC-MIT.txt`.
- Work filtering keeps keyed cards and measures before/after positions. Native [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate) animates retained positions and new cards. Repeated selections cancel superseded animation without retaining transforms.
- The gallery keeps native `dialog` focus containment and restoration. A measured thumbnail-to-image transform is the focal interaction; closing reverses toward the currently viewed thumbnail when visible, otherwise fades out. Buttons and arrow keys share bounded navigation. No custom focus trap or external modal library is introduced.
- Native [details content](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::details-content) uses an optional CSS size transition. Unsupported browsers retain working native disclosure. The state label and chevron change together.
- Every route shares navigation, link, button and card feedback. About-page image links and adjacent-note links receive the same visual feedback. Homepage previews reuse existing assets and factual titles; product data, descriptions, demos and public notes stay intact.

Motion budget: 140ms immediate feedback, 220ms routine changes and image navigation, 320ms selection/layout, 400ms image expansion. Reduced motion removes spatial animations, retains clear selection and native interactions, and restores immediate close. No loops, autoplay, scroll hijacking, shaders, analytics or runtime dependencies are added.

Implementation is scoped to the `work/portfolio-ux` checkout and does not overwrite the other local checkout. Commit and production deployment were subsequently authorized by the user; publishing must preserve newer upstream changes and verify the exact release.
