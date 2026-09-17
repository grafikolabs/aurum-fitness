import * as THREE from 'three';

export const BRAND = {
  ink: new THREE.Color('#130000'),
  crimson: new THREE.Color('#e02b20'),
  gold: new THREE.Color('#e0b65c'),
  goldDeep: new THREE.Color('#c9992e'),
  goldLight: new THREE.Color('#f2d492'),
  cream: new THREE.Color('#f5ecdd'),
};

export function createMaterials({ quality }) {
  const gold = new THREE.MeshPhysicalMaterial({
    color: '#e8bd62',
    metalness: 1,
    roughness: 0.24,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
  });

  // Muted, brushed brass for secondary metalwork (plate rims, map markers), so bright gold
  // stays reserved for the emblem itself.
  const brass = new THREE.MeshStandardMaterial({
    color: '#7d6440',
    metalness: 1,
    roughness: 0.42,
  });

  // The logo's crimson crown has a velvet texture; sheen gives that soft fibre highlight.
  const velvet = new THREE.MeshPhysicalMaterial({
    color: '#b3170f',
    roughness: 0.62,
    metalness: 0,
    sheen: 1,
    sheenColor: new THREE.Color('#ff5a40'),
    sheenRoughness: 0.35,
  });

  const cream = new THREE.MeshPhysicalMaterial({
    color: '#efe0c8',
    roughness: 0.32,
    metalness: 0,
    clearcoat: 0.8,
    clearcoatRoughness: 0.18,
  });

  const iron = new THREE.MeshStandardMaterial({
    color: '#1d0c09',
    metalness: 0.88,
    roughness: 0.36,
  });

  const stone = new THREE.MeshStandardMaterial({
    color: '#2b1511',
    metalness: 0.15,
    roughness: 0.62,
  });

  // Translucent reflective slab for the floating cards. Real transmission on capable GPUs,
  // a lighter clear-coated translucent fallback elsewhere.
  const glass = quality === 'high'
    ? new THREE.MeshPhysicalMaterial({
      color: '#fff4e6',
      metalness: 0,
      roughness: 0.06,
      transmission: 1,
      thickness: 0.35,
      ior: 1.5,
      iridescence: 0.35,
      iridescenceIOR: 1.3,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color('#f2d492'),
      attenuationDistance: 2.5,
      specularIntensity: 1,
    })
    : new THREE.MeshPhysicalMaterial({
      color: '#f5ecdd',
      metalness: 0,
      roughness: 0.08,
      transparent: true,
      opacity: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      depthWrite: false,
    });

  return { gold, brass, velvet, cream, iron, stone, glass };
}
