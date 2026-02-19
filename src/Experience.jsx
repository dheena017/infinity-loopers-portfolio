import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Float, Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from './store'
import { students, mentors } from './data'

gsap.registerPlugin(ScrollTrigger)

// --- SHADERS ---
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

// Simple noise function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  float n = noise(vPosition.xy * 2.0 + uTime * 0.5);
  vec3 color = uColor * (0.8 + n * 0.4);
  // Add some glow
  float glow = 1.0 - dot(normalize(vPosition), vec3(0.0, 0.0, 1.0));
  color += vec3(glow * 0.5);
  gl_FragColor = vec4(color, 1.0);
}
`

const planetVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const planetFragmentShader = `
varying vec3 vNormal;
varying vec3 vPosition;
uniform vec3 uColor;
uniform vec3 uViewVector;

void main() {
  // Fresnel
  float fresnel = pow(1.0 - dot(vNormal, uViewVector), 3.0);
  vec3 color = mix(uColor, vec3(1.0), fresnel * 0.5);
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

    // Create a custom shader material
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

            {/* Mentor Labels */}
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

    // Check if this planet is "active" based on scroll progress match
    // We assume 35 planets spaced evenly from 0.1 to 0.9 along the curve
    // If scroll is near this planet's progress, show UI
    const isVisible = Math.abs(scrollProgress - curveProgress) < 0.02

    useFrame(() => {
        if (mesh.current) {
            mesh.current.rotation.y += 0.01
            // Simple fresnel update
            if (mesh.current.material.uniforms) {
                mesh.current.material.uniforms.uViewVector.value = new THREE.Vector3().subVectors(camera.position, mesh.current.position).normalize()
            }
        }

        if (isVisible && activePlanet?.id !== data.id) {
            setActivePlanet(data)
        } else if (!isVisible && activePlanet?.id === data.id) {
            // Don't clear immediately to prevent flickering, let next one take over
        }
    })

    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uColor: { value: new THREE.Color(data.color || Math.random() * 0xffffff) },
            uViewVector: { value: new THREE.Vector3(0, 0, 1) }
        },
        vertexShader: planetVertexShader,
        fragmentShader: planetFragmentShader
    }), [data.color])

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh
                    ref={mesh}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    <sphereGeometry args={[0.8, 32, 32]} />
                    <primitive object={material} attach="material" />
                </mesh>
            </Float>

            {/* UI Overlay */}
            {isVisible && (
                <Html distanceFactor={15} transform position={[2, 0, 0]}>
                    <div className="glass-panel">
                        <h3>{data.name}</h3>
                        <p className="role">{data.role}</p>
                        <button className="view-btn" onClick={() => window.open(data.github, '_blank')}>
                            View Work
                        </button>
                    </div>
                </Html>
            )}
        </group>
    )
}

// 3. Scene Controller
function Scene() {
    const { camera } = useThree()
    const setScrollProgress = useStore(state => state.setScrollProgress)

    // Create Path
    const curve = useMemo(() => {
        // Spiral Path
        const points = []
        for (let i = 0; i < 50; i++) {
            const t = i / 50
            const angle = t * Math.PI * 10 // 5 full turns
            const radius = 10 + t * 50 // Spiraling outward
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            const y = Math.sin(t * Math.PI * 4) * 10 // Waviness
            points.push(new THREE.Vector3(x, y, z))
        }
        return new THREE.CatmullRomCurve3(points)
    }, [])

    // Setup ScrollTrigger
    React.useEffect(() => {
        // Create a dummy element to scroll
        const trigger = ScrollTrigger.create({
            trigger: "#scroll-content",
            start: "top top",
            end: "bottom bottom",
            scrub: 1, // Smooth interaction
            onUpdate: (self) => {
                const p = self.progress
                setScrollProgress(p)

                // Move Camera
                const camPos = curve.getPointAt(p)
                const lookAtPos = curve.getPointAt(Math.min(p + 0.05, 1))

                camera.position.set(camPos.x, camPos.y + 2, camPos.z + 5) // Offset
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

            {/* Render Planets along the curve */}
            {students.map((student, i) => {
                // Map student to a point on the curve (skipping the beginning 10% which is sun)
                const t = 0.1 + (i / students.length) * 0.8
                const pos = curve.getPointAt(t)
                return <Planet key={student.id} data={student} position={pos} curveProgress={t} />
            })}

            {/* Debug Path Line (Optional) */}
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
