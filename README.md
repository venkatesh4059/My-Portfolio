# Portfolio Hero — Cinematic Next.js

A fullscreen cinematic portfolio hero built with **Next.js 14**, **Three.js**, and **GSAP**.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 App Router |
| 3D / Particles | Three.js + custom GLSL shaders |
| Animation | GSAP 3 (SSR-safe dynamic import) |
| Styling | CSS Modules |
| Fonts | Barlow Condensed + DM Mono (Google Fonts) |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Place your video
# The video (hero.mp4) is already inside public/video/
# Replace it any time with your own file — keep the same filename.

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
portfolio-hero/
├── app/
│   ├── globals.css          # CSS custom properties + resets
│   ├── layout.jsx           # Root layout + Google Fonts
│   └── page.jsx             # Page composition
│
├── components/
│   ├── VideoIntro/
│   │   ├── VideoIntro.jsx          # Hero section (GSAP + controls)
│   │   ├── CinematicLayer.jsx      # Three.js bokeh particle overlay
│   │   ├── VideoIntro.module.css   # All hero styles
│   │   └── index.js                # Barrel export
│   │
│   └── NextSection/
│       ├── NextSection.jsx         # Below-fold project cards
│       └── NextSection.module.css
│
└── public/
    └── video/
        └── hero.mp4                ← your talking-head video
```

---

## Personalisation

### Change Name / Role
Open `components/VideoIntro/VideoIntro.jsx` and edit:

```jsx
<span data-hero-first className={styles.firstName}>ALEX</span>
<span data-hero-last  className={styles.lastName}>MORGAN</span>
// ...
<p className={styles.roleMain}>Creative Developer & Motion Designer</p>
<p className={styles.roleSub}>— Crafting immersive digital worlds</p>
```

### Change Tagline
```jsx
<span className={styles.taglineText}>Available for Work · 2024</span>
```

### Swap the Video
Replace `public/video/hero.mp4` with any `.mp4`.
The blurred ambient background and main foreground both use the same source automatically.

### Adjust Particle Colors
Open `CinematicLayer.jsx` and edit the `palette` array:

```js
const palette = [
  [1.00, 0.55, 0.26],  // vivid orange  — R, G, B (0–1)
  [0.88, 0.90, 1.00],  // monitor blue-white
  // add / remove entries freely
];
```

### Particle Count / Density
```js
const COUNT = 220;  // lower for mobile-first, raise for dramatic effect
```

### GSAP Timing
All entrance timings are in the `timeline` inside `VideoIntro.jsx`.
Adjust `duration`, `delay`, and `ease` values to taste.

---

## Performance Notes

- Three.js is **dynamically imported** (`{ ssr: false }`) — zero server-side cost.
- GSAP is also dynamically imported — no SSR bundle weight.
- `requestAnimationFrame` loop is cancelled on component unmount.
- All Three.js geometries, materials, and the renderer are disposed on unmount.
- Videos use `playsInline` + `muted` autoplay (required by browsers).
- `will-change: transform` applied only to the blur layer.
- `mix-blend-mode: screen` on the canvas for GPU-composited particle blending.

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).
Reduced-motion media query disables animations for accessibility.

---

## License

MIT — use freely in personal or commercial portfolios.
