The top of a post: eyebrow, the one `h1` on the page, an optional lead sentence and the tags. A short magenta rule under the title is the post's only decoration.

**Use** once, as the first child of `<article>`, inside `.nt-wrap` so the title shares the body's measure.

**Provide** the date as `<time datetime>`, the reading time, the `h1` text as written in the front matter, and optionally `.nt-lead` (the post's one-sentence summary, in `ink-200`) and the tag links. A `Badge` may sit at the end of the eyebrow.

**Do** write titles as sentences, not headlines: "Debugging a leaky WebSocket", not "WebSocket Leak Debugging Guide". The `h1` is 34px on phones and 42px from 768px; `text-wrap: balance` keeps the two lines even.
**Don't** put the author name here; it is a personal blog, the footer says who writes it. Don't add a hero image above the title.
