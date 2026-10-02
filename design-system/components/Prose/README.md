Article typography for everything a Markdown post renders: paragraphs, links, two heading levels, lists, blockquotes, inline code, tables, images, the rule. Apply the class to the `<article>` body and write ordinary Markdown.

**Use** `.nt-prose` together with `.nt-wrap` so the measure is `measure` (42rem, about 68 characters). Body copy is 17px/28px on phones and 18px/30px from 768px; paragraphs are spaced with `space-5`, an `h2` gets `space-7` above.

**Provide** semantic HTML from your Markdown renderer. For tables, wrap the `<table>` in `<div class="nt-table-wrap">` (Jekyll: a one-line Liquid include, or a kramdown block attribute) so a wide table scrolls inside its box rather than widening the page. Give `h2`s ids for anchor links; `scroll-margin-top` is set.

**Do** use `h2` for sections and `h3` for sub-sections only; the `h1` belongs to `PostHeader`. External links grow a small cyan arrow automatically (`a[href^="http"]`). The `//` before each `h2` and the `> _` in the rule are drawn by CSS.
**Don't** use `h4` and deeper, bold runs longer than a phrase, or centred text. Don't put images wider than their natural size; they get a `line-100` border and a caption in `caption` style.
