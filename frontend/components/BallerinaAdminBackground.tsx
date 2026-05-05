"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Torus, Line } from "@react-three/drei";
import * as THREE from "three";

// Brand colors – elegant, muted
const BRAND_DARK = "#4a2c6d";
const BRAND_PINK = "#e84393";
const BRAND_PURPLE = "#9b59b6";
const RIBBON_COLOR = "#f5a9d0";

// Graceful ribbon (curve + tube)
function Ribbon() {
  const curve = useMemo(() => {
    const points = [];
    for (let t = 0; t <= 1; t += 0.02) {
      const angle = t * Math.PI * 2;
      const x = Math.sin(angle * 2) * 1.2;
      const y = Math.cos(angle * 1.3) * 0.8;
      const z = Math.sin(angle) * 1.5;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 200, 0.06, 6, true), [curve]);

  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} geometry={tubeGeometry}>
      <meshStandardMaterial color={RIBBON_COLOR} emissive={BRAND_PINK} emissiveIntensity={0.2} roughness={0.4} metalness={0.1} transparent opacity={0.7} />
    </mesh>
  );
}

// Floating "tutu" rings
function TutuRings() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.003;
  });
  return (
    <group ref={groupRef} position={[0, 0.5, -0.5]}>
      {[0.9, 1.1, 1.3].map((radius, i) => (
        <Torus key={i} args={[radius, 0.05, 64, 200]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={i === 1 ? BRAND_PINK : BRAND_PURPLE} emissive={BRAND_PINK} emissiveIntensity={0.15} transparent opacity={0.5} />
        </Torus>
      ))}
    </group>
  );
}

// Floating "stars" (stage light particles)
function StageLights() {
  const count = 800;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i*3] = (Math.random() - 0.5) * 12;
      arr[i*3+1] = (Math.random() - 0.5) * 8;
      arr[i*3+2] = (Math.random() - 0.5) * 8 - 3;
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#fce4ec" size={0.04} transparent opacity={0.4} />
    </points>
  );
}

export default function BallerinaAdminBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 3, 5]} intensity={0.8} color={BRAND_PINK} />
        <pointLight position={[-3, 2, 4]} intensity={0.6} color={BRAND_PURPLE} />
        <spotLight position={[0, 3, 2]} intensity={0.5} angle={0.6} penumbra={0.5} color="#fce4ec" />
        <Ribbon />
        <TutuRings />
        <StageLights />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
    </div>
  );
}