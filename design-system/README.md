A reading-first system for a personal engineering blog that runs on GitHub Pages and takes comments through giscus. The look is a terminal with neon in it: one blue-black ground, cyan for everything you can act on, magenta for the few labels that are not links, and type sized for a phone held in one hand. Everything is static HTML and CSS; there is no build step, no JavaScript except the giscus loader, and one theme.

## Principles

- **Read first.** Every choice serves a 17px paragraph on a 390px screen. Decoration is limited to the prompt glyph `>`, the `//` before a heading and one magenta rule under the title.
- **Dark only, by decision.** There is no light theme to drift out of sync. `bg-000` is the ground everywhere; depth comes from the three `bg` steps, never from shadows.
- **Cyan is interaction.** If it is `cyan-500` you can tap it or it is code. Nothing decorative is cyan except the icons, which always sit next to the thing they label.
- **Square.** Corners are `radius-0` unless the element is inserted into the page from outside (a callout, the comments panel: `radius-md`) or is a small label (`radius-sm`).
- **Simplified cyberpunk.** The vocabulary is the terminal prompt, the dot grid and the glow. No scanlines over text, no glitch animation, no gradients.

## Content fundamentals

Write in first person, past tense for what happened and present for what is true now. Address the reader as "you" when giving instructions. Titles are sentences in sentence case ("Debugging a leaky WebSocket behind a corporate proxy"), never headline case and never clickbait. Dates are ISO (`2026-09-12`) everywhere, including prose. Numbers keep their units with a thin space (`60 s`, `40 kB`). Set a term in `code` when it is something you would type; otherwise it is a word. No emoji in copy or headings; the icon set covers every signal the site needs. Each post has a one-sentence excerpt written by hand in the front matter; it appears in `PostCard` and as `.nt-lead` in `PostHeader`.

## Color

The palette is three grounds, three inks, two accents and three signals; see each token's usage note for its grounds and contrast.

- Page and prose sit on `bg-000`. Code blocks, callouts, blockquotes and the comments panel are `bg-100`. `bg-200` is for hover on a `bg-100` surface and for table header rows.
- Text is `ink-100`. Dates, captions, the footer and the lead sentence are `ink-200` (8.6:1 on `bg-000`). `ink-300` is decorative only: line numbers, the dot grid, disabled controls.
- Links, the active nav item, inline code, focus rings and all icons are `cyan-500`. `link` and `focus` are aliases of it so a future recolour is one edit.
- `magenta-500` appears as text only on `Tag`, as the `//` heading marker, the blockquote rule, the h1 underline and the selection ground (with `on-accent` text). It is never body copy.
- `amber-500` warns, `red-500` forbids, `green-500` confirms, and each is always next to a word or icon that says the same thing. Green and red differ in lightness (13.6:1 and 6.5:1 on `bg-000`), so a diff reads without colour.
- Anything written on a cyan, magenta or amber fill uses `on-accent`.

Borders are `line-100` on the page and `line-200` on raised surfaces. The three glows (`focus-ring`, `glow-cyan`, `glow-magenta`) are the only shadows.

## Typography

Three Google Fonts families, loaded with one `<link>` (the snippet is in the Shipping section): **Chakra Petch** for the blog name and headings (`display`), **IBM Plex Sans** for running text (`sans`), **JetBrains Mono** for code, eyebrows, tags and meta (`mono`). Each stack falls back to system faces, so the page reads before the fonts arrive.

- Running text is `body` (17/28) on phones and `body-lg` (18/30) from 768px, at a measure of `measure` (42rem, about 68 characters). Never wider.
- `h1` is 34/40 on phones and 42/48 from 768px, one per page. Sections are `h2` (26/32) with a magenta `//` drawn before them; sub-sections are `h3` (21/28). There is no `h4`.
- `lead` (20/30, `ink-200`) is the optional first paragraph. `small` (15/24) is captions, callout bodies, footer and table cells; `caption` (13/20) is figure captions.
- `code` is 15/26 in blocks and 0.88em inline. `eyebrow` (12/16, 600, 0.12em tracking, uppercase, preceded by `>`) labels titles, callouts and code blocks. `meta` (13/20) is tags, dates in lists and the comment count.
- Headings take `text-wrap: balance`. Tables and anything with aligned digits take `font-variant-numeric: tabular-nums`.

## Spacing and layout

A 4px grid (`space-1` to `space-8`). The page gutter is `space-4` (16px) at every phone width and `space-6` from 768px, set once as `padding-inline` on `body`. Prose paragraphs are `space-5` apart; an `h2` has `space-7` above; the header is `space-8` from the content and the footer `space-8` below it. Running text is capped at `measure`; code, tables, figures, the header and footer may reach `measure-wide` (52rem). Every tappable element is at least `tap` (44px) tall: nav links, buttons, tags on the tags page, post-nav cells, footer links. Code blocks bleed to the screen edge on phones and scroll inside themselves; a table scrolls inside `.nt-table-wrap`; the page body never scrolls sideways.

## Radius, borders, motion

`radius-0` by default; `radius-sm` (2px) on tags, badges and inline code; `radius-md` (4px) on callouts and the comments panel. Borders are 1px hairlines; the only 2px borders are the active nav underline and the blockquote rule. Motion is limited to the comments-loading cursor blink, which stops under `prefers-reduced-motion`. Hover states change colour or add a glow; nothing moves.

## Iconography

Icons are solid signage pictograms copied from the public-domain set at `apancik/public-domain-icons` (a CC0 collection drawn from Public Icons, AIGA/DOT Symbol Signs and the NPS map symbols), normalised to a square viewBox with 6% padding and inked in `cyan-500`. They live in `assets/Icons/` as SVG files, 26 of them: `alert`, `arrow-left`, `arrow-right`, `arrow-up`, `bolt`, `check`, `chevron-left`, `chevron-right`, `clock`, `comment`, `cross`, `download`, `external-link`, `eye`, `file`, `folder`, `gear`, `grid`, `help`, `home`, `mail`, `plus`, `power`, `reload`, `search`, `star`.

- Use them with `<img src="/assets/icons/<name>.svg" width="16" height="16" alt="">` at 16px beside text, 20px in the comments heading, 14px in the footer, 12px on a badge. The `alt` is empty when a word sits next to the icon, which it always should.
- The ink is baked in, so an icon on a cyan or amber fill needs `filter: brightness(0)` (already applied to `.nt-btn img`).
- There is no GitHub, Mastodon or RSS brand mark: those logos are trademarked and not in the public domain. Write the word and use `external-link`, `mail` or `bolt` beside it.
- The blog's own mark (`assets/Marks/nt-mark.svg`: a cyan prompt chevron with a magenta cursor block) is original to this system and released under the same CC0 terms; `nt-favicon.svg` is the same mark on `bg-000` for the tab.

## Components

Twelve blog parts, all plain HTML styled by `components/bundle.css` with the `nt-` prefix: `SiteHeader`, `PostCard`, `Tag`, `Badge`, `PostHeader`, `Prose`, `CodeBlock`, `Callout`, `Button`, `PostNav`, `Comments`, `Footer`. Each component's README says what the template provides and when to use it. A post page is `SiteHeader`, then `<article>` with `PostHeader`, `Prose` (containing `CodeBlock` and `Callout`), `PostNav`, `Comments`, then `Footer`. An index page is `SiteHeader`, a `PostCard` list, one `Button` for pagination, `Footer`.
