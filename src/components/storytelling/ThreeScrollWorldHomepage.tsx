"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { ContactForm } from "@/components/ContactForm";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const COPY = {
  en: {
    srHeading: "Build the business you want to become.",
    scrollHint: "Scroll ↓",
    hudBrand: "KartagoTech",
    scenes: [
      { r: 0, lab: "The problem", l: ["Your business is working.", "But is it working smarter?"] },
      { r: 1, lab: "The discovery", l: ["There’s a smarter way to work."] },
      { r: 1, lab: "The transformation", l: ["Technology changes how businesses operate."] },
      { r: 1, lab: "Collaboration", l: ["Connect your people.", "Simplify your operations."] },
      { r: 1, lab: "Every industry", l: ["Every business has different challenges.", "We build solutions for them."] },
    ],
    brand: {
      eyebrow: "Technology partner for every industry",
      headline: "Build the business you want to become.",
      sup: "We engineer custom software, AI solutions and intelligent automation that help businesses move forward.",
      cta1: "Let’s build what’s next. →",
      cta2: "Explore our work ↗",
      list: [
        "Custom software development",
        "Web and mobile applications",
        "AI solutions and integrations",
        "Business process automation",
        "Connected digital systems",
      ],
      industries: "For retail, hospitality, healthcare, logistics, education and beyond.",
    },
    contact: {
      headline: "Let’s build what’s next.",
      body: "Tell us about your operational challenges or upcoming digital product. We review every inquiry carefully and respond directly.",
    },
  },
  fr: {
    srHeading: "Construisez l'entreprise que vous voulez devenir.",
    scrollHint: "Défiler ↓",
    hudBrand: "KartagoTech",
    scenes: [
      { r: 0, lab: "Le problème", l: ["Votre entreprise fonctionne.", "Mais travaille-t-elle plus intelligemment ?"] },
      { r: 1, lab: "La découverte", l: ["Il existe une façon plus intelligente de travailler."] },
      { r: 1, lab: "La transformation", l: ["La technologie transforme le fonctionnement des entreprises."] },
      { r: 1, lab: "Collaboration", l: ["Connectez vos équipes.", "Simplifiez vos opérations."] },
      { r: 1, lab: "Chaque secteur", l: ["Chaque entreprise a ses propres défis.", "Nous créons les solutions adaptées."] },
    ],
    brand: {
      eyebrow: "Partenaire technologique pour chaque secteur",
      headline: "Construisez l'entreprise que vous voulez devenir.",
      sup: "Nous concevons des logiciels sur mesure, des solutions IA et de l'automatisation intelligente qui font avancer les entreprises.",
      cta1: "Construisons la suite. →",
      cta2: "Voir nos projets ↗",
      list: [
        "Développement de logiciels sur mesure",
        "Applications web et mobiles",
        "Solutions et intégrations IA",
        "Automatisation des processus métier",
        "Systèmes digitaux connectés",
      ],
      industries: "Pour le retail, l'hôtellerie, la santé, la logistique, l'éducation et au-delà.",
    },
    contact: {
      headline: "Construisons la suite.",
      body: "Parlez-nous de vos enjeux opérationnels ou de votre prochain projet digital. Nous étudions chaque demande et répondons directement.",
    },
  },
} as const;

const WEIGHTS = [160, 160, 160, 160, 160, 200];
const TOTAL_W = WEIGHTS.reduce((a, b) => a + b, 0);
const ST: number[] = [];
const EN: number[] = [];
{
  let acc = 0;
  WEIGHTS.forEach((w) => {
    ST.push(acc / TOTAL_W);
    acc += w;
    EN.push(acc / TOTAL_W);
  });
}

export function ThreeScrollWorldHomepage({ locale, dict }: Props) {
  const copy = locale === "fr" ? COPY.fr : COPY.en;
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const hudFillRef = useRef<HTMLDivElement>(null);
  const hudDotRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const txtRefs = useRef<(HTMLDivElement | null)[]>([]);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const jumpTo = (i: number) => {
    const runway = runwayRef.current;
    if (!runway) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = runway.offsetHeight - window.innerHeight;
    const br = 5;
    const f = i < br ? ST[i] + 0.3 * (EN[i] - ST[i]) : ST[i] + 0.85 * (EN[i] - ST[i]);
    window.scrollTo({
      top: window.scrollY + runway.getBoundingClientRect().top + s * f,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    const runway = runwayRef.current;
    const stage = stageRef.current;
    const cv = canvasRef.current;
    if (!runway || !stage || !cv) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = 5;
    const BR = 5;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    } catch {
      renderer = null;
      stage.style.background = "linear-gradient(160deg,#142B52,#111318)";
    }

    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const buildWorld = (R: THREE.WebGLRenderer) => {
      const S = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 240);
      S.fog = new THREE.Fog(0x6b737a, 16, 80);
      S.background = new THREE.Color(0x6b737a);

      const hemi = new THREE.HemisphereLight(0xffffff, 0x5a6470, 0.6);
      S.add(hemi);
      const sun = new THREE.DirectionalLight(0xfff0d8, 0);
      sun.position.set(14, 30, -40);
      S.add(sun);

      const zl = [
        [0x9fb4c8, 0],
        [0x7fb0ff, -24],
        [0xffe2b8, -50],
        [0xffe2b8, -73],
        [0xffeccc, -96],
      ].map((a) => {
        const l = new THREE.PointLight(a[0], 0, 40, 2);
        l.position.set(0, 6, a[1]);
        S.add(l);
        return l;
      });

      const Bx = track(new THREE.BoxGeometry(1, 1, 1));
      const Cy = track(new THREE.CylinderGeometry(1, 1, 1, 14));
      const Sp = track(new THREE.SphereGeometry(1, 16, 12));
      const mats: Record<string, THREE.MeshLambertMaterial> = {};

      const M = (c: number, e = 0) => {
        const k = `${c}|${e}`;
        if (!mats[k]) {
          mats[k] = track(new THREE.MeshLambertMaterial({ color: c, emissive: e }));
        }
        return mats[k];
      };

      const add = (
        g: THREE.BufferGeometry,
        m: THREE.Material,
        x: number,
        y: number,
        z: number,
        sx: number,
        sy: number,
        sz: number,
        p?: THREE.Object3D
      ) => {
        const o = new THREE.Mesh(g, m);
        o.position.set(x, y, z);
        o.scale.set(sx, sy, sz);
        (p || S).add(o);
        return o;
      };

      const box = (
        w: number,
        h: number,
        d: number,
        x: number,
        y: number,
        z: number,
        c: number,
        e = 0,
        p?: THREE.Object3D
      ) => add(Bx, M(c, e), x, y, z, w, h, d, p);

      const fm = track(new THREE.MeshLambertMaterial({ color: 0x5d6166 }));
      add(Bx, fm, 0, -0.1, -60, 44, 0.2, 190);

      const dash = (k: number) => {
        const c = document.createElement("canvas");
        c.width = 512;
        c.height = 288;
        const x = c.getContext("2d")!;
        x.fillStyle = "#0f1c33";
        x.fillRect(0, 0, 512, 288);
        x.fillStyle = "#8291EA";
        x.fillRect(0, 0, 512, 22);
        ["#3aa6b9", "#8291EA", "#ffcf7a", "#7bd88f"].forEach((q, i) => {
          x.fillStyle = q;
          x.fillRect(16 + i * 122, 36, 110, 46);
        });
        x.strokeStyle = "#ffcf7a";
        x.lineWidth = 5;
        x.beginPath();
        [0.7, 0.6, 0.66, 0.45, 0.5, 0.3, 0.36, 0.12].forEach((v, i) => {
          const px = 24 + i * 66;
          const py = 110 + (v + k * 0.05) * 150;
          if (i) x.lineTo(px, py);
          else x.moveTo(px, py);
        });
        x.stroke();
        x.fillStyle = "#3aa6b9";
        for (let i = 0; i < 8; i++) {
          const h = 20 + ((i * 37 + k * 19) % 70);
          x.fillRect(24 + i * 62, 280 - h, 38, h);
        }
        const t = track(new THREE.CanvasTexture(c));
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      };

      const DT = [dash(0), dash(1), dash(2)];

      const screen = (
        w: number,
        h: number,
        x: number,
        y: number,
        z: number,
        ry: number,
        tx: THREE.Texture
      ) => {
        const g = new THREE.Group();
        g.position.set(x, y, z);
        g.rotation.y = ry;
        S.add(g);
        add(Bx, M(0x10151c), 0, 0, 0, w + 0.15, h + 0.15, 0.12, g);
        const s = new THREE.Mesh(
          track(new THREE.PlaneGeometry(w, h)),
          track(new THREE.MeshBasicMaterial({ map: tx }))
        );
        s.position.z = 0.07;
        g.add(s);
        return g;
      };

      function person(
        x: number,
        z: number,
        o: {
          ry?: number;
          shirt?: number;
          pants?: number;
          hair?: number;
          sit?: number;
          pose?: [number[], number[]];
        } = {}
      ) {
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        g.rotation.y = o.ry || 0;
        S.add(g);
        const sh = o.shirt || 0xf2f2f2;
        const skin = 0xe9c9a3;
        const sit = o.sit ? -0.45 : 0;
        if (!o.sit) box(0.5, 0.85, 0.3, 0, 0.42, 0, o.pants || 0x35507a, 0, g);
        box(0.62, 0.85, 0.36, 0, 1.25 + sit, 0, sh, 0, g);
        add(Sp, M(skin), 0, 1.9 + sit, 0, 0.22, 0.24, 0.22, g);
        [
          [-0.12, 0.1],
          [0.12, 0.1],
          [0, 0.16],
          [-0.18, 0],
          [0.18, 0],
          [0, 0.04],
          [0, 0.1],
        ].forEach((h, i) =>
          add(
            Sp,
            M(o.hair || 0x2a1a12),
            h[0],
            2.05 + sit + h[1] - (i > 4 ? -0.1 : 0),
            i % 2 ? -0.06 : 0.04,
            0.11,
            0.11,
            0.11,
            g
          )
        );
        const arm = (sx: number, rx: number, rz: number) => {
          const a = new THREE.Group();
          a.position.set(sx * 0.4, 1.6 + sit, 0);
          a.rotation.set(rx, 0, rz);
          add(Cy, M(sh), 0, -0.34, 0, 0.09, 0.68, 0.09, a);
          add(Sp, M(skin), 0, -0.72, 0, 0.09, 0.09, 0.09, a);
          g.add(a);
        };
        const P = o.pose || [
          [0, 0.1],
          [0, -0.1],
        ];
        arm(-1, P[0][0], P[0][1]);
        arm(1, P[1][0], P[1][1]);
        return g;
      }

      const desk = (x: number, z: number, w = 2.4) => {
        box(w, 0.1, 1.1, x, 0.95, z, 0x8b6b4a);
        [
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ].forEach((q) =>
          box(0.1, 0.9, 0.1, x + q[0] * (w / 2 - 0.1), 0.47, z + q[1] * 0.45, 0x4a3a2a)
        );
      };
      const chair = (x: number, z: number) => {
        box(0.7, 0.1, 0.7, x, 0.55, z, 0x2a2f38);
        box(0.7, 0.8, 0.1, x, 0.95, z + 0.35, 0x2a2f38);
      };

      // Zone 1: the manual office
      [
        [-11, -3],
        [3, 11],
      ].forEach((a) => box(8, 6, 0.3, (a[0] + a[1]) / 2, 3, -6, 0x8c8f93));
      for (let i = 0; i < 16; i++) {
        box(
          0.4,
          0.4,
          0.02,
          -9.5 + (i % 8) * 0.9,
          3 + Math.floor(i / 8) * 0.7,
          -5.82,
          i % 3 ? 0xf2d95c : 0xf29bb4
        );
      }
      desk(0, 1.2, 3.4);
      chair(0, -0.9);
      box(0.8, 0.05, 0.55, 0, 1.03, 1.1, 0x20242b);
      box(0.8, 0.5, 0.05, 0, 1.3, 0.85, 0x20242b).rotation.x = -0.2;
      [-1.5, -1.1, 1.1, 1.5, -0.6, 0.7].forEach((x, i) =>
        box(
          0.5,
          0.2 + ((i * 37) % 7) * 0.12,
          0.4,
          x,
          1 + 0.1 + ((i * 37) % 7) * 0.06,
          1.1 + ((i % 2) - 0.5) * 0.3,
          0xf1efe8
        )
      );
      for (let i = 0; i < 18; i++) {
        const m = box(
          0.55,
          0.02,
          0.4,
          -4 + ((i * 53) % 80) / 10,
          0.02,
          2 + ((i * 29) % 40) / 10,
          0xf1efe8
        );
        m.rotation.y = i;
      }
      box(1, 2, 0.8, -6, 1, -4.8, 0x6a7077);
      box(1, 2, 0.8, -7.2, 1, -4.8, 0x6a7077);
      box(1, 2, 0.8, 6, 1, -4.8, 0x6a7077);
      const phoneM = track(
        new THREE.MeshLambertMaterial({ color: 0xaa2222, emissive: 0xff3b30 })
      );
      add(Bx, M(0x15181c), 2.1, 1.04, 1.2, 0.35, 0.1, 0.6);
      add(Sp, phoneM, 2.1, 1.15, 1.2, 0.1, 0.1, 0.1);
      person(0, -0.2, { sit: 1, pose: [[0, 0.05], [-2.7, -0.2]] });

      // Zone 2: the dashboard
      screen(7.5, 4.2, 6.5, 2.9, -24, -1.25, DT[0]);
      person(1.2, -24, { ry: 1.1, pose: [[0, 0.1], [-1.35, -0.15]] });

      // Zone 3: a connected team
      const pulses: Array<{ c: THREE.QuadraticBezierCurve3; pm: THREE.Mesh; o: number }> = [];
      const tubeM = track(
        new THREE.MeshBasicMaterial({ color: 0xffcf7a, transparent: true, opacity: 0 })
      );
      const pulseMat = track(new THREE.MeshBasicMaterial({ color: 0xfff3d0 }));

      const link = (
        a: [number, number, number],
        b: [number, number, number],
        lift: number,
        mat: THREE.Material
      ) => {
        const c = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(...a),
          new THREE.Vector3((a[0] + b[0]) / 2, Math.max(a[1], b[1]) + lift, (a[2] + b[2]) / 2),
          new THREE.Vector3(...b)
        );
        const t = new THREE.Mesh(track(new THREE.TubeGeometry(c, 24, 0.05, 6, false)), mat);
        S.add(t);
        const pm = new THREE.Mesh(Sp, pulseMat);
        pm.scale.setScalar(0.14);
        S.add(pm);
        pulses.push({ c, pm, o: Math.random() });
        return t;
      };

      add(Sp, track(new THREE.MeshBasicMaterial({ color: 0xffcf7a })), 0, 6, -57, 0.5, 0.5, 0.5);
      (
        [
          [-5.3, -60],
          [-1.8, -60],
          [1.8, -60],
          [5.3, -60],
          [-7, -54],
          [-3.5, -54],
          [0, -54],
          [3.5, -54],
          [7, -54],
        ] as Array<[number, number]>
      ).forEach((q, i) => {
        desk(q[0], q[1], 2.4);
        chair(q[0], q[1] + 1.6);
        person(q[0], q[1] + 1.6, {
          sit: 1,
          ry: Math.PI,
          shirt: [0x2f7fb5, 0x3a8f6a, 0x20242b, 0xc9b48a, 0x7a6fb0][i % 5],
          hair: [0x2a1a12, 0x1a1a1a, 0x5a3a22][i % 3],
          pose: [
            [-1.1, 0.1],
            [-1.1, -0.1],
          ],
        });
        screen(1.3, 0.8, q[0], 1.65, q[1] - 0.1, 0, DT[i % 3]);
        link([q[0], 2.2, q[1]], [0, 6, -57], 3, tubeM);
      });
      person(0, -48, { pose: [[-1.2, 0.9], [-1.2, -0.9]] });

      // Zone 4: collaboration
      add(Cy, M(0xb08a5a), 0, 0.95, -74, 2.1, 0.12, 2.1);
      add(Cy, M(0x4a3a2a), 0, 0.5, -74, 0.3, 0.9, 0.3);
      screen(4.2, 2.4, 0, 2.6, -79, 0, DT[1]);
      (
        [
          [0.85, 0xf2f2f2, 0x2a1a12],
          [0.2, 0x3a6a55, 0x1a1a1a],
          [-0.4, 0x20242b, 0x4a2a1a],
          [-0.95, 0xd9c3a0, 0x2a1a12],
          [1.5, 0x2f7fb5, 0x3a2a1a],
        ] as Array<[number, number, number]>
      ).forEach((a, i) => {
        const an = Math.PI * (a[0] + 0.15);
        const x = 3 * Math.cos(an);
        const z = -74 + 3 * Math.sin(an);
        person(x, z, {
          ry: Math.atan2(-x, -(z + 74)),
          shirt: a[1],
          hair: a[2],
          pose:
            i === 0
              ? [
                  [-0.9, 0.1],
                  [-1.3, -0.2],
                ]
              : [
                  [-0.6, 0.1],
                  [-0.7, -0.1],
                ],
        });
        box(0.5, 0.03, 0.35, x * 0.6, 1.03, -74 + (z + 74) * 0.6, 0x7bd88f, 0x1a4a2a);
      });

      // Zone 5: a district of different industries
      const nodes: Array<[number, number, number]> = [];
      const nm = track(new THREE.MeshBasicMaterial({ color: 0x8291ea }));
      const tubeM2 = track(
        new THREE.MeshBasicMaterial({ color: 0x8291ea, transparent: true, opacity: 0 })
      );
      const bld = (x: number, w: number, h: number, c: number) => {
        box(w, h, 5, x, h / 2, -106, c);
        box(w + 0.3, 0.3, 5.3, x, h + 0.15, -106, 0xdfe3e8);
      };
      bld(-10.5, 6, 4, 0xd9c3a0);
      for (let i = 0; i < 7; i++) {
        box(0.86, 0.5, 1.4, -13 + i * 0.86, 3, -103.2, i % 2 ? 0xffffff : 0x2f7fb5);
      }
      box(2, 0.8, 0.1, -10.5, 4.5, -103.4, 0xff9f43, 0xff7a1a);

      bld(-3.5, 6, 3.6, 0xcfe3ee);
      box(5, 2, 0.1, -3.5, 1.6, -103.4, 0x9fd0ea, 0x2b5a74);
      [-1, 0, 1].forEach((k) => box(1.3, 0.12, 0.5, -3.5 + k * 1.6, 1.2 + (k + 1) * 0.3, -103, 0x6a7077));

      bld(3.5, 6, 4.2, 0xf4f6f8);
      box(0.5, 1.8, 0.1, 3.5, 2.6, -103.4, 0x3aa68a, 0x1a6a55);
      box(1.8, 0.5, 0.1, 3.5, 2.6, -103.4, 0x3aa68a, 0x1a6a55);

      bld(10.5, 6, 3, 0xb8bec6);
      box(2.4, 2.2, 0.1, 10.5, 1.1, -103.4, 0x7d858e);
      [0, 1, 2, 3].forEach((k) => box(0.9, 0.9, 0.9, 8.4 + k * 1.1, 0.45, -101.8, 0xb08a5a));

      [-10.5, -3.5, 3.5, 10.5].forEach((x, i) => {
        const h = [4, 3.6, 4.2, 3][i];
        add(Sp, nm, x, h + 1.3, -106, 0.35, 0.35, 0.35);
        box(0.06, 1, 0.06, x, h + 0.7, -106, 0xdfe3e8);
        nodes.push([x, h + 1.3, -106]);
      });

      box(0.9, 11, 0.9, 0, 5.5, -114, 0x1c2a44, 0x0d1a30);
      add(Sp, track(new THREE.MeshBasicMaterial({ color: 0xffcf7a })), 0, 11.3, -114, 0.8, 0.8, 0.8);
      nodes.forEach((n) => link(n, [0, 11.3, -114], 5, tubeM2));
      for (let i = 0; i < 3; i++) link(nodes[i], nodes[i + 1], 3, tubeM2);
      person(0, -96, { ry: 0.25, pose: [[0, 0.1], [-0.5, -0.5]] });

      const WP: Array<[number, number, number]> = [
        [4, 2, 8],
        [-1, 1.8, -15.5],
        [5, 2.5, -38],
        [-5.5, 2.3, -62],
        [0, 3, -84],
        [0, 30, -80],
      ];
      const TG: Array<[number, number, number]> = [
        [0, 1.2, 0],
        [3, 1.9, -24],
        [0, 1.5, -48],
        [0, 1.2, -72.5],
        [0, 1.8, -98],
        [0, 0, -106],
      ];
      const SW = [0, -4.5, 5, -5, 0];

      const kf = (a: Array<[number, number]>, p: number) => {
        for (let i = 1; i < a.length; i++) {
          if (p <= a[i][0]) {
            const t = (p - a[i - 1][0]) / (a[i][0] - a[i - 1][0]);
            const c0 = a[i - 1][1];
            const c1 = a[i][1];
            const ch = (s: number) => Math.round(lerp((c0 >> s) & 255, (c1 >> s) & 255, t));
            return (ch(16) << 16) | (ch(8) << 8) | ch(0);
          }
        }
        return a[a.length - 1][1];
      };

      const BG: Array<[number, number]> = [
        [0, 0x6b737a],
        [0.2, 0x737d85],
        [0.4, 0x9fb9cf],
        [0.6, 0xe6d3b0],
        [0.78, 0xa8c8e6],
        [0.88, 0x0b1626],
        [1, 0x0a1424],
      ];
      const FL: Array<[number, number]> = [
        [0, 0x5d6166],
        [0.3, 0x6a6e72],
        [0.5, 0xb9a98b],
        [0.8, 0xcbb894],
        [1, 0x1b2230],
      ];

      return {
        resize(w: number, h: number) {
          R.setSize(w, h, false);
          cam.aspect = w / Math.max(1, h);
          cam.fov = w < h ? 64 : 50;
          cam.updateProjectionMatrix();
        },
        update(p: number, seg: number, loc: number, tm: number) {
          const a = Math.min(seg, 4);
          const b = Math.min(seg + 1, 5);
          const g = seg < BR ? ease(clamp((loc - 0.55) / 0.45)) : 0;
          const dr = 1 - g;
          const F = WP[seg];
          const T2 = WP[b];
          const L0 = TG[seg];
          const L1 = TG[b];
          const sw = (SW[a] || 0) * Math.sin(Math.PI * g) * (seg < BR ? 1 : 0);

          cam.position.set(
            lerp(F[0], T2[0], g) + sw + Math.sin(loc * 3.1) * 0.5 * dr,
            lerp(F[1], T2[1], g) + (seg === BR ? loc * 4 : 0),
            lerp(F[2], T2[2], g) - loc * dr * (seg < BR ? 1 : 0)
          );
          cam.lookAt(lerp(L0[0], L1[0], g), lerp(L0[1], L1[1], g), lerp(L0[2], L1[2], g));

          const warm = ease(clamp((p - 0.3) / 0.3));
          const bgHex = kf(BG, p);
          (S.background as THREE.Color).setHex(bgHex);
          if (S.fog) S.fog.color.setHex(bgHex);
          fm.color.setHex(kf(FL, p));
          hemi.intensity = 0.5 + 0.55 * warm;
          sun.intensity = ease(clamp((p - 0.55) / 0.2)) * (1 - ease(clamp((p - 0.82) / 0.08)));

          zl[0].intensity =
            (1 - 0.6 * warm) * (0.85 + 0.15 * Math.sin(tm * 17 + Math.sin(tm * 3) * 4));
          zl[1].intensity = 1.6 * ease(clamp((p - 0.1) / 0.15));
          zl[2].intensity = 2.2 * warm;
          zl[3].intensity = 2.2 * warm;
          zl[4].intensity = 2.4 * ease(clamp((p - 0.6) / 0.2));

          phoneM.emissiveIntensity = (0.3 + 0.7 * Math.abs(Math.sin(tm * 6))) * (1 - warm);
          const n3 = ease(clamp((p - 0.36) / 0.18));
          const n5 = ease(clamp((p - 0.64) / 0.16));
          tubeM.opacity = n3 * 0.9;
          tubeM2.opacity = n5 * 0.9;
          pulses.forEach((q, i) => {
            const on = i < 9 ? n3 : n5;
            q.pm.visible = on > 0.7;
            if (on > 0.7) q.pm.position.copy(q.c.getPoint((tm * 0.2 + q.o) % 1));
          });
          R.render(S, cam);
        },
      };
    };

    const W3 = renderer ? buildWorld(renderer) : null;
    const fit = () => {
      if (W3) W3.resize(stage.clientWidth, stage.clientHeight);
    };
    window.addEventListener("resize", fit);
    fit();

    const raw = () => {
      const s = runway.offsetHeight - window.innerHeight;
      return s <= 0 ? 0 : clamp(-runway.getBoundingClientRect().top / s);
    };
    const at = (p: number) => {
      for (let i = 0; i < EN.length; i++) if (p < EN[i]) return i;
      return BR;
    };

    let sm = -1;
    let lastSeg = -1;
    let inView = true;
    let raf = 0;
    const t0 = performance.now();

    const tick = () => {
      raf = 0;
      const tg = raw();
      sm = sm < 0 ? tg : sm + (tg - sm) * (reduce ? 1 : 0.12);
      if (Math.abs(tg - sm) < 0.0003) sm = tg;
      const p = sm;
      const seg = at(p);
      const loc = clamp((p - ST[seg]) / (EN[seg] - ST[seg]));

      if (seg !== lastSeg) {
        lastSeg = seg;
        btnRefs.current.forEach((b, i) => {
          if (b) b.dataset.a = String(i === seg);
        });
      }

      if (W3) W3.update(p, seg, loc, reduce ? 0 : (performance.now() - t0) / 1000);

      for (let i = 0; i < N; i++) {
        const l = clamp((p - ST[i]) / (EN[i] - ST[i]));
        const o = ease(clamp((l - 0.5) / 0.12));
        const is = i ? 0.06 : -0.2;
        const container = txtRefs.current[i];
        if (!container) continue;
        container.querySelectorAll<HTMLElement>("[data-r]").forEach((e, k) => {
          const t = ease(clamp((l - (is + k * 0.03)) / 0.1));
          const dep = k ? 120 + k * 220 : 90;
          const y = (0.32 - l) * dep + (1 - t) * 14;
          e.style.opacity = (t * (1 - o)).toFixed(3);
          e.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`;
        });
      }

      const bl = clamp((p - ST[BR]) / (EN[BR] - ST[BR]));
      const bt = ease(clamp(bl / 0.45));
      if (veilRef.current) veilRef.current.style.opacity = (bt * 0.82).toFixed(3);

      const brandEl = brandRef.current;
      if (brandEl) {
        brandEl.querySelectorAll<HTMLElement>("[data-r]").forEach((e, k) => {
          const q = ease(clamp((bl - (0.3 + k * 0.04)) / 0.12));
          e.style.opacity = q.toFixed(3);
          e.style.transform = `translate3d(0,${((1 - q) * 16).toFixed(1)}px,0)`;
        });
        brandEl.style.pointerEvents = bl > 0.45 ? "auto" : "none";
        brandEl.setAttribute("aria-hidden", bl > 0.4 ? "false" : "true");
      }

      if (hudFillRef.current) hudFillRef.current.style.width = `${(p * 100).toFixed(2)}%`;
      if (hudDotRef.current) hudDotRef.current.style.left = `${(p * 100).toFixed(2)}%`;
      if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - p * 25));

      if (inView) raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !raf) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "100px" }
    );
    observer.observe(runway);
    raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", fit);
      disposables.forEach((d) => {
        try {
          d.dispose();
        } catch {
          // ignore
        }
      });
      if (renderer) renderer.dispose();
    };
  }, []);

  const hudLabels = [...copy.scenes.map((s) => s.lab), copy.hudBrand];

  return (
    <div className="bg-[#111318] text-white">
      <h1 className="sr-only">{copy.srHeading}</h1>

      {/* ── 3D SCROLL WORLD RUNWAY ────────────────────────────────────────── */}
      <div
        ref={runwayRef}
        className="relative"
        style={{ height: `${TOTAL_W}svh` }}
      >
        <div
          ref={stageRef}
          className="sticky top-20 h-[calc(100svh-5rem)] overflow-hidden bg-[#111318]"
        >
          {/* Three.js Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block"
            aria-hidden="true"
          />

          {/* Brand transition veil */}
          <div
            ref={veilRef}
            className="absolute inset-0 z-[9] pointer-events-none opacity-0"
            style={{
              background: "linear-gradient(135deg, #142B52, #111318 60%)",
            }}
          />

          {/* Bottom legibility gradient */}
          <div
            className="absolute left-0 right-0 bottom-0 h-[62%] z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(17,19,24,0.88), rgba(17,19,24,0.35) 55%, transparent)",
            }}
          />

          {/* 5 Story Chapter Overlays */}
          {copy.scenes.map((s, i) => (
            <div
              key={s.lab}
              ref={(el) => {
                txtRefs.current[i] = el;
              }}
              className={`absolute left-0 right-0 bottom-0 z-20 pointer-events-none px-5 sm:px-8 lg:px-12 pb-[clamp(84px,13vh,120px)] flex ${
                s.r ? "justify-end text-right" : ""
              }`}
            >
              <div className="max-w-[42rem]">
                <p
                  data-r
                  className="opacity-0 font-mono text-[11px] font-medium tracking-[0.24em] uppercase text-[#8291EA] mb-3"
                >
                  0{i + 1} / 05 — {s.lab}
                </p>
                <h2 className="font-display font-medium text-[clamp(1.9rem,4.8vw,4.2rem)] leading-[1.04] tracking-[-0.02em]">
                  {s.l.map((line, li) => (
                    <span
                      key={line}
                      data-r
                      className={`block opacity-0 ${li > 0 ? "text-[#A9B4F7]" : ""}`}
                    >
                      {line}
                    </span>
                  ))}
                </h2>
              </div>
            </div>
          ))}

          {/* Final Brand Reveal Overlay */}
          <div
            ref={brandRef}
            aria-hidden="true"
            className="absolute inset-0 z-20 flex items-center pointer-events-none px-5 sm:px-8 lg:px-12"
          >
            <div className="max-w-[1360px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
              <div className="lg:col-span-7">
                <div
                  data-r
                  className="opacity-0 font-display font-semibold text-[clamp(18px,2.4vw,26px)] tracking-[0.34em]"
                >
                  KARTAGOTECH <b className="text-[#8291EA] font-semibold">AGENCY</b>
                </div>
                <p
                  data-r
                  className="opacity-0 mt-5 font-mono text-[11px] font-medium tracking-[0.24em] uppercase text-[#8291EA]"
                >
                  {copy.brand.eyebrow}
                </p>
                <h2
                  data-r
                  className="opacity-0 mt-3 font-display font-medium text-[clamp(1.7rem,5vw,4.4rem)] leading-none uppercase tracking-[-0.02em]"
                >
                  {copy.brand.headline}
                </h2>
                <p
                  data-r
                  className="opacity-0 mt-4 max-w-[36rem] text-white/75 text-base sm:text-lg"
                >
                  {copy.brand.sup}
                </p>
                <div data-r className="opacity-0 flex flex-wrap gap-3 mt-6">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#8291EA] text-[#111318] font-medium text-sm tracking-[0.02em] hover:bg-[#6e7fe3] transition-colors"
                  >
                    {copy.brand.cta1}
                  </a>
                  <Link
                    href={getLocalizedPath("/work", locale)}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 border border-white/40 text-white font-medium text-sm tracking-[0.02em] hover:border-white transition-colors"
                  >
                    {copy.brand.cta2}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <ol className="list-none p-0 border-t border-white/20">
                  {copy.brand.list.map((item, idx) => (
                    <li
                      key={item}
                      data-r
                      className="opacity-0 flex gap-4 items-baseline py-2.5 border-b border-white/15 text-[15px]"
                    >
                      <i className="not-italic font-mono font-medium text-[10px] tracking-[0.18em] text-[#8291EA]">
                        0{idx + 1}
                      </i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
                <p
                  data-r
                  className="opacity-0 hidden lg:block mt-3.5 text-sm text-white/60"
                >
                  {copy.brand.industries}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Timeline HUD */}
          <nav
            aria-label="Story chapters"
            className="absolute left-5 right-5 sm:left-8 sm:right-8 lg:left-12 lg:right-12 bottom-[18px] h-[30px] z-40"
          >
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/30">
              <div ref={hudFillRef} className="h-[1px] bg-[#8291EA] w-0" />
            </div>
            <div
              ref={hudDotRef}
              className="absolute top-1/2 w-[9px] h-[9px] -mt-[4.5px] -ml-[4.5px] rounded-full bg-white pointer-events-none"
              style={{ boxShadow: "0 0 0 4px rgba(130,145,234,0.45)" }}
            />
            {hudLabels.map((lab, i) => (
              <button
                key={lab}
                ref={(el) => {
                  btnRefs.current[i] = el;
                }}
                type="button"
                aria-label={lab}
                data-a={i === 0 ? "true" : "false"}
                onClick={() => jumpTo(i)}
                style={{ left: `${((ST[i] + EN[i]) / 2) * 100}%` }}
                className="group absolute top-1/2 w-6 h-6 -mt-3 -ml-3 flex items-center justify-center cursor-pointer"
              >
                <em className="hidden min-[900px]:block not-italic absolute bottom-[22px] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono font-medium text-[10px] tracking-[0.16em] uppercase text-white/55 group-data-[a=true]:text-white">
                  {lab}
                </em>
                <i className="w-[7px] h-[7px] bg-white/55 group-data-[a=true]:bg-[#8291EA]" />
              </button>
            ))}
          </nav>

          {/* Scroll Hint */}
          <div
            ref={hintRef}
            aria-hidden="true"
            className="absolute left-5 sm:left-8 lg:left-12 top-6 z-30 font-mono font-medium text-[10px] tracking-[0.24em] uppercase text-white/65 motion-reduce:hidden"
          >
            {copy.scrollHint}
          </div>
        </div>
      </div>

      {/* ── CONTACT FINALE ────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="py-16 sm:py-24 px-5 sm:px-8 lg:px-12 bg-[#111318] border-t border-white/10"
      >
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <h2 className="font-display font-medium text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.04] tracking-[-0.02em] text-white mb-6">
              {copy.contact.headline}
            </h2>
            <p className="text-white/75 max-w-[36rem] text-base leading-relaxed">
              {copy.contact.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={getLocalizedPath("/work", locale)}
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white text-sm font-medium hover:border-white transition-colors"
              >
                {copy.brand.cta2}
              </Link>
              <Link
                href={getLocalizedPath("/services", locale)}
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white text-sm font-medium hover:border-white transition-colors"
              >
                {dict.home.services.exploreServices}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#F7F6F2] text-[#142B52] p-6 sm:p-10 rounded-xl">
            <ContactForm dict={dict.contactPage.form} />
          </div>
        </div>
      </section>
    </div>
  );
}
