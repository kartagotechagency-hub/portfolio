"use client";

/**
 * ProjectCoverScene — Generative canvas-based cover visuals for each project.
 * Each visual is distinct, on-brand, and animated.
 * No raster images needed.
 */

import React, { useEffect, useRef } from "react";

type ProjectCoverType =
  | "restaurant"
  | "chatbot"
  | "lexassist"
  | "elearning"
  | "voice-agent"
  | "rpa-workflow"
  | "rpa-platform";

interface ProjectCoverSceneProps {
  type: ProjectCoverType;
  className?: string;
}

// ─── Shared drawing utilities ───────────────────────────────────────────────
const C = {
  dark: "#111318",
  accent: "#8291EA",
  white: "#F5F5F2",
  mid: "#1E2130",
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ─── Restaurant Management Platform ─────────────────────────────────────────
function drawRestaurant(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number
) {
  ctx.fillStyle = C.dark;
  ctx.fillRect(0, 0, W, H);

  // Floor tiles — receding perspective
  const vx = W * 0.5;
  const vy = H * 0.42;
  const tileRows = 8;
  const tileCols = 10;

  for (let row = 0; row < tileRows; row++) {
    for (let col = 0; col < tileCols; col++) {
      const frac = row / tileRows;
      const scale = 0.08 + frac * 0.22;
      const tileW = W * scale;
      const tileH = tileW * 0.6;
      const startX = vx + (col - tileCols / 2) * tileW;
      const startY = vy + row * tileH * 0.9;

      ctx.strokeStyle = `rgba(130,145,234,${0.04 + frac * 0.08})`;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(startX, startY, tileW, tileH);
    }
  }

  // Dark marble counter
  const counterY = H * 0.52;
  const counterGrad = ctx.createLinearGradient(0, counterY, 0, counterY + H * 0.22);
  counterGrad.addColorStop(0, "#1A1D26");
  counterGrad.addColorStop(0.4, "#141720");
  counterGrad.addColorStop(1, "#0D0F14");
  ctx.fillStyle = counterGrad;
  ctx.fillRect(0, counterY, W, H * 0.22);

  // Marble veins
  for (let i = 0; i < 6; i++) {
    const vx2 = W * (0.1 + i * 0.15);
    const vy2 = counterY + H * 0.02;
    ctx.beginPath();
    ctx.moveTo(vx2, vy2);
    ctx.bezierCurveTo(
      vx2 + 20, vy2 + 15,
      vx2 - 15, vy2 + 25,
      vx2 + 10, vy2 + 40
    );
    ctx.strokeStyle = `rgba(255,255,255,0.04)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Counter surface highlight
  const reflGrad = ctx.createLinearGradient(0, counterY, 0, counterY + 4);
  reflGrad.addColorStop(0, `rgba(130,145,234,0.18)`);
  reflGrad.addColorStop(1, `rgba(130,145,234,0)`);
  ctx.fillStyle = reflGrad;
  ctx.fillRect(0, counterY, W, 4);

  // Pendant lights above counter
  const lightPulse = 0.65 + Math.sin(t * 1.2) * 0.05;
  const lights = [0.2, 0.5, 0.8];
  lights.forEach((lx) => {
    const lxPx = W * lx;
    const lyPx = H * 0.15;

    // Cord
    ctx.beginPath();
    ctx.moveTo(lxPx, 0);
    ctx.lineTo(lxPx, lyPx);
    ctx.strokeStyle = `rgba(255,255,255,0.2)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Pendant body
    ctx.beginPath();
    ctx.arc(lxPx, lyPx, 14, 0, Math.PI * 2);
    ctx.fillStyle = "#1A1D26";
    ctx.fill();
    ctx.strokeStyle = `rgba(130,145,234,0.3)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Warm glow
    const glow = ctx.createRadialGradient(lxPx, lyPx + 20, 0, lxPx, lyPx + 20, 60);
    glow.addColorStop(0, `rgba(255,220,150,${lightPulse * 0.2})`);
    glow.addColorStop(1, `rgba(255,180,80,0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(lxPx - 70, lyPx - 10, 140, 90);
  });

  // Bar stools silhouette
  [0.22, 0.42, 0.62, 0.82].forEach((sx) => {
    const sxPx = W * sx;
    const syPx = counterY - H * 0.14;
    ctx.fillStyle = "#0D0F14";
    // Seat
    ctx.beginPath();
    ctx.ellipse(sxPx, syPx, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    // Stem
    ctx.fillRect(sxPx - 2, syPx + 7, 4, H * 0.1);
    // Base
    ctx.beginPath();
    ctx.ellipse(sxPx, syPx + H * 0.1 + 7, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // QR code accent (small, stylized)
  const qrX = W * 0.86;
  const qrY = H * 0.08;
  const qrSize = 32;
  ctx.fillStyle = "rgba(130,145,234,0.15)";
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = `rgba(130,145,234,0.5)`;
  ctx.lineWidth = 1;
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);
  // QR pattern dots
  for (let qxi = 0; qxi < 4; qxi++) {
    for (let qyi = 0; qyi < 4; qyi++) {
      if (Math.sin(qxi * 3 + qyi * 7) > 0) {
        ctx.fillStyle = `rgba(130,145,234,0.6)`;
        ctx.fillRect(qrX + 4 + qxi * 6, qrY + 4 + qyi * 6, 4, 4);
      }
    }
  }

  // Dark vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.9);
  vig.addColorStop(0, "rgba(17,19,24,0)");
  vig.addColorStop(1, "rgba(17,19,24,0.75)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

// ─── ChatbotPro ──────────────────────────────────────────────────────────────
function drawChatbot(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number
) {
  ctx.fillStyle = C.dark;
  ctx.fillRect(0, 0, W, H);

  // Animated conversation threads as geometric floating lines
  const messages = [
    { side: "left", y: 0.2, w: 0.45, delay: 0 },
    { side: "right", y: 0.32, w: 0.38, delay: 0.4 },
    { side: "left", y: 0.44, w: 0.52, delay: 0.8 },
    { side: "right", y: 0.56, w: 0.3, delay: 1.2 },
    { side: "left", y: 0.68, w: 0.4, delay: 1.6 },
    { side: "right", y: 0.78, w: 0.35, delay: 2.0 },
  ];

  messages.forEach((msg, i) => {
    const opacity = Math.max(0, Math.min(1, (t * 0.4 - msg.delay)));
    if (opacity <= 0) return;

    const isLeft = msg.side === "left";
    const bubbleW = W * msg.w;
    const bubbleH = 28;
    const bx = isLeft ? W * 0.06 : W - W * 0.06 - bubbleW;
    const by = H * msg.y - bubbleH / 2;

    // Bubble background
    ctx.fillStyle = isLeft
      ? `rgba(130,145,234,${opacity * 0.15})`
      : `rgba(30,33,48,${opacity * 0.8})`;
    ctx.beginPath();
    ctx.roundRect(bx, by, bubbleW, bubbleH, 6);
    ctx.fill();

    // Bubble border
    ctx.strokeStyle = isLeft
      ? `rgba(130,145,234,${opacity * 0.6})`
      : `rgba(255,255,255,${opacity * 0.1})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Text placeholder lines
    const lineCount = 1 + (i % 2);
    for (let l = 0; l < lineCount; l++) {
      const lineW = bubbleW * (0.4 + (l === 0 ? 0.4 : 0.2));
      ctx.fillStyle = isLeft
        ? `rgba(130,145,234,${opacity * 0.5})`
        : `rgba(255,255,255,${opacity * 0.2})`;
      ctx.fillRect(bx + 10, by + 8 + l * 12, lineW, 3);
    }

    // Connector dot
    const dotX = isLeft ? bx - 8 : bx + bubbleW + 8;
    const dotY = by + bubbleH / 2;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
    ctx.fillStyle = isLeft
      ? `rgba(130,145,234,${opacity * 0.8})`
      : `rgba(255,255,255,${opacity * 0.3})`;
    ctx.fill();
  });

  // Connecting thread line
  const threadOpacity = Math.min(1, t * 0.2);
  const lineGrad = ctx.createLinearGradient(W * 0.5, H * 0.1, W * 0.5, H * 0.9);
  lineGrad.addColorStop(0, `rgba(130,145,234,0)`);
  lineGrad.addColorStop(0.3, `rgba(130,145,234,${threadOpacity * 0.25})`);
  lineGrad.addColorStop(0.7, `rgba(130,145,234,${threadOpacity * 0.15})`);
  lineGrad.addColorStop(1, `rgba(130,145,234,0)`);
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W * 0.5, H * 0.1);
  ctx.lineTo(W * 0.5, H * 0.9);
  ctx.stroke();

  // Central AI node
  const nodePulse = 0.8 + Math.sin(t * 1.5) * 0.15;
  const nodeGlow = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, 50);
  nodeGlow.addColorStop(0, `rgba(130,145,234,${nodePulse * 0.4})`);
  nodeGlow.addColorStop(1, `rgba(130,145,234,0)`);
  ctx.fillStyle = nodeGlow;
  ctx.fillRect(W * 0.5 - 60, H * 0.5 - 60, 120, 120);

  ctx.beginPath();
  ctx.arc(W * 0.5, H * 0.5, 8, 0, Math.PI * 2);
  ctx.fillStyle = "#8291EA";
  ctx.fill();

  // Vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.85);
  vig.addColorStop(0, "rgba(17,19,24,0)");
  vig.addColorStop(1, "rgba(17,19,24,0.8)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

// ─── LexAssist ───────────────────────────────────────────────────────────────
function drawLexAssist(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number
) {
  ctx.fillStyle = "#0D0F14";
  ctx.fillRect(0, 0, W, H);

  // Bookshelf rows receding into depth
  const shelfCount = 6;
  for (let s = 0; s < shelfCount; s++) {
    const y = H * (0.1 + s * 0.14);
    const depth = 1 - s * 0.1;

    // Shelf board
    ctx.fillStyle = `rgba(22,18,14,${0.9 * depth})`;
    ctx.fillRect(0, y + H * 0.1, W, 6);
    // Shelf edge highlight
    ctx.fillStyle = `rgba(80,60,40,${0.3 * depth})`;
    ctx.fillRect(0, y + H * 0.1, W, 1.5);

    // Books
    let bx = W * 0.03;
    while (bx < W * 0.97) {
      const bookW = 12 + Math.sin(bx * 0.3 + s) * 6;
      const bookH = H * 0.08 * (0.7 + Math.sin(bx * 0.5) * 0.2);
      const bookY = y + H * 0.02 - bookH;

      // Book color — dark palette with rare accent
      const isAccent = Math.sin(bx * 1.7 + s * 2.3) > 0.7;
      const r = isAccent ? 70 : 20 + Math.sin(bx * 0.8) * 10;
      const g = isAccent ? 80 : 18 + Math.cos(bx * 0.6) * 8;
      const b = isAccent ? 110 : 25 + Math.sin(bx * 0.4) * 10;
      ctx.fillStyle = `rgba(${r},${g},${b},${depth})`;
      ctx.fillRect(bx, bookY, bookW - 1, bookH);

      // Spine highlight
      ctx.fillStyle = `rgba(255,255,255,${0.04 * depth})`;
      ctx.fillRect(bx, bookY, 1, bookH);

      bx += bookW + 2;
    }
  }

  // Single dramatic spotlight — animated
  const spotX = W * 0.35;
  const spotY = 0;
  const spotRadius = H * 0.5 + Math.sin(t * 0.3) * H * 0.02;
  const spotlight = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, spotRadius);
  spotlight.addColorStop(0, `rgba(255,230,160,0.14)`);
  spotlight.addColorStop(0.4, `rgba(255,200,100,0.06)`);
  spotlight.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = spotlight;
  ctx.fillRect(0, 0, W, H);

  // Blue-violet fill from below
  const fillGrad = ctx.createLinearGradient(0, H, 0, H * 0.6);
  fillGrad.addColorStop(0, `rgba(130,145,234,0.08)`);
  fillGrad.addColorStop(1, "rgba(130,145,234,0)");
  ctx.fillStyle = fillGrad;
  ctx.fillRect(0, H * 0.6, W, H * 0.4);

  // RAG document excerpt panel (bottom)
  const panelY = H * 0.76;
  ctx.fillStyle = "rgba(14,16,22,0.9)";
  ctx.fillRect(W * 0.08, panelY, W * 0.84, H * 0.18);
  ctx.strokeStyle = `rgba(130,145,234,0.3)`;
  ctx.lineWidth = 1;
  ctx.strokeRect(W * 0.08, panelY, W * 0.84, H * 0.18);

  // Citation highlight bar
  ctx.fillStyle = `rgba(130,145,234,0.12)`;
  ctx.fillRect(W * 0.08, panelY + H * 0.055, W * 0.84, H * 0.04);

  // Text lines
  [0, 1, 2].forEach((i) => {
    const lineW = W * (0.55 - i * 0.08) * (0.8 + Math.sin(t * 0.5 + i) * 0.03);
    ctx.fillStyle = `rgba(255,255,255,${0.1 - i * 0.02})`;
    ctx.fillRect(W * 0.12, panelY + H * 0.025 + i * H * 0.04, lineW, 2.5);
  });

  // Citation tag
  ctx.fillStyle = `rgba(130,145,234,0.5)`;
  ctx.fillRect(W * 0.78, panelY + H * 0.14, W * 0.1, H * 0.025);

  // Dark vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.05, W / 2, H / 2, H);
  vig.addColorStop(0, "rgba(13,15,20,0)");
  vig.addColorStop(1, "rgba(13,15,20,0.7)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

// ─── E-learning Platform ────────────────────────────────────────────────────
function drawElearning(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number
) {
  ctx.fillStyle = C.dark;
  ctx.fillRect(0, 0, W, H);

  // Lecture hall perspective
  const vx = W * 0.5;
  const vy = H * 0.38;

  // Ceiling lines
  for (let i = 0; i < 6; i++) {
    const frac = i / 5;
    const lx = W * frac;
    ctx.beginPath();
    ctx.moveTo(lx, 0);
    ctx.lineTo(vx, vy);
    ctx.strokeStyle = `rgba(255,255,255,0.03)`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Floor lines
  for (let i = 0; i < 8; i++) {
    const frac = i / 7;
    const lx = W * (0.1 + frac * 0.8);
    ctx.beginPath();
    ctx.moveTo(lx, H);
    ctx.lineTo(vx, vy);
    ctx.strokeStyle = `rgba(130,145,234,0.04)`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Seat rows
  const rowCount = 7;
  for (let row = 0; row < rowCount; row++) {
    const frac = row / (rowCount - 1);
    const scale = 0.5 + frac * 0.5;
    const rowY = vy + H * 0.08 + frac * H * 0.5;
    const rowW = W * 0.15 + frac * W * 0.65;
    const seatW = rowW / 8 * scale;
    const seatH = seatW * 0.6;
    const startX = vx - rowW / 2;

    for (let seat = 0; seat < 8; seat++) {
      const sx = startX + seat * rowW / 8 + seatW * 0.1;
      ctx.fillStyle = `rgba(20,22,30,${0.9 * scale})`;
      ctx.fillRect(sx, rowY, seatW * 0.8, seatH);
      ctx.strokeStyle = `rgba(130,145,234,${0.06 * scale})`;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(sx, rowY, seatW * 0.8, seatH);
    }
  }

  // Illuminated screen/wall at front
  const screenGrad = ctx.createLinearGradient(W * 0.15, vy - H * 0.15, W * 0.85, vy);
  screenGrad.addColorStop(0, `rgba(240,240,235,0.08)`);
  screenGrad.addColorStop(0.5, `rgba(240,240,235,0.12)`);
  screenGrad.addColorStop(1, `rgba(240,240,235,0.08)`);
  ctx.fillStyle = screenGrad;
  ctx.fillRect(W * 0.15, vy - H * 0.18, W * 0.7, H * 0.18);

  // Screen content — course module indicator
  const moduleOpacity = 0.6 + Math.sin(t * 0.8) * 0.1;
  ctx.fillStyle = `rgba(130,145,234,${moduleOpacity * 0.1})`;
  ctx.fillRect(W * 0.25, vy - H * 0.14, W * 0.5, H * 0.1);
  // Progress bar
  const progress = (Math.sin(t * 0.3) * 0.5 + 0.5) * 0.8 + 0.1;
  ctx.fillStyle = `rgba(255,255,255,0.08)`;
  ctx.fillRect(W * 0.25, vy - H * 0.045, W * 0.5, 3);
  ctx.fillStyle = `rgba(130,145,234,${moduleOpacity * 0.6})`;
  ctx.fillRect(W * 0.25, vy - H * 0.045, W * 0.5 * progress, 3);

  // WordPress/ManyChat integration icon hint (bottom corner)
  ctx.fillStyle = "rgba(130,145,234,0.08)";
  ctx.fillRect(W * 0.78, H * 0.1, 60, 30);
  ctx.strokeStyle = "rgba(130,145,234,0.2)";
  ctx.lineWidth = 0.5;
  ctx.strokeRect(W * 0.78, H * 0.1, 60, 30);
  for (let d = 0; d < 3; d++) {
    ctx.fillStyle = "rgba(130,145,234,0.3)";
    ctx.fillRect(W * 0.79 + d * 18, H * 0.115, 12, 6);
  }

  // Vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.05, W / 2, H / 2, H);
  vig.addColorStop(0, "rgba(17,19,24,0)");
  vig.addColorStop(1, "rgba(17,19,24,0.8)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

// ─── AI Voice Agent ──────────────────────────────────────────────────────────
function drawVoiceAgent(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number
) {
  ctx.fillStyle = C.dark;
  ctx.fillRect(0, 0, W, H);

  const cx = W * 0.5;
  const cy = H * 0.5;

  // Sound wave ribbons
  const waveCount = 12;
  for (let w = 0; w < waveCount; w++) {
    const frac = w / (waveCount - 1);
    const amplitude = H * (0.05 + frac * 0.22);
    const freq = 0.015 + frac * 0.01;
    const phase = t * (0.6 + frac * 0.3) + w * 0.4;
    const opacity = 0.08 + frac * 0.18;
    const yOffset = cy + (w - waveCount / 2) * 8;

    ctx.beginPath();
    ctx.moveTo(0, yOffset);
    for (let x = 0; x < W; x += 2) {
      const y =
        yOffset +
        Math.sin(x * freq + phase) * amplitude * Math.sin(Math.PI * (x / W));
      ctx.lineTo(x, y);
    }
    const isAccent = w % 3 === 0;
    ctx.strokeStyle = isAccent
      ? `rgba(130,145,234,${opacity * 1.5})`
      : `rgba(255,255,255,${opacity * 0.4})`;
    ctx.lineWidth = isAccent ? 1.5 : 0.8;
    ctx.stroke();
  }

  // Central pulsing orb — the AI core
  const pulse = 1 + Math.sin(t * 2.2) * 0.08;
  const outerPulse = 1 + Math.sin(t * 1.1) * 0.12;

  const orbGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80 * outerPulse);
  orbGlow.addColorStop(0, `rgba(130,145,234,0.35)`);
  orbGlow.addColorStop(0.5, `rgba(100,115,220,0.1)`);
  orbGlow.addColorStop(1, "rgba(130,145,234,0)");
  ctx.fillStyle = orbGlow;
  ctx.fillRect(cx - 100, cy - 100, 200, 200);

  ctx.beginPath();
  ctx.arc(cx, cy, 28 * pulse, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(130,145,234,0.9)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, 42 * outerPulse, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(130,145,234,0.3)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Frequency bars at bottom (like a voice meter)
  const barCount = 24;
  const barW = W * 0.6 / barCount;
  for (let b = 0; b < barCount; b++) {
    const barH = H * 0.04 + Math.abs(Math.sin(b * 0.6 + t * 3)) * H * 0.1;
    const bx = W * 0.2 + b * (W * 0.6 / barCount);
    const by = H * 0.86 - barH;
    const isActive = Math.sin(b * 0.8 + t * 2) > 0.3;
    ctx.fillStyle = isActive
      ? `rgba(130,145,234,0.65)`
      : `rgba(130,145,234,0.15)`;
    ctx.fillRect(bx, by, barW - 2, barH);
  }

  // Label: "REALTIME" indicator
  ctx.fillStyle = "rgba(130,145,234,0.2)";
  ctx.fillRect(W * 0.38, H * 0.1, W * 0.24, 20);
  ctx.fillStyle = "rgba(130,145,234,0.6)";
  ctx.fillRect(W * 0.38, H * 0.1, W * 0.24 * (0.5 + Math.sin(t) * 0.3), 20);

  // Vignette
  const vig = ctx.createRadialGradient(cx, cy, H * 0.1, cx, cy, H * 0.85);
  vig.addColorStop(0, "rgba(17,19,24,0)");
  vig.addColorStop(1, "rgba(17,19,24,0.75)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

// ─── RPA Workflow ────────────────────────────────────────────────────────────
function drawRPAWorkflow(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number
) {
  ctx.fillStyle = C.dark;
  ctx.fillRect(0, 0, W, H);

  // Process nodes
  const nodes = [
    { x: 0.12, y: 0.35, label: "INPUT" },
    { x: 0.3, y: 0.22, label: "PARSE" },
    { x: 0.3, y: 0.52, label: "EXTRACT" },
    { x: 0.52, y: 0.37, label: "PROCESS" },
    { x: 0.72, y: 0.25, label: "REPORT" },
    { x: 0.72, y: 0.5, label: "OUTPUT" },
    { x: 0.88, y: 0.37, label: "DONE" },
  ];

  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 6],
    [5, 6],
  ];

  // Draw edges with animated data flow
  edges.forEach(([from, to], eIdx) => {
    const n1 = nodes[from];
    const n2 = nodes[to];
    const x1 = W * n1.x;
    const y1 = H * n1.y;
    const x2 = W * n2.x;
    const y2 = H * n2.y;

    // Edge line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "rgba(130,145,234,0.2)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Animated data packet
    const phase = (t * 0.5 + eIdx * 0.3) % 1;
    const px = lerp(x1, x2, phase);
    const py = lerp(y1, y2, phase);
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(130,145,234,${0.6 + Math.sin(t * 3 + eIdx) * 0.2})`;
    ctx.fill();
  });

  // Draw nodes
  nodes.forEach((node, i) => {
    const nx = W * node.x;
    const ny = H * node.y;
    const isActive = Math.floor(t * 0.8) % nodes.length === i;
    const r = isActive ? 22 : 16;
    const alpha = isActive ? 1 : 0.7;

    // Glow
    if (isActive) {
      const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, 40);
      glow.addColorStop(0, "rgba(130,145,234,0.2)");
      glow.addColorStop(1, "rgba(130,145,234,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(nx - 45, ny - 45, 90, 90);
    }

    ctx.beginPath();
    ctx.arc(nx, ny, r, 0, Math.PI * 2);
    ctx.fillStyle = isActive
      ? `rgba(130,145,234,${alpha})`
      : `rgba(20,24,36,${alpha})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(130,145,234,${alpha * 0.8})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Grid background
  for (let gx = 0; gx < W; gx += 32) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, H);
    ctx.strokeStyle = "rgba(130,145,234,0.03)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  for (let gy = 0; gy < H; gy += 32) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(W, gy);
    ctx.strokeStyle = "rgba(130,145,234,0.03)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.85);
  vig.addColorStop(0, "rgba(17,19,24,0)");
  vig.addColorStop(1, "rgba(17,19,24,0.75)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

// ─── RPA Platform (In Development) ──────────────────────────────────────────
function drawRPAPlatform(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number
) {
  ctx.fillStyle = "#0A0C12";
  ctx.fillRect(0, 0, W, H);

  // Isometric blueprint grid
  const gridSize = 36;
  const isoAngle = Math.PI / 6;
  const cosA = Math.cos(isoAngle);
  const sinA = Math.sin(isoAngle);

  const cols = Math.ceil(W / gridSize) + 4;
  const rows = Math.ceil(H / gridSize) + 4;

  ctx.strokeStyle = "rgba(130,145,234,0.07)";
  ctx.lineWidth = 0.5;

  // Right-going isometric lines
  for (let r = -rows; r < rows * 2; r++) {
    const startX = -gridSize * cols;
    const startY = r * gridSize * sinA + H * 0.5;
    ctx.beginPath();
    ctx.moveTo(startX, startY + startX * sinA);
    ctx.lineTo(W + gridSize * 2, startY + (W + gridSize * 2) * sinA);
    ctx.stroke();
  }

  // Left-going isometric lines
  for (let c = -cols; c < cols * 2; c++) {
    const startX = c * gridSize;
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.lineTo(startX + H / sinA, H);
    ctx.stroke();
  }

  // Blueprint structure elements
  const structs = [
    { x: 0.2, y: 0.3, w: 0.18, h: 0.25 },
    { x: 0.42, y: 0.2, w: 0.22, h: 0.35 },
    { x: 0.68, y: 0.3, w: 0.15, h: 0.2 },
    { x: 0.3, y: 0.6, w: 0.4, h: 0.15 },
  ];

  structs.forEach((s, i) => {
    const sx = W * s.x;
    const sy = H * s.y;
    const sw = W * s.w;
    const sh = H * s.h;
    const scanline = (t * 50 + i * 80) % (sh + 10);

    ctx.strokeStyle = `rgba(130,145,234,0.35)`;
    ctx.lineWidth = 1;
    ctx.strokeRect(sx, sy, sw, sh);

    ctx.fillStyle = `rgba(130,145,234,0.04)`;
    ctx.fillRect(sx, sy, sw, sh);

    // Scan line
    if (scanline < sh) {
      ctx.fillStyle = `rgba(130,145,234,0.2)`;
      ctx.fillRect(sx, sy + scanline, sw, 2);
    }

    // Corner marks
    const markSize = 6;
    [[sx, sy], [sx + sw, sy], [sx, sy + sh], [sx + sw, sy + sh]].forEach(
      ([mx, my]) => {
        ctx.strokeStyle = `rgba(130,145,234,0.8)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(mx - markSize, my);
        ctx.lineTo(mx, my);
        ctx.lineTo(mx, my + markSize);
        ctx.stroke();
      }
    );
  });

  // "In Development" scan pulse
  const scanY = (t * 60) % H;
  const scanGrad = ctx.createLinearGradient(0, scanY - 10, 0, scanY + 10);
  scanGrad.addColorStop(0, "rgba(130,145,234,0)");
  scanGrad.addColorStop(0.5, "rgba(130,145,234,0.08)");
  scanGrad.addColorStop(1, "rgba(130,145,234,0)");
  ctx.fillStyle = scanGrad;
  ctx.fillRect(0, scanY - 10, W, 20);

  // Accent nodes at structure intersections
  [[0.42, 0.2], [0.42, 0.55], [0.68, 0.3], [0.3, 0.6]].forEach(([nx, ny]) => {
    const nodePulse = 0.6 + Math.sin(t * 2 + nx * 10) * 0.25;
    ctx.beginPath();
    ctx.arc(W * nx, H * ny, 5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(130,145,234,${nodePulse})`;
    ctx.fill();

    const nGlow = ctx.createRadialGradient(W * nx, H * ny, 0, W * nx, H * ny, 20);
    nGlow.addColorStop(0, `rgba(130,145,234,${nodePulse * 0.3})`);
    nGlow.addColorStop(1, "rgba(130,145,234,0)");
    ctx.fillStyle = nGlow;
    ctx.fillRect(W * nx - 25, H * ny - 25, 50, 50);
  });

  // Vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H);
  vig.addColorStop(0, "rgba(10,12,18,0)");
  vig.addColorStop(1, "rgba(10,12,18,0.75)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function ProjectCoverScene({
  type,
  className = "",
}: ProjectCoverSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      switch (type) {
        case "restaurant":
          drawRestaurant(ctx, W, H, t);
          break;
        case "chatbot":
          drawChatbot(ctx, W, H, t);
          break;
        case "lexassist":
          drawLexAssist(ctx, W, H, t);
          break;
        case "elearning":
          drawElearning(ctx, W, H, t);
          break;
        case "voice-agent":
          drawVoiceAgent(ctx, W, H, t);
          break;
        case "rpa-workflow":
          drawRPAWorkflow(ctx, W, H, t);
          break;
        case "rpa-platform":
          drawRPAPlatform(ctx, W, H, t);
          break;
      }

      t += 0.016;
      raf = requestAnimationFrame(draw);
    };

    // Check reduced motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      // Static render only
      const W = canvas.offsetWidth || 400;
      const H = canvas.offsetHeight || 300;
      canvas.width = W;
      canvas.height = H;
      switch (type) {
        case "restaurant": drawRestaurant(ctx, W, H, 0); break;
        case "chatbot": drawChatbot(ctx, W, H, 2); break;
        case "lexassist": drawLexAssist(ctx, W, H, 0); break;
        case "elearning": drawElearning(ctx, W, H, 0); break;
        case "voice-agent": drawVoiceAgent(ctx, W, H, 1); break;
        case "rpa-workflow": drawRPAWorkflow(ctx, W, H, 1.5); break;
        case "rpa-platform": drawRPAPlatform(ctx, W, H, 0); break;
      }
      return;
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}
