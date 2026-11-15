---
name: Polytope
description: A construction kit and design language for academic sites, paper pages, and research demos, set as a hands-on mathematics exhibition.
colors:
  exhibit-black: "#141414"
  gallery-white: "#FFFFFF"
  gallery-wall: "#EEF0EF"
  hairline-gray: "#D9DAD6"
  caption-gray: "#4A4A47"
  quiet-gray: "#6B6B66"
  panel-chalk: "#F6F7F6"
  panel-gray: "#B9BAB4"
  tomato: "#D9412B"
  tomato-ink: "#B8321F"
  tomato-bright: "#F0654F"
  mustard: "#E9A81C"
  mustard-light: "#F2B83A"
  mustard-soft: "#FBEFD2"
  teal: "#0F6E73"
  teal-light: "#5CC2C7"
  cobalt: "#3A62C4"
  cobalt-light: "#95AEE3"
  after-hours-ground: "#161615"
  after-hours-panel: "#262624"
  after-hours-chalk: "#F2F2EE"
  viz-teal: "#009B93"
  viz-grass: "#4C8C2B"
  viz-sky: "#2E8FD0"
  viz-mustard: "#C28A0A"
  viz-plum: "#9A3E96"
  viz-pink: "#E06C91"
  status-good: "#1E7A3C"
  status-warning: "#F2B71F"
  status-serious: "#E8743B"
  status-critical: "#B3261E"
typography:
  display:
    fontFamily: "Ultra, Ultra Fallback, Ultra Fallback Serif, Georgia, serif"
    fontSize: "clamp(3rem, 1.6rem + 4.4vw, 5.75rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Ultra, Ultra Fallback, Ultra Fallback Serif, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  wordmark:
    fontFamily: "Ultra, Ultra Fallback, Ultra Fallback Serif, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1
  title:
    fontFamily: "Libre Franklin Variable, Libre Franklin Fallback, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Libre Franklin Variable, Libre Franklin Fallback, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Libre Franklin Variable, Libre Franklin Fallback, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  ui:
    fontFamily: "Libre Franklin Variable, Libre Franklin Fallback, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Libre Franklin Variable, Libre Franklin Fallback, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.3
  mono:
    fontFamily: "JetBrains Mono Variable, JetBrains Mono Fallback, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.7
    fontFeature: "liga 0"
rounded:
  none: "0"
  ball: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4rem"
  "9": "6rem"
  "10": "8rem"
components:
  button-primary:
    backgroundColor: "{colors.exhibit-black}"
    textColor: "{colors.gallery-white}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.tomato-ink}"
    textColor: "{colors.gallery-white}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.exhibit-black}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "2.75rem"
  button-secondary-hover:
    backgroundColor: "{colors.exhibit-black}"
    textColor: "{colors.gallery-white}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.exhibit-black}"
    rounded: "{rounded.none}"
    padding: "0 0.75rem"
    height: "2.75rem"
  button-ghost-hover:
    backgroundColor: "{colors.gallery-wall}"
  input:
    backgroundColor: "{colors.gallery-white}"
    textColor: "{colors.exhibit-black}"
    rounded: "{rounded.none}"
    padding: "0 0.75rem"
    height: "2.75rem"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.caption-gray}"
    padding: "0 0.75rem"
    height: "2.25rem"
  tab-current:
    backgroundColor: "{colors.exhibit-black}"
    textColor: "{colors.gallery-white}"
  wall-label:
    backgroundColor: "{colors.exhibit-black}"
    textColor: "{colors.gallery-white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.2rem 0.5rem"
  note:
    backgroundColor: "{colors.mustard}"
    textColor: "{colors.exhibit-black}"
    rounded: "{rounded.none}"
    padding: "1rem 1.5rem"
    width: "36rem"
  exhibit-panel:
    backgroundColor: "{colors.exhibit-black}"
    textColor: "{colors.panel-chalk}"
    rounded: "{rounded.none}"
    padding: "1.5rem"
  code-block:
    backgroundColor: "{colors.exhibit-black}"
    textColor: "{colors.panel-chalk}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "1rem 1.5rem"
    width: "36rem"
---

# Design System: Polytope

## Overview

**Creative North Star: "A World of Numbers"**

Polytope is set as a hands-on mathematics exhibition, after the 1961 exhibition by Charles and Ray Eames. The page is a white gallery. Content hangs on it in exhibit-black panels, regions are divided by heavy 3px rules, titles are cut in wood type, and every chapter opens with a working model the reader can run. The models are real: the emblem is a Vietoris-Rips complex whose radius the reader drags, and a Galton board drops balls live and settles into a bell curve.

Color is scarce and each color has one job. Tomato marks the current location and the moving part. Mustard marks notes and always carries black text. Teal marks links and links are always underlined. Everything else is black, white, and gallery gray. Density is calm: a 36rem reading column, wide gutters, generous space between sections, with tables and code held to the same edge as the prose.

Corners are square. The only round things are things that are round in the world: balls, points, radio buttons, status dots. Depth comes from black panels against white and from heavy rules; shadows appear only under layers that float above the page. Dark mode is the exhibition after hours: the ground goes near black and panels sit one step lighter than the ground.

**Key Characteristics:**
- White gallery ground, exhibit-black panels, 3px black rules between regions.
- Ultra wood-type titles in sentence case ending in a tomato full stop.
- Tomato for where you are and what moves; mustard for notes; teal for links.
- Square corners everywhere except balls and points.
- A working model in a black panel with a wall-label caption opens every chapter.
- A Vietoris-Rips complex is the emblem: it opens the home page and draws the favicon.
- One signature moment of motion per page; reduced motion shows the end state.

## Colors

A gallery palette: black, white, and gray carry the page, and three strong colors each mark one kind of thing.

### Primary
- **Tomato** (`tomato`): the moving part. Fills the current-location point in the sidebar and in an article's on-this-page rail, the small ball between a post's date and reading time, the balls in the probability machine, the hovered vertex of the complex and its dashed reach, the current place on the Atlas with its dashed reach and the trail it leaves along the route, the full stop after titles and the wordmark, the picked radio ball, the switch ball when on, the slider thumb, list markers, sidenote and affiliation numbers, and, as tomato ink, the hover fill of primary buttons. It is a fill color. When tomato has to be read as text (field errors, the hovered pager title) use **Tomato Ink** (`tomato-ink`). In dark mode the accent becomes **Tomato Bright** (`tomato-bright`).

### Secondary
- **Mustard** (`mustard`): notes, highlights, text selection, the `mark` element, the machine funnel, the filled triangles of the complex, the countries that hold a place on the Atlas, and the copied state of the copy button. It always carries exhibit-black text in both themes. **Mustard Soft** (`mustard-soft`) is the quieter note fill in light mode. **Mustard Light** (`mustard-light`) is the focus ring inside black panels and the code comment color, so explanations read first.

### Tertiary
- **Teal** (`teal`): links and the focus ring on the light ground. Links are semibold with a 2px underline at 45 percent of the text color; on hover the text turns black and the underline turns tomato. **Teal Light** (`teal-light`) is the link color in dark mode and inside panels, and the code string color.
- **Cobalt** (`cobalt`): data only. It anchors the sequential ramp and the cool half of the diverging ramp. **Cobalt Light** (`cobalt-light`) is the code number color.

### Neutral
- **Exhibit Black** (`exhibit-black`): body text, headings, panels, code blocks, 3px rules, control borders, the current tab, wall labels, primary buttons.
- **Gallery White** (`gallery-white`): the page ground and the chart surface in light mode.
- **Gallery Wall** (`gallery-wall`): sunken surfaces such as inline code, table stripes, ghost hover, info and success notes, disabled controls.
- **Hairline Gray** (`hairline-gray`): 1px rules between table rows and list items, chart grid lines.
- **Caption Gray** (`caption-gray`): captions, metadata, secondary navigation, inactive tabs; also the hairline inside panels.
- **Quiet Gray** (`quiet-gray`): placeholders and the quietest labels, still above 4.5:1 on white.
- **Panel Chalk** (`panel-chalk`) and **Panel Gray** (`panel-gray`): text and muted text inside black panels.
- **After Hours Ground** (`after-hours-ground`), **After Hours Panel** (`after-hours-panel`), **After Hours Chalk** (`after-hours-chalk`): the dark theme ground, panel, and text. The dark panel is lighter than the dark ground so panels still read as objects.

### Data colors
Charts use eight categorical slots in a fixed order: tomato, teal, cobalt, grass, sky, mustard, plum, pink (`viz-*` tokens for light; dark values live in the sidecar). The order is validated for color vision deficiency in both themes: worst adjacent delta E 13.6 in light and in dark, 18.0 and 16.7 for normal vision. Scatter plots and small multiples use only the first three slots. Magnitude uses the cobalt ramp, with steps 3 to 7 for ordinal data. Diverging data runs cobalt to gray to tomato. Status colors (`status-good`, `status-warning`, `status-serious`, `status-critical`) are reserved for status and always appear with a shape and a word.

### Named Rules
**The One Moving Part Rule.** Tomato marks the current location and the thing that moves, and the small marks that lead the eye to them: the full stop, list markers, reference numbers. It never fills a panel or colors a paragraph.

**The Black Text on Mustard Rule.** Mustard always carries exhibit-black text, in both themes, including links inside notes.

**The Underlined Link Rule.** Links are teal and always underlined. Color alone never marks a link.

**The Mark and Word Rule.** Status and note kind are carried by a shape and a word: ball for note, triangle for warning, check for success, cross for danger. Color never carries status alone.

**The Kind Color Exception.** A site that wants the kinds of its entries told apart at a glance (study, work, and conference stops on a CV) may give each kind one color as a deliberate exception to the defaults, written down in its own PRODUCT.md. Each pair keeps 4.5:1 in both themes, the kind keeps its word, and tomato stays out of it: a tomato fill on a label breaks the One Moving Part Rule.

## Typography

**Display Font:** Ultra (with Ultra Fallback, Georgia Bold scaled to Ultra's metrics, then Ultra Fallback Serif, Liberation Serif Bold or Times New Roman Bold scaled the same way, then Georgia, serif)
**Body Font:** Libre Franklin Variable (with Libre Franklin Fallback, Arial or Liberation Sans scaled to its metrics, then Arial, sans-serif)
**Label/Mono Font:** JetBrains Mono Variable (with JetBrains Mono Fallback, Menlo, Liberation Mono, or Courier New at its line metrics, then Menlo, monospace)

**Character:** Ultra is a fat wood-type slab, loud and friendly like exhibition signage; Libre Franklin is a plain American gothic that reads quietly at length. All three faces are self-hosted. Glyphs outside the Latin subset (accented author names, the multiplication sign, math operators) take a named Arial stand-in, so the browser does one lookup instead of searching every installed font.

### Hierarchy
- **Display** (Ultra 400, 48px on phones to 92px on wide screens, line height 0.98): page and chapter titles in the mast, sentence case, ending in a tomato full stop. Mast titles size to their longest word with a container query (`100cqi / (chars * 0.76)`) capped at the display size, so the longest word never breaks and the stop stays attached.
- **Headline** (Ultra 400, 32px, line height 1.1): section headings in the reading column.
- **Wordmark** (Ultra 400, 24px; 20px under 22.5rem so a 320px bar holds it and three touch tools on one row): the top bar wordmark, pager titles, app and empty-state titles.
- **Title** (Libre Franklin 700, 24px, line height 1.2): third-level headings. Fourth level is 20px bold.
- **Lede** (Libre Franklin 400, 20px, line height 1.45): the paragraph under a mast title, capped at 36rem.
- **Body** (Libre Franklin 400, 17px, line height 1.6): all running text, in a 36rem column (about 68 characters). From 100rem, docs and article text is 18px in a 38rem column. Paragraphs, list items, definitions, and captions set with `text-wrap: pretty`, so a line never ends on a lone word. In prose, emphasis is the true italic one step heavier (medium), so it reads as a change of voice; strong is bold and both together are bold italic.
- **UI** (Libre Franklin 400, 15px): tabs, the search field, sidebar links, tables, notes, author lines (`--ply-size-ui`).
- **Label** (Libre Franklin 700, 13px, line height 1.3): wall labels, tags, sidebar group headings, code bar text.
- **Mono** (JetBrains Mono 400, 0.875em, line height 1.7 in blocks, ligatures off): code, keys, and numeric parameters in code and readouts. Tables, numbers, and a slider's printed value use Libre Franklin's tabular figures, so a page with no code loads no mono face.

### Named Rules
**The Wood Type Rule.** Ultra is for titles only, at 24px and up, in sentence case. Everything that gets read is Libre Franklin.

**The Full Stop Rule.** Mast titles and the wordmark end in a tomato full stop that never wraps away from its word.

## Layout

The page is a top bar, a mast or a header, a 3px rule, then a docs grid or an article inside a 90rem container with a fluid gutter of 16px on phones to 72px on wide screens. Both frames put the text at the centre of the page when there is room: navigation hangs at the page's start edge, and the space after the text holds sidenotes and margin figures. In an article nothing else enters it, so no block straddles the edge between text and margin; on a docs page, a `.ply-wide` block may run through it to the page's end edge. Chrome (the wordmark, the sidebar, the rail) keeps the page's outer edge; the text and the header above it share an inner one.

- **Top bar:** wordmark at left, chapter links, the search button and theme tools at right, 4.5rem tall, closed by a 3px rule. The links show where they fit. First they set closer, then search drops its word, then the chapters move into a details menu. Without JavaScript the switch is at 72rem. Below 30rem, once the tabs have folded into the menu, the bar may wrap to a second row, the wordmark may break inside a word, and the tools wrap at their end edge. While tabs show the bar stays on one line, because a wrap would give the tabs a row of their own and the script would measure them as fitting. The bar's chapter list and its menu panel carry different labels for a screen reader.
- **Mast:** one column on phones; from 64rem, title and lede at left and a 35rem exhibit at right. Every chapter landing puts its own working model in that slot as a black panel with a caption below. A list page under a landing has no exhibit, and its mast stays one column at every width, often compact (the title 44px to 72px); the title sizes to its longest word from a table of Ultra's widths, so it never breaks. A list page's lede may run as wide as a title line (up to 52rem, `.ply-mast__lede--wide`) and balances, so a sentence a little longer than the measure never leaves one word. An entry page (a paper, a post, a project) sets its title to its own column instead, and its lede keeps the measure. A home page's mast may seat its exhibit beside the title from 48rem (`side`), where the left column runs the exhibit's height and a dated list closes on the line of the exhibit's caption.
- **Docs grid:** reading column only on phones, with the chapter's pages, and this page's sections under the current one, in an "In this chapter" disclosure above the content; from 56rem a 17.5rem sticky chapter sidebar, with the on-this-page list hung under the current page on a hairline. The text centres once the sidebar has room beside it.
- **Article:** for papers, posts, and notes. One column below 60rem; from 60rem the margin opens after the text and the text moves toward the centre; from 80rem a 15rem sticky on-this-page rail opens at the start edge and the text is centred. Below 80rem the same list waits in an "On this page" disclosure above the text. The header (paper or post) sits in its own article row, so its title starts at the text's edge. A docs page's mast is chrome and spans the page.
- **Reading column:** 36rem; from 100rem, docs and article text steps to 18px in a 38rem column, the same 68 characters. Notes, code blocks, and text in one column share that edge.
- **Two lanes:** a block sits in the text or in the margin, never across both, because readers take the edge between them for a column line. Text width is the default, and a table with many columns or code with long lines scrolls in its own frame. `.ply-margin` (or `<Figure margin>`) puts a small figure, table, or code block in the margin beside the paragraph after it. `.ply-wide` (or `<Figure wide>`) keeps to the text in an article; on a docs page, where nothing hangs beside the text, it runs a block on to the page's end edge, below any note still beside the text.
- **Rhythm:** a 4px-based scale from 0.25rem to 8rem. Paragraphs are 1rem apart, section headings get 3rem above and 0.75rem below, the mast pads 3rem to 4rem (`dense` on a mast and `.ply-cards--dense` take a step off). On a page with many parts, such as a home page, space that separates nothing comes down a step or two (a mast padded space-6 above and space-5 below, card rows as far apart as the columns), and the rules, panels, and display type do the grouping. Sections after a mast carry their own 3px rule as the divider, and a long list of projects sets compact rows on a phone.
- **Phones (below 40rem):** search collapses to an icon button, charts keep a 32rem minimum width and scroll sideways with soft scroll-shadow cues and a hint line, token tables stack.
- **Very narrow (below 25rem):** the Menu button shows only its icon, and the pager stacks below 30rem, so nothing scrolls sideways at 320px.
- **Enlarged text (below 30rem, which is 960px at 200% text zoom):** titles (`.ply-card__title`, `.ply-title`, the paper, post, and mast titles) may break inside a word, inline math wider than its paragraph scrolls inside itself, the Atlas's list and filter stay in their column, and the top bar wraps as above. At 200% text-only zoom on a 320px window nothing scrolls sideways.
- **Touch (`pointer: coarse`):** tabs, small buttons, the menu, segmented controls, slider rails, the wordmark, the author-list toggle, the skip link, link tags, the link rows of cards and publications, and sidebar and on-this-page links grow to 44px targets. A card's or publication's title link grows its target with padding and an equal opposite margin, so the lines stay where they are, and `.ply-target` does the same for a link of your own. On a fine pointer a small link row is 24px tall at least.
- **Sidenotes and margin blocks:** in the margin whenever the main column (container `ply-main`) has 52rem for the measure, the 2rem gap, and the 14rem margin; outside a `ply-main` column, from 90rem. In a `ply-main` column the margin widens with the page to 21rem, so notes end at the page's end edge. A section heading (h2) starts below anything still in the margin, so a note never sits beside the next section; keep notes short. Otherwise they drop under their paragraph.
- **Long content:** words and URLs break only when they would overflow. Names in a table's first column stay whole and a wide table scrolls in its wrap; long button labels wrap to balanced lines; a segmented row longer than its space scrolls inside its frame.
- **Right to left:** sides are logical, so the switch, the select arrow, the sidebar point, the menu, the skip link, the article rail, sidenotes, and margin blocks mirror. Code blocks stay left to right.
- **Contrast themes and print:** in forced colors, marks drawn as fills keep their shapes in system colors and picked states use Highlight; on paper the light theme applies, panels print as ink on white, fills that show a state (primary buttons, pressed segments, checked boxes) keep their ink, and the site chrome is hidden. A link to another site prints its address after it, a paper's link buttons print as lines of text, a folded author list prints whole, and a long code block may run on to the next page rather than leave one nearly blank.

### Named Rules
**The Newspaper Whitespace Rule.** Empty space is for a single focus. Around one central element (a paper title, a mast) it draws the eye. On a page that shows many elements side by side (a home page, a list, a wall), an empty region reads as a gap, so it holds content: a block moves into it, a column widens, or a body sets in two columns.

**The Two Edges Rule.** A page has two edges. Labels (titles, years, topic names) start at the first, and everything they label starts one column in, at the width of the article rail (`--ply-layout-toc`). Every wall, list, and home section shares that label column.

**The Enlarged Text Rule.** Layouts are built for 200% text zoom at 320px with the real copy in them. The escape hatches below 30rem (a title breaking inside a word, a wrapping bar, math that scrolls in itself) are part of the design, and they leave a layout that fits as it was.

**The Hit Area Rule.** A small link row is 24px tall on a fine pointer and 44px under a finger. A link that runs as text grows its target with padding and an opposite margin, so layout never moves. Links inside running text keep their own size.

**The Layer Rule.** Site CSS that sets a size a Polytope utility may override, such as a 24px footer link that `.ply-target` raises to 44px, goes in `@layer ply.components`, never unlayered. The site sheet restates the order `@layer ply.reset, ply.base, ply.layout, ply.components, ply.utilities;` before anything else, so it never defines the order itself.

**The One Retro Move Rule.** A site spends retro once. The example is a section rule whose end climbs in three 3px pixel steps, as a bar on an Atari screen does, set on the rules inside the content width and left off the full-width rule under a mast. Mono labels and one-bit art are the other retro marks a site may use.

## Elevation & Depth

The system is flat. Depth comes from contrast: a black panel on a white ground reads as an object hung on a wall, and 3px rules separate regions. Nothing at rest has a shadow. A soft shadow appears only under layers that float above the page and dismiss themselves: tooltips, toasts, and citation cards. Inputs on hover thicken their border with a 1px inset ring.

### Shadow Vocabulary
- **Tooltip lift** (`box-shadow: 0 0.5rem 1.25rem rgb(0 0 0 / 0.2)`): chart tooltips.
- **Card lift** (`box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.18)`): citation cards that open over prose.
- **Toast lift** (`box-shadow: 0 0.75rem 2rem rgb(0 0 0 / 0.25)`): toasts at the foot of the viewport.

### Named Rules
**The Wall and Panel Rule.** Depth is a black panel on a white wall. Shadows belong only to layers that float and go away.

## Shapes

Square corners on every panel, button, input, tag, note, code block, and menu (`rounded.none`). Round is reserved for things that are round: balls, points, radio buttons, the switch ball, the slider thumb, status dots, legend keys for points (`rounded.ball`). Borders come in three weights: 1px hairlines between rows, 2px control borders, 3px exhibit rules. Keys get a 3px bottom border like a physical key.

**The Only Round Things Rule.** If it is not a ball or a point, its corners are square.

## Components

### Buttons
Square exhibit labels.
- **Shape:** square (0), 44px tall, 2px border.
- **Primary:** exhibit black with white semibold text, 1.5rem side padding. Inside a black panel it inverts to chalk with black text.
- **Hover / Focus:** hover fills tomato ink with white text (bright tomato with black text in dark mode, through `--ply-color-on-accent`); press nudges down 1px; focus is a 3px teal outline offset 2px (mustard inside panels). Transitions run 120ms ease-out.
- **Secondary:** transparent with a black border; hover fills black.
- **Ghost:** borderless, 0.75rem padding; hover shows the gallery wall gray.
- **Sizes:** small is 36px tall, growing to 44px on touch screens; icon buttons are square.

### Chips
- **Tags:** 13px bold text, 1.5px current-color border, square. Solid tags are black; note tags are mustard with black text. A tag that is a link (`.ply-tag--link`) is teal and underlined, at least 28px tall, and fills with ink on hover; the current one is the solid tag. A row of tags is a `.ply-tag-list`.
- **Chips:** short names in the mono face (skills, tools) in a sunken box with a hairline, as `.ply-chips`.
- **Status:** a shape plus a word. Idle is a ring, running a pulsing tomato ball, done a green check, warning a yellow triangle, error a red cross.
- **Stability:** stable is solid black, experimental is dashed, deprecated is struck through in caption gray.

### Cards / Containers
- **Exhibit panel:** exhibit black, chalk text, 1.5rem padding, square, no shadow. Links inside use the light teal. Inside a panel the text, ground, and rule tokens switch to chalk on black, so checkboxes, switches, ghost buttons, and tables need no panel variant.
- **Exhibit figure:** a panel with a wall-label caption under it, outside the black: 14px caption gray text with a bold black lead phrase, capped at 40rem.
- **Wall label:** a small black tag with white 13px bold text naming an exhibit or marking the current tab. Over a figure (a card's Preprint) it carries its own ground, the same in both themes: pale mustard (`flag`) with a mustard edge and black text.
- **Cards:** entries on a list page, in a grid of up to three columns of at least 16rem that shares a row between fewer cards than it has columns. Each is a 100:56 black panel with the entry's figure, or a complex seeded from its title, and under it a 20px bold title, a 14px semibold meta line, and a 15px caption-gray summary. The lead card, or a card alone, spans the row and, with room, sets its panel beside the text and its title in Ultra, the name over a semibold subtitle. A card may add an authors line (14px caption gray, the owner's name darker) and a row of links. `.ply-cards--aligned` lines the parts up across a row by subgrid, so titles, summaries, authors, and link rows start on shared lines, and `.ply-cards--tracks` keeps three tracks from 80rem so a row never leaves one empty, with the lead's panel across two of them; a last row of two cards turns the grid into six half-tracks so the pair share the row. In two columns (a grid 34rem to 52rem wide) an odd last card spans the row, its panel in the first column and its text in the second. A picture is sized to the column a phone shows it in (the viewport less two gutters) and not to 100vw, and the twin for the other theme loads lazily at normal priority (`ThemedImage` writes the pair). Under a figure the card draws the same complex it would draw alone, from the same seed and with no script, and the loaded picture covers it. A picture that is slow, missing, or failed leaves that complex and never a black void.
- **Working model:** a flush black panel holding one SVG, the controls and readout under it on the page ground, and a wall-label caption that says the model illustrates the paper's mechanism. Its drawing is chalk lines and points, mustard at half strength for filled regions, and the tomato ball for the one moving part. On first view it may run once from its start state, and any input ends the run.
- **Empty state:** a complex with no edges yet (five loose points), a wordmark-size title, a line of what to do, and the one action that fills it.
- **Notes:** mustard fill, black text, a ball mark, 1rem by 1.5rem padding, capped at the 36rem measure. Variants: soft (pale mustard), info and success (gallery wall), danger (black with a tomato cross).

### Inputs / Fields
- **Style:** white field, 2px black border, square, 44px tall. Labels are 14px bold above the field; hints are 14px caption gray.
- **Focus:** 3px teal outline offset 2px (mustard inside panels and code, black on mustard notes); hover adds a 1px inset ring.
- **Error / Disabled:** error turns the border tomato and adds a tomato diamond with tomato-ink text; disabled uses the gallery wall fill and quiet gray text.
- **Choices:** checkboxes are square and fill black with a white check; radios are round and fill with a tomato ball; the switch is a square track with a ball that rolls and turns tomato; the range slider is a 3px rail with a tomato ball and the value printed beside it in semibold tabular figures; segmented controls are wall-label tabs in a bordered row.

### Navigation
- **Top bar tabs:** 15px medium caption gray; hover shows the gallery wall; the current chapter is a black wall-label tab with white semibold text.
- **Sidebar:** caption gray links; the current page is bold black with a tomato point to its left.
- **On this page:** 14px caption gray; the current section turns black and semibold. On docs pages it hangs under the current page in the sidebar, indented on a hairline; on articles it sits in the start rail under a bold heading, and the current section gets the tomato point.
- **Search:** the top-bar field opens a square sheet over a dimmed page, closed by a 3px rule with the soft shadow of a floating layer; on phones it fills the screen. Results come from the site's own Pagefind index, grouped by page with up to three matching sections. A small black wall label names each result's kind, matches are pale mustard, and the highlighted result gets the tomato point. "/" and Ctrl or Cmd+K open it; the machine loader shows while the index loads. The inline variant puts a compact field (about 14ch, wider on focus, with a "/" key hint) in the top bar and drops results in a black exhibit panel under it, up to eight pages grouped by kind under wall labels, matches in mustard, an "All results" row last. Enter follows the chosen result, or with none chosen opens the results page for the query; a query with no match is said so in a semibold line above the topic links, and a missing index is said so with a link to the search page. Where the tabs have folded the field is an icon button that opens the field across the bar.
- **Pager:** a 3px rule, then previous and next with Ultra titles, balanced, that turn tomato ink on hover. A title with a subtitle shows only its name. Crossing into another chapter, it names the chapter.
- **Section head:** a heading with a way onward on the same line, at 24px tall and 44px under a finger. On a page of many sections it may open on the stair rule (a 3px rule that leads with a tomato segment and climbs in three pixel steps at its end) and carry a small static complex before the title, seeded from the section's name, so each section draws its own and none moves.
- **Footer:** a 3px rule, the name in Ultra with the tomato full stop and a line under it at the start, the links in groups by meaning at the end, and a hairline-topped colophon. The groups share a row when they fit and otherwise stack on one edge, so no row holds a lone link. A phone gets a Back to top link and a floating 44px button that shows only on scrolling up from more than a screen down.
- **Mobile:** chapters move into a native details menu with a 3px black border, which Escape, a press outside, or focus moving past closes; search becomes icon-only.

### Code Blocks
Black panels capped at the reading measure, so in an article they never cross into the margin; on a docs page `.ply-wide` runs one on past the text. A bar with the language in mono and a hairline copy button sits on top; the copy button turns mustard when copied, and its name says which block it copies. Long lines scroll with the same soft edge cue as tables and charts, and a block takes focus only while it scrolls; a BibTeX entry wraps instead, each field under its value. Comments are mustard light, keywords tomato bright, strings teal light, numbers cobalt light.

### Papers and Posts
- **Headers:** the title in Ultra up to 64px, balanced, sized to the header's own width rather than the window's: about 22 characters to a line, more for a long title so it keeps to about three lines. On phones it is 32px, down toward 24px for a long title. Its width cap is in em, so it breaks the same way at every width it reaches its full size. A paper title with a subtitle (after the first colon) sets the name in Ultra and the subtitle under it in Libre Franklin 600, 20px to 32px from the name's size; the colon stays in the heading, visually hidden. Short hyphenated terms (Test-Time) stay on one line. A paper adds authors in 20px semibold with tomato affiliation marks (with the owner's name marked, it is bold and the other names regular, as in a publication list), the venue in bold 14px, balanced, and the links as small buttons. A list of dozens of authors folds to the first names, the owner's, and the last, with a button for the rest; the abstract's label is set as the page's other section headings. A post adds a 20px lede, a bold 14px date line with a small tomato ball between the date and the reading time, and outline tags.
- **Front matter:** a paper's key figure takes the width of the header and the margin together, or the text's width with `column`, and a long caption under it sets in two balanced columns from 60rem. A paper with no figure hangs the card's picture or complex in the margin beside the header from 60rem. The paper in one line follows at the lede's size behind a wall label, and a 3px rule at the text's width closes the front matter before the text. The pager closes the page at the text's edge, and the reference list tints the entry a citation link jumped to, with a tomato bar beside it.
- **Sidenotes:** 14px caption gray with a bold tomato-ink number, in the margin or under their paragraph.
- **Margin figures:** 14rem wide in the margin, the caption under them in 14px caption gray with a bold black "Figure n." lead.

### Vietoris-Rips Complex
The signature model and the emblem: random points in a black panel at 100:56. Points closer than the radius join with chalk edges, and three pairwise joined points fill a mustard triangle at half strength. A radius slider and the edge and triangle counts sit under the panel; pointing at a vertex draws its reach as a dashed tomato circle. On the home page it grows on first view, the radius running from 0 to its value in under three seconds, so edges arrive before triangles. It waits as bare points while its script loads, its slider and counts at 0, so the finished drawing never shows and then vanishes; without script, or with reduced motion, it is drawn finished, and without script its slider and counts are hidden. On paper, or when reduced motion is switched on mid-growth, it jumps to the finished complex. Each edge and triangle is drawn once, in order of the radius where it appears, so a new radius adds or removes only the cells in between. Past 2000 triangles the fill is drawn as one shape, so even 120 points stay responsive. The favicon is the same object at its smallest: one filled triangle and one loose edge on black, with a tomato vertex.

### Probability Machine
The probability demo: a Galton board in a black panel at 28:15. A mustard funnel, chalk pegs in a triangle, bins with gray walls, and tomato balls. It drops balls live when it first comes into view and settles into a bell curve; without script, with reduced motion, or on paper, it shows the settled curve. A three-row version of the same machine is the loading indicator, its ball falling on the gravity curve.

### Atlas
A CV drawn as a 1-complex on the sphere: an orthographic globe in a black panel beside the entries that happened there, drawn like the Vietoris-Rips complex. Land is a faint chalk fill with chalk coastlines. Borders are faint chalk, and so are the graticule and limb that draw the sphere. Places are chalk points with a black ring, the route between them in date order is chalk great-circle edges, and countries that hold a place fill mustard at half strength, like the complex's triangles. The current place is the tomato ball with the complex's dashed tomato reach ring; its name is a chalk tag with black text, and other places are named in small black wall labels.
- **Entries:** a history wall closed above by a 3px rule and divided by hairlines. Each entry has the date in Ultra at 24px, a bold 20px title, the organization in caption gray, the kind as a wall label, and a place line led by a ball that turns tomato when the entry is current, then a short snippet. The place line is an underlined button that shows the place; its underline turns tomato on hover. Above the list, a segmented kind filter appears when entries have more than one kind. The server draws it, so the entries do not move when the script starts; without script it is hidden.
- **Story:** side by side, the entry whose top crosses a line 45% down the screen is current; stacked, the topmost entry showing below the pinned globe is current, so the globe always names the entry the reader can see. The globe flies there and the ball travels the great circle from the last place with a tomato trail that fades once it lands; with no previous place it drops in on the gravity curve. An entry read in a moment still gets its landing: the ball stops at the places of up to two entries passed on the way, each of those legs a little quicker, and a longer jump flies straight. A new entry mid-flight turns the ball from where it is, its trail unbroken. While an entry is current, the legs into and out of its place keep the full chalk and the rest of the route fades with each move away from it (0.55, 0.3, then 0.15 of the chalk), so a long CV stays legible; with no entry current the whole route is chalk. A flight keeps north up except near a pole, where the panel turns smoothly with the route's bearing and lands north up; a flight stopped by a drag turns back to north up once the drag ends. Pins and place lines pick an entry and scroll it to the line. Past the last entry the globe pulls back to every place, and the first time it does, the story gets its one closing beat: the route lights tomato leg by leg in date order, then fades back to chalk.
- **Interaction:** drag turns the globe. Plain wheel scrolls the page and the readout says which key zooms; Ctrl or Cmd and wheel, or a pinch, zooms. With the globe focused, arrow keys turn it, plus and minus zoom, and 0 shows every place. Three square zoom in, zoom out, and show-all buttons sit in a 2px chalk-bordered box, 36px, 44px on touch. The readout prints the current place's coordinates in mono on the panel ground.
- **Caption:** a wall-label caption under the globe. It names the current entry in bold with its organization and dates; with none, the bold label and the counts of places and moves, plus a drag hint once the globe can turn.
- **Layouts:** in a container 52rem or wider, the entries run left (17rem to 25rem) and the globe is sticky on the right, nearly a screen tall, with the controls in a column and the readout at the top. Narrower, the globe is pinned above the entries at 12rem to 22rem tall on the page ground with a 3px rule under the stage, and the controls sit in a row at the bottom.
- **Without script, reduced motion, print, contrast themes:** the server draws the finished globe with points, route, visited countries, and the names that fit. Under reduced motion every flight jumps. On paper the globe prints once above the entries, 18rem tall, in its own ink, and the controls, readout, and filter are hidden. In forced colors the globe keeps its own colors.
- **Data:** Natural Earth v5.1.1 countries in its United States point of view, so borders in disputed places follow the US position, simplified into a coarse level for the whole globe and a finer one from zoom 3.5. It is drawn with a bundled d3-geo, with no tiles or outside service.

### Charts
A bold 16px title, a 14px caption gray subtitle, hairline grid, caption gray axes, a 1.5px black baseline, direct labels in semibold black, point legend keys as balls, and a texture fill for print and forced colors. A small chart for the margin (`.ply-chart--margin`) shows at its own size, 21rem at most, with its text at the sidenotes' size. A plot saved as inline SVG (`.ply-plot`) takes its ink from `currentColor` and its series from the `--ply-viz-*` tokens, so one file serves both themes.

### Walls and ledgers
A wall is a list divided by rules with its labels in one column: the year wall of a publication list, and rows of a name beside what it labels (`.ply-wall__row`). From 64rem the label column is the width of the article rail. A wall may carry a short tomato lead above each label (`.ply-wall--lead`). A ledger (`.ply-ledger`) sets awards, service, and talks with the text at the start and a bold tabular year at the end of each hairline-divided row.

## Do's and Don'ts

### Do:
- **Do** open every chapter landing with a working model in a black panel, captioned underneath like a wall label.
- **Do** keep text, notes, and code in one column on the same 36rem edge.
- **Do** end mast titles in a tomato full stop and size them to the longest word.
- **Do** use ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`) for things that arrive and the gravity curve (`cubic-bezier(0.55, 0, 1, 0.45)`) for things that fall.
- **Do** give each page one signature moment of motion and show the end state under reduced motion.
- **Do** assign chart colors in the fixed slot order and limit scatter plots and small multiples to the first three.
- **Do** check every new color pair with the contrast script in both themes (WCAG AA: 4.5:1 for text, 3:1 for marks, rings, and borders).
- **Do** write plain, specific copy with no dashes as punctuation and no sales words, and keep the site's own writing rules (banned words, sentence length, who the reader is) beside its PRODUCT.md.
- **Do** build for 200% text zoom at 320px and for a finger: 24px link rows at rest, 44px under `pointer: coarse`.
- **Do** fill the empty regions of a page of many elements, and leave room around the one element of a page that has a single focus.

### Don't:
- **Don't** use tomato for anything other than the current location, a moving part, or the small marks that lead to them.
- **Don't** put white or colored text on mustard.
- **Don't** show a link without its underline.
- **Don't** set Ultra below 24px, in all caps, or for running text.
- **Don't** round a corner unless the shape is a ball or a point.
- **Don't** put shadows on panels, buttons, cards, or anything that stays on the page.
- **Don't** let color carry status by itself; pair it with a shape and a word.
- **Don't** cycle chart colors past the eighth slot or reorder them.
