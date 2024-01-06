import { builtinModules } from 'module';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy-assets';

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  plugins: [svelte()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        dir: 'dist'
      },
      plugins: [
        copy({
          assets: [
            "assets/audio",
          ]
        })
      ],
      external: [
        ...builtinModules, 
        ...builtinModules.map((m) => `node:${m}`)
      ]
    }
  }
})