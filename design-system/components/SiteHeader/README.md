The site header: mark, blog name and a flat nav of three or four links. It wraps to two rows on phones and sits on one row from about 480px up; nothing is hidden behind a hamburger.

**Use** once per page, inside `.nt-wrap-wide`, before the page's `main`.

**Provide** the mark (`assets/Marks/nt-mark.svg`, 24px), the name split so the second word takes `<b>` (it renders in `cyan-500`), and a `<ul class="nt-nav">` of plain links. Mark the current page with `aria-current="page"`; that is what paints the cyan underline and glow, so set it from your templating (Jekyll: compare `page.url`).

**Do** keep it to four links or fewer, so it still fits two rows at 360px. Every link is a 44px tap target (`tap`).
**Don't** make it sticky; on a phone a sticky header eats a fifth of the screen while reading. Don't add a search box here; link to a search page instead.
