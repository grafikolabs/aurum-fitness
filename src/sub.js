import '@fontsource/antonio/200.css';
import '@fontsource/antonio/700.css';
import '@fontsource-variable/montserrat';
import './styles/base.css';
import './styles/home.css';
import './styles/sub.css';

import gsap from 'gsap';
import Lenis from 'lenis';
import { locations } from './data/site.js';
import { detectWebGL, detectQuality } from './three/constants.js';
import {
  initNav, initReveal, initTilt, initMagnetic, initReels, initJoinForm, initChat, initDrag,
} from './ui/interactions.js';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const lenis = new Lenis({ duration: 1.1, smoothWheel: !reduced, autoRaf: false });
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

initNav(lenis);
initReveal();
initTilt();
initMagnetic();
initReels();
initJoinForm();
initChat();
initDrag();
root.classList.add('is-loaded');

const header = document.querySelector('[data-header]');
let lastY = 0;
const updateHeader = (y) => {
  const d = y - lastY;
  if (Math.abs(d) > 2) header.classList.toggle('is-hidden', d > 0 && y > innerHeight * 0.8 && !document.body.classList.contains('menu-open'));
  header.classList.toggle('is-scrolled', y > 40);
  lastY = y;
};

async function start() {
  if (!detectWebGL()) {
    gsap.ticker.add(() => updateHeader(lenis.scroll));
    return;
  }
  await Promise.race([document.fonts.load('700 48px Antonio'), new Promise((r) => setTimeout(r, 2000))]);
  const { Stage } = await import('./three/stage.js');
  const canvas = document.querySelector('[data-stage]');
  const stage = new Stage(canvas, { quality: detectQuality(), lite: true, locations });
  root.classList.add('has-webgl');

  // A slow half orbit over the page; the stage recedes once you leave the hero.
  let last = performance.now();
  const frame = () => {
    const y = lenis.animatedScroll ?? lenis.scroll;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = y / max;
    const mobile = innerWidth < 820;
    stage.set({
      theta: -0.5 + p * Math.PI * 0.9,
      phi: 0.08 + p * 0.25,
      radius: mobile ? 19 : 15,
      ty: 1.25,
      frameX: mobile ? 0 : 0.42,
      frameY: mobile ? 0.3 : 0.02,
      plateTilt: p * 0.6,
      emScale: 1,
    });
    canvas.style.setProperty('--stage-o', String(Math.max(0.28, 1 - y / (innerHeight * 0.9))));
    updateHeader(y);
  };
  frame();
  stage.jump();

  gsap.ticker.add(() => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    frame();
    if (document.hidden) return;
    stage.update(dt);
    stage.render();
  });
}

start();
