import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

const config: UserConfig = {
	plugins: [sveltekit(), purgeCss()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	define: {
        'process.env.ANCHOR_BROWSER': true
    },
	optimizeDeps: {
		include: ['sql.js-httpvfs']
	},
	ssr: {
		noExternal: ['sql.js-httpvfs']
	}
};

export default config;
