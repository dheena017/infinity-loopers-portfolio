import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
    const containerRef = useRef();

    useEffect(() => {
        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 15000);
        const renderer = new THREE.WebGLRenderer({
            antialias: false, // Performance boost: disable AA for points-heavy scenes
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Lower pixel ratio for smoother frames
        container.appendChild(renderer.domElement);

        // --- Optimized Textures (Memoized) ---
        const createGlowTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 64; canvas.height = 64; // Smaller texture
            const ctx = canvas.getContext('2d');
            const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            grad.addColorStop(0, 'rgba(255,255,255,1)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 64, 64);
            return new THREE.CanvasTexture(canvas);
        };
        const glowTex = createGlowTexture();

        // --- Galaxy (Efficiently Grouped) ---
        const createGalaxy = (params) => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(params.count * 3);
            const colors = new Float32Array(params.count * 3);
            const insideColor = new THREE.Color(params.insideColor);
            const outsideColor = new THREE.Color(params.outsideColor);

            for (let i = 0; i < params.count; i++) {
                const i3 = i * 3;
                const radius = Math.random() * params.radius;
                const spinAngle = radius * params.spin;
                const branchAngle = (i % params.branches) / params.branches * Math.PI * 2;

                const rPower = params.randomnessPower;
                const randX = Math.pow(Math.random(), rPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
                const randY = Math.pow(Math.random(), rPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
                const randZ = Math.pow(Math.random(), rPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;

                positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randX;
                positions[i3 + 1] = randY * 0.5; // Flatter galaxy
                positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randZ;

                const mixedColor = insideColor.clone();
                mixedColor.lerp(outsideColor, radius / params.radius);
                colors[i3] = mixedColor.r;
                colors[i3 + 1] = mixedColor.g;
                colors[i3 + 2] = mixedColor.b;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: params.size,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true,
                map: glowTex,
                transparent: true
            });

            const points = new THREE.Points(geometry, material);
            scene.add(points);
            return points;
        };

        // --- High Efficiency Backgrounds ---
        const createStarfield = (count, radius, size, color) => {
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                const r = radius * (1 + Math.random() * 0.2);
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                pos[i3] = r * Math.sin(phi) * Math.cos(theta);
                pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                pos[i3 + 2] = r * Math.cos(phi);
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const mat = new THREE.PointsMaterial({ size, color, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false });
            const s = new THREE.Points(geo, mat);
            scene.add(s);
            return s;
        };

        const createNebulae = () => {
            const group = new THREE.Group();
            const colors = ['#1d4ed8', '#3730a3', '#7c3aed', '#0ea5e9', '#a78bfa'];
            for (let i = 0; i < 10; i++) { // Reduced count for performance
                const count = 50;
                const geo = new THREE.BufferGeometry();
                const pos = new Float32Array(count * 3);
                const col = new Float32Array(count * 3);
                const baseColor = new THREE.Color(colors[i % colors.length]);
                const cX = (Math.random() - 0.5) * 10000;
                const cY = (Math.random() - 0.5) * 8000;
                const cZ = -Math.random() * 10000 - 2000;

                for (let j = 0; j < count; j++) {
                    pos[j * 3] = cX + (Math.random() - 0.5) * 4000;
                    pos[j * 3 + 1] = cY + (Math.random() - 0.5) * 4000;
                    pos[j * 3 + 2] = cZ + (Math.random() - 0.5) * 4000;
                    col[j * 3] = baseColor.r; col[j * 3 + 1] = baseColor.g; col[j * 3 + 2] = baseColor.b;
                }
                geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
                geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
                const mat = new THREE.PointsMaterial({ size: 4200, map: glowTex, vertexColors: true, transparent: true, opacity: 0.035, blending: THREE.AdditiveBlending, depthWrite: false });
                group.add(new THREE.Points(geo, mat));
            }
            scene.add(group);
            return group;
        };

        // --- Init ---
        const mainGalaxy = createGalaxy({
            count: 35000, // Balanced count
            size: 0.1,
            radius: 10,
            branches: 5,
            spin: 0.82,
            randomness: 0.25,
            randomnessPower: 3,
            insideColor: '#e2e8f0',
            outsideColor: '#312e81'
        });
        const nearStars = createStarfield(9500, 15, 0.032, '#f8fafc');
        const deepStars = createStarfield(15000, 20, 0.016, '#bfdbfe');
        const nebulae = createNebulae();

        camera.position.z = 14;
        camera.position.y = 5;
        camera.lookAt(0, 0, 0);

        const clock = new THREE.Clock();
        const animate = () => {
            const time = clock.getElapsedTime();
            mainGalaxy.rotation.y = time * 0.045;
            nearStars.rotation.y = time * 0.008;
            deepStars.rotation.y = -time * 0.003;
            nearStars.material.opacity = 0.44 + Math.sin(time * 0.35) * 0.04;
            deepStars.material.opacity = 0.3 + Math.cos(time * 0.28) * 0.03;


            nebulae.children.forEach((n, i) => {
                n.rotation.y = time * (0.004 + i * 0.0005);
            });

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            if (container) container.removeChild(renderer.domElement);
            scene.traverse(o => {
                if (o.geometry) o.geometry.dispose();
                if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
            });
            glowTex.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-20 pointer-events-none"
            style={{
                background: 'radial-gradient(1200px 700px at 50% 40%, rgba(59, 130, 246, 0.10), rgba(10, 10, 28, 0.9) 45%, #02030a 100%)'
            }}
        />
    );
};

export default ThreeScene;
