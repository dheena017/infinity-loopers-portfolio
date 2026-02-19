# Infinity Loopers Portfolio

## Overview

**Infinity Loopers** is an interactive, scroll-triggered cosmic journey through the Squad 139 universe. Built with **Three.js** for 3D graphics and **GSAP** for scroll synchronization, this portfolio showcases mentors, community members, and core team leads through an immersive visual narrative.

## Features

- 🌌 **3D Space Visualization** – Stars, planets, the Sun, and galaxies rendered in WebGL
- 📜 **Scroll-Driven Animation** – All motion tied to scroll progress via GSAP ScrollTrigger
- 🎨 **Neon Aesthetic** – Cyberpunk design with cyan, gold, and purple color scheme
- 💻 **Terminal Boot Sequence** – Custom loading screen mimicking system initialization
- 📱 **Responsive Design** – Mobile-optimized layouts for all screen sizes
- ♿ **Accessibility** – ARIA labels and keyboard-friendly navigation

## Project Structure

```
infinity-loopers-portfolio/
├── index.html          # Main HTML structure & UI overlays
├── main.js            # Three.js scene & GSAP animation logic
├── style.css          # Styling & responsive breakpoints
├── package.json       # Dependencies & scripts
├── README.md          # This file
└── assets/            # (Future: Images, models, textures)
```

## Getting Started

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/squad139/infinity-loopers-portfolio.git
   cd infinity-loopers-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running Locally

```bash
npm start
```

Then open `http://localhost:3000` in your browser.

## Architecture

### Three.js Scene Hierarchy

- **Starfield** – 15,000 procedurally placed stars
- **Mentor Planets** – 3 colored spheres with atmospheres (representing mentors)
- **Sun System** – Central point with branching community members
- **Galaxies** – 3 particle-based galaxies (spiral, elliptical, grand) for core leads

### Scroll Stages

1. **Entry (0%)** – Welcome screen to first mentor planet
2. **Mentors (25%)** – Journey through 3 mentor worlds
3. **Community (50%)** – Explore Sun with 3 branch sets (32 community members)
4. **Core (75%)** – Meet 3 core leads in their galaxies
5. **Finale (100%)** – Fade to deep space with signature

## Configuration

Edit the `COLORS` object in `main.js` to customize planet colors:

```javascript
const COLORS = {
    mentor1: 0x4a9eff,  // Blue
    mentor2: 0xff4a8d,  // Pink
    mentor3: 0x4affaa,  // Green
    // ... more colors
};
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized for 60fps on modern devices
- Particle counts adjusted for smooth rendering
- GPU-accelerated CSS transforms and WebGL
- Responsive image loading (future enhancement)

## Dependencies

- **three.js** (^0.182.0) – 3D graphics library
- **gsap** (^3.14.2) – Animation & scroll trigger library

## License

MIT © Squad 139

## Contributing

Contributions welcome! Please open an issue or pull request.

## Contact

📧 **Email:** contact@squad139.com  
🔗 **LinkedIn:** [linkedin.com](https://linkedin.com)  
🐙 **GitHub:** [github.com](https://github.com)
