"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface HeadquartersCanvasProps {
  /** Ref holding normalized scroll progress 0..1 */
  progressRef: React.MutableRefObject<number>;
  /** Called if WebGL fails to initialize so the parent can render the fallback */
  onWebGLError?: () => void;
}

/**
 * High-craft architectural 3D headquarters for KartagoTech Agency.
 *
 * Spaces along a continuous spatial spline:
 * 0.00 -> Exterior Forecourt & Facade (KartagoTech HQ)
 * 0.17 -> Central Atrium (double-height gallery, mezzanine & 4 wing portals)
 * 0.33 -> 01 Software Studio
 * 0.50 -> 02 AI Lab
 * 0.67 -> 03 Automation Hub
 * 0.83 -> 04 Digital Experiences
 * 1.00 -> Final Meeting Space
 */
export function HeadquartersCanvas({
  progressRef,
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
    renderer.toneMappingExposure = 1.04;
    // Disable expensive real-time shadows on mobile GPUs for smooth 60fps scrolling
    renderer.shadowMap.enabled = !isMobileViewport;
    if (!isMobileViewport) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(0xeaecef);
    scene.background = bgColor;
    scene.fog = new THREE.Fog(0xeaecef, 26, 105);

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 190);

    // ── Lighting (Architectural Daylight + Warm Interior Glow) ───────────────
    const hemiLight = new THREE.HemisphereLight(0xf7f9fc, 0xc4c9d4, 1.0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaf0, 1.3);
    sunLight.position.set(16, 28, 22);
    if (!isMobileViewport) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.set(1024, 1024);
      sunLight.shadow.camera.near = 2;
      sunLight.shadow.camera.far = 95;
      sunLight.shadow.camera.left = -26;
      sunLight.shadow.camera.right = 26;
      sunLight.shadow.camera.top = 26;
      sunLight.shadow.camera.bottom = -26;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xd9e2ff, 0.45);
    fillLight.position.set(-16, 12, -24);
    scene.add(fillLight);

    // Subtle interior atrium warm point light
    const atriumLight = new THREE.PointLight(0xfff4e0, 0.9, 32, 1.4);
    atriumLight.position.set(0, 9.5, -13);
    scene.add(atriumLight);

    // ── Reusable Materials & Texture Helpers ─────────────────────────────────
    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const makeCanvasTexture = (
      w: number,
      h: number,
      draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
    ) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (ctx) draw(ctx, w, h);
      const tex = track(new THREE.CanvasTexture(c));
      tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const concreteMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xe3e4df,
        roughness: 0.88,
        metalness: 0.03,
      })
    );
    const terrazzoMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xd6d9df,
        roughness: 0.32,
        metalness: 0.08,
      })
    );
    const darkMetalMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x111318,
        roughness: 0.3,
        metalness: 0.75,
      })
    );
    const brushedMetalMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x9aa3b2,
        roughness: 0.25,
        metalness: 0.84,
      })
    );
    const accentMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x8291ea,
        roughness: 0.35,
        metalness: 0.2,
        emissive: 0x8291ea,
        emissiveIntensity: 0.22,
      })
    );
    const glassMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xd8e4ff,
        roughness: 0.08,
        metalness: 0.05,
        transmission: 0.52,
        transparent: true,
        opacity: 0.4,
      })
    );
    const warmLightMat = track(
      new THREE.MeshBasicMaterial({ color: 0xfbf8f1 })
    );
    const waterMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x172030,
        roughness: 0.06,
        metalness: 0.7,
      })
    );

    const addBox = (
      w: number,
      h: number,
      d: number,
      mat: THREE.Material,
      x: number,
      y: number,
      z: number,
      parent: THREE.Object3D = scene,
      castShadow = false,
      receiveShadow = true
    ) => {
      const geo = track(new THREE.BoxGeometry(w, h, d));
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = !isMobileViewport && castShadow;
      mesh.receiveShadow = receiveShadow;
      parent.add(mesh);
      return mesh;
    };

    // ── 1. GROUND PLAZA & CONTINUOUS INTERIOR FLOOR ──────────────────────────
    addBox(110, 0.2, 46, terrazzoMat, 0, -0.1, 22, scene, false, true);
    addBox(46, 0.2, 102, terrazzoMat, 0, -0.1, -49, scene, false, true);

    // Architectural plaza paving joints
    for (let z = 4; z <= 32; z += 4) {
      addBox(44, 0.01, 0.04, darkMetalMat, 0, 0.005, z);
    }

    // Subtle entrance plinth steps
    addBox(14, 0.14, 4.2, concreteMat, 0, 0.07, 2.1, scene, false, true);
    addBox(12, 0.14, 2.4, concreteMat, 0, 0.21, 1.2, scene, false, true);

    // Reflecting pools flanking the entrance plaza
    addBox(10.5, 0.05, 14, waterMat, -13, 0.025, 11);
    addBox(10.5, 0.05, 14, waterMat, 13, 0.025, 11);
    addBox(10.9, 0.12, 0.2, darkMetalMat, -13, 0.06, 18);
    addBox(10.9, 0.12, 0.2, darkMetalMat, 13, 0.06, 18);

    // ── 2. EXTERIOR ARCHITECTURAL FACADE (Z = 0) ─────────────────────────────
    const facadeGroup = new THREE.Group();
    scene.add(facadeGroup);

    // Main monolithic concrete wings + upper cornice
    addBox(15, 13.4, 1.6, concreteMat, -12.5, 6.7, 0, facadeGroup, true);
    addBox(15, 13.4, 1.6, concreteMat, 12.5, 6.7, 0, facadeGroup, true);
    addBox(40.2, 0.55, 2.2, darkMetalMat, 0, 13.5, 0.2, facadeGroup, true);

    // Architectural vertical anodized aluminum fins + recessed curtain-wall glazing
    for (let side of [-1, 1]) {
      for (let col = 0; col < 4; col++) {
        const bx = side * (6.8 + col * 3.4);
        addBox(3.0, 10.4, 0.14, glassMat, bx, 5.7, 0.72, facadeGroup);
        addBox(0.16, 11.0, 0.55, darkMetalMat, bx - 1.55, 5.8, 0.85, facadeGroup, true);
      }
    }

    // Central entrance portal canopy & structural soffit
    addBox(10.6, 5.2, 2.0, darkMetalMat, 0, 10.6, 0.1, facadeGroup, true);
    addBox(11.4, 0.32, 4.4, brushedMetalMat, 0, 7.9, 1.7, facadeGroup, true);
    addBox(9.8, 0.08, 0.14, accentMat, 0, 7.72, 3.85, facadeGroup);
    addBox(9.8, 0.06, 0.2, warmLightMat, 0, 7.72, 2.2, facadeGroup);

    // Illuminated KartagoTech Facade Signage
    const signTex = makeCanvasTexture(1024, 256, (ctx, W, H) => {
      ctx.fillStyle = "#111318";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#8291EA";
      ctx.fillRect(54, 82, 14, 92);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "600 74px Inter, system-ui, sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText("KARTAGOTECH", 92, 112);
      ctx.fillStyle = "#9BA5B8";
      ctx.font = "500 22px monospace";
      ctx.fillText("SOFTWARE  ·  AI  ·  AUTOMATION", 94, 174);
    });
    const signPlane = new THREE.Mesh(
      track(new THREE.PlaneGeometry(7.8, 1.95)),
      track(new THREE.MeshBasicMaterial({ map: signTex }))
    );
    signPlane.position.set(0, 10.6, 1.13);
    facadeGroup.add(signPlane);

    // Motorized Sliding Glass Entrance Doors
    const doorLeft = addBox(2.5, 7.6, 0.14, glassMat, -1.27, 3.9, 0.15, facadeGroup);
    const doorRight = addBox(2.5, 7.6, 0.14, glassMat, 1.27, 3.9, 0.15, facadeGroup);
    addBox(0.1, 7.6, 0.22, darkMetalMat, 1.2, 0, 0, doorLeft);
    addBox(0.1, 7.6, 0.22, darkMetalMat, -1.2, 0, 0, doorRight);

    // ── 3. CENTRAL ATRIUM (Z = -4 to -24) ────────────────────────────────────
    const atriumGroup = new THREE.Group();
    scene.add(atriumGroup);

    // Double-height side walls & mezzanine gallery
    addBox(0.6, 13.4, 22, concreteMat, -17, 6.7, -13, atriumGroup, false, true);
    addBox(0.6, 13.4, 22, concreteMat, 17, 6.7, -13, atriumGroup, false, true);

    // Mezzanine balcony overhang + glass balustrade on both sides
    for (let side of [-1, 1]) {
      addBox(4.2, 0.3, 20, concreteMat, side * 14.8, 6.4, -13, atriumGroup, true);
      addBox(0.08, 1.0, 20, glassMat, side * 12.75, 7.05, -13, atriumGroup);
      addBox(0.12, 0.08, 20, darkMetalMat, side * 12.75, 7.56, -13, atriumGroup);
    }

    // Skylight ribs overhead
    for (let z = -3; z >= -23; z -= 4) {
      addBox(34, 0.45, 0.45, darkMetalMat, 0, 13.1, z, atriumGroup);
      addBox(22, 0.08, 0.14, warmLightMat, 0, 12.82, z, atriumGroup);
    }

    // Structural columns
    for (let z of [-6, -14, -22]) {
      addBox(0.65, 13.0, 0.65, darkMetalMat, -11.0, 6.5, z, atriumGroup, true);
      addBox(0.65, 13.0, 0.65, darkMetalMat, 11.0, 6.5, z, atriumGroup, true);
    }

    // Central Architectural Directory Plinth
    addBox(5.0, 1.05, 1.7, darkMetalMat, 0, 0.525, -13, atriumGroup, true);
    addBox(5.1, 0.06, 1.8, brushedMetalMat, 0, 1.08, -13, atriumGroup);
    addBox(4.6, 0.04, 0.08, accentMat, 0, 0.95, -12.12, atriumGroup);

    // ── 4. FOUR INNOVATION WINGS (Z = -28 to -70) ────────────────────────────
    addBox(34, 0.4, 54, concreteMat, 0, 6.8, -50);
    for (let z = -26; z >= -74; z -= 4) {
      addBox(0.18, 0.06, 2.4, warmLightMat, 0, 6.55, z);
    }

    const createInterfaceScreen = (
      title: string,
      subtitle: string,
      rows: Array<{ label: string; value: string; highlight?: boolean }>
    ) => {
      return makeCanvasTexture(1024, 640, (ctx, W, H) => {
        ctx.fillStyle = "#111318";
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = "rgba(130, 145, 234, 0.45)";
        ctx.lineWidth = 4;
        ctx.strokeRect(16, 16, W - 32, H - 32);

        ctx.fillStyle = "#1A1D24";
        ctx.fillRect(20, 20, W - 40, 92);
        ctx.fillStyle = "#8291EA";
        ctx.fillRect(48, 52, 16, 16);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "600 34px Inter, system-ui, sans-serif";
        ctx.fillText(title, 82, 70);

        ctx.fillStyle = "#8F98AA";
        ctx.font = "500 20px monospace";
        ctx.fillText(subtitle, 82, 98);

        rows.forEach((row, idx) => {
          const y = 148 + idx * 112;
          ctx.fillStyle = row.highlight ? "rgba(130, 145, 234, 0.14)" : "#181B22";
          ctx.fillRect(48, y, W - 96, 88);
          ctx.strokeStyle = row.highlight
            ? "rgba(130, 145, 234, 0.65)"
            : "rgba(255, 255, 255, 0.08)";
          ctx.lineWidth = 2;
          ctx.strokeRect(48, y, W - 96, 88);

          ctx.fillStyle = "#9BA5B8";
          ctx.font = "500 20px monospace";
          ctx.fillText(row.label, 76, y + 34);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "500 26px Inter, system-ui, sans-serif";
          ctx.fillText(row.value, 76, y + 66);
        });
      });
    };

    interface WingSpec {
      z: number;
      side: -1 | 1;
      title: string;
      subtitle: string;
      rows: Array<{ label: string; value: string; highlight?: boolean }>;
    }

    const wings: WingSpec[] = [
      {
        z: -32,
        side: -1,
        title: "01 // SOFTWARE STUDIO",
        subtitle: "WEB PLATFORMS  ·  CUSTOM SYSTEMS  ·  SAAS",
        rows: [
          { label: "SAAS ARCHITECTURE", value: "Multi-tenant workspaces & role-based control", highlight: true },
          { label: "WEB PLATFORMS", value: "Fast, accessible Next.js & TypeScript apps" },
          { label: "API ORCHESTRATION", value: "Clean bridges for ERPs, CRMs & payments" },
          { label: "OWNERSHIP", value: "Maintainable, documented codebases built to scale" },
        ],
      },
      {
        z: -44,
        side: 1,
        title: "02 // AI LAB",
        subtitle: "CONVERSATIONAL AI  ·  LOCAL RAG  ·  VOICE",
        rows: [
          { label: "DOCUMENT INTELLIGENCE", value: "Grounded RAG search with verifiable citations", highlight: true },
          { label: "AI ASSISTANTS", value: "Embeddable custom copilots for web & teams" },
          { label: "REALTIME VOICE", value: "Low-latency Asterisk SIP + OpenAI Realtime" },
          { label: "PRIVACY", value: "On-device or isolated tenant data boundaries" },
        ],
      },
      {
        z: -56,
        side: -1,
        title: "03 // AUTOMATION HUB",
        subtitle: "RPA  ·  WORKFLOWS  ·  DOCUMENT PROCESSING",
        rows: [
          { label: "RPA PIPELINES", value: "Deterministic browser & desktop execution", highlight: true },
          { label: "EXTRACTION", value: "Automated PDF, invoice & spreadsheet parsing" },
          { label: "DATA SYNC", value: "Validated transfers across legacy portals" },
          { label: "REPORTING", value: "Scheduled consolidation & audit trails" },
        ],
      },
      {
        z: -68,
        side: 1,
        title: "04 // DIGITAL EXPERIENCES",
        subtitle: "TRANSFORMATION  ·  CONNECTED ECOSYSTEMS",
        rows: [
          { label: "ECOSYSTEM SYNC", value: "Desktop, mobile & back-office connected", highlight: true },
          { label: "DESIGN CRAFT", value: "Swiss-grade hierarchy & accessibility" },
          { label: "MODERNIZATION", value: "Replacing spreadsheets with unified tools" },
          { label: "RESPONSIVENESS", value: "Consistent speed across every device" },
        ],
      },
    ];

    wings.forEach((w, idx) => {
      const wx = w.side * 9.5;
      addBox(0.5, 6.6, 10.6, concreteMat, w.side * 15.8, 3.3, w.z, scene, false, true);
      addBox(7.2, 6.4, 0.12, glassMat, wx, 3.2, w.z + 5.2);
      addBox(7.2, 6.4, 0.12, glassMat, wx, 3.2, w.z - 5.2);
      addBox(0.18, 6.4, 0.18, darkMetalMat, w.side * 6.0, 3.2, w.z + 5.2);
      addBox(0.18, 6.4, 0.18, darkMetalMat, w.side * 6.0, 3.2, w.z - 5.2);

      // Floor accent line
      addBox(0.08, 0.04, 9.6, accentMat, w.side * 6.0, 0.02, w.z);

      // Distinct architectural furniture per wing
      if (idx === 0) {
        // Software Studio: dual-tier architectural engineering desk
        addBox(1.5, 0.85, 4.2, darkMetalMat, w.side * 9.2, 0.425, w.z, scene, true);
        addBox(1.56, 0.05, 4.26, brushedMetalMat, w.side * 9.2, 0.87, w.z);
      } else if (idx === 1) {
        // AI Lab: acoustic vertical architectural fins + central plinth
        addBox(1.2, 0.95, 2.4, darkMetalMat, w.side * 9.2, 0.475, w.z, scene, true);
        for (let k = -2; k <= 2; k++) {
          addBox(0.08, 5.2, 0.16, darkMetalMat, w.side * 15.2, 3.0, w.z + k * 2.1);
        }
      } else if (idx === 2) {
        // Automation Hub: modular 3-step architectural plinth sequence
        for (let step = -1; step <= 1; step++) {
          addBox(1.2, 0.85, 1.2, darkMetalMat, w.side * 9.2, 0.425, w.z + step * 1.6, scene, true);
          addBox(1.24, 0.04, 1.24, accentMat, w.side * 9.2, 0.87, w.z + step * 1.6);
        }
      } else {
        // Digital Experiences: wide low architectural gallery bench
        addBox(1.6, 0.55, 4.8, concreteMat, w.side * 9.2, 0.275, w.z, scene, true);
        addBox(1.64, 0.04, 4.84, darkMetalMat, w.side * 9.2, 0.57, w.z);
      }

      // Large wall-mounted architectural display
      const screenTex = createInterfaceScreen(w.title, w.subtitle, w.rows);
      const bezel = addBox(0.16, 3.6, 5.8, darkMetalMat, w.side * 15.35, 3.1, w.z);
      const screen = new THREE.Mesh(
        track(new THREE.PlaneGeometry(5.5, 3.3)),
        track(new THREE.MeshBasicMaterial({ map: screenTex }))
      );
      screen.rotation.y = w.side === -1 ? Math.PI / 2 : -Math.PI / 2;
      screen.position.set(w.side === -1 ? 0.1 : -0.1, 0, 0);
      bezel.add(screen);
    });

    // ── 5. FINAL MEETING SPACE (Z = -80 to -95) ──────────────────────────────
    const meetingZ = -86;
    addBox(34, 6.8, 0.6, concreteMat, 0, 3.4, -95, scene, false, true);
    addBox(0.6, 6.8, 15, concreteMat, -16, 3.4, meetingZ);
    addBox(0.6, 6.8, 15, concreteMat, 16, 3.4, meetingZ);

    // Executive architectural conference table
    addBox(7.2, 0.1, 2.7, darkMetalMat, 0, 0.78, meetingZ, scene, true);
    addBox(7.3, 0.04, 2.8, brushedMetalMat, 0, 0.84, meetingZ);
    addBox(0.35, 0.76, 1.4, darkMetalMat, -2.4, 0.38, meetingZ);
    addBox(0.35, 0.76, 1.4, darkMetalMat, 2.4, 0.38, meetingZ);

    for (let cx of [-2.1, 0, 2.1]) {
      for (let side of [-1, 1]) {
        const cz = meetingZ + side * 2.0;
        addBox(0.58, 0.08, 0.58, brushedMetalMat, cx, 0.48, cz);
        addBox(0.58, 0.46, 0.08, darkMetalMat, cx, 0.72, cz + side * 0.25);
        addBox(0.08, 0.46, 0.08, darkMetalMat, cx, 0.23, cz);
      }
    }

    // Overhead linear luminaire
    addBox(6.8, 0.08, 0.24, warmLightMat, 0, 5.4, meetingZ);
    addBox(7.0, 0.06, 0.3, darkMetalMat, 0, 5.46, meetingZ);

    // Presentation wall screen
    const meetingTex = makeCanvasTexture(1024, 512, (ctx, W, H) => {
      ctx.fillStyle = "#111318";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#8291EA";
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, W - 40, H - 40);
      ctx.fillStyle = "#8291EA";
      ctx.font = "500 24px monospace";
      ctx.fillText("KARTAGOTECH  //  MEETING SPACE", 72, 130);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "600 62px Inter, system-ui, sans-serif";
      ctx.fillText("LET'S BUILD WHAT'S NEXT.", 72, 236);
      ctx.fillStyle = "#9BA5B8";
      ctx.font = "400 28px Inter, system-ui, sans-serif";
      ctx.fillText("Software  ·  AI Solutions  ·  Business Automation", 72, 314);
    });
    const meetingBezel = addBox(8.8, 4.3, 0.16, darkMetalMat, 0, 3.0, -94.55);
    const meetingScreen = new THREE.Mesh(
      track(new THREE.PlaneGeometry(8.4, 4.0)),
      track(new THREE.MeshBasicMaterial({ map: meetingTex }))
    );
    meetingScreen.position.z = 0.1;
    meetingBezel.add(meetingScreen);

    // ── 6. CAMERA SPLINE & LOOKAT PATH ───────────────────────────────────────
    const camPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3.0, 21),
      new THREE.Vector3(0, 2.4, -8),
      new THREE.Vector3(1.6, 2.1, -30),
      new THREE.Vector3(-1.6, 2.1, -42),
      new THREE.Vector3(1.6, 2.1, -54),
      new THREE.Vector3(-1.6, 2.1, -66),
      new THREE.Vector3(0, 2.5, -77),
    ]);

    const lookPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 5.5, 0),
      new THREE.Vector3(0, 2.6, -18),
      new THREE.Vector3(-11.5, 2.8, -32),
      new THREE.Vector3(11.5, 2.8, -44),
      new THREE.Vector3(-11.5, 2.8, -56),
      new THREE.Vector3(11.5, 2.8, -68),
      new THREE.Vector3(0, 2.6, -94),
    ]);

    // ── 7. RENDER LOOP ───────────────────────────────────────────────────────
    let raf = 0;
    let smoothP = progressRef.current;
    let mouseX = 0;
    let mouseY = 0;
    const camPos = new THREE.Vector3();
    const lookPos = new THREE.Vector3();

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w < 768 ? 62 : 48;
      camera.updateProjectionMatrix();
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const target = Math.max(0, Math.min(1, progressRef.current));
      smoothP += (target - smoothP) * 0.085;

      camPath.getPointAt(smoothP, camPos);
      lookPath.getPointAt(smoothP, lookPos);

      if (!isMobileViewport) {
        camPos.x += mouseX * 0.6;
        camPos.y -= mouseY * 0.28;
        lookPos.x += mouseX * 1.0;
      }

      camera.position.copy(camPos);
      camera.lookAt(lookPos);

      const doorOpen = Math.min(1, Math.max(0, smoothP * 6.5));
      doorLeft.position.x = -1.27 - doorOpen * 2.4;
      doorRight.position.x = 1.27 + doorOpen * 2.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [progressRef, onWebGLError]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
