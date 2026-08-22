// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import { DEFAULT_LOCALE_SETTING, LOCALES_SETTING } from './src/locales';
// https://astro.build/config
export default defineConfig({
	site: 'https://logiaabierta.com/',
	integrations: [mdx(), icon(), sitemap()],
	image: {
  domains: ["cdn.sanity.io", "pub-490f1c18b67d44e4968672517297f4c8.r2.dev"],
  dangerouslyProcessSVG: true,
},
	vite: {
		plugins: [tailwindcss()],
		build: {
			// Mermaid is intentionally lazy-loaded only on pages that render charts.
			chunkSizeWarningLimit: 750,
		},
	},
	i18n: {
		defaultLocale: DEFAULT_LOCALE_SETTING,
		locales: Object.keys(LOCALES_SETTING),
		routing: {
			prefixDefaultLocale: true,
			//redirectToDefaultLocale: false,
		},
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
