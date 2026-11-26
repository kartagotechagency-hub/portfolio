"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { useMediaPreferences } from "@/lib/useMediaPreferences";

function ArchitecturalCore({
  reducedMotion,
  isMobile,
}: {
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const nodePositions = useMemo(() => {
    const count = isMobile ? 16 : 28;
    const pts: Array<[number, number, number]> = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.45;
      pts.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]);
    }
    return pts;
  }, [isMobile]);

  useFrame((state, delta) => {
    if (reducedMotion || !groupRef.current) return;

    const targetX = state.pointer.y * 0.14;
    const targetY = state.pointer.x * 0.22;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.04
    );
    groupRef.current.rotation.y += delta * 0.11;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -targetY * 0.35,
      0.04
    );

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.08;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= delta * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={[isMobile ? 0 : 1.55, 0, 0]}>
      <Float
        speed={reducedMotion ? 0 : 1.2}
        rotationIntensity={reducedMotion ? 0 : 0.15}
        floatIntensity={reducedMotion ? 0 : 0.3}
      >
        {/* Inner Obsidian Faceted Core */}
        <mesh>
          <icosahedronGeometry args={[1.25, 1]} />
          <meshStandardMaterial
            color="#181B22"
            roughness={0.28}
            metalness={0.85}
          />
        </mesh>

        {/* Precision Wireframe Cage */}
        <mesh scale={1.36}>
          <icosahedronGeometry args={[1.25, 1]} />
          <meshBasicMaterial
            color="#8291EA"
            wireframe
            transparent
            opacity={0.28}
          />
        </mesh>

        {/* Orbital Architectural Rings */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0.2, 0]}>
          <torusGeometry args={[2.15, 0.012, 16, 100]} />
          <meshBasicMaterial color="#8291EA" transparent opacity={0.55} />
        </mesh>

        <mesh ref={ring2Ref} rotation={[-Math.PI / 4, -0.4, 0]}>
          <torusGeometry args={[2.55, 0.008, 16, 100]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.18} />
        </mesh>

        {/* Precision Satellite Nodes */}
        {nodePositions.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[idx % 4 === 0 ? 0.036 : 0.02, 8, 8]} />
            <meshBasicMaterial
              color={idx % 4 === 0 ? "#8291EA" : "#FFFFFF"}
              transparent
              opacity={idx % 4 === 0 ? 0.85 : 0.35}
            />
          </mesh>
        ))}
      </Float>
    </group>
  );
}

export default function HeroScene() {
  const { reducedMotion, isMobile } = useMediaPreferences();

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0, isMobile ? 7.2 : 6.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#111318"]} />
        <fog attach="fog" args={["#111318", 6, 16]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#FFFFFF" />
        <pointLight position={[-4, -2, 3]} intensity={1.8} color="#8291EA" />
        <Environment preset="city" environmentIntensity={0.35} />
        <ArchitecturalCore reducedMotion={reducedMotion} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
