// Reads and writes the YAML front matter of a blog post, limited to the shapes
// the `blog` collection schema in src/content.config.ts uses: string, date and
// boolean scalars plus a string list for `tags`. Keys the editor does not know
// about are kept verbatim so saving a post never drops them.

export const FIELDS = ['title', 'description', 'pubDate', 'updatedDate', 'heroImage', 'tags', 'draft'];

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function splitPost(text) {
	const match = text.match(FENCE);
	if (!match) return { yaml: '', body: text };
	return { yaml: match[1], body: text.slice(match[0].length) };
}

function parseScalar(raw) {
	const value = raw.trim();
	if (value === '' || value === '~' || value === 'null') return null;
	if (value === 'true') return true;
	if (value === 'false') return false;
	if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
		try {
			return JSON.parse(value);
		} catch {
			return value.slice(1, -1);
		}
	}
	if (value.startsWith("'") && value.endsWith("'") && value.length >= 2) {
		return value.slice(1, -1).replaceAll("''", "'");
	}
	// Strip a trailing comment from a plain scalar.
	return value.replace(/\s+#.*$/, '');
}

function parseInlineList(raw) {
	const inner = raw.trim().slice(1, -1).trim();
	if (inner === '') return [];
	const items = [];
	const itemPattern = /\s*("(?:[^"\\]|\\.)*"|'(?:[^']|'')*'|[^,]+)\s*(?:,|$)/g;
	for (const m of inner.matchAll(itemPattern)) {
		const item = parseScalar(m[1]);
		if (item !== null) items.push(String(item));
	}
	return items;
}

// Returns { data, extra } where `data` holds the schema fields and `extra` the
// raw YAML lines of any other keys, in their original order.
export function parseFrontmatter(yaml) {
	const data = {};
	const extra = [];
	const lines = yaml.split(/\r?\n/);
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const keyMatch = line.match(/^([A-Za-z_][\w-]*)\s*:(.*)$/);
		if (!keyMatch) continue;
		const [, key, rest] = keyMatch;
		// A key's block is its own line plus any following indented or list lines.
		const block = [line];
		while (i + 1 < lines.length && /^(\s+|-\s|-$)/.test(lines[i + 1])) {
			block.push(lines[++i]);
		}
		if (!FIELDS.includes(key)) {
			extra.push(...block);
			continue;
		}
		if (key === 'tags') {
			if (rest.trim().startsWith('[')) {
				data.tags = parseInlineList(rest);
			} else {
				data.tags = block
					.slice(1)
					.map((l) => l.match(/^\s*-\s*(.*)$/))
					.filter(Boolean)
					.map((m) => parseScalar(m[1]))
					.filter((v) => v !== null)
					.map(String);
			}
			continue;
		}
		const blockScalar = rest.trim().match(/^([>|])[-+]?$/);
		if (blockScalar) {
			const parts = block.slice(1).map((l) => l.trim());
			data[key] = parts.join(blockScalar[1] === '>' ? ' ' : '\n').trim();
			continue;
		}
		const value = parseScalar(rest);
		if (value !== null) data[key] = value;
	}
	return { data, extra };
}

// YAML accepts JSON strings as double-quoted scalars, so JSON.stringify gives
// correct escaping for any title or description.
const quote = (s) => JSON.stringify(s);

export function serializePost({ data, extra = [], body }) {
	const out = [];
	out.push(`title: ${quote(data.title)}`);
	out.push(`description: ${quote(data.description)}`);
	out.push(`pubDate: ${data.pubDate}`);
	if (data.updatedDate) out.push(`updatedDate: ${data.updatedDate}`);
	if (data.heroImage) out.push(`heroImage: ${quote(data.heroImage)}`);
	out.push(`tags: [${data.tags.map(quote).join(', ')}]`);
	out.push(`draft: ${data.draft ? 'true' : 'false'}`);
	out.push(...extra);
	const text = body.replace(/\r\n/g, '\n').replace(/^\n+/, '');
	return `---\n${out.join('\n')}\n---\n\n${text.endsWith('\n') || text === '' ? text : `${text}\n`}`;
}
