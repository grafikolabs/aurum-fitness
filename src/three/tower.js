import * as THREE from 'three';
import { createPlate } from './plate.js';
import { TOWER_BASE_Y, TOWER_STEP } from './constants.js';

// Five stacked plates, one per personal training level. Level 5 at the base, Level 1 at the summit.

export function createTower(materials, levels) {
  const group = new THREE.Group();
  const ordered = [...levels].sort((a, b) => b.level - a.level); // 5,4,3,2,1
  const plates = ordered.map((lvl, i) => {
    const radius = 3.1 - i * 0.28;
    const plate = createPlate(materials, { radius, text: `LEVEL ${lvl.level}  ✦  ${lvl.name.toUpperCase()}  ✦  ` });
    plate.position.y = TOWER_BASE_Y + i * TOWER_STEP;
    plate.userData.baseY = plate.position.y;
    group.add(plate);
    return plate;
  });

  // Gold spindle through the stack
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, TOWER_STEP * 5 + 1.2, 32), materials.iron);
  bar.position.y = TOWER_BASE_Y + TOWER_STEP * 2;
  group.add(bar);

  group.userData = { plates, bar };
  return group;
}

export function updateTower(group, { visibility, level, time }) {
  const { plates, bar } = group.userData;
  group.visible = visibility > 0.01;
  if (!group.visible) return;
  plates.forEach((plate, i) => {
    const rise = THREE.MathUtils.clamp(visibility * 1.6 - i * 0.15, 0, 1);
    const eased = 1 - Math.pow(1 - rise, 3);
    plate.position.y = plate.userData.baseY - (1 - eased) * 10;
    const active = Math.max(0, 1 - Math.abs(level - i));
    plate.rotation.y = time * (0.08 + i * 0.015) * (i % 2 ? -1 : 1);
    plate.userData.decalMat.emissiveIntensity = 0.03 + active * 0.4;
  });
  bar.scale.y = Math.max(0.001, visibility);
}
