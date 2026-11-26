"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useMediaPreferences } from "@/lib/useMediaPreferences";

// ─── Main 3D Architectural Core ───────────────────────────────────────────────
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
  const ring3Ref = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);

  const nodePositions = useMemo(() => {
    const count = isMobile ? 16 : 32;
    const pts: Array<[number, number, number]> = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.55;
      pts.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]);
    }
    return pts;
  }, [isMobile]);

  // Connection lines geometry between nearby nodes
  const linePairs = useMemo(() => {
    const pairs: Array<[[number, number, number], [number, number, number]]> =
      [];
    if (isMobile) return pairs;
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const [ax, ay, az] = nodePositions[i];
        const [bx, by, bz] = nodePositions[j];
        const dist = Math.sqrt(
          (ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2
        );
        if (dist < 2.0) {
          pairs.push([nodePositions[i], nodePositions[j]]);
        }
      }
    }
    return pairs;
  }, [nodePositions, isMobile]);

  useFrame((state, delta) => {
    if (reducedMotion || !groupRef.current) return;

    const targetX = state.pointer.y * 0.12;
    const targetY = state.pointer.x * 0.18;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.035
    );
    groupRef.current.rotation.y += delta * 0.09;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -targetY * 0.3,
      0.035
    );

    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.07;
    if (ring2Ref.current) ring2Ref.current.rotation.x -= delta * 0.055;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.04;

    // Pulsing inner core
    if (innerCoreRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.025;
      innerCoreRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef} position={[isMobile ? 0 : 1.65, 0, 0]}>
      <Float
        speed={reducedMotion ? 0 : 1.1}
        rotationIntensity={reducedMotion ? 0 : 0.12}
        floatIntensity={reducedMotion ? 0 : 0.28}
      >
        {/* Inner obsidian faceted core */}
        <mesh ref={innerCoreRef}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial
            color="#181B22"
            roughness={0.18}
            metalness={0.9}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* Inner violet glow core */}
        <mesh scale={0.72}>
          <icosahedronGeometry args={[1.2, 2]} />
          <meshStandardMaterial
            color="#8291EA"
            roughness={0.0}
            metalness={0.0}
            transparent
            opacity={0.12}
            emissive="#8291EA"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Outer wireframe cage */}
        <mesh scale={1.42}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshBasicMaterial
            color="#8291EA"
            wireframe
            transparent
            opacity={0.22}
          />
        </mesh>

        {/* Fine detail wireframe */}
        <mesh scale={1.6}>
          <icosahedronGeometry args={[1.2, 2]} />
          <meshBasicMaterial
            color="#FFFFFF"
            wireframe
            transparent
            opacity={0.06}
          />
        </mesh>

        {/* Orbital ring 1 — primary */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0.2, 0]}>
          <torusGeometry args={[2.1, 0.013, 16, 120]} />
          <meshStandardMaterial
            color="#8291EA"
            transparent
            opacity={0.6}
            metalness={0.5}
            roughness={0.1}
            emissive="#8291EA"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Orbital ring 2 */}
        <mesh ref={ring2Ref} rotation={[-Math.PI / 4, -0.4, 0]}>
          <torusGeometry args={[2.6, 0.009, 16, 120]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.14} />
        </mesh>

        {/* Orbital ring 3 — equatorial */}
        <mesh ref={ring3Ref} rotation={[Math.PI / 2, 0.1, 0]}>
          <torusGeometry args={[2.35, 0.007, 16, 120]} />
          <meshBasicMaterial color="#8291EA" transparent opacity={0.18} />
        </mesh>

        {/* Satellite nodes with connection lines */}
        {nodePositions.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[idx % 4 === 0 ? 0.038 : 0.019, 10, 10]} />
            <meshStandardMaterial
              color={idx % 4 === 0 ? "#8291EA" : "#FFFFFF"}
              transparent
              opacity={idx % 4 === 0 ? 0.9 : 0.3}
              emissive={idx % 4 === 0 ? "#8291EA" : "#000000"}
              emissiveIntensity={idx % 4 === 0 ? 0.5 : 0}
              metalness={0.3}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* Connection lines between close nodes */}
        {linePairs.map(([a, b], idx) => {
          const start = new THREE.Vector3(...a);
          const end = new THREE.Vector3(...b);
          const mid = start.clone().add(end).multiplyScalar(0.5);
          const length = start.distanceTo(end);
          const dir = end.clone().sub(start).normalize();
          const quaternion = new THREE.Quaternion();
          quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
          return (
            <mesh key={idx} position={mid} quaternion={quaternion}>
              <cylinderGeometry args={[0.004, 0.004, length, 4]} />
              <meshBasicMaterial
                color="#8291EA"
                transparent
                opacity={0.12}
              />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

export default function HeroScene() {
  const { reducedMotion, isMobile } = useMediaPreferences();

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* Transparent WebGL 3D geometric core layered over hero-bg.jpg */}
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0, isMobile ? 7.5 : 6.5], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[6, 6, 4]}
          intensity={1.4}
          color="#FFFFFF"
        />
        <pointLight
          position={[-5, -2, 3]}
          intensity={2.2}
          color="#8291EA"
          distance={12}
        />
        <pointLight
          position={[3, 4, -2]}
          intensity={0.8}
          color="#8291EA"
          distance={8}
        />
        <ArchitecturalCore
          reducedMotion={reducedMotion}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}
