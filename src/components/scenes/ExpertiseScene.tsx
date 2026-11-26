"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useMediaPreferences } from "@/lib/useMediaPreferences";

// ═══════════════════════════════════════════════════════════════════════════════
// 00: Web Development — Multi-layer viewport planes with grid etching
// ═══════════════════════════════════════════════════════════════════════════════
function WebDevSculpture({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (reduced || !groupRef.current) return;
    groupRef.current.rotation.y += d * 0.18;
  });

  // Responsive layout grid dots
  const gridDots = useMemo(() => {
    const pts: Array<[number, number, number]> = [];
    for (let x = 0; x < 8; x++)
      for (let y = 0; y < 5; y++)
        pts.push([(x - 3.5) * 0.28, (y - 2) * 0.28, 0]);
    return pts;
  }, []);

  return (
    <group ref={groupRef}>
      <Float speed={reduced ? 0 : 1.4} floatIntensity={reduced ? 0 : 0.2}>
        {/* Primary viewport plane */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.4, 1.6, 0.03]} />
          <meshStandardMaterial
            color="#8291EA"
            transparent
            opacity={0.08}
            roughness={0.1}
            metalness={0.4}
          />
        </mesh>
        {/* Frame border */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.4, 1.6, 0.025]} />
          <meshBasicMaterial color="#8291EA" wireframe transparent opacity={0.5} />
        </mesh>

        {/* Secondary planes — depth layers */}
        {[-0.5, 0.5].map((z, i) => (
          <group key={i} position={[i * 0.15 - 0.075, i * 0.1 - 0.05, z]}>
            <mesh>
              <boxGeometry args={[2.42, 1.62, 0.02]} />
              <meshStandardMaterial
                color="#111318"
                transparent
                opacity={0.6}
                roughness={0.2}
                metalness={0.3}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[2.42, 1.62, 0.015]} />
              <meshBasicMaterial
                color="#8291EA"
                wireframe
                transparent
                opacity={0.12}
              />
            </mesh>
          </group>
        ))}

        {/* Responsive grid indicator dots */}
        {gridDots.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshBasicMaterial
              color={i % 7 === 0 ? "#8291EA" : "#FFFFFF"}
              transparent
              opacity={i % 7 === 0 ? 0.9 : 0.25}
            />
          </mesh>
        ))}

        {/* Header bar */}
        <mesh position={[0, 0.65, 0.04]}>
          <boxGeometry args={[2.1, 0.08, 0.02]} />
          <meshStandardMaterial color="#8291EA" transparent opacity={0.6} />
        </mesh>
        {/* Body bars */}
        {[0.3, 0.1, -0.1, -0.3].map((y, i) => (
          <mesh key={i} position={[-0.3 + i * 0.05, y, 0.04]}>
            <boxGeometry args={[1.5 - i * 0.15, 0.04, 0.02]} />
            <meshStandardMaterial
              color="#FFFFFF"
              transparent
              opacity={0.15 - i * 0.02}
            />
          </mesh>
        ))}
      </Float>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 01: Custom Software — Interlocking modular system architecture
// ═══════════════════════════════════════════════════════════════════════════════
function SoftwareSculpture({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((s, d) => {
    if (reduced || !groupRef.current) return;
    groupRef.current.rotation.y += d * 0.14;
    groupRef.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.4) * 0.08;
  });

  const modules = useMemo(
    () => [
      { pos: [0, 0, 0] as [number, number, number], size: [0.9, 0.9, 0.9] as [number,number,number], accent: true },
      { pos: [-1.0, 0.8, 0.2] as [number, number, number], size: [0.65, 0.65, 0.65] as [number,number,number], accent: false },
      { pos: [1.0, 0.8, -0.2] as [number, number, number], size: [0.65, 0.65, 0.65] as [number,number,number], accent: false },
      { pos: [-1.0, -0.8, -0.2] as [number, number, number], size: [0.65, 0.65, 0.65] as [number,number,number], accent: false },
      { pos: [1.0, -0.8, 0.2] as [number, number, number], size: [0.65, 0.65, 0.65] as [number,number,number], accent: false },
      { pos: [0, 1.5, 0] as [number, number, number], size: [0.5, 0.5, 0.5] as [number,number,number], accent: true },
    ],
    []
  );

  const connectors = useMemo(() => {
    return modules.slice(1, 5).map((m) => {
      const start = new THREE.Vector3(0, 0, 0);
      const end = new THREE.Vector3(...m.pos);
      const mid = start.clone().add(end).multiplyScalar(0.5);
      const len = start.distanceTo(end);
      const dir = end.clone().sub(start).normalize();
      const q = new THREE.Quaternion();
      q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      return { mid, len, q };
    });
  }, [modules]);

  return (
    <group ref={groupRef}>
      <Float speed={reduced ? 0 : 1.2} floatIntensity={reduced ? 0 : 0.18}>
        {modules.map((m, i) => (
          <group key={i}>
            <mesh position={m.pos}>
              <boxGeometry args={m.size} />
              <meshStandardMaterial
                color={m.accent ? "#8291EA" : "#181B22"}
                roughness={m.accent ? 0.1 : 0.3}
                metalness={m.accent ? 0.6 : 0.8}
                emissive={m.accent ? "#8291EA" : "#000000"}
                emissiveIntensity={m.accent ? 0.2 : 0}
              />
            </mesh>
            <mesh position={m.pos}>
              <boxGeometry args={[m.size[0] + 0.02, m.size[1] + 0.02, m.size[2] + 0.02]} />
              <meshBasicMaterial
                color={m.accent ? "#8291EA" : "#FFFFFF"}
                wireframe
                transparent
                opacity={m.accent ? 0.4 : 0.1}
              />
            </mesh>
          </group>
        ))}

        {/* Connectors */}
        {connectors.map((c, i) => (
          <mesh key={i} position={c.mid} quaternion={c.q}>
            <cylinderGeometry args={[0.025, 0.025, c.len, 6]} />
            <meshStandardMaterial
              color="#8291EA"
              transparent
              opacity={0.5}
              metalness={0.5}
            />
          </mesh>
        ))}
      </Float>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 02: AI Solutions — Neural lattice with energy core
// ═══════════════════════════════════════════════════════════════════════════════
function AISculpture({ reduced }: { reduced: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const count = 80;
  const nodePositions = useMemo(() => {
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.0;
      pts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pts[i * 3 + 2] = r * Math.cos(phi);
    }
    return pts;
  }, []);

  useFrame((s, d) => {
    if (reduced) return;
    const t = s.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y += d * 0.3;
      const sc = 1 + Math.sin(t * 1.8) * 0.04;
      coreRef.current.scale.setScalar(sc);
    }
    if (outerRef.current) {
      outerRef.current.rotation.y -= d * 0.12;
      outerRef.current.rotation.x += d * 0.07;
    }
    if (pointsRef.current) pointsRef.current.rotation.y += d * 0.05;
  });

  return (
    <Float speed={reduced ? 0 : 1.3} floatIntensity={reduced ? 0 : 0.2}>
      {/* Neural core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.75, 2]} />
        <meshStandardMaterial
          color="#8291EA"
          roughness={0.05}
          metalness={0.7}
          emissive="#8291EA"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Inner glow */}
      <mesh scale={0.6}>
        <sphereGeometry args={[0.75, 24, 24]} />
        <meshStandardMaterial
          color="#8291EA"
          transparent
          opacity={0.15}
          emissive="#8291EA"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Outer lattice cage */}
      <mesh ref={outerRef} scale={1.55}>
        <icosahedronGeometry args={[0.75, 1]} />
        <meshBasicMaterial color="#8291EA" wireframe transparent opacity={0.3} />
      </mesh>

      <mesh scale={1.9}>
        <icosahedronGeometry args={[0.75, 2]} />
        <meshBasicMaterial color="#FFFFFF" wireframe transparent opacity={0.07} />
      </mesh>

      {/* Synaptic node cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={nodePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#8291EA" transparent opacity={0.75} sizeAttenuation />
      </points>
    </Float>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 03: RPA & Automation — Precision orbital mechanism
// ═══════════════════════════════════════════════════════════════════════════════
function RPASculpture({ reduced }: { reduced: boolean }) {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Group>(null);

  // Gear teeth on the main ring
  const teethPositions = useMemo(() => {
    const pts: Array<{ pos: [number, number, number]; rot: number }> = [];
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const r = 1.6;
      pts.push({ pos: [Math.cos(angle) * r, Math.sin(angle) * r, 0], rot: angle });
    }
    return pts;
  }, []);

  useFrame((_, d) => {
    if (reduced) return;
    if (r1.current) r1.current.rotation.z += d * 0.22;
    if (r2.current) r2.current.rotation.z -= d * 0.35;
    if (r3.current) r3.current.rotation.x += d * 0.18;
    if (coreRef.current) coreRef.current.rotation.y += d * 0.4;
  });

  return (
    <Float speed={reduced ? 0 : 1.1} floatIntensity={reduced ? 0 : 0.15}>
      {/* Main outer ring */}
      <mesh ref={r1}>
        <torusGeometry args={[1.55, 0.065, 20, 100]} />
        <meshStandardMaterial color="#181B22" metalness={0.85} roughness={0.1} />
      </mesh>

      {/* Gear teeth */}
      {teethPositions.map((t, i) => (
        <mesh key={i} position={t.pos} rotation={[0, 0, t.rot]}>
          <boxGeometry args={[0.08, 0.14, 0.08]} />
          <meshStandardMaterial
            color={i % 6 === 0 ? "#8291EA" : "#222530"}
            metalness={0.9}
            roughness={0.1}
            emissive={i % 6 === 0 ? "#8291EA" : "#000"}
            emissiveIntensity={i % 6 === 0 ? 0.4 : 0}
          />
        </mesh>
      ))}

      {/* Inner ring */}
      <mesh ref={r2} rotation={[Math.PI / 5, 0, 0]}>
        <torusGeometry args={[1.1, 0.045, 16, 80]} />
        <meshStandardMaterial color="#8291EA" metalness={0.5} roughness={0.2} emissive="#8291EA" emissiveIntensity={0.15} />
      </mesh>

      {/* Cross ring */}
      <mesh ref={r3} rotation={[0, Math.PI / 4, Math.PI / 3]}>
        <torusGeometry args={[0.75, 0.03, 16, 80]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.25} />
      </mesh>

      {/* Precision core */}
      <group ref={coreRef}>
        <mesh>
          <octahedronGeometry args={[0.38, 0]} />
          <meshStandardMaterial color="#111318" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh scale={1.3}>
          <octahedronGeometry args={[0.38, 0]} />
          <meshBasicMaterial color="#8291EA" wireframe transparent opacity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 04: Digital Transformation — Converging prism with refraction
// ═══════════════════════════════════════════════════════════════════════════════
function DigitalTransformSculpture({ reduced }: { reduced: boolean }) {
  const prismRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const r1 = useRef<THREE.Mesh>(null);

  useFrame((s, d) => {
    if (reduced) return;
    const t = s.clock.elapsedTime;
    if (prismRef.current) {
      prismRef.current.rotation.y += d * 0.16;
      prismRef.current.rotation.x = Math.sin(t * 0.5) * 0.08;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y -= d * 0.1;
      outerRef.current.rotation.z += d * 0.07;
    }
    if (r1.current) r1.current.rotation.z += d * 0.12;
  });

  return (
    <Float speed={reduced ? 0 : 1.0} floatIntensity={reduced ? 0 : 0.22}>
      {/* Core dodecahedron */}
      <mesh ref={prismRef}>
        <dodecahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color="#181B22" roughness={0.15} metalness={0.85} />
      </mesh>
      <mesh ref={outerRef} scale={1.3}>
        <dodecahedronGeometry args={[1.1, 0]} />
        <meshBasicMaterial color="#8291EA" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh scale={1.6}>
        <dodecahedronGeometry args={[1.1, 0]} />
        <meshBasicMaterial color="#FFFFFF" wireframe transparent opacity={0.08} />
      </mesh>

      {/* Transformation band */}
      <mesh ref={r1} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.9, 0.015, 8, 100]} />
        <meshStandardMaterial
          color="#8291EA"
          emissive="#8291EA"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Light prism beams */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        const x = Math.cos(angle) * 1.5;
        const y = Math.sin(angle) * 1.5;
        return (
          <mesh key={i} position={[x * 0.3, y * 0.3, 0]} rotation={[0, 0, angle]}>
            <coneGeometry args={[0.04, 0.9, 6]} />
            <meshStandardMaterial
              color="#8291EA"
              transparent
              opacity={0.3}
              emissive="#8291EA"
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}
    </Float>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main ExpertiseScene
// ═══════════════════════════════════════════════════════════════════════════════
export default function ExpertiseScene({ activeIndex }: { activeIndex: number }) {
  const { reducedMotion, isMobile } = useMediaPreferences();

  return (
    <div className="w-full h-full pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 6, 4]} intensity={1.2} color="#FFFFFF" />
        <pointLight position={[-4, -3, 4]} intensity={1.8} color="#8291EA" distance={12} />
        <pointLight position={[3, 3, -2]} intensity={0.6} color="#8291EA" distance={8} />

        {activeIndex === 0 && <WebDevSculpture reduced={reducedMotion} />}
        {activeIndex === 1 && <SoftwareSculpture reduced={reducedMotion} />}
        {activeIndex === 2 && <AISculpture reduced={reducedMotion} />}
        {activeIndex === 3 && <RPASculpture reduced={reducedMotion} />}
        {activeIndex === 4 && <DigitalTransformSculpture reduced={reducedMotion} />}
      </Canvas>
    </div>
  );
}
