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
        // Add subtle environmental fog for depth and set up parameters
        const fogBase = 0.0012; // increased base density for a visibly denser fog
        const fogColor = new THREE.Color(0x020000);
        const fogPulseColor = new THREE.Color(0x2a0505);
        scene.fog = new THREE.FogExp2(fogColor.clone(), fogBase);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Lower pixel ratio for smoother frames
        container.appendChild(renderer.domElement);

        // --- Optimized Textures (Memoized) ---
        const createGlowTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 128; canvas.height = 128; // larger for smoother glow
            const ctx = canvas.getContext('2d');
            const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
            grad.addColorStop(0, 'rgba(255, 140, 98, 1)');
            grad.addColorStop(0.35, 'rgba(255, 75, 75, 0.9)');
            grad.addColorStop(0.75, 'rgba(180, 30, 30, 0.45)');
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
                transparent: true,
                opacity: 0.8
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
            const colors = ['#450a0a', '#7f1d1d', '#991b1b', '#b91c1c', '#dc2626'];
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
                const mat = new THREE.PointsMaterial({ size: 5200, map: glowTex, vertexColors: true, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false });
                group.add(new THREE.Points(geo, mat));
            }
            scene.add(group);
            return group;
        };

        const createTendrils = () => {
            const group = new THREE.Group();
            const count = 30; // Number of main tendril branches
            for (let i = 0; i < count; i++) {
                const points = [];
                const isLeft = i % 2 === 0;
                let x = isLeft ? -15 : 15;
                let y = (Math.random() - 0.5) * 20;
                let z = -Math.random() * 10 - 5;

                const segments = 20;
                for (let j = 0; j < segments; j++) {
                    points.push(new THREE.Vector3(x, y, z));
                    // Creep inward but mostly stay on sides
                    x += isLeft ? (Math.random() * 0.8) : -(Math.random() * 0.8);
                    y += (Math.random() - 0.5) * 2.5;
                    z += (Math.random() - 0.5) * 1.5;
                }

                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({
                    color: i % 3 === 0 ? '#450a0a' : '#2d0101',
                    transparent: true,
                    opacity: 0.15,
                    blending: THREE.AdditiveBlending
                });
                const line = new THREE.Line(geometry, material);
                group.add(line);
            }
            scene.add(group);
            return group;
        };

        const createAtmosphere = () => {
            const group = new THREE.Group();
            const innerColors = ['#7f1d1d', '#991b1b', '#b91c1c']; // Redder inner edge
            const outerColors = ['#2d0101', '#1a0000', '#050000']; // Darker outer edge

            for (let i = 0; i < 25; i++) { // Increased density
                const count = 60;
                const geo = new THREE.BufferGeometry();
                const pos = new Float32Array(count * 3);
                const col = new Float32Array(count * 3);

                const isLeft = i % 2 === 0;
                const cX = isLeft ? -12000 - Math.random() * 8000 : 12000 + Math.random() * 8000;
                const cY = (Math.random() - 0.5) * 8000;
                const cZ = -Math.random() * 8000 - 2000;

                const baseColorInner = new THREE.Color(innerColors[i % innerColors.length]);
                const baseColorOuter = new THREE.Color(outerColors[i % outerColors.length]);

                for (let j = 0; j < count; j++) {
                    const pX = cX + (Math.random() - 0.5) * 6000;
                    const pY = cY + (Math.random() - 0.5) * 6000;
                    const pZ = cZ + (Math.random() - 0.5) * 4000;

                    pos[j * 3] = pX;
                    pos[j * 3 + 1] = pY;
                    pos[j * 3 + 2] = pZ;

                    // Directional lighting logic: brighter if closer to center X=0
                    const distanceFactor = Math.abs(pX) / 20000;
                    const mixedCol = baseColorInner.clone().lerp(baseColorOuter, distanceFactor);
                    col[j * 3] = mixedCol.r; col[j * 3 + 1] = mixedCol.g; col[j * 3 + 2] = mixedCol.b;
                }
                geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
                geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
                const mat = new THREE.PointsMaterial({
                    size: 8000,
                    map: glowTex,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.08,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });
                group.add(new THREE.Points(geo, mat));
            }
            scene.add(group);
            return group;
        };

        const createEerieParticles = () => {
            const geo = new THREE.BufferGeometry();
            const count = 1500;
            const pos = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                pos[i * 3] = (Math.random() - 0.5) * 60;
                pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
                pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const mat = new THREE.PointsMaterial({
                size: 0.06,
                color: '#450a0a',
                transparent: true,
                opacity: 0.25,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const p = new THREE.Points(geo, mat);
            return p;
        };

        // --- Init ---
        const mainGalaxy = createGalaxy({
            count: 45000,
            size: 0.08,
            radius: 18,
            branches: 6,
            spin: 0.9,
            randomness: 0.28,
            randomnessPower: 3.5,
            insideColor: '#dc2626',
            outsideColor: '#000000'
        });

        const coreEmber = createGalaxy({
            count: 3000,
            size: 0.15,
            radius: 2.2,
            branches: 3,
            spin: 0.1,
            randomness: 0.4,
            randomnessPower: 2,
            insideColor: '#ff4444',
            outsideColor: '#7f1d1d'
        });
        const nearStars = createStarfield(9500, 15, 0.032, '#a51c1c'); // Sharp Red
        const deepStars = createStarfield(15000, 20, 0.016, '#450a0a'); // Deep Crimson
        const nebulae = createNebulae();
        const atmosphericSides = createAtmosphere();
        const eerieDust = createEerieParticles();
        const tendrils = createTendrils();

        camera.position.z = 14;
        camera.position.y = 5;
        camera.lookAt(0, 0, 0);

        // Place the small "eerie" dust in the scene and allow subtle
        // parallax movement tied to mouse movement (targetX/targetY).
        scene.add(eerieDust);
        eerieDust.position.set(0, 5, 6);
        eerieDust.frustumCulled = false;

        // --- Mouse Interaction ---
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        const onMouseMove = (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.0005;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.0005;
        };
        window.addEventListener('mousemove', onMouseMove);

        const clock = new THREE.Clock();
        const animate = () => {
            const time = clock.getElapsedTime();

            // Smooth Parallax (mouse values still tracked for other UI usage),
            // but do NOT move the background with the mouse — keep camera fixed.
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;
            camera.position.x = Math.sin(time * 0.1) * 0.2; // subtle breathing only
            camera.position.y = 5 + Math.cos(time * 0.15) * 0.1; // fixed base height
            camera.lookAt(0, 0, 0);

            // Galaxy Motion
            mainGalaxy.rotation.y = time * 0.035;
            coreEmber.rotation.y = time * 0.05;
            nearStars.rotation.y = time * 0.005;
            deepStars.rotation.y = -time * 0.002;

            // Pulsing Logic (Enhanced for core intensity)
            const pulse = (1 + Math.sin(time * 0.6)) * 0.5;
            coreEmber.material.size = 0.12 + pulse * 0.06;
            coreEmber.material.opacity = 0.6 + pulse * 0.4;

            mainGalaxy.material.size = 0.08 + pulse * 0.015;

            nearStars.material.opacity = 0.35 + Math.sin(time * 0.8) * 0.25;
            deepStars.material.opacity = 0.25 + Math.cos(time * 0.6) * 0.15;

            nebulae.children.forEach((n, i) => {
                n.rotation.y = time * (0.003 + i * 0.0004);
                n.material.opacity = 0.03 + (Math.sin(time * 0.3 + i) * 0.025);
            });

            atmosphericSides.children.forEach((a, i) => {
                a.position.x += Math.sin(time * 0.1 + i) * 1.5; // Slow dimensional drift
                a.material.opacity = 0.03 + Math.sin(time * 0.3 + i) * 0.02;
            });

            tendrils.children.forEach((t, i) => {
                t.rotation.z = Math.sin(time * 0.1 + i) * 0.05; // Slow organic sway
                t.material.opacity = 0.1 + Math.sin(time * 0.2 + i) * 0.05;
            });

            eerieDust.rotation.x = time * 0.005;
            eerieDust.rotation.y = time * 0.005;
            // Keep dust stationary relative to viewport (no mouse parallax).
            eerieDust.position.x = 0;
            eerieDust.position.y = 5 + Math.sin(time * 0.1) * 0.3;
            eerieDust.position.z = camera.position.z - 8;

            // Animate fog: subtle density oscillation and gentle color drift,
            // with added responsiveness to the smoothed mouse targets so the
            // fog appears to drift with user movement.
            if (scene.fog) {
                const mouseDensity = targetY * 0.0025; // up/down affects density
                scene.fog.density = fogBase + Math.sin(time * 0.07) * 0.0006 + mouseDensity;
                let fogT = (Math.sin(time * 0.08) + 1) / 2 * 0.12; // base pulse
                fogT += targetX * 0.06; // left/right subtly shifts color mix
                fogT = THREE.MathUtils.clamp(fogT, 0, 0.4);
                scene.fog.color.lerpColors(fogColor, fogPulseColor, fogT);

                // Nudge large background groups for a perception of wind/drift
                if (nebulae) nebulae.position.x = targetX * 1200;
                if (atmosphericSides) atmosphericSides.position.x = targetX * 1500;
            }

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
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            if (container) container.removeChild(renderer.domElement);
            scene.traverse(o => {
                if (o.geometry) o.geometry.dispose();
                if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
            });
            // Remove and dispose the eerie dust we added to the scene.
            try { scene.remove(eerieDust); } catch { /* ignore */ }
            glowTex.dispose();
        };
    }, []);

        return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-20 pointer-events-none"
            style={{
                background: 'radial-gradient(1200px 700px at 50% 40%, rgba(255,120,100,0.10) 0%, rgba(127,29,29,0.12) 20%, rgba(5,0,0,0.92) 60%, #020000 100%), linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.3))',
                filter: 'contrast(1.02) saturate(1.05)'
            }}
        />
    );
};

export default ThreeScene;
