// Maps Shiki's token scopes onto the Neon Terminal CodeBlock's five syntax
// colours (magenta keywords, green strings, cyan functions, amber numbers,
// dim italic comments). Everything else falls back to editor.foreground (ink-100).
export const neonTerminalShikiTheme = {
	name: 'neon-terminal',
	type: 'dark',
	colors: {
		'editor.background': '#121622',
		'editor.foreground': '#e8ebf4',
	},
	tokenColors: [
		{
			scope: ['comment', 'punctuation.definition.comment'],
			settings: { foreground: '#6e7892', fontStyle: 'italic' },
		},
		{
			scope: [
				'keyword',
				'storage.type',
				'storage.modifier',
				'keyword.control',
				'keyword.operator.new',
				'constant.language',
				'variable.language.this',
			],
			settings: { foreground: '#ff4fd2' },
		},
		{
			scope: ['string', 'string.quoted', 'punctuation.definition.string'],
			settings: { foreground: '#5ff2a8' },
		},
		{
			scope: [
				'entity.name.function',
				'support.function',
				'meta.function-call',
				'variable.function',
			],
			settings: { foreground: '#3ce0ff' },
		},
		{
			scope: ['constant.numeric'],
			settings: { foreground: '#ffcb47' },
		},
	],
};
