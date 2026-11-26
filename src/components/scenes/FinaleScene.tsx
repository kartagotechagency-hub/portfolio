"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMediaPreferences } from "@/lib/useMediaPreferences";

function CinematicGround({
  reducedMotion,
  isMobile,
}: {
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const cols = isMobile ? 18 : 32;
  const rows = isMobile ? 10 : 18;
  const count = cols * rows;

  const basePositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    let idx = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        arr[idx * 3] = (x - cols / 2) * 0.48;
        arr[idx * 3 + 1] = -1.2;
        arr[idx * 3 + 2] = (z - rows / 2) * 0.48;
        idx++;
      }
    }
    return arr;
  }, [cols, rows, count]);

  // Grid line segments
  const linePositions = useMemo(() => {
    const pts: number[] = [];
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows - 1; z++) {
        const i1 = x * rows + z;
        const i2 = x * rows + z + 1;
        pts.push(
          basePositions[i1 * 3],
          basePositions[i1 * 3 + 1],
          basePositions[i1 * 3 + 2],
          basePositions[i2 * 3],
          basePositions[i2 * 3 + 1],
          basePositions[i2 * 3 + 2]
        );
      }
    }
    for (let z = 0; z < rows; z++) {
      for (let x = 0; x < cols - 1; x++) {
        const i1 = x * rows + z;
        const i2 = (x + 1) * rows + z;
        pts.push(
          basePositions[i1 * 3],
          basePositions[i1 * 3 + 1],
          basePositions[i1 * 3 + 2],
          basePositions[i2 * 3],
          basePositions[i2 * 3 + 1],
          basePositions[i2 * 3 + 2]
        );
      }
    }
    return new Float32Array(pts);
  }, [cols, rows, basePositions]);

  const positions = useMemo(() => new Float32Array(basePositions), [basePositions]);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime * 0.5;

    const pointAttr = pointsRef.current?.geometry.attributes
      .position as THREE.BufferAttribute;
    const lineAttr = linesRef.current?.geometry.attributes
      .position as THREE.BufferAttribute;

    if (!pointAttr || !lineAttr) return;

    const pArr = pointAttr.array as Float32Array;
    const lArr = lineAttr.array as Float32Array;

    // Animate grid waves
    for (let i = 0; i < count; i++) {
      const bx = basePositions[i * 3];
      const bz = basePositions[i * 3 + 2];
      const wave =
        Math.sin(bx * 0.42 + t) * 0.28 +
        Math.cos(bz * 0.38 + t * 1.1) * 0.18 +
        Math.sin((bx + bz) * 0.3 + t * 0.7) * 0.12;
      pArr[i * 3 + 1] = -1.2 + wave;
    }
    pointAttr.needsUpdate = true;

    // Sync grid lines to wave
    let idx = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows - 1; z++) {
        const i1 = x * rows + z;
        const i2 = x * rows + z + 1;
        for (const i of [i1, i2]) {
          lArr[idx * 3] = pArr[i * 3];
          lArr[idx * 3 + 1] = pArr[i * 3 + 1];
          lArr[idx * 3 + 2] = pArr[i * 3 + 2];
          idx++;
        }
      }
    }
    for (let z = 0; z < rows; z++) {
      for (let x = 0; x < cols - 1; x++) {
        const i1 = x * rows + z;
        const i2 = (x + 1) * rows + z;
        for (const i of [i1, i2]) {
          lArr[idx * 3] = pArr[i * 3];
          lArr[idx * 3 + 1] = pArr[i * 3 + 1];
          lArr[idx * 3 + 2] = pArr[i * 3 + 2];
          idx++;
        }
      }
    }
    lineAttr.needsUpdate = true;
  });

  return (
    <group rotation={[0.18, 0, 0]}>
      {/* Wave grid lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={new Float32Array(linePositions)}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#8291EA" transparent opacity={0.2} />
      </lineSegments>

      {/* Grid nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#8291EA"
          transparent
          opacity={0.55}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// Horizon atmospheric glow — distant light band
function HorizonGlow() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.12 + Math.sin(s.clock.elapsedTime * 0.4) * 0.03;
  });

  return (
    <mesh ref={meshRef} position={[0, -0.5, -4]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 1.5]} />
      <meshBasicMaterial color="#8291EA" transparent opacity={0.12} />
    </mesh>
  );
}

export default function FinaleScene() {
  const { reducedMotion, isMobile } = useMediaPreferences();

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        camera={{ position: [0, 1.8, 6], fov: 48 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#111318", 5, 14]} />
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 2, 0]} intensity={0.8} color="#8291EA" distance={8} />
        <CinematicGround reducedMotion={reducedMotion} isMobile={isMobile} />
        <HorizonGlow />
      </Canvas>
    </div>
  );
}
