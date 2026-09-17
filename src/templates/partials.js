import { readFileSync } from 'node:fs';
import { brand, locations, contacts, telHref, waHref, memberships } from '../data/site.js';

const ICON_DIR = 'node_modules/@phosphor-icons/core/assets';
const iconCache = new Map();

// Inline Phosphor icon (light weight by default). Decorative unless a label is given.
export function icon(name, { weight = 'light', label, cls = '' } = {}) {
  const key = `${name}-${weight}`;
  if (!iconCache.has(key)) {
    const file = weight === 'regular' ? `${ICON_DIR}/regular/${name}.svg` : `${ICON_DIR}/${weight}/${name}-${weight}.svg`;
    iconCache.set(key, readFileSync(file, 'utf8').replace('<svg ', '<svg fill="currentColor" '));
  }
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return iconCache.get(key).replace('<svg ', `<svg class="icon ${cls}" ${a11y} `);
}

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function picture(name, { alt = '', sizes = '100vw', cls = '', eager = false, w = 1600, h = 1067 } = {}) {
  return `<img class="${cls}" src="/img/${name}.webp" srcset="/img/${name}-800.webp 800w, /img/${name}.webp 1600w" sizes="${sizes}" alt="${esc(alt)}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

// Canonical/OG host. Defaults to the live domain; a preview deployment sets SITE_URL to its own
// host and NOINDEX=1 so the preview never competes with aurum.fit in search results.
const SITE = (process.env.SITE_URL ?? brand.domain).replace(/\/$/, '');
const NOINDEX = process.env.NOINDEX === '1';

export function head({ title, description, path = '/', entry = '/src/main.js', preload = [] }) {
  const url = `${SITE}${path}`;
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#130000">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Aurum Fitness">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/brand/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
${NOINDEX ? '<meta name="robots" content="noindex, nofollow">' : ''}
<link rel="icon" type="image/png" href="/brand/favicon.png">
<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
${preload.map((p) => `<link rel="preload" as="image" href="${p}">`).join('\n')}
<script>document.documentElement.classList.add('js')</script>
<script type="application/ld+json">${JSON.stringify(orgSchema())}</script>
<script type="module" src="${entry}"></script>
</head>`;
}

function orgSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': locations.map((l) => ({
      '@type': 'HealthClub',
      name: l.name,
      url: `${SITE}/${l.slug}/`,
      telephone: telHref(l.phone).replace('tel:', ''),
      image: `${SITE}/img/${l.images[0]}.webp`,
      address: { '@type': 'PostalAddress', streetAddress: l.address, addressLocality: 'Bangalore', addressRegion: 'Karnataka', addressCountry: 'IN' },
      openingHours: ['Mo-Sa 05:30-23:00', 'Su 07:00-21:00'],
      sameAs: [brand.instagram],
    })),
  };
}

const navGroups = [
  { label: 'Clubs', href: '/#Locations', items: locations.map((l) => ({ label: l.name, meta: l.area, href: `/${l.slug}/` })) },
  {
    label: 'Training', href: '/personal-training/', items: [
      { label: 'Personal Training', meta: 'Five coaching levels', href: '/personal-training/' },
      { label: 'Weight Loss', meta: 'Real transformations', href: '/weight-loss/' },
      { label: 'Recovery', meta: 'Spa, cryo, sauna and more', href: '/#services' },
    ],
  },
  { label: 'Membership', href: '/#membership' },
  { label: 'About', href: '/#Aboutus' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contact', href: '/#contact' },
];

export function nav() {
  return `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <nav class="nav" aria-label="Primary">
    <a class="nav__brand" href="/" aria-label="Aurum Fitness home">
      <img src="/brand/aurum-logo.webp" alt="" width="40" height="40">
      <span class="nav__wordmark">AURUM</span>
    </a>
    <ul class="nav__links">
      ${navGroups.map((g) => g.items ? `
      <li class="nav__item has-menu">
        <button class="nav__link" aria-expanded="false" aria-haspopup="true">${g.label}${icon('caret-down', { cls: 'nav__caret' })}</button>
        <div class="nav__menu glass">
          <ul>
            ${g.items.map((i) => `<li><a href="${i.href}"><span>${esc(i.label)}</span><small>${esc(i.meta)}</small></a></li>`).join('')}
          </ul>
        </div>
      </li>` : `<li class="nav__item"><a class="nav__link" href="${g.href}">${g.label}</a></li>`).join('')}
    </ul>
    <a class="btn btn--primary btn--sm nav__cta" href="/#contact" data-magnetic>Enroll today</a>
    <button class="nav__toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu" data-menu-toggle>
      ${icon('list')}
    </button>
  </nav>
</header>
<div class="mobile-menu" id="mobile-menu" hidden data-mobile-menu>
  <div class="mobile-menu__inner">
    <button class="mobile-menu__close" aria-label="Close menu" data-menu-close>${icon('x')}</button>
    <ul class="mobile-menu__list">
      ${navGroups.map((g) => `<li><a href="${g.href}">${g.label}</a>${g.items ? `<ul>${g.items.map((i) => `<li><a href="${i.href}">${esc(i.label)}</a></li>`).join('')}</ul>` : ''}</li>`).join('')}
    </ul>
    <a class="btn btn--primary" href="/#contact">Enroll today</a>
  </div>
</div>`;
}

export function joinForm({ heading = 'Join Aurum Fitness Club', sub = 'Sign up now for exclusive offers. Your enquiry opens WhatsApp with the club you choose.', preselect } = {}) {
  return `
<section class="section join" id="contact" data-scene="contact" aria-labelledby="join-title">
  <div class="container join__grid">
    <div class="join__intro reveal">
      <h2 class="h2" id="join-title">${heading}</h2>
      <p class="lead">${sub}</p>
      <div class="join__hours">
        ${icon('clock')}
        <dl>
          ${brand.hours.map((h) => `<div><dt>${h.days}</dt><dd>${h.time}</dd></div>`).join('')}
        </dl>
      </div>
      <ul class="join__phones">
        ${contacts.map((c) => `<li><span>${c.label}</span><a href="${telHref(c.phone)}">${c.phone}</a></li>`).join('')}
      </ul>
    </div>
    <form class="join__form glass glass--card" novalidate data-join-form>
      <div class="field">
        <label for="jf-name">Your name</label>
        <input id="jf-name" name="name" autocomplete="name" required minlength="2">
        <p class="field__error" id="jf-name-err" hidden>Please enter your name.</p>
      </div>
      <div class="field-row">
        <div class="field">
          <label for="jf-phone">Mobile number</label>
          <input id="jf-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required pattern="[0-9+ ]{10,15}">
          <p class="field__error" id="jf-phone-err" hidden>Enter a valid 10-digit mobile number.</p>
        </div>
        <div class="field">
          <label for="jf-email">Email</label>
          <input id="jf-email" name="email" type="email" autocomplete="email" required>
          <p class="field__error" id="jf-email-err" hidden>Enter a valid email address.</p>
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label for="jf-club">Club</label>
          <select id="jf-club" name="club" required>
            ${locations.map((l) => `<option value="${l.key}" ${preselect === l.key ? 'selected' : ''}>${esc(l.name)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label for="jf-plan">Interested in</label>
          <select id="jf-plan" name="plan">
            ${memberships.map((m) => `<option value="${m.id}">${m.name}</option>`).join('')}
            <option value="personal-training">Personal Training</option>
            <option value="club-tour">A private club tour</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label for="jf-msg">Message <span class="field__opt">(optional)</span></label>
        <textarea id="jf-msg" name="message" rows="3"></textarea>
      </div>
      <button class="btn btn--primary btn--block" type="submit" data-magnetic>
        <span>Send enquiry</span>${icon('whatsapp-logo')}
      </button>
      <p class="join__status" role="status" aria-live="polite" data-join-status></p>
    </form>
  </div>
</section>`;
}

export function footer() {
  return `
<footer class="footer">
  <div class="container footer__grid">
    <div class="footer__brand">
      <img src="/brand/aurum-wordmark.webp" alt="Aurum Elite Personal Training Club" width="900" height="186" loading="lazy">
      <p>Gym, nutrition, rehab and supplements. Luxury fitness clubs across Bangalore.</p>
      <a class="footer__social" href="${brand.instagram}" target="_blank" rel="noopener">${icon('instagram-logo')}<span>${brand.instagramHandle}</span></a>
    </div>
    <div>
      <h2 class="footer__h">Clubs</h2>
      <ul>${locations.map((l) => `<li><a href="/${l.slug}/">${esc(l.name)}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h2 class="footer__h">Training</h2>
      <ul>
        <li><a href="/personal-training/">Personal Training</a></li>
        <li><a href="/weight-loss/">Weight Loss</a></li>
        <li><a href="/#services">Recovery</a></li>
        <li><a href="/#membership">Membership Plans</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer__h">Aurum</h2>
      <ul>
        <li><a href="/#Aboutus">About Us</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li><a href="/#faq">FAQ</a></li>
        <li><a href="/#contact">Contact Us</a></li>
      </ul>
    </div>
  </div>
  <div class="container footer__base">
    <p>&copy; ${new Date().getFullYear()} Aurum Fitness. All rights reserved.</p>
    <p>Mon to Sat 5:30 AM to 11:00 PM. Sunday 7:00 AM to 9:00 PM.</p>
  </div>
</footer>
<div class="chat" data-chat>
  <button class="chat__toggle glass" aria-expanded="false" aria-controls="chat-panel" data-chat-toggle>
    ${icon('whatsapp-logo')}<span>Chat with us</span>
  </button>
  <div class="chat__panel glass glass--card" id="chat-panel" hidden>
    <p class="chat__title">Join Aurum. Pick a club to chat on WhatsApp.</p>
    <ul>
      ${locations.map((l) => `<li><a href="${waHref(l.whatsapp)}" target="_blank" rel="noopener"><span>${esc(l.name)}</span><small>${l.area}</small>${icon('arrow-up-right')}</a></li>`).join('')}
    </ul>
  </div>
</div>
<div class="grain" aria-hidden="true"></div>`;
}

export const ctaRow = (primary = 'Enroll today', href = '#contact') => `
<div class="cta-row">
  <a class="btn btn--primary" href="${href}" data-magnetic>${primary}</a>
  <a class="btn btn--ghost" href="/#Locations">Find a club</a>
</div>`;
