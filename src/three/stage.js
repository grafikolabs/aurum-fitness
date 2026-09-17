import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createMaterials } from './materials.js';
import { createEnvironment } from './environment.js';
import { createEmblem } from './emblem.js';
import { createPlate } from './plate.js';
import { createColonnade, createFloor } from './sanctum.js';
import { createDust } from './dust.js';
import { createCarousel, updateCarousel } from './carousel.js';
import { createTower, updateTower } from './tower.js';
import { createMap, updateMap, projectLocations } from './map.js';
import { DEFAULT_STATE } from './constants.js';

export class Stage {
  constructor(canvas, { quality = 'high', lite = false, pillarTextures = [], ptLevels = [], locations = [] } = {}) {
    this.canvas = canvas;
    this.quality = quality;
    this.lite = lite;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.state = { ...DEFAULT_STATE };
    this.target = { ...DEFAULT_STATE };
    this.pointer = new THREE.Vector2();
    this.pointerDamped = new THREE.Vector2();
    this.time = 0;
    this.paused = false;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: quality === 'high', alpha: false, powerPreference: 'high-performance' });
    renderer.setClearColor('#000000', 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    this.renderer = renderer;
    this.dprCap = quality === 'high' ? 1.75 : 1.5;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#0c0201', 0.028);
    // Backdrop as an unlit sphere so it goes through the same colour pipeline as every material
    // (a clear colour gets encoded twice when rendering through the composer).
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(100, 32, 16),
      new THREE.MeshBasicMaterial({ color: '#0c0201', side: THREE.BackSide, fog: false, depthWrite: false }),
    ));
    scene.environment = createEnvironment(renderer);
    scene.environmentIntensity = 0.9;
    this.scene = scene;

    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 120);

    const materials = createMaterials({ quality });
    this.materials = materials;

    // Lights: warm key from above, crimson and gold rims from behind.
    scene.add(new THREE.HemisphereLight('#6b4520', '#130000', 0.5));
    const key = new THREE.DirectionalLight('#ffe0ad', 2.4);
    key.position.set(4, 9, 8);
    scene.add(key);
    this.rimRed = new THREE.PointLight('#ff2b1c', 90, 30, 2);
    this.rimRed.position.set(-6, 3.5, -4);
    this.rimGold = new THREE.PointLight('#ffd9b0', 45, 30, 2);
    this.rimGold.position.set(6.5, 5, -3);
    this.fill = new THREE.PointLight('#ffd08a', 30, 18, 2);
    this.fill.position.set(0, 1, 6);
    scene.add(this.rimRed, this.rimGold, this.fill);

    // World
    this.emblem = createEmblem(materials);
    scene.add(this.emblem);

    this.plate = createPlate(materials, { radius: 2.85, accent: true });
    this.plateHolder = new THREE.Group();
    this.plate.rotation.x = Math.PI / 2;
    this.plate.position.z = -1.3;
    this.plateHolder.add(this.plate);
    scene.add(this.plateHolder);

    this.colonnade = createColonnade(materials, { count: quality === 'high' ? 22 : 16 });
    scene.add(this.colonnade);

    this.points = projectLocations(locations);
    this.floor = createFloor({ beacons: this.points });
    scene.add(this.floor);

    this.dust = createDust({ count: quality === 'high' ? 1800 : 800 });
    scene.add(this.dust);

    if (!lite) {
      this.carousel = createCarousel(materials, pillarTextures);
      this.carousel.position.y = 0.9;
      scene.add(this.carousel);

      this.tower = createTower(materials, ptLevels);
      scene.add(this.tower);

      this.map = createMap(materials, this.points);
      scene.add(this.map);
    }

    if (quality === 'high') {
      const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
      this.composer = new EffectComposer(renderer, rt);
      this.composer.addPass(new RenderPass(scene, this.camera));
      this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.16, 0.3, 0.95);
      this.composer.addPass(this.bloom);
      this.composer.addPass(new OutputPass());
    }

    this.resize();
    addEventListener('resize', () => this.resize());
    addEventListener('pointermove', (e) => {
      this.pointer.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    }, { passive: true });
  }

  resize() {
    const w = innerWidth;
    const h = Math.max(innerHeight, document.documentElement.clientHeight);
    this.width = w;
    this.height = h;
    this.mobile = w < 820;
    const dpr = Math.min(devicePixelRatio || 1, this.dprCap);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.dust.material.uniforms.uPixelRatio.value = dpr;
    if (this.composer) {
      this.composer.setPixelRatio(dpr);
      this.composer.setSize(w, h);
      this.bloom.resolution.set(w / 2, h / 2);
    }
  }

  set(target) {
    Object.assign(this.target, target);
  }

  // Snap directly to the target (reduced motion, first frame).
  jump() {
    Object.assign(this.state, this.target);
  }

  update(dt) {
    const s = this.state;
    const t = this.target;
    const k = this.reduced ? 1 : 1 - Math.exp(-dt * 3.2);
    for (const key in t) {
      if (typeof t[key] === 'number') s[key] += (t[key] - s[key]) * k;
      else s[key] = t[key];
    }
    if (!this.reduced) this.time += dt;
    const time = this.time;

    // Camera orbit around the focus point
    this.pointerDamped.lerp(this.pointer, this.reduced ? 1 : 1 - Math.exp(-dt * 2));
    const par = this.reduced ? 0 : 1;
    const theta = s.theta + this.pointerDamped.x * 0.05 * par;
    const phi = THREE.MathUtils.clamp(s.phi - this.pointerDamped.y * 0.03 * par, -0.2, 1.45);
    const target = new THREE.Vector3(s.fx, s.ty, s.fz);
    this.camera.position.set(
      target.x + Math.sin(theta) * Math.cos(phi) * s.radius,
      target.y + Math.sin(phi) * s.radius,
      target.z + Math.cos(theta) * Math.cos(phi) * s.radius,
    );
    this.camera.lookAt(target);
    this.camera.setViewOffset(this.width, this.height, -s.frameX * this.width * 0.5, s.frameY * this.height * 0.5, this.width, this.height);

    // Emblem: floats, sways, and mostly turns with the camera so the brand stays legible.
    this.emblem.position.y = s.emY + Math.sin(time * 0.8) * 0.07;
    this.emblem.rotation.y = theta * s.emFollow + Math.sin(time * 0.35) * 0.28;
    this.emblem.rotation.x = Math.sin(time * 0.5) * 0.03;
    this.emblem.scale.setScalar(Math.max(s.emScale, 0.001));
    this.emblem.userData.halo.lookAt(this.camera.position);

    // Halo plate
    this.plateHolder.visible = s.plate > 0.01;
    this.plateHolder.scale.setScalar(Math.max(s.plate, 0.001));
    this.plateHolder.position.y = s.emY;
    this.plateHolder.rotation.y = theta * s.emFollow;
    this.plateHolder.rotation.x = -s.plateTilt * 1.2;
    this.plate.rotation.y = time * 0.12;

    this.rimRed.intensity = 90 * s.warmth;
    this.renderer.toneMappingExposure = 1.05 * (1 - s.dim * 0.6);
    this.floor.material.uniforms.uTime.value = time;
    this.floor.material.uniforms.uWarm.value = 0.6 + s.warmth * 0.4;
    const du = this.dust.material.uniforms;
    du.uTime.value = time;
    du.uSteam.value = s.steam;
    du.uOpacity.value = s.dust;

    if (!this.lite) {
      updateCarousel(this.carousel, { index: s.carouselIndex, time, visibility: s.carousel, cameraTheta: theta });
      updateTower(this.tower, { visibility: s.tower, level: s.level, time });
      updateMap(this.map, this.floor.material.uniforms, { visibility: s.map, activeKey: s.club, time });
    }
  }

  // Compile every material up front so chapters don't hitch the first time they appear.
  warmUp() {
    const groups = [this.carousel, this.tower, this.map, this.plateHolder].filter(Boolean);
    const prev = groups.map((g) => g.visible);
    groups.forEach((g) => { g.visible = true; });
    this.renderer.compile(this.scene, this.camera);
    groups.forEach((g, i) => { g.visible = prev[i]; });
  }

  render() {
    if (this.paused) return;
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }
}
