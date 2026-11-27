"use client";

/**
 * ScrollWorldHomepage
 * -------------------
 * Mounts the scroll-world scrub engine (public/scrub-engine.js) inside a
 * Next.js client component via useEffect + a container ref.
 *
 * The engine is vanilla JS and framework-agnostic; we simply drop it into the
 * page via a <Script strategy="beforeInteractive"> tag and call mountScrollWorld
 * from useEffect once the DOM is ready.
 *
 * Layout contract:
 *   - The [lang]/layout.tsx wraps every page in <Navbar> + <main> + <Footer>.
 *   - The homepage overrides this by rendering without the shared layout's
 *     navbar/footer — handled via the `noLayout` export on the page. Because
 *     Next.js App Router doesn't support per-page layout opt-out cleanly, we
 *     instead keep the shared layout but hide its header/footer on this page
 *     via CSS, and render the engine's built-in topbar (nav:false so section
 *     nav stays in the right rail, not the top bar).
 *   - The KartagoTech Navbar is kept and sits above the engine container
 *     (z-index: 200 in Navbar vs z-index: 50 for the engine topbar).
 */

import React, { useEffect, useRef } from "react";
import Script from "next/script";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { getLocalizedPath } from "@/lib/i18n";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

// Bilingual copy for each chapter
const COPY = {
  en: {
    hint: "scroll to explore",
    sections: [
      {
        id: "world-moving",
        label: "The Challenge",
        eyebrow: "01 — THE CHALLENGE",
        title: "THE WORLD\nMOVED ON.\nHAS YOUR BUSINESS?",
        body: "Customer expectations are rising. Competitors are moving faster. And most businesses are still running on the same manual processes they used five years ago.",
        tags: ["Operational bottlenecks", "Manual processes", "Disconnected tools"],
        accent: "#245BDB",
      },
      {
        id: "cost-of-standing",
        label: "The Cost",
        eyebrow: "02 — THE COST OF STANDING STILL",
        title: "EVERY DAY WITHOUT\nTHE RIGHT TOOLS\nIS A DAY LOST.",
        body: "Missed opportunities. Hours wasted on repetitive tasks. Teams unable to respond quickly to customers. Standing still is not neutral—it falls behind.",
        tags: ["Missed revenue", "Team inefficiency", "Slow customer response"],
        accent: "#1a3a6b",
      },
      {
        id: "different-way",
        label: "A New Way",
        eyebrow: "03 — A DIFFERENT WAY TO WORK",
        title: "TECHNOLOGY\nSHOULD WORK\nFOR YOU.",
        body: "Custom software, practical AI, and intelligent automation—designed around your real operations, not generic templates. Built to eliminate friction, not add to it.",
        tags: ["Custom software", "AI & automation", "Built for your workflows"],
        accent: "#245BDB",
      },
      {
        id: "turn-tech",
        label: "The Opportunity",
        eyebrow: "04 — TURN TECHNOLOGY INTO OPPORTUNITY",
        title: "BETTER OPERATIONS.\nBETTER EXPERIENCES.\nREAL GROWTH.",
        body: "When technology actually fits your business, everything improves. Faster customer service, cleaner operations, and genuine capacity to take on more—and grow sustainably.",
        tags: ["Faster customer service", "Operational clarity", "Sustainable growth"],
        accent: "#1e4a8a",
      },
      {
        id: "kartagotech",
        label: "KartagoTech",
        eyebrow: "05 — KARTAGOTECH AGENCY",
        title: "LET'S BUILD\nWHAT'S NEXT.",
        body: "We are an international digital technology agency. We build custom software, practical AI solutions, and intelligent automation for ambitious businesses—across France and worldwide.",
        tags: ["Custom software", "AI solutions", "Automation", "Web & mobile apps"],
        accent: "#245BDB",
        cta: {
          primary: { label: "Start a project", href: "/en/contact" },
          secondary: { label: "See our work", href: "/en/work" },
        },
      },
    ],
  },
  fr: {
    hint: "faites défiler pour explorer",
    sections: [
      {
        id: "world-moving",
        label: "Le défi",
        eyebrow: "01 — LE DÉFI",
        title: "LE MONDE A\nÉVOLUÉ. ET VOTRE\nENTREPRISE ?",
        body: "Les attentes des clients augmentent. Les concurrents avancent plus vite. Et la plupart des entreprises fonctionnent encore avec les mêmes processus manuels qu'il y a cinq ans.",
        tags: ["Blocages opérationnels", "Processus manuels", "Outils déconnectés"],
        accent: "#245BDB",
      },
      {
        id: "cost-of-standing",
        label: "Le coût",
        eyebrow: "02 — LE COÛT DE L'IMMOBILISME",
        title: "CHAQUE JOUR SANS\nLES BONS OUTILS\nEST UN JOUR PERDU.",
        body: "Opportunités manquées. Heures perdues sur des tâches répétitives. Des équipes qui ne peuvent pas répondre rapidement aux clients. L'immobilisme, c'est reculer.",
        tags: ["Revenus manqués", "Inefficacité des équipes", "Lenteur client"],
        accent: "#1a3a6b",
      },
      {
        id: "different-way",
        label: "Une nouvelle voie",
        eyebrow: "03 — UNE NOUVELLE FAÇON DE TRAVAILLER",
        title: "LA TECHNOLOGIE\nDOIT TRAVAILLER\nPOUR VOUS.",
        body: "Logiciels sur mesure, IA pratique et automatisation intelligente—conçus autour de vos opérations réelles, pas de modèles génériques. Pour éliminer la friction, pas l'ajouter.",
        tags: ["Logiciels sur mesure", "IA & automatisation", "Adapté à vos workflows"],
        accent: "#245BDB",
      },
      {
        id: "turn-tech",
        label: "L'opportunité",
        eyebrow: "04 — TRANSFORMER LA TECH EN OPPORTUNITÉ",
        title: "MEILLEURES OPS.\nMEILLEURES EXPÉRIENCES.\nVRAIE CROISSANCE.",
        body: "Quand la technologie s'adapte vraiment à votre entreprise, tout s'améliore. Service client plus rapide, opérations plus claires et vraie capacité à aller plus loin.",
        tags: ["Service client rapide", "Clarté opérationnelle", "Croissance durable"],
        accent: "#1e4a8a",
      },
      {
        id: "kartagotech",
        label: "KartagoTech",
        eyebrow: "05 — KARTAGOTECH AGENCY",
        title: "CONSTRUISONS\nENSEMBLE\nLE FUTUR.",
        body: "Nous sommes une agence technologique digitale internationale. Nous concevons des logiciels sur mesure, des solutions IA pratiques et de l'automatisation intelligente pour des entreprises ambitieuses.",
        tags: ["Logiciels sur mesure", "Solutions IA", "Automatisation", "Web & mobile"],
        accent: "#245BDB",
        cta: {
          primary: { label: "Démarrer un projet", href: "/fr/contact" },
          secondary: { label: "Voir nos projets", href: "/fr/work" },
        },
      },
    ],
  },
} as const;

type ScrollWorldSection = {
  id: string;
  label: string;
  clip?: string;
  clipMobile?: string;
  still: string;
  stillMobile?: string;
  accent: string;
  scroll?: number;
  linger?: number;
  eyebrow: string;
  title: string;
  body: string;
  tags: readonly string[];
  cta?: {
    primary?: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
};

declare global {
  interface Window {
    mountScrollWorld: (
      container: HTMLElement,
      config: {
        brand?: { name: string; href: string };
        diveScroll?: number;
        connScroll?: number;
        hint?: string;
        nav?: boolean;
        atmosphere?: boolean;
        sections: ScrollWorldSection[];
        connectors?: (string | null)[];
        connectorsMobile?: (string | null)[];
      }
    ) => void;
  }
}

export function ScrollWorldHomepage({ locale, dict }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const copy = locale === "fr" ? COPY.fr : COPY.en;

  // Video assets — use existing cinematic .mp4 files as dive clips
  const videoMap: Record<string, string> = {
    "world-moving": "/videos/realization.mp4",
    "cost-of-standing": "/videos/challenge.mp4",
    "different-way": "/videos/transformation.mp4",
    "turn-tech": "/videos/growth.mp4",
  };

  // Still image fallbacks — rich photographic stills per section
  const stillMap: Record<string, string> = {
    "world-moving": "/images/story/story-05-future.png",
    "cost-of-standing": "/assets/images/scene-1-challenge.jpg",
    "different-way": "/assets/images/scene-3-transformation.jpg",
    "turn-tech": "/assets/images/scene-4-growth.jpg",
    kartagotech: "/assets/images/about-office.jpg",
  };

  const stillMobileMap: Record<string, string> = {
    "world-moving": "/images/story/realization.webp",
    "cost-of-standing": "/images/story/challenge.webp",
    "different-way": "/images/story/transformation.webp",
    "turn-tech": "/images/story/growth.webp",
    kartagotech: "/assets/images/about-office.jpg",
  };

  // Connector clips: null = cross-dissolve between sections (graceful fallback)
  // These will be replaced by real ffmpeg-generated connectors when available
  const connectors: (string | null)[] = [
    "/videos/connector-01.mp4",
    "/videos/connector-02.mp4",
    "/videos/connector-03.mp4",
    "/videos/connector-04.mp4",
  ];

  function mount() {
    if (
      !containerRef.current ||
      mountedRef.current ||
      typeof window.mountScrollWorld !== "function"
    )
      return;
    mountedRef.current = true;

    const sections: ScrollWorldSection[] = copy.sections.map((s) => ({
      ...s,
      title: s.title.replace(/\n/g, " "),
      tags: [...s.tags],
      clip: videoMap[s.id] ?? undefined,
      still: stillMap[s.id] ?? "/assets/images/about-office.jpg",
      stillMobile: stillMobileMap[s.id],
      scroll: s.id === "world-moving" ? 1.8 : s.id === "kartagotech" ? 1.6 : 1.4,
      linger: s.id === "world-moving" ? 0.45 : s.id === "kartagotech" ? 0.5 : 0.35,
    }));

    window.mountScrollWorld(containerRef.current, {
      brand: { name: "KartagoTech", href: `/${locale}` },
      diveScroll: 1.4,
      connScroll: 0.75,
      hint: copy.hint,
      nav: false, // We use the KartagoTech Navbar above; don't render the engine's topbar
      atmosphere: false, // Keep it clean — no floating particles
      sections,
      // Try real connectors first; engine will fall back to cross-dissolve if
      // the fetch returns 404 (connectors don't exist yet)
      connectors: connectors,
    });
  }

  useEffect(() => {
    // If the engine script has already executed (e.g., navigating back), mount immediately
    if (typeof window.mountScrollWorld === "function") {
      mount();
    }
    // Otherwise the <Script onLoad> will call mount() once it executes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/*
       * Load the engine. `strategy="beforeInteractive"` would block hydration;
       * `afterInteractive` lets the page hydrate first then injects the script.
       * We call mount() from onLoad, with a fallback in useEffect for cases
       * where the script was already cached and onLoad fires synchronously.
       */}
      <Script
        src="/scrub-engine.js"
        strategy="afterInteractive"
        onLoad={mount}
      />

      {/*
       * Container. The engine appends its own DOM (sky, stage, copylayer,
       * scroll track, etc.) directly into this div and sets its own CSS.
       *
       * We override the CSS custom properties here to match KartagoTech's
       * brand palette — these win over the engine defaults thanks to the
       * @layer sw {} wrapper in the engine's injectCSS().
       *
       * position: relative + height: auto — the engine creates the scroll
       * spacer (.sw-track) and sets everything else position:fixed internally.
       */}
      <div
        ref={containerRef}
        id="scroll-world-root"
        style={
          {
            "--sw-bg": "#F7F6F2",
            "--sw-ink": "#142B52",
            "--sw-ink-soft": "#4A5870",
            "--sw-accent": "#245BDB",
            "--sw-font-display":
              "var(--font-space-grotesk), 'Space Grotesk', Inter, system-ui, sans-serif",
            "--sw-font-body":
              "var(--font-inter), Inter, system-ui, sans-serif",
          } as React.CSSProperties
        }
      />
    </>
  );
}
