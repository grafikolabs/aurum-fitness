import gsap from 'gsap';
import { locations, memberships, waHref } from '../data/site.js';
import speakerHigh from '@phosphor-icons/core/assets/light/speaker-high-light.svg?raw';
import speakerSlash from '@phosphor-icons/core/assets/light/speaker-slash-light.svg?raw';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

export function initNav(lenis) {
  document.querySelectorAll('.has-menu > .nav__link').forEach((btn) => {
    const item = btn.parentElement;
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      document.querySelectorAll('.has-menu.is-open').forEach((o) => { o.classList.remove('is-open'); o.firstElementChild.setAttribute('aria-expanded', 'false'); });
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    item.addEventListener('mouseenter', () => btn.setAttribute('aria-expanded', 'true'));
    item.addEventListener('mouseleave', () => { btn.setAttribute('aria-expanded', 'false'); item.classList.remove('is-open'); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.has-menu.is-open').forEach((o) => { o.classList.remove('is-open'); o.firstElementChild.setAttribute('aria-expanded', 'false'); o.firstElementChild.focus(); });
    closeMenu();
  });

  const menu = document.querySelector('[data-mobile-menu]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const openMenu = () => {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    lenis?.stop();
    gsap.fromTo(menu.querySelectorAll('.mobile-menu__list > li, .mobile-menu__inner > .btn'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: 'expo.out' });
    menu.querySelector('[data-menu-close]').focus();
  };
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    lenis?.start();
    toggle.focus();
  }
  toggle?.addEventListener('click', openMenu);
  menu?.querySelector('[data-menu-close]').addEventListener('click', closeMenu);
  menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  // Smooth in-page anchors through Lenis
  document.querySelectorAll('a[href^="#"], a[href*="/#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      const hash = href.slice(href.indexOf('#'));
      const home = import.meta.env.BASE_URL;
      const onHome = location.pathname === home || location.pathname === `${home}index.html`;
      if (!href.startsWith('#') && !onHome) return;
      const target = hash.length > 1 && document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis ? lenis.scrollTo(target, { offset: 0, duration: 1.6 }) : target.scrollIntoView();
      history.replaceState(null, '', hash);
    });
  });
}

export function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

export function initCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const end = +e.target.dataset.count;
      if (reduced()) return;
      const obj = { v: 0 };
      gsap.to(obj, { v: end, duration: 2.2, ease: 'expo.out', onUpdate: () => { e.target.textContent = Math.round(obj.v); } });
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => { if (!reduced()) el.textContent = '0'; io.observe(el); });
}

// Floating glass: pointer tilt plus a specular highlight that follows the cursor.
export function initTilt() {
  document.querySelectorAll('.plan').forEach((el) => el.classList.add('floaty'));
  if (!finePointer() || reduced()) return;
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    gsap.set(el, { transformPerspective: 900 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      rx((0.5 - y) * 7);
      ry((x - 0.5) * 9);
      el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
  // Page-level sheen on other glass surfaces
  addEventListener('pointermove', (e) => {
    document.querySelectorAll('.glass:not([data-tilt])').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  }, { passive: true });
}

export function initMagnetic() {
  if (!finePointer() || reduced()) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.45)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.45)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.25);
      yTo((e.clientY - r.top - r.height / 2) * 0.3);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

export function initReels() {
  const reels = [...document.querySelectorAll('[data-reel]')];
  if (!reels.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const video = e.target.querySelector('video');
      if (e.isIntersecting) {
        if (!video.src) video.src = video.dataset.src;
        if (!reduced()) video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.35 });
  reels.forEach((reel) => {
    io.observe(reel);
    const btn = reel.querySelector('[data-reel-sound]');
    const video = reel.querySelector('video');
    btn.addEventListener('click', () => {
      const unmute = video.muted;
      reels.forEach((r) => {
        const v = r.querySelector('video');
        v.muted = true;
        const b = r.querySelector('[data-reel-sound]');
        b.setAttribute('aria-pressed', 'false');
        b.setAttribute('aria-label', 'Play with sound');
        b.innerHTML = speakerIcon(false);
      });
      if (unmute) {
        if (!video.src) video.src = video.dataset.src;
        video.muted = false;
        video.play().catch(() => {});
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('aria-label', 'Mute');
        btn.innerHTML = speakerIcon(true);
      }
    });
  });
}

const speakerIcon = (on) => (on ? speakerHigh : speakerSlash)
  .replace('<svg ', '<svg class="icon" fill="currentColor" aria-hidden="true" focusable="false" ');

export function initFilm() {
  const video = document.querySelector('[data-film]');
  if (!video) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        if (!video.src) {
          const hd = innerWidth > 1100 && !navigator.connection?.saveData;
          video.src = hd ? video.dataset.srcHd : video.dataset.srcSd;
        }
        if (!reduced()) video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { rootMargin: '40% 0px' });
  io.observe(video.closest('.film'));

  // Anchor the zoom on the left stem of the first "U", so the film fills the frame through
  // the letter's stroke rather than a counter. The ratio is unaffected by the current scale.
  const span = document.querySelector('[data-film-mask] span');
  const place = () => {
    if (!span?.firstChild) return;
    const range = document.createRange();
    range.setStart(span.firstChild, 1);
    range.setEnd(span.firstChild, 2);
    const r = range.getBoundingClientRect();
    const s = span.getBoundingClientRect();
    span.style.setProperty('--ox', `${(((r.left + r.width * 0.16 - s.left) / s.width) * 100).toFixed(2)}%`);
  };
  document.fonts.ready.then(place);
  addEventListener('resize', place);
}

export function initJoinForm() {
  document.querySelectorAll('[data-join-form]').forEach((form) => {
    const status = form.querySelector('[data-join-status]');
    const fields = {
      name: { el: form.elements.name, ok: (v) => v.trim().length >= 2 },
      phone: { el: form.elements.phone, ok: (v) => v.replace(/\D/g, '').length >= 10 },
      email: { el: form.elements.email, ok: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) },
    };
    const check = (key) => {
      const f = fields[key];
      const valid = f.ok(f.el.value);
      f.el.setAttribute('aria-invalid', String(!valid));
      const err = form.querySelector(`#${f.el.id}-err`);
      err.hidden = valid;
      if (valid) f.el.removeAttribute('aria-describedby'); else f.el.setAttribute('aria-describedby', err.id);
      return valid;
    };
    Object.keys(fields).forEach((k) => fields[k].el.addEventListener('blur', () => { if (fields[k].el.value) check(k); }));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = Object.keys(fields).map(check);
      if (results.includes(false)) {
        const first = Object.values(fields).find((f) => f.el.getAttribute('aria-invalid') === 'true');
        first?.el.focus();
        status.textContent = 'Please fix the highlighted fields.';
        return;
      }
      const data = new FormData(form);
      const club = locations.find((l) => l.key === data.get('club')) ?? locations[0];
      const plan = memberships.find((m) => m.id === data.get('plan'))?.name
        ?? (data.get('plan') === 'personal-training' ? 'Personal Training' : 'A private club tour');
      const message = [
        `Hi Aurum, I'd like to join ${club.name}, ${club.area}.`,
        `Name: ${data.get('name')}`,
        `Mobile: ${data.get('phone')}`,
        `Email: ${data.get('email')}`,
        `Interested in: ${plan}`,
        data.get('message') ? `Message: ${data.get('message')}` : '',
      ].filter(Boolean).join('\n');
      const url = waHref(club.whatsapp, message);
      const win = window.open(url, '_blank', 'noopener');
      status.innerHTML = win
        ? `Thank you, ${escapeHtml(data.get('name'))}. WhatsApp is opening with your enquiry for ${escapeHtml(club.name)}.`
        : `Thank you. <a href="${url}" target="_blank" rel="noopener">Open WhatsApp to send your enquiry</a>.`;
    });
  });

  // "Choose plan" buttons preselect the plan in the form.
  document.querySelectorAll('[data-plan]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#jf-plan').forEach((sel) => { sel.value = btn.dataset.plan; });
    });
  });
}

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function initChat() {
  const toggle = document.querySelector('[data-chat-toggle]');
  const panel = document.getElementById('chat-panel');
  if (!toggle) return;
  const set = (open) => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) gsap.fromTo(panel, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' });
  };
  toggle.addEventListener('click', () => set(panel.hidden));
  document.addEventListener('click', (e) => { if (!panel.hidden && !e.target.closest('[data-chat]')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { set(false); toggle.focus(); } });
}

export function initDrag() {
  document.querySelectorAll('[data-drag]').forEach((track) => {
    let down = false; let startX = 0; let startScroll = 0; let moved = false;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; startX = e.clientX; startScroll = track.scrollLeft;
      track.classList.add('is-dragging');
    });
    addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startScroll - dx;
    });
    addEventListener('pointerup', () => { down = false; track.classList.remove('is-dragging'); });
    track.addEventListener('click', (e) => { if (moved) e.preventDefault(); }, true);
  });
}

