import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig(({ mode }) => ({
  // dev stays at /, while build and preview use the GitHub Pages project path
  base: mode === 'production' ? '/gacha-calc/' : '/',
  plugins: [svelte()],
  server: { port: 5173 },
  preview: { port: 4173 },
  test: {
    include: ['src/**/*.test.js'],
    environment: 'node',
  },
}));
