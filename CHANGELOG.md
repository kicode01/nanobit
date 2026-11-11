# Changelog

All notable changes to the **nanobit** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] - 2026-11-11

### Added
- **Progressive Web App (PWA) Engine**:
  - Full Web App Manifest (`manifest.json`) supporting standalone display mode and custom branding.
  - Multi-resolution adaptive app icons: 192×192, 512×512, maskable 512×512, and 180×180 Apple Touch Icon.
  - Service Worker (`sw.js`) with intelligent stale-while-revalidate offline precaching.
  - Interactive "Install App" hook integration inside the Optical Studio panel.
- **Mobile Responsive Ergonomics & Touch Gestures**:
  - Fluid multi-touch pinch-to-zoom gesture on the WebGL2 canvas.
  - Double-tap gesture for instant camera alignment and zoom normalization.
  - Full hardware safe-area inset support (`env(safe-area-inset-*)`) for iOS Dynamic Island and Android system bars.
  - Touch-optimized slider hitzones and tactile chip controls across 320px–768px viewports.
  - Responsive thumbnail rail preserving quick masterpiece switching on mobile phones.

---

## [1.2.0] - 2026-11-08

### Added
- **18 Procedural Particle Morphology Primitives**:
  - `Dust`: Classic organic soft circular grains with Gaussian falloff.
  - `Bits`: Digital square silicon voxels with beveled pixel core highlights.
  - `Hex`: Quantum honeycomb nanotech lattice with 6-fold geometric symmetry.
  - `Prism`: Diamond crystalline facets with diagonal specular glints.
  - `Cross`: Precision digital micro-reticle markers.
  - `Star`: Four-point quantum astroid sparkle with high-intensity luminous core.
  - `Binary`: Floating 3D procedural 0s and 1s bitstream.
  - `ASCII`: Retro terminal micro-hash matrix (`#`).
  - `Torus`: Glowing annular quantum ring halo.
  - `Matrix`: Digital cyberpunk glyph code symbol.
  - `Digits`: Procedural 7-segment LED numeral readouts (`0` through `9`).
  - `Braille`: Tactile 2x3 punch-matrix embossed dot array.
  - `Voxel`: Pseudo-3D isometric crystalline micro-cube with 3-tone facet shading.
  - `Rune`: Ancient Norse & cybernetic runic vector sigils (`ᚠ`, `ᛉ`, `ᛏ`, `◇`).
  - `Glyph`: Alien & cybernetic cipher ideogram with concentric orbital rings.
  - `Delta`: Equilateral quantum prism triangle with inverted negative-space core.
  - `Atom`: Subatomic Rutherford-Bohr planetary orbital shells and bright nucleus.
  - `Letters`: Procedural Roman capital typographic glyphs (`A`, `E`, `X`, `O`, `T`).
- **11 Advanced Shader Materials**:
  - `Natural`: Authentic photographic and impasto pigment medium.
  - `Cyber`: Phosphor CRT raster scanlines with high-contrast cybernetic matrix glow.
  - `Gilded`: Gustav Klimt-inspired auric gold leaf with dynamic metallic specular glints.
  - `Holo`: Iridescent prismatic thin-film interference with continuous spectral dispersion.
  - `Thermal`: Thermodynamic infrared false-color spectral radiation.
  - `Blueprint`: Cyanotype architectural grid with luminous drafting lines.
  - `Glitch`: Quantum VHS tape tear, scanline skew, and dynamic chromatic drift.
  - `Magma`: Incandescent basalt crust with convective heat luminescence and molten veins.
  - `NVG`: Military Gen-3 night-vision phosphor tube scintillation and dynamic cathode grain.
  - `Cosmic`: Deep space H-alpha nebula starlight and interstellar dust fields.
  - `Aero`: Supersonic schlieren aerodynamic shock fronts and optical refraction gradients.

---

## [1.1.0] - 2026-11-08

### Added
- **6 Particle Morphology Primitives**:
  - `Dust`: Classic organic soft circular grains with Gaussian falloff.
  - `Bits`: Digital square silicon voxels with beveled pixel core highlights.
  - `Hex`: Quantum honeycomb nanotech lattice with 6-fold geometric symmetry.
  - `Prism`: Diamond crystalline facets with diagonal specular glints.
  - `Cross`: Precision digital micro-reticle markers.
  - `Star`: Four-point quantum astroid sparkle with high-intensity luminous core.
- **6 Advanced Shader Materials**:
  - `Natural`: Authentic photographic and impasto pigment medium.
  - `Cyber`: Phosphor CRT raster scanlines with high-contrast cybernetic matrix glow.
  - `Gilded`: Gustav Klimt-inspired auric gold leaf with dynamic metallic specular glints.
  - `Holo`: Iridescent prismatic thin-film interference with continuous spectral dispersion.
  - `Thermal`: Thermodynamic infrared false-color spectral radiation.
  - `Blueprint`: Cyanotype architectural grid with luminous drafting lines.
- **Interactive UI & Keyboard Controls**:
  - Dedicated `#primRow` and `#shaderRow` chip rows in the Optical Studio panel.
  - Hotkey `<kbd>M</kbd>` to instantly cycle particle primitives.
  - Hotkey `<kbd>K</kbd>` to instantly cycle shader materials.

---

## [1.0.0] - 2026-10-30

### Added
- **1,048,576 Particle WebGL2 Core**: Real-time GPGPU point-mesh rendering engine with aerodynamic curl noise and fluid dissipation.
- **Pre-Baked Neural Topology**: Pre-computed 3D relief data for curated classical masterpieces enabling zero-latency instant transitions at a rock-solid 60 FPS:
  - *The Starry Night* (Vincent van Gogh, 1889)
  - *David* (Michelangelo Buonarroti, 1504)
  - *Mona Lisa* (Leonardo da Vinci, c. 1503)
  - *Girl with a Pearl Earring* (Johannes Vermeer, c. 1665)
  - *Pietà* (Michelangelo Buonarroti, 1499)
  - Procedural Specimen: *Ridge*, *Dune*, and the *尘 (Dust) Glyph*.
- **On-Demand Monocular Depth Estimation**: Integrated browser-native `Depth Anything V2` neural pipeline with rest-queue orchestration for custom image drag-and-drop.
- **Dual Physical Substrates**: Instant physical dissolve toggle between Obsidian Dark Glass and Textured Japanese Rag Paper.
- **Optical Camera Simulation**: Full synthetic depth of field (DoF), focal plane pull, aperture dial, and chromatic bloom post-processing passes.
- **Aerodynamic Billow Dynamics**: Continuous cursor wind turbulence (`g` key / billow drag) and physical drag dissipation.
- **Diagnostic Inspection Modes**: Cycle through depth maps, surface occlusion, surface normal fields, and point density telemetry (`d` key).
- **Studio Export**: Single-click 4K canvas capture (`p` key) with transparency preservation.
- **Zero-Dependency Architecture**: 100% self-contained client-side application running completely in-browser without external server reliance or telemetry.
- **Automated CI/CD & Releases**: GitHub Actions workflow for automated releases, standalone offline zip packaging, and Vercel edge deployment.
