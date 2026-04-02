import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState, useMemo } from 'react'
import { OrbitControls, Float, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

function ExplodingCube() {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  const count = 5

  const particles = useMemo(() => {
    const temp = []
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        for (let z = 0; z < count; z++) {
          temp.push({
            x: (x - count / 2) * 0.42,
            y: (y - count / 2) * 0.42,
            z: (z - count / 2) * 0.42,
          })
        }
      }
    }
    return temp
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime()

    particles.forEach((p, i) => {
      const pulse = active ? 2.35 + Math.sin(time * 2.2) * 0.18 : 1

      dummy.position.set(p.x * pulse, p.y * pulse, p.z * pulse)
      dummy.rotation.x = time * 0.22
      dummy.rotation.y = time * 0.32

      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  const color = active ? '#ffffff' : hovered ? '#f8fbff' : '#dfe7f3'
  const emissive = active ? '#494750' : hovered ? '#15171893' : '#1e293b'
  const emissiveIntensity = active ? 1.35 : hovered ? 0.65 : 0.12

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, particles.length]}
      onClick={() => setActive((prev) => !prev)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.45, 0.45, 0.45]} />
      <meshStandardMaterial
        color={color}
        metalness={0.55}
        roughness={0.16}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </instancedMesh>
  )
}

export default function HeroWelcome() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05070f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.10),transparent_28%)]" />

      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '42px 42px',
          maskImage: 'radial-gradient(circle at center, black, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 85%)',
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2 md:px-10 lg:px-12">
        <div className="max-w-2xl text-center md:text-left">
          <div className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm">
            Smart platform for everyday services
          </div>

          <h1 className="font-serif text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            HandyHub
            <br />
            <span className="bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">
              for everyone
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400 sm:text-xl">
            Find trusted help, post jobs, and connect with professionals in one
            elegant place. Tap the cube and bring the experience to life.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Link
              to="/register"
              className="btn btn-outline rounded-full px-8 text-base text-white/90 border-white/20 hover:border-white/40 hover:bg-white/5"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="btn btn-outline rounded-full px-8 text-base text-white/90 border-white/20 hover:border-white/40 hover:bg-white/5"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 md:justify-start">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
              Easy onboarding
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
              Clean experience
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.9)]" />
              Modern interface
            </div>
          </div>
        </div>

        <div className="relative h-[420px] w-full cursor-pointer sm:h-[520px] md:h-[620px]">
          <div className="absolute inset-0 rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute right-[20%] top-[22%] h-28 w-28 rounded-full bg-sky-400/15 blur-3xl" />

          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[5.2, 5.2, 5.8]} fov={48} />

            <ambientLight intensity={1.15} />
            <directionalLight
              position={[6, 8, 5]}
              intensity={1.8}
              color="#ffffff"
              castShadow
            />
            <pointLight position={[8, 8, 8]} intensity={2.2} color="#ffffff" />
            <pointLight position={[-8, -4, 6]} intensity={1.4} color="#7dd3fc" />
            <pointLight position={[0, 3, -6]} intensity={1.2} color="#ffffff" />

            <Float speed={1.6} rotationIntensity={0.45} floatIntensity={1}>
              <ExplodingCube />
            </Float>

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={!false}
              autoRotateSpeed={1.3}
            />
          </Canvas>
        </div>
      </div>
    </section>
  )
}