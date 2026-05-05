"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Your brand colors
const BRAND_PINK = "#e84393";
const BRAND_PURPLE = "#9b59b6";
const BRAND_PINK_GLOW = "#f06292";
const BRAND_PURPLE_GLOW = "#b37bcd";

// Rotating heart (torus knot)
function FloatingHeart() {
  const groupRef = useRef<THREE.Group>(null); // ✅ FIXED: use Group, not Mesh
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
    }
  });
  return (
    <group ref={groupRef} position={[-1.5, 0.5, 0]}>
      <mesh>
        <torusKnotGeometry args={[0.6, 0.15, 100, 16, 3, 4]} />
        <meshStandardMaterial color={BRAND_PINK} emissive={BRAND_PINK_GLOW} emissiveIntensity={0.4} roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

// Floating gem (icosahedron)
function FloatingGem() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x += 0.002;
    }
  });
  return (
    <mesh ref={meshRef} position={[1.8, -0.3, -0.5]}>
      <icosahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial color={BRAND_PURPLE} emissive={BRAND_PURPLE_GLOW} emissiveIntensity={0.3} roughness={0.1} metalness={0.9} transparent opacity={0.8} />
    </mesh>
  );
}

// Floating pearls (small spheres)
function FloatingPearls() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });
  const positions = [
    [-2, 1.2, -1], [2, -0.5, -1.5], [0, -1, -2], [1, 1.5, -1.2], [-1, -1.2, -1.8]
  ];
  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={new THREE.Vector3(pos[0], pos[1], pos[2])}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#fbcfe8" emissive={BRAND_PINK_GLOW} emissiveIntensity={0.2} roughness={0.1} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// Sparkle particles
function SparkleField() {
  const count = 800;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i*3] = (Math.random() - 0.5) * 12;
    positions[i*3+1] = (Math.random() - 0.5) * 8;
    positions[i*3+2] = (Math.random() - 0.5) * 8 - 2;
  }
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#fbcfe8" size={0.04} transparent opacity={0.6} />
    </points>
  );
}

// Main 3D scene
export default function Admin3DBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 3, 3]} intensity={0.8} color={BRAND_PINK} />
        <pointLight position={[-2, 1, 4]} intensity={0.6} color={BRAND_PURPLE} />
        <FloatingHeart />
        <FloatingGem />
        <FloatingPearls />
        <SparkleField />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}