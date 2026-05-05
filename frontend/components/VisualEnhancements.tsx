"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { TorusKnot, Icosahedron, Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ----- 3D Object 1: Main Torus Knot (pink/purple) -----
function TorusKnotModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
    }
  });
  return (
    <TorusKnot ref={meshRef} args={[1.2, 0.25, 128, 16, 3, 4]} position={[-1.5, 0.5, 0]}>
      <meshStandardMaterial color="#ec4899" emissive="#a855f7" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} transparent opacity={0.4} />
    </TorusKnot>
  );
}

// ----- 3D Object 2: Icosahedron (glowing) -----
function IcosahedronModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.004;
  });
  return (
    <Icosahedron ref={meshRef} args={[0.8, 0]} position={[1.8, -0.2, 0]}>
      <meshStandardMaterial color="#d8b4fe" emissive="#c084fc" emissiveIntensity={0.6} roughness={0.4} metalness={0.2} wireframe transparent opacity={0.5} />
    </Icosahedron>
  );
}

// ----- 3D Object 3: Floating ring (donut) -----
function RingModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.z += 0.005;
  });
  return (
    <TorusKnot ref={meshRef} args={[0.9, 0.08, 64, 8, 2, 3]} position={[0, -1, -0.5]}>
      <meshStandardMaterial color="#f472b6" emissive="#f0abfc" emissiveIntensity={0.3} roughness={0.1} metalness={0.9} transparent opacity={0.6} />
    </TorusKnot>
  );
}

// ----- Particle field (tiny dots) -----
function ParticleField() {
  const count = 600;
  const positions = useRef<Float32Array>(new Float32Array(count * 3));
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      positions.current[i*3] = (Math.random() - 0.5) * 12;
      positions.current[i*3+1] = (Math.random() - 0.5) * 8;
      positions.current[i*3+2] = (Math.random() - 0.5) * 6 - 2;
    }
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c084fc" size={0.03} transparent opacity={0.4} />
    </points>
  );
}

// ----- Main 3D scene -----
function ThreeDScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 2, 4]} color="#ec4899" intensity={0.5} />
      <TorusKnotModel />
      <IcosahedronModel />
      <RingModel />
      <ParticleField />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
    </Canvas>
  );
}

// ----- Additional CSS graphic elements (floating shapes, dance icons) -----
const FloatingGraphics = () => {
  const shapes = [
    { type: "circle", size: "w-64 h-64", color: "bg-pink-200/10", left: "5%", top: "20%", delay: "0s", duration: "25s", blur: "blur-3xl" },
    { type: "circle", size: "w-80 h-80", color: "bg-purple-200/8", right: "-10%", top: "40%", delay: "2s", duration: "30s", blur: "blur-3xl" },
    { type: "diamond", size: "w-24 h-24", color: "bg-pink-300/15", left: "15%", bottom: "15%", delay: "1s", duration: "20s", blur: "blur-2xl" },
    { type: "ring", size: "w-40 h-40", color: "border border-purple-300/20", left: "70%", top: "15%", delay: "0.5s", duration: "22s", blur: "" },
    { type: "sparkle", size: "w-8 h-8", color: "bg-yellow-200/40", left: "45%", top: "30%", delay: "0.2s", duration: "12s", blur: "blur-sm" },
    { type: "sparkle", size: "w-12 h-12", color: "bg-pink-200/30", right: "20%", bottom: "25%", delay: "1.5s", duration: "15s", blur: "blur-md" },
  ];

  // Dance‑themed icons (ballet shoes, twirls) – using pure CSS/SVG via content
  const danceIcons = [
    { icon: "🩰", left: "10%", top: "60%", delay: "0s", duration: "18s", size: "text-5xl" },
    { icon: "✨", left: "85%", top: "70%", delay: "0.8s", duration: "14s", size: "text-4xl" },
    { icon: "💃", left: "50%", top: "85%", delay: "1.2s", duration: "20s", size: "text-5xl" },
    { icon: "🩰", left: "75%", top: "20%", delay: "0.3s", duration: "22s", size: "text-3xl" },
    { icon: "⭐", left: "30%", top: "45%", delay: "0.6s", duration: "16s", size: "text-4xl" },
  ];

  return (
    <>
      {/* Large blurred shapes */}
      {shapes.map((s, i) => (
        <div
          key={i}
          className={`absolute ${s.size} ${s.color} ${s.blur} rounded-full ${s.type === 'diamond' ? 'rotate-45' : ''} ${s.type === 'ring' ? 'rounded-full border-2 border-dashed' : ''} animate-float-slow pointer-events-none`}
          style={{
            left: s.left,
            right: s.right,
            top: s.top,
            bottom: s.bottom,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
      {/* Floating dance icons */}
      {danceIcons.map((d, i) => (
        <div
          key={`icon-${i}`}
          className={`absolute ${d.size} opacity-30 hover:opacity-50 transition-opacity pointer-events-none animate-float-soft`}
          style={{
            left: d.left,
            top: d.top,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        >
          {d.icon}
        </div>
      ))}
    </>
  );
};

// ----- Parallax effect (moves 3D canvas slightly with mouse) -----
const ParallaxLayer = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 10;
      const y = (clientY / window.innerHeight - 0.5) * 10;
      containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return <div ref={containerRef} className="transition-transform duration-200 ease-out will-change-transform">{children}</div>;
};

// ----- Main exported component -----
export default function VisualEnhancements() {
  return (
    <>
      {/* 3D Canvas with parallax wrapper */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <ParallaxLayer>
          <ThreeDScene />
        </ParallaxLayer>
      </div>

      {/* Floating graphic shapes and icons */}
      <FloatingGraphics />

      {/* Custom CSS animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(4deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-soft {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(8deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float-slow {
          animation: float-slow infinite ease-in-out;
        }
        .animate-float-soft {
          animation: float-soft infinite ease-in-out;
        }
      `}</style>
    </>
  );
}