"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMediaPreferences } from "@/lib/useMediaPreferences";

interface TransformationDioramaProps {
  progressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
  isMobile: boolean;
}

const STATION_BASE: Array<{
  pos: [number, number, number];
  chaosOffset: [number, number, number];
  chaosRot: [number, number, number];
}> = [
  {
    pos: [-2.1, 0, -1.3],
    chaosOffset: [-0.65, -0.15, -0.45],
    chaosRot: [0.14, -0.42, -0.1],
  },
  {
    pos: [2.1, 0, -1.3],
    chaosOffset: [0.6, 0.1, -0.35],
    chaosRot: [-0.1, 0.38, 0.12],
  },
  {
    pos: [-2.1, 0, 1.3],
    chaosOffset: [-0.55, 0.05, 0.45],
    chaosRot: [0.12, 0.34, 0.08],
  },
  {
    pos: [2.1, 0, 1.3],
    chaosOffset: [0.7, -0.1, 0.4],
    chaosRot: [-0.14, -0.32, -0.11],
  },
];

function TransformationDiorama({
  progressRef,
  reducedMotion,
  isMobile,
}: TransformationDioramaProps) {
  const { camera } = useThree();
  const rootRef = useRef<THREE.Group>(null);
  const stationRefs = useRef<Array<THREE.Group | null>>([]);
  const paperRefs = useRef<Array<THREE.Mesh | null>>([]);
  const bridgeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const packetRefs = useRef<Array<THREE.Mesh | null>>([]);
  const coreRef = useRef<THREE.Group>(null);
  const rpaRingRef = useRef<THREE.Mesh>(null);
  const growthPillarRefs = useRef<Array<THREE.Mesh | null>>([]);

  // Precompute bridge transform between center (0, 0.4, 0) and each aligned station
  const bridgeTransforms = useMemo(() => {
    const center = new THREE.Vector3(0, 0.4, 0);
    return STATION_BASE.map((s) => {
      const target = new THREE.Vector3(s.pos[0], 0.4, s.pos[2]);
      const mid = center.clone().add(target).multiplyScalar(0.5);
      const len = center.distanceTo(target);
      const dir = target.clone().sub(center).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir
      );
      return { mid, len, quat, start: center, end: target };
    });
  }, []);

  useFrame((state) => {
    const p = reducedMotion ? 0.65 : THREE.MathUtils.clamp(progressRef.current, 0, 1);
    const t = state.clock.elapsedTime;

    // Normalized chapter weights:
    // 0.00–0.22: Challenge (fragmented workstations, paper clutter, dim core)
    // 0.22–0.45: Opportunity (workstations align, AI core enters, bridges extend)
    // 0.45–0.70: Transformation (RPA ring & data packets flow, papers clear)
    // 0.70–0.88: Growth (growth pillars elevate cleanly)
    // 0.88–1.00: Future (grand symmetrical overview)
    const alignProgress = THREE.MathUtils.smoothstep(p, 0.15, 0.42);
    const bridgeProgress = THREE.MathUtils.smoothstep(p, 0.22, 0.48);
    const flowProgress = THREE.MathUtils.smoothstep(p, 0.4, 0.68);
    const growthProgress = THREE.MathUtils.smoothstep(p, 0.62, 0.85);
    const futureProgress = THREE.MathUtils.smoothstep(p, 0.82, 1.0);

    // Scroll-driven cinematic camera trajectory + subtle mouse parallax
    const camX =
      THREE.MathUtils.lerp(0.8, 0, alignProgress) +
      (reducedMotion ? 0 : state.pointer.x * 0.25);
    const camY =
      THREE.MathUtils.lerp(2.4, 3.6, growthProgress) +
      futureProgress * 0.5 +
      (reducedMotion ? 0 : state.pointer.y * 0.15);
    const camZ = THREE.MathUtils.lerp(7.6, 6.2, flowProgress) + futureProgress * 1.4;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, camX, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, camY, 0.06);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, camZ, 0.06);
    camera.lookAt(0, 0.45 + growthProgress * 0.25, 0);

    if (rootRef.current && !reducedMotion) {
      rootRef.current.rotation.y =
        THREE.MathUtils.lerp(-0.18, 0, futureProgress) + Math.sin(t * 0.15) * 0.05;
    }

    // 1. Animate 4 department workstations from disconnected chaos -> aligned grid
    STATION_BASE.forEach((s, i) => {
      const grp = stationRefs.current[i];
      if (!grp) return;
      grp.position.x = THREE.MathUtils.lerp(
        s.pos[0] + s.chaosOffset[0],
        s.pos[0],
        alignProgress
      );
      grp.position.y = THREE.MathUtils.lerp(
        s.pos[1] + s.chaosOffset[1],
        s.pos[1],
        alignProgress
      );
      grp.position.z = THREE.MathUtils.lerp(
        s.pos[2] + s.chaosOffset[2],
        s.pos[2],
        alignProgress
      );

      grp.rotation.x = THREE.MathUtils.lerp(s.chaosRot[0], 0, alignProgress);
      grp.rotation.y = THREE.MathUtils.lerp(s.chaosRot[1], 0, alignProgress);
      grp.rotation.z = THREE.MathUtils.lerp(s.chaosRot[2], 0, alignProgress);

      // Paper clutter shrinks away during Transformation
      const paper = paperRefs.current[i];
      if (paper) {
        const paperScale = THREE.MathUtils.clamp(1 - flowProgress * 0.9, 0.001, 1);
        paper.scale.set(1, paperScale, 1);
        paper.visible = paperScale > 0.04;
      }
    });

    // 2. Central AI & Automation Hub descends & illuminates
    if (coreRef.current) {
      coreRef.current.position.y = THREE.MathUtils.lerp(2.8, 0.55, alignProgress);
      const coreScale = THREE.MathUtils.lerp(0.25, 1, alignProgress);
      coreRef.current.scale.setScalar(coreScale);
      if (!reducedMotion) {
        coreRef.current.rotation.y = t * 0.35;
      }
    }

    // 3. Optical bridges connect hub to each workstation
    bridgeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.scale.set(1, Math.max(0.001, bridgeProgress), 1);
      (mesh.material as THREE.MeshBasicMaterial).opacity = bridgeProgress * 0.65;

      // Data packets travel along bridges in Transformation + Growth
      const pkt = packetRefs.current[i];
      if (pkt) {
        pkt.visible = flowProgress > 0.05;
        const cycle = (t * 0.65 + i * 0.25) % 1;
        const bt = bridgeTransforms[i];
        pkt.position.lerpVectors(bt.start, bt.end, cycle);
      }
    });

    // 4. RPA Workflow Ring spins up in Chapter 3
    if (rpaRingRef.current) {
      rpaRingRef.current.scale.setScalar(Math.max(0.001, flowProgress));
      (rpaRingRef.current.material as THREE.MeshBasicMaterial).opacity =
        flowProgress * 0.55;
      if (!reducedMotion) {
        rpaRingRef.current.rotation.z = t * 0.4;
      }
    }

    // 5. Growth Architectural Pillars rise smoothly in Chapter 4
    growthPillarRefs.current.forEach((pillar, i) => {
      if (!pillar) return;
      const targetH = 0.7 + i * 0.32;
      const currentH = THREE.MathUtils.clamp(growthProgress * targetH, 0.001, targetH);
      pillar.scale.set(1, currentH, 1);
      pillar.position.y = currentH * 0.5;
      pillar.visible = growthProgress > 0.03;
    });
  });

  return (
    <group ref={rootRef}>
      {/* Architectural Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial
          color="#13161D"
          roughness={0.5}
          metalness={0.4}
          transparent
          opacity={0.72}
        />
      </mesh>
      <gridHelper args={[12, 24, "#8291EA", "#232838"]} position={[0, 0, 0]} />

      {/* 4 Business Department Workstations (Desk + Glass Monitor + Paper Stack) */}
      {STATION_BASE.map((s, i) => (
        <group
          key={i}
          ref={(el) => {
            stationRefs.current[i] = el;
          }}
          position={s.pos}
        >
          {/* Matte architectural desk slab */}
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[1.15, 0.08, 0.75]} />
            <meshStandardMaterial color="#1F2430" roughness={0.35} metalness={0.6} />
          </mesh>
          {/* Workstation terminal screen */}
          <mesh position={[0, 0.48, -0.14]}>
            <boxGeometry args={[0.78, 0.48, 0.04]} />
            <meshStandardMaterial
              color="#171A22"
              emissive="#8291EA"
              emissiveIntensity={0.18}
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
          {/* Screen border wireframe */}
          <mesh position={[0, 0.48, -0.14]}>
            <boxGeometry args={[0.8, 0.5, 0.045]} />
            <meshBasicMaterial color="#8291EA" wireframe transparent opacity={0.4} />
          </mesh>
          {/* Manual paper stack (shrinks as RPA / software automates) */}
          <mesh
            ref={(el) => {
              paperRefs.current[i] = el;
            }}
            position={[0.32, 0.3, 0.16]}
          >
            <boxGeometry args={[0.24, 0.28, 0.2]} />
            <meshStandardMaterial color="#D6D5D0" roughness={0.85} metalness={0.05} />
          </mesh>
        </group>
      ))}

      {/* Central AI & Automation Hub */}
      <group ref={coreRef} position={[0, 0.55, 0]}>
        <mesh>
          <octahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color="#8291EA"
            emissive="#8291EA"
            emissiveIntensity={0.45}
            roughness={0.15}
            metalness={0.8}
          />
        </mesh>
        <mesh scale={1.45}>
          <icosahedronGeometry args={[0.42, 1]} />
          <meshBasicMaterial color="#FFFFFF" wireframe transparent opacity={0.25} />
        </mesh>
      </group>

      {/* Optical Connection Bridges + Live Data Packets */}
      {bridgeTransforms.map((bt, i) => (
        <React.Fragment key={i}>
          <mesh
            ref={(el) => {
              bridgeRefs.current[i] = el;
            }}
            position={bt.mid}
            quaternion={bt.quat}
          >
            <cylinderGeometry args={[0.018, 0.018, bt.len, 8]} />
            <meshBasicMaterial color="#8291EA" transparent opacity={0} />
          </mesh>
          <mesh
            ref={(el) => {
              packetRefs.current[i] = el;
            }}
            visible={false}
          >
            <sphereGeometry args={[0.065, 10, 10]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </React.Fragment>
      ))}

      {/* Synchronized RPA Workflow Ring */}
      <mesh
        ref={rpaRingRef}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0.4, 0]}
      >
        <torusGeometry args={[1.55, 0.025, 12, isMobile ? 48 : 80]} />
        <meshBasicMaterial color="#8291EA" transparent opacity={0} />
      </mesh>

      {/* Chapter 4 Growth Pillars (Ascending clean architectural columns behind workspace) */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <mesh
          key={i}
          ref={(el) => {
            growthPillarRefs.current[i] = el;
          }}
          position={[x, 0.5, -2.5]}
          visible={false}
        >
          <boxGeometry args={[0.42, 1, 0.42]} />
          <meshStandardMaterial
            color={i === 3 ? "#8291EA" : "#F5F5F2"}
            roughness={0.25}
            metalness={0.35}
            transparent
            opacity={0.88}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function TransformationScene({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const { reducedMotion, isMobile } = useMediaPreferences();

  return (
    <div className="w-full h-full pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0.8, 2.4, 7.6], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 8, 5]} intensity={1.3} color="#FFFFFF" />
        <pointLight position={[0, 2.5, 0]} intensity={2.0} color="#8291EA" distance={10} />
        <TransformationDiorama
          progressRef={progressRef}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}
