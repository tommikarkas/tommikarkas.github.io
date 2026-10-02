Previous and next post links at the end of an article. Two bordered cells that stack on phones and sit side by side from 768px; each is a single tap target.

**Use** once, after the article and before `Comments`, inside `.nt-wrap`.

**Provide** the two links with `nt-prev` / `nt-next`, each holding an eyebrow ("Previous" / "Next") and the post title in `<strong>`. Add `nt-no-prompt` to the next eyebrow: its prompt glyph is drawn after the word, pointing onward. When there is no previous or next post, omit that cell rather than rendering a disabled one.

**Do** show full titles; the cells grow.
**Don't** add dates or excerpts here; the reader has just finished one post and only needs a direction.
