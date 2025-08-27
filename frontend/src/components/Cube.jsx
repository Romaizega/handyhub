import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function RotatingCube() {
  const cubeRef = useRef()

  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += 0.01
      cubeRef.current.rotation.x += 0.005
    }
  })

  return (
    <mesh ref={cubeRef} scale={2} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#181717ff"          // чисто чёрный
        roughness={0.3}         // чуть-чуть отражений
        metalness={0.8}         // лёгкий блеск
      />
    </mesh>
  )
}

