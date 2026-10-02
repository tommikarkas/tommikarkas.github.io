# Shipping on GitHub Pages

The system is two stylesheets and a folder of SVGs. Nothing needs compiling, so it works with Jekyll (GitHub Pages' default), with a plain `index.html`, or with any static generator whose output you commit.

## Files to copy into the site

| From this system | To the site |
| --- | --- |
| `tokens.css` (generated; the Tokens view downloads it) | `/assets/tokens.css` |
| `components/bundle.css` | `/assets/blog.css` |
| `assets/Icons/*.svg` | `/assets/icons/` |
| `assets/Marks/nt-rat.svg`, `nt-rat-favicon.svg` (and `nt-mark.svg` if you use the secondary mark) | `/assets/` |
| `assets/Giscus/giscus.css` | `/assets/giscus.css` |

## The `<head>`

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0b0d14">
<link rel="icon" href="/assets/nt-rat-favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;600&display=swap">
<link rel="stylesheet" href="/assets/tokens.css">
<link rel="stylesheet" href="/assets/blog.css">
```

`color-scheme: dark` makes the browser's own form controls, scrollbars and the giscus iframe's chrome dark before any CSS loads; `theme-color` paints the phone's status bar `bg-000`. Only the weights listed are loaded (Chakra Petch 600/700, Plex Sans 400/400i/600, JetBrains Mono 400/600), which keeps the font payload near 120 kB. If the site is served from a project path (`user.github.io/blog/`), prefix every `/assets/` URL with the path, or set Jekyll's `baseurl` and use `{{ '/assets/blog.css' | relative_url }}`.

## Page skeleton

```html
<body>
  <header class="nt-header nt-wrap-wide">…SiteHeader…</header>
  <main class="nt-wrap">
    <article>
      <header class="nt-post-header">…PostHeader…</header>
      <div class="nt-prose">…Prose, CodeBlock, Callout…</div>
    </article>
    <nav class="nt-postnav">…PostNav…</nav>
    <section class="nt-comments" id="comments">…Comments…</section>
  </main>
  <footer class="nt-footer nt-wrap-wide">…Footer…</footer>
</body>
```

## Jekyll notes

- kramdown renders fenced code as `<div class="language-rust highlighter-rouge"><div class="highlight"><pre class="highlight"><code>`. Alias that wrapper to the component by adding `.highlighter-rouge` to the `.nt-code` selectors in `blog.css` (`.nt-code, .highlighter-rouge { … }` and `.nt-code pre, .highlighter-rouge pre { … }`); the language label comes from `data-lang`, which Jekyll does not emit, so either leave the label off or set it from the `language-*` class with two lines of JavaScript. Map Rouge's token classes: `.highlight .k, .kd, .kn { color: var(--magenta-500) }`, `.s, .s1, .s2 { color: var(--green-500) }`, `.nf { color: var(--cyan-500) }`, `.mi, .mf { color: var(--amber-500) }`, `.c, .c1, .cm { color: var(--ink-300); font-style: italic }`.
- Tables: kramdown has no wrapper option; put `{::nomarkdown}<div class="nt-table-wrap">{:/}` before and the closing tag after a table, or add a two-line JavaScript at the end of `body` that wraps every `.nt-prose table`.
- Reading time: `{{ content | number_of_words | divided_by: 220 | plus: 1 }} min`.
- Mark the current nav item: `{% if page.url == '/' %}aria-current="page"{% endif %}`.

## Performance budget for a phone

One HTML document, two stylesheets (about 14 kB together), fonts (about 120 kB, cached across pages), icons as separate SVGs under 1 kB each, and the giscus iframe loaded lazily. No JavaScript is required for anything the reader sees before the comments. Keep images under 200 kB and give them `width`/`height` attributes so the text does not jump while they load.
