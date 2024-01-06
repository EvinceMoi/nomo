import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  compilerOpionts: {
    dev: true
  },
  preprocess: vitePreprocess(),
  onwarn: (warning, handler) => {
    if (warning.code.startsWith('a11y-')) return;
    handler(warning);
  },
};