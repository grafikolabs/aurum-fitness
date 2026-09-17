// Visual QA: renders pages in Chromium (WebGL via SwiftShader) and captures each chapter.
// Usage: node scripts/screenshot.mjs [url] [outDir] [--mobile] [--only=hero,pillars]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const url = args.find((a) => a.startsWith('http')) ?? 'http://localhost:5173/';
const out = args.find((a) => !a.startsWith('http') && !a.startsWith('--')) ?? 'screens';
const mobile = args.includes('--mobile');
const only = args.find((a) => a.startsWith('--only='))?.slice(7).split(',');
const full = args.includes('--full');
mkdirSync(out, { recursive: true });

// --gpu renders on the machine's real GPU at 2x density (closest to a Retina laptop);
// the default uses SwiftShader, which works everywhere but is slow.
const gpu = args.includes('--gpu');
const browser = await chromium.launch({ args: gpu ? ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] : ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({
  viewport: mobile ? { width: 390, height: 844 } : gpu ? { width: 1280, height: 800 } : { width: 1440, height: 900 },
  deviceScaleFactor: gpu ? 2 : 1,
  hasTouch: mobile,
  isMobile: mobile,
});
const logs = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) logs.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));

await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => document.documentElement.classList.contains('is-loaded'), null, { timeout: 30000 }).catch(() => logs.push('never loaded'));
await page.waitForTimeout(2500);

const prefix = mobile ? 'm-' : '';
if (full) {
  await page.screenshot({ path: `${out}/${prefix}full.png`, fullPage: true });
} else {
  // Detect the home page by its content, not its path (a project Pages site lives under a sub-path).
  const isHome = (await page.$('[data-scene="pillars"]')) !== null;
  const stops = !isHome
    ? await page.evaluate(() => Array.from({ length: Math.min(10, Math.ceil(document.documentElement.scrollHeight / (innerHeight * 0.95))) }, (_, i) => [`step-${i}`, Math.round(i * innerHeight * 0.95)]))
    : await page.evaluate(() => {
    const y = (sel, f = 0) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const top = el.getBoundingClientRect().top + scrollY;
      return Math.round(top + (el.offsetHeight - innerHeight) * f);
    };
    const s = [
      ['hero', 0], ['stats', y('.stats') - 100], ['about', y('.about') + 60],
      ['pillars-0', y('.pillars', 0)], ['pillars-3', y('.pillars', 0.62)],
      ['recovery', y('.recovery') + 80], ['recovery-grid', y('.recovery__layout') - 120],
      ['film-mask', y('.film', 0.25)], ['film-open', y('.film', 0.85)],
      ['membership', y('.membership') + 60],
      ['training-0', y('.training', 0)], ['training-4', y('.training', 1)],
      ['stories', y('.stories') + 40], ['stories-mid', y('.stories') + 500], ['clubs', y('.clubs') + 40],
      ['club-2', y('[data-club="health"]') - 300], ['club-5', y('[data-club="brigade"]') - 200], ['pre-faq', y('.faq') - 450], ['faq', y('.faq')], ['journal', y('.journal')], ['contact', y('.join')],
      ['footer', document.documentElement.scrollHeight],
    ];
    return s.filter(([, v]) => v !== null && !Number.isNaN(v));
  });
  for (const [name, yPos] of stops) {
    if (only && !only.some((o) => name.startsWith(o))) continue;
    await page.evaluate((v) => {
      const l = window.__aurum?.lenis;
      if (l) l.scrollTo(v, { immediate: true, force: true }); else window.scrollTo(0, v);
    }, yPos);
    // SwiftShader renders a few frames per second, so settle the damped camera explicitly.
    await page.waitForTimeout(300);
    await page.evaluate(() => { const a = window.__aurum; if (a) { a.director.update(); a.stage.jump(); } });
    await page.waitForTimeout(2600);
    await page.screenshot({ path: `${out}/${prefix}${name}.png` });
  }
}
console.log(logs.length ? logs.join('\n') : 'no console errors');
await browser.close();
