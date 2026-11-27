"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  createKartagoBrandTexture,
  createLegacyCostTexture,
  createModernExpectationsTexture,
  createOpportunityTexture,
  createUnifiedSystemTexture,
} from "./screenTextures";

interface ScrollWorld3DCanvasProps {
  /** Normalized scroll progress 0..1 */
  progressRef: React.MutableRefObject<number>;
  /** Reduced motion preference */
  reducedMotion?: boolean;
  /** Called if WebGL fails to initialize */
  onWebGLError?: () => void;
}

const CHAPTER_Z = [0, -26, -52, -78, -104] as const;

const BG_COLORS = [
  new THREE.Color(0xeef2f9), // 01: Sunlit modern lobby
  new THREE.Color(0x1b2130), // 02: Dim legacy operations room
  new THREE.Color(0xe6ecf8), // 03: Crisp engineering studio
  new THREE.Color(0xf7f6f2), // 04: Open executive gallery
  new THREE.Color(0x142b52), // 05: KartagoTech pavilion
];

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lingerEase = (x: number, L = 0.45) => {
  const c = x - 0.5;
  return (1 - L) * x + L * (4 * c * c * c + 0.5);
};

function remapScrollProgress(p: number): number {
  const n = 5;
  const clamped = clamp(p, 0, 1);
  const seg = Math.min(n - 1, Math.floor(clamped * n));
  const local = clamp(clamped * n - seg, 0, 1);
  return (seg + lingerEase(local, 0.45)) / n;
}

/**
 * Continuous interior architectural 3D building flight for KartagoTech's
 * 5-chapter story. Combines a continuous walls/ceiling/glass-portal building
 * shell with the 5 .glb environments and live-rendered UI displays.
 */
export function ScrollWorld3DCanvas({
  progressRef,
  reducedMotion = false,
  onWebGLError,
}: ScrollWorld3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !isMobile,
        powerPreference: "high-performance",
      });
    } catch {
      onWebGLError?.();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !isMobile;
    if (!isMobile) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    const scene = new THREE.Scene();
    const bgColor = BG_COLORS[0].clone();
    scene.background = bgColor;
    const fog = new THREE.Fog(bgColor.getHex(), 14, 46);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(isMobile ? 62 : 48, 1, 0.1, 140);

    // ── Lighting ─────────────────────────────────────────────────────────────
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x9aa8c2, 1.0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaf0, 1.2);
    sunLight.position.set(8, 16, 10);
    if (!isMobile) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.set(1024, 1024);
      sunLight.shadow.camera.near = 1;
      sunLight.shadow.camera.far = 140;
      sunLight.shadow.camera.left = -18;
      sunLight.shadow.camera.right = 18;
      sunLight.shadow.camera.top = 18;
      sunLight.shadow.camera.bottom = -18;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);

    const chLights = [
      { z: CHAPTER_Z[0], color: 0xdce6f8, intensity: 1.5 },
      { z: CHAPTER_Z[1], color: 0xffb366, intensity: 2.0 },
      { z: CHAPTER_Z[2], color: 0x7fa3f5, intensity: 1.8 },
      { z: CHAPTER_Z[3], color: 0xffffff, intensity: 1.7 },
      { z: CHAPTER_Z[4], color: 0x245bdb, intensity: 2.5 },
    ];
    chLights.forEach((l) => {
      const pt = new THREE.PointLight(l.color, l.intensity, 24, 1.4);
      pt.position.set(0, 4.4, l.z + 1.5);
      scene.add(pt);
    });

    // ── Resource Tracking ────────────────────────────────────────────────────
    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    // ── Continuous Interior Building Shell ───────────────────────────────────
    const floorMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xdce3f0,
        roughness: 0.45,
        metalness: 0.08,
      })
    );
    const floor = new THREE.Mesh(track(new THREE.BoxGeometry(15.6, 0.2, 134)), floorMat);
    floor.position.set(0, -0.1, -52);
    floor.receiveShadow = true;
    scene.add(floor);

    const wallMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xeaf0fa,
        roughness: 0.72,
        metalness: 0.05,
      })
    );
    const ceilingMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xf4f6fb,
        roughness: 0.8,
        metalness: 0.04,
      })
    );
    const steelMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x142b52,
        roughness: 0.32,
        metalness: 0.55,
      })
    );
    const glassMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xdbe7ff,
        transparent: true,
        opacity: 0.16,
        roughness: 0.08,
        metalness: 0.1,
      })
    );
    const railMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x245bdb,
        roughness: 0.28,
        metalness: 0.55,
      })
    );

    [-7.6, 7.6].forEach((wx) => {
      const wall = new THREE.Mesh(track(new THREE.BoxGeometry(0.3, 6.2, 134)), wallMat);
      wall.position.set(wx, 3.0, -52);
      wall.receiveShadow = true;
      scene.add(wall);
    });
    const ceiling = new THREE.Mesh(track(new THREE.BoxGeometry(15.6, 0.25, 134)), ceilingMat);
    ceiling.position.set(0, 6.1, -52);
    scene.add(ceiling);

    [-2.8, 2.8].forEach((rx) => {
      const rail = new THREE.Mesh(track(new THREE.BoxGeometry(0.05, 0.02, 124)), railMat);
      rail.position.set(rx, 0.01, -52);
      scene.add(rail);
    });

    const ribGeo = track(new THREE.BoxGeometry(15.2, 0.22, 0.22));
    const colGeo = track(new THREE.BoxGeometry(0.28, 6.0, 0.28));
    for (let z = 8; z >= -112; z -= 6.5) {
      const rib = new THREE.Mesh(ribGeo, steelMat);
      rib.position.set(0, 5.88, z);
      const colL = new THREE.Mesh(colGeo, steelMat);
      colL.position.set(-7.35, 3.0, z);
      const colR = new THREE.Mesh(colGeo, steelMat);
      colR.position.set(7.35, 3.0, z);
      scene.add(rib, colL, colR);
    }

    [-13, -39, -65, -91].forEach((pz) => {
      const pillarL = new THREE.Mesh(track(new THREE.BoxGeometry(0.22, 6.0, 0.22)), steelMat);
      pillarL.position.set(-2.7, 3.0, pz);
      const pillarR = new THREE.Mesh(track(new THREE.BoxGeometry(0.22, 6.0, 0.22)), steelMat);
      pillarR.position.set(2.7, 3.0, pz);
      const transom = new THREE.Mesh(track(new THREE.BoxGeometry(5.62, 0.22, 0.24)), steelMat);
      transom.position.set(0, 4.85, pz);
      const wingL = new THREE.Mesh(track(new THREE.BoxGeometry(4.6, 5.9, 0.05)), glassMat);
      wingL.position.set(-5.1, 2.95, pz);
      const wingR = new THREE.Mesh(track(new THREE.BoxGeometry(4.6, 5.9, 0.05)), glassMat);
      wingR.position.set(5.1, 2.95, pz);
      scene.add(pillarL, pillarR, transom, wingL, wingR);
    });

    // ── Load 5 .glb Interior Environments ────────────────────────────────────
    const gltfLoader = new GLTFLoader();
    let disposed = false;

    const modelConfigs = [
      { url: "/models/scene-modern-plaza.glb", z: CHAPTER_Z[0] },
      { url: "/models/workspace-legacy.glb", z: CHAPTER_Z[1] },
      { url: "/models/workspace-modern.glb", z: CHAPTER_Z[2] },
      { url: "/models/opportunity-gallery.glb", z: CHAPTER_Z[3] },
      { url: "/models/kartagotech-hq.glb", z: CHAPTER_Z[4] },
    ];

    modelConfigs.forEach(({ url, z }) => {
      gltfLoader.load(
        url,
        (gltf) => {
          if (disposed) return;
          const root = gltf.scene;
          root.position.set(0, 0, z);
          root.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
              const mesh = obj as THREE.Mesh;
              mesh.castShadow = !isMobile;
              mesh.receiveShadow = true;
              track(mesh.geometry);
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach(track);
              } else if (mesh.material) {
                track(mesh.material);
              }
            }
          });
          scene.add(root);
        },
        undefined,
        () => {}
      );
    });

    // ── Crisp Live-Rendered UI & Architectural Signage Screens ───────────────
    const addUIScreen = (
      w: number,
      h: number,
      x: number,
      y: number,
      z: number,
      tex: THREE.CanvasTexture,
      rotY = 0
    ) => {
      tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      track(tex);
      const mat = track(new THREE.MeshBasicMaterial({ map: tex }));
      const screen = new THREE.Mesh(track(new THREE.PlaneGeometry(w, h)), mat);
      screen.position.set(x, y, z);
      screen.rotation.y = rotY;

      const bezel = new THREE.Mesh(
        track(new THREE.BoxGeometry(w + 0.14, h + 0.14, 0.06)),
        steelMat
      );
      bezel.position.set(x, y, z - 0.04);
      bezel.rotation.y = rotY;

      scene.add(bezel, screen);
    };

    addUIScreen(5.1, 2.87, 0.2, 2.1, CHAPTER_Z[0] - 2.46, createModernExpectationsTexture());
    addUIScreen(3.9, 2.2, 0.2, 2.1, CHAPTER_Z[1] - 2.96, createLegacyCostTexture());
    addUIScreen(3.9, 2.2, 0.1, 2.1, CHAPTER_Z[2] - 2.75, createUnifiedSystemTexture(), 0.06);
    addUIScreen(3.6, 2.02, 0.2, 2.05, CHAPTER_Z[3] - 2.6, createOpportunityTexture());
    addUIScreen(4.6, 2.6, 0.2, 2.2, CHAPTER_Z[4] - 2.95, createKartagoBrandTexture());

    // ── Continuous Camera Flight Through the Building ────────────────────────
    const xShift = isMobile ? 0 : -1.1;
    const cameraCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(xShift + 0.2, 2.25, 6.2),
        new THREE.Vector3(xShift + 0.1, 2.1, 2.4),
        new THREE.Vector3(xShift + 0.5, 2.0, -13.0),
        new THREE.Vector3(xShift - 0.05, 2.0, CHAPTER_Z[1] + 2.8),
        new THREE.Vector3(xShift - 0.4, 2.1, -39.0),
        new THREE.Vector3(xShift + 0.1, 2.05, CHAPTER_Z[2] + 3.1),
        new THREE.Vector3(xShift + 0.4, 2.1, -65.0),
        new THREE.Vector3(xShift, 2.0, CHAPTER_Z[3] + 3.0),
        new THREE.Vector3(xShift - 0.3, 2.15, -91.0),
        new THREE.Vector3(xShift + 0.1, 2.2, CHAPTER_Z[4] + 3.6),
      ],
      false,
      "catmullrom",
      0.5
    );

    const lookAtCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0.2, 2.0, CHAPTER_Z[0] - 2.5),
        new THREE.Vector3(0.2, 2.0, CHAPTER_Z[0] - 2.5),
        new THREE.Vector3(0.0, 1.9, CHAPTER_Z[1] + 1.0),
        new THREE.Vector3(0.2, 1.95, CHAPTER_Z[1] - 3.0),
        new THREE.Vector3(0.0, 1.9, CHAPTER_Z[2] + 1.0),
        new THREE.Vector3(0.2, 1.95, CHAPTER_Z[2] - 2.8),
        new THREE.Vector3(0.0, 1.9, CHAPTER_Z[3] + 1.0),
        new THREE.Vector3(0.2, 1.95, CHAPTER_Z[3] - 2.6),
        new THREE.Vector3(0.0, 1.95, CHAPTER_Z[4] + 1.0),
        new THREE.Vector3(0.2, 2.1, CHAPTER_Z[4] - 3.0),
      ],
      false,
      "catmullrom",
      0.5
    );

    const handleResize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      if (isMobile || reducedMotion) return;
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 0.45;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * -0.22;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    let rafId = 0;
    let smoothedP = progressRef.current;
    const camPos = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      const targetP = clamp(progressRef.current, 0, 1);
      smoothedP = reducedMotion ? targetP : smoothedP + (targetP - smoothedP) * 0.085;
      const flightP = remapScrollProgress(smoothedP);

      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      cameraCurve.getPointAt(flightP, camPos);
      lookAtCurve.getPointAt(flightP, lookTarget);

      camPos.x += mouse.x;
      camPos.y += mouse.y;

      camera.position.copy(camPos);
      camera.lookAt(lookTarget);

      const chFloat = clamp(smoothedP * 4, 0, 4);
      const idxA = Math.floor(chFloat);
      const idxB = Math.min(4, idxA + 1);
      const frac = chFloat - idxA;
      bgColor.copy(BG_COLORS[idxA]).lerp(BG_COLORS[idxB], frac);
      scene.background = bgColor;
      fog.color.copy(bgColor);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      disposables.forEach((d) => {
        try {
          d.dispose();
        } catch {
          // ignore
        }
      });
      renderer.dispose();
    };
  }, [progressRef, reducedMotion, onWebGLError]);

  return <canvas ref={canvasRef} className="w-full h-full block" aria-hidden="true" />;
}
