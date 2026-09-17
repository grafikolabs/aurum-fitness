import { DEFAULT_STATE, FLOOR_Y, TOWER_BASE_Y, TOWER_STEP } from '../three/constants.js';

const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);
const k = (over) => ({ ...DEFAULT_STATE, ...over });

const LABELS = {
  hero: 'Aurum', stats: 'In numbers', about: 'About', pillars: 'Why Aurum', recovery: 'Recovery', film: 'The film',
  membership: 'Membership', training: 'Training', stories: 'Stories', clubs: 'Clubs', club: 'Clubs', faq: 'FAQ', journal: 'Blog', contact: 'Join',
};

// Camera and world keyframes, one per chapter. The camera completes one full circle
// around the emblem (theta 0 to 2π) over the length of the page.
function keyframes(mobile, points) {
  const topY = TOWER_BASE_Y + TOWER_STEP * 4;
  const K = {
    hero: k({ theta: 0, phi: 0.06, radius: 12.5, ty: 1.25, frameX: 0.5 }),
    stats: k({ theta: 0.5, phi: 0.3, radius: 18, ty: 1.4, frameX: 0, frameY: -0.58, plateTilt: 0.15, dim: 0.35 }),
    about: k({ theta: 0.85, phi: 0.02, radius: 21, ty: 1.25, frameX: 0, frameY: -0.8, dust: 0.7, warmth: 0.7, dim: 0.4 }),
    pillarsStart: k({ theta: 1.1, phi: 0.05, radius: 15, ty: 1.3, frameX: -0.06, frameY: 0.1, emY: 4.2, emScale: 0.5, plate: 0, carousel: 1, carouselIndex: 0 }),
    pillarsEnd: k({ theta: 1.6, phi: 0.05, radius: 15, ty: 1.3, frameX: -0.06, frameY: 0.1, emY: 4.2, emScale: 0.5, plate: 0, carousel: 1, carouselIndex: 5 }),
    recovery: k({ theta: 2.05, phi: 0.1, radius: 13, ty: 1.4, frameX: 0.4, steam: 1, warmth: 1.8 }),
    film: k({ theta: 2.3, phi: 0.1, radius: 13, ty: 1.4, frameX: 0.2, steam: 0.5, warmth: 1.4 }),
    membership: k({ theta: 2.65, phi: 0.3, radius: 20, ty: 1.6, frameX: 0.1, frameY: -0.42, plateTilt: 0.5, dim: 0.2 }),
    trainingStart: k({ theta: 2.95, phi: 0.12, radius: 13.5, ty: TOWER_BASE_Y + 0.8, frameX: -0.08, emY: topY + 2.4, emScale: 0.7, emFollow: 1, plate: 0, tower: 1, level: 0 }),
    trainingEnd: k({ theta: 3.75, phi: 0.36, radius: 12, ty: topY + 0.9, frameX: -0.08, emY: topY + 2.4, emScale: 0.7, emFollow: 1, plate: 0, tower: 1, level: 4 }),
    stories: k({ theta: 4.1, phi: 0.1, radius: 15, ty: 1.4, frameX: 0.05, dust: 0.8 }),
    clubs: k({ theta: 4.45, phi: 1.12, radius: 32, ty: FLOOR_Y, frameX: 0.36, emY: 9, emScale: 0.6, plate: 0, map: 1 }),
    faq: k({ theta: 5.3, phi: 0.15, radius: 17, ty: 1.3, frameX: -0.45, dim: 0.35 }),
    journal: k({ theta: 5.75, phi: 0.08, radius: 20, ty: 1.4, frameX: 0.62, frameY: 0.45, dim: 0.5 }),
    contact: k({ theta: TAU, phi: 0.05, radius: 12, ty: 1.25, frameX: 0.3 }),
  };
  K.club = (key, i) => {
    const p = points.find((pt) => pt.key === key) ?? { x: 0, z: 0 };
    return k({ theta: 4.45 + i * 0.07, phi: 0.92, radius: 17, fx: p.x, fz: p.z, ty: FLOOR_Y + 1, frameX: 0.38, emY: 9, emScale: 0.6, plate: 0, map: 1, club: key });
  };

  if (mobile) {
    const base = K.club;
    const adapt = (s, over = {}) => Object.assign(s, { frameX: 0, radius: s.radius * 1.45 }, over);
    adapt(K.hero, { frameY: 0.46, radius: 21 });
    adapt(K.stats, { dim: 0.45 }); adapt(K.about, { frameY: -0.7 });
    adapt(K.pillarsStart, { frameY: 0.28, radius: 19, emScale: 0.001 }); adapt(K.pillarsEnd, { frameY: 0.28, radius: 19, emScale: 0.001 });
    adapt(K.recovery, { dim: 0.3 }); adapt(K.film); adapt(K.membership, { frameY: -0.35, dim: 0.35 });
    adapt(K.trainingStart, { frameY: 0.06, radius: 25 }); adapt(K.trainingEnd, { frameY: 0.06, radius: 23 });
    adapt(K.stories, { dim: 0.4 }); adapt(K.clubs, { frameY: 0.55, dim: 0.2 }); adapt(K.faq, { dim: 0.5 }); adapt(K.journal); adapt(K.contact, { frameY: -0.6, dim: 0.45 });
    K.club = (key, i) => Object.assign(base(key, i), { frameX: 0, frameY: 0.62, radius: 26 });
  }
  return K;
}

export class Director {
  constructor({ stage, lenis }) {
    this.stage = stage;
    this.lenis = lenis;
    this.anchors = [];
    this.hoverClub = null;
    this.lastScroll = 0;
    this.header = document.querySelector('[data-header]');
    this.orbit = document.querySelector('[data-orbit]');
    this.orbitLabel = document.querySelector('[data-orbit-label]');

    this.pillars = document.querySelector('[data-scene="pillars"]');
    this.pillarCards = [...document.querySelectorAll('[data-pillar]')];
    this.pillarTabs = [...document.querySelectorAll('[data-pillar-tab]')];
    this.pillarBar = document.querySelector('[data-pillars-bar]');

    this.training = document.querySelector('[data-scene="training"]');
    this.levelCards = [...document.querySelectorAll('[data-level-index]')];
    this.ladder = [...document.querySelectorAll('[data-ladder]')];

    this.film = document.querySelector('[data-scene="film"]');
    this.filmMask = document.querySelector('[data-film-mask]');
    this.filmSticky = this.film?.querySelector('.film__sticky');

    this.clubCards = [...document.querySelectorAll('[data-club]')];
    this.clubCards.forEach((card) => {
      const on = () => { this.hoverClub = card.dataset.club; };
      const off = () => { this.hoverClub = null; };
      card.addEventListener('pointerenter', on);
      card.addEventListener('pointerleave', off);
      card.addEventListener('focusin', on);
      card.addEventListener('focusout', off);
    });

    this.pillarTabs.forEach((tab) => tab.addEventListener('click', () => this.scrollToIndex(this.pillars, +tab.dataset.pillarTab, this.pillarCards.length)));

    this.measure();
    new ResizeObserver(() => this.measure()).observe(document.body);
  }

  scrollToIndex(section, i, n) {
    const top = section.getBoundingClientRect().top + this.lenis.scroll;
    const range = section.offsetHeight - innerHeight;
    this.lenis.scrollTo(top + (range * i) / Math.max(1, n - 1), { duration: 1.2 });
  }

  measure() {
    const vh = innerHeight;
    const scroll = this.lenis.scroll;
    const K = keyframes(innerWidth < 820, this.stage?.points ?? []);
    this.K = K;
    const top = (el) => el.getBoundingClientRect().top + scroll;
    const anchors = [];
    let clubIndex = 0;
    document.querySelectorAll('[data-scene]').forEach((el) => {
      const name = el.dataset.scene;
      if (name === 'hero') anchors.push({ y: 0, s: K.hero, name });
      else if (name === 'pillars' || name === 'training') {
        const t = top(el);
        anchors.push({ y: t, s: K[`${name}Start`], name, pin: name });
        anchors.push({ y: t + el.offsetHeight - vh, s: K[`${name}End`], name, pin: name });
      } else if (name === 'club') {
        anchors.push({ y: top(el) + el.offsetHeight / 2 - vh / 2, s: K.club(el.dataset.club, clubIndex++), name });
      } else if (name === 'film') {
        anchors.push({ y: top(el) - vh * 0.5, s: K.film, name });
      } else if (K[name]) {
        anchors.push({ y: Math.max(0, top(el) - vh * 0.45), s: K[name], name });
      }
    });
    anchors.sort((a, b) => a.y - b.y);
    this.anchors = anchors;
    this.maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    if (this.pillars) this.pillarRange = { top: top(this.pillars), len: this.pillars.offsetHeight - vh };
    if (this.training) this.trainingRange = { top: top(this.training), len: this.training.offsetHeight - vh };
    if (this.film) this.filmRange = { top: top(this.film), len: this.film.offsetHeight - vh };
  }

  sample(y) {
    const a = this.anchors;
    if (!a.length) return { state: DEFAULT_STATE, name: 'hero' };
    if (y <= a[0].y) return { state: a[0].s, name: a[0].name };
    for (let i = 0; i < a.length - 1; i++) {
      const A = a[i];
      const B = a[i + 1];
      if (y >= A.y && y < B.y) {
        let t = (y - A.y) / Math.max(1, B.y - A.y);
        if (!(A.pin && A.pin === B.pin)) t = smooth(t);
        const out = {};
        for (const key in A.s) {
          const va = A.s[key];
          const vb = B.s[key];
          out[key] = typeof va === 'number' ? va + (vb - va) * t : (t < 0.5 ? va : vb);
        }
        return { state: out, name: t < 0.5 ? A.name : B.name };
      }
    }
    const last = a[a.length - 1];
    return { state: last.s, name: last.name };
  }

  update() {
    const y = this.lenis.animatedScroll ?? this.lenis.scroll;
    const { state, name } = this.sample(y);
    const out = { ...state };

    // Pinned chapters dwell on each item, then glide to the next.
    const pin = (range, n) => {
      if (!range) return null;
      const p = clamp((y - range.top) / Math.max(1, range.len), 0, 1);
      const f = p * (n - 1);
      const i = Math.floor(f);
      const eased = Math.min(n - 1, i + smooth(clamp((f - i - 0.2) / 0.6, 0, 1)));
      return { p, index: Math.round(f), eased };
    };

    const pl = pin(this.pillarRange, this.pillarCards.length);
    if (pl) {
      if (y >= this.pillarRange.top && y <= this.pillarRange.top + this.pillarRange.len) out.carouselIndex = pl.eased;
      this.setActive(this.pillarCards, pl.index, 'is-active');
      this.pillarTabs.forEach((t, i) => (i === pl.index ? t.setAttribute('aria-current', 'true') : t.removeAttribute('aria-current')));
      this.pillarBar?.style.setProperty('--p', pl.p.toFixed(4));
    }

    const tr = pin(this.trainingRange, this.levelCards.length);
    if (tr) {
      if (y >= this.trainingRange.top && y <= this.trainingRange.top + this.trainingRange.len) out.level = tr.eased;
      this.setActive(this.levelCards, tr.index, 'is-active');
      const activeLevel = 5 - tr.index;
      this.ladder.forEach((li) => {
        const lvl = +li.dataset.ladder;
        li.classList.toggle('is-active', lvl === activeLevel);
        li.classList.toggle('is-done', lvl > activeLevel);
      });
    }

    // Clubs: hovered card wins, otherwise the card nearest the viewport centre.
    if (this.clubCards.length) {
      const inClubs = out.map > 0.5;
      const key = inClubs ? (this.hoverClub ?? out.club) : '';
      if (inClubs && this.hoverClub) {
        const i = this.clubCards.findIndex((c) => c.dataset.club === this.hoverClub);
        Object.assign(out, this.K.club(this.hoverClub, i));
      }
      this.clubCards.forEach((c) => c.classList.toggle('is-active', c.dataset.club === key));
    }

    // Film: the AURUM letters grow until the film fills the screen.
    let filmCovers = false;
    if (this.filmRange && this.filmMask) {
      const p = clamp((y - this.filmRange.top) / Math.max(1, this.filmRange.len), 0, 1);
      const grow = clamp(p / 0.62, 0, 1);
      const scale = 1 + Math.pow(grow, 3) * 70;
      this.filmMask.style.setProperty('--s', scale.toFixed(3));
      this.filmMask.style.opacity = String(1 - clamp((p - 0.5) / 0.14, 0, 1));
      this.filmSticky.style.setProperty('--cap', clamp((p - 0.66) / 0.16, 0, 1).toFixed(3));
      filmCovers = y > this.filmRange.top && y < this.filmRange.top + this.filmRange.len;
    }
    if (this.stage) {
      this.stage.paused = filmCovers;
      this.stage.set(out);
    }

    // Orbit dial + header behaviour
    if (this.orbit) {
      this.orbit.style.setProperty('--orbit', (y / this.maxScroll).toFixed(4));
      this.orbit.classList.toggle('is-away', y > this.maxScroll - innerHeight * 0.6);
      const label = LABELS[name] ?? 'Aurum';
      if (this.orbitLabel.textContent !== label) this.orbitLabel.textContent = label;
    }
    if (this.header) {
      const delta = y - this.lastScroll;
      if (Math.abs(delta) > 2) this.header.classList.toggle('is-hidden', delta > 0 && y > innerHeight * 0.8 && !document.body.classList.contains('menu-open'));
      this.header.classList.toggle('is-scrolled', y > 40);
    }
    this.lastScroll = y;
  }

  setActive(list, index, cls) {
    list.forEach((el, i) => el.classList.toggle(cls, i === index));
  }
}
