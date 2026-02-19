# Infinity Loopers Solar System (React Three Fiber)

This project has been rebuilt using **React Three Fiber**, **Drei**, **GSAP ScrollTrigger**, and **Zustand**.

## Features
- **Scroll-Based Journey**: A 3D spiral path camera movement.
- **Sun (Mentors)**: Central glowing turbulent mesh.
- **35 Student Planets**: Spaced along the path.
- **Glassmorphism UI**: Reactive HTML overlays for each student.
- **Custom Shaders**: Fresnel glow and noise-based sun.

## How to Run

1.  Stop any running servers.
2.  Install dependencies (if new ones were added):
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open the local URL (e.g. `http://localhost:5173`).

## Project Structure
- `src/main.jsx`: Entry point.
- `src/Experience.jsx`: Main 3D Scene and Scroll Logic.
- `src/store.js`: Global state (active planet, scroll progress).
- `src/data.js`: Student/Mentor data.
- `src/components/`: (Components are currently inline in Experience.jsx for simplicity, can be extracted).
