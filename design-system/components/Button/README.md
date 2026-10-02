A square, mono-labelled control: solid `cyan-500` with `on-accent` text, or a ghost outline (`nt-ghost`) in cyan on the page ground. The site has very few actions, so one button on a page is normal and two is the maximum.

**Use** `<a class="nt-btn">` for navigation (pagination, "back to top", a download) and `<button>` only for something a script handles. `disabled` dims it to `bg-200` / `ink-300` without a glow.

**Provide** an uppercase-able label of one to three words and optionally a 16px icon from `assets/Icons/` before or after it (on the solid button the icon is rendered dark by CSS).

**Do** keep the 44px `tap` height and let buttons stretch full-width on phones when they are the page's one action (`style="width:100%"` or a grid).
**Don't** round the corners or add a gradient. The glow on hover is the only effect.
