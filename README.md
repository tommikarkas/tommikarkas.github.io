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

### Local post editor

Instead of writing the file by hand, you can use the local editor:

```sh
npm run editor    # http://localhost:4322
```

It lists the posts in `src/content/blog/` (title, date, draft state, file name), opens one to
edit, or starts a new one, with a field for each front matter key and a Markdown body. Save
writes the `.md` file into `src/content/blog/`; a new post never overwrites an existing file,
and its file name must be lowercase letters, digits and hyphens. Fields are checked against
the content schema before saving, and `npm run build` is the final check.

The editor only writes files: review the change with `git diff`, then commit and push it
yourself. It listens on `127.0.0.1` only (set `POST_EDITOR_PORT` to change the port), needs
no extra dependencies, and lives in `tools/post-editor/`, outside what Astro builds, so it is
never part of the published site.

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
