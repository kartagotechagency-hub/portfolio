"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMediaPreferences } from "@/lib/useMediaPreferences";

// ─── Animated Canvas Background — Abstract Vision Space ───────────────────
function VisionCanvasBackground({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W * window.devicePixelRatio;
      canvas.height = H * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, W, H);

      // ── Particle lattice — progress-driven convergence ──
      const p = progressRef.current;
      const cx = W * 0.5;
      const cy = H * 0.5;
      const count = 60;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = H * 0.38;

        // Scattered position (start)
        const seed1 = Math.sin(i * 2.3 + 1.1) * W * 0.4;
        const seed2 = Math.cos(i * 1.7 + 0.8) * H * 0.35;

        // Structured position (end) — geometric lattice
        const rows = 6;
        const cols = 10;
        const row = Math.floor(i / cols);
        const col = i % cols;
        const gx = (col / (cols - 1) - 0.5) * W * 0.7;
        const gy = (row / (rows - 1) - 0.5) * H * 0.7;

        // Interpolate between scattered → structure → sphere
        const phase1 = Math.min(1, p * 2); // 0→0.5 scatter→grid
        const phase2 = Math.max(0, Math.min(1, (p - 0.5) * 2)); // 0.5→1 grid→sphere

        let x = seed1 * (1 - phase1) + gx * phase1;
        let y = seed2 * (1 - phase1) + gy * phase1;
        x = x * (1 - phase2) + Math.cos(angle) * radius * phase2;
        y = y * (1 - phase2) + Math.sin(angle) * radius * phase2;

        x += cx + Math.sin(t * 0.3 + i * 0.4) * 2;
        y += cy + Math.cos(t * 0.25 + i * 0.35) * 2;

        const size = 2 + (i % 4 === 0 ? 2 : 0);
        const alpha = 0.3 + p * 0.4;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle =
          i % 5 === 0
            ? `rgba(130,145,234,${alpha})`
            : `rgba(255,255,255,${alpha * 0.4})`;
        ctx.fill();
      }

      t += 0.016;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40"
      aria-hidden="true"
    />
  );
}

// ─── 3D Morphing Particle Lattice ─────────────────────────────────────────────
function MorphingLattice({
  progressRef,
  reducedMotion,
  isMobile,
}: {
  progressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const count = isMobile ? 80 : 160;

  // Three target shapes: scattered, crystalline grid, sphere
  const scattered = useMemo(() => {
    const arr = new Float32Array(count * 3);
    // Seeded pseudo-random for determinism
    for (let i = 0; i < count; i++) {
      const s1 = Math.sin(i * 1.618 + 0.5);
      const s2 = Math.cos(i * 2.399 + 1.2);
      const s3 = Math.sin(i * 0.883 + 2.1);
      arr[i * 3] = s1 * 3.5;
      arr[i * 3 + 1] = s2 * 3.5;
      arr[i * 3 + 2] = s3 * 2.0;
    }
    return arr;
  }, [count]);

  const crystalline = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const side = Math.ceil(Math.cbrt(count));
    for (let i = 0; i < count; i++) {
      const x = (i % side) - side / 2;
      const y = (Math.floor(i / side) % side) - side / 2;
      const z = Math.floor(i / (side * side)) - side / 2;
      arr[i * 3] = x * 0.75;
      arr[i * 3 + 1] = y * 0.75;
      arr[i * 3 + 2] = z * 0.75;
    }
    return arr;
  }, [count]);

  const sphere = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.1;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  // Line segments connecting nearby sphere nodes
  const linePositions = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const ax = sphere[i * 3],
          ay = sphere[i * 3 + 1],
          az = sphere[i * 3 + 2];
        const bx = sphere[j * 3],
          by = sphere[j * 3 + 1],
          bz = sphere[j * 3 + 2];
        const dist = Math.sqrt(
          (ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2
        );
        if (dist < 1.2) {
          pts.push(ax, ay, az, bx, by, bz);
        }
      }
    }
    return new Float32Array(pts);
  }, [sphere, count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const p = progressRef.current;
    const t = state.clock.elapsedTime;

    // Three-phase morphing
    const p1 = reducedMotion ? 1 : Math.min(1, p * 2.2); // scattered → crystalline
    const p2 = reducedMotion ? 1 : Math.max(0, Math.min(1, (p - 0.4) * 2.5)); // crystalline → sphere

    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const wobble = reducedMotion
        ? 0
        : Math.sin(t * 0.6 + i * 0.3) * 0.04 * (1 - p2);

      const sc = scattered[i * 3];
      const sy = scattered[i * 3 + 1];
      const sz = scattered[i * 3 + 2];
      const cx = crystalline[i * 3];
      const cy = crystalline[i * 3 + 1];
      const cz = crystalline[i * 3 + 2];
      const sx2 = sphere[i * 3];
      const sy2 = sphere[i * 3 + 1];
      const sz2 = sphere[i * 3 + 2];

      let x = sc + (cx - sc) * p1;
      let y = sy + (cy - sy) * p1;
      let z = sz + (cz - sz) * p1;
      x = x + (sx2 - x) * p2 + wobble;
      y = y + (sy2 - y) * p2 + wobble * 0.7;
      z = z + (sz2 - z) * p2;

      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    posAttr.needsUpdate = true;

    // Fade line segments in with sphere phase
    if (linesRef.current) {
      (linesRef.current.material as THREE.LineBasicMaterial).opacity =
        p2 * 0.35;
    }

    if (!reducedMotion) {
      pointsRef.current.rotation.y = t * 0.08;
      if (linesRef.current) linesRef.current.rotation.y = t * 0.08;
    }
  });

  return (
    <group>
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
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      {/* Crystalline connection lines — fade in as sphere forms */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#8291EA" transparent opacity={0} />
      </lineSegments>
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
    <div className="w-full h-full relative" aria-hidden="true">
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0, 6.5], fov: 44 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 4]} intensity={1.5} color="#8291EA" />
        <directionalLight position={[3, 4, 2]} intensity={0.7} color="#FFFFFF" />
        <MorphingLattice
          progressRef={progressRef}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}
