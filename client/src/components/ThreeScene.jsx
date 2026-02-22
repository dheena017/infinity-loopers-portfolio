import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Gauge, Activity } from 'lucide-react';

const PLANETS = [
    {
        id: 'cyan',
        name: "CYAN_VII",
        desc: "A high-frequency neural hub specializing in real-time data streaming.",
        distance: 8000,
        size: 500,
        color: 0x00f2ff,
        speed: 0.005,
        details: { temp: '-142°C', pop: '2.4M', status: 'Optimal' }
    },
    {
        id: 'purple',
        name: "PURPLE_CORE",
        desc: "The primary engine of the Squad 139 architecture, housing the collective logic.",
        distance: 14000,
        size: 900,
        color: 0x7000ff,
        speed: 0.002,
        details: { temp: '42°C', pop: 'CORE_UNIT', status: 'Critical' }
    },
    {
        id: 'indigo',
        name: "INDIGO_STATION",
        desc: "A collaborative outpost for experimental inter-planetary engineering.",
        distance: 21000,
        size: 700,
        color: 0x4b0082,
        speed: 0.001,
        details: { temp: '12°C', pop: '940k', status: 'Syncing' }
    }
];

const ThreeScene = ({ isInitialized }) => {
    const containerRef = useRef(null);
    const location = useLocation();
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const mouseRaw = useRef({ x: 0, y: 0 });

    const [hoveredPlanet, setHoveredPlanet] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const objects = useRef({
        sun: null,
        starPoints: null,
        planets: [],
        glow: null,
        ambience: null
    });

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x020205);
        scene.fog = new THREE.FogExp2(0x020205, 0.00008);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000000);
        camera.position.set(0, 0, 15000);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 1.0;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // --- Starfield ---
        const createStars = () => {
            const count = 35000;
            const positions = new Float32Array(count * 3);
            const sizes = new Float32Array(count);
            const colors = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                const r = 40000 + Math.random() * 80000;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = r * Math.cos(phi);

                sizes[i] = Math.random() * 2;

                const h = 0.6 + Math.random() * 0.1;
                const s = 0.8;
                const l = 0.5 + Math.random() * 0.5;
                const color = new THREE.Color().setHSL(h, s, l);
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
            }

            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const mat = new THREE.PointsMaterial({
                size: 30,
                vertexColors: true,
                transparent: true,
                opacity: 0.4,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            const stars = new THREE.Points(geo, mat);
            scene.add(stars);
            objects.current.starPoints = stars;
        };
        createStars();

        // --- Ambience ---
        const createAmbience = () => {
            const group = new THREE.Group();
            const colors = [0x4b0082, 0x1a0033, 0x000055];
            colors.forEach(color => {
                const geo = new THREE.SphereGeometry(60000, 32, 32);
                const mat = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.015,
                    side: THREE.BackSide
                });
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set((Math.random() - 0.5) * 40000, (Math.random() - 0.5) * 40000, -40000);
                group.add(mesh);
            });
            scene.add(group);
            objects.current.ambience = group;
        };
        createAmbience();

        // --- Solar System ---
        const sunGroup = new THREE.Group();
        sunGroup.position.set(0, 0, -40000);

        const coreGeo = new THREE.SphereGeometry(2500, 64, 64);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const core = new THREE.Mesh(coreGeo, coreMat);
        sunGroup.add(core);

        const glowGeo = new THREE.SphereGeometry(3000, 64, 64);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x00f2ff,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        sunGroup.add(glow);
        objects.current.glow = glow;

        PLANETS.forEach(config => {
            const pGroup = new THREE.Group();
            const pGeo = new THREE.SphereGeometry(config.size, 32, 32);
            const pMat = new THREE.MeshStandardMaterial({
                color: config.color,
                emissive: config.color,
                emissiveIntensity: 1.5
            });
            const pMesh = new THREE.Mesh(pGeo, pMat);
            pMesh.userData = { id: config.id, config: config };
            pMesh.position.x = config.distance;
            pGroup.add(pMesh);
            sunGroup.add(pGroup);
            objects.current.planets.push({ group: pGroup, mesh: pMesh, config: config });
        });

        const light = new THREE.PointLight(0xffffff, 40, 150000, 1.5);
        sunGroup.add(light);
        scene.add(sunGroup);
        objects.current.sun = sunGroup;

        // --- Animation ---
        const clock = new THREE.Clock();
        const animate = () => {
            const time = clock.getElapsedTime();
            const delta = clock.getDelta();

            // Liquid camera move
            camera.position.x += (mouseRaw.current.x * 4000 - camera.position.x) * 0.03;
            camera.position.y += (-mouseRaw.current.y * 4000 - camera.position.y) * 0.03;
            camera.lookAt(0, 0, -40000);

            if (objects.current.starPoints) objects.current.starPoints.rotation.y += 0.00004;

            if (objects.current.glow) objects.current.glow.scale.setScalar(1 + Math.sin(time * 0.5) * 0.1);

            objects.current.planets.forEach(p => {
                p.group.rotation.y += p.config.speed;
            });

            if (objects.current.ambience) objects.current.ambience.rotation.z += 0.0001;

            // Raycasting for Interactivity
            raycaster.current.setFromCamera(mouse.current, camera);
            const planetMeshes = objects.current.planets.map(p => p.mesh);
            const intersects = raycaster.current.intersectObjects(planetMeshes);

            if (intersects.length > 0) {
                const target = intersects[0].object;
                const planetData = target.userData.config;
                setHoveredPlanet(planetData);

                // Visual Feedback: Scale Up
                gsap.to(target.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.5 });
                document.body.style.cursor = 'pointer';
            } else {
                setHoveredPlanet(null);
                planetMeshes.forEach(mesh => {
                    gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
                });
                document.body.style.cursor = 'default';
            }

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        const handleMouseMove = (e) => {
            mouseRaw.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRaw.current.y = (e.clientY / window.innerHeight) * 2 - 1;
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

            const xOffset = e.clientX > window.innerWidth / 2 ? -360 : 40;
            const yOffset = e.clientY > window.innerHeight / 2 ? -240 : 40;
            setTooltipPos({ x: e.clientX + xOffset, y: e.clientY + yOffset });
        };
        window.addEventListener('mousemove', handleMouseMove);

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            if (containerRef.current) containerRef.current.innerHTML = '';
        };
    }, []);

    // Cinematic Shifts
    useEffect(() => {
        if (!isInitialized || !cameraRef.current) return;

        const paths = {
            '/': { z: 15000, x: 0, y: 0 },
            '/operatives': { z: -5000, x: -8000, y: 3000 },
            '/collective': { z: -20000, x: 10000, y: -5000 }
        };

        const target = paths[location.pathname] || paths['/'];

        gsap.to(cameraRef.current.position, {
            z: target.z,
            x: target.x,
            y: target.y,
            duration: 3.5,
            ease: "circ.inOut"
        });
    }, [location.pathname, isInitialized]);

    // Entrance
    useEffect(() => {
        if (isInitialized && cameraRef.current) {
            gsap.to(cameraRef.current.position, {
                z: 15000,
                duration: 5,
                ease: "power4.out"
            });
        }
    }, [isInitialized]);

    return (
        <div ref={containerRef} className="fixed inset-0 -z-10 w-full h-full">
            {/* Celestial Tooltip */}
            <AnimatePresence>
                {hoveredPlanet && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{ left: tooltipPos.x, top: tooltipPos.y }}
                        className="fixed pointer-events-none z-[100] glass-panel p-10 min-w-[320px] border-cyan-500/30"
                    >
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-12 h-12 flex items-center justify-center border border-cyan-500/30 rounded-full">
                                <Info size={18} className="text-cyan-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-mono-tech !text-[9px] text-cyan-500 uppercase tracking-widest">
                                    Celestial_ID: {hoveredPlanet.id}_CORE
                                </span>
                                <h3 className="text-3xl font-black italic text-white uppercase font-space leading-none mt-1">
                                    {hoveredPlanet.name}
                                </h3>
                            </div>
                        </div>

                        <p className="text-sm text-gray-400 font-light italic leading-relaxed mb-10 pb-10 border-b border-white/5">
                            {hoveredPlanet.desc}
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-cyan-500/40">
                                    <Gauge size={10} />
                                    <span className="font-mono-tech !text-[7px] uppercase">Temperature</span>
                                </div>
                                <div className="text-xs font-bold text-white italic">{hoveredPlanet.details.temp}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-cyan-500/40">
                                    <Activity size={10} />
                                    <span className="font-mono-tech !text-[7px] uppercase">Status</span>
                                </div>
                                <div className="text-xs font-bold text-green-500 italic uppercase">{hoveredPlanet.details.status}</div>
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 p-4">
                            <div className="w-2 h-2 bg-cyan-500 animate-pulse rounded-full shadow-[0_0_10px_rgba(6,182,212,1)]"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(ThreeScene);
