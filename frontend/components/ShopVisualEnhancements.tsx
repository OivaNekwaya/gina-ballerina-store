"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/* =========================
   3D ELEMENTS
========================= */

// ----- Wireframe Grid -----
function WireframeGrid() {
  const points = [];
  const size = 3;
  const divisions = 20;
  const step = size / divisions;

  for (let i = -size / 2; i <= size / 2; i += step) {
    points.push([i, -1.5, -size / 2], [i, -1.5, size / 2]);
    points.push([-size / 2, -1.5, i], [size / 2, -1.5, i]);
  }

  return (
    <group>
      {points.map((p, i) => (
        <Line
          key={i}
          points={[
            new THREE.Vector3(p[0], p[1], p[2]),
            new THREE.Vector3(p[3], p[4], p[5]),
          ]}
          color="#c084fc"
          lineWidth={1}
          transparent
          opacity={0.2}
        />
      ))}
    </group>
  );
}

// ----- Floating Rings -----
function FloatingRings() {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
      ref.current.rotation.x += 0.001;
    }
  });

  return (
    <group ref={ref}>
      {[0, 60, 120].map((angle, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, angle * Math.PI / 180]}>
          <torusGeometry args={[1.2, 0.03, 64, 200]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#f472b6"
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

// ----- Glow Core -----
function GlowCore() {
  return (
    <mesh>
      <sphereGeometry args={[0.6, 64, 64]} />
      <meshBasicMaterial color="#a855f7" transparent opacity={0.15} />
    </mesh>
  );
}

// ----- Particles -----
function Particles() {
  const ref = useRef<THREE.Points>(null);

  const count = 1000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#c084fc"
        transparent
        opacity={0.6}
      />
    </points>
  );
}

// ----- Pulsing Light -----
function PulsingLight() {
  const ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.intensity = 1 + Math.sin(clock.elapsedTime * 2) * 0.3;
    }
  });

  return <pointLight ref={ref} position={[0, 0, 2]} color="#f472b6" />;
}

// ----- Camera Parallax -----
function CameraParallax() {
  useFrame(({ mouse, camera }) => {
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ----- Main Scene -----
function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
      <ambientLight intensity={0.4} />

      <PulsingLight />
      <GlowCore />
      <Particles />
      <WireframeGrid />
      <FloatingRings />
      <CameraParallax />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.2}
      />
    </Canvas>
  );
}

/* =========================
   UI / CSS LAYERS
========================= */

// Floating shapes
const GeometricShapes = () => {
  return (
    <>
      <div className="absolute w-32 h-32 bg-purple-200/5 blur-2xl rotate-12 top-[20%] left-[5%] animate-float" />
      <div className="absolute w-48 h-48 bg-pink-200/5 rounded-full blur-2xl top-[40%] right-[5%] animate-float delay-1000" />
      <div className="absolute w-24 h-24 bg-purple-300/5 rotate-45 bottom-[15%] left-[15%] animate-float" />
    </>
  );
};

// Gradient overlay
const MovingGradient = () => (
  <div className="fixed inset-0 -z-20 opacity-30">
    <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-purple-100/20 animate-gradient" />
  </div>
);

// Radial glow
const RadialGlow = () => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)]" />
  </div>
);

/* =========================
   MAIN EXPORT
========================= */

export default function ShopVisualEnhancements() {
  return (
    <>
      {/* 3D Scene */}
      <div className="fixed inset-0 -z-10">
        <Scene />
      </div>

      {/* UI Layers */}
      <GeometricShapes />
      <MovingGradient />
      <RadialGlow />

      {/* Animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-float {
          animation: float 18s infinite ease-in-out;
        }

        .animate-gradient {
          animation: gradient 10s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </>
  );
}