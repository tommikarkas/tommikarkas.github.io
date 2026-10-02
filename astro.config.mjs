// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeNtCode from './src/plugins/rehype-nt-code.mjs';
import { neonTerminalShikiTheme } from './src/shiki/neon-terminal-theme.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://tommikarkas.github.io',
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			theme: neonTerminalShikiTheme,
			wrap: false,
		},
		rehypePlugins: [rehypeNtCode],
	},
});
