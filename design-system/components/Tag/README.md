A topic label in the mono face, `magenta-500` on a `line-200` outline, prefixed with a dim `#`. The tag is the one place magenta appears as text, which is what makes it findable on a page of cyan links.

**Use** as `<a class="nt-tag">` on the post header and the tags page, and as `<span class="nt-tag">` inside a `PostCard` (where it cannot be a link). Mark the tag page's own tag with `aria-current="true"`: it fills magenta with `on-accent` text.

**Provide** the tag text in lowercase, one word or a hyphenated pair; the `#` is drawn by CSS, so do not type it.

**Do** add `nt-tap` when tags are the primary control on a page (the tags index), which lifts them to the 44px `tap` height. Group tags in `<ul class="nt-tags">` so they wrap with an 8px gap.
**Don't** colour-code tags by topic; one hue, or the list turns into confetti.
