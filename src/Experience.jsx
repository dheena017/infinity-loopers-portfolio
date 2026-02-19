import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Html, Text, Float } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mentors, students, coreTeam } from './data'

gsap.registerPlugin(ScrollTrigger)

// --- UTILS & SHADERS ---

const galaxyVertexShader = `
    attribute float size;
    attribute vec3 customColor;
    varying vec3 vColor;
    void main() {
        vColor = customColor;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`

const galaxyFragmentShader = `
    varying vec3 vColor;
    void main() {
        float r = distance(gl_PointCoord, vec2(0.5));
        if (r > 0.5) discard;
        float strength = 1.0 - (r * 2.0);
        strength = pow(strength, 3.0);
        gl_FragColor = vec4(vColor, strength);
    }
`

// --- COMPONENT: STAR FIELD ---
function DeepSpace() {
    return (
        <>
            <color attach="background" args={['#000000']} />
            <Stars radius={300} depth={50} count={10000} factor={4} saturation={0} fade speed={0.5} />
            <fog attach="fog" args={['#000000', 20, 100]} />
        </>
    )
}

// --- COMPONENT: ENTRY PLANET ---
function EntrySection() {
    return (
        <group position={[0, 0, -10]}>
            <mesh position={[0, 0, -20]}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    color="#4444ff"
                    emissive="#111144"
                    roughness={0.8}
                />
            </mesh>
            <Html center position={[0, 0, 0]} zIndexRange={[100, 0]}>
                <div className="entry-title">
                    <h1>Infinity Loopers</h1>
                    <p>Squad 139</p>
                    <button className="enter-btn" onClick={() => {
                        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
                    }}>
                        Enter System
                    </button>
                </div>
            </Html>
        </group>
    )
}

// --- COMPONENT: MENTOR PLANET ---
function MentorPlanet({ data, zPosition, positionX, alignLeft }) {
    const mesh = useRef()
    const group = useRef()

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.y += delta * 0.2
        }
    })

    return (
        <group ref={group} position={[positionX, 0, zPosition]}>
            <mesh ref={mesh}>
                <sphereGeometry args={[3, 64, 64]} />
                <meshStandardMaterial
                    color={data.colors ? data.colors[0] : '#fff'}
                    roughness={0.7}
                    metalness={0.2}
                    emissive={data.colors ? data.colors[1] : '#000'}
                    emissiveIntensity={0.2}
                />
            </mesh>
            <mesh scale={[1.2, 1.2, 1.2]}>
                <sphereGeometry args={[3, 32, 32]} />
                <meshBasicMaterial
                    color={data.colors ? data.colors[0] : '#fff'}
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </mesh>
            <mesh position={[alignLeft ? 4 : -4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.05, 0.05, 8, 8]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
            </mesh>
            <Html
                position={[alignLeft ? 9 : -9, 0, 0]}
                center
                transform
                distanceFactor={15}
                zIndexRange={[100, 0]}
            >
                <div className="mentor-panel" style={{
                    textAlign: alignLeft ? 'left' : 'right',
                    alignItems: alignLeft ? 'flex-start' : 'flex-end',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h2>{data.name}</h2>
                    <span className="role">{data.role}</span>
                    <p style={{ fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '1rem', color: '#ccc' }}>
                        {data.description}
                    </p>
                    <div className="mentor-links">
                        <a href={data.github} target="_blank">GH</a>
                        <a href={data.linkedin} target="_blank">LI</a>
                    </div>
                </div>
            </Html>
        </group>
    )
}

// --- COMPONENT: STUDENT SPIRAL ---
// Replacing "StudentSun" with a sequential spiral
function StudentSpiral({ startZ }) {
    const sunRef = useRef()

    useFrame((state, delta) => {
        if (sunRef.current) {
            sunRef.current.rotation.y += delta * 0.1
        }
    })

    return (
        <group>
            {/* The Sun at startZ */}
            <group position={[0, 0, startZ]}>
                <Text
                    position={[0, 12, 0]}
                    fontSize={4}
                    font="https://fonts.gstatic.com/s/orbitron/v25/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nygyU.woff"
                    color="#ffaa00"
                    anchorX="center"
                    anchorY="middle"
                >
                    FOLKS
                </Text>
                <mesh ref={sunRef}>
                    <sphereGeometry args={[6, 64, 64]} />
                    <meshBasicMaterial color="#ffaa00" toneMapped={false} />
                </mesh>
                <pointLight intensity={2} color="#ffaa00" distance={100} />
                <mesh scale={[1.1, 1.1, 1.1]}>
                    <sphereGeometry args={[6, 32, 32]} />
                    <meshBasicMaterial color="#ff4400" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
                </mesh>
            </group>

            {/* The 33 Students in a Spiral from startZ onwards */}
            {students.map((student, i) => {
                const spacing = 8 // Distance between each student along Z
                const z = startZ - 15 - (i * spacing) // Start a bit after the sun

                // Spiral Math
                const angle = i * 0.5 // Radians step per student
                const radius = 10
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                    <group key={student.id} position={[x, y, z]}>
                        {/* Connecting line to center axis (optional, maybe distracting) */}
                        {/* Let's just have the node */}

                        {/* Student Node */}
                        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                            <mesh>
                                <sphereGeometry args={[0.5, 32, 32]} />
                                <meshStandardMaterial
                                    color={student.visual?.colors?.[0] || '#ccc'}
                                    emissive={student.visual?.colors?.[1] || '#fff'}
                                    emissiveIntensity={0.5}
                                />
                            </mesh>
                        </Float>

                        <Html center transform distanceFactor={15}>
                            <div className="student-circle-container">
                                <div
                                    className="student-photo"
                                    style={{
                                        backgroundColor: student.visual?.colors?.[0] || '#ccc',
                                        borderColor: student.visual?.colors?.[1] || '#fff'
                                    }}
                                />
                                <div className="student-name">{student.name}</div>
                            </div>
                        </Html>
                    </group>
                )
            })}
        </group>
    )
}

// --- COMPONENT: GALAXY CORE ---
function GalaxyCore({ data, position, variant }) {
    const pointsRef = useRef()

    const particles = useMemo(() => {
        const count = 2000
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)

        const coreColor = new THREE.Color(data.colors[0])
        const outerColor = new THREE.Color(data.colors[1])

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const radius = Math.random() * 8 + 1
            const branchAngle = (i % 3) / 3 * Math.PI * 2
            const spinAngle = radius * 0.8

            const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5
            const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5
            const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
            positions[i3 + 1] = Math.sin(branchAngle + spinAngle) * radius + randomY
            positions[i3 + 2] = randomZ * 2

            const mixedColor = coreColor.clone().lerp(outerColor, radius / 9)

            colors[i3] = mixedColor.r
            colors[i3 + 1] = mixedColor.g
            colors[i3 + 2] = mixedColor.b

            sizes[i] = Math.random() * 3
        }

        return { positions, colors, sizes }
    }, [data])

    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.z += delta * 0.05
        }
    })

    const isLeft = variant % 2 === 0

    return (
        <group position={position}>
            <points ref={pointsRef} position={[isLeft ? -10 : 10, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={particles.positions.length / 3} array={particles.positions} itemSize={3} />
                    <bufferAttribute attach="attributes-customColor" count={particles.colors.length / 3} array={particles.colors} itemSize={3} />
                    <bufferAttribute attach="attributes-size" count={particles.sizes.length} array={particles.sizes} itemSize={1} />
                </bufferGeometry>
                <shaderMaterial
                    vertexShader={galaxyVertexShader}
                    fragmentShader={galaxyFragmentShader}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    transparent
                />
            </points>
            <Html
                position={[isLeft ? 5 : -5, 0, 0]}
                center
                transform
                distanceFactor={15}
            >
                <div className="core-panel" style={{
                    borderLeft: isLeft ? '4px solid white' : 'none',
                    borderRight: !isLeft ? '4px solid white' : 'none'
                }}>
                    <div className="core-profile-layout" style={{ flexDirection: isLeft ? 'row' : 'row-reverse' }}>
                        <img
                            src={data.photo}
                            className="core-photo"
                            style={{ margin: 0 }} /* Reset margin handled by gap in flex */
                        />
                        <div className="core-info" style={{ textAlign: isLeft ? 'left' : 'right' }}>
                            <h2>{data.name}</h2>
                            <h4 style={{ color: '#aaa', marginTop: 0 }}>{data.role}</h4>
                            <p>{data.description}</p>

                            <div className="social-links" style={{ justifyContent: isLeft ? 'flex-start' : 'flex-end' }}>
                                <a href={data.github} target="_blank" className="social-icon">GitHub</a>
                                <a href={data.linkedin} target="_blank" className="social-icon">LinkedIn</a>
                            </div>
                        </div>
                    </div>
                </div>
            </Html>

        </group>
    )
}

// --- MAIN SCENE ---
function Scene() {
    const { camera } = useThree()
    const timeline = useRef()

    useEffect(() => {
        // Reset Logic
        camera.position.set(0, 0, 10)
        camera.lookAt(0, 0, -100)

        // Calculate distances
        // Sun starts at -110.
        // Students start at -125.
        // 33 students * 8 spacing = 264 units length.
        // Students end at -125 - 264 = -389.

        const core1Z = -420
        const coreSpacing = 30
        const endZ = core1Z - (3 * coreSpacing) - 20 // Approx -530

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#scroll-content",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        })
        timeline.current = tl;

        // SEQUENCE

        // 1. Enter -> M1 (-20)
        tl.to(camera.position, { z: -15, duration: 2, ease: "none" })
        // 2. Mentors (-40, -60, -80)
        tl.to(camera.position, { z: -75, duration: 6, ease: "none" })
        // 3. Sun (-110) - Stop a bit before
        tl.to(camera.position, { z: -95, duration: 2, ease: "power1.inOut" })

        // 4. Student Tunnel
        // Traverse the entire length of the student spiral
        // Start: -95 -> End of spiral approx -390
        // We want to fly through slowly so user sees names
        tl.to(camera.position, { z: -400, duration: 20, ease: "linear" }) // Long duration for 33 items

        // 5. Core 1 (-420) -> Stop at -405
        tl.to(camera.position, { z: core1Z + 15, duration: 3, ease: "power1.inOut" })

        // 6. Core 2 (-450) -> Stop at -435
        tl.to(camera.position, { z: (core1Z - coreSpacing) + 15, duration: 3, ease: "linear" })

        // 7. Core 3 (-480) -> Stop at -465
        tl.to(camera.position, { z: (core1Z - coreSpacing * 2) + 15, duration: 3, ease: "linear" })

        // 8. Core 4 (-510) -> Stop at -495
        tl.to(camera.position, { z: (core1Z - coreSpacing * 3) + 15, duration: 3, ease: "linear" })

        // 9. END
        tl.to(camera.position, { z: endZ, duration: 4, ease: "power2.out" })

    }, [camera])

    return (
        <>
            <DeepSpace />
            <ambientLight intensity={0.1} />

            <EntrySection />

            {mentors.map((mentor, i) => {
                const z = -20 - (i * 20)
                const isLeft = i % 2 === 0
                return <MentorPlanet key={mentor.id} data={mentor} zPosition={z} positionX={isLeft ? -5 : 5} alignLeft={isLeft} />
            })}

            {/* Replaced StudentSun with StudentSpiral */}
            <StudentSpiral startZ={-110} />

            {/* Core Team pushed back to fit students */}
            {coreTeam.map((member, i) => {
                const z = -420 - (i * 30) // Starts deeper now
                return <GalaxyCore key={member.id} data={member} position={[0, 0, z]} variant={i} />
            })}

            <Html position={[0, 0, -530]} center transform>
                <div style={{ textAlign: 'center', width: '100vw' }}>
                    <h1 className="end-text">End of the Loop</h1>
                    <p style={{ color: '#555' }}>Infinity Loopers</p>
                </div>
            </Html>
        </>
    )
}

export default function Experience() {
    return (
        <Canvas gl={{ antialias: true }} camera={{ fov: 45, near: 0.1, far: 800 }}>
            {/* Increased Far plane to see far objects */}
            <Scene />
        </Canvas>
    )
}
