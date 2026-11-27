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
 * 0.17 -> Central Atrium (double-height gallery, 4 wing portals)
 * 0.33 -> Software Studio
 * 0.50 -> AI Lab
 * 0.67 -> Automation Hub
 * 0.83 -> Digital Experiences
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

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      onWebGLError?.();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(0xeceef2);
    scene.background = bgColor;
    scene.fog = new THREE.Fog(0xeceef2, 22, 95);

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 180);

    // ── Lighting (Architectural Daylight + Warm/Cool Accents) ────────────────
    const hemiLight = new THREE.HemisphereLight(0xf5f7fa, 0xc8cdd6, 0.95);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaf2, 1.35);
    sunLight.position.set(14, 24, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 90;
    sunLight.shadow.camera.left = -26;
    sunLight.shadow.camera.right = 26;
    sunLight.shadow.camera.top = 26;
    sunLight.shadow.camera.bottom = -26;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xdce4ff, 0.45);
    fillLight.position.set(-16, 12, -20);
    scene.add(fillLight);

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
        color: 0xe4e5e1,
        roughness: 0.85,
        metalness: 0.04,
      })
    );
    const floorMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xd9dce2,
        roughness: 0.35,
        metalness: 0.08,
      })
    );
    const darkMetalMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x111318,
        roughness: 0.32,
        metalness: 0.72,
      })
    );
    const brushedMetalMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x9aa3b2,
        roughness: 0.28,
        metalness: 0.82,
      })
    );
    const accentMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x8291ea,
        roughness: 0.35,
        metalness: 0.2,
        emissive: 0x8291ea,
        emissiveIntensity: 0.18,
      })
    );
    const glassMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xdbe6ff,
        roughness: 0.08,
        metalness: 0.05,
        transmission: 0.55,
        transparent: true,
        opacity: 0.42,
      })
    );
    const warmLightMat = track(
      new THREE.MeshBasicMaterial({ color: 0xf9f7f2 })
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
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      parent.add(mesh);
      return mesh;
    };

    // ── 1. GROUND PLAZA & BUILDING ENVELOPE ──────────────────────────────────
    // Exterior plaza
    addBox(90, 0.2, 42, floorMat, 0, -0.1, 21, scene, false, true);
    // Interior continuous polished terrazzo floor (Z: 0 down to -92)
    addBox(44, 0.2, 96, floorMat, 0, -0.1, -46, scene, false, true);

    // Subtle forecourt reflecting pool flanking the entrance
    const waterMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x1b2436,
        roughness: 0.08,
        metalness: 0.65,
      })
    );
    addBox(9, 0.06, 12, waterMat, -11.5, 0.02, 10);
    addBox(9, 0.06, 12, waterMat, 11.5, 0.02, 10);

    // ── 2. EXTERIOR ARCHITECTURAL FACADE (Z = 0) ─────────────────────────────
    const facadeGroup = new THREE.Group();
    scene.add(facadeGroup);

    // Left & right monumental concrete/glass wings
    addBox(14, 12.5, 1.4, concreteMat, -11.5, 6.25, 0, facadeGroup, true);
    addBox(14, 12.5, 1.4, concreteMat, 11.5, 6.25, 0, facadeGroup, true);

    // Curtain-wall glass bays on facade wings
    for (let side of [-1, 1]) {
      for (let col = 0; col < 3; col++) {
        const bx = side * (7.5 + col * 3.8);
        addBox(3.1, 9.6, 0.15, glassMat, bx, 5.4, 0.72, facadeGroup);
        addBox(0.14, 10.2, 0.28, darkMetalMat, bx - 1.6, 5.4, 0.74, facadeGroup);
      }
    }

    // Central portal canopy & upper header
    addBox(10.4, 4.8, 1.8, darkMetalMat, 0, 10.1, 0, facadeGroup, true);
    addBox(10.8, 0.35, 3.8, brushedMetalMat, 0, 7.6, 1.4, facadeGroup, true);
    // Accent architectural beam
    addBox(9.2, 0.12, 0.2, accentMat, 0, 7.42, 3.2, facadeGroup);

    // Illuminated KartagoTech Facade Signage
    const signTex = makeCanvasTexture(1024, 256, (ctx, W, H) => {
      ctx.fillStyle = "#111318";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#8291EA";
      ctx.fillRect(48, 86, 14, 84);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "600 76px Inter, system-ui, sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText("KARTAGOTECH", 86, 114);
      ctx.fillStyle = "#9BA5B8";
      ctx.font = "500 24px monospace";
      ctx.fillText("SOFTWARE  ·  AI  ·  AUTOMATION", 88, 174);
    });
    const signPlane = new THREE.Mesh(
      track(new THREE.PlaneGeometry(7.6, 1.9)),
      track(new THREE.MeshBasicMaterial({ map: signTex }))
    );
    signPlane.position.set(0, 10.1, 0.94);
    facadeGroup.add(signPlane);

    // Motorized Sliding Glass Entrance Doors
    const doorLeft = addBox(2.4, 7.2, 0.14, glassMat, -1.22, 3.6, 0.15, facadeGroup);
    const doorRight = addBox(2.4, 7.2, 0.14, glassMat, 1.22, 3.6, 0.15, facadeGroup);
    addBox(0.1, 7.2, 0.2, darkMetalMat, 1.15, 0, 0, doorLeft);
    addBox(0.1, 7.2, 0.2, darkMetalMat, -1.15, 0, 0, doorRight);

    // ── 3. CENTRAL ATRIUM (Z = -4 to -24) ────────────────────────────────────
    const atriumGroup = new THREE.Group();
    scene.add(atriumGroup);

    // Double-height side walls & skylight ribs
    addBox(0.6, 12.5, 22, concreteMat, -16, 6.25, -13, atriumGroup, false, true);
    addBox(0.6, 12.5, 22, concreteMat, 16, 6.25, -13, atriumGroup, false, true);

    // Skylight beams overhead
    for (let z = -3; z >= -23; z -= 4) {
      addBox(32, 0.45, 0.45, darkMetalMat, 0, 12.2, z, atriumGroup);
      addBox(22, 0.08, 0.12, warmLightMat, 0, 11.95, z, atriumGroup);
    }

    // Structural architectural columns
    for (let z of [-6, -14, -22]) {
      addBox(0.65, 12.2, 0.65, darkMetalMat, -10.5, 6.1, z, atriumGroup, true);
      addBox(0.65, 12.2, 0.65, darkMetalMat, 10.5, 6.1, z, atriumGroup, true);
    }

    // Central Architectural Directory Plinth
    addBox(4.8, 1.05, 1.6, darkMetalMat, 0, 0.525, -13, atriumGroup, true);
    addBox(4.9, 0.06, 1.7, brushedMetalMat, 0, 1.08, -13, atriumGroup);
    addBox(4.6, 0.04, 0.1, accentMat, 0, 0.95, -12.18, atriumGroup);

    // ── 4. FOUR INNOVATION WINGS (Z = -28 to -70) ────────────────────────────
    // Alternating left & right architectural gallery bays along the central spine
    // 0: Software Studio (Left, Z = -32)
    // 1: AI Lab (Right, Z = -44)
    // 2: Automation Hub (Left, Z = -56)
    // 3: Digital Experiences (Right, Z = -68)

    // Spine ceiling & linear lighting from Z = -24 to -76
    addBox(32, 0.4, 54, concreteMat, 0, 6.4, -50);
    for (let z = -26; z >= -74; z -= 4) {
      addBox(0.18, 0.06, 2.4, warmLightMat, 0, 6.18, z);
    }

    const createInterfaceScreen = (
      title: string,
      subtitle: string,
      rows: Array<{ label: string; value: string; highlight?: boolean }>
    ) => {
      return makeCanvasTexture(1024, 640, (ctx, W, H) => {
        ctx.fillStyle = "#111318";
        ctx.fillRect(0, 0, W, H);

        // Border
        ctx.strokeStyle = "rgba(130, 145, 234, 0.45)";
        ctx.lineWidth = 4;
        ctx.strokeRect(16, 16, W - 32, H - 32);

        // Header bar
        ctx.fillStyle = "#1A1D24";
        ctx.fillRect(20, 20, W - 40, 90);
        ctx.fillStyle = "#8291EA";
        ctx.fillRect(48, 52, 16, 16);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "600 34px Inter, system-ui, sans-serif";
        ctx.fillText(title, 82, 70);

        ctx.fillStyle = "#8F98AA";
        ctx.font = "500 20px monospace";
        ctx.fillText(subtitle, 82, 98);

        // Content rows
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
      side: -1 | 1; // -1 = left, 1 = right
      title: string;
      subtitle: string;
      rows: Array<{ label: string; value: string; highlight?: boolean }>;
    }

    const wings: WingSpec[] = [
      {
        z: -32,
        side: -1,
        title: "SOFTWARE STUDIO",
        subtitle: "WEB PLATFORMS  ·  CUSTOM SYSTEMS  ·  SAAS",
        rows: [
          { label: "ARCHITECTURE", value: "Multi-tenant SaaS & modular web platforms", highlight: true },
          { label: "DELIVERY", value: "Type-safe Next.js, TypeScript & PostgreSQL" },
          { label: "INTEGRATION", value: "Clean APIs, ERP & payment orchestration" },
          { label: "OUTCOME", value: "Durable owned software built for scale" },
        ],
      },
      {
        z: -44,
        side: 1,
        title: "AI LAB",
        subtitle: "CONVERSATIONAL AI  ·  LOCAL RAG  ·  VOICE",
        rows: [
          { label: "GROUNDED RAG", value: "Verified document search with source citations", highlight: true },
          { label: "ASSISTANTS", value: "Embeddable custom AI support & internal copilots" },
          { label: "REALTIME VOICE", value: "Low-latency SIP telephony & OpenAI Realtime" },
          { label: "GOVERNANCE", value: "Privacy-first execution & strict guardrails" },
        ],
      },
      {
        z: -56,
        side: -1,
        title: "AUTOMATION HUB",
        subtitle: "RPA  ·  WORKFLOWS  ·  DOCUMENT PROCESSING",
        rows: [
          { label: "RPA PIPELINES", value: "Deterministic browser & desktop execution", highlight: true },
          { label: "EXTRACTION", value: "Automated PDF, invoice & spreadsheet parsing" },
          { label: "ORCHESTRATION", value: "Validated data sync across legacy portals" },
          { label: "REPORTING", value: "Scheduled operational summaries & audit logs" },
        ],
      },
      {
        z: -68,
        side: 1,
        title: "DIGITAL EXPERIENCES",
        subtitle: "TRANSFORMATION  ·  CONNECTED SYSTEMS",
        rows: [
          { label: "MODERNIZATION", value: "Replacing fragmented tools with unified systems", highlight: true },
          { label: "USER FLOWS", value: "Swiss-grade editorial clarity & accessibility" },
          { label: "ECOSYSTEM", value: "Web, mobile & back-office connected in real time" },
          { label: "PERFORMANCE", value: "Fast, responsive interfaces across all devices" },
        ],
      },
    ];

    wings.forEach((w) => {
      const wx = w.side * 9.5;
      // Back wall of bay
      addBox(0.5, 6.2, 10.5, concreteMat, w.side * 15.5, 3.1, w.z, scene, false, true);
      // Glass partition framing bay
      addBox(7.2, 6.0, 0.12, glassMat, wx, 3.0, w.z + 5.2);
      addBox(7.2, 6.0, 0.12, glassMat, wx, 3.0, w.z - 5.2);
      addBox(0.18, 6.0, 0.18, darkMetalMat, w.side * 6.0, 3.0, w.z + 5.2);
      addBox(0.18, 6.0, 0.18, darkMetalMat, w.side * 6.0, 3.0, w.z - 5.2);

      // Architectural accent strip along bay floor edge
      addBox(0.08, 0.04, 9.6, accentMat, w.side * 6.0, 0.02, w.z);

      // Minimalist console monolith
      addBox(1.4, 0.9, 3.8, darkMetalMat, w.side * 9.2, 0.45, w.z, scene, true);
      addBox(1.46, 0.05, 3.86, brushedMetalMat, w.side * 9.2, 0.92, w.z);

      // Large architectural wall-mounted interface display
      const screenTex = createInterfaceScreen(w.title, w.subtitle, w.rows);
      const bezel = addBox(0.14, 3.5, 5.6, darkMetalMat, w.side * 15.1, 3.1, w.z);
      const screen = new THREE.Mesh(
        track(new THREE.PlaneGeometry(5.3, 3.2)),
        track(new THREE.MeshBasicMaterial({ map: screenTex }))
      );
      screen.rotation.y = w.side === -1 ? Math.PI / 2 : -Math.PI / 2;
      screen.position.set(w.side === -1 ? 0.09 : -0.09, 0, 0);
      bezel.add(screen);
    });

    // ── 5. FINAL MEETING SPACE (Z = -80 to -94) ──────────────────────────────
    const meetingZ = -86;
    // Glass enclosure & back wall
    addBox(32, 6.4, 0.6, concreteMat, 0, 3.2, -94, scene, false, true);
    addBox(0.6, 6.4, 14, concreteMat, -15.5, 3.2, meetingZ);
    addBox(0.6, 6.4, 14, concreteMat, 15.5, 3.2, meetingZ);

    // Executive architectural conference table
    addBox(6.8, 0.1, 2.6, darkMetalMat, 0, 0.78, meetingZ, scene, true);
    addBox(6.9, 0.04, 2.7, brushedMetalMat, 0, 0.84, meetingZ);
    addBox(0.35, 0.76, 1.4, darkMetalMat, -2.2, 0.38, meetingZ);
    addBox(0.35, 0.76, 1.4, darkMetalMat, 2.2, 0.38, meetingZ);

    // Minimalist architectural chairs around table
    for (let cx of [-2.0, 0, 2.0]) {
      for (let side of [-1, 1]) {
        const cz = meetingZ + side * 1.95;
        addBox(0.58, 0.08, 0.58, brushedMetalMat, cx, 0.48, cz);
        addBox(0.58, 0.45, 0.08, darkMetalMat, cx, 0.72, cz + side * 0.25);
        addBox(0.08, 0.46, 0.08, darkMetalMat, cx, 0.23, cz);
      }
    }

    // Overhead linear luminaire
    addBox(6.4, 0.08, 0.24, warmLightMat, 0, 5.2, meetingZ);
    addBox(6.6, 0.06, 0.3, darkMetalMat, 0, 5.26, meetingZ);

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
    const meetingBezel = addBox(8.6, 4.2, 0.16, darkMetalMat, 0, 3.0, -93.55);
    const meetingScreen = new THREE.Mesh(
      track(new THREE.PlaneGeometry(8.2, 3.9)),
      track(new THREE.MeshBasicMaterial({ map: meetingTex }))
    );
    meetingScreen.position.z = 0.1;
    meetingBezel.add(meetingScreen);

    // ── 6. CAMERA SPLINE & LOOKAT PATH ───────────────────────────────────────
    const camPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.8, 20),   // 0: Exterior hero
      new THREE.Vector3(0, 2.3, -8),   // 1: Central Atrium
      new THREE.Vector3(1.5, 2.1, -30), // 2: Software Studio (look left)
      new THREE.Vector3(-1.5, 2.1, -42),// 3: AI Lab (look right)
      new THREE.Vector3(1.5, 2.1, -54), // 4: Automation Hub (look left)
      new THREE.Vector3(-1.5, 2.1, -66),// 5: Digital Experiences (look right)
      new THREE.Vector3(0, 2.4, -77),  // 6: Final Meeting Space
    ]);

    const lookPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 5.2, 0),     // 0: Facade & KartagoTech sign
      new THREE.Vector3(0, 2.4, -18),   // 1: Atrium depth
      new THREE.Vector3(-11.5, 2.7, -32),// 2: Software Studio screen
      new THREE.Vector3(11.5, 2.7, -44), // 3: AI Lab screen
      new THREE.Vector3(-11.5, 2.7, -56),// 4: Automation Hub screen
      new THREE.Vector3(11.5, 2.7, -68), // 5: Digital Experiences screen
      new THREE.Vector3(0, 2.5, -93),   // 6: Meeting Space screen
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
      camera.fov = w < 768 ? 60 : 48;
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
      smoothP += (target - smoothP) * 0.08;

      camPath.getPointAt(smoothP, camPos);
      lookPath.getPointAt(smoothP, lookPos);

      // Subtle architectural parallax
      camPos.x += mouseX * 0.65;
      camPos.y -= mouseY * 0.3;
      lookPos.x += mouseX * 1.1;

      camera.position.copy(camPos);
      camera.lookAt(lookPos);

      // Sliding glass entrance doors open smoothly as visitor approaches
      const doorOpen = Math.min(1, Math.max(0, smoothP * 6.5));
      doorLeft.position.x = -1.22 - doorOpen * 2.3;
      doorRight.position.x = 1.22 + doorOpen * 2.3;

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
