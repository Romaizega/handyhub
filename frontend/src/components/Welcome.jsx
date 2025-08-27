import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls } from '@react-three/drei'

// 🎲 Куб с лёгким свечением и улучшенным визуалом
function RotatingCube() {
  const cubeRef = useRef()

  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01
      cubeRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={cubeRef} scale={2}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#1c1d1dff" // тёмно-синий
        metalness={0.8}
        roughness={0.2}
        emissive="#3d3d3eff" // светлый оттенок (эмиссия)
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

export default function HeroWelcome() {
  return (
    <section
      className="relative text-white min-h-screen w-full overflow-hidden"
      style={{
        backgroundColor: '#0c0c0d',
        backgroundImage: `
          radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.02), transparent 70%),
          url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0H0V40H40V0Z' stroke='white' stroke-opacity='0.05'/%3E%3C/svg%3E")
        `,
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-7xl px-6 py-24 mx-auto">
        {/* Text */}
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-bold font-serif leading-tight">
            HandyHub for<br /> everyone
          </h1>
          <p className="text-lg text-gray-400 mt-4">
            The best way to get a quality job
          </p>
          <div className="mt-6 flex gap-4 justify-center md:justify-start">
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-black rounded-md font-semibold shadow hover:bg-gray-200 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="text-white text-sm hover:underline mt-2 md:mt-0"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Canvas с кубом */}
        <div className="w-full h-[900px] md:h-[800px]">
          <Canvas camera={{ position: [2.5, 2.5, 4], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <RotatingCube />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
          </Canvas>
        </div>
      </div>
    </section>
  )
}
