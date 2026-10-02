# Comments with giscus

Comments are GitHub Discussions rendered by giscus inside the `Comments` component. The widget is an iframe you cannot style from the page, so the system ships a giscus theme file (`assets/Giscus/giscus.css`) that paints the iframe with the same tokens as the page. giscus accepts any `https://` URL as a theme, so host that file on the blog and point `data-theme` at it.

## Setup

1. Enable Discussions on the blog's repository and install the giscus GitHub App on it.
2. Create a category named **Comments** (type: Announcement, so only the app and you can open threads).
3. Use the configuration page at giscus.app to obtain the `data-repo-id` and `data-category-id` values; they are the only parts of the snippet that are specific to your repo.
4. Copy `assets/Giscus/giscus.css` to the site as `/assets/giscus.css`.

## The snippet

Place it inside `<div class="giscus">` in the `Comments` component. Replace the four placeholders.

```html
<script src="https://giscus.app/client.js"
  data-repo="YOUR_USER/YOUR_REPO"
  data-repo-id="R_xxxxxxxx"
  data-category="Comments"
  data-category-id="DIC_xxxxxxxx"
  data-mapping="pathname"
  data-strict="1"
  data-reactions-enabled="0"
  data-emit-metadata="0"
  data-input-position="top"
  data-theme="https://YOUR_USER.github.io/YOUR_REPO/assets/giscus.css"
  data-lang="en"
  data-loading="lazy"
  crossorigin="anonymous"
  async></script>
```

Why these values: `pathname` mapping with `strict` on keeps one Discussion per post even if the title changes; reactions off because the row of emoji is the one piece of giscus that fights the system's no-emoji rule; `input-position="top"` so a reader on a phone reaches the reply box without scrolling past every comment; `loading="lazy"` so a long post does not pay for the iframe until the reader gets there. Until the theme file is live on GitHub Pages, use `data-theme="transparent_dark"`, which is giscus's own closest match to `bg-000`.

## The theme file

`assets/Giscus/giscus.css` maps giscus's own custom properties onto this system's values: `--color-canvas-default` to `bg-000`, `--color-canvas-subtle` to `bg-100`, `--color-border-default` to `line-200`, `--color-fg-default` to `ink-100`, `--color-fg-muted` to `ink-200`, `--color-accent-fg` and `--color-btn-primary-bg` to `cyan-500` with `on-accent` text, and the three signals to `green-500`, `amber-500`, `red-500`. Font families are the same three stacks; giscus loads no fonts of its own, so the reader's device must have them or the fallbacks apply (the iframe cannot read the page's Google Fonts link). When tokens change, regenerate this file from `tokens.json`; the values are literal hex because the iframe cannot see the page's variables.

## Rules

- Say in words, above the widget, that comments are GitHub Discussions and need a GitHub login (`.nt-comments-note`). Readers on a phone otherwise tap a login button without knowing where it goes.
- Never render the widget on list pages.
- The `.giscus:empty::before` loading line (`> loading comments_`) is drawn by `bundle.css` and disappears when the iframe mounts; do not add a spinner.
- If giscus is ever replaced, the `Comments` component stays; only the script and the note's wording change.
