// Local post editor: a tiny Node server that lists, edits and creates the
// Markdown posts in src/content/blog/. It only reads and writes files there;
// it never runs git. Start it with `npm run editor`.
//
// It is not part of the site: Astro only builds src/ and public/, and this
// server binds to 127.0.0.1 so nothing outside this machine can reach it.

import { createServer } from 'node:http';
import { open, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter, serializePost, splitPost } from './frontmatter.mjs';

const HOST = '127.0.0.1';
const PORT = Number(process.env.POST_EDITOR_PORT) || 4322;

const TOOL_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(TOOL_DIR, '..', '..');
const BLOG_DIR = join(REPO_ROOT, 'src', 'content', 'blog');
const ASSETS_DIR = join(REPO_ROOT, 'public', 'assets');

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const POST_EXT = new Set(['.md', '.mdx']);

const STATIC_FILES = {
	'/': ['index.html', 'text/html; charset=utf-8'],
	'/editor.css': ['editor.css', 'text/css; charset=utf-8'],
	'/editor.js': ['editor.js', 'text/javascript; charset=utf-8'],
};
const ASSET_TYPES = { '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };

class HttpError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}

// Resolves a post file name from the catalogue (e.g. `hello-world.md` or
// `notes/first.md`) to a path inside BLOG_DIR, refusing anything that escapes it.
function postPath(file) {
	if (typeof file !== 'string' || file === '') throw new HttpError(400, 'Missing file name.');
	const full = resolve(BLOG_DIR, file);
	if (!full.startsWith(BLOG_DIR + sep) || !POST_EXT.has(extname(full))) {
		throw new HttpError(400, `Not a post file: ${file}`);
	}
	return full;
}

async function listPostFiles(dir = BLOG_DIR) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) files.push(...(await listPostFiles(full)));
		else if (POST_EXT.has(extname(entry.name))) files.push(full);
	}
	return files;
}

// Same formula as src/lib/reading-time.ts (words ÷ 220, +1).
function readingTimeMinutes(body) {
	const words = body.trim().split(/\s+/).filter(Boolean).length;
	return Math.floor(words / 220) + 1;
}

async function readPost(full) {
	const [text, info] = await Promise.all([readFile(full, 'utf8'), stat(full)]);
	const { yaml, body } = splitPost(text);
	const { data, extra } = parseFrontmatter(yaml);
	return {
		file: relative(BLOG_DIR, full).split(sep).join('/'),
		data: {
			title: data.title ?? '',
			description: data.description ?? '',
			pubDate: data.pubDate ?? '',
			updatedDate: data.updatedDate ?? '',
			heroImage: data.heroImage ?? '',
			tags: data.tags ?? [],
			draft: data.draft === true,
		},
		extra,
		body,
		minutes: readingTimeMinutes(body),
		mtimeMs: info.mtimeMs,
	};
}

// Mirrors the `blog` schema in src/content.config.ts. The editor writes dates as
// ISO `YYYY-MM-DD` (the design system's date rule); keep this in step with the
// schema if it changes. `npm run build` is the final check.
function validate(input, postDir) {
	const errors = [];
	const str = (v) => (typeof v === 'string' ? v.trim() : '');
	const data = {
		title: str(input?.title),
		description: str(input?.description),
		pubDate: str(input?.pubDate),
		updatedDate: str(input?.updatedDate),
		heroImage: str(input?.heroImage),
		tags: Array.isArray(input?.tags) ? input.tags.map(str).filter(Boolean) : null,
		draft: input?.draft === true,
	};
	if (!data.title) errors.push('Title is required.');
	if (!data.description) errors.push('Description is required.');
	for (const [key, label, required] of [
		['pubDate', 'Publish date', true],
		['updatedDate', 'Updated date', false],
	]) {
		const v = data[key];
		if (!v && !required) continue;
		if (!ISO_DATE.test(v) || Number.isNaN(new Date(v).getTime()) || new Date(v).toISOString().slice(0, 10) !== v) {
			errors.push(`${label} must be a date in YYYY-MM-DD form.`);
		}
	}
	if (data.tags === null) errors.push('Tags must be a list of strings.');
	else data.tags = [...new Set(data.tags)];
	return { data, errors, heroImagePath: data.heroImage ? resolve(postDir, data.heroImage) : null };
}

async function exists(path) {
	try {
		await stat(path);
		return true;
	} catch {
		return false;
	}
}

async function readJson(req) {
	if (!(req.headers['content-type'] ?? '').startsWith('application/json')) {
		throw new HttpError(415, 'Expected a JSON body.');
	}
	let raw = '';
	for await (const chunk of req) {
		raw += chunk;
		if (raw.length > 5_000_000) throw new HttpError(413, 'Post is too large.');
	}
	try {
		return JSON.parse(raw);
	} catch {
		throw new HttpError(400, 'Body is not valid JSON.');
	}
}

async function savePost(payload) {
	const creating = payload?.mode === 'create';
	let full;
	if (creating) {
		const slug = typeof payload.slug === 'string' ? payload.slug.trim() : '';
		if (!SLUG.test(slug)) {
			throw new HttpError(400, 'File name must be lowercase letters, digits and single hyphens, e.g. my-first-post.');
		}
		full = postPath(`${slug}.md`);
	} else {
		full = postPath(payload?.file);
		if (!(await exists(full))) throw new HttpError(404, `No such post: ${payload.file}`);
	}

	const { data, errors, heroImagePath } = validate(payload?.data, dirname(full));
	if (heroImagePath && !(await exists(heroImagePath))) {
		errors.push(`Hero image not found at ${relative(REPO_ROOT, heroImagePath)} (paths are relative to the post file).`);
	}
	if (typeof payload?.body !== 'string') errors.push('Body must be text.');
	if (errors.length) throw new HttpError(422, errors.join(' '));

	const extra = Array.isArray(payload.extra) ? payload.extra.filter((l) => typeof l === 'string') : [];
	const text = serializePost({ data, extra, body: payload.body });

	if (creating) {
		// `wx` fails if the file exists, so a new post never overwrites another.
		let handle;
		try {
			handle = await open(full, 'wx');
		} catch (err) {
			if (err.code === 'EEXIST') {
				throw new HttpError(409, `${relative(BLOG_DIR, full)} already exists. Pick another file name or edit that post.`);
			}
			throw err;
		}
		try {
			await handle.writeFile(text, 'utf8');
		} finally {
			await handle.close();
		}
	} else {
		// Refuse to overwrite changes made to the file since it was opened here.
		const current = await stat(full);
		if (typeof payload.mtimeMs === 'number' && current.mtimeMs !== payload.mtimeMs) {
			throw new HttpError(409, 'The file changed on disk since you opened it. Reload the post before saving.');
		}
		await writeFile(full, text, 'utf8');
	}
	return readPost(full);
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
	res.writeHead(status, {
		'Content-Type': type,
		'Cache-Control': 'no-store',
		'X-Content-Type-Options': 'nosniff',
	});
	res.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
}

// Only answer requests addressed to this machine, so a web page on another
// origin cannot reach the server through DNS rebinding or a cross-site POST.
function isLocalRequest(req) {
	const allowed = [`127.0.0.1:${PORT}`, `localhost:${PORT}`];
	if (!allowed.includes(req.headers.host)) return false;
	const origin = req.headers.origin;
	return !origin || allowed.some((h) => origin === `http://${h}`);
}

async function handle(req, res) {
	if (!isLocalRequest(req)) throw new HttpError(403, 'Forbidden.');
	const url = new URL(req.url, `http://${req.headers.host}`);

	if (req.method === 'GET' && STATIC_FILES[url.pathname]) {
		const [name, type] = STATIC_FILES[url.pathname];
		return send(res, 200, await readFile(join(TOOL_DIR, name)), type);
	}
	if (req.method === 'GET' && url.pathname.startsWith('/assets/')) {
		const full = resolve(ASSETS_DIR, `.${url.pathname.slice('/assets'.length)}`);
		const type = ASSET_TYPES[extname(full)];
		if (!full.startsWith(ASSETS_DIR + sep) || !type || !(await exists(full))) throw new HttpError(404, 'Not found.');
		return send(res, 200, await readFile(full), type);
	}
	if (req.method === 'GET' && url.pathname === '/api/posts') {
		const posts = await Promise.all((await listPostFiles()).map(readPost));
		posts.sort((a, b) => String(b.data.pubDate).localeCompare(String(a.data.pubDate)));
		return send(res, 200, posts.map(({ body, extra, ...summary }) => summary));
	}
	if (req.method === 'GET' && url.pathname === '/api/post') {
		const full = postPath(url.searchParams.get('file'));
		if (!(await exists(full))) throw new HttpError(404, 'No such post.');
		return send(res, 200, await readPost(full));
	}
	if (req.method === 'POST' && url.pathname === '/api/post') {
		const post = await savePost(await readJson(req));
		return send(res, 200, post);
	}
	throw new HttpError(404, 'Not found.');
}

const server = createServer((req, res) => {
	handle(req, res).catch((err) => {
		const status = err instanceof HttpError ? err.status : 500;
		if (status === 500) console.error(err);
		send(res, status, { error: status === 500 ? 'Internal error; see the terminal.' : err.message });
	});
});

server.listen(PORT, HOST, () => {
	console.log(`Post editor running at http://localhost:${PORT}/`);
	console.log(`Posts are read from and saved to ${relative(process.cwd(), BLOG_DIR) || BLOG_DIR}`);
	console.log('Review saved posts with git and commit them yourself. Ctrl+C stops the editor.');
});
