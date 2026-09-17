import * as THREE from 'three';
import shapes from './emblem-shapes.json';

// The Aurum emblem, extruded from outlines traced off the official logo (scripts/trace-logo.py).
// Crown: velvet crimson faces with a gold bevelled rim. U: cream faces, gold rim.
export function createEmblem(materials, { height = 2.6 } = {}) {
  const group = new THREE.Group();
  group.name = 'emblem';

  const toShape = (pts) => new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const extrude = (pts, depth) => {
    const geo = new THREE.ExtrudeGeometry(toShape(pts), {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.011,
      bevelSegments: 4,
      curveSegments: 1,
    });
    geo.translate(0, 0, -depth / 2);
    geo.computeVertexNormals();
    return geo;
  };

  const crown = new THREE.Mesh(extrude(shapes.crown, 0.075), [materials.velvet, materials.gold]);
  const ring = new THREE.Mesh(extrude(shapes.ring, 0.06), [materials.cream, materials.gold]);
  ring.position.z = -0.012;

  const inner = new THREE.Group();
  inner.add(crown, ring);
  inner.scale.setScalar(height);
  group.add(inner);

  // Soft gold halo card behind the emblem, additive so it reads as light, not geometry.
  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color('#e0b65c') }, uStrength: { value: 0.26 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform vec3 uColor; uniform float uStrength; varying vec2 vUv;
        void main(){ float d = length(vUv - 0.5) * 2.0; float a = pow(max(0.0, 1.0 - d), 2.6) * uStrength; gl_FragColor = vec4(uColor * a, a); }`,
    }),
  );
  halo.scale.setScalar(height * 2.6);
  halo.position.z = -0.9;
  halo.renderOrder = -1;
  group.add(halo);

  group.userData.halo = halo;
  return group;
}
