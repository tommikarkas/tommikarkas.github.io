# tommikarkas.github.io

Personal engineering blog, built with [Astro](https://astro.build) and deployed to GitHub Pages.

Live at: https://tommikarkas.github.io

## Writing a post

Add a Markdown (or MDX) file under `src/content/blog/`, e.g. `src/content/blog/my-post.md`:

```md
---
title: "My post title"
description: "One sentence summary."
pubDate: 2026-10-02
tags: ["astro", "notes"]
draft: false
---

Post content goes here.
```

Frontmatter fields:

- `title`, `description`, `pubDate` — required.
- `updatedDate` — optional, shown as "last updated" on the post.
- `tags` — optional list of strings; each tag gets a `/tags/<tag>/` listing page.
- `draft` — defaults to `false`. Set to `true` while writing; draft posts are excluded from
  the blog index, RSS feed, sitemap, and the production build, but are visible in `npm run dev`.

Code blocks are syntax-highlighted via a custom Neon Terminal Shiki theme (`src/shiki/`),
wrapped by a rehype plugin (`src/plugins/rehype-nt-code.mjs`).

## Running locally

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # production build to ./dist
npm run preview   # serve the production build locally
```

## Deploying

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys the site to
GitHub Pages on every push to `main`, and can also be run manually from the Actions tab.

To enable it on a fresh repo: **Settings → Pages → Source: GitHub Actions**. No other
configuration is needed — the workflow already requests the `pages: write` / `id-token: write`
permissions GitHub Pages deployment needs.

## Comments

Post comments are powered by [giscus](https://giscus.app/) backed by GitHub Discussions.
Comments are configured in `src/components/Comments.astro` and styled with `public/assets/giscus.css`.

## Design and UI

The site uses the "Neon Terminal" design system. For design rules, tokens, and component
documentation, see `design-system/` and the UI guidelines in `AGENTS.md`.

## Possible later additions

- Analytics — none configured yet, add only if/when wanted.
