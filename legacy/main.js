import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

console.log("System: CORE MODULE CONNECTED");

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------
const COLORS = {
    mentor1: 0x4a9eff, // Blue
    mentor2: 0xff4a8d, // Pink
    mentor3: 0x4affaa, // Green
    mentor4: 0xff8800, // Gold/Orange
    sun: 0xffaa00,     // Orange/Gold
    core1: 0x00d4ff,   // Cyan
    core2: 0x9b59b6,   // Purple
    core3: 0xffaa00,   // Gold
    core4: 0x2ecc71    // Green
};

// ------------------------------------------------------------------
// UTILS: PROCEDURAL TEXTURES
// ------------------------------------------------------------------
function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
}

function createSquareTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(8, 8, 48, 48); // A simple square
    return new THREE.CanvasTexture(canvas);
}

function createTextTexture(text, color = '#ffffff') {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 128);
    ctx.fillStyle = color;
    ctx.font = 'bold italic 88px Outfit, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Glow shadow
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillText(text.toUpperCase(), 256, 64);
    return new THREE.CanvasTexture(canvas);
}

function createNoiseTexture(size = 512, colorHex, complexity = 4) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, size, size);

    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        let v = 0;
        let freq = 1;
        let amp = 1;
        const x = (i / 4 % size);
        const y = Math.floor(i / 4 / size);

        for (let oct = 0; oct < complexity; oct++) {
            v += Math.sin(x * 0.02 * freq) * Math.cos(y * 0.02 * freq) * amp;
            freq *= 2.1;
            amp *= 0.5;
        }

        const brightness = (v + 1) * 75 + 20;
        const c = new THREE.Color(colorHex || '#ffffff');
        data[i] = c.r * brightness;
        data[i + 1] = c.g * brightness;
        data[i + 2] = c.b * brightness;
        data[i + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

function createGasTexture(size = 512, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Gas Bands
    const grad = ctx.createLinearGradient(0, 0, 0, size);
    grad.addColorStop(0, '#000');
    grad.addColorStop(0.3, colorHex || '#ff00ff');
    grad.addColorStop(0.5, '#111');
    grad.addColorStop(0.7, colorHex || '#00ffff');
    grad.addColorStop(1, '#000');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Noise detail
    for (let i = 0; i < 40; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
        ctx.fillRect(0, Math.random() * size, size, Math.random() * 5 + 1);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

function createCloudTexture(size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < size * size / 50; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = Math.random() * 2 + 1;
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
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
    const loader = new THREE.TextureLoader();
    // Default to the procedural texture while loading
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${(id * 40) % 360}, 70%, 50%)`;
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${id}`, 64, 64);

    const tex = new THREE.CanvasTexture(canvas);

    // Attempt to load the real photo
    loader.load(
        `assets/student${id}.jpg`,
        (loadedTex) => {
            tex.image = loadedTex.image;
            tex.needsUpdate = true;
        },
        undefined,
        () => { /* Quiet fail, keep procedural */ }
    );

    return tex;
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

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 340);
    grad.addColorStop(0, color || '#222');
    grad.addColorStop(1, '#000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 340);

    // Modern Silhouette
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.arc(128, 120, 70, 0, Math.PI * 2); // Head
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(128, 320, 110, 150, 0, 0, Math.PI * 2); // Body
    ctx.fill();

    // Border with Glow
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
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
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 50000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });

        this.objects = {
            mentors: [],
            sun: null,
            branches: [],
            galaxies: [],
            coreMembers: [],
            dataBackground: null,
            studentTokens: [] // For raycasting
        };

        this.raycaster = new THREE.Raycaster();
        this.mousePos = new THREE.Vector2();
        this.mouse = { x: 0, y: 0, isDown: false };
        this.sunRotationTarget = { x: 0, y: 0 };
        this.sunRotationCurrent = { x: 0, y: 0 };

        // Student metadata (id => { name, linkedin, github })
        this.studentsInfo = {
            1: { name: 'hariz', linkedin: '', github: '' },
            2: { name: 'sham', linkedin: '', github: '' },
            3: { name: 'amarnath', linkedin: 'https://www.linkedin.com/in/amarnath-p-s-942782322/', github: 'https://github.com/amarnath-cdr' },
            4: { name: 'arulananthan', linkedin: '', github: '' },
            5: { name: 'kamala kiruthi', linkedin: 'https://www.linkedin.com/in/kamala-kiruthi/', github: 'https://github.com/kamalakiruthi8' },
            6: { name: 'lohith', linkedin: 'https://www.linkedin.com/in/chinthalapalli-lohith-126447384/', github: 'https://github.com/lohithchinthalalpalli' },
            7: { name: 'hari', linkedin: 'https://www.linkedin.com/in/hari-r-bb3181370/', github: 'https://github.com/harirs139-ui' },
            8: { name: 'jayseelan', linkedin: 'https://www.linkedin.com/in/jayaseelan-d-1951952a6', github: 'https://www.linkedin.com/in/jayaseelan-d-1951952a6' },
            9: { name: 'durga saranya', linkedin: 'https://www.linkedin.com/feed/', github: 'https://github.com/durgasaranyas139-lgtm' },
            10: { name: 'gokul', linkedin: 'http://www.linkedin.com/in/gokul-raj95', github: 'https://www.linkedin.com/in/gokul-raj95' },
            11: { name: 'joy arnold', linkedin: 'https://www.linkedin.com/in/joyarnold21?utm_source=share_via&utm_content=profile&utm_medium=member_android', github: '' },
            12: { name: 'kathiravan', linkedin: 'https://www.linkedin.com/in/kathiravan-e-56688a39b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', github: 'https://github.com/ekathiravanelumalai71-a11y' },
            13: { name: 'mosses', linkedin: 'https://www.linkedin.com/in/moses-acknal-7957973a4/', github: 'https://github.com/mosesacknals139' },
            14: { name: 'priyadharsan', linkedin: 'http://www.linkedin.com/in/priyadharsan-s2007', github: 'https://github.com/Priyadharsan2911' },
            15: { name: 'abinay', linkedin: 'https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit', github: '' },
            16: { name: 'suriya', linkedin: '', github: '' },
            17: { name: 'yakesh', linkedin: 'https://www.linkedin.com/in/yakesh-r-92648a383?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', github: 'https://github.com/yakpranu-design' },
            18: { name: 'nanthakumar', linkedin: 'http://www.linkedin.com/in/nandhakumar-pm-8276b7381', github: 'https://github.com/nandhakumar1980' },
            19: { name: 'srinithi', linkedin: 'https://www.linkedin.com/in/srinithi-vijayakumar-981785344/', github: 'https://github.com/srinithivijayakumars139-wq' },
            20: { name: 'srimathi', linkedin: 'https://www.linkedin.com/in/srimathi-vijayakumar-10518a383/', github: 'https://github.com/srimajaya123-blip' },
            21: { name: 'srinidthi', linkedin: 'https://www.linkedin.com/in/srinidhi-v-123193384/', github: 'https://github.com/srinidhivs139-ai' },
            22: { name: 'mohan', linkedin: 'http://www.linkedin.com/in/mohan-e-b7945b2b2', github: 'https://github.com/mohanes139-cell' },
            23: { name: 'nabi rasool', linkedin: 'http://www.linkedin.com/in/nabi-rasool-129494393', github: '' },
            24: { name: 'keerthana', linkedin: 'https://www.linkedin.com/feed/', github: 'https://github.com/krishnakeerthanamitte-tech' }
        };

        // Dynamic Look-At Target
        this.lookAtTarget = new THREE.Vector3(0, 0, -1000);

        // Audio System
        this.audioCtx = null;

        // Scene adjustments
        this.scene.fog = new THREE.FogExp2(0x000000, 0.00005);
        this.init();
    }

    init() {
        console.log("System: INITIALIZING COSMIC JOURNEY...");

        // 1. Immediate UI Setup
        this.captureOriginalContent();
        this.setupUI();
        this.setupSecurity();

        // Renderer Setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.container.appendChild(this.renderer.domElement);

        // Lighting - REFINED
        const ambient = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambient);

        const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        this.scene.add(hemi);

        this.sunLight = new THREE.PointLight(0xffaa00, 6.0, 35000);
        this.sunLightPosition = new THREE.Vector3(0, 0, -10000);
        this.sunLight.position.copy(this.sunLightPosition);
        this.scene.add(this.sunLight);

        // Click interaction for students
        window.addEventListener('click', (e) => this.handlePick(e));
        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Headlight (Balanced searchlight)
        this.headlight = new THREE.PointLight(0xffffff, 2.5, 10000);
        this.scene.add(this.headlight);

        // Build World (In background)
        try {
            this.createStarfield();
            this.createNebulae();
            this.createCosmicDust(); // New background detail
            this.createDataBackground();
            this.createMentors();
            this.createMentorGalaxy();
            this.createSunSystem();
            this.createCoreGalaxies();
            console.log("System: WORLD ASSETS GENERATED.");
        } catch (err) {
            console.error("System: Error generating world:", err);
        }

        // Interaction for Sun
        window.addEventListener('mousedown', () => this.mouse.isDown = true);
        window.addEventListener('mouseup', () => this.mouse.isDown = false);
        window.addEventListener('mousemove', (e) => {
            if (this.mouse.isDown && this.objects.sun) {
                this.sunRotationTarget.y += e.movementX * 0.005;
                this.sunRotationTarget.x += e.movementY * 0.005;
            }
        });

        // Setup Camera Start
        this.camera.position.set(0, 50, 2000); // Backed up a bit
        this.camera.lookAt(0, 0, -1000);

        // Setup GSAP & Animation
        this.setupScroll();
        this.animate();

        // Final UI Polish
        this.hideLoader();
        console.log("System: NAVIGATION ARRAYS ONLINE.");

        // Resize Handler
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            ScrollTrigger.refresh();
        });
    }

    captureOriginalContent() {
        // Pre-save all dynamic UI content before GSAP clears it
        // Mentor HUD
        const mItems = ['mentor-name', 'mentor-role', 'mentor-desc'];
        mItems.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.dataset.orig = el.innerText.trim();
        });

        // Core Member Passages
        for (let i = 1; i <= 4; i++) {
            const name = document.getElementById(`core-name-${i}`);
            const bio = document.getElementById(`core-bio-${i}`);
            if (name) name.dataset.orig = name.innerText.trim();
            if (bio) bio.dataset.orig = bio.innerText.trim();
        }
        console.log("System: CONTENT_MAP_ESTABLISHED");
    }

    setupUI() {
        const btn = document.getElementById('enter-btn');
        const welcomeScreen = document.getElementById('welcome-screen');
        const scrollContent = document.getElementById('scroll-content');

        if (btn) {
            btn.addEventListener('click', async () => {
                console.log("System: SEQUENCE INITIATED BY USER.");
                this.initAudio();

                // 1. Visual feedback on button
                gsap.to(btn, {
                    scale: 0.9, opacity: 0, duration: 0.3, pointerEvents: 'none'
                });

                // 2. Hide welcome screen
                gsap.to(welcomeScreen, {
                    autoAlpha: 0, duration: 0.8, ease: "power2.inOut",
                    onComplete: () => { welcomeScreen.style.display = 'none'; }
                });

                // 3. SHOW MISSION ENTRY CARD (Cinematic)
                await this.showInterstitial("LETS START THE MISSION TO EXPLORE SQ139", 5000);

                // 4. Unlock Scroll & Engine
                if (scrollContent) {
                    scrollContent.style.display = 'block';
                    console.log("System: SCROLL ENGINE ENGAGED.");
                }

                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
                document.body.style.height = 'auto';

                // 5. Refresh ScrollTrigger
                setTimeout(() => {
                    ScrollTrigger.refresh();
                    console.log("System: READY FOR USER SCROLL.");
                    this.initHintManager(); // init scroll hint
                }, 50);
            });

            // Modal Close
            const modal = document.getElementById('student-profile-modal');
            const closeBtn = document.getElementById('modal-close');
            if (closeBtn && modal) {
                closeBtn.addEventListener('click', () => {
                    modal.classList.add('hidden');
                    // Refresh hints after modal closes
                    if (this.hint_refresh) this.hint_refresh();
                });
            }

            console.log("System: UI EVENT HANDLERS READY.");

            // Top Navigation Menu Logic
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetLabel = link.getAttribute('data-target');
                    if (this.tl) {
                        const scrollPos = this.tl.scrollTrigger.labelToScroll(targetLabel);
                        gsap.to(window, {
                            scrollTo: scrollPos,
                            duration: 2.5,
                            ease: "power3.inOut"
                        });
                    }
                });
            });
        } else {
            console.error("System: Enter button not found!");
        }
    }

    hideLoader() {
        const loader = document.getElementById('loader');
        if (!loader) return;

        // Phase 1: Fade out the loader FIRST
        gsap.to(loader, {
            opacity: 0,
            duration: 1.5,
            delay: 0.8, // Brief hold so user sees the loader
            ease: "power2.inOut",
            onComplete: () => {
                loader.style.display = 'none';
                if (loader.parentNode) loader.remove();
                console.log("System: BOOT SEQUENCE COMPLETE.");

                // Phase 2: Animate welcome screen in AFTER loader is gone
                const welcome = document.getElementById('welcome-screen');
                if (!welcome) return;

                // Make the container visible
                gsap.to(welcome, { autoAlpha: 1, duration: 0.1 });

                // Staggered cinematic reveal of each element
                const elements = [
                    document.querySelector('.top-nav'),
                    welcome.querySelector('.explore-text'),
                    welcome.querySelector('.main-title'),
                    welcome.querySelector('.protocol-text'),
                    welcome.querySelector('.initiate-btn')
                ].filter(Boolean);

                gsap.to(elements, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.25,
                    ease: "power3.out",
                    onStart: () => {
                        // Enable button clicks only after it appears
                        const btn = document.getElementById('enter-btn');
                        if (btn) btn.style.pointerEvents = 'auto';
                    }
                });
            }
        });
    }

    // ------------------------------------------------------------------
    // HINT MANAGER — Controls scroll & touch hints per section
    // ------------------------------------------------------------------
    initHintManager() {
        const scrollHint = document.getElementById('scroll-hint');
        const touchHint = document.getElementById('touch-hint');
        if (!scrollHint) return;

        let mode = 'scroll';
        let scrollLocked = false;
        let isScrolling = false;
        let isInterstitial = false; // New lock for cinematic cards
        let scrollStopTimer = null;
        let urgentTimer = null;
        let branchesTouched = 0;
        let totalBranches = 3;

        // ── Scroll hint helpers ──
        const showScroll = () => {
            if (scrollLocked || mode !== 'scroll' || isInterstitial) return;
            // Don't show if modal is open
            const modal = document.getElementById('student-profile-modal');
            if (modal && !modal.classList.contains('hidden')) return;

            scrollHint.classList.remove('hidden', 'fade-out', 'urgent');
            clearTimeout(urgentTimer);
            urgentTimer = setTimeout(() => scrollHint.classList.add('urgent'), 5000);
        };

        const hideScroll = (instant = false) => {
            clearTimeout(urgentTimer);
            scrollHint.classList.remove('urgent');
            if (instant) {
                scrollHint.classList.add('hidden');
                scrollHint.classList.remove('fade-out');
            } else {
                scrollHint.classList.add('fade-out');
                setTimeout(() => {
                    if (scrollHint.classList.contains('fade-out')) {
                        scrollHint.classList.add('hidden');
                        scrollHint.classList.remove('fade-out');
                    }
                }, 700);
            }
        };

        // ── Touch hint helpers ──
        const showTouch = () => {
            if (!touchHint) return;
            // Don't show touch hint if a modal is open
            const modal = document.getElementById('student-profile-modal');
            const isModalOpen = modal && !modal.classList.contains('hidden');
            if (isModalOpen) return;

            touchHint.classList.remove('hidden', 'fade-out');
        };
        const hideTouch = () => {
            if (!touchHint) return;
            touchHint.classList.add('fade-out');
            setTimeout(() => {
                touchHint.classList.add('hidden');
                touchHint.classList.remove('fade-out');
            }, 700);
        };

        // ── Scroll cycle handler ──
        const onScroll = () => {
            if (mode !== 'scroll' || scrollLocked) return;
            if (!isScrolling) {
                isScrolling = true;
                hideScroll();
            }
            clearTimeout(scrollStopTimer);
            scrollStopTimer = setTimeout(() => {
                isScrolling = false;
                showScroll();
            }, 2000);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('wheel', onScroll, { passive: true });
        window.addEventListener('touchmove', onScroll, { passive: true });

        // ── Public API ──
        this.hint_enableScroll = () => {
            mode = 'scroll';
            scrollLocked = false;
            hideTouch();
            showScroll();
        };

        this.hint_enterSun = (branches) => {
            totalBranches = branches || 3;
            branchesTouched = 0;
            mode = 'touch';
            scrollLocked = true;
            hideScroll(true);
            showTouch();
        };

        this.hint_branchTouched = () => {
            branchesTouched++;
            if (branchesTouched >= totalBranches) {
                hideTouch();
                mode = 'scroll';
                scrollLocked = false;
                setTimeout(() => showScroll(), 800);
            }
        };

        this.hint_suppressForTyping = (ms) => {
            hideScroll(true);
            scrollLocked = true;
            clearTimeout(scrollStopTimer);
            setTimeout(() => {
                scrollLocked = false;
                if (mode === 'scroll') showScroll();
            }, ms);
        };

        // Re-check visibility (e.g. after modal closes)
        this.hint_refresh = () => {
            if (mode === 'scroll') showScroll();
            else if (mode === 'touch') showTouch();
        };

        // Permanently kill all hints (used at the end of the page)
        this.hint_killAll = () => {
            mode = 'off';
            scrollLocked = true;
            hideScroll(true);
            hideTouch();
        };

        // Interstitial locking mechanisms
        this.hint_lockForInterstitial = () => {
            isInterstitial = true;
            hideScroll(true);
            hideTouch();
        };

        this.hint_unlockAfterInterstitial = () => {
            isInterstitial = false;
            if (mode === 'scroll') showScroll();
            else if (mode === 'touch') showTouch();
        };

        // Start active
        this.hint_enableScroll();
        console.log("System: HINT_MANAGER_ONLINE.");
    }

    // ------------------------------------------------------------------
    // SECURITY — Prevent screenshot/image theft (Basic Protection)
    // ------------------------------------------------------------------
    setupSecurity() {
        // 1. Disable Right-click
        window.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'IMG' || e.target.closest('.modal-container') || e.target.closest('.mentor-photo')) {
                e.preventDefault();
                console.warn("Security: ACCESS_DENIED.");
            }
        });

        // 2. Disable Screenshot Shortcuts (Common ones)
        window.addEventListener('keydown', (e) => {
            // PrintScreen, Ctrl+S, Ctrl+U, Ctrl+Shift+I, F12
            const forbiddenKeys = ['PrintScreen', 's', 'u', 'i', 'F12'];
            const isForbidden = (e.key === 'PrintScreen') ||
                (e.ctrlKey && forbiddenKeys.includes(e.key.toLowerCase())) ||
                (e.key === 'F12');

            if (isForbidden) {
                // We can't actually stop PrintScreen in JS on all systems, but we can try to disrupt it
                if (e.key === 'PrintScreen') {
                    // Copy empty text to clipboard to disrupt screen capture if possible
                    navigator.clipboard.writeText("");
                }

                // For other keys, prevent default
                if (e.key !== 'PrintScreen') {
                    e.preventDefault();
                    console.warn("Security: ACTION_BLOCKED.");
                    return false;
                }
            }
        });

        // 3. Add overlay pulse on images for "protection" feel
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.userSelect = 'none';
            img.style.pointerEvents = 'none';
            // -webkit-user-drag is not a standard CSS property but commonly used
            img.style.setProperty('-webkit-user-drag', 'none');
        });

        console.log("System: SECURITY_PROTOCOLS_ACTIVE.");
    }

    // ------------------------------------------------------------------
    // CINEMATIC INTERSTITIALS — Spaceship Section Transitions
    // ------------------------------------------------------------------
    showInterstitial(mainText, duration = 4000) {
        return new Promise((resolve) => {
            const container = document.getElementById('cinematic-interstitial');
            const textEl = document.getElementById('interstitial-main-text');
            const line = container.querySelector('.interstitial-underline');

            if (!container || !textEl) {
                resolve();
                return;
            }

            // Lock hints before showing
            if (this.hint_lockForInterstitial) this.hint_lockForInterstitial();

            // Reveal container
            container.classList.remove('hidden');
            gsap.set(container, { opacity: 0 });
            gsap.set(line, { width: 0 });

            gsap.to(container, {
                opacity: 1,
                duration: 0.8,
                onStart: () => {
                    // Type the main title
                    this.typewriterEffect(textEl, mainText, 60);
                    // Animate the accent line
                    gsap.to(line, { width: "100%", duration: 1.5, ease: "power2.inOut", delay: 0.5 });
                }
            });

            // Auto-hide after duration
            setTimeout(() => {
                gsap.to(container, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        container.classList.add('hidden');
                        // Unlock hints after hidden
                        if (this.hint_unlockAfterInterstitial) this.hint_unlockAfterInterstitial();
                        resolve();
                    }
                });
            }, duration);
        });
    }

    // ------------------------------------------------------------------
    // CREATION: ENVIRONMENT (STARS & NEBULAE)
    // ------------------------------------------------------------------
    createStarfield() {
        const count = 25000;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);

        const starColors = [0xffffff, 0xddeeff, 0xffeedd, 0xffcccc, 0xffaa00];

        for (let i = 0; i < count; i++) {
            const r = 35000 * Math.random(); // Increased radius
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = (Math.random() - 0.5) * 100000; // Deep depth

            const c = new THREE.Color(starColors[Math.floor(Math.random() * starColors.length)]);
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

    createNebulae() {
        // Create soft colorful background clouds using textured sprites
        const nebulaTex = createGlowTexture();
        for (let i = 0; i < 20; i++) { // More nebulae
            const count = 300;
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            const col = new Float32Array(count * 3);

            const basePos = new THREE.Vector3(
                (Math.random() - 0.5) * 15000,
                (Math.random() - 0.5) * 15000,
                -Math.random() * 35000 // Deeper range
            );

            const colors = [0x00f2ff, 0x9b59b6, 0xff00ff, 0x27c93f, 0xffaa00];
            const baseColor = new THREE.Color(colors[i % colors.length]);

            for (let j = 0; j < count; j++) {
                pos[j * 3] = basePos.x + (Math.random() - 0.5) * 6000;
                pos[j * 3 + 1] = basePos.y + (Math.random() - 0.5) * 6000;
                pos[j * 3 + 2] = basePos.z + (Math.random() - 0.5) * 6000;

                col[j * 3] = baseColor.r;
                col[j * 3 + 1] = baseColor.g;
                col[j * 3 + 2] = baseColor.b;
            }

            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

            const mat = new THREE.PointsMaterial({
                size: 800, // Massive cloud sprites
                map: nebulaTex,
                vertexColors: true,
                transparent: true,
                opacity: 0.08, // More visible
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            this.scene.add(new THREE.Points(geo, mat));
        }
    }

    createCosmicDust() {
        const count = 3000;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 5000;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 5000;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20000;

            const c = new THREE.Color(Math.random() > 0.5 ? 0x00f2ff : 0xffaa00);
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

        const mat = new THREE.PointsMaterial({
            size: 15,
            vertexColors: true,
            transparent: true,
            opacity: 0.15,
            map: createCircleTexture(),
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const dust = new THREE.Points(geo, mat);
        this.scene.add(dust);
        this.objects.dust = dust;
    }

    createDataBackground() {
        // Specific blocky/data background for Planet section
        const group = new THREE.Group();
        this.scene.add(group);
        this.objects.dataBackground = group;

        // 1. Blocky Particles (Large Purple Squares)
        const count = 100;
        const squareGeo = new THREE.PlaneGeometry(300, 300);
        const squareMat = new THREE.MeshBasicMaterial({
            color: 0x9b59b6,
            transparent: true,
            opacity: 0.05,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });

        for (let i = 0; i < count; i++) {
            const square = new THREE.Mesh(squareGeo, squareMat);
            square.position.set(
                (Math.random() - 0.5) * 15000,
                (Math.random() - 0.5) * 15000,
                -Math.random() * 8000
            );
            square.rotation.z = Math.random() * Math.PI;
            group.add(square);
        }

        // 2. Data Dots (Small Cyan Squares)
        const dotCount = 1000;
        const dotGeo = new THREE.BufferGeometry();
        const dotPos = [];
        for (let i = 0; i < dotCount; i++) {
            dotPos.push(
                (Math.random() - 0.5) * 15000,
                (Math.random() - 0.5) * 15000,
                -Math.random() * 8000
            );
        }
        dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPos, 3));
        const dotMat = new THREE.PointsMaterial({
            color: 0x00f2ff,
            size: 15,
            transparent: true,
            opacity: 0.3,
            map: createSquareTexture()
        });
        group.add(new THREE.Points(dotGeo, dotMat));
    }


    // ------------------------------------------------------------------
    // CREATION: MENTORS
    // ------------------------------------------------------------------
    createMentors() {
        // Mentor 1: Santushta Iyer (Terrestrial)
        const m1 = this.createPlanet({
            id: 1,
            color: COLORS.mentor1,
            size: 350, // Massive Increase
            pos: { x: -1600, y: 0, z: -1500 }, // Pushed wider
            name: "Santushta Iyer",
            role: "Mentor",
            desc: "Expert handling FEWD and BOE subjects, crafting high-performance front-end architectures and operational excellence.",
            side: 'left',
            type: 'terrestrial',
            linkedin: "https://www.linkedin.com/in/santushta-iyer-a-99862a25b",
            github: "https://github.com",
            email: "mailto:santhustha.iyer@kalvium.community"
        });

        // Mentor 2: Hanuram T (Gas Giant)
        const m2 = this.createPlanet({
            id: 2,
            color: COLORS.mentor2,
            size: 450, // Massive Increase
            pos: { x: 1800, y: 150, z: -3500 }, // Pushed wider
            name: "Hanuram T",
            role: "Mentor",
            desc: "Specialist in FEWD and BOE subjects, dedicated to bridging the gap between design and scalable engineering.",
            side: 'right',
            type: 'gas',
            hasRings: true,
            linkedin: "https://www.linkedin.com/in/hanuram-t",
            github: "https://github.com",
            email: "mailto:hanuram.t@kalvium.community"
        });

        // Mentor 3: Karunakaran (KK) (Alien Jungle)
        const m3 = this.createPlanet({
            id: 3,
            color: COLORS.mentor3,
            size: 320, // Massive Increase
            pos: { x: -1600, y: -100, z: -5500 }, // Pushed wider
            name: "Karunakaran (KK)",
            role: "Mentor",
            desc: "Strategist in English LSRW and Critical Thinking, empowering students with elite communication and analytical skills.",
            side: 'left',
            type: 'terrestrial',
            linkedin: "https://www.linkedin.com/in/h-karunakaran-3b1285376",
            github: "https://github.com",
            email: "mailto:karunakaran.h@kalvium.community"
        });

        // Mentor 4: Arvind (Ice Giant)
        const m4 = this.createPlanet({
            id: 4,
            color: COLORS.mentor4,
            size: 400, // Massive Increase
            pos: { x: 1800, y: -200, z: -7000 }, // Pushed wider
            name: "Arvind",
            role: "Mentor",
            desc: "Maestro of PSUP and Engineering Maths, solving complex equations and building logical foundations for explorers.",
            side: 'right',
            type: 'gas',
            linkedin: "https://www.linkedin.com/in/aravind-r-812634245",
            github: "https://github.com",
            email: "mailto:aravind.r@kalvium.community"
        });

        this.objects.mentors = [m1, m2, m3, m4];
    }

    createMentorGalaxy() {
        // A huge distant spiral galaxy as background for the planet section
        const group = new THREE.Group();
        group.position.set(2000, 2000, -8000);
        this.scene.add(group);

        const count = 5000;
        const geo = new THREE.BufferGeometry();
        const pos = [];
        const col = [];
        const baseColor = new THREE.Color(COLORS.mentor1);

        for (let i = 0; i < count; i++) {
            const r = Math.random() * 5000;
            const angle = Math.random() * Math.PI * 2;
            const arms = 3;
            const armOffset = (i % arms) * (Math.PI * 2 / arms);
            const spiral = r * 0.001;
            const x = Math.cos(angle + spiral + armOffset) * r;
            const y = Math.sin(angle + spiral + armOffset) * r;
            const z = (Math.random() - 0.5) * 500;

            pos.push(x, y, z);
            col.push(baseColor.r, baseColor.g, baseColor.b);
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));

        const mat = new THREE.PointsMaterial({
            size: 15,
            vertexColors: true,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const points = new THREE.Points(geo, mat);
        group.add(points);
        this.objects.mentorGalaxy = group;
    }

    createPlanet(config) {
        const group = new THREE.Group();
        group.position.set(config.pos.x, config.pos.y, config.pos.z);

        // 1. Planet Core (Terrain/Gas)
        const geo = new THREE.SphereGeometry(config.size, 64, 64);
        const tex = config.type === 'gas'
            ? createGasTexture(512, new THREE.Color(config.color).getStyle())
            : createNoiseTexture(512, new THREE.Color(config.color).getStyle(), 4);

        const mat = new THREE.MeshPhongMaterial({
            map: tex,
            bumpMap: tex,
            bumpScale: 10,
            shininess: 30,
            emissive: new THREE.Color(config.color),
            emissiveIntensity: 0.8 // High self-glow
        });
        const planet = new THREE.Mesh(geo, mat);
        group.add(planet);

        // 2. Cloud Layer (Atmospheric depth)
        const cloudGeo = new THREE.SphereGeometry(config.size + 2, 64, 64);
        const cloudMat = new THREE.MeshStandardMaterial({
            map: createCloudTexture(1024),
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        const clouds = new THREE.Mesh(cloudGeo, cloudMat);
        group.add(clouds);
        group.userData.clouds = clouds;

        // 3. Atmosphere (Outer Fresnel Glow)
        const atmoGeo = new THREE.SphereGeometry(config.size * 1.25, 64, 64);
        const atmoMat = new THREE.MeshBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        group.add(new THREE.Mesh(atmoGeo, atmoMat));

        // 4. Rings (Optional)
        if (config.hasRings) {
            const ringGeo = new THREE.RingGeometry(config.size * 1.4, config.size * 2.5, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                map: createGasTexture(512, new THREE.Color(config.color).getStyle()),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.4
            });
            const rings = new THREE.Mesh(ringGeo, ringMat);
            rings.rotation.x = Math.PI * 0.4;
            group.add(rings);
            group.userData.rings = rings;
        }

        // Info Line
        const dir = config.side === 'left' ? 1 : -1;
        const lineLen = config.size * 8.0; // Much longer to bridge screen gap
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(lineLen * dir, config.size * 0.5, 0)
        ]);
        const lineMat = new THREE.LineBasicMaterial({ color: config.color, transparent: true, opacity: 0 });
        const line = new THREE.Line(lineGeo, lineMat);
        group.add(line);

        this.scene.add(group);

        return {
            group: group,
            planet: planet,
            clouds: clouds,
            line: line,
            config: config
        };
    }

    // ... (Sun Logic) ...

    // ... (HUD Update Logic) ...
    updateMentorHUD(config) {
        const panel = document.getElementById('mentor-panel');
        const nameEl = document.getElementById('mentor-name');
        const roleEl = document.getElementById('mentor-role');
        const descEl = document.getElementById('mentor-desc');
        const photoContainer = document.querySelector('.mentor-photo');

        nameEl.innerText = config.name;
        roleEl.innerText = "// " + config.role;
        descEl.innerText = config.desc;

        // Image Logic (using placeholders if file not found logic isn't robust, but here we just set src)
        // Ensure image exists or fallback
        // Since we don't have real images, we can use a placeholder generator data URI or color block
        // For now, let's create a dynamic colored block or stick a placeholder image if available
        photoContainer.innerHTML = ''; // Clear
        const img = document.createElement('img');
        // Simple distinct placeholder using https://placehold.co or similar if online, but local is safer
        // Let's use a generated canvas data URL to be safe and cool
        img.src = this.generateAvatar(config.id, config.color);
        photoContainer.appendChild(img);

        // Positioning
        // Remove old classes
        panel.classList.remove('side-left', 'side-right');

        if (config.side === 'left') {
            // Planet Left -> Panel Right
            panel.classList.add('side-right');
        } else {
            // Planet Right -> Panel Left
            panel.classList.add('side-left');
        }
    }

    generateAvatar(id, colorHex) {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');

        // Bg
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, 100, 100);

        // Circle
        ctx.fillStyle = new THREE.Color(colorHex).getStyle();
        ctx.beginPath();
        ctx.arc(50, 50, 40, 0, Math.PI * 2);
        ctx.fill();

        // Text
        ctx.fillStyle = '#000';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(id, 50, 50);

        return canvas.toDataURL();
    }

    // ------------------------------------------------------------------
    // UTILITY: AUDIO SYSTEM
    // ------------------------------------------------------------------
    initAudio() {
        if (this.audioCtx) return;
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        console.log("System: AUDIO INITIALIZED");
    }

    playTypeSound() {
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        // High-end Robotic Click: Square wave + Highpass for that mechanical 'snap'
        osc.type = 'square';
        osc.frequency.setValueAtTime(800 + Math.random() * 400, this.audioCtx.currentTime);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
        filter.Q.value = 5; // Resonant peak for click character

        gain.gain.setValueAtTime(0.008, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.015);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.015);
    }

    // ------------------------------------------------------------------
    // UTILITY: TYPEWRITER EFFECT
    // ------------------------------------------------------------------
    typewriterEffect(element, text, speed = 40) {
        let el = typeof element === 'string' ? document.getElementById(element) : element;
        if (!el) return;

        // Prioritize dataset.orig if text is missing or generic
        const finalContent = text || el.dataset.orig;
        if (!finalContent) return;

        // Clear any existing interval on this element
        if (el._typeInterval) clearInterval(el._typeInterval);

        el.textContent = '';

        let i = 0;
        el._typeInterval = setInterval(() => {
            if (i < finalContent.length) {
                el.textContent += finalContent[i];
                this.playTypeSound();
                i++;
            }
            if (i >= finalContent.length) {
                clearInterval(el._typeInterval);
                el._typeInterval = null;
            }
        }, speed);
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
        const geo = new THREE.SphereGeometry(250, 64, 64);
        const mat = new THREE.MeshStandardMaterial({
            color: COLORS.sun,
            emissive: COLORS.sun,
            emissiveIntensity: 2.5, // Ultimate Sun Glow
            map: createNoiseTexture(512, '#ff8800', 3)
        });
        const sun = new THREE.Mesh(geo, mat);
        sunGroup.add(sun);

        const folksMat = new THREE.SpriteMaterial({
            map: createTextTexture("FOLKS", "#00f2ff"),
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });
        const folks = new THREE.Sprite(folksMat);
        folks.scale.set(200, 60, 1); // Compact, inside sun
        folks.position.set(0, 0, 260); // On sun face, centered
        sunGroup.add(folks);
        this.objects.folks = folks;

        // Corona
        const corona = new THREE.Mesh(
            new THREE.SphereGeometry(280, 64, 64), // Reduced from 450
            new THREE.MeshBasicMaterial({ color: 0xff4500, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending })
        );
        sunGroup.add(corona);

        // "FOLKS" Text Floating Above
        // (Handled by simple HTML Overlay or just omitted for pure visual flow? Request says "Text above: 'FOLKS'". I'll stick to CSS overlay for crisp text)

        // Branch Sets: 8 + 8 + 8 = 24 students
        // Each set is shown sequentially during the sun scroll sequence
        this.createBranchSet(sunGroup, 8, 0);
        this.createBranchSet(sunGroup, 8, 1);
        this.createBranchSet(sunGroup, 8, 2);
    }

    createBranchSet(parent, count, setIndex) {
        const setGroup = new THREE.Group();
        parent.add(setGroup);
        if (!this.objects.branches[setIndex]) this.objects.branches[setIndex] = setGroup;

        // Hide initially
        setGroup.visible = false;

        let idBase = setIndex * 8 + 1;

        for (let i = 0; i < count; i++) {
            const studentId = idBase + i;
            const angle = (i / count) * Math.PI * 2 + (setIndex * 1.5); // More distinct rotation per set
            const dist = 600 + Math.random() * 150; // Increased distance
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            const z = (Math.random() - 0.5) * 300;

            // Generate unique color for this student
            const hue = (studentId * 137.5) % 360; // Golden angle for distribution
            const studentColor = new THREE.Color(`hsl(${hue}, 80%, 60%)`);


            // Lines removed — clean solar system look


            // Student Token (Glowing Round with Ring)
            const tokenGroup = new THREE.Group();
            tokenGroup.position.set(x, y, z);
            setGroup.add(tokenGroup);

            // 1. The Core Portrait Disc — load real photo at full quality
            const discGeo = new THREE.CircleGeometry(70, 64);
            const discMat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide
            });
            const disc = new THREE.Mesh(discGeo, discMat);
            tokenGroup.add(disc);

            // Direct TextureLoader — no canvas pipeline, max quality
            new THREE.TextureLoader().load(
                `assets/student${studentId}.jpg`,
                (tex) => {
                    tex.minFilter = THREE.LinearFilter;
                    disc.material.map = tex;
                    disc.material.needsUpdate = true;
                },
                undefined,
                () => {
                    // Fallback: styled number disc
                    const fb = document.createElement('canvas');
                    fb.width = 256; fb.height = 256;
                    const fc = fb.getContext('2d');
                    fc.beginPath(); fc.arc(128, 128, 124, 0, Math.PI * 2);
                    fc.fillStyle = `hsl(${hue}, 60%, 20%)`; fc.fill();
                    fc.fillStyle = `hsl(${hue}, 90%, 70%)`;
                    fc.font = 'bold 80px Arial';
                    fc.textAlign = 'center'; fc.textBaseline = 'middle';
                    fc.fillText(studentId, 128, 128);
                    disc.material.map = new THREE.CanvasTexture(fb);
                    disc.material.needsUpdate = true;
                }
            );

            // 2. Neon Ring System — Bright core + Outer glow halo
            // Inner bright ring
            const ringGeo = new THREE.RingGeometry(71, 75, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                color: studentColor,
                transparent: true,
                opacity: 1.0,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            tokenGroup.add(ring);

            // Outer soft glow ring
            const outerRingGeo = new THREE.RingGeometry(75, 90, 64);
            const outerRingMat = new THREE.MeshBasicMaterial({
                color: studentColor,
                transparent: true,
                opacity: 0.25,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            tokenGroup.add(new THREE.Mesh(outerRingGeo, outerRingMat));

            // 3. The Glow Aura (COLORFUL)
            const glowMat = new THREE.SpriteMaterial({
                map: createGlowTexture(),
                color: studentColor,
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending
            });
            const glow = new THREE.Sprite(glowMat);
            glow.scale.set(200, 200, 1);
            tokenGroup.add(glow);

            // Store for interaction and rotation
            tokenGroup.userData = {
                isStudent: true,
                id: studentId,
                isGroup: true,
                ring: ring,
                rotationSpeed: Math.random() * 0.02 + 0.01,
                // Attach student metadata if available
                meta: this.studentsInfo[studentId] || { name: `SQUAD_MEMBER_${studentId}`, linkedin: '', github: '' }
            };

            disc.userData = tokenGroup.userData;
            this.objects.studentTokens.push(disc);
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

        // 4. Spiral (Green)
        this.createGalaxy({
            z: startZ - (gap * 3),
            color: COLORS.core4,
            type: 'spiral',
            name: "Core Member 4"
        }, 3);
    }

    createGalaxy(config, index) {
        const group = new THREE.Group();
        group.position.set(0, 0, config.z); // Centered on path
        this.scene.add(group);
        this.objects.galaxies.push(group);

        // Particle System
        const pCount = 2000;
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

        // Note: 3D Photo Planes removed to prioritize high-quality HUD personnel dossiers.
        this.objects.coreMembers.push({
            group: group,
            config: config
        });
    }

    // ------------------------------------------------------------------
    // ANIMATION LOOP (Dynamic & Professional)
    // ------------------------------------------------------------------
    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // 0. Update Camera & Headlight
        if (this.headlight) {
            this.headlight.position.copy(this.camera.position);
        }
        // Use dynamic Look-At target
        this.camera.lookAt(this.lookAtTarget);

        // 1. Rotate Mentors & Students (Spheres)
        this.objects.mentors.forEach(m => {
            m.planet.rotation.y += 0.002;
            if (m.clouds) {
                m.clouds.rotation.y += 0.003;
            }
        });

        this.objects.studentTokens.forEach(token => {
            if (token.parent && token.parent.userData.isGroup) {
                // Billboard: Face the camera
                token.parent.lookAt(this.camera.position);
                // Rotate Ring specifically
                token.parent.userData.ring.rotation.z += token.parent.userData.rotationSpeed;
            }
        });

        // 2. Pulsing Sun & Interactive Rotation
        if (this.objects.sun) {
            // Smoothly interpolate rotation to target
            this.sunRotationCurrent.x += (this.sunRotationTarget.x - this.sunRotationCurrent.x) * 0.1;
            this.sunRotationCurrent.y += (this.sunRotationTarget.y - this.sunRotationCurrent.y) * 0.1;

            this.objects.sun.rotation.y = this.sunRotationCurrent.y;
            this.objects.sun.rotation.x = this.sunRotationCurrent.x;

            const pulse = 1 + Math.sin(time * 2) * 0.02;
            this.objects.sun.scale.set(pulse, pulse, pulse);

            this.objects.sun.children.forEach((child, i) => {
                // Background layers (text & corona) rotate with sun + own drift
                if (i > 0) child.rotation.z += 0.001 * (i % 2 === 0 ? 1 : -1);
            });
        }

        // 3. Background Drifting
        if (this.objects.dataBackground) {
            this.objects.dataBackground.position.z += 0.5; // Slight forward drift
            if (this.objects.dataBackground.position.z > 2000) this.objects.dataBackground.position.z = 0;
        }

        if (this.objects.dust) {
            this.objects.dust.rotation.y += 0.0005;
            this.objects.dust.position.z += 1.0;
            if (this.objects.dust.position.z > 5000) this.objects.dust.position.z = 0;
        }

        if (this.objects.mentorGalaxy) {
            this.objects.mentorGalaxy.rotation.z += 0.0001;
        }
        this.objects.coreMembers.forEach(member => {
            member.group.userData.particles.rotation.z += 0.0002;
        });

        // 4. Interaction Hover Feedback
        this.raycaster.setFromCamera(this.mousePos, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects.studentTokens);
        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }

        this.renderer.render(this.scene, this.camera);
    }

    // ------------------------------------------------------------------
    // GSAP SCROLL ORCHESTRATION
    // ------------------------------------------------------------------
    setupScroll() {
        // Ensure all UI starts hidden
        const allPanels = ['#mentor-panel', '.core-passage-panel', '#final-signature', '#welcome-screen'];
        gsap.set(allPanels, { autoAlpha: 0 });
        gsap.set('#welcome-screen', { autoAlpha: 1 }); // Except welcome

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#scroll-content",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5
            }
        });
        this.tl = tl;

        // 1. ENTRY -> PLANET 1
        const m1 = this.objects.mentors[0];
        const m1OffsetX = m1.config.side === 'left' ? 750 : -750;

        tl.to('#welcome-screen', { autoAlpha: 0, duration: 1 }, 0);

        tl.to(this.camera.position, {
            x: m1.group.position.x + m1OffsetX,
            y: m1.group.position.y + 20,
            z: m1.group.position.z + 350,
            duration: 5,
            ease: "power2.inOut"
        }, 0);

        tl.to(this.lookAtTarget, {
            x: m1.group.position.x,
            y: m1.group.position.y,
            z: m1.group.position.z,
            duration: 5,
            ease: "power2.inOut"
        }, 0);

        // 2. MENTOR LOOP
        this.objects.mentors.forEach((m, i) => {
            const label = `mentor${i + 1}`;
            const camXOffset = m.config.side === 'left' ? 750 : -750;

            tl.addLabel(label);

            // Move to mentor
            tl.to(this.camera.position, {
                x: m.group.position.x + camXOffset,
                y: m.group.position.y + 20,
                z: m.group.position.z + 1000,
                duration: 5,
                ease: "power2.inOut"
            }, label);

            tl.to(this.lookAtTarget, {
                x: m.group.position.x,
                y: m.group.position.y,
                z: m.group.position.z,
                duration: 5,
                ease: "power2.inOut"
            }, label);

            // Visibility: Show panel explicitly with timeline
            tl.to('#mentor-panel', {
                autoAlpha: 1,
                duration: 0.5,
                onStart: () => {
                    this.updateMentorHUD(m.config);
                    this.typewriterEffect('mentor-name', m.config.name, 80);
                    this.typewriterEffect('mentor-role', '// ' + m.config.role, 70);
                    this.typewriterEffect('mentor-desc', m.config.desc, 50);
                }
            }, label + "+=3.5");

            tl.to({}, { duration: 6 }); // Hold period

            // Visibility: Hide panel before next step
            tl.to('#mentor-panel', { autoAlpha: 0, duration: 0.5 });

            if (i === this.objects.mentors.length - 1) {
                // Fly to Sun
                tl.addLabel("flyingToSun");
                tl.to(this.camera.position, {
                    x: 0, y: 0, z: this.objects.sun.position.z + 1200,
                    duration: 8, ease: "power2.inOut"
                }, "flyingToSun");

                tl.to(this.lookAtTarget, {
                    x: 0, y: 0, z: this.objects.sun.position.z,
                    duration: 8, ease: "power2.inOut"
                }, "flyingToSun");
            }
        });

        // 3. SUN / COMMUNITY
        tl.addLabel("sunArrival");

        // Cinematic Entry for Sun
        tl.call(() => { this.showInterstitial("NOW VISIT A FOLKS OF 139", 4000); }, null, "sunArrival");
        tl.to({}, { duration: 5 }); // Hold for interstitial

        const totalBranchSets = this.objects.branches.length;
        // When sun section starts → swap to touch hint
        tl.call(() => { if (this.hint_enterSun) this.hint_enterSun(totalBranchSets); }, null, "sunArrival+=5");
        this.objects.branches.forEach((set, i) => {
            tl.call(() => { set.visible = true; }, null, ">");
            tl.fromTo(set.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 2, ease: "back.out(1.2)" });
            // Each branch fully appears → count it as one "touched" branch
            tl.call(() => { if (this.hint_branchTouched) this.hint_branchTouched(); });
            tl.to({}, { duration: 4 });
            tl.to(set.scale, { x: 0, y: 0, z: 0, duration: 1 });
            tl.call(() => { set.visible = false; });
        });

        // VOID TRANSITION — re-enable scroll hint after sun section
        tl.call(() => { if (this.hint_enableScroll) this.hint_enableScroll(); });
        tl.to(this.camera.position, {
            z: "-=4000",
            duration: 12,
            ease: "power1.inOut"
        });

        // 4. CORE GALAXY PASSAGE
        tl.addLabel("galaxyEntrance");

        // Cinematic Entry for Team
        tl.call(() => { this.showInterstitial("EXPLORE THE TEAM INFINITY LOOPER", 4500); }, null, "galaxyEntrance");
        tl.to({}, { duration: 6 }); // Hold for interstitial
        this.objects.coreMembers.forEach((member, i) => {
            const label = `core${i + 1}`;
            const camX = i % 2 === 0 ? -600 : 600;
            const panelId = `core-panel-${i + 1}`;

            tl.addLabel(label);

            tl.to(this.camera.position, {
                x: camX,
                y: member.group.position.y,
                z: member.group.position.z + 1400,
                duration: 8,
                ease: "power2.inOut"
            }, label);

            tl.to(this.lookAtTarget, {
                x: member.group.position.x,
                y: member.group.position.y,
                z: member.group.position.z,
                duration: 8,
                ease: "power2.inOut"
            }, label);

            // Visibility: Show Core Panel
            tl.to(`#${panelId}`, {
                autoAlpha: 1,
                duration: 0.8,
                onStart: () => {
                    // Typewriter for name
                    const nameEl = document.getElementById(`core-name-${i + 1}`);
                    const bioEl = document.getElementById(`core-bio-${i + 1}`);

                    const nameText = (nameEl && (nameEl.dataset.orig || nameEl.textContent.trim())) || '';
                    const bioText = (bioEl && (bioEl.dataset.orig || bioEl.innerText.trim())) || '';

                    // Suppress scroll hint while typing plays out
                    const typingMs = Math.max(nameText.length * 70, bioText.length * 45) + 800;
                    if (this.hint_suppressForTyping) this.hint_suppressForTyping(typingMs);

                    if (nameEl) {
                        if (!nameEl.dataset.orig) nameEl.dataset.orig = nameText;
                        this.typewriterEffect(nameEl, nameText, 70);
                    }
                    if (bioEl) {
                        if (!bioEl.dataset.orig) bioEl.dataset.orig = bioText;
                        this.typewriterEffect(bioEl, bioText, 45);
                    }
                }
            }, label + "+=6");

            tl.to({}, { duration: 12 }); // Extensive Hold

            // Visibility: Hide Core Panel
            tl.to(`#${panelId}`, { autoAlpha: 0, duration: 0.5 });

            tl.to({}, { duration: 4 }); // Pause in void
        });

        // 5. FINALE
        tl.addLabel("finale");
        tl.to(this.camera.position, {
            z: "-=4500",
            duration: 15,
            ease: "power2.inOut"
        }, "finale");

        tl.to("#final-signature", {
            autoAlpha: 1,
            duration: 1,
            onStart: () => {
                // Kill all hints permanently at the end
                if (this.hint_killAll) this.hint_killAll();

                const textNodes = document.querySelectorAll('#final-signature > *');
                gsap.fromTo(textNodes,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 1.5, stagger: 0.4, ease: "power3.out" }
                );
            }
        }, "finale+=3");
    }

    // UI REFINEMENT
    updateMentorHUD(config) {
        const panel = document.getElementById('mentor-panel');
        const photoContainer = document.querySelector('.mentor-photo');

        document.getElementById('mentor-name').innerText = config.name;
        document.getElementById('mentor-role').innerText = "// " + config.role;
        document.getElementById('mentor-desc').innerText = config.desc;

        const lnLink = panel.querySelector('.social-link.linkedin');
        if (lnLink) lnLink.href = config.linkedin || "#";
        const ghLink = panel.querySelector('.social-link.github');
        if (ghLink) ghLink.href = config.github || "#";
        const emLink = panel.querySelector('.social-link.email');
        if (emLink) emLink.href = config.email || "#";

        photoContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = `assets/mentor${config.id}.jpg`;
        img.onerror = () => { img.src = this.generateAvatar(config.id, config.color); };
        photoContainer.appendChild(img);

        panel.classList.remove('side-left', 'side-right');
        panel.classList.add(config.side === 'left' ? 'side-right' : 'side-left');
    }

    generateAvatar(id, colorHex) {
        const canvas = document.createElement('canvas');
        canvas.width = 200; canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#111'; ctx.fillRect(0, 0, 200, 200);
        ctx.fillStyle = new THREE.Color(colorHex).getStyle();
        ctx.beginPath(); ctx.arc(100, 100, 80, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000'; ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(id, 100, 100);
        return canvas.toDataURL();
    }

    handlePick(e) {
        if (this.mouse.isDown) return;
        const modal = document.getElementById('student-profile-modal');
        if (modal && !modal.classList.contains('hidden')) return;

        this.raycaster.setFromCamera(this.mousePos, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects.studentTokens);

        if (intersects.length > 0) {
            const token = intersects[0].object;
            this.openStudentProfile(token.userData.id);
            // Hide hints when modal opens
            const scrollHint = document.getElementById('scroll-hint');
            const touchHint = document.getElementById('touch-hint');
            if (scrollHint) {
                scrollHint.classList.add('fade-out');
                setTimeout(() => scrollHint.classList.add('hidden'), 700);
            }
            if (touchHint) {
                touchHint.classList.add('fade-out');
                setTimeout(() => touchHint.classList.add('hidden'), 700);
            }
        }
    }

    openStudentProfile(id) {
        const modal = document.getElementById('student-profile-modal');
        const img = document.getElementById('modal-student-img');
        const nameNode = document.getElementById('modal-student-name');
        const descNode = document.getElementById('modal-student-desc');

        const info = this.studentsInfo[id] || { name: `SQUAD_MEMBER_${id}`, linkedin: '', github: '' };

        // Use typewriter for name
        this.typewriterEffect(nameNode, info.name || `SQUAD_MEMBER_${id}`, 70);

        // Use typewriter for description (if text exists)
        if (descNode) {
            const defaultDesc = "Passionate developer exploring the frontiers of technology and contributing to the Squad 139 cosmic journey.";
            this.typewriterEffect(descNode, defaultDesc, 45);
        }

        img.src = `assets/student${id}.jpg`;
        img.onerror = () => { img.src = this.generateAvatar(id, '#00f2ff'); };

        // Populate modal action icon links
        const ghBtn = modal.querySelector('#modal-github');
        const lnBtn = modal.querySelector('#modal-linkedin');
        if (ghBtn) {
            if (info.github) {
                ghBtn.href = info.github;
                ghBtn.title = 'View GitHub';
                ghBtn.style.opacity = '';
                ghBtn.style.pointerEvents = 'auto';
            } else {
                ghBtn.href = '#';
                ghBtn.title = 'No GitHub provided';
                ghBtn.style.opacity = '0.45';
                ghBtn.style.pointerEvents = 'none';
            }
        }
        if (lnBtn) {
            if (info.linkedin) {
                lnBtn.href = info.linkedin;
                lnBtn.title = 'View LinkedIn';
                lnBtn.style.opacity = '';
                lnBtn.style.pointerEvents = 'auto';
            } else {
                lnBtn.href = '#';
                lnBtn.title = 'No LinkedIn provided';
                lnBtn.style.opacity = '0.45';
                lnBtn.style.pointerEvents = 'none';
            }
        }
        modal.classList.remove('hidden');
        gsap.fromTo(".modal-container",
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }
}

// Start Main App
new CosmicJourney();
