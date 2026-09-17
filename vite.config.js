import { defineConfig } from 'vite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const slugs = existsSync('scripts/.pages.json') ? JSON.parse(readFileSync('scripts/.pages.json', 'utf8')) : [''];

export default defineConfig({
  // '/' locally, '/aurum-fitness/' for the GitHub Pages project site.
  base: process.env.BASE_PATH || '/',
  build: {
    target: 'es2022',
    rollupOptions: {
      input: Object.fromEntries(slugs.map((s) => [s || 'home', resolve(s, 'index.html')])),
    },
  },
  server: { host: true },
});
