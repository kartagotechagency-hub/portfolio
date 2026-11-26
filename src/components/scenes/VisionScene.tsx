"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMediaPreferences } from "@/lib/useMediaPreferences";

function MorphingIdeaLattice({
  progressRef,
  reducedMotion,
  isMobile,
}: {
  progressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const latticeRef = useRef<THREE.Mesh>(null);
  const count = isMobile ? 220 : 420;

  const { scattered, structured } = useMemo(() => {
    const s = new Float32Array(count * 3);
    const t = new Float32Array(count * 3);

    // Deterministic pseudo-random scatter & golden-ratio spherical lattice
    for (let i = 0; i < count; i++) {
      const seed1 = Math.sin(i * 12.9898) * 43758.5453;
      const seed2 = Math.sin(i * 78.233) * 43758.5453;
      const seed3 = Math.sin(i * 45.164) * 43758.5453;
      const rx = (seed1 - Math.floor(seed1) - 0.5) * 7.5;
      const ry = (seed2 - Math.floor(seed2) - 0.5) * 5.0;
      const rz = (seed3 - Math.floor(seed3) - 0.5) * 4.5;

      s[i * 3] = rx;
      s[i * 3 + 1] = ry;
      s[i * 3 + 2] = rz;

      // Structured crystalline sphere / architectural grid
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 1.85;
      t[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      t[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      t[i * 3 + 2] = radius * Math.cos(phi);
    }

    return { scattered: s, structured: t };
  }, [count]);

  const currentPositions = useMemo(() => new Float32Array(scattered), [scattered]);

  useFrame((_, delta) => {
    const p = reducedMotion ? 1 : Math.min(1, Math.max(0, progressRef.current));
    const eased = p * p * (3 - 2 * p);

    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < count * 3; i++) {
        arr[i] = THREE.MathUtils.lerp(scattered[i], structured[i], eased);
      }
      attr.needsUpdate = true;
      if (!reducedMotion) {
        pointsRef.current.rotation.y += delta * 0.14;
      }
    }

    if (latticeRef.current) {
      const mat = latticeRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = eased * 0.32;
      latticeRef.current.scale.setScalar(0.75 + eased * 0.25);
      if (!reducedMotion) {
        latticeRef.current.rotation.y += delta * 0.14;
        latticeRef.current.rotation.x = eased * 0.3;
      }
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={currentPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.045 : 0.038}
          color="#8291EA"
          transparent
          opacity={0.88}
          sizeAttenuation
        />
      </points>

      <mesh ref={latticeRef}>
        <octahedronGeometry args={[1.85, 2]} />
        <meshBasicMaterial color="#FFFFFF" wireframe transparent opacity={0} />
      </mesh>
    </group>
  );
}

export default function VisionScene({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const { reducedMotion, isMobile } = useMediaPreferences();

  return (
    <div className="w-full h-full pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <MorphingIdeaLattice
          progressRef={progressRef}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}
