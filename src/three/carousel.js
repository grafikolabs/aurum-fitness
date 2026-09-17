import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Crop a texture like CSS object-fit: cover so photos keep their proportions on the card.
function coverFit(tex, aspect) {
  const apply = () => {
    const img = tex.image;
    if (!img?.width) return;
    const ia = img.width / img.height;
    tex.repeat.set(ia > aspect ? aspect / ia : 1, ia > aspect ? 1 : ia / aspect);
    tex.offset.set((1 - tex.repeat.x) / 2, (1 - tex.repeat.y) / 2);
  };
  if (tex.image?.width) apply();
  else tex.onUpdate = () => { tex.onUpdate = null; apply(); };
}

// Ring of floating glass cards, each holding a photo, orbiting the emblem.
export function createCarousel(materials, textures, { radius = 6, width = 3.7 } = {}) {
  const group = new THREE.Group();
  const height = width * 0.62;
  const step = (Math.PI * 2) / textures.length;

  const slabGeo = new RoundedBoxGeometry(width, height, 0.14, 5, 0.1);
  const backGeo = new RoundedBoxGeometry(width + 0.08, height + 0.08, 0.04, 4, 0.12);
  const photoGeo = new THREE.PlaneGeometry(width - 0.22, height - 0.22);

  const cards = textures.map((tex, i) => {
    const card = new THREE.Group();
    // Opaque on purpose: transmission only refracts opaque objects.
    const photoMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: new THREE.Color(0.9, 0.9, 0.9) });
    coverFit(tex, (width - 0.22) / (height - 0.22));
    const photo = new THREE.Mesh(photoGeo, photoMat);
    photo.position.z = -0.03;
    // Same photo on the reverse so cards on the far side of the ring never read as blank panels.
    const photoBack = new THREE.Mesh(photoGeo, photoMat);
    photoBack.rotation.y = Math.PI;
    photoBack.position.z = -0.12;
    const glass = new THREE.Mesh(slabGeo, materials.glass);
    const back = new THREE.Mesh(backGeo, materials.iron);
    back.position.z = -0.075;
    card.add(back, photo, photoBack, glass);

    const a = i * step;
    card.position.set(Math.sin(a) * radius, 0, Math.cos(a) * radius);
    card.rotation.y = a;
    card.userData = { photoMat, base: a };
    group.add(card);
    return card;
  });

  group.userData = { cards, step, radius };
  return group;
}

export function updateCarousel(group, { index, time, visibility, cameraTheta }) {
  const { cards, step } = group.userData;
  // Rotate the ring so the active card faces the camera.
  group.rotation.y = cameraTheta - index * step;
  cards.forEach((card, i) => {
    const n = cards.length;
    let d = (((i - index) % n) + n) % n;
    if (d > n / 2) d -= n;
    const focus = THREE.MathUtils.clamp(1 - Math.abs(d), 0, 1);
    card.position.y = Math.sin(time * 0.7 + i * 1.3) * 0.12 + (1 - visibility) * -6;
    card.rotation.z = Math.sin(time * 0.4 + i) * 0.02;
    const s = (0.82 + focus * 0.18) * visibility;
    card.scale.setScalar(Math.max(s, 0.0001));
    card.userData.photoMat.color.setScalar(0.32 + focus * 0.6);
  });
  group.visible = visibility > 0.01;
}
