import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Float, Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from './store'
import { students, mentors } from './data'

gsap.registerPlugin(ScrollTrigger)

// --- DATA for Real Solar System (Background) ---
const realPlanets = [
    { name: 'Mercury', color: '#A5A5A5', size: 0.4, distance: 8, speed: 4.1 },
    { name: 'Venus', color: '#E3BB76', size: 0.9, distance: 12, speed: 1.6 },
    { name: 'Earth', color: '#2233AA', size: 1.0, distance: 16, speed: 1 },
    { name: 'Mars', color: '#E27B58', size: 0.5, distance: 20, speed: 0.5 },
    { name: 'Jupiter', color: '#C88B3A', size: 2.5, distance: 30, speed: 0.08, texture: 'gas' },
    { name: 'Saturn', color: '#C5AB6E', size: 2.0, distance: 40, speed: 0.03, texture: 'gas', ring: { inner: 3, outer: 4.5, color: '#C5AB6E' } },
    { name: 'Uranus', color: '#4FD0E7', size: 1.5, distance: 50, speed: 0.01, texture: 'ice' },
    { name: 'Neptune', color: '#4b70dd', size: 1.4, distance: 60, speed: 0.006, texture: 'ice' }
]

// --- SHADERS ---

// NOISE FUNCTIONS (Perlin/Simplex would be here, utilizing a simple pseudo-noise for brevity but effect)
const noiseChunk = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1 + 1.0 * C.xxx;
  //   x2 = x0 - i2 + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}
`

const uberPlanetVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const uberPlanetFragmentShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform int uType; // 0: Gas, 1: Ice, 2: Volcanic, 3: Terrestrial, 4: Nebula
uniform vec3 uViewVector;

${noiseChunk}

void main() {
  vec3 viewDir = normalize(uViewVector);
  float fresnel = pow(1.0 - dot(vNormal, viewDir), 2.5);
  vec3 color = uColor1;
  
  // Noise scales
  float n1 = snoise(vPosition * 2.0 + uTime * 0.05);
  float n2 = snoise(vPosition * 5.0 - uTime * 0.02);
  
  if (uType == 0) { // GAS GIANT
      // Banded structure
      float bands = sin(vPosition.y * 10.0 + n1 * 2.0);
      float mixFactor = smoothstep(-0.5, 0.5, bands);
      color = mix(uColor1, uColor2, mixFactor);
      // Storms
      float storm = smoothstep(0.6, 1.0, n2);
      color = mix(color, uColor3, storm);
  } else if (uType == 1) { // ICE WORLD
      // Crystalline / Faceted look
      float facets = abs(n2);
      color = mix(uColor1, uColor2, facets);
      fresnel *= 2.0; // Extra shiny
  } else if (uType == 2) { // VOLCANIC
      // Cracks and Lava
      float crust = n1;
      float lava = smoothstep(0.3, 0.35, abs(n2));  // Sharp cracks
      color = mix(uColor3, uColor1, lava); // Magma in cracks (uColor3 is glow)
      // Pulsing lava
      if (lava < 0.5) {
          color += uColor3 * (sin(uTime * 2.0) * 0.5 + 0.5) * 2.0;
      }
  } else if (uType == 3) { // TERRESTRIAL
      // Continents vs Ocean
      float land = smoothstep(0.1, 0.2, n1);
      color = mix(uColor2, uColor1, land); // Ocean (2) -> Land (1)
      // Clouds
      float clouds = smoothstep(0.4, 0.6, snoise(vPosition * 4.0 + uTime * 0.1));
      color = mix(color, vec3(1.0), clouds * 0.8);
  } else { // NEBULA / ETHEREAL
      // Swirling gas
      float nebula = snoise(vPosition * 3.0 + uTime * 0.1);
      color = mix(uColor1, uColor2, nebula);
      fresnel += 0.5; 
  }

  // Atmos glow
  color += uColor2 * fresnel * 0.5;

  gl_FragColor = vec4(color, 1.0);
}
`

// Simple Sun Shader (Mentors)
const sunVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
const sunFragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform vec3 uColor;
${noiseChunk}

void main() {
  float n = snoise(vPosition * 2.0 + uTime * 0.5);
  vec3 color = uColor * (0.8 + n * 0.4);
  float glow = 1.0 - dot(normalize(vPosition), vec3(0.0, 0.0, 1.0));
  color += vec3(glow * 0.5);
  gl_FragColor = vec4(color, 1.0);
}
`

// --- COMPONENTS ---

// 1. The Sun (Mentors)
function Sun() {
    const mesh = useRef()

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.y += 0.002
            mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime()
        }
    })

    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('#ffaa00') }
        },
        vertexShader: sunVertexShader,
        fragmentShader: sunFragmentShader,
        transparent: true
    }), [])

    return (
        <mesh ref={mesh} position={[0, 0, 0]}>
            <sphereGeometry args={[4, 64, 64]} />
            <primitive object={material} attach="material" />
            <pointLight intensity={2} color="#ffaa00" distance={100} decay={2} />
            <Html position={[0, 5, 0]} center>
                <div style={{ color: '#ffaa00', fontFamily: 'monospace', textAlign: 'center', pointerEvents: 'none' }}>
                    <h1 style={{ fontSize: '2rem', textTransform: 'uppercase', textShadow: '0 0 10px #ffaa00' }}>The Mentors</h1>
                    <p>Guiding Light of the System</p>
                </div>
            </Html>
        </mesh>
    )
}

// 2. Individual Planet (Student)
function Planet({ data, position, curveProgress }) {
    const mesh = useRef()
    const { camera } = useThree()
    const [hovered, setHovered] = React.useState(false)
    const activePlanet = useStore(state => state.activePlanet)
    const setActivePlanet = useStore(state => state.setActivePlanet)
    const scrollProgress = useStore(state => state.scrollProgress)

    const isVisible = Math.abs(scrollProgress - curveProgress) < 0.02

    // Convert visual type string to integer for shader
    const typeInt = useMemo(() => {
        const map = { 'GAS_GIANT': 0, 'ICE_WORLD': 1, 'VOLCANIC': 2, 'TERRESTRIAL': 3, 'NEBULA': 4 }
        return map[data.visual.type] || 0
    }, [data.visual.type])

    // Memoize material to avoid recreation
    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color(data.visual.colors[0]) },
            uColor2: { value: new THREE.Color(data.visual.colors[1]) },
            uColor3: { value: new THREE.Color(data.visual.colors[2] || '#ffffff') },
            uType: { value: typeInt },
            uViewVector: { value: new THREE.Vector3(0, 0, 1) }
        },
        vertexShader: uberPlanetVertexShader,
        fragmentShader: uberPlanetFragmentShader
    }), [data.visual, typeInt])

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.y += 0.005
            // Update uniforms
            mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime()
            mesh.current.material.uniforms.uViewVector.value = new THREE.Vector3().subVectors(camera.position, mesh.current.position).normalize()
        }

        if (isVisible && activePlanet?.id !== data.id) {
            setActivePlanet(data)
        }
    })

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh
                    ref={mesh}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    <sphereGeometry args={[0.8, 64, 64]} />
                    <primitive object={material} attach="material" />
                </mesh>
            </Float>

            {isVisible && (
                <Html distanceFactor={15} transform position={[2, 0, 0]}>
                    <div className="glass-panel">
                        <h3>{data.name}</h3>
                        <p className="role">{data.role}</p>
                        <div style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '0.5rem' }}>
                            Planet Type: {data.visual.type.replace('_', ' ')}
                        </div>
                        <button className="view-btn" onClick={() => window.open(data.github, '_blank')}>
                            View Work
                        </button>
                    </div>
                </Html>
            )}
        </group>
    )
}

// 2.5 Real Background Planets
// Re-using the simpler look or also using the uber shader? Let's keep them simple to save perf, or assume they are far away.
// Actually, let's just use standard material for background planets to distinguish them.
function RealPlanet({ data }) {
    const mesh = useRef()
    const group = useRef()

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        if (group.current) {
            group.current.rotation.y = time * data.speed * 0.1
        }
        if (mesh.current) {
            mesh.current.rotation.y += 0.01
        }
    })

    return (
        <group ref={group}>
            <group position={[data.distance, 0, 0]}>
                <mesh ref={mesh}>
                    <sphereGeometry args={[data.size, 32, 32]} />
                    <meshStandardMaterial color={data.color} roughness={0.7} metalness={0.2} />
                </mesh>

                {data.ring && (
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[data.ring.inner, data.ring.outer, 64]} />
                        <meshStandardMaterial color={data.ring.color} side={THREE.DoubleSide} transparent opacity={0.6} />
                    </mesh>
                )}
            </group>
        </group>
    )
}

function SolarSystem() {
    return (
        <group>
            {realPlanets.map((planet) => (
                <RealPlanet key={planet.name} data={planet} />
            ))}
        </group>
    )
}

// 3. Scene Controller
function Scene() {
    const { camera } = useThree()
    const setScrollProgress = useStore(state => state.setScrollProgress)

    const curve = useMemo(() => {
        const points = []
        for (let i = 0; i < 50; i++) {
            const t = i / 50
            const angle = t * Math.PI * 10
            const radius = 10 + t * 50
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            const y = Math.sin(t * Math.PI * 4) * 10
            points.push(new THREE.Vector3(x, y, z))
        }
        return new THREE.CatmullRomCurve3(points)
    }, [])

    React.useEffect(() => {
        const trigger = ScrollTrigger.create({
            trigger: "#scroll-content",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => {
                const p = self.progress
                setScrollProgress(p)
                const camPos = curve.getPointAt(p)
                const lookAtPos = curve.getPointAt(Math.min(p + 0.05, 1))
                camera.position.set(camPos.x, camPos.y + 2, camPos.z + 5)
                camera.lookAt(lookAtPos)
            }
        })
        return () => trigger.kill()
    }, [camera, curve, setScrollProgress])

    return (
        <>
            <ambientLight intensity={0.2} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sun />
            <SolarSystem />

            {students.map((student, i) => {
                const t = 0.1 + (i / students.length) * 0.8
                const pos = curve.getPointAt(t)
                return <Planet key={student.id} data={student} position={pos} curveProgress={t} />
            })}

            <line>
                <bufferGeometry setFromPoints={curve.getPoints(200)} />
                <lineBasicMaterial color="rgba(255,255,255,0.1)" transparent opacity={0.2} />
            </line>
        </>
    )
}

export default function Experience() {
    return (
        <Canvas>
            <color attach="background" args={['#010305']} />
            <fog attach="fog" args={['#010305', 5, 80]} />
            <Scene />
        </Canvas>
    )
}
