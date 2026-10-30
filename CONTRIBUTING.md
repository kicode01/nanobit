# Contributing to nanobit

Thank you for your interest in **nanobit**! While `nanobit` is currently distributed as a proprietary release, we welcome community bug reports, performance telemetry, and feature suggestions.

---

## 🛠️ Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (or any static local HTTP server)
- A modern browser with **WebGL2** support (Chrome, Edge, Firefox, Safari 15+)

### Running Locally
To launch the development server locally:

```bash
# Clone the repository
git clone https://github.com/kicode01/nanobit.git
cd nanobit

# Start a local static server
npm start
# or: npx serve .
```

Open your browser at `http://localhost:3000`.

---

## 🧪 Running Automated Test Suite

We maintain an automated headless Playwright test suite in `.tools/audit.js` that verifies UI elements, slider bindings, canvas rendering, and WebGL state:

```bash
# Run the audit test suite
npm test
```

---

## 🐛 Submitting Issues & Bug Reports

If you experience unexpected behavior, WebGL shader compilation issues, or frame drops:

1. Check existing issues to see if it has already been reported.
2. File an issue with your:
   - Operating System & Browser version
   - GPU model (e.g. Apple Silicon M2, NVIDIA RTX 4070, Intel Iris Xe)
   - Console logs / WebGL2 context information
3. If reporting visual artifacts, please attach a screenshot taken using the built-in capture tool (`p` key).

---

## 🏛️ Specimen Suggestions

Have a classical sculpture, Renaissance painting, or public domain artwork you would love to see rendered as a 1,048,576 particle field? Open a Feature Request with high-resolution image links.
