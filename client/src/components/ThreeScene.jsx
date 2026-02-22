import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
    const containerRef = useRef();

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // --- Galaxy Logic ---
        const galaxyParams = {
            count: 25000,
            size: 0.015,
            radius: 5,
            branches: 3,
            spin: 1,
            randomness: 0.2,
            randomnessPower: 3,
            insideColor: '#3b82f6',
            outsideColor: '#0f172a'
        };

        let geometry = null;
        let material = null;
        let points = null;

        const generateGalaxy = () => {
            if (points !== null) {
                geometry.dispose();
                material.dispose();
                scene.remove(points);
            }

            geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(galaxyParams.count * 3);
            const colors = new Float32Array(galaxyParams.count * 3);
            const insideColor = new THREE.Color(galaxyParams.insideColor);
            const outsideColor = new THREE.Color(galaxyParams.outsideColor);

            for (let i = 0; i < galaxyParams.count; i++) {
                const i3 = i * 3;
                const radius = Math.random() * galaxyParams.radius;
                const spinAngle = radius * galaxyParams.spin;
                const branchAngle = (i % galaxyParams.branches) / galaxyParams.branches * Math.PI * 2;

                const randomX = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius;
                const randomY = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius;
                const randomZ = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius;

                positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
                positions[i3 + 1] = randomY;
                positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

                const mixedColor = insideColor.clone();
                mixedColor.lerp(outsideColor, radius / galaxyParams.radius);
                colors[i3 + 0] = mixedColor.r;
                colors[i3 + 1] = mixedColor.g;
                colors[i3 + 2] = mixedColor.b;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            material = new THREE.PointsMaterial({
                size: galaxyParams.size,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true
            });

            points = new THREE.Points(geometry, material);
            scene.add(points);
        };

        generateGalaxy();

        // --- Background Stars ---
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 15000;
        const starsPositions = new Float32Array(starsCount * 3);
        const starsColors = new Float32Array(starsCount * 3);

        for (let i = 0; i < starsCount; i++) {
            starsPositions[i * 3] = (Math.random() - 0.5) * 50;
            starsPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            starsPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;

            const brightness = 0.5 + Math.random() * 0.5;
            starsColors[i * 3] = brightness;
            starsColors[i * 3 + 1] = brightness;
            starsColors[i * 3 + 2] = brightness;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
        starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));

        const starsMaterial = new THREE.PointsMaterial({
            size: 0.02,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });

        const starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);

        camera.position.z = 8;
        camera.position.y = 3;
        camera.lookAt(0, 0, 0);

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', onResize);

        const clock = new THREE.Clock();

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            if (points) {
                points.rotation.y = elapsedTime * 0.05;
            }

            starField.rotation.y = elapsedTime * 0.01;
            starField.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', onResize);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            starsGeometry.dispose();
            starsMaterial.dispose();
        };
    }, []);

    return <div ref={containerRef} className="fixed inset-0 -z-20 pointer-events-none bg-[#030305]" />;
};

export default ThreeScene;
