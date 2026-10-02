A small solid label in `amber-500` (default) or `cyan-500` with `on-accent` text, for a post's publishing state.

**Use** next to a title in `PostHeader` or `PostCard`: `Draft` for posts rendered locally but excluded from the live site, `New` for anything under two weeks old, `Updated <date>` when a post was materially changed after publishing.

**Provide** the text in Title case, and optionally a 12px icon from `assets/Icons/` in front of it (the icons are cyan; `.nt-badge img` renders them dark on the fill).

**Do** keep to those three meanings. A badge is a state, not a category; categories are `Tag`.
**Don't** use `red-500` on a badge. Red is reserved for the danger `Callout` and removed diff lines.
