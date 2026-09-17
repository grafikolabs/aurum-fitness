import * as THREE from 'three';
import { FLOOR_Y } from './constants.js';

// Projects club coordinates onto the floor. Stylised, not survey-accurate.
export function projectLocations(locations, { scale = 3.1 } = {}) {
  const lat0 = locations.reduce((s, l) => s + l.lat, 0) / locations.length;
  const lng0 = locations.reduce((s, l) => s + l.lng, 0) / locations.length;
  const kx = 111.32 * Math.cos((lat0 * Math.PI) / 180);
  return locations.map((l) => ({
    key: l.key,
    name: l.name,
    area: l.area,
    x: (l.lng - lng0) * kx * scale,
    z: -(l.lat - lat0) * 110.57 * scale,
  }));
}

function labelTexture(title, sub) {
  const c = document.createElement('canvas');
  c.width = 768; c.height = 192;
  const ctx = c.getContext('2d');
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f5ecdd';
  ctx.font = '700 64px Antonio, "Arial Narrow", sans-serif';
  ctx.fillText(title.toUpperCase(), 384, 84);
  ctx.fillStyle = 'rgba(245, 236, 221, 0.62)';
  ctx.font = '600 30px "Montserrat Variable", Montserrat, sans-serif';
  ctx.fillText(sub.toUpperCase().split('').join(String.fromCharCode(8202)), 384, 142);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createMap(materials, points) {
  const group = new THREE.Group();
  const beamMat = () => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color('#d9cfc1') }, uIntensity: { value: 0.6 }, uTime: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform vec3 uColor; uniform float uIntensity, uTime; varying vec2 vUv;
      void main(){ float a = pow(clamp(1.0 - vUv.y, 0.0, 1.0), 2.2) * uIntensity; a *= 0.85 + 0.15 * sin(uTime * 3.0 + vUv.y * 20.0); gl_FragColor = vec4(uColor * a, a); }`,
  });

  const beacons = points.map((p, i) => {
    const b = new THREE.Group();
    b.position.set(p.x, FLOOR_Y, p.z);

    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.42, 9, 32, 1, true), beamMat());
    beam.position.y = 4.5;
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 0), materials.brass);
    gem.position.y = 1.3;
    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTexture(p.name.replace('Aurum ', ''), p.area), transparent: true, depthWrite: false, toneMapped: false }));
    label.scale.set(4, 1, 1);
    label.position.y = 2.4 + (i % 2) * 1.5;
    label.center.set(0.5, 0);
    b.add(beam, gem, label);
    b.userData = { beam, gem, label, key: p.key };
    group.add(b);
    return b;
  });

  group.userData = { beacons };
  return group;
}

export function updateMap(group, floorUniforms, { visibility, activeKey, time }) {
  group.visible = visibility > 0.01;
  floorUniforms.uMap.value = visibility;
  const { beacons } = group.userData;
  beacons.forEach((b, i) => {
    const active = b.userData.key === activeKey ? 1 : 0;
    b.userData.activeTarget = active;
    b.userData.active = THREE.MathUtils.lerp(b.userData.active ?? 0, active, 0.08);
    const a = b.userData.active;
    const rise = THREE.MathUtils.clamp(visibility * 1.4 - i * 0.08, 0, 1);
    b.scale.set(1, Math.max(rise, 0.001), 1);
    b.userData.beam.material.uniforms.uTime.value = time;
    b.userData.beam.material.uniforms.uIntensity.value = (0.2 + a * 0.8) * rise;
    b.userData.beam.material.uniforms.uColor.value.set(a > 0.5 ? '#e8392c' : '#d9cfc1');
    b.userData.gem.rotation.y = time * (0.6 + a);
    b.userData.gem.position.y = 1.3 + Math.sin(time * 1.4 + i) * 0.12 + a * 0.4;
    b.userData.label.material.opacity = rise * (0.55 + a * 0.45);
    b.userData.label.scale.set(4 * (1 + a * 0.2), 1 * (1 + a * 0.2), 1);
    floorUniforms.uBeacons.value[i].z = a;
  });
}
