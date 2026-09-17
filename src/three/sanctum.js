import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

import { FLOOR_Y, COLONNADE_RADIUS } from './constants.js';

// Fluted Roman column: shaft with vertex-displaced flutes, stepped base and capital.
function columnGeometry(height) {
  const shaft = new THREE.CylinderGeometry(0.5, 0.58, height, 96, 24, true);
  const pos = shaft.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const a = Math.atan2(v.z, v.x);
    const flute = 1 - 0.045 * Math.pow(0.5 + 0.5 * Math.cos(a * 20), 2);
    pos.setXYZ(i, v.x * flute, v.y, v.z * flute);
  }
  shaft.computeVertexNormals();
  shaft.translate(0, height / 2 + 0.7, 0);

  const plinth = new THREE.BoxGeometry(1.7, 0.4, 1.7).translate(0, 0.2, 0);
  const torus = new THREE.CylinderGeometry(0.72, 0.78, 0.3, 48).translate(0, 0.55, 0);
  const echinus = new THREE.CylinderGeometry(0.78, 0.52, 0.45, 48).translate(0, height + 0.9, 0);
  const abacus = new THREE.BoxGeometry(1.8, 0.35, 1.8).translate(0, height + 1.3, 0);

  const parts = [shaft, plinth, torus, echinus, abacus].map((g) => (g.index ? g.toNonIndexed() : g));
  parts.forEach((g) => { g.deleteAttribute('uv'); });
  return mergeGeometries(parts);
}

export function createColonnade(materials, { count = 16, height = 12 } = {}) {
  const group = new THREE.Group();
  const geo = columnGeometry(height);
  const mesh = new THREE.InstancedMesh(geo, materials.stone, count);
  const m = new THREE.Matrix4();
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + Math.PI / count;
    m.makeRotationY(-a);
    m.setPosition(Math.sin(a) * COLONNADE_RADIUS, FLOOR_Y, Math.cos(a) * COLONNADE_RADIUS);
    mesh.setMatrixAt(i, m);
  }
  group.add(mesh);

  // Entablature ring with a gold inlay line
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(COLONNADE_RADIUS + 1.1, COLONNADE_RADIUS + 1.1, 1.2, 128, 1, true), new THREE.MeshStandardMaterial({ color: '#241210', roughness: 0.6, metalness: 0.2, side: THREE.DoubleSide }));
  beam.position.y = FLOOR_Y + height + 2.1;
  const inlay = new THREE.Mesh(new THREE.TorusGeometry(COLONNADE_RADIUS + 1.05, 0.03, 8, 256), materials.brass);
  inlay.rotation.x = Math.PI / 2;
  inlay.position.y = FLOOR_Y + height + 1.6;
  group.add(beam, inlay);
  return group;
}

// Polished floor with gold inlay rings. Doubles as the city map in the locations chapter.
export function createFloor({ beacons = [] } = {}) {
  const MAX = 6;
  const uniforms = {
    uTime: { value: 0 },
    uMap: { value: 0 },
    uWarm: { value: 1 },
    uBeacons: { value: Array.from({ length: MAX }, (_, i) => new THREE.Vector3(beacons[i]?.x ?? 999, beacons[i]?.z ?? 999, 0)) },
    uFogColor: { value: new THREE.Color('#0c0201') },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: false,
    vertexShader: `varying vec3 vWorld; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `
      uniform float uTime, uMap, uWarm; uniform vec3 uBeacons[${MAX}]; uniform vec3 uFogColor;
      varying vec3 vWorld;
      // Edges kept ascending: reversed smoothstep is undefined in GLSL and can return NaN.
      float ring(float d, float r, float w){ return 1.0 - smoothstep(0.0, w, abs(d - r)); }
      float grid(vec2 p, float s, float w){ vec2 g = abs(fract(p / s - 0.5) - 0.5) * s; return 1.0 - smoothstep(0.0, w, min(g.x, g.y)); }
      void main(){
        vec2 p = vWorld.xz; float d = length(p);
        vec3 base = mix(vec3(0.075, 0.018, 0.012), vec3(0.03, 0.006, 0.004), smoothstep(2.0, 22.0, d));
        // warm pool of light under the emblem
        base += vec3(0.55, 0.24, 0.1) * 0.16 * uWarm * exp(-d * d / 26.0);
        vec3 gold = vec3(0.72, 0.65, 0.54);
        float inlay = ring(d, 4.2, 0.03) + ring(d, 9.5, 0.025) + ring(d, 23.2, 0.05) * 0.8 + ring(d, 25.0, 0.02);
        // radial spokes between the columns
        float ang = atan(p.y, p.x + 1e-4); float spokes = (1.0 - smoothstep(0.0, 0.012, abs(sin(ang * 8.0)) * d * 0.12)) * smoothstep(4.2, 9.5, d) * (1.0 - smoothstep(9.5, 23.2, d));
        vec3 col = base + gold * (inlay * 0.26 + spokes * 0.08) * (1.0 - uMap * 0.5);
        // city map layer
        float fine = grid(p, 1.0, 0.02) * 0.06; float major = grid(p, 5.0, 0.035) * 0.2;
        float compass = ring(d, 6.0, 0.02) * 0.25 + ring(d, 12.0, 0.02) * 0.18;
        vec3 mapCol = gold * (fine + major + compass) * (1.0 - smoothstep(6.0, 19.0, d));
        float pulse = 0.0;
        for (int i = 0; i < ${MAX}; i++) {
          float bd = length(p - uBeacons[i].xy);
          float lit = uBeacons[i].z;
          pulse += exp(-bd * bd * (2.4 - lit * 1.2)) * (0.18 + lit * 0.6);
          pulse += ring(bd, mod(uTime * 1.2 + float(i) * 0.37, 3.0), 0.05) * (1.0 - mod(uTime * 1.2 + float(i) * 0.37, 3.0) / 3.0) * (0.3 + lit);
        }
        mapCol += vec3(0.88, 0.17, 0.12) * pulse * 0.5;
        col += mapCol * uMap;
        float fog = smoothstep(20.0, 44.0, d);
        gl_FragColor = vec4(mix(col, uFogColor, fog), 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(52, 160), mat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = FLOOR_Y;
  floor.userData.uniforms = uniforms;
  return floor;
}
