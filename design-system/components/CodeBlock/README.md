A code block on a `bg-100` surface with a language label bar, optional line numbers and diff colouring. On phones it bleeds to the screen edges and scrolls sideways inside itself; the page never does.

**Use** for every fenced code block. The wrapper is `<div class="nt-code" data-lang="rust">` around the `<pre><code>` your renderer emits; `data-lang` paints the label (uppercase, mono). Omit it for plain output.

**Provide** optional line numbers as `<span class="nt-ln">n</span>` at the start of each line (they are `ink-300` and unselectable), `nt-add` / `nt-del` wrappers for diff lines (`green-500` / `red-500`, always with the `+` / `-` kept in the text so the colour is not the only cue) and `nt-hl` for a highlighted line. Map your highlighter's classes onto `tok-kw`, `tok-str`, `tok-fn`, `tok-num`, `tok-cm` (Rouge in Jekyll: a short `.highlight .k {{ }}` alias block; Shiki: a custom theme with these five colours).

**Do** keep the five syntax colours: magenta keywords, green strings, cyan functions, amber numbers, dim italic comments. That is the whole theme; it stays readable at 15px on a phone.
**Don't** add a copy button that depends on JavaScript the page may not load; if you add one, render it only after the script runs. Don't wrap long lines; let them scroll.
