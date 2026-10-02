## Design system

This site is built on the "Neon Terminal" design system. Any UI work (markup, CSS, new
pages or components) must follow `design-system/README.md` and each component's
`design-system/components/<Name>/README.md`, using only the system's tokens
(`design-system/tokens.json`), components and icons (`design-system/assets/Icons/`) —
never hand-drawn colors, spacing or icons. If the design itself needs to change, change
`design-system/` first, then update the site to match.

## Design review enforcement

Before finishing any change that touches UI or content — anything under
`src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, `src/content/`,
`public/assets/`, or `design-system/` itself — have a **separate** sub-agent
review the change against `design-system/README.md` and the touched
components' own READMEs. Don't self-review; the reviewer must not be the same
agent that wrote the change, and should run the most capable ("high-performing")
model available, not necessarily the same model that implemented the change.
In Claude Code this is the `design-reviewer` sub-agent
(`.claude/agents/design-reviewer.md`, pinned to a top-tier model), and a
project Stop hook
(`.claude/hooks/check-design-review.sh`) blocks finishing the task until that
review has been recorded for the current state of those paths. Any other tool
or workflow touching this repo should follow the same review-then-record
practice even where that hook doesn't run.

## Where things live

- `design-system/` — the Neon Terminal design system source (tokens, component docs/previews, icons, marks, giscus theme). Read-only reference; the site's own copies below are generated/shipped from it.
- `public/assets/` — the compiled `tokens.css` and `blog.css` stylesheets, icons, marks and the giscus theme file, shipped as static files.
- `src/components/` — `Header.astro` (SiteHeader), `Footer.astro`, `Comments.astro`, `PostList.astro` (PostCard list).
- `src/layouts/BlogPost.astro` — the post/page shell (SiteHeader, PostHeader, Prose, PostNav, Comments, Footer).
- `src/pages/` — routes: `index.astro`, `blog/index.astro`, `blog/[...slug].astro`, `tags/index.astro`, `tags/[tag].astro`, `about.astro`, `rss.xml.js`.
- `src/content/blog/` — post Markdown content.
- `src/shiki/`, `src/plugins/` — the custom Shiki theme and rehype plugin that map code blocks onto the CodeBlock component.
- `src/styles/global.css` — a minimal reset layered under `public/assets/blog.css`; not the site's look.
- `src/lib/reading-time.ts` — shared words-per-minute helper used by post pages and PostCard lists.
- `src/consts.ts` — the site title and description, unchanged by the redesign.
- `astro.config.mjs` — site config: integrations, and the Shiki/rehype setup that wires code blocks to CodeBlock.
- `.github/workflows/deploy.yml` — builds and deploys the site to GitHub Pages.
- `.claude/agents/design-reviewer.md`, `.claude/hooks/check-design-review.sh` — the design-review sub-agent and the Stop hook that enforces it (see "Design review enforcement" above).

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
