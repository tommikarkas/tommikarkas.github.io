// Client for the local post editor. Two views, picked by the URL hash:
//   #/            the catalogue of posts
//   #/new         a new post
//   #/edit/<file> an existing post

const $ = (sel) => document.querySelector(sel);
const form = $('#post-form');
const f = form.elements;
let current = null; // the post being edited: { file, extra, mtimeMs } or null for a new post
let dirty = false;

const today = () => new Date().toISOString().slice(0, 10);

function el(tag, attrs = {}, ...children) {
	const node = document.createElement(tag);
	for (const [k, v] of Object.entries(attrs)) {
		if (k === 'class') node.className = v;
		else node.setAttribute(k, v);
	}
	node.append(...children.filter((c) => c !== null && c !== undefined));
	return node;
}

function icon(name) {
	return el('img', { src: `/assets/icons/${name}.svg`, width: '16', height: '16', alt: '' });
}

// Callout kinds per the design system: note (cyan), warn (amber), danger (red).
function callout(target, kind, title, message) {
	const iconName = { note: 'help', warn: 'alert', danger: 'cross' }[kind];
	const cls = kind === 'note' ? 'nt-callout' : `nt-callout nt-${kind}`;
	target.replaceChildren(
		el('aside', { class: cls, role: kind === 'danger' ? 'alert' : 'status' },
			el('p', { class: 'nt-eyebrow' }, icon(iconName), title),
			el('p', {}, message)),
	);
}

async function api(path, options) {
	const res = await fetch(path, options);
	const body = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(body.error || `Request failed (${res.status}).`);
	return body;
}

function setNav(which) {
	for (const a of document.querySelectorAll('[data-nav]')) {
		if (a.dataset.nav === which) a.setAttribute('aria-current', 'page');
		else a.removeAttribute('aria-current');
	}
}

function show(view) {
	$('#view-list').hidden = view !== 'list';
	$('#view-edit').hidden = view !== 'edit';
	window.scrollTo(0, 0);
}

async function renderList() {
	show('list');
	setNav('list');
	document.title = 'Posts · Post editor';
	const list = $('#post-list');
	const status = $('#list-status');
	status.replaceChildren();
	list.replaceChildren();
	let posts;
	try {
		posts = await api('/api/posts');
	} catch (err) {
		callout(status, 'danger', 'Could not load posts', err.message);
		return;
	}
	if (posts.length === 0) {
		list.append(el('li', { class: 'ed-empty' }, 'No posts yet.'));
		return;
	}
	for (const post of posts) {
		const d = post.data;
		const tags = d.tags.length
			? el('ul', { class: 'nt-tags' }, ...d.tags.map((t) => el('li', {}, el('span', { class: 'nt-tag' }, t))))
			: null;
		list.append(
			el('li', { class: 'nt-post-card' },
				el('a', { class: 'nt-post-link', href: `#/edit/${encodeURIComponent(post.file)}` },
					el('span', { class: 'nt-eyebrow' },
						el('time', { datetime: d.pubDate }, d.pubDate || 'no date'), ` · ${post.minutes} min`),
					el('h3', {}, d.title || '(untitled)', d.draft ? el('span', { class: 'nt-badge' }, 'Draft') : null),
					d.description ? el('p', {}, d.description) : null,
					el('p', { class: 'ed-file' }, post.file),
					tags)),
		);
	}
}

function fillForm(data, body) {
	f.title.value = data.title;
	f.description.value = data.description;
	f.pubDate.value = data.pubDate;
	f.updatedDate.value = data.updatedDate;
	f.heroImage.value = data.heroImage;
	f.tags.value = data.tags.join(', ');
	f.draft.checked = data.draft;
	f.body.value = body;
	dirty = false;
}

function slugify(text) {
	return text
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60)
		.replace(/-+$/, '');
}

let slugTouched = false;

function renderNew() {
	show('edit');
	setNav('new');
	document.title = 'New post · Post editor';
	current = null;
	slugTouched = false;
	$('#edit-eyebrow').textContent = 'New post';
	$('#edit-file').textContent = 'src/content/blog/<file name>.md';
	$('#edit-heading').textContent = 'Write a new post';
	$('#slug-field').hidden = false;
	f.slug.value = '';
	f.slug.removeAttribute('aria-invalid');
	$('#edit-status').replaceChildren();
	fillForm({ title: '', description: '', pubDate: today(), updatedDate: '', heroImage: '', tags: [], draft: true }, '');
	f.title.focus();
}

async function renderEdit(file) {
	show('edit');
	setNav(null);
	$('#slug-field').hidden = true;
	$('#edit-eyebrow').textContent = 'Edit post';
	$('#edit-file').textContent = `src/content/blog/${file}`;
	$('#edit-heading').textContent = 'Loading…';
	const status = $('#edit-status');
	status.replaceChildren();
	try {
		const post = await api(`/api/post?file=${encodeURIComponent(file)}`);
		loadPost(post);
	} catch (err) {
		$('#edit-heading').textContent = 'Could not open post';
		callout(status, 'danger', 'Error', err.message);
	}
}

function loadPost(post) {
	current = { file: post.file, extra: post.extra, mtimeMs: post.mtimeMs };
	$('#edit-file').textContent = `src/content/blog/${post.file}`;
	$('#edit-heading').textContent = post.data.title || '(untitled)';
	document.title = `${post.data.title || post.file} · Post editor`;
	fillForm(post.data, post.body);
}

function collect() {
	return {
		title: f.title.value,
		description: f.description.value,
		pubDate: f.pubDate.value,
		updatedDate: f.updatedDate.value,
		heroImage: f.heroImage.value,
		tags: f.tags.value.split(',').map((t) => t.trim()).filter(Boolean),
		draft: f.draft.checked,
	};
}

form.addEventListener('input', (event) => {
	dirty = true;
	if (event.target === f.slug) {
		slugTouched = true;
		f.slug.removeAttribute('aria-invalid');
	}
	if (event.target === f.title && !current && !slugTouched) f.slug.value = slugify(f.title.value);
});

form.addEventListener('submit', async (event) => {
	event.preventDefault();
	const status = $('#edit-status');
	const button = $('#save-btn');
	const payload = current
		? { mode: 'update', file: current.file, mtimeMs: current.mtimeMs, extra: current.extra }
		: { mode: 'create', slug: f.slug.value.trim() };
	if (!current && !f.slug.checkValidity()) {
		f.slug.setAttribute('aria-invalid', 'true');
		callout(status, 'danger', 'Not saved', 'File name must be lowercase letters, digits and single hyphens, e.g. my-first-post.');
		f.slug.focus();
		return;
	}
	payload.data = collect();
	payload.body = f.body.value;
	button.disabled = true;
	try {
		const post = await api('/api/post', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
		const created = !current;
		loadPost(post);
		if (created) {
			history.replaceState(null, '', `#/edit/${encodeURIComponent(post.file)}`);
			lastHash = location.hash;
		}
		setNav(null);
		$('#slug-field').hidden = true;
		callout(status, 'note', 'Saved',
			`Wrote src/content/blog/${post.file}. Review it with git diff, then commit and push it yourself.`);
	} catch (err) {
		callout(status, 'danger', 'Not saved', err.message);
	} finally {
		button.disabled = false;
	}
});

window.addEventListener('beforeunload', (event) => {
	if (dirty) event.preventDefault();
});

let lastHash = location.hash;
function route() {
	const hash = location.hash || '#/';
	if (dirty && hash !== lastHash && !confirm('Discard unsaved changes?')) {
		history.replaceState(null, '', lastHash || '#/');
		return;
	}
	dirty = false;
	lastHash = hash;
	if (hash === '#/new') renderNew();
	else if (hash.startsWith('#/edit/')) renderEdit(decodeURIComponent(hash.slice('#/edit/'.length)));
	else renderList();
}

window.addEventListener('hashchange', route);
route();
