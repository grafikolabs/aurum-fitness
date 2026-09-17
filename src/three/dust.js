import * as THREE from 'three';

// Drifting gold dust. uSteam turns it into rising warm vapour for the recovery chapter.
export function createDust({ count = 1800, radius = 22, height = 16 } = {}) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(Math.random()) * radius;
    const a = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = Math.random() * height;
    pos[i * 3 + 2] = Math.sin(a) * r;
    seed[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

  const uniforms = {
    uTime: { value: 0 },
    uSteam: { value: 0 },
    uOpacity: { value: 1 },
    uPixelRatio: { value: 1 },
    uHeight: { value: height },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime, uSteam, uPixelRatio, uHeight; attribute float aSeed; varying float vAlpha; varying float vSeed;
      void main(){
        vec3 p = position;
        float speed = mix(0.12, 0.9, uSteam) * (0.4 + aSeed);
        p.y = mod(p.y + uTime * speed, uHeight) - 3.0;
        p.x += sin(uTime * 0.3 + aSeed * 40.0) * (0.4 + uSteam * 0.8);
        p.z += cos(uTime * 0.25 + aSeed * 30.0) * 0.4;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float size = mix(1.4, 3.0, aSeed) * (1.0 + uSteam * 1.8);
        gl_PointSize = size * uPixelRatio * (14.0 / -mv.z);
        float edge = smoothstep(0.0, 2.0, p.y + 3.0) * (1.0 - smoothstep(uHeight - 6.0, uHeight - 3.0, p.y));
        vAlpha = edge * (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 60.0)));
        vSeed = aSeed;
      }`,
    fragmentShader: `
      uniform float uOpacity, uSteam; varying float vAlpha; varying float vSeed;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = 1.0 - smoothstep(0.0, 0.5, d);
        vec3 gold = mix(vec3(1.0, 0.9, 0.78), vec3(0.98, 0.95, 0.9), vSeed);
        vec3 col = mix(gold, vec3(0.96, 0.9, 0.82), uSteam * 0.6);
        gl_FragColor = vec4(col, a * vAlpha * uOpacity * mix(0.55, 0.3, uSteam));
      }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.userData.uniforms = uniforms;
  return points;
}
