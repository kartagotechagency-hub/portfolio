"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

const ScrollWorld3DCanvas = dynamic(
  () =>
    import("./ScrollWorld3DCanvas").then((mod) => ({
      default: mod.ScrollWorld3DCanvas,
    })),
  { ssr: false }
);

interface Props {
  locale: Locale;
  dict: Dictionary;
}

const CHAPTER_CONTENT = {
  en: {
    scrollHint: "Scroll to fly through",
    chapters: [
      {
        id: "world-moving",
        label: "The Challenge",
        eyebrow: "01 — THE WORLD IS MOVING",
        title: "The world moved on. Has your business?",
        body: "Customer expectations are rising and competitors move faster every quarter. Yet many organizations still rely on manual workflows built years ago.",
        tags: ["Changing expectations", "Manual processes", "Disconnected tools"],
        still: "/images/story/story-05-future.png",
      },
      {
        id: "cost-of-standing",
        label: "The Cost",
        eyebrow: "02 — THE COST OF STANDING STILL",
        title: "Every day without the right tools is a day lost.",
        body: "Missed opportunities, repetitive administrative work, and slow customer response times quietly hold teams back. Standing still means falling behind.",
        tags: ["Missed opportunities", "Repetitive overhead", "Slow response"],
        still: "/assets/images/scene-1-challenge.jpg",
      },
      {
        id: "different-way",
        label: "A New Way",
        eyebrow: "03 — A DIFFERENT WAY TO WORK",
        title: "Technology should work around your business.",
        body: "Custom software, practical AI, and intelligent automation—engineered around your real operations to remove friction rather than add complexity.",
        tags: ["Custom software", "Practical AI", "Intelligent automation"],
        still: "/assets/images/scene-3-transformation.jpg",
      },
      {
        id: "turn-tech",
        label: "Opportunity",
        eyebrow: "04 — TURN TECHNOLOGY INTO OPPORTUNITY",
        title: "Better operations. Better experiences. Real growth.",
        body: "When your systems connect cleanly, teams respond faster, customers feel cared for, and your business gains real capacity to scale sustainably.",
        tags: ["Customer experience", "Operational clarity", "Scalable capacity"],
        still: "/assets/images/scene-4-growth.jpg",
      },
      {
        id: "kartagotech",
        label: "KartagoTech",
        eyebrow: "05 — KARTAGOTECH AGENCY",
        title: "Let's build what's next.",
        body: "We are an international digital technology agency building custom software, AI solutions, and intelligent automation for ambitious businesses across France and worldwide.",
        tags: ["Web & Mobile", "Custom Software", "AI & RPA"],
        still: "/assets/images/about-office.jpg",
      },
    ],
  },
  fr: {
    scrollHint: "Faites défiler pour explorer",
    chapters: [
      {
        id: "world-moving",
        label: "Le défi",
        eyebrow: "01 — LE MONDE AVANCE",
        title: "Le monde a évolué. Et votre entreprise ?",
        body: "Les attentes des clients augmentent et vos concurrents accélèrent. Pourtant, beaucoup d'organisations reposent encore sur des processus manuels datés.",
        tags: ["Attentes élevées", "Processus manuels", "Outils déconnectés"],
        still: "/images/story/story-05-future.png",
      },
      {
        id: "cost-of-standing",
        label: "Le coût",
        eyebrow: "02 — LE COÛT DE L'IMMOBILISME",
        title: "Chaque jour sans les bons outils est un jour perdu.",
        body: "Opportunités manquées, tâches répétitives et réponses clients trop lentes freinent vos équipes. Rester immobile, c'est prendre du retard.",
        tags: ["Opportunités manquées", "Tâches répétitives", "Lenteur client"],
        still: "/assets/images/scene-1-challenge.jpg",
      },
      {
        id: "different-way",
        label: "Nouvelle voie",
        eyebrow: "03 — UNE AUTRE FAÇON DE TRAVAILLER",
        title: "La technologie doit s'adapter à votre métier.",
        body: "Logiciels sur mesure, IA pratique et automatisation intelligente—conçus autour de vos opérations réelles pour éliminer la friction.",
        tags: ["Logiciels sur mesure", "IA pratique", "Automatisation"],
        still: "/assets/images/scene-3-transformation.jpg",
      },
      {
        id: "turn-tech",
        label: "Opportunité",
        eyebrow: "04 — TRANSFORMER LA TECH EN OPPORTUNITÉ",
        title: "Meilleures opérations. Meilleure expérience. Vraie croissance.",
        body: "Quand vos outils sont connectés, vos équipes répondent plus vite, vos clients vivent une meilleure expérience et votre activité gagne en capacité.",
        tags: ["Expérience client", "Clarté opérationnelle", "Capacité à grandir"],
        still: "/assets/images/scene-4-growth.jpg",
      },
      {
        id: "kartagotech",
        label: "KartagoTech",
        eyebrow: "05 — KARTAGOTECH AGENCY",
        title: "Construisons la suite ensemble.",
        body: "Agence technologique digitale internationale, nous concevons des logiciels sur mesure, solutions IA et systèmes d'automatisation en France et à l'international.",
        tags: ["Web & Mobile", "Sur mesure", "IA & RPA"],
        still: "/assets/images/about-office.jpg",
      },
    ],
  },
} as const;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x: number) => {
  const c = clamp(x);
  return c * c * (3 - 2 * c);
};

export function ScrollWorld3DHomepage({ locale, dict }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglError, setWebglError] = useState(false);

  const copy = locale === "fr" ? CHAPTER_CONTENT.fr : CHAPTER_CONTENT.en;
  const chapters = copy.chapters;
  const n = chapters.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let raf = 0;

    const updateFromScroll = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = Math.max(1, el.offsetHeight - window.innerHeight + 80);
      const p = clamp(-rect.top / scrollable, 0, 1);
      progressRef.current = p;
      setProgress(p);
      setActiveIndex(Math.min(n - 1, Math.floor(p * n)));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [n]);

  const jumpToChapter = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const scrollable = Math.max(1, el.offsetHeight - window.innerHeight + 80);
    const targetP = (idx + 0.5) / n;
    const targetTop = el.offsetTop + targetP * scrollable;
    window.scrollTo({
      top: targetTop,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      ref={trackRef}
      aria-label="KartagoTech Interactive 3D Story"
      className="relative w-full h-[580vh] bg-[#F7F6F2]"
    >
      {/* Top 3px scroll progress bar right beneath the sticky Navbar */}
      <div
        className="fixed top-20 left-0 right-0 h-[3px] z-[180] bg-[#245BDB]/15 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#245BDB] origin-left transition-transform duration-75"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* Sticky 100vh-minus-navbar stage — hands off cleanly to Footer at the end */}
      <div className="sticky top-20 h-[calc(100vh-5rem)] w-full overflow-hidden">
        {/* 3D WebGL World (or high-res photographic fallback if WebGL unavailable) */}
        <div className="absolute inset-0">
          {!webglError ? (
            <ScrollWorld3DCanvas
              progressRef={progressRef}
              reducedMotion={reducedMotion}
              onWebGLError={() => setWebglError(true)}
            />
          ) : (
            <div className="relative w-full h-full">
              {chapters.map((ch, idx) => (
                <Image
                  key={ch.id}
                  src={ch.still}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover transition-opacity duration-500"
                  style={{ opacity: idx === activeIndex ? 1 : 0 }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Editorial Gradient Scrim (Left on desktop, Bottom on mobile) */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-gradient-to-t from-[#F7F6F2] via-[#F7F6F2]/85 to-transparent
            md:bg-gradient-to-r md:from-[#F7F6F2] md:via-[#F7F6F2]/80 md:to-transparent
            md:w-[58vw] md:max-w-[760px]
          "
          aria-hidden="true"
        />

        {/* Editorial Copy Layer */}
        <div className="relative z-10 h-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pointer-events-none">
          {chapters.map((ch, i) => {
            const segStart = i / n;
            const segLen = 1 / n;
            const pr = clamp((progress - segStart) / segLen, 0, 1);
            const before = progress < segStart;
            const after = progress > segStart + segLen;

            let opacity = 0;
            if (i === 0) {
              opacity = after ? 0 : smooth(1 - Math.max(0, pr - 0.55) / 0.45);
            } else if (i === n - 1) {
              opacity = before ? 0 : smooth(pr / 0.35);
            } else {
              opacity = before || after ? 0 : smooth(1 - Math.abs(pr - 0.5) / 0.5);
            }

            const isActive = opacity > 0.45;
            const translateY = reducedMotion ? 0 : (0.5 - pr) * 24;

            return (
              <article
                key={ch.id}
                aria-hidden={!isActive}
                style={{
                  opacity,
                  transform: `translateY(${translateY}px)`,
                  pointerEvents: isActive ? "auto" : "none",
                }}
                className="
                  absolute left-5 right-5 bottom-14
                  md:left-8 lg:left-12 md:right-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2
                  md:w-[min(42vw,470px)]
                  transition-[opacity] duration-150
                "
              >
                <span className="font-mono text-[11px] tracking-[0.14em] text-[#4A5870]">
                  {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </span>

                <span className="block mt-3 font-display font-bold text-xs tracking-[0.16em] uppercase text-[#245BDB]">
                  {ch.eyebrow}
                </span>

                <h1 className="mt-2.5 font-display font-bold text-[#142B52] text-[clamp(1.85rem,3.8vw,3.15rem)] leading-[1.04] tracking-tight">
                  {ch.title}
                </h1>

                <p className="mt-4 text-[clamp(0.95rem,1.2vw,1.08rem)] leading-relaxed text-[#4A5870] max-w-[42ch]">
                  {ch.body}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {ch.tags.map((tag) => (
                    <li
                      key={tag}
                      className="text-xs font-semibold text-[#142B52] bg-[#E9EEF7] border border-[#245BDB]/25 px-3 py-1.5 rounded-full"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                {i === n - 1 && (
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Link
                      href={getLocalizedPath("/contact", locale)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#142B52] text-white font-semibold text-sm hover:bg-[#245BDB] transition-colors"
                    >
                      <span>{dict.nav.startProject}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href={getLocalizedPath("/work", locale)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#142B52]/25 bg-white/70 text-[#142B52] font-semibold text-sm hover:border-[#245BDB] hover:text-[#245BDB] transition-colors"
                    >
                      <span>{dict.home.selectedWork.viewAll}</span>
                    </Link>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Right-side Chapter Route Rail */}
        <nav
          aria-label="Story chapters"
          className="hidden sm:flex fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 flex-col gap-5 py-4 px-2"
        >
          <div
            className="absolute left-1/2 top-6 bottom-6 w-[2px] -translate-x-1/2 bg-[#245BDB]/20"
            aria-hidden="true"
          />
          {chapters.map((ch, idx) => {
            const active = idx === activeIndex;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => jumpToChapter(idx)}
                aria-label={ch.label}
                aria-current={active ? "step" : undefined}
                className="group relative w-4 h-4 grid place-items-center cursor-pointer"
              >
                <span
                  className={`block w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    active
                      ? "bg-[#245BDB] scale-125 ring-4 ring-[#245BDB]/20"
                      : "bg-[#245BDB]/35 group-hover:bg-[#245BDB] group-hover:scale-110"
                  }`}
                />
                <span
                  className={`
                    pointer-events-none absolute right-7 top-1/2 -translate-y-1/2
                    whitespace-nowrap text-xs font-semibold px-3 py-1 rounded-full
                    bg-white/90 backdrop-blur-md border border-[#D8DFEC] text-[#142B52]
                    transition-all duration-200
                    ${
                      active
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0"
                    }
                  `}
                >
                  {ch.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Scroll Hint (fades out immediately on scroll) */}
        <div
          className="pointer-events-none absolute left-1/2 bottom-5 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-[#4A5870] transition-opacity duration-300"
          style={{ opacity: clamp(1 - progress * 12, 0, 1) }}
        >
          <span>{copy.scrollHint}</span>
          <ChevronDown className="w-4 h-4 text-[#245BDB] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
