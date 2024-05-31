import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { viteStaticCopy } from 'vite-plugin-static-copy'

const config: UserConfig = {
	assetsInclude: ['**/*.sqlite'],
	plugins: [sveltekit(), purgeCss(),viteStaticCopy({
		targets: [
		  {
			src: 'node_modules/sql.js-httpvfs/dist/sqlite.worker.js',
			dest: 'assets'
		  },
		  {
			src: 'node_modules/sql.js-httpvfs/dist/sql-wasm.wasm',
			dest: 'assets'
		  },
		  {
			src: '/home/alfi/Projects/hadith-db/database/*',
			dest: 'assets'
		  }
		]
	  })],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
