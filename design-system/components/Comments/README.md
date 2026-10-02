The comments panel at the foot of a post: a titled `bg-100` box that holds the giscus widget and shows a terminal-style "loading comments_" line until the iframe arrives.

**Use** once per post, after `PostNav`, with `id="comments"` so the post header's comment count can link to it. The section is the giscus mount; its `<div class="giscus">` is where the script injects the iframe.

**Provide** the `h2` with the `comment` icon at 20px, the one-sentence note (say that comments live in GitHub Discussions and need a GitHub login), and the giscus `<script>` tag with your repo, category and mapping. Set `data-theme` to the hosted theme file at `assets/Giscus/giscus.css` on your GitHub Pages URL, with `data-theme="transparent_dark"` as the fallback until that file is live; `data-loading="lazy"` so the iframe only loads when scrolled into view; `data-input-position="top"` so the reply box is reachable without scrolling past every comment on a phone. The full snippet is in the Comments section of the brand book.

**Do** keep `color-scheme: dark` on the iframe (set by `bundle.css`) so the browser's scrollbars inside it match.
**Don't** render the panel on the index or tag pages; one Discussion per post is the whole point.
