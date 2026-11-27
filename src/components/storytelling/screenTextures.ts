import * as THREE from "three";

/**
 * Generates crisp, high-DPI (1024x576) CanvasTextures representing real
 * software, AI, and operational interfaces for the 3D architectural screens.
 * No stock photos, no invented metrics.
 */

function makeCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext("2d")!;
  return [canvas, ctx];
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

/** Zone 01: Modern connected digital expectations */
export function createModernExpectationsTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas();

  ctx.fillStyle = "#0F1E3A";
  ctx.fillRect(0, 0, 1024, 576);

  // Subtle top bar
  ctx.fillStyle = "#162B52";
  ctx.fillRect(0, 0, 1024, 64);
  ctx.fillStyle = "#245BDB";
  ctx.beginPath();
  ctx.arc(44, 32, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#E9EEF7";
  ctx.font = "600 18px Inter, system-ui, sans-serif";
  ctx.fillText("MODERN CUSTOMER EXPERIENCE · LIVE TOUCHPOINTS", 70, 38);

  const cards = [
    { title: "Client Portal", sub: "Self-service & real-time status", status: "ACTIVE" },
    { title: "Instant Response", sub: "Automated triage & routing", status: "SYNCED" },
    { title: "Connected Channels", sub: "Web · Mobile · Back-office", status: "ONLINE" },
  ];

  cards.forEach((c, i) => {
    const x = 48 + i * 316;
    const y = 112;
    ctx.fillStyle = "#162B52";
    roundRect(ctx, x, y, 292, 396, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(130, 145, 234, 0.28)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Status pill
    ctx.fillStyle = "rgba(36, 91, 219, 0.25)";
    roundRect(ctx, x + 24, y + 28, 96, 28, 14);
    ctx.fill();
    ctx.fillStyle = "#8291EA";
    ctx.font = "700 13px monospace";
    ctx.fillText(c.status, x + 42, y + 47);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 26px Inter, system-ui, sans-serif";
    ctx.fillText(c.title, x + 24, y + 104);

    ctx.fillStyle = "#9FB0CE";
    ctx.font = "400 17px Inter, system-ui, sans-serif";
    ctx.fillText(c.sub, x + 24, y + 138);

    // Clean UI bars
    for (let b = 0; b < 4; b++) {
      ctx.fillStyle = b === 0 ? "#245BDB" : "rgba(255,255,255,0.08)";
      roundRect(ctx, x + 24, y + 190 + b * 44, b === 0 ? 220 : 244 - b * 24, 18, 6);
      ctx.fill();
    }
  });

  return toTexture(canvas);
}

/** Zone 02: Fragmented legacy processes & manual friction */
export function createLegacyCostTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas();

  ctx.fillStyle = "#161B26";
  ctx.fillRect(0, 0, 1024, 576);

  ctx.fillStyle = "#222938";
  ctx.fillRect(0, 0, 1024, 64);
  ctx.fillStyle = "#E5984E";
  ctx.beginPath();
  ctx.arc(44, 32, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#D8DFEC";
  ctx.font = "600 18px Inter, system-ui, sans-serif";
  ctx.fillText("FRAGMENTED OPERATIONS · MANUAL BOTTLENECKS", 70, 38);

  const issues = [
    { label: "UNCONNECTED SPREADSHEETS", tag: "MANUAL COPY-PASTE", w: 430, x: 48, y: 108 },
    { label: "PENDING APPROVALS", tag: "WAITING ON EMAIL", w: 430, x: 546, y: 108 },
    { label: "REPETITIVE DATA ENTRY", tag: "DUPLICATE WORK", w: 430, x: 48, y: 332 },
    { label: "DELAYED CLIENT FOLLOW-UP", tag: "NO SHARED VIEW", w: 430, x: 546, y: 332 },
  ];

  issues.forEach((item) => {
    ctx.fillStyle = "#1E2534";
    roundRect(ctx, item.x, item.y, item.w, 192, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(229, 152, 78, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "rgba(229, 152, 78, 0.16)";
    roundRect(ctx, item.x + 24, item.y + 24, 188, 28, 6);
    ctx.fill();
    ctx.fillStyle = "#F0B27A";
    ctx.font = "700 12px monospace";
    ctx.fillText(item.tag, item.x + 36, item.y + 42);

    ctx.fillStyle = "#F7F6F2";
    ctx.font = "700 22px Inter, system-ui, sans-serif";
    ctx.fillText(item.label, item.x + 24, item.y + 92);

    // Disconnected row lines
    ctx.fillStyle = "rgba(255,255,255,0.09)";
    roundRect(ctx, item.x + 24, item.y + 118, 360, 14, 4);
    ctx.fill();
    roundRect(ctx, item.x + 24, item.y + 144, 260, 14, 4);
    ctx.fill();
  });

  return toTexture(canvas);
}

/** Zone 03: Unified custom software, AI & RPA architecture */
export function createUnifiedSystemTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas();

  ctx.fillStyle = "#F7F6F2";
  ctx.fillRect(0, 0, 1024, 576);

  ctx.fillStyle = "#142B52";
  ctx.fillRect(0, 0, 1024, 68);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 18px Inter, system-ui, sans-serif";
  ctx.fillText("UNIFIED ARCHITECTURE · SOFTWARE + AI + AUTOMATION", 44, 41);

  // Connecting pipeline line
  ctx.strokeStyle = "#245BDB";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(220, 290);
  ctx.lineTo(800, 290);
  ctx.stroke();

  const nodes = [
    { x: 56, title: "Custom Software", sub: "Tailored business logic", badge: "CORE PLATFORM" },
    { x: 374, title: "Practical AI", sub: "Grounded assistants", badge: "INTELLIGENCE" },
    { x: 692, title: "RPA Workflows", sub: "Automated execution", badge: "AUTOMATION" },
  ];

  nodes.forEach((n) => {
    ctx.fillStyle = "#FFFFFF";
    roundRect(ctx, n.x, 144, 276, 300, 18);
    ctx.fill();
    ctx.strokeStyle = "#245BDB";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = "#E9EEF7";
    roundRect(ctx, n.x + 24, 174, 144, 30, 15);
    ctx.fill();
    ctx.fillStyle = "#245BDB";
    ctx.font = "700 12px monospace";
    ctx.fillText(n.badge, n.x + 38, 193);

    ctx.fillStyle = "#142B52";
    ctx.font = "700 25px Inter, system-ui, sans-serif";
    ctx.fillText(n.title, n.x + 24, 248);

    ctx.fillStyle = "#4A5870";
    ctx.font = "400 17px Inter, system-ui, sans-serif";
    ctx.fillText(n.sub, n.x + 24, 282);

    ctx.fillStyle = "#245BDB";
    roundRect(ctx, n.x + 24, 328, 228, 14, 7);
    ctx.fill();
    ctx.fillStyle = "#D8DFEC";
    roundRect(ctx, n.x + 24, 360, 180, 14, 7);
    ctx.fill();
    roundRect(ctx, n.x + 24, 392, 204, 14, 7);
    ctx.fill();
  });

  return toTexture(canvas);
}

/** Zone 04: Operational clarity, customer experience & capacity */
export function createOpportunityTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas();

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 1024, 576);

  ctx.fillStyle = "#E9EEF7";
  ctx.fillRect(0, 0, 1024, 68);
  ctx.fillStyle = "#142B52";
  ctx.font = "700 18px Inter, system-ui, sans-serif";
  ctx.fillText("OPERATIONAL CLARITY · READY FOR GROWTH", 44, 41);

  // Clean smooth growth curve on left
  ctx.fillStyle = "#F7F6F2";
  roundRect(ctx, 48, 108, 540, 416, 18);
  ctx.fill();
  ctx.strokeStyle = "#D8DFEC";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#142B52";
  ctx.font = "700 22px Inter, system-ui, sans-serif";
  ctx.fillText("Operational Capacity", 80, 156);

  ctx.strokeStyle = "#245BDB";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(88, 456);
  ctx.bezierCurveTo(220, 444, 340, 320, 540, 196);
  ctx.stroke();

  ctx.fillStyle = "rgba(36, 91, 219, 0.12)";
  ctx.beginPath();
  ctx.moveTo(88, 456);
  ctx.bezierCurveTo(220, 444, 340, 320, 540, 196);
  ctx.lineTo(540, 476);
  ctx.lineTo(88, 476);
  ctx.closePath();
  ctx.fill();

  // Right outcome pillars
  const pillars = [
    "Faster Customer Service",
    "Connected Daily Teams",
    "Room to Scale Cleanly",
  ];
  pillars.forEach((p, i) => {
    const y = 108 + i * 144;
    ctx.fillStyle = "#142B52";
    roundRect(ctx, 620, y, 356, 124, 16);
    ctx.fill();

    ctx.fillStyle = "#245BDB";
    ctx.beginPath();
    ctx.arc(658, y + 62, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 22px Inter, system-ui, sans-serif";
    ctx.fillText(p, 688, y + 70);
  });

  return toTexture(canvas);
}

/** Zone 05: KartagoTech Architectural Signage */
export function createKartagoBrandTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas();

  ctx.fillStyle = "#142B52";
  ctx.fillRect(0, 0, 1024, 576);

  // Subtle architectural border
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, 952, 504);

  // Blue accent mark
  ctx.fillStyle = "#245BDB";
  roundRect(ctx, 452, 146, 120, 8, 4);
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.font = "700 64px Inter, system-ui, sans-serif";
  ctx.fillText("KARTAGOTECH", 512, 268);

  ctx.fillStyle = "#8291EA";
  ctx.font = "600 20px monospace";
  ctx.fillText("WEB · CUSTOM SOFTWARE · AI · AUTOMATION", 512, 336);

  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "500 18px Inter, system-ui, sans-serif";
  ctx.fillText("FRANCE · WORLDWIDE", 512, 412);

  return toTexture(canvas);
}
