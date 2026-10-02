## Design system

This site is built on the "Neon Terminal" design system. Any UI work (markup, CSS, new
pages or components) must follow `design-system/README.md` and each component's
`design-system/components/<Name>/README.md`, using only the system's tokens
(`design-system/tokens.json`), components and icons (`design-system/assets/Icons/`) —
never hand-drawn colors, spacing or icons. If the design itself needs to change, change
`design-system/` first, then update the site to match.

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
