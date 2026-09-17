// Converts the raw assets pulled from aurum.fit into web-ready files under /public.
// Photos -> WebP (two widths), videos -> H.264 at sane bitrates, curated feature imagery
// (graded crops of the brand film, pro shoot and CC0 stock) -> WebP.
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const SRC = 'source-assets';
const IMG = 'public/img';
const VID = 'public/video';
const BRAND = 'public/brand';
[IMG, VID, BRAND].forEach((d) => mkdirSync(d, { recursive: true }));

const photos = {
  // Aurum Luxury Fitness Club, Indiranagar (aurum-fitness-lcc)
  'lcc-hero': 'WhatsApp-Image-2024-10-14-at-4.49.02-PM.jpeg',
  'lcc-1': '13.jpg', 'lcc-2': '11.jpg', 'lcc-3': '9.jpg', 'lcc-4': '7.jpg',
  'lcc-5': '6.jpg', 'lcc-6': '5.jpg', 'lcc-7': '4.jpg', 'lcc-8': '3.jpg',
  // Aurum Health Club, Indiranagar (aurum-fitness-community)
  'health-1': 'Wdited-aurum-65-scaled.jpg', 'health-2': 'Wdited-aurum-8-scaled.jpg',
  'health-3': 'Wdited-aurum-19-scaled.jpg', 'health-4': 'Wdited-aurum-15-scaled.jpg',
  'health-5': 'Wdited-aurum-7-scaled.jpg', 'health-6': 'Wdited-aurum-72-scaled.jpg',
  'health-7': '1.jpg', 'health-8': '2.jpg', 'health-9': '3-1.jpg', 'health-10': '4-1.jpg',
  'health-11': '5-1.jpg', 'health-12': '6-1.jpg',
  // Aurum Fitness, Koramangala (aurum-fitness-elite)
  'kora-1': '1-1.jpg', 'kora-2': '2-1.jpg', 'kora-3': '3-2.jpg', 'kora-4': '4-2.jpg',
  'kora-5': '5-2.jpg', 'kora-6': '6-2.jpg',
  // Aurum Fitness, Brigade Road (aurum-elite-central)
  'brigade-1': 'WhatsApp-Image-2024-11-11-at-12.36.55-PM.jpeg',
  'brigade-2': 'WhatsApp-Image-2024-11-11-at-12.36.54-PM-1.jpeg',
  'brigade-3': 'WhatsApp-Image-2024-11-11-at-12.36.56-PM.jpeg',
  'brigade-4': 'WhatsApp-Image-2024-11-11-at-12.36.55-PM-2.jpeg',
  // Personal training / people
  'pt-duo': 'Frame-427318954.png',
  'story-abhishek': 'IMG_2906-2-1.jpg',
  'story-santhanu': 'IMG_2908-2.jpg',
  'poster-members': 'Screenshot-2026-07-16-at-7.38.12-PM.png',
  'poster-all-ages': 'IMG_5603.jpg',
  'poster-one-word': 'Screenshot-2026-07-16-at-7.42.55-PM.png',
};

const blog = {
  'blog-luxury-facilities': 'What-Facilities-Should-You-Expect-at-a-Luxury-Gym-in-Bangalore.png',
  'blog-luxury-different': 'What-Makes-a-Luxury-Gym-in-Bangalore-Different-From-a-Standard-Fitness-Ce.png',
  'blog-pt-frequency': 'How-Often-Should-You-Work-With-a-Personal-Trainer-to-See-Progress.png',
  'blog-pt-weight-strength': 'Can-Personal-Training-Help-With-Weight-Loss-and-Strength-at-the-Same-Time.png',
  'blog-women': 'What-Makes-a-Gym-Comfortable-and-Welcoming-for-Women.png',
  'blog-crowd-times': 'What-Are-the-Best-Workout-Times-to-Avoid-Crowded-Gyms-in-Indiranagar.png',
  'blog-pt-questions': 'What-Should-You-Ask-a-Personal-Trainer-Before-Starting-Your-Sessions.png',
  'blog-pt-right': 'How-to-Know-If-a-Personal-Trainer-Is-Right-for-Your-Fitness-Goals.png',
  'blog-crowding': 'Does-Gym-Crowding-Affect-Your-Workout-and-Progress.png',
  'blog-equipment': 'How-Important-Is-Equipment-Quality-When-Choosing-a-Gym-in-Bangalore.png',
  'blog-luxury-indiranagar': 'What-Should-You-Expect-From-a-Luxury-Fitness-Club-in-Indiranagar.png',
  'blog-best-gym': 'ChatGPT-Image-May-26-2026-01_12_02-PM.png',
  'blog-premium-checklist': 'ChatGPT-Image-May-26-2026-12_59_46-PM.png',
  'blog-pt-professionals': 'ChatGPT-Image-May-26-2026-12_42_22-PM.png',
};

async function webp(name, file, widths = [1600, 800]) {
  for (const w of widths) {
    const out = path.join(IMG, `${name}${w === widths[0] ? '' : `-${w}`}.webp`);
    if (existsSync(out)) continue;
    await sharp(path.join(SRC, file)).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(out);
  }
}

const run = async () => {
  for (const [n, f] of Object.entries(photos)) await webp(n, f);
  for (const [n, f] of Object.entries(blog)) await webp(n, f, [960]);

  // Brand marks
  await sharp(path.join(SRC, 'new-logo.png')).trim().resize({ width: 512 }).webp({ quality: 90 }).toFile(path.join(BRAND, 'aurum-logo.webp'));
  await sharp(path.join(SRC, 'new-logo.png')).trim().resize({ width: 512 }).png().toFile(path.join(BRAND, 'aurum-logo.png'));
  await sharp(path.join(SRC, 'new-logo.png')).resize({ width: 180 }).png().toFile(path.join(BRAND, 'apple-touch-icon.png'));
  await sharp(path.join(SRC, 'new-logo.png')).resize({ width: 64 }).png().toFile(path.join(BRAND, 'favicon.png'));
  await sharp(path.join(SRC, 'or_2_s02_w-1.png')).trim().resize({ width: 900 }).webp({ quality: 90 }).toFile(path.join(BRAND, 'aurum-wordmark.webp'));
  await sharp(path.join(SRC, 'new-logo.png')).resize({ width: 1200, height: 630, fit: 'contain', background: '#130000' }).jpeg({ quality: 85 }).toFile(path.join(BRAND, 'og-image.jpg'));
  console.log('images done');

  if (process.argv.includes('--no-video')) return;
  const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
  const vids = [
    // Brand film: silent background loop, 1080p + 720p.
    ['brand-film.mp4', 'brand-film-1080.mp4', ['-an', '-vf', 'scale=1920:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']],
    ['brand-film.mp4', 'brand-film-720.mp4', ['-an', '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']],
    // Instagram reels: keep audio (members are speaking).
    ...['reel-members', 'reel-all-ages', 'reel-one-word'].map((r) => [`${r}.mp4`, `${r}.mp4`, ['-vf', 'scale=540:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart']]),
  ];
  for (const [src, out, args] of vids) {
    const o = path.join(VID, out);
    if (existsSync(o)) continue;
    ff(['-i', path.join(SRC, src), ...args, o]);
    console.log('video', out);
  }
  // Stills. Reels carry word-by-word captions mid-frame, so the Ultra Luxury banner crops the
  // clean top band (golden ceilings) below the watermark. The film still is the video poster.
  const stills = [
    ['reel-one-word.mp4', 2.5, 'ultra-1', { left: 0, top: 150, width: 600, height: 410 }],
    ['brand-film.mp4', 22.5, 'film-still-2'],
  ];
  for (const [src, t, name, crop] of stills) {
    if (existsSync(path.join(IMG, `${name}-800.webp`))) continue;
    const tmp = path.join(VID, `${name}.png`);
    ff(['-ss', String(t), '-i', path.join(SRC, src), '-frames:v', '1', tmp]);
    const base = () => (crop ? sharp(tmp).extract(crop) : sharp(tmp));
    await base().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(IMG, `${name}.webp`));
    await base().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(IMG, `${name}-800.webp`));
    execFileSync('rm', [tmp]);
  }

  // Curated feature imagery: the best frames from Aurum's 4K film and 6000px shoot, plus CC0
  // stock where Aurum has no photography (licences in source-assets/stock/LICENSES.json).
  // One grade for all: slightly darker, calmer saturation, so the set reads as one shoot.
  const curated = [
    { name: 'pillar-ambience', film: 11.5, crop: null, brightness: 0.88, saturation: 0.85 },
    { name: 'pillar-equipment', file: 'Wdited-aurum-19.jpg', crop: { left: 0, top: 2500, width: 4000, height: 2500 }, brightness: 1.0, saturation: 0.9 },
    { name: 'pillar-training', film: 19.5, crop: null, brightness: 1.0, saturation: 0.8 },
    { name: 'pillar-recovery', file: 'stock/sauna-stones.jpg', crop: { left: 0, top: 240, width: 3840, height: 2400 }, brightness: 0.95, saturation: 0.9 },
    { name: 'pillar-nutrition', file: 'stock/nutrition-salad.jpg', crop: { left: 0, top: 60, width: 960, height: 600 }, brightness: 0.78, saturation: 0.82 },
    { name: 'pillar-locations', file: 'Wdited-aurum-72.jpg', crop: { left: 1100, top: 250, width: 2900, height: 1810 }, brightness: 0.92, saturation: 0.85 },
    { name: 'recovery-feature', file: 'stock/sauna-stones.jpg', crop: { left: 120, top: 0, width: 3600, height: 2880 }, brightness: 0.95, saturation: 0.9 },
  ];
  for (const c of curated) {
    if (existsSync(path.join(IMG, `${c.name}-800.webp`))) continue;
    let src = c.file && path.join(SRC, c.file);
    if (c.film) {
      src = path.join(VID, `${c.name}.png`);
      ff(['-ss', String(c.film), '-i', path.join(SRC, 'brand-film.mp4'), '-frames:v', '1', src]);
    }
    const base = () => {
      let img = sharp(src).rotate();
      if (c.crop) img = img.extract(c.crop);
      return img.modulate({ brightness: c.brightness, saturation: c.saturation }).linear(1.04, -4);
    };
    await base().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(IMG, `${c.name}.webp`));
    await base().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(IMG, `${c.name}-800.webp`));
    if (c.film) execFileSync('rm', [src]);
  }
  console.log('all done');
};
run();
