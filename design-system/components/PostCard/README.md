One entry in the post list: date and reading time as an eyebrow, the title, a one-sentence excerpt and the tags. The whole card is a single link, so a thumb anywhere on it opens the post.

**Use** inside `<ul class="nt-post-list">` on the index and tag pages. On phones the four parts stack; from 768px the eyebrow moves into a 7.5rem column on the left and the dates line up (`tabular-nums` is on by default in `.nt-eyebrow` via the mono face).

**Provide** a `<time datetime>` in ISO form, the reading time (compute it: words ÷ 220), an `h3` title, one excerpt sentence from the front matter (not an auto-truncated first paragraph) and the tags as non-link `<span class="nt-tag">`, because a link inside a link is invalid HTML.

**Do** keep titles under 70 characters so they fit two lines at 360px. Rows separate with a `line-100` hairline, not cards.
**Don't** add a thumbnail; the list stays text so it loads fast on mobile data. Don't show more than 15 entries per page; paginate with `Button`.
