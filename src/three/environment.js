import * as THREE from 'three';

// A small studio built from emissive panels, baked into a PMREM environment map.
// Gives every metal and glass surface warm gold and crimson reflections that match the brand.
export function createEnvironment(renderer) {
  const env = new THREE.Scene();
  const room = new THREE.Mesh(
    new THREE.SphereGeometry(20, 32, 16),
    new THREE.MeshBasicMaterial({ color: '#0d0302', side: THREE.BackSide }),
  );
  env.add(room);

  const panel = (color, intensity, w, h, pos, look) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }),
    );
    m.position.set(...pos);
    m.lookAt(...look);
    env.add(m);
  };

  panel('#fff1d6', 5, 14, 5, [0, 12, 4], [0, 0, 0]); // soft box above
  panel('#f0dcc0', 5, 1.2, 14, [-11, 3, 3], [0, 2, 0]); // warm strip left
  panel('#f0dcc0', 3.5, 1.2, 14, [11, 3, -2], [0, 2, 0]); // warm strip right
  panel('#e02b20', 6, 10, 1.4, [0, 1, -12], [0, 1, 0]); // crimson band behind
  panel('#ffe2b0', 3, 6, 3, [4, 4, 12], [0, 1, 0]); // key fill front
  panel('#3a2405', 2, 30, 30, [0, -8, 0], [0, 0, 0]); // warm floor bounce

  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(env, 0.035);
  pmrem.dispose();
  env.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); });
  return target.texture;
}
