/**
 * Generates multi-part PBR .glb 3D environment assets for KartagoTech's
 * 5-chapter interactive story using Three.js and GLTFExporter.
 *
 * Run: node scripts/generate-models.mjs
 */
import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// Minimal FileReader polyfill for GLTFExporter in Node.js
if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob
        .arrayBuffer()
        .then((buf) => {
          this.result = buf;
          this.onloadend?.({ target: this });
          this.onload?.({ target: this });
        })
        .catch((err) => {
          this.error = err;
          this.onerror?.(err);
        });
    }
    readAsDataURL(blob) {
      blob
        .arrayBuffer()
        .then((buf) => {
          const b64 = Buffer.from(buf).toString("base64");
          this.result = `data:${blob.type || "application/octet-stream"};base64,${b64}`;
          this.onloadend?.({ target: this });
          this.onload?.({ target: this });
        })
        .catch((err) => {
          this.error = err;
          this.onerror?.(err);
        });
    }
  };
}

const OUT_DIR = path.resolve("public/models");
fs.mkdirSync(OUT_DIR, { recursive: true });

const exporter = new GLTFExporter();

function exportGLB(scene, filename) {
  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => {
        const outPath = path.join(OUT_DIR, filename);
        const buf = Buffer.from(result);
        fs.writeFileSync(outPath, buf);
        console.log(`Generated ${filename} (${buf.length} bytes)`);
        resolve();
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

function box(w, h, d, mat, x, y, z, parent) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

function cyl(rt, rb, h, seg, mat, x, y, z, parent) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

// Shared PBR materials
const darkSteel = new THREE.MeshStandardMaterial({
  color: 0x142b52,
  roughness: 0.35,
  metalness: 0.72,
});
const brushedAlum = new THREE.MeshStandardMaterial({
  color: 0xb8c4d9,
  roughness: 0.25,
  metalness: 0.85,
});
const ivoryStone = new THREE.MeshStandardMaterial({
  color: 0xebe9e2,
  roughness: 0.78,
  metalness: 0.04,
});
const warmWood = new THREE.MeshStandardMaterial({
  color: 0x8b6343,
  roughness: 0.65,
  metalness: 0.05,
});
const darkWood = new THREE.MeshStandardMaterial({
  color: 0x4a3525,
  roughness: 0.7,
  metalness: 0.05,
});
const whiteMat = new THREE.MeshStandardMaterial({
  color: 0xf7f8fb,
  roughness: 0.42,
  metalness: 0.06,
});
const blueAccent = new THREE.MeshStandardMaterial({
  color: 0x245bdb,
  roughness: 0.3,
  metalness: 0.3,
});
const glassMat = new THREE.MeshStandardMaterial({
  color: 0x9fc0ff,
  roughness: 0.08,
  metalness: 0.1,
  transparent: true,
  opacity: 0.32,
});
const paperMat = new THREE.MeshStandardMaterial({
  color: 0xf2efe6,
  roughness: 0.9,
  metalness: 0.0,
});
const folderMat = new THREE.MeshStandardMaterial({
  color: 0xc29b61,
  roughness: 0.8,
  metalness: 0.02,
});
const chairFabric = new THREE.MeshStandardMaterial({
  color: 0x253552,
  roughness: 0.75,
  metalness: 0.05,
});

// 1. Chapter 1: Modern Architectural Plaza
async function buildModernPlaza() {
  const g = new THREE.Group();
  g.name = "ModernPlaza";

  // Stepped architectural plinth
  box(14, 0.22, 10, ivoryStone, 0, 0.11, 0, g);
  box(12, 0.18, 8.2, ivoryStone, 0, 0.31, -0.4, g);

  // Twin glass-and-steel architectural portals
  for (const sx of [-4.6, 4.6]) {
    box(0.32, 5.4, 0.32, darkSteel, sx, 2.9, -2.5, g);
    box(0.32, 5.4, 0.32, darkSteel, sx, 2.9, 1.5, g);
    box(0.28, 0.28, 4.4, darkSteel, sx, 5.6, -0.5, g);
    box(0.08, 4.8, 3.6, glassMat, sx, 2.9, -0.5, g);
  }
  // Overhead cantilevered architectural canopy
  box(10.6, 0.28, 4.6, darkSteel, 0, 5.74, -0.5, g);
  box(9.8, 0.08, 0.14, blueAccent, 0, 5.56, 1.72, g);

  // Sleek display monolith frame
  box(5.4, 3.2, 0.24, darkSteel, 0, 2.1, -2.6, g);
  box(5.6, 0.12, 0.6, brushedAlum, 0, 0.45, -2.6, g);

  // Plaza architectural benches
  for (const bx of [-3.2, 3.2]) {
    box(1.8, 0.08, 0.55, warmWood, bx, 0.78, 2.4, g);
    box(0.12, 0.38, 0.48, darkSteel, bx - 0.7, 0.56, 2.4, g);
    box(0.12, 0.38, 0.48, darkSteel, bx + 0.7, 0.56, 2.4, g);
  }

  await exportGLB(g, "scene-modern-plaza.glb");
}

// 2. Chapter 2: Legacy Manual Workspace
async function buildLegacyWorkspace() {
  const g = new THREE.Group();
  g.name = "LegacyWorkspace";

  // Heavy wooden desk
  box(3.4, 0.1, 1.5, darkWood, 0, 0.78, 0, g);
  box(0.1, 0.76, 1.35, darkWood, -1.55, 0.38, 0, g);
  box(0.75, 0.74, 1.32, darkWood, 1.2, 0.37, 0, g); // drawer pedestal
  for (let d = 0; d < 3; d++) {
    box(0.62, 0.18, 0.04, brushedAlum, 1.2, 0.2 + d * 0.22, 0.67, g);
  }

  // Disconnected older monitors
  for (const mx of [-0.65, 0.45]) {
    box(0.76, 0.54, 0.18, darkSteel, mx, 1.15, -0.35, g);
    box(0.24, 0.14, 0.24, darkSteel, mx, 0.86, -0.35, g);
  }

  // Stacks of paper & binders (manual clutter)
  const stacks = [
    [-1.25, 0.2, 6, 0.32],
    [-1.15, -0.25, 4, 0.28],
    [0.95, 0.25, 5, 0.3],
    [1.3, -0.15, 7, 0.26],
  ];
  stacks.forEach(([sx, sz, count, size]) => {
    for (let i = 0; i < count; i++) {
      const m = box(
        size,
        0.04,
        size * 1.2,
        i % 3 === 0 ? folderMat : paperMat,
        sx + (i % 2) * 0.02,
        0.85 + i * 0.045,
        sz,
        g
      );
      m.rotation.y = (i - count / 2) * 0.08;
    }
  });

  // Filing cabinet on side
  box(0.7, 1.55, 0.75, brushedAlum, -2.35, 0.775, -0.25, g);
  for (let i = 0; i < 4; i++) {
    box(0.58, 0.28, 0.04, darkSteel, -2.35, 0.26 + i * 0.35, 0.14, g);
  }

  // Desk lamp
  cyl(0.14, 0.16, 0.04, 16, darkSteel, -1.35, 0.85, -0.45, g);
  cyl(0.02, 0.02, 0.42, 10, darkSteel, -1.35, 1.06, -0.45, g);
  cyl(0.08, 0.18, 0.16, 16, darkSteel, -1.2, 1.24, -0.38, g);

  // Back wall display frame
  box(4.6, 2.7, 0.16, darkSteel, 0, 2.2, -1.4, g);

  await exportGLB(g, "workspace-legacy.glb");
}

// 3. Chapter 3: Modern Connected Software & AI Studio
async function buildModernWorkspace() {
  const g = new THREE.Group();
  g.name = "ModernWorkspace";

  // Clean architectural desk with slim steel frame
  box(3.6, 0.06, 1.4, whiteMat, 0, 0.76, 0, g);
  box(0.06, 0.74, 1.25, darkSteel, -1.65, 0.37, 0, g);
  box(0.06, 0.74, 1.25, darkSteel, 1.65, 0.37, 0, g);

  // Dual slim ultrawide monitors
  for (const [mx, rot] of [
    [-0.58, 0.12],
    [0.58, -0.12],
  ]) {
    const mGroup = new THREE.Group();
    mGroup.position.set(mx, 1.12, -0.32);
    mGroup.rotation.y = rot;
    box(1.05, 0.56, 0.04, darkSteel, 0, 0, 0, mGroup);
    box(0.06, 0.28, 0.06, brushedAlum, 0, -0.22, -0.04, mGroup);
    box(0.28, 0.02, 0.2, brushedAlum, 0, -0.35, -0.02, mGroup);
    g.add(mGroup);
  }

  // Ergonomic chair
  box(0.56, 0.07, 0.54, chairFabric, 0, 0.46, 0.82, g);
  box(0.52, 0.62, 0.07, chairFabric, 0, 0.82, 1.08, g);
  cyl(0.035, 0.035, 0.38, 12, brushedAlum, 0, 0.25, 0.82, g);
  box(0.52, 0.04, 0.06, brushedAlum, 0, 0.04, 0.82, g);
  box(0.06, 0.04, 0.52, brushedAlum, 0, 0.04, 0.82, g);

  // AI & Automation Core Tower on right
  box(0.75, 2.1, 0.75, darkSteel, 2.5, 1.05, -0.3, g);
  for (let i = 0; i < 5; i++) {
    box(0.52, 0.04, 0.77, blueAccent, 2.5, 0.45 + i * 0.34, -0.3, g);
  }

  // Studio wall display frame
  box(5.0, 2.9, 0.16, darkSteel, 0, 2.25, -1.45, g);

  await exportGLB(g, "workspace-modern.glb");
}

// 4. Chapter 4: Opportunity & Collaboration Gallery
async function buildOpportunityGallery() {
  const g = new THREE.Group();
  g.name = "OpportunityGallery";

  // Oval/chamfered conference table
  cyl(1.75, 1.75, 0.07, 36, whiteMat, 0, 0.76, 0.2, g);
  cyl(0.28, 0.38, 0.72, 24, darkSteel, 0, 0.36, 0.2, g);

  // 4 ergonomic chairs around table
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const cx = Math.cos(angle) * 2.15;
    const cz = 0.2 + Math.sin(angle) * 2.15;
    const cg = new THREE.Group();
    cg.position.set(cx, 0, cz);
    cg.rotation.y = -angle + Math.PI / 2;
    box(0.5, 0.07, 0.5, chairFabric, 0, 0.46, 0, cg);
    box(0.48, 0.52, 0.06, chairFabric, 0, 0.76, 0.22, cg);
    cyl(0.03, 0.03, 0.42, 10, brushedAlum, 0, 0.22, 0, cg);
    g.add(cg);
  }

  // Glass architectural partitions
  box(0.08, 3.6, 5.2, glassMat, -4.0, 1.8, 0, g);
  box(0.08, 3.6, 5.2, glassMat, 4.0, 1.8, 0, g);

  // Presentation wall frame
  box(5.6, 3.1, 0.18, darkSteel, 0, 2.25, -2.2, g);

  await exportGLB(g, "opportunity-gallery.glb");
}

// 5. Chapter 5: KartagoTech Executive HQ Monument
async function buildKartagoTechHQ() {
  const g = new THREE.Group();
  g.name = "KartagoTechHQ";

  // Reception / Executive plinth
  box(4.2, 1.02, 1.1, whiteMat, 0, 0.51, 0.6, g);
  box(4.28, 0.06, 1.16, darkSteel, 0, 1.05, 0.6, g);
  box(3.8, 0.05, 0.06, blueAccent, 0, 0.92, 1.17, g);

  // Architectural portal arch
  box(0.35, 4.4, 0.35, darkSteel, -3.4, 2.2, -1.8, g);
  box(0.35, 4.4, 0.35, darkSteel, 3.4, 2.2, -1.8, g);
  box(7.15, 0.35, 0.35, darkSteel, 0, 4.4, -1.8, g);
  box(6.6, 0.08, 0.1, blueAccent, 0, 4.2, -1.62, g);

  // Executive display wall frame
  box(5.8, 3.2, 0.2, darkSteel, 0, 2.25, -2.4, g);

  await exportGLB(g, "kartagotech-hq.glb");
}

await buildModernPlaza();
await buildLegacyWorkspace();
await buildModernWorkspace();
await buildOpportunityGallery();
await buildKartagoTechHQ();
