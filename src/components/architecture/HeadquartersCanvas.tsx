"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface HeadquartersCanvasProps {
  /** Ref holding normalized scroll progress 0..1 */
  progressRef: React.MutableRefObject<number>;
  /** Whether user prefers reduced motion */
  reducedMotion?: boolean;
  /** Locale for 3D signage */
  locale?: "en" | "fr";
  /** Called if WebGL fails to initialize so the parent can render the fallback */
  onWebGLError?: () => void;
}

/**
 * Restored & elevated 3D KartagoTech Agency building & continuous corridor.
 *
 * Matches the spatial layout of kartagotech-3d-batiment.html:
 * - Recognizable exterior facade at Z = 0 with KartagoTech signage, glass curtain wall,
 *   trees, and motorized sliding entrance doors.
 * - Long continuous interior corridor (X = -3 to +1.5) with blue architectural frames,
 *   ceiling light strips, and plants.
 * - 8 sequential stops (STEP = 20):
 *   0: Entrance (Exterior)
 *   1: Direction
 *   2: Development
 *   3: Design & 3D
 *   4: AI & Automation
 *   5: Clients
 *   6: Projects
 *   7: Reception & Contact
 */
export function HeadquartersCanvas({
  progressRef,
  reducedMotion = false,
  locale = "en",
  onWebGLError,
}: HeadquartersCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobileViewport = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !isMobileViewport,
        powerPreference: "high-performance",
      });
    } catch {
      onWebGLError?.();
      return;
    }

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, isMobileViewport ? 1.5 : 2)
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !isMobileViewport;
    if (!isMobileViewport) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    const scene = new THREE.Scene();
    const bgColor = 0xeef2f9;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.Fog(bgColor, 18, 78);

    const camera = new THREE.PerspectiveCamera(
      isMobileViewport ? 72 : 60,
      1,
      0.1,
      180
    );

    // ── Lighting ─────────────────────────────────────────────────────────────
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcad5eb, 1.05);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffdf8, 0.85);
    dirLight.position.set(-6, 14, 12);
    if (!isMobileViewport) {
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.set(1024, 1024);
      dirLight.shadow.camera.near = 1;
      dirLight.shadow.camera.far = 90;
      dirLight.shadow.camera.left = -22;
      dirLight.shadow.camera.right = 22;
      dirLight.shadow.camera.top = 22;
      dirLight.shadow.camera.bottom = -22;
      dirLight.shadow.bias = -0.0005;
    }
    scene.add(dirLight);

    const corridorFill = new THREE.DirectionalLight(0xdce6f8, 0.35);
    corridorFill.position.set(10, 8, -40);
    scene.add(corridorFill);

    // ── Resource Tracking & Helpers ──────────────────────────────────────────
    const disposables: Array<{ dispose: () => void }> = [];
    const videoElements: HTMLVideoElement[] = [];

    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const matCache = new Map<string, THREE.MeshStandardMaterial>();
    const M = (
      color: number,
      opacity = 1,
      roughness = 0.52,
      metalness = 0.08
    ): THREE.MeshStandardMaterial => {
      const key = `${color}|${opacity}|${roughness}|${metalness}`;
      const existing = matCache.get(key);
      if (existing) return existing;
      const mat = track(
        new THREE.MeshStandardMaterial({
          color,
          roughness,
          metalness,
          transparent: opacity < 1,
          opacity,
        })
      );
      matCache.set(key, mat);
      return mat;
    };

    const BM = (color: number) =>
      track(new THREE.MeshBasicMaterial({ color }));

    const glassMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x9fc0ff,
        roughness: 0.08,
        metalness: 0.05,
        transmission: 0.35,
        transparent: true,
        opacity: 0.24,
      })
    );

    const doorGlassMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x9fc0ff,
        roughness: 0.06,
        metalness: 0.1,
        transparent: true,
        opacity: 0.52,
      })
    );

    const B = (
      w: number,
      h: number,
      d: number,
      color: number,
      x: number,
      y: number,
      z: number,
      parent: THREE.Object3D = scene,
      mat?: THREE.Material,
      castShadow = false
    ) => {
      const geo = track(new THREE.BoxGeometry(w, h, d));
      const mesh = new THREE.Mesh(geo, mat || M(color));
      mesh.position.set(x, y, z);
      mesh.castShadow = !isMobileViewport && castShadow;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    const makeTexture = (
      w: number,
      h: number,
      draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
    ) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (ctx) draw(ctx, w, h);
      const t = track(new THREE.CanvasTexture(c));
      t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };

    const makeVideoMaterial = (
      src: string,
      fallbackTex: THREE.Texture
    ): THREE.MeshBasicMaterial => {
      if (reducedMotion || isMobileViewport) {
        return track(new THREE.MeshBasicMaterial({ map: fallbackTex }));
      }
      const video = document.createElement("video");
      video.src = src;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.crossOrigin = "anonymous";
      videoElements.push(video);

      const mat = track(new THREE.MeshBasicMaterial({ map: fallbackTex }));
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
        // Keep fallback canvas texture if autoplay is blocked
      });
      return mat;
    };

    const makeSign = (
      title: string,
      subtitle: string,
      w: number,
      h: number,
      bg: string,
      fg: string
    ) => {
      const tex = makeTexture(512, Math.round((512 * h) / w), (g, W, H) => {
        g.fillStyle = bg;
        g.fillRect(0, 0, W, H);
        g.fillStyle = "rgba(255,255,255,0.18)";
        g.fillRect(0, H - 6, W, 6);
        g.fillStyle = fg;
        g.textBaseline = "middle";
        g.font = `700 ${Math.round(H * 0.34)}px "Space Grotesk", Inter, Arial, sans-serif`;
        g.fillText(title, W * 0.06, H * 0.38);
        g.fillStyle = "rgba(255,255,255,0.82)";
        g.font = `500 ${Math.round(H * 0.16)}px Inter, Arial, sans-serif`;
        g.fillText(subtitle, W * 0.06, H * 0.72);
      });
      return new THREE.Mesh(
        track(new THREE.PlaneGeometry(w, h)),
        track(new THREE.MeshBasicMaterial({ map: tex }))
      );
    };

    const hexStr = (c: number) => "#" + c.toString(16).padStart(6, "0");

    // ── Spatial Constants (matching kartagotech-3d-batiment.html) ─────────────
    const N = 8;
    const STEP = 20;
    const roomZ = (i: number) => 8 - i * STEP - 9; // -21, -41, -61, -81, -101, -121, -141

    // ── 1. GROUND, PLAZA, CORRIDOR & CEILING ─────────────────────────────────
    B(70, 0.04, 240, 0xdce3f0, 0, -0.02, -90);
    B(70, 0.04, 30, 0xbfcbe0, 0, -0.01, 15);
    B(3.8, 0.02, 166, 0xe9eef7, -0.8, 0.005, -83);

    // Left corridor wall (X = -3)
    B(0.18, 3.6, 168, 0xf4f6fb, -3, 1.8, -84);
    B(0.06, 0.14, 168, 0x142b52, -2.9, 0.07, -84);
    // Continuous ceiling
    B(16, 0.16, 168, 0xffffff, 5, 3.6, -84);
    // Recessed ceiling light strips
    [1, 5, 9].forEach((x) => {
      B(0.28, 0.03, 164, 0xffffff, x, 3.51, -84, scene, BM(0xffffff));
    });

    // Blue architectural rib frames along corridor wall
    const ribGeo = track(new THREE.BoxGeometry(0.1, 3.55, 0.36));
    const ribEdges = track(new THREE.EdgesGeometry(ribGeo));
    const ribLineMat = track(new THREE.LineBasicMaterial({ color: 0x245bdb }));
    for (let z = -4; z >= -162; z -= 6) {
      const f = new THREE.LineSegments(ribEdges, ribLineMat);
      f.position.set(-2.9, 1.8, z);
      scene.add(f);
    }

    // Potted architectural plants
    const addPlant = (x: number, z: number) => {
      B(0.38, 0.42, 0.38, 0xcbd5e8, x, 0.21, z, scene, M(0xcbd5e8), true);
      B(0.34, 0.04, 0.34, 0x4a3b2c, x, 0.43, z);
      const foliageGeo = track(new THREE.SphereGeometry(0.34, 14, 10));
      const foliage = new THREE.Mesh(foliageGeo, M(0x4c8c5a, 1, 0.7));
      foliage.position.set(x, 0.78, z);
      foliage.castShadow = !isMobileViewport;
      scene.add(foliage);
      const topGeo = track(new THREE.SphereGeometry(0.22, 12, 8));
      const top = new THREE.Mesh(topGeo, M(0x5da26c, 1, 0.7));
      top.position.set(x + 0.08, 1.02, z - 0.06);
      scene.add(top);
    };

    for (let z = -6; z >= -156; z -= 10) {
      addPlant(-2.45, z);
    }

    // ── 2. EXTERIOR BUILDING FACADE (Z = 0) ──────────────────────────────────
    const facadeTex = makeTexture(512, 560, (g, W, H) => {
      g.fillStyle = "#142B52";
      g.fillRect(0, 0, W, H);
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 7; c++) {
          const lit = (r * 7 + c) % 3 !== 0;
          g.fillStyle = lit ? "#7FA3F5" : "#DCE6F8";
          g.fillRect(24 + c * 70, 28 + r * 66, 52, 44);
        }
      }
    });

    const addFacadePanel = (w: number, h: number, x: number, y: number) => {
      const m = new THREE.Mesh(
        track(new THREE.PlaneGeometry(w, h)),
        track(new THREE.MeshBasicMaterial({ map: facadeTex }))
      );
      m.position.set(x, y, 0.02);
      scene.add(m);
      B(w, h, 0.4, 0x142b52, x, y, -0.2);
    };
    addFacadePanel(14, 14, -10, 7);
    addFacadePanel(14, 14, 10, 7);
    addFacadePanel(6, 8, 0, 10);

    // Entrance canopy & fascia
    B(6.6, 0.42, 1.4, 0x245bdb, 0, 6.2, 0.55, scene, M(0x245bdb), true);
    B(6.8, 0.14, 1.5, 0x142b52, 0, 6.45, 0.55);

    // Illuminated KartagoTech Facade Sign
    const mainSign = makeSign(
      "KartagoTech",
      locale === "fr"
        ? "Agency — Solutions digitales"
        : "Agency — Digital Solutions",
      5.8,
      1.55,
      "#142B52",
      "#FFFFFF"
    );
    mainSign.position.set(0, 9.8, 0.08);
    scene.add(mainSign);

    // Motorized Sliding Glass Entrance Doors
    const doorLeft = B(3, 6, 0.22, 0x9fc0ff, -1.5, 3, 0.12, scene, doorGlassMat);
    const doorRight = B(3, 6, 0.22, 0x9fc0ff, 1.5, 3, 0.12, scene, doorGlassMat);
    B(0.1, 6, 0.28, 0x142b52, 1.44, 0, 0, doorLeft);
    B(0.1, 6, 0.28, 0x142b52, -1.44, 0, 0, doorRight);
    B(0.06, 0.9, 0.34, 0xffffff, 1.25, -0.2, 0.05, doorLeft);
    B(0.06, 0.9, 0.34, 0xffffff, -1.25, -0.2, 0.05, doorRight);

    // Exterior trees flanking entrance plaza
    for (let k = 0; k < 4; k++) {
      const sx = k < 2 ? -1 : 1;
      const tx = sx * (8.5 + (k % 2) * 5.2);
      const tz = 6.8 + (k % 2) * 1.4;
      B(0.32, 1.6, 0.32, 0x6b4a2e, tx, 0.8, tz, scene, M(0x6b4a2e), true);
      const crown = new THREE.Mesh(
        track(new THREE.ConeGeometry(1.3, 3.3, 14)),
        M(0x4c8c5a, 1, 0.72)
      );
      crown.position.set(tx, 3.05, tz);
      crown.castShadow = !isMobileViewport;
      scene.add(crown);
    }

    // ── 3. NATURAL 3D HUMAN FIGURES (No invented names) ─────────────────────
    interface PersonAnim {
      armL: THREE.Object3D;
      armR: THREE.Object3D;
      head: THREE.Object3D;
      phase: number;
    }
    const people: PersonAnim[] = [];
    const SKIN_TONES = [0xf1c9a5, 0xd9a07a, 0xa8704b, 0x7a4a2e];
    const SHIRTS = [0x245bdb, 0xffffff, 0x7fa3f5, 0xdce6f8, 0x142b52];
    const HAIR_COLORS = [0x1b1b1b, 0x4a3223, 0x8a6a3b, 0x2c221e];
    let personCounter = 0;

    const addSeatedPerson = (x: number, z: number, facingRad = Math.PI / 2) => {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.rotation.y = facingRad;

      const shirt = SHIRTS[personCounter % SHIRTS.length];
      const skin = SKIN_TONES[personCounter % SKIN_TONES.length];
      const hair = HAIR_COLORS[personCounter % HAIR_COLORS.length];
      personCounter++;

      B(0.42, 0.52, 0.25, shirt, 0, 0.98, 0, g, M(shirt), true);
      B(0.11, 0.1, 0.11, skin, 0, 1.28, 0, g);
      const head = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.145, 16, 12)),
        M(skin, 1, 0.65)
      );
      head.position.set(0, 1.44, 0);
      head.castShadow = !isMobileViewport;
      g.add(head);
      B(0.3, 0.1, 0.29, hair, 0, 1.54, 0.02, g);

      const armL = B(0.1, 0.1, 0.46, shirt, -0.26, 0.98, -0.2, g);
      const armR = B(0.1, 0.1, 0.46, shirt, 0.26, 0.98, -0.2, g);

      B(0.4, 0.12, 0.48, 0x2b3a55, 0, 0.56, -0.16, g);
      B(0.12, 0.48, 0.12, 0x2b3a55, -0.12, 0.28, -0.38, g);
      B(0.12, 0.48, 0.12, 0x2b3a55, 0.12, 0.28, -0.38, g);

      // Ergonomic office chair
      B(0.52, 0.06, 0.5, 0x3a4a66, 0, 0.46, -0.04, g);
      B(0.5, 0.54, 0.06, 0x3a4a66, 0, 0.76, 0.22, g);
      B(0.06, 0.38, 0.06, 0x142b52, 0, 0.24, 0, g);
      B(0.48, 0.04, 0.06, 0x142b52, 0, 0.04, 0, g);
      B(0.06, 0.04, 0.48, 0x142b52, 0, 0.04, 0, g);

      scene.add(g);
      people.push({ armL, armR, head, phase: personCounter * 1.37 });
    };

    const addWorkstation = (
      dx: number,
      dz: number,
      screenColor: number,
      withPerson = true
    ) => {
      B(0.92, 0.05, 1.6, 0xffffff, dx, 0.75, dz, scene, M(0xffffff, 1, 0.35), true);
      B(0.05, 0.74, 1.48, 0xb9c8e8, dx, 0.37, dz);
      B(0.06, 0.22, 0.22, 0x142b52, dx - 0.32, 0.86, dz);
      B(0.04, 0.46, 0.84, 0x142b52, dx - 0.32, 1.06, dz);
      B(0.02, 0.4, 0.76, screenColor, dx - 0.29, 1.06, dz, scene, BM(screenColor));
      B(0.16, 0.02, 0.44, 0x142b52, dx - 0.02, 0.785, dz - 0.05);
      B(0.18, 0.01, 0.22, 0x245bdb, dx - 0.02, 0.78, dz + 0.34);

      if (withPerson) {
        addSeatedPerson(dx + 0.82, dz);
      }
    };

    // ── 4. SCREEN TEXTURES FOR REAL KARTAGOTECH CAPABILITIES & PROJECTS ───────
    const makeScreenCanvas = (
      title: string,
      subtitle: string,
      items: Array<{ tag: string; text: string }>
    ) =>
      makeTexture(640, 360, (g, W, H) => {
        g.fillStyle = "#142B52";
        g.fillRect(0, 0, W, H);
        g.strokeStyle = "#245BDB";
        g.lineWidth = 4;
        g.strokeRect(12, 12, W - 24, H - 24);
        g.fillStyle = "#7FA3F5";
        g.font = "700 18px Inter, Arial, sans-serif";
        g.fillText(subtitle, 34, 54);
        g.fillStyle = "#FFFFFF";
        g.font = '700 30px "Space Grotesk", Inter, Arial, sans-serif';
        g.fillText(title, 34, 92);
        items.forEach((item, idx) => {
          const y = 122 + idx * 72;
          g.fillStyle = "rgba(255,255,255,0.08)";
          g.fillRect(34, y, W - 68, 56);
          g.fillStyle = "#7FA3F5";
          g.font = "700 13px Inter, Arial, sans-serif";
          g.fillText(item.tag, 50, y + 22);
          g.fillStyle = "#DCE6F8";
          g.font = "500 16px Inter, Arial, sans-serif";
          g.fillText(item.text, 50, y + 44);
        });
      });

    // ── 5. SEVEN INTERIOR DEPARTMENTS ALONG THE CORRIDOR ─────────────────────
    interface DeptSpec {
      index: number;
      title: Record<"en" | "fr", string>;
      sub: Record<"en" | "fr", string>;
      color: number;
      desks: number;
    }

    const DEPTS: DeptSpec[] = [
      {
        index: 1,
        title: { en: "Direction", fr: "Direction" },
        sub: { en: "Vision & Strategy", fr: "Vision et stratégie" },
        color: 0x142b52,
        desks: 2,
      },
      {
        index: 2,
        title: { en: "Development", fr: "Développement" },
        sub: { en: "Web, Apps & Custom Software", fr: "Sites, applications, logiciels" },
        color: 0x245bdb,
        desks: 4,
      },
      {
        index: 3,
        title: { en: "Design & 3D", fr: "Design & 3D" },
        sub: { en: "Interfaces & 3D Experiences", fr: "Interfaces et expériences 3D" },
        color: 0x4f7de8,
        desks: 3,
      },
      {
        index: 4,
        title: { en: "AI & Automation", fr: "IA & automatisation" },
        sub: { en: "Assistants & RPA Workflows", fr: "Assistants et workflows" },
        color: 0x2e6f95,
        desks: 3,
      },
      {
        index: 5,
        title: { en: "Clients", fr: "Clients" },
        sub: { en: "Partnership & Delivery", fr: "Relation et accompagnement" },
        color: 0x3b4f8f,
        desks: 2,
      },
      {
        index: 6,
        title: { en: "Projects", fr: "Projets" },
        sub: { en: "Selected Realizations", fr: "Gestion et réalisations" },
        color: 0x245bdb,
        desks: 2,
      },
      {
        index: 7,
        title: { en: "Reception & Contact", fr: "Accueil & contact" },
        sub: { en: "Let's Build Together", fr: "Parlons de votre projet" },
        color: 0x142b52,
        desks: 1,
      },
    ];

    let animKnot: THREE.Mesh | null = null;
    let animNodes: THREE.Group | null = null;
    let animPortal: THREE.Mesh | null = null;

    DEPTS.forEach((d) => {
      const i = d.index;
      const zc = roomZ(i);
      const col = d.color;

      B(10, 0.04, 12, col, 6.5, 0.02, zc, scene, M(col, 0.16));
      B(0.14, 3.6, 12, 0xffffff, 11.5, 1.8, zc);
      B(0.05, 3.55, 12, 0x9fc0ff, 1.5, 1.78, zc, scene, glassMat);
      B(10, 3.55, 0.06, 0x9fc0ff, 6.5, 1.78, zc + 6, scene, glassMat);
      B(10, 3.55, 0.06, 0x9fc0ff, 6.5, 1.78, zc - 6, scene, glassMat);

      B(10, 0.12, 0.12, col, 6.5, 3.45, zc + 6);
      B(0.12, 3.55, 0.12, col, 1.5, 1.78, zc + 6);
      B(0.12, 3.55, 0.12, col, 1.5, 1.78, zc - 6);

      const deptSign = makeSign(
        d.title[locale],
        d.sub[locale],
        5.2,
        1.25,
        hexStr(col),
        "#ffffff"
      );
      deptSign.rotation.y = -Math.PI / 2;
      deptSign.position.set(11.41, 2.75, zc);
      scene.add(deptSign);

      for (let k = 0; k < d.desks; k++) {
        const dx = 3.9 + (k % 2) * 3.3;
        const dz = zc - 2.3 + Math.floor(k / 2) * 4.4;
        addWorkstation(dx, dz, i === 2 ? 0x7fa3f5 : 0xb9d2ff, true);
      }

      addPlant(10.85, zc - 5.2);
      addPlant(2.15, zc + 5.2);

      if (i === 1) {
        B(3.2, 0.08, 1.3, 0x142b52, 8.6, 0.76, zc + 3.0, scene, M(0x142b52), true);
        B(0.12, 0.72, 0.12, 0x142b52, 8.6, 0.36, zc + 3.0);
        for (let k = 0; k < 4; k++) {
          B(
            0.52,
            0.52,
            0.52,
            0x3a4a66,
            7.6 + (k % 2) * 2.0,
            0.26,
            zc + 2.1 + Math.floor(k / 2) * 1.8
          );
        }
        const dirTex = makeScreenCanvas(
          "KARTAGOTECH STRATEGY",
          "DIRECTION & ARCHITECTURE",
          [
            { tag: "01 // CUSTOM SOFTWARE", text: "Tailored platforms & SaaS architecture" },
            { tag: "02 // APPLIED AI", text: "Assistants, RAG & workflow automation" },
          ]
        );
        const dirScreen = new THREE.Mesh(
          track(new THREE.PlaneGeometry(3.4, 1.8)),
          makeVideoMaterial("/videos/realization.mp4", dirTex)
        );
        dirScreen.rotation.y = -Math.PI / 2;
        dirScreen.position.set(11.41, 1.25, zc + 2.8);
        scene.add(dirScreen);
      }

      if (i === 2) {
        [-4.8, 4.8].forEach((offset) => {
          B(0.85, 2.3, 0.85, 0x142b52, 10.75, 1.15, zc + offset, scene, M(0x142b52), true);
          for (let k = 0; k < 6; k++) {
            B(
              0.52,
              0.05,
              0.02,
              k % 2 ? 0x7fffb0 : 0x7fa3f5,
              10.32,
              0.42 + k * 0.3,
              zc + offset,
              scene,
              BM(k % 2 ? 0x7fffb0 : 0x7fa3f5)
            );
          }
        });
        const devTex = makeScreenCanvas(
          "SOFTWARE STUDIO",
          "NEXT.JS · TYPESCRIPT · SAAS",
          [
            { tag: "LIVE BUILD", text: "Multi-tenant platforms & APIs" },
            { tag: "QUALITY", text: "Strict typing & automated pipelines" },
          ]
        );
        const devScreen = new THREE.Mesh(
          track(new THREE.PlaneGeometry(3.6, 1.9)),
          makeVideoMaterial("/videos/transformation.mp4", devTex)
        );
        devScreen.rotation.y = -Math.PI / 2;
        devScreen.position.set(11.41, 1.2, zc);
        scene.add(devScreen);
      }

      if (i === 3) {
        B(0.95, 0.55, 0.95, 0xffffff, 9.7, 0.275, zc + 3.0, scene, M(0xffffff), true);
        const knot = new THREE.Mesh(
          track(new THREE.TorusKnotGeometry(0.36, 0.12, 80, 14)),
          M(0x245bdb, 1, 0.25, 0.45)
        );
        knot.position.set(9.7, 1.25, zc + 3.0);
        knot.castShadow = !isMobileViewport;
        scene.add(knot);
        animKnot = knot;

        const designTex = makeScreenCanvas(
          "DESIGN & 3D PRODUCTION",
          "INTERFACES · MOTION · WEBGL",
          [
            { tag: "DESIGN SYSTEMS", text: "Swiss-grade typography & clarity" },
            { tag: "3D EXPERIENCES", text: "Interactive architectural & product scenes" },
          ]
        );
        const designScreen = new THREE.Mesh(
          track(new THREE.PlaneGeometry(3.4, 1.8)),
          makeVideoMaterial("/videos/growth.mp4", designTex)
        );
        designScreen.rotation.y = -Math.PI / 2;
        designScreen.position.set(11.41, 1.2, zc - 2.6);
        scene.add(designScreen);
      }

      if (i === 4) {
        const ng = new THREE.Group();
        ng.position.set(9.3, 1.75, zc + 2.7);
        scene.add(ng);
        const pts: THREE.Vector3[] = [];
        const nodePositions = [
          [-0.8, 0.4, -0.5],
          [0.7, 0.5, -0.3],
          [-0.4, -0.4, 0.6],
          [0.8, -0.3, 0.5],
          [0, 0.65, 0.4],
          [0, -0.55, -0.4],
          [-0.9, 0.0, 0.2],
          [0.5, 0.1, -0.7],
        ];
        nodePositions.forEach(([nx, ny, nz]) => {
          const m = new THREE.Mesh(
            track(new THREE.SphereGeometry(0.11, 12, 10)),
            M(0x245bdb, 1, 0.3, 0.2)
          );
          m.position.set(nx, ny, nz);
          ng.add(m);
          pts.push(m.position);
        });
        const lp: THREE.Vector3[] = [];
        pts.forEach((a, x) => {
          lp.push(a, pts[(x + 2) % pts.length], a, pts[(x + 3) % pts.length]);
        });
        ng.add(
          new THREE.LineSegments(
            track(new THREE.BufferGeometry().setFromPoints(lp)),
            track(new THREE.LineBasicMaterial({ color: 0x7fa3f5 }))
          )
        );
        animNodes = ng;

        const aiTex = makeScreenCanvas(
          "AI & RPA WORKFLOWS",
          "RAG ASSISTANTS · VOICE · AUTOMATION",
          [
            { tag: "CONVERSATIONAL AI", text: "Grounded knowledge & real-time voice" },
            { tag: "RPA PIPELINES", text: "Deterministic browser & document flows" },
          ]
        );
        const aiScreen = new THREE.Mesh(
          track(new THREE.PlaneGeometry(3.4, 1.8)),
          track(new THREE.MeshBasicMaterial({ map: aiTex }))
        );
        aiScreen.rotation.y = -Math.PI / 2;
        aiScreen.position.set(11.41, 1.2, zc - 2.6);
        scene.add(aiScreen);
      }

      if (i === 5) {
        const table = new THREE.Mesh(
          track(new THREE.CylinderGeometry(1.25, 1.25, 0.06, 28)),
          M(0xffffff, 1, 0.35)
        );
        table.position.set(8.8, 0.76, zc + 2.6);
        table.castShadow = !isMobileViewport;
        scene.add(table);
        B(0.14, 0.72, 0.14, 0x142b52, 8.8, 0.38, zc + 2.6);
        for (let k = 0; k < 5; k++) {
          const a = (k / 5) * Math.PI * 2;
          B(
            0.46,
            0.46,
            0.46,
            0x3a4a66,
            8.8 + Math.cos(a) * 1.75,
            0.23,
            zc + 2.6 + Math.sin(a) * 1.75
          );
        }

        const clientsTex = makeScreenCanvas(
          locale === "fr" ? "ACCOMPAGNEMENT MULTI-SECTEURS" : "CROSS-INDUSTRY DELIVERY",
          "FRANCE · EUROPE · INTERNATIONAL",
          [
            { tag: "LEGAL & ENTERPRISE", text: "Private AI search & internal copilots" },
            { tag: "COMMERCE & OPERATIONS", text: "Connected platforms & RPA pipelines" },
          ]
        );
        const clientsScreen = new THREE.Mesh(
          track(new THREE.PlaneGeometry(4.8, 1.9)),
          makeVideoMaterial("/videos/challenge.mp4", clientsTex)
        );
        clientsScreen.rotation.y = -Math.PI / 2;
        clientsScreen.position.set(11.41, 1.25, zc);
        scene.add(clientsScreen);
      }

      if (i === 6) {
        const projectCards = [
          {
            title: "CHATBOTPRO",
            sub: "MULTI-TENANT AI SAAS",
            line1: "Custom AI chatbot workspaces",
            line2: "One-line HTML/JS website embed",
          },
          {
            title: "LEXASSIST",
            sub: "LEGAL RAG & VOICE AI",
            line1: "Grounded document retrieval",
            line2: "Asterisk SIP + Realtime voice",
          },
          {
            title: "RPA & WEB PLATFORMS",
            sub: "AUTOMATION & E-LEARNING",
            line1: "Deterministic back-office RPA",
            line2: "Connected web & LMS systems",
          },
        ];
        [-3.4, 0, 3.4].forEach((offset, k) => {
          B(0.1, 2.0, 2.8, 0x142b52, 11.41, 1.35, zc + offset);
          const card = projectCards[k];
          const pTex = makeTexture(512, 360, (g, W, H) => {
            g.fillStyle = k === 0 ? "#142B52" : k === 1 ? "#245BDB" : "#1C3564";
            g.fillRect(0, 0, W, H);
            g.strokeStyle = "rgba(255,255,255,0.28)";
            g.lineWidth = 3;
            g.strokeRect(16, 16, W - 32, H - 32);
            g.fillStyle = "#DCE6F8";
            g.font = "700 18px Inter, Arial, sans-serif";
            g.fillText(card.sub, 36, 70);
            g.fillStyle = "#FFFFFF";
            g.font = '700 38px "Space Grotesk", Inter, Arial, sans-serif';
            g.fillText(card.title, 36, 130);
            g.fillStyle = "#E9EEF7";
            g.font = "500 22px Inter, Arial, sans-serif";
            g.fillText(card.line1, 36, 210);
            g.fillText(card.line2, 36, 250);
          });
          const pMesh = new THREE.Mesh(
            track(new THREE.PlaneGeometry(2.55, 1.75)),
            track(new THREE.MeshBasicMaterial({ map: pTex }))
          );
          pMesh.rotation.y = -Math.PI / 2;
          pMesh.position.set(11.34, 1.35, zc + offset);
          scene.add(pMesh);
        });
      }

      if (i === 7) {
        B(2.8, 1.05, 0.85, 0xffffff, 6.2, 0.525, zc + 4.4, scene, M(0xffffff), true);
        B(2.86, 0.05, 0.9, 0x142b52, 6.2, 1.07, zc + 4.4);
        const pt = new THREE.Mesh(
          track(new THREE.TorusGeometry(1.5, 0.13, 18, 60)),
          M(0x245bdb, 1, 0.25, 0.4)
        );
        pt.position.set(9.1, 1.55, zc + 1.8);
        pt.rotation.y = Math.PI / 2;
        scene.add(pt);
        animPortal = pt;
      }
    });

    // ── 6. RENDER LOOP & CAMERA ──────────────────────────────────────────────
    let currentProgress = 0;
    let mx = 0;
    let my = 0;
    let t = 0;
    let rafId = 0;

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w < 768 ? 72 : 60;
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
      t += reducedMotion ? 0 : 0.01;

      const target = progressRef.current;
      currentProgress += (target - currentProgress) * (reducedMotion ? 1 : 0.08);

      const zCam = 11 - currentProgress * (N - 1) * STEP - currentProgress * 3;
      camera.position.set(-1.05 + mx * 0.6, 1.68 - my * 0.25, zCam);

      const entryBlend = Math.min(1, currentProgress * 9);
      const lookX = THREE.MathUtils.lerp(0.2, 3.5, entryBlend) + mx * 2.0;
      const lookY = THREE.MathUtils.lerp(4.2, 1.35, entryBlend) - my * 0.25;
      const lookZ = zCam - 9.5;
      camera.lookAt(lookX, lookY, lookZ);

      const openFactor = Math.min(
        1,
        Math.max(0, (currentProgress - 0.01) * (N - 1) * 1.4)
      );
      doorLeft.position.x = -1.5 - openFactor * 2.4;
      doorRight.position.x = 1.5 + openFactor * 2.4;

      if (!reducedMotion) {
        for (let i = 0; i < people.length; i++) {
          const p = people[i];
          p.armL.rotation.x = Math.sin(t * 10 + p.phase) * 0.06;
          p.armR.rotation.x = Math.cos(t * 9 + p.phase) * 0.06;
          p.head.rotation.y = Math.sin(t * 1.1 + p.phase) * 0.28;
        }
        if (animKnot) {
          animKnot.rotation.x = t * 1.4;
          animKnot.rotation.y = t * 2.1;
        }
        if (animNodes) {
          animNodes.rotation.y = t * 0.7;
        }
        if (animPortal) {
          animPortal.rotation.x = t * 0.65;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
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
  }, [progressRef, reducedMotion, locale, onWebGLError]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
