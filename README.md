# Aurum Fitness website

A redesign of [aurum.fit](https://aurum.fit): an immersive, scroll-driven 3D site built with Three.js, GSAP and Lenis,
prerendered to static HTML at the same URLs as the current WordPress site.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview    # serve dist/ on :4173
npm run qa         # functional checks against the preview server (or pass a URL)
npm run shots      # WebGL screenshots of every chapter (add --gpu for real-GPU 2x, --mobile)
```

## Deploying

The site is published to GitHub Pages at <https://grafikolabs.github.io/aurum-fitness/>:

```bash
npm run deploy     # builds with the /aurum-fitness/ base path and pushes dist/ to gh-pages
```

A project Pages site is served from a sub-path, so the build sets `BASE_PATH=/aurum-fitness/`
(Vite rewrites asset URLs; `scripts/gen-pages.mjs` prefixes navigation links and lazy video
`data-src` attributes). The preview build also sets `NOINDEX=1` so it never competes with
aurum.fit in search results. For the real domain, build with no env vars: paths return to `/` and
the pages become indexable.

Verify a deployment with `npm run qa https://grafikolabs.github.io/aurum-fitness`.

## The concept: The Sanctum

Aurum describes itself as "inspired by Roman architecture". The home page takes place inside a dark colonnade with the
Aurum emblem at its centre, extruded in 3D from outlines traced off the official logo (velvet crimson crown, gold rim,
cream U). The camera makes one full circle around it over the length of the page:

| Chapter | What happens in 3D |
| --- | --- |
| Hero | Emblem in front of an engraved Olympic plate |
| Why Aurum (pinned) | Six floating glass photo cards orbit the emblem |
| Recovery | Gold dust turns into rising steam, crimson light warms |
| Brand film | The letters AURUM grow until the film fills the screen |
| Membership | Floating glass plan cards refract the emblem behind them |
| Personal training (pinned) | Five plates stack into a tower; you climb from Level 5 to Level 1 |
| Clubs | The floor becomes a map of Bangalore with a light beacon per club |
| Join | The circle closes back at the emblem |

The small dial bottom-left shows progress around that circle.

## Structure

```
src/data/site.js          All content (from aurum.fit), one source of truth
src/templates/            Page templates, prerendered by scripts/gen-pages.mjs
src/three/                Stage, emblem, plate, colonnade, carousel, tower, map, dust
src/scroll/director.js    Maps page sections to camera keyframes, drives pinned chapters
src/ui/interactions.js    Nav, reveals, glass tilt, reels, WhatsApp form, chat
src/styles/               base (design system), home, sub pages
scripts/                  asset optimisation, logo tracing, page generation, QA
source-assets/            Original files downloaded from aurum.fit (not in git: 270MB)
```

## Pages (URLs preserved)

`/`, `/luxury-gym-in-bangalore-indiranagar/`, `/aurum-fitness-lcc/`, `/aurum-fitness-community/`, `/aurum-fitness-elite/`,
`/aurum-elite-central/`, `/personal-training/`, `/level-1/` (canonical to personal training), `/weight-loss/`, `/blog/`.
Home anchors `#fitness`, `#Aboutus`, `#services`, `#Locations` and `#contact` are kept.

## Brand

Colours come from the current site CSS and logo: crimson `#e02b20` (actions), gold `#e0b65c` / `#c9992e` / `#a87a1e` /
`#f2d492` (material and highlights), cream `#f5ecdd` (text), maroon-black `#130000` (ground). Body type stays Montserrat
(brand font); Antonio is the display face.

## Performance and accessibility

- Three.js loads as a separate chunk after the content; the loader never waits for 3D.
- Quality tiers: phones and low-core devices skip bloom and real glass transmission, use fewer particles and a lower pixel ratio.
- Rendering pauses while the brand film covers the screen and when the tab is hidden.
- Without WebGL the page is fully usable (photos move into the cards, the logo shows as a still).
- `prefers-reduced-motion` disables smooth scrolling, idle animation, tilt and parallax.

## Imagery

Feature photography comes from Aurum's own 4K brand film and professional shoot. Where Aurum has no
photography (recovery, nutrition), CC0 images are used; sources and licences are listed in
`source-assets/stock/LICENSES.json`. Replace them with real club photos when available by editing
the `curated` list in `scripts/optimize-assets.mjs` and running `npm run assets`.

## Shader note

Keep `smoothstep` edges ascending and clamp `pow` bases in shaders. Undefined results (NaN) get
smeared across the whole frame by the bloom pass and make the 3D background disappear.

## To confirm with Aurum

See the handover notes: Ultra Luxury address, the Health Club phone number, the club count, blog hosting and form delivery.
