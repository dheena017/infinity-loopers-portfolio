import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------
const COLORS = {
    mentor1: 0x4a9eff, // Blue
    mentor2: 0xff4a8d, // Pink
    mentor3: 0x4affaa, // Green
    sun: 0xffaa00,     // Orange/Gold
    core1: 0x00d4ff,   // Cyan
    core2: 0x9b59b6,   // Purple
    core3: 0xffaa00    // Gold
};

// ------------------------------------------------------------------
// TEXTURE HELPERS
// ------------------------------------------------------------------
function createNoiseTexture(size = 512, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base Color
    ctx.fillStyle = colorHex || '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Noise
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
        const grain = (Math.random() - 0.5) * 40;
        data[i] = Math.max(0, Math.min(255, data[i] + grain));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.2, 'rgba(255,255,255,0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
}

function createStudentTexture(id) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Circle background
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${(id * 40) % 360}, 70%, 50%)`;
    ctx.fill();

    // ID Number
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${id}`, 64, 64);

    return new THREE.CanvasTexture(canvas);
}

function createDataPanelTexture(title, subtitle) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Transparent background
    ctx.clearRect(0, 0, 512, 256);

    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(title, 10, 50);

    ctx.font = '32px Arial';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText(subtitle, 10, 100);

    return new THREE.CanvasTexture(canvas);
}

function createPortraitTexture(name, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 340;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = color || '#333';
    ctx.fillRect(0, 0, 256, 340);

    // Silhouette
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.arc(128, 120, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(128, 300, 100, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 236, 320);

    return new THREE.CanvasTexture(canvas);
}


// ------------------------------------------------------------------
// MAIN CLASS
// ------------------------------------------------------------------
class CosmicJourney {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.FogExp2(0x000000, 0.00015); // Deep space fog

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 50000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });

        this.objects = {
            mentors: [],
            sun: null,
            branches: [], // Array of 3 sets
            galaxies: [],
            coreMembers: []
        };

        this.init();
    }

    init() {
        try {
            // Renderer Setup
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.container.appendChild(this.renderer.domElement);

            // Lighting
            const ambient = new THREE.AmbientLight(0xffffff, 0.1); // Dim space light
            this.scene.add(ambient);

            // Sun Light (Dynamic position)
            this.sunLight = new THREE.PointLight(0xffaa00, 2, 8000);
            this.sunLight.position.set(0, 0, 0);
            this.scene.add(this.sunLight);

        // Build World
        this.createStarfield();
        this.createMentors();
        this.createSunSystem();
        this.createCoreGalaxies();

        // Setup Camera Start
        this.camera.position.set(0, 0, 1000); // Start fairly close to "Earth" position

        // Remove Loader
        this.hideLoader();

        // Start Loop
        this.animate();

        // Setup GSAP
        this.setupScroll();
        this.setupUI(); // Add UI listeners

        // Resize Handler
        this.resizeHandler = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            ScrollTrigger.refresh();
        };
        window.addEventListener('resize', this.resizeHandler);
        } catch (error) {
            console.error('Error initializing CosmicJourney:', error);
        }
    }

    destroy() {
        // Clean up event listeners
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        // Clean up renderer
        this.renderer.dispose();
    }

    setupUI() {
        const btn = document.getElementById('enter-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                // Unlock Scroll
                document.getElementById('scroll-content').style.display = 'block';
                document.body.style.overflow = 'auto';

                // Recalculate ScrollTrigger now that content is visible
                ScrollTrigger.refresh();

                // Visual feedback - slight scroll start
                window.scrollTo({ top: window.innerHeight * 0.2, behavior: 'smooth' });

                // Hide button specifically if not handled by timeline yet
                gsap.to(btn, { opacity: 0, duration: 0.5, pointerEvents: 'none' });
            });
        }
    }

    hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            gsap.to(loader, { opacity: 0, duration: 1, onComplete: () => loader.remove() });
        }
    }

    // ------------------------------------------------------------------
    // CREATION: STARS
    // ------------------------------------------------------------------
    createStarfield() {
        // Reduce star count for better performance on mobile
        const count = window.innerWidth < 768 ? 8000 : 15000;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const r = 20000 * Math.random();
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = (Math.random() - 0.5) * 60000; // Deep Z spread

            const c = new THREE.Color().setHSL(Math.random(), 0.3, Math.random() * 0.8 + 0.2);
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

        const mat = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        this.scene.add(new THREE.Points(geo, mat));
    }

    // ------------------------------------------------------------------
    // CREATION: MENTORS (PLANETS)
    // ------------------------------------------------------------------
    createMentors() {
        // Mentor 1 (Blue)
        const m1 = this.createPlanet({
            color: COLORS.mentor1,
            size: 140,
            pos: { x: 0, y: 0, z: -1500 },
            name: "Dr. Alpha", role: "Mentor", desc: "System Architect"
        });

        // Mentor 2 (Pink)
        const m2 = this.createPlanet({
            color: COLORS.mentor2,
            size: 160, // Slightly bigger
            pos: { x: 400, y: 200, z: -3500 }, // Offset for journey feel
            name: "Prof. Beta", role: "Mentor", desc: "AI Specialist"
        });

        // Mentor 3 (Green)
        const m3 = this.createPlanet({
            color: COLORS.mentor3,
            size: 130,
            pos: { x: -300, y: -100, z: -5500 },
            name: "Sifu Gamma", role: "Mentor", desc: "Frontend Lead"
        });

        this.objects.mentors = [m1, m2, m3];
    }

    createPlanet(config) {
        const group = new THREE.Group();
        group.position.set(config.pos.x, config.pos.y, config.pos.z);

        // Planet Mesh
        const geo = new THREE.SphereGeometry(config.size, 64, 64);
        const mat = new THREE.MeshStandardMaterial({
            color: config.color,
            roughness: 0.8,
            metalness: 0.1,
            emissive: new THREE.Color(config.color).multiplyScalar(0.2), // Faint glow
            map: createNoiseTexture(512, new THREE.Color(config.color).getStyle()),
            transparent: true,
            opacity: 0 // Start hidden for fade-in
        });
        const planet = new THREE.Mesh(geo, mat);
        group.add(planet);

        // Atmosphere
        const atmoGeo = new THREE.SphereGeometry(config.size * 1.1, 64, 64);
        const atmoMat = new THREE.MeshBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: 0, // Start hidden
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        const atmo = new THREE.Mesh(atmoGeo, atmoMat);
        group.add(atmo);

        // Info Line
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(config.size * 1.5, config.size * 0.5, 0)
        ]);
        const lineMat = new THREE.LineBasicMaterial({ color: config.color, transparent: true, opacity: 0 });
        const line = new THREE.Line(lineGeo, lineMat);
        group.add(line);

        this.scene.add(group);

        // Store Ref
        return {
            group: group,
            planet: planet,
            atmo: atmo,
            line: line,
            config: config
        };
    }

    // ------------------------------------------------------------------
    // CREATION: SUN & BRANCHES
    // ------------------------------------------------------------------
    createSunSystem() {
        const sunZ = -8000;

        // Sun Group
        const sunGroup = new THREE.Group();
        sunGroup.position.set(0, 0, sunZ);
        this.scene.add(sunGroup);
        this.objects.sun = sunGroup;

        // Sun Mesh
        const geo = new THREE.SphereGeometry(400, 64, 64);
        const mat = new THREE.MeshBasicMaterial({
            color: COLORS.sun,
            map: createNoiseTexture(512, '#ff8800')
        });
        const sun = new THREE.Mesh(geo, mat);
        sunGroup.add(sun);

        // Corona
        const corona = new THREE.Mesh(
            new THREE.SphereGeometry(450, 64, 64),
            new THREE.MeshBasicMaterial({ color: 0xff4500, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending })
        );
        sunGroup.add(corona);

        // "FOLKS" Text Floating Above
        // (Handled by simple HTML Overlay or just omitted for pure visual flow? Request says "Text above: FOLKS". I'll stick to CSS overlay for crisp text)

        // Branch Sets
        // Set 1: 10 students
        this.createBranchSet(sunGroup, 10, 0);
        // Set 2: 10 students
        this.createBranchSet(sunGroup, 10, 1);
        // Set 3: 12 students
        this.createBranchSet(sunGroup, 12, 2);
    }

    createBranchSet(parent, count, setIndex) {
        const setGroup = new THREE.Group();
        parent.add(setGroup);
        if (!this.objects.branches[setIndex]) this.objects.branches[setIndex] = setGroup;

        // Hide initially
        setGroup.visible = false;

        let idBase = setIndex * 10 + 1;

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + (setIndex * 0.5); // Offset rotation per set
            const dist = 600 + Math.random() * 200;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            const z = (Math.random() - 0.5) * 200;

            // Line from Sun Surface (approx 380) to Point
            const startR = 380;
            const startX = Math.cos(angle) * startR;
            const startY = Math.sin(angle) * startR;

            const lineGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(startX, startY, 0),
                new THREE.Vector3(x, y, z)
            ]);
            const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.4 }));
            setGroup.add(line);

            // Student Token
            const tokenGeo = new THREE.CircleGeometry(30, 32);
            const tokenMat = new THREE.MeshBasicMaterial({
                map: createStudentTexture(idBase + i),
                side: THREE.DoubleSide
            });
            const token = new THREE.Mesh(tokenGeo, tokenMat);
            token.position.set(x, y, z);
            token.lookAt(0, 0, 10000); // Face camera

            setGroup.add(token);
        }
    }

    // ------------------------------------------------------------------
    // CREATION: CORE GALAXIES
    // ------------------------------------------------------------------
    createCoreGalaxies() {
        const startZ = -12000;
        const gap = 4000;

        // 1. Spiral (Cyan)
        this.createGalaxy({
            z: startZ,
            color: COLORS.core1,
            type: 'spiral',
            name: "Core Member 1" // Placeholder
        }, 0);

        // 2. Elliptical (Purple)
        this.createGalaxy({
            z: startZ - gap,
            color: COLORS.core2,
            type: 'elliptical',
            name: "Core Member 2"
        }, 1);

        // 3. Grand Spiral (Gold)
        this.createGalaxy({
            z: startZ - (gap * 2),
            color: COLORS.core3,
            type: 'grand',
            name: "Core Member 3"
        }, 2);
    }

    createGalaxy(config, index) {
        const group = new THREE.Group();
        group.position.set(0, 0, config.z); // Centered on path
        this.scene.add(group);
        this.objects.galaxies.push(group);

        // Particle System - Optimized for mobile
        const pCount = window.innerWidth < 768 ? 1000 : 2000;
        const geo = new THREE.BufferGeometry();
        const pos = [];
        const col = [];
        const baseColor = new THREE.Color(config.color);

        for (let i = 0; i < pCount; i++) {
            // Galaxy Math
            const r = Math.random() * 1000;
            const angle = Math.random() * Math.PI * 2;

            let x, y, z;
            if (config.type === 'spiral' || config.type === 'grand') {
                const arms = config.type === 'grand' ? 5 : 3;
                const armOffset = (i % arms) * (Math.PI * 2 / arms);
                const spiral = r * 0.005;
                const finalAngle = angle + spiral + armOffset;
                x = Math.cos(finalAngle) * r;
                y = Math.sin(finalAngle) * r;
                z = (Math.random() - 0.5) * (100 - r * 0.1);
            } else {
                // Elliptical
                x = Math.cos(angle) * r * 1.5;
                y = Math.sin(angle) * r * 0.8;
                z = (Math.random() - 0.5) * 300;
            }

            pos.push(x, y, z);
            col.push(baseColor.r, baseColor.g, baseColor.b);
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));

        const mat = new THREE.PointsMaterial({
            size: 4,
            vertexColors: true,
            transparent: true,
            opacity: 0, // Hidden initially
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geo, mat);
        group.add(particles);
        group.userData.particles = particles;

        // Member Photo Plane (Initially Hidden)
        const photoGeo = new THREE.PlaneGeometry(300, 400);
        const photoMat = new THREE.MeshBasicMaterial({
            map: createPortraitTexture(config.name, new THREE.Color(config.color).getStyle()),
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        });
        const photo = new THREE.Mesh(photoGeo, photoMat);
        photo.position.z = 50; // In front of galaxy center
        group.add(photo);
        group.userData.photo = photo;

        this.objects.coreMembers.push({
            group: group,
            photo: photo,
            config: config
        });
    }

    // ------------------------------------------------------------------
    // ANIMATION LOOP
    // ------------------------------------------------------------------
    animate() {
        requestAnimationFrame(() => this.animate());

        // Subtle Rotation
        this.objects.mentors.forEach(m => {
            m.planet.rotation.y += 0.001;
            m.atmo.rotation.y += 0.001;
        });

        if (this.objects.sun) {
            this.objects.sun.rotation.y += 0.002;
            this.objects.sun.children.forEach(c => c.rotation.z += 0.0005); // Corona spin
        }

        this.objects.galaxies.forEach(g => {
            g.rotation.z -= 0.0005;
        });

        this.renderer.render(this.scene, this.camera);
    }

    // ------------------------------------------------------------------
    // SCROLL LOGIC (GSAP)
    // ------------------------------------------------------------------
    setupScroll() {
        try {
        // Timeline linked to total scroll height
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#scroll-content",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5 // Smooth catchup
            }
        });

        // ------------------------------------------------------
        // 1. ENTRY -> PLANET 1
        // ------------------------------------------------------
        // Camera moves from starfield to Mentor 1
        // Trigger: trigger-start -> trigger-mentor-1
        // Move Camera
        const m1 = this.objects.mentors[0];
        tl.to(this.camera.position, { // Move to M1
            x: m1.group.position.x + 300, // Offset view
            y: m1.group.position.y + 100,
            z: m1.group.position.z + 400,
            duration: 5,
            ease: "power2.inOut"
        }, 0);
        tl.to('#welcome-screen', { opacity: 0, duration: 1, pointerEvents: "none" }, 0); // Hide Welcome

        // ------------------------------------------------------
        // 2. MENTOR SEQUENCE (1 -> 2 -> 3)
        // ------------------------------------------------------
        this.objects.mentors.forEach((m, i) => {
            const label = `mentor${i + 1}`;
            const nextLabel = `mentor${i + 2}`; // Or 'sunApproach'
            const duration = 5;

            // --- ARRIVAL AT PLANET i ---
            // Fade In UI
            tl.addLabel(label);

            // Reveal Planet (Fade In)
            tl.to([m.planet.material, m.atmo.material], { opacity: 1, duration: 2 }, label);
            tl.to(m.atmo.material, { opacity: 0.2 }, label + "+=1.5"); // Reduce atmo glow after reveal

            // Show Planet & Info
            tl.to(m.line.material, { opacity: 1, duration: 1 }, label + "+=1");

            // Show Panel (HTML) - We need to update text dynamically
            tl.call(() => this.updateMentorHUD(m.config), null, label + "+=1");
            tl.to("#mentor-panel", { opacity: 1, duration: 1 }, label + "+=1.5");

            // Hold for a bit (Scroll travel)
            tl.to({}, { duration: 4 });

            // Assume we are moving to next target
            // Hide Panel & Line
            tl.to("#mentor-panel", { opacity: 0, duration: 0.5 });
            tl.to(m.line.material, { opacity: 0, duration: 0.5 });
            tl.to([m.planet.material, m.atmo.material], { opacity: 0, duration: 1.5 }); // Fade out planet as we leave

            // Move Camera to NEXT Target
            if (i < 2) {
                const nextM = this.objects.mentors[i + 1];
                tl.to(this.camera.position, {
                    x: nextM.group.position.x + 300,
                    y: nextM.group.position.y + 100,
                    z: nextM.group.position.z + 400,
                    duration: 5,
                    ease: "power2.inOut"
                });
            } else {
                // Last mentor -> Move to Sun
                const sunGroup = this.objects.sun;
                tl.to(this.camera.position, {
                    x: 0,
                    y: 0,
                    z: sunGroup.position.z + 1000,
                    duration: 8,
                    ease: "power2.inOut"
                }, "flyingToSun");
            }
        });

        // ------------------------------------------------------
        // 3. SUN SYSTEM (Sets 1 -> 2 -> 3)
        // ------------------------------------------------------
        tl.addLabel("sunArrival");

        // BRANCH SET 1
        const b1 = this.objects.branches[0];
        const b2 = this.objects.branches[1];
        const b3 = this.objects.branches[2];

        // Show Set 1
        tl.call(() => { b1.visible = true; });
        tl.fromTo(b1.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 2, ease: "back.out(1.5)" });
        tl.to({}, { duration: 3 }); // Hold

        // Hide Set 1, Show Set 2
        tl.to(b1.scale, { x: 0, y: 0, z: 0, duration: 1 });
        tl.call(() => { b1.visible = false; b2.visible = true; });
        tl.fromTo(b2.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 2 });
        tl.to({}, { duration: 3 }); // Hold

        // Hide Set 2, Show Set 3
        tl.to(b2.scale, { x: 0, y: 0, z: 0, duration: 1 });
        tl.call(() => { b2.visible = false; b3.visible = true; });
        tl.fromTo(b3.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 2 });
        tl.to({}, { duration: 3 }); // Hold

        // Exit Sun -> Galaxy
        tl.to(b3.scale, { x: 0, y: 0, z: 0, duration: 1 });
        tl.call(() => { b3.visible = false; });

        // ------------------------------------------------------
        // 4. GALAXIES (Core 1 -> 2 -> 3)
        // ------------------------------------------------------
        this.objects.coreMembers.forEach((member, i) => {
            const label = `core${i + 1}`;

            // Move Camera to Galaxy Center + slight offset
            tl.to(this.camera.position, {
                x: member.group.position.x,
                y: member.group.position.y,
                z: member.group.position.z + 900, // Look at it
                duration: 7,
                ease: "power2.inOut"
            }, label);

            // Reveal Galaxy
            tl.to(member.group.userData.particles.material, { opacity: 1, duration: 2 }, label + "+=2");

            // Reveal Photo Panel
            member.photo.position.y -= 50; // Start lower
            tl.to(member.photo.position, { y: "+=50", duration: 2, ease: "power2.out" }, label + "+=2.5");
            tl.to(member.photo.material, { opacity: 1, duration: 2 }, label + "+=2.5");

            // Reveal Core Text (HTML)
            tl.to(`#core-panel-${i + 1}`, { opacity: 1, duration: 1 }, label + "+=3");

            // Hold
            tl.to({}, { duration: 5 });

            // Hide
            tl.to(`#core-panel-${i + 1}`, { opacity: 0, duration: 1 });
            tl.to(member.photo.material, { opacity: 0, duration: 1 });
            if (i < 2) { // Keep last galaxy faded until end sequence handles it
                tl.to(member.group.userData.particles.material, { opacity: 0, duration: 2 });
            }
        });

        // ------------------------------------------------------
        // 5. FINALE
        // ------------------------------------------------------
        tl.addLabel("end");
        // Fade out last galaxy
        const lastGalaxy = this.objects.coreMembers[2].group.userData.particles;
        tl.to(lastGalaxy.material, { opacity: 0, duration: 3 });

        // Pull back into deep space
        tl.to(this.camera.position, { z: "-=2000", duration: 5 });

        // Show Final Text
        tl.to("#final-signature", { opacity: 1, duration: 2 });
        } catch (error) {
            console.error('Error setting up scroll timeline:', error);
        }
    }

    // UI HELPER
    updateMentorHUD(config) {
        document.getElementById('mentor-name').innerText = config.name;
        document.getElementById('mentor-role').innerText = "// " + config.role;
        document.getElementById('mentor-desc').innerText = config.desc;
    }
}

// Start
let journey = null;
try {
    journey = new CosmicJourney();
} catch (error) {
    console.error('Failed to initialize application:', error);
    document.body.innerHTML = '<div style="color: #ff5f56; text-align: center; padding: 2rem; font-family: monospace;">Error initializing 3D scene. Please refresh the page.</div>';
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (journey) {
        journey.destroy();
    }
});
