A short aside set apart from the running text: a `bg-100` box with a 4px radius and a coloured outline, titled by an eyebrow with an icon. Three kinds: note (cyan), warning (`nt-warn`, amber) and danger (`nt-danger`, red).

**Use** `<aside class="nt-callout">` in the article body for something the reader may skip, or must not. One or two per post is plenty.

**Provide** the title as `<p class="nt-eyebrow">` with a 16px icon from `assets/Icons/` first (`help` for notes, `alert` for warnings, `cross` for danger; the icons are already cyan, so on warn and danger callouts prefer the text colour to carry the kind) and one or two sentences in `small` size.

**Do** make the title a word a reader scans for: "Note", "Heads up", "Don't". The kind is always said in words as well as colour.
**Don't** nest code blocks or lists inside; if the aside needs them, it is a section.
