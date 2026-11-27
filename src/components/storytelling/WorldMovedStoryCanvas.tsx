"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface WorldMovedStoryCanvasProps {
  /** Normalized scroll progress 0..1 */
  progressRef: React.MutableRefObject<number>;
  /** Reduced motion preference */
  reducedMotion?: boolean;
  /** Called if WebGL fails to initialize */
  onWebGLError?: () => void;
}

const CHAPTER_Z = [0, -26, -52, -78, -104] as const;

const BG_COLORS = [
  new THREE.Color(0xeef2f9), // 01: Bright modern daylight
  new THREE.Color(0x1b1f29), // 02: Dim legacy cost
  new THREE.Color(0xe6ecf8), // 03: Crisp studio blue-white
  new THREE.Color(0xf7f6f2), // 04: Open warm ivory
  new THREE.Color(0x142b52), // 05: KartagoTech deep navy
];

/**
 * Scroll-controlled 3D storytelling canvas loading 5 genuine PBR .glb environments
 * with real shadows, lighting mood transitions, and integrated photo/video screens.
 */
export function WorldMovedStoryCanvas({
  progressRef,
  reducedMotion = false,
  onWebGLError,
}: WorldMovedStoryCanvasProps) {
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
    renderer.toneMappingExposure = 1.06;
    renderer.shadowMap.enabled = !isMobile;
    if (!isMobile) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    const scene = new THREE.Scene();
    const bgColor = BG_COLORS[0].clone();
    scene.background = bgColor;
    const fog = new THREE.Fog(bgColor.getHex(), 12, 46);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(isMobile ? 64 : 50, 1, 0.1, 140);

    // ── Lighting ─────────────────────────────────────────────────────────────
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x9aa8c2, 0.95);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaf0, 1.25);
    sunLight.position.set(10, 18, 12);
    if (!isMobile) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.set(1024, 1024);
      sunLight.shadow.camera.near = 1;
      sunLight.shadow.camera.far = 140;
      sunLight.shadow.camera.left = -20;
      sunLight.shadow.camera.right = 20;
      sunLight.shadow.camera.top = 20;
      sunLight.shadow.camera.bottom = -20;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);

    // Per-chapter mood lights
    const chLights = [
      { z: CHAPTER_Z[0], color: 0xdce6f8, intensity: 1.4 },
      { z: CHAPTER_Z[1], color: 0xffb366, intensity: 2.2 }, // warm desk-lamp legacy
      { z: CHAPTER_Z[2], color: 0x7fa3f5, intensity: 1.8 }, // studio blue
      { z: CHAPTER_Z[3], color: 0xffffff, intensity: 1.6 }, // bright opportunity
      { z: CHAPTER_Z[4], color: 0x245bdb, intensity: 2.4 }, // KartagoTech accent
    ];
    chLights.forEach((l) => {
      const pt = new THREE.PointLight(l.color, l.intensity, 22, 1.4);
      pt.position.set(0, 4.2, l.z + 1.5);
      scene.add(pt);
    });

    // ── Resource Tracking ────────────────────────────────────────────────────
    const disposables: Array<{ dispose: () => void }> = [];
    const videoElements: HTMLVideoElement[] = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const texLoader = new THREE.TextureLoader();

    const loadPhotoTexture = (url: string) => {
      const tex = texLoader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      track(tex);
      return tex;
    };

    const makeMediaMaterial = (
      videoSrc: string | null,
      photoSrc: string
    ): THREE.MeshBasicMaterial => {
      const fallbackTex = loadPhotoTexture(photoSrc);
      const mat = track(new THREE.MeshBasicMaterial({ map: fallbackTex }));

      if (videoSrc && !isMobile && !reducedMotion) {
        const video = document.createElement("video");
        video.src = videoSrc;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.crossOrigin = "anonymous";
        videoElements.push(video);

        video.addEventListener(
          "canplay",
          () => {
            const vTex = track(new THREE.VideoTexture(video));
            vTex.colorSpace = THREE.SRGBColorSpace;
            vTex.minFilter = THREE.LinearFilter;
            vTex.magFilter = THREE.LinearFilter;
            mat.map = vTex;
            mat.needsUpdate = true;
          },
          { once: true }
        );
        video.play().catch(() => {
          // Keep photo texture if autoplay is blocked
        });
      }
      return mat;
    };

    // ── Continuous Architectural Floor & Pathway ─────────────────────────────
    const floorMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xdce3f0,
        roughness: 0.48,
        metalness: 0.08,
      })
    );
    const floor = new THREE.Mesh(
      track(new THREE.BoxGeometry(36, 0.2, 140)),
      floorMat
    );
    floor.position.set(0, -0.1, -52);
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle architectural floor guide rails connecting all 5 chapters
    const railMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x245bdb,
        roughness: 0.3,
        metalness: 0.5,
      })
    );
    [-2.8, 2.8].forEach((rx) => {
      const rail = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.05, 0.02, 120)),
        railMat
      );
      rail.position.set(rx, 0.01, -52);
      scene.add(rail);
    });

    // ── Load 5 Genuine .glb 3D Environments ──────────────────────────────────
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
        () => {
          // Graceful handling if a model fails to load
        }
      );
    });

    // ── Integrated Photographic & Video Architectural Screens ────────────────
    const addDisplayScreen = (
      w: number,
      h: number,
      x: number,
      y: number,
      z: number,
      videoSrc: string | null,
      photoSrc: string,
      rotY = 0
    ) => {
      const screen = new THREE.Mesh(
        track(new THREE.PlaneGeometry(w, h)),
        makeMediaMaterial(videoSrc, photoSrc)
      );
      screen.position.set(x, y, z);
      screen.rotation.y = rotY;
      scene.add(screen);
    };

    // Ch 1: Modern world changing expectations
    addDisplayScreen(
      5.1,
      2.9,
      0,
      2.1,
      CHAPTER_Z[0] - 2.46,
      "/videos/realization.mp4",
      "/images/story/story-05-future.png"
    );

    // Ch 2: Legacy manual process & cost of standing still
    addDisplayScreen(
      4.3,
      2.45,
      0,
      2.2,
      CHAPTER_Z[1] - 1.3,
      "/videos/challenge.mp4",
      "/images/story/story-01-challenge.png"
    );

    // Ch 3: Transformation through software, AI & automation
    addDisplayScreen(
      4.7,
      2.65,
      0,
      2.25,
      CHAPTER_Z[2] - 1.35,
      "/videos/transformation.mp4",
      "/images/story/story-03-transformation.png"
    );
    // Secondary AI reflection photo on right studio panel
    addDisplayScreen(
      2.2,
      1.4,
      -3.4,
      1.65,
      CHAPTER_Z[2] - 0.6,
      null,
      "/images/story/story-02-opportunity.png",
      0.38
    );

    // Ch 4: Turning technology into opportunity
    addDisplayScreen(
      5.3,
      2.85,
      0,
      2.25,
      CHAPTER_Z[3] - 2.08,
      "/videos/growth.mp4",
      "/images/story/story-04-growth.png"
    );

    // Ch 5: KartagoTech HQ reveal & office reality
    addDisplayScreen(
      5.5,
      2.95,
      0,
      2.25,
      CHAPTER_Z[4] - 2.28,
      null,
      "/assets/images/about-office.jpg"
    );

    // ── Smooth Scroll-Controlled Camera Spline ───────────────────────────────
    const camPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.4, 2.0, CHAPTER_Z[0] + 7.2),
      new THREE.Vector3(-0.7, 1.85, CHAPTER_Z[1] + 5.8),
      new THREE.Vector3(0.7, 1.85, CHAPTER_Z[2] + 5.8),
      new THREE.Vector3(-0.6, 2.0, CHAPTER_Z[3] + 6.4),
      new THREE.Vector3(0.0, 2.05, CHAPTER_Z[4] + 6.8),
    ]);

    const lookPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.9, CHAPTER_Z[0] - 2.0),
      new THREE.Vector3(0, 1.75, CHAPTER_Z[1] - 1.0),
      new THREE.Vector3(0, 1.85, CHAPTER_Z[2] - 1.0),
      new THREE.Vector3(0, 1.9, CHAPTER_Z[3] - 1.6),
      new THREE.Vector3(0, 2.0, CHAPTER_Z[4] - 2.0),
    ]);

    // ── Render Loop ──────────────────────────────────────────────────────────
    let currentProgress = 0;
    let mx = 0;
    let my = 0;
    let rafId = 0;

    const camPos = new THREE.Vector3();
    const lookPos = new THREE.Vector3();
    const lerpedBg = new THREE.Color();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w < 768 ? 64 : 50;
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handlePointerMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", handlePointerMove);

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      const target = progressRef.current;
      currentProgress += (target - currentProgress) * (reducedMotion ? 1 : 0.07);
      const u = Math.max(0, Math.min(1, currentProgress));

      camPath.getPointAt(u, camPos);
      lookPath.getPointAt(u, lookPos);

      camera.position.set(
        camPos.x + mx * 0.55,
        camPos.y - my * 0.25,
        camPos.z
      );
      camera.lookAt(
        lookPos.x + mx * 1.1,
        lookPos.y - my * 0.25,
        lookPos.z
      );

      // Interpolate background & fog color across the 5 chapters
      const scaled = u * (BG_COLORS.length - 1);
      const i0 = Math.min(BG_COLORS.length - 2, Math.floor(scaled));
      const frac = scaled - i0;
      lerpedBg.copy(BG_COLORS[i0]).lerp(BG_COLORS[i0 + 1], frac);
      bgColor.copy(lerpedBg);
      fog.color.copy(lerpedBg);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      videoElements.forEach((v) => {
        v.pause();
        v.removeAttribute("src");
        v.load();
      });
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [progressRef, reducedMotion, onWebGLError]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
