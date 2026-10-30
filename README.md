# nanobit
> **Interactive 3D particle dust & optical depth gallery**  
> *By kicode01*

[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=nanobit)](https://nanobit.vercel.app)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![WebGL2](https://img.shields.io/badge/WebGL2-1%2C048%2C576%20Grains-gold.svg)](#)

---

## 🌟 Overview

**`nanobit`** transforms classical art, Renaissance sculptures, and custom photographs into living, aerodynamic fields of **1,048,576 discrete dust particles** rendered in WebGL2.

Bridging the physical and digital, images do not merely transition—they dissolve into swirling quantum dust, breathe under physical air currents, and settle into 3D bas-relief sculptures guided by monocular depth estimation.

---

## 🏛️ Curated Masterpieces

* **The Starry Night** — Vincent van Gogh (1889)
* **David** — Michelangelo Buonarroti (1504)
* **Mona Lisa** — Leonardo da Vinci (c. 1503)
* **Girl with a Pearl Earring** — Johannes Vermeer (c. 1665)
* **Pietà** — Michelangelo Buonarroti (1499)
* Plus procedural generative landscapes: *Ridge*, *Dune*, and the *尘 (Dust) Glyph*.

---

## ⚡ Zero-Framedrop Performance Architecture

* **Pre-Baked Neural Topology**: Built-in masterworks load with their full 3D relief pre-calculated during the initial boot splash. Page turns between artworks execute at a rock-solid **60 FPS** with **0ms lag**.
* **Smart Rest-Queue Inference**: For user-dragged photos, the in-browser neural depth model (`Depth Anything V2`) is automatically queued until transition animations finish—preventing GPU pipeline starvation and animation stutter.
* **Low-End Hardware Optimization**: Automatic device tiering disables heavy blur passes on integrated GPUs, ensuring buttery smooth rendering on phones, tablets, and budget laptops.
* **100% Self-Contained**: Zero external server requirements, zero API keys, and completely private—all image processing happens strictly inside the user's browser tab.

---

## 🎮 Controls & Shortcuts

| Key / Control | Action | Description |
| :--- | :---: | :--- |
| **`Space`** / **Next** | Turn of the Page | Dissolves dust and gathers into the next specimen |
| **`g`** / **Stir** | Stir Dust | Click for a dust gust; hold down pointer to continuously billow |
| **`b`** / **Plate** | Dark Glass / Rag Paper | Smooth physical dissolve between dark glass and textured paper |
| **`p`** / **Save** | Capture High-Res PNG | Exports current 3D particle rendering |
| **`h`** | Toggle UI | Hides all interface chrome for pure gallery contemplation |
| **`d`** | Diagnostic Cycle | Cycles optical debug layers (depth of field, occlusion, normals) |
| **`↑ / ↓`** | Pull Focus | Adjusts the camera's optical focal plane |
| **Mouse / Touch Drag** | Orbit Camera | Rotates the 3D specimen in spatial volume |

---

## 🚀 Live Demo
Experience the production release at [**nanobit.vercel.app**](https://nanobit.vercel.app).

---

## 📜 Intellectual Property & License
Copyright © 2026 kicode01. All Rights Reserved.  
Proprietary software. Unauthorized copying, distribution, modification, reverse engineering, or extraction of code and assets is strictly prohibited. See [LICENSE](LICENSE) for details.
