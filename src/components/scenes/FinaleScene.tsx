"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMediaPreferences } from "@/lib/useMediaPreferences";

function HorizonField({
  reducedMotion,
  isMobile,
}: {
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const cols = isMobile ? 20 : 34;
  const rows = isMobile ? 14 : 20;
  const count = cols * rows;

  const basePositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    let idx = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        arr[idx * 3] = (x - cols / 2) * 0.42;
        arr[idx * 3 + 1] = -0.8;
        arr[idx * 3 + 2] = (z - rows / 2) * 0.42;
        idx++;
      }
    }
    return arr;
  }, [cols, rows, count]);

  const positions = useMemo(() => new Float32Array(basePositions), [basePositions]);

  useFrame((state) => {
    if (reducedMotion || !pointsRef.current) return;
    const t = state.clock.elapsedTime * 0.7;
    const attr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const bx = basePositions[i * 3];
      const bz = basePositions[i * 3 + 2];
      arr[i * 3 + 1] =
        -0.8 + Math.sin(bx * 0.55 + t) * 0.22 + Math.cos(bz * 0.55 + t) * 0.22;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} rotation={[0.25, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#8291EA"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

export default function FinaleScene() {
  const { reducedMotion, isMobile } = useMediaPreferences();

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        camera={{ position: [0, 1.5, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#111318", 4, 12]} />
        <HorizonField reducedMotion={reducedMotion} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
