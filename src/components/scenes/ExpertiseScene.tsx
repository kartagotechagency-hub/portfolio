"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useMediaPreferences } from "@/lib/useMediaPreferences";

function ExpertiseSculpture({
  activeIndex,
  reducedMotion,
}: {
  activeIndex: number;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={reducedMotion ? 0 : 1.5}
        rotationIntensity={reducedMotion ? 0 : 0.15}
        floatIntensity={reducedMotion ? 0 : 0.25}
      >
        {/* 0: Web Development — Aligned Editorial Viewport Planes */}
        {activeIndex === 0 && (
          <group>
            {[-0.45, 0, 0.45].map((z, i) => (
              <mesh key={i} position={[i * 0.12 - 0.12, i * 0.08 - 0.08, z]}>
                <boxGeometry args={[2.2, 1.45, 0.04]} />
                <meshStandardMaterial
                  color={i === 1 ? "#8291EA" : "#111318"}
                  transparent
                  opacity={i === 1 ? 0.85 : 0.14}
                  roughness={0.2}
                  metalness={0.3}
                />
              </mesh>
            ))}
            <mesh position={[0, 0, 0.55]}>
              <boxGeometry args={[2.25, 1.5, 0.02]} />
              <meshBasicMaterial color="#111318" wireframe />
            </mesh>
          </group>
        )}

        {/* 1: Custom Software — Interlocking Modular System Blocks */}
        {activeIndex === 1 && (
          <group>
            {[
              [-0.65, 0.55, 0],
              [0.65, 0.55, 0],
              [-0.65, -0.55, 0],
              [0.65, -0.55, 0],
              [0, 0, 0.5],
            ].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]}>
                <boxGeometry args={[0.85, 0.85, 0.85]} />
                <meshStandardMaterial
                  color={i === 4 ? "#8291EA" : "#111318"}
                  roughness={0.3}
                  metalness={0.5}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* 2: AI Solutions — Neural Core & Synaptic Cage */}
        {activeIndex === 2 && (
          <group>
            <mesh>
              <icosahedronGeometry args={[0.95, 1]} />
              <meshStandardMaterial
                color="#8291EA"
                roughness={0.2}
                metalness={0.6}
              />
            </mesh>
            <mesh scale={1.45}>
              <icosahedronGeometry args={[1.05, 1]} />
              <meshBasicMaterial color="#111318" wireframe transparent opacity={0.45} />
            </mesh>
          </group>
        )}

        {/* 3: RPA & Business Process Automation — Deterministic Orbital Loops */}
        {activeIndex === 3 && (
          <group>
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[1.35, 0.06, 16, 80]} />
              <meshStandardMaterial color="#111318" metalness={0.6} roughness={0.25} />
            </mesh>
            <mesh rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
              <torusGeometry args={[1.05, 0.05, 16, 80]} />
              <meshStandardMaterial color="#8291EA" metalness={0.4} roughness={0.25} />
            </mesh>
            <mesh>
              <octahedronGeometry args={[0.45, 0]} />
              <meshStandardMaterial color="#111318" metalness={0.7} roughness={0.2} />
            </mesh>
          </group>
        )}

        {/* 4: Digital Transformation — Converging Crystalline Prism */}
        {activeIndex === 4 && (
          <group>
            <mesh>
              <dodecahedronGeometry args={[1.25, 0]} />
              <meshStandardMaterial
                color="#111318"
                roughness={0.25}
                metalness={0.75}
              />
            </mesh>
            <mesh scale={1.25}>
              <dodecahedronGeometry args={[1.25, 0]} />
              <meshBasicMaterial color="#8291EA" wireframe transparent opacity={0.6} />
            </mesh>
          </group>
        )}
      </Float>
    </group>
  );
}

export default function ExpertiseScene({ activeIndex }: { activeIndex: number }) {
  const { reducedMotion, isMobile } = useMediaPreferences();

  return (
    <div className="w-full h-full pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0, 5.2], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[5, 6, 5]} intensity={1.1} color="#FFFFFF" />
        <pointLight position={[-4, -3, 4]} intensity={1.2} color="#8291EA" />
        <ExpertiseSculpture activeIndex={activeIndex} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
