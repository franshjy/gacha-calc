import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig(({ mode }) => ({
  // Cloudflare Pages serves this project from the site root, GitHub Pages from
  // /gacha-calc/. Both are production builds, so the host is detected rather
  // than the mode: CF_PAGES is set by Cloudflare's build image only.
  base: (process.env.CF_PAGES || mode !== 'production') ? '/' : '/gacha-calc/',
  plugins: [svelte()],
  server: { port: 5173 },
  preview: { port: 4173 },
  test: {
    include: ['src/**/*.test.js'],
    environment: 'node',
  },
}));
