// Prerenders every page to static HTML (good for SEO) at the same URL slugs as the current
// WordPress site. Vite then treats each generated index.html as a build entry.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { locations } from '../src/data/site.js';
import { homePage } from '../src/templates/home.js';
import { locationPage, trainingPage, weightLossPage, blogPage } from '../src/templates/pages.js';

// Project pages (e.g. GitHub Pages) are served from a sub-path. Vite rewrites <img>/<video>/<link>
// URLs itself using its `base`, so here we only prefix what it leaves alone: navigation links and
// the data-src attributes used for lazily loaded video.
const BASE = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
const withBase = (html) => (BASE === '/' ? html : html
  .replace(/(<a\b[^>]*?\shref)="\/(?!\/)/g, `$1="${BASE}`)
  .replace(/(\sdata-src(?:-hd|-sd)?)="\/(?!\/)/g, `$1="${BASE}`));

export const pages = {
  '': homePage(),
  'personal-training': trainingPage(),
  // The current site serves the same content at /level-1/; keep the URL, canonical to the main page.
  'level-1': trainingPage(),
  'weight-loss': weightLossPage(),
  blog: blogPage(),
  ...Object.fromEntries(locations.map((l) => [l.slug, locationPage(l)])),
};

for (const [slug, html] of Object.entries(pages)) {
  const dir = slug ? slug : '.';
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'index.html'), withBase(html));
}
writeFileSync('scripts/.pages.json', JSON.stringify(Object.keys(pages)));
console.log(`generated ${Object.keys(pages).length} pages`);
