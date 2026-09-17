// Scene constants shared with the scroll director. Kept free of three.js imports so the
// page's first script stays small and the 3D stage can load as a separate chunk.
export const FLOOR_Y = -2.6;
// Wide enough that the camera path never passes through the columns.
export const COLONNADE_RADIUS = 24;
export const TOWER_BASE_Y = FLOOR_Y + 0.9;
export const TOWER_STEP = 1.35;

// Every animatable value the scroll story can drive. Numbers blend; strings snap.
export const DEFAULT_STATE = {
  theta: 0, phi: 0.06, radius: 10.5, ty: 1.2, fx: 0, fz: 0,
  frameX: 0.35, frameY: 0,
  emY: 1.25, emScale: 1, emFollow: 0.75,
  plate: 1, plateTilt: 0,
  carousel: 0, carouselIndex: 0,
  tower: 0, level: 0,
  map: 0, club: '',
  steam: 0, warmth: 1, dust: 1, dim: 0,
};

export function detectWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function detectQuality() {
  const coarse = matchMedia('(pointer: coarse)').matches;
  const small = innerWidth < 820;
  const cores = navigator.hardwareConcurrency || 4;
  const saveData = navigator.connection?.saveData;
  return coarse || small || cores <= 4 || saveData ? 'low' : 'high';
}
