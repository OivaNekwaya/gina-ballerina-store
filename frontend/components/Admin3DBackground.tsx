"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ── Palette ────────────────────────────────────────────────────────────────
const HOT_PINK   = "#ec4899";
const ROSE       = "#f43f5e";
const BLUSH      = "#fda4af";
const GOLD       = "#fbbf24";
const SOFT_WHITE = "#ffe4f0";

// ── Spinning torus knot in rose-gold ─────────────────────────────────────
function RoseKnot() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.0015;
    ref.current.rotation.x += 0.0008;
  });
  return (
    <mesh ref={ref} position={[-1.4, 0.3, 0]}>
      <torusKnotGeometry args={[0.75, 0.1, 220, 32, 2, 5]} />
      <meshStandardMaterial
        color={HOT_PINK}
        emissive={ROSE}
        emissiveIntensity={0.35}
        roughness={0.15}
        metalness={0.85}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

// ── Floating gem / diamond (octahedron) ──────────────────────────────────
function GemDiamond({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.003 + Math.random() * 0.003, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y += speed;
    ref.current.rotation.z += speed * 0.5;
    // gentle bob
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.6 + position[0]) * 0.12;
  });
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.22, 0]} />
      <meshStandardMaterial
        color={GOLD}
        emissive={GOLD}
        emissiveIntensity={0.4}
        roughness={0.05}
        metalness={0.95}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// ── Wireframe sphere ──────────────────────────────────────────────────────
function GlowSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.004;
    ref.current.rotation.x += 0.002;
  });
  return (
    <mesh ref={ref} position={[1.8, -0.5, -0.5]}>
      <sphereGeometry args={[0.65, 28, 20]} />
      <meshStandardMaterial
        color={BLUSH}
        emissive={HOT_PINK}
        emissiveIntensity={0.25}
        wireframe
        transparent
        opacity={0.45}
      />
    </mesh>
  );
}

// ── Orbiting rings (two tilted tori) ─────────────────────────────────────
function BlossomRings() {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.005;
  });
  return (
    <group ref={group} position={[0, 0.4, -0.4]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.04, 64, 200]} />
        <meshStandardMaterial color={HOT_PINK} emissive={HOT_PINK} emissiveIntensity={0.3} transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 5, 0]}>
        <torusGeometry args={[1.4, 0.03, 64, 200]} />
        <meshStandardMaterial color={BLUSH} emissive={ROSE} emissiveIntensity={0.2} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 6, -Math.PI / 3, Math.PI / 8]}>
        <torusGeometry args={[0.9, 0.025, 64, 200]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.2} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// ── Pink sparkle / star field ─────────────────────────────────────────────
function SparkleField() {
  const count = 1400;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color(HOT_PINK),
      new THREE.Color(BLUSH),
      new THREE.Color(GOLD),
      new THREE.Color(SOFT_WHITE),
      new THREE.Color(ROSE),
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 32;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 5;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.055} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// ── Small scattered heart-ish spheres ─────────────────────────────────────
function FloatingOrbs() {
  const orbs: [number, number, number][] = [
    [2.5, 1.2, -1],
    [-2.2, -1.0, -0.5],
    [0.6, 1.8, -1.2],
    [-0.8, -1.6, 0.5],
    [2.0, -1.4, 0.8],
  ];
  return (
    <>
      {orbs.map((pos, i) => (
        <FloatingOrb key={i} position={pos} index={i} />
      ))}
    </>
  );
}

function FloatingOrb({ position, index }: { position: [number, number, number]; index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.5 + index * 1.2) * 0.18;
  });
  const color = [HOT_PINK, BLUSH, GOLD, ROSE, SOFT_WHITE][index % 5];
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.08 + (index % 3) * 0.04, 16, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.1}
        metalness={0.7}
        transparent
        opacity={0.75}
      />
    </mesh>
  );
}

// ── Main export ───────────────────────────────────────────────────────────
export default function GirlyAdminBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.25} />
        <pointLight position={[5, 5, 5]}   intensity={1.2} color={HOT_PINK} />
        <pointLight position={[-4, 3, 4]}  intensity={0.8} color={BLUSH} />
        <pointLight position={[0, -3, 2]}  intensity={0.5} color={GOLD} />
        <RoseKnot />
        <GlowSphere />
        <BlossomRings />
        <SparkleField />
        <FloatingOrbs />
        <GemDiamond position={[ 2.2,  1.1,  0.2]} />
        <GemDiamond position={[-2.5, -0.8, -0.4]} />
        <GemDiamond position={[ 0.4,  1.9, -0.8]} />
        <GemDiamond position={[-1.8,  1.5,  0.6]} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
