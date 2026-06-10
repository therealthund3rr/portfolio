# Nicolò Celentano — Portfolio

![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.175-ffffff?style=flat-square&logo=threedotjs&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-3-88ce02?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

Personal portfolio — dark, minimal, interactive. Built around a real-time 3D character model rendered in WebGL with mouse-reactive lighting and scroll-driven animations throughout.

**[Live →](https://portfolio-gray-three-12.vercel.app/)**

![Preview](.github/preview.png)

---

## What you see

A single-page experience with six sections:

| Section | What's interesting |
|---|---|
| **Landing** | 3D character in WebGL, rim light follows the cursor, intro animation on load |
| **About** | Split-text reveal on scroll |
| **What I Do** | Hover-expand service cards |
| **Career** | Timeline with animated progress bars, scrub-triggered on scroll |
| **Selected Work** | Horizontal scroll pinned with GSAP ScrollTrigger, project modals with screenshots |
| **Tech Stack** | Periodic table layout, elements illuminate on hover |

---

## Technical highlights

**3D character (Three.js + Draco-compressed GLB)**
The character is a custom GLB model authored in Blender — 946K vertices, 11 skeletal animations, fully rigged. Draco compression brings it from 48.7 MB down to **3.6 MB** (-92%) with no visual loss; the decoder is self-hosted and wired through `GLTFLoader.setDRACOLoader`. The scene uses a manual lighting rig — directional key light, cool fill, and a blue rim light (`#0055ff`) that adjusts emissive intensity as you scroll. The head bone tracks the cursor in world space via raycasting on `mousemove`.

**Custom cursor**
Blue dot (`#3399ff`) with `mix-blend-mode: difference` — inverts whatever is underneath it. On hover over the social icons, it morphs into a vertical pill that wraps the full icon stack via `getBoundingClientRect`. Lag implemented with a `requestAnimationFrame` lerp loop.

**Scroll animations (GSAP + ScrollTrigger + Lenis)**
Lenis handles smooth scroll. GSAP ScrollTrigger pins the Work section while a horizontal track translates across the viewport. Career progress bars grow on scrub. Text reveals use a custom `TextSplitter` that wraps each character in a `<span>` for per-character animation.

**Loading sequence**
White overlay expands to full-screen black, then collapses cinematically before the content appears. Managed through a React context so all components know when the intro has finished.

**Performance**
All static assets are optimized for first load: Draco-compressed geometry (3.6 MB), WebP screenshots and logos (~440 KB total), 720p background video (3.4 MB). Total payload is ~8 MB — down from 72 MB before optimization.

---

## Stack

| Layer | Tech |
|---|---|
| Build | Vite 6, TypeScript 5.8 |
| UI | React 19 |
| 3D | Three.js 0.175, GLB + Draco |
| Animation | GSAP 3, ScrollTrigger, Lenis |
| Icons | react-icons (Tabler) |
| Analytics | Vercel Analytics + Speed Insights |
| Deploy | Vercel (auto-deploy on push) |

---

## Project structure

```
src/
├── components/
│   ├── Character/          # Three.js scene, lighting, mouse tracking, animations
│   │   └── utils/          # animationUtils, lighting, mouseUtils, resizeUtils
│   ├── utils/              # GSAP scroll timelines, loading FX, text splitter
│   └── styles/             # Per-component CSS
├── context/
│   └── LoadingProvider.tsx # Global loading state
├── config.ts               # All content (career, projects, tech stack)
└── main.tsx
public/
├── character.glb           # Draco-compressed 3D model (3.6 MB)
├── draco/                  # Self-hosted Draco decoder (wasm)
├── char_enviorment.hdr     # HDR environment map
└── tech-bg.mp4             # Tech stack background video (720p)
```

---

## Running locally

```bash
git clone https://github.com/therealthund3rr/portfolio
cd portfolio
npm install
npm run dev
```

That's it — all assets are committed directly to the repo, so a plain `git clone` pulls everything you need.
