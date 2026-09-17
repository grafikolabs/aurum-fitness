import '@fontsource/antonio/200.css';
import '@fontsource/antonio/700.css';
import '@fontsource-variable/montserrat';
import './styles/base.css';
import './styles/home.css';
import './styles/sub.css';

import gsap from 'gsap';
import Lenis from 'lenis';
import { pillars, ptLevels, locations } from './data/site.js';
import { detectWebGL, detectQuality } from './three/constants.js';
import { Director } from './scroll/director.js';
import {
  initNav, initReveal, initCounters, initTilt, initMagnetic, initReels, initFilm, initJoinForm, initChat,
} from './ui/interactions.js';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const lenis = new Lenis({ duration: 1.15, smoothWheel: !reduced, wheelMultiplier: 0.9, autoRaf: false });
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

initNav(lenis);
initReveal();
initCounters();
initTilt();
initMagnetic();
initReels();
initFilm();
initJoinForm();
initChat();

let loaded = false;
const finish = () => {
  if (loaded) return;
  loaded = true;
  root.classList.add('is-loaded');
  document.body.classList.remove('is-loading');
};

const withTimeout = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);

async function start() {
  // Content never waits for 3D: release the loader once the brand fonts are in.
  // Canvas textures (plate engravings, map labels) also need these fonts.
  await withTimeout(Promise.all([
    document.fonts.load('700 48px Antonio'),
    document.fonts.load('600 24px "Montserrat Variable"'),
  ]), 1200);
  finish();

  if (!detectWebGL()) {
    const director = new Director({ stage: null, lenis });
    gsap.ticker.add(() => director.update());
    return;
  }

  const [THREE, { Stage }] = await Promise.all([import('three'), import('./three/stage.js')]);
  const manager = new THREE.LoadingManager();

  const loader = new THREE.TextureLoader(manager);
  const pillarTextures = pillars.map((p) => {
    const tex = loader.load(`${import.meta.env.BASE_URL}img/${p.img}-800.webp`);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  });

  const canvas = document.querySelector('[data-stage]');
  const stage = new Stage(canvas, { quality: detectQuality(), pillarTextures, ptLevels, locations });
  root.classList.add('has-webgl');

  const director = new Director({ stage, lenis });
  director.update();
  stage.jump();
  stage.update(0);
  stage.warmUp();

  let last = performance.now();
  gsap.ticker.add(() => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    director.update();
    if (document.hidden) return;
    stage.update(dt);
    stage.render();
  });

  window.__aurum = { stage, director, lenis };
}

start();
