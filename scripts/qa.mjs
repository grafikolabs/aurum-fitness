// Functional QA against a running build (default: `npm run preview` on :4173).
// Checks every page for errors, internal links, the join form, chat, mobile menu and the no-WebGL fallback.
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:4173';
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const results = [];
const ok = (name, pass, info = '') => { results.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${info ? `  (${info})` : ''}`); };

const pages = ['/', '/personal-training/', '/level-1/', '/weight-loss/', '/blog/', '/luxury-gym-in-bangalore-indiranagar/', '/aurum-fitness-lcc/', '/aurum-fitness-community/', '/aurum-fitness-elite/', '/aurum-elite-central/'];
const links = new Set();
for (const path of pages) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('response', (r) => { if (r.status() >= 400) errs.push(`${r.status()} ${r.url()}`); });
  await p.goto(base + path, { waitUntil: 'load' });
  await p.waitForTimeout(3500);
  (await p.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')))).forEach((h) => links.add(h));
  const h1 = await p.$$eval('h1', (h) => h.length);
  ok(`page ${path}: loads, one h1, no errors`, errs.length === 0 && h1 === 1, errs.slice(0, 3).join(' | ') || '');
  await p.close();
}

const home = await b.newPage({ viewport: { width: 1440, height: 900 } });
await home.goto(`${base}/`);
await home.waitForTimeout(2500);
// Links are absolute paths that already include any base prefix, so resolve them against the origin.
const homePath = new URL(`${base}/`.replace(/\/+$/, '/'), 'http://x').pathname;
let broken = 0;
for (const href of links) {
  const target = new URL(href, base);
  const res = await home.request.get(target.origin + target.pathname);
  let pass = res.status() === 200;
  if (target.hash && pass && target.pathname === homePath) pass = (await home.$(target.hash)) !== null;
  if (!pass) { broken++; ok(`link ${href}`, false, `status ${res.status()}`); }
}
ok(`all ${links.size} internal links resolve (incl. #anchors)`, broken === 0);

await home.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return {}; }; });
await home.click('[data-join-form] button[type=submit]', { force: true });
const shown = await home.$$eval('.field__error:not([hidden])', (e) => e.length);
ok('form blocks empty submit with 3 inline errors', shown === 3, `shown=${shown}`);
const focused = await home.evaluate(() => document.activeElement?.id);
ok('focus moves to first invalid field', focused === 'jf-name', focused);
await home.fill('#jf-name', 'Riya Menon');
await home.fill('#jf-phone', '98450 12345');
await home.fill('#jf-email', 'riya@example.com');
await home.selectOption('#jf-club', 'kora');
await home.click('[data-plan="6-month"]', { force: true });
const plan = await home.$eval('#jf-plan', (s) => s.value);
ok('"Choose plan" preselects that plan in the form', plan === '6-month', plan);
await home.click('[data-join-form] button[type=submit]', { force: true });
const opened = await home.evaluate(() => window.__opened);
ok('valid submit opens WhatsApp for the chosen club with details', opened.length === 1 && opened[0].startsWith('https://wa.me/918147475647') && decodeURIComponent(opened[0]).includes('6 Month Membership'), (opened[0] ?? '').slice(0, 48));
ok('success message announced', /Thank you/.test(await home.$eval('[data-join-status]', (e) => e.textContent)));

await home.click('[data-chat-toggle]', { force: true });
ok('chat panel opens with 5 club WhatsApp links', await home.$eval('#chat-panel', (p) => !p.hidden && p.querySelectorAll('a[href^="https://wa.me/"]').length === 5));
await home.keyboard.press('Escape');
ok('chat closes on Escape', await home.$eval('#chat-panel', (p) => p.hidden));

const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto(`${base}/`);
await m.waitForTimeout(2000);
// SwiftShader compiles shaders on the main thread, so drive the menu with DOM clicks.
await m.evaluate(() => document.querySelector('[data-menu-toggle]').click());
ok('mobile menu opens', await m.$eval('[data-mobile-menu]', (e) => !e.hidden));
await m.evaluate(() => document.querySelector('[data-menu-close]').click());
ok('mobile menu closes', await m.$eval('[data-mobile-menu]', (e) => e.hidden));
for (const path of ['/', '/luxury-gym-in-bangalore-indiranagar/', '/personal-training/', '/blog/']) {
  await m.goto(base + path);
  await m.waitForTimeout(1200);
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  ok(`no horizontal overflow at 390px on ${path}`, overflow <= 0, `overflow=${overflow}px`);
}

const nogl = await chromium.launch({ args: ['--disable-gpu', '--disable-software-rasterizer', '--disable-webgl', '--disable-3d-apis'] });
const n = await nogl.newPage();
const nerr = [];
n.on('pageerror', (e) => nerr.push(e.message));
await n.goto(`${base}/`);
await n.waitForTimeout(2000);
const fallback = await n.evaluate(() => ({ gl: document.documentElement.classList.contains('has-webgl'), loaded: document.documentElement.classList.contains('is-loaded') }));
ok('no-WebGL browsers: page loads, content visible, no errors', nerr.length === 0 && !fallback.gl && fallback.loaded, nerr[0] ?? JSON.stringify(fallback));
await nogl.close();

console.log(results.join('\n'));
console.log(`\n${results.filter((r) => r.startsWith('PASS')).length}/${results.length} passed`);
await b.close();
