import { visit } from 'unist-util-visit';

// Wraps each Shiki-highlighted <pre class="astro-code" data-language="..."> block
// in the Neon Terminal CodeBlock wrapper: <div class="nt-code" data-lang="...">,
// and each Markdown <table> in <div class="nt-table-wrap"> so a wide table
// scrolls inside itself instead of widening the page (Prose README).
export default function rehypeNtCode() {
	return (tree) => {
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'pre' || !parent || typeof index !== 'number') return;
			const classAttr = node.properties?.class;
			const classes = typeof classAttr === 'string' ? classAttr.split(/\s+/) : [];
			if (!classes.includes('astro-code')) return;

			const lang = node.properties?.dataLanguage;
			const wrapper = {
				type: 'element',
				tagName: 'div',
				properties: {
					class: 'nt-code',
					...(lang && lang !== 'plaintext' ? { dataLang: lang } : {}),
				},
				children: [node],
			};
			parent.children[index] = wrapper;
		});

		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'table' || !parent || typeof index !== 'number') return;

			const wrapper = {
				type: 'element',
				tagName: 'div',
				properties: { class: 'nt-table-wrap' },
				children: [node],
			};
			parent.children[index] = wrapper;
		});
	};
}
