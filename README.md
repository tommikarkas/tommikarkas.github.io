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

Code blocks are syntax-highlighted via Astro's built-in Shiki, with separate light/dark themes
that follow the site's theme toggle.

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

## Possible later additions

- Comments via [giscus](https://giscus.app/) (GitHub Discussions-backed, no server needed).
- Analytics — none configured yet, add only if/when wanted.
