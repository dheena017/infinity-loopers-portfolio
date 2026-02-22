import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
    const containerRef = useRef();

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 25000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // --- Textures ---
        const createGlowTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 128; canvas.height = 128;
            const ctx = canvas.getContext('2d');
            const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
            grad.addColorStop(0, 'rgba(255,255,255,1)');
            grad.addColorStop(0.2, 'rgba(255,255,255,0.4)');
            grad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 128, 128);
            return new THREE.CanvasTexture(canvas);
        };

        const glowTex = createGlowTexture();

        // --- Galaxy Generator ---
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

                const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
                const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
                const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;

                positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
                positions[i3 + 1] = randomY;
                positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

                const mixedColor = insideColor.clone();
                mixedColor.lerp(outsideColor, radius / params.radius);
                colors[i3 + 0] = mixedColor.r;
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
                map: glowTex
            });

            const points = new THREE.Points(geometry, material);
            points.position.set(params.pos.x, params.pos.y, params.pos.z);
            scene.add(points);
            return points;
        };

        // --- Starfield Generator ---
        const createStarfield = (count, radius, size, color) => {
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                const r = radius * (1 + Math.random() * 0.5);
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                pos[i3] = r * Math.sin(phi) * Math.cos(theta);
                pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                pos[i3 + 2] = r * Math.cos(phi);
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const mat = new THREE.PointsMaterial({
                size: size,
                color: color,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const stars = new THREE.Points(geo, mat);
            scene.add(stars);
            return stars;
        };

        // --- Nebulae Generator ---
        const createNebulae = () => {
            const nebulaGroup = new THREE.Group();
            const colors = ['#f59e0b', '#8b5cf6', '#d946ef', '#06b6d4', '#4f46e5'];

            for (let i = 0; i < 20; i++) {
                const count = 150;
                const geo = new THREE.BufferGeometry();
                const pos = new Float32Array(count * 3);
                const col = new Float32Array(count * 3);
                const baseColor = new THREE.Color(colors[i % colors.length]);

                const centerX = (Math.random() - 0.5) * 12000;
                const centerY = (Math.random() - 0.5) * 10000;
                const centerZ = -Math.random() * 15000 - 3000;

                for (let j = 0; j < count; j++) {
                    pos[j * 3] = centerX + (Math.random() - 0.5) * 5000;
                    pos[j * 3 + 1] = centerY + (Math.random() - 0.5) * 5000;
                    pos[j * 3 + 2] = centerZ + (Math.random() - 0.5) * 5000;
                    col[j * 3] = baseColor.r;
                    col[j * 3 + 1] = baseColor.g;
                    col[j * 3 + 2] = baseColor.b;
                }

                geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
                geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

                const mat = new THREE.PointsMaterial({
                    size: 2000,
                    map: glowTex,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.04,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });

                nebulaGroup.add(new THREE.Points(geo, mat));
            }
            scene.add(nebulaGroup);
            return nebulaGroup;
        };

        // --- Shooting Stars Logic ---
        const shootingStarGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1)]);
        const shootingStarMat = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.8 });
        const shootingStars = [];

        const spawnShootingStar = () => {
            const star = new THREE.Line(shootingStarGeo, shootingStarMat.clone());
            star.position.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 50, (Math.random() - 1.0) * 20);
            star.scale.z = 5 + Math.random() * 8;
            star.rotation.y = Math.random() * Math.PI * 2;
            star.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8);
            star.userData.life = 1.0;
            scene.add(star);
            shootingStars.push(star);
        };

        // --- Objects Creation ---
        // Main Gold/Amber Galaxy
        const mainGalaxy = createGalaxy({
            count: 40000,
            size: 0.025,
            radius: 9,
            branches: 5,
            spin: 0.9,
            randomness: 0.22,
            randomnessPower: 3.2,
            insideColor: '#f59e0b', // Amber/Gold
            outsideColor: '#0c0a09', // Dark
            pos: { x: 0, y: 0, z: 0 }
        });

        const starField = createStarfield(25000, 20, 0.02, '#ffffff');
        const deepStarField = createStarfield(10000, 10000, 2.5, '#f59e0b');
        const nebulae = createNebulae();

        // --- Animation Loop ---
        camera.position.z = 14;
        camera.position.y = 5;
        camera.lookAt(0, 0, 0);

        const clock = new THREE.Clock();

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            // Rotation - Increased Speed
            mainGalaxy.rotation.y = elapsedTime * 0.08;
            starField.rotation.y = elapsedTime * 0.008;

            // Shooting Stars update
            if (Math.random() < 0.06) spawnShootingStar();
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];
                s.position.add(s.userData.velocity);
                s.userData.life -= 0.02;
                if (s.material) s.material.opacity = s.userData.life;
                if (s.userData.life <= 0) {
                    scene.remove(s);
                    s.geometry.dispose();
                    if (s.material) s.material.dispose();
                    shootingStars.splice(i, 1);
                }
            }

            // Nebulae drift
            nebulae.children.forEach((neb, i) => {
                neb.rotation.y = elapsedTime * (0.015 + i * 0.001);
                neb.position.y = Math.sin(elapsedTime * 0.2 + i) * 200;
            });

            // Gentle camera float
            camera.position.x = Math.sin(elapsedTime * 0.15) * 0.8;
            camera.position.y = 5 + Math.cos(elapsedTime * 0.2) * 0.8;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // Resize handler
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            scene.traverse(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                    else obj.material.dispose();
                }
            });
        };
    }, []);

    return <div ref={containerRef} className="fixed inset-0 -z-20 pointer-events-none bg-[#030304]" />;
};

export default ThreeScene;
