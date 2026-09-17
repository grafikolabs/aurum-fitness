import * as THREE from 'three';

// Olympic weight plate profile (radius, half-thickness), unit radius. Revolved around Y.
const PROFILE = [
  [0.085, -0.055], [0.085, 0.055], [0.16, 0.055], [0.185, 0.04], [0.23, 0.028],
  [0.84, 0.028], [0.875, 0.07], [0.965, 0.075], [1.0, 0.045], [1.0, -0.045],
  [0.965, -0.075], [0.875, -0.07], [0.84, -0.028], [0.23, -0.028], [0.185, -0.04], [0.16, -0.055], [0.085, -0.055],
];

let sharedGeometry;
function plateGeometry() {
  if (!sharedGeometry) {
    sharedGeometry = new THREE.LatheGeometry(PROFILE.map(([r, y]) => new THREE.Vector2(r, y)), 96);
    sharedGeometry.computeVertexNormals();
  }
  return sharedGeometry;
}

// Engraved text ring drawn to a canvas, used as a decal on the plate face.
function engravingTexture(text, { size = 1024, outer = 0.82, inner = 0.34 } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const R = size / 2;
  ctx.translate(R, R);

  const gold = ctx.createLinearGradient(-R, -R, R, R);
  gold.addColorStop(0, '#7d6a4f');
  gold.addColorStop(0.45, '#cbbb9c');
  gold.addColorStop(1, '#8f7a58');
  ctx.fillStyle = gold;
  ctx.strokeStyle = gold;

  // Two hairline rings
  const px = (r) => (r / outer) * R;
  ctx.lineWidth = 3;
  [0.78, 0.5].forEach((r) => { ctx.beginPath(); ctx.arc(0, 0, px(r), 0, Math.PI * 2); ctx.stroke(); });

  // Tick marks between the rings
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const len = i % 10 === 0 ? 26 : 12;
    ctx.save();
    ctx.rotate(a);
    ctx.fillRect(px(0.5) + 4, -1.2, len, 2.4);
    ctx.restore();
  }

  // Text around the outer band
  ctx.font = `700 ${Math.round(size * 0.05)}px Antonio, "Arial Narrow", sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  const radius = px(0.66);
  const chars = [...text];
  const widths = chars.map((ch) => ctx.measureText(ch).width + size * 0.012);
  const total = widths.reduce((a, b) => a + b, 0);
  let angle = -Math.PI / 2 - (total / radius) / 2;
  chars.forEach((ch, i) => {
    const w = widths[i];
    angle += (w / 2) / radius;
    ctx.save();
    ctx.rotate(angle);
    ctx.translate(0, -radius);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    angle += (w / 2) / radius;
  });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return { tex, outer, inner };
}

export function createPlate(materials, { radius = 3.4, text = 'AURUM FITNESS  ✦  BANGALORE  ✦  ', accent = false } = {}) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(plateGeometry(), materials.iron);
  group.add(body);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.012, 12, 160), materials.brass);
  rim.rotation.x = Math.PI / 2;
  const rimBack = rim.clone();
  rim.position.y = 0.076;
  rimBack.position.y = -0.076;
  const hub = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.02, 12, 64), materials.brass);
  hub.rotation.x = Math.PI / 2;
  hub.position.y = 0.056;
  group.add(rim, rimBack, hub);

  const { tex, outer, inner } = engravingTexture(text);
  const decalMat = new THREE.MeshStandardMaterial({
    map: tex,
    transparent: true,
    metalness: 0.9,
    roughness: 0.3,
    emissive: new THREE.Color('#d8c7a4'),
    emissiveMap: tex,
    emissiveIntensity: accent ? 0.1 : 0.04,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  });
  const decalGeo = new THREE.RingGeometry(inner, outer, 128, 1);
  // RingGeometry UVs are planar across the outer radius, which matches the canvas layout.
  const front = new THREE.Mesh(decalGeo, decalMat);
  front.rotation.x = -Math.PI / 2;
  front.position.y = 0.0295;
  const back = new THREE.Mesh(decalGeo, decalMat);
  back.rotation.x = Math.PI / 2;
  back.rotation.z = Math.PI;
  back.position.y = -0.0295;
  group.add(front, back);

  group.scale.set(radius, radius, radius);
  group.userData = { decalMat };
  return group;
}
