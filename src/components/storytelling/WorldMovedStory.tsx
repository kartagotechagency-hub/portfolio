"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import { ContactForm } from "@/components/ContactForm";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

const WorldMovedStoryCanvas = dynamic(
  () =>
    import("./WorldMovedStoryCanvas").then((mod) => mod.WorldMovedStoryCanvas),
  { ssr: false }
);

interface WorldMovedStoryProps {
  locale: Locale;
  dict: Dictionary;
}

interface StoryChapter {
  id: string;
  index: string;
  eyebrow: Record<Locale, string>;
  headline: Record<Locale, string>;
  body: Record<Locale, string>;
  points: Record<Locale, string[]>;
  fallbackImage: string;
  darkSurface?: boolean;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: "world-is-moving",
    index: "01",
    eyebrow: {
      en: "01 — THE WORLD IS MOVING",
      fr: "01 — LE MONDE AVANCE",
    },
    headline: {
      en: "THE WORLD MOVED ON.\nHAS YOUR BUSINESS?",
      fr: "LE MONDE A AVANCÉ.\nET VOTRE ENTREPRISE ?",
    },
    body: {
      en: "Customer expectations have shifted. Modern businesses respond faster, connect their systems, and deliver seamless digital experiences—every single day.",
      fr: "Les attentes des clients ont changé. Les entreprises modernes répondent plus vite, connectent leurs systèmes et offrent des expériences digitales fluides au quotidien.",
    },
    points: {
      en: [
        "Instant digital responsiveness",
        "Connected operations across teams",
        "Software & AI built around real workflows",
      ],
      fr: [
        "Réactivité digitale immédiate",
        "Opérations connectées entre équipes",
        "Logiciels & IA bâtis autour de vos flux réels",
      ],
    },
    fallbackImage: "/images/story/story-05-future.png",
  },
  {
    id: "cost-of-standing-still",
    index: "02",
    eyebrow: {
      en: "02 — THE COST OF STANDING STILL",
      fr: "02 — LE COÛT DE L'IMMOBILISME",
    },
    headline: {
      en: "Standing still has a quiet operational cost.",
      fr: "Rester figé a un coût opérationnel silencieux.",
    },
    body: {
      en: "Manual processes, disconnected spreadsheets, and rigid legacy tools drain your team's time and create missed commercial opportunities.",
      fr: "Les tâches manuelles, les tableurs dispersés et les outils cloisonnés consomment le temps de vos équipes et font manquer des opportunités.",
    },
    points: {
      en: [
        "Repetitive manual data entry",
        "Fragmented tools that never talk",
        "Slow response times for customers",
      ],
      fr: [
        "Saisies manuelles répétitives",
        "Outils fragmentés qui ne communiquent pas",
        "Délais de réponse trop longs pour vos clients",
      ],
    },
    fallbackImage: "/images/story/story-01-challenge.png",
    darkSurface: true,
  },
  {
    id: "different-way-to-work",
    index: "03",
    eyebrow: {
      en: "03 — A DIFFERENT WAY TO WORK",
      fr: "03 — UNE AUTRE FAÇON DE TRAVAILLER",
    },
    headline: {
      en: "Transform the same business with connected systems.",
      fr: "Transformez la même entreprise grâce aux bons systèmes.",
    },
    body: {
      en: "You do not need to reinvent your company. Custom software, web and mobile applications, AI assistants, and intelligent automation remove friction from the work you already do.",
      fr: "Vous n'avez pas à réinventer votre métier. Logiciels sur mesure, applications web et mobiles, assistants IA et automatisation suppriment la friction de vos opérations.",
    },
    points: {
      en: [
        "Custom software & web/mobile platforms",
        "Practical AI assistants & grounded RAG",
        "Deterministic RPA & workflow automation",
      ],
      fr: [
        "Logiciels sur mesure & plateformes web/mobiles",
        "Assistants IA concrets & recherche RAG sourcée",
        "RPA déterministe & automatisation des workflows",
      ],
    },
    fallbackImage: "/images/story/story-03-transformation.png",
  },
  {
    id: "turn-tech-into-opportunity",
    index: "04",
    eyebrow: {
      en: "04 — TURN TECHNOLOGY INTO OPPORTUNITY",
      fr: "04 — TRANSFORMER LA TECHNOLOGIE EN OPPORTUNITÉ",
    },
    headline: {
      en: "Better customer experience. Stronger scalability.",
      fr: "Meilleure expérience client. Plus grande capacité à évoluer.",
    },
    body: {
      en: "When technology is engineered around your operations, your team saves hours every week, captures opportunities faster, and scales without chaos.",
      fr: "Quand la technologie est conçue autour de vos opérations, vos équipes gagnent du temps, saisissent les opportunités plus vite et évoluent sereinement.",
    },
    points: {
      en: [
        "Capture commercial opportunities reliably",
        "Elevate everyday customer experience",
        "Save operational time & scale with clarity",
      ],
      fr: [
        "Capter les opportunités commerciales avec fiabilité",
        "Élever l'expérience client au quotidien",
        "Gagner du temps et grandir avec clarté",
      ],
    },
    fallbackImage: "/images/story/story-04-growth.png",
  },
  {
    id: "kartagotech-partner",
    index: "05",
    eyebrow: {
      en: "05 — KARTAGOTECH AGENCY",
      fr: "05 — KARTAGOTECH AGENCY",
    },
    headline: {
      en: "Your international technology partner.",
      fr: "Votre partenaire technologique international.",
    },
    body: {
      en: "KartagoTech designs and builds custom software, AI solutions, and connected business systems for ambitious organizations across France, Europe, and worldwide.",
      fr: "KartagoTech conçoit et déploie des logiciels sur mesure, des solutions d'IA et des systèmes d'entreprise connectés en France, en Europe et à l'international.",
    },
    points: {
      en: [],
      fr: [],
    },
    fallbackImage: "/assets/images/about-office.jpg",
    darkSurface: true,
  },
];

export function WorldMovedStory({ locale, dict }: WorldMovedStoryProps) {
  const { reducedMotion } = useMediaPreferences();
  const [webglError, setWebglError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);

  const progressRef = useRef(0);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current =
        maxScroll > 0 ? Math.max(0, Math.min(1, sy / maxScroll)) : 0;
      setShowHint(sy < 60);

      const center = window.innerHeight * 0.45;
      let best = 0;
      let bestDist = Infinity;
      sectionRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = idx;
        }
      });
      setActiveIndex(best);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  const useStaticFallback = reducedMotion || webglError;

  return (
    <div className="relative bg-[#F7F6F2] text-[#4A5870]">
      {/* Fixed 3D GLB Storytelling Canvas */}
      {!useStaticFallback && (
        <WorldMovedStoryCanvas
          progressRef={progressRef}
          reducedMotion={reducedMotion}
          onWebGLError={() => setWebglError(true)}
        />
      )}

      {/* Right-Side Chapter Progress Rail */}
      <nav
        aria-label={
          locale === "fr" ? "Chapitres de l'histoire" : "Story chapters"
        }
        className="hidden md:grid fixed right-5 lg:right-7 top-1/2 -translate-y-1/2 z-30 gap-3"
      >
        {CHAPTERS.map((ch, idx) => {
          const active = idx === activeIndex;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => jumpTo(ch.id)}
              aria-label={ch.eyebrow[locale]}
              className="group flex items-center justify-end gap-2.5 focus:outline-none"
            >
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-all duration-200 ${
                  active
                    ? "opacity-100 bg-[#142B52] text-white"
                    : "opacity-0 group-hover:opacity-100 bg-white/90 text-[#142B52] border border-[#D8DFEC]"
                }`}
              >
                {ch.index}
              </span>
              <span
                className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                  active
                    ? "bg-[#245BDB] border-[#245BDB] scale-110"
                    : "border-[#142B52] bg-white/75 hover:border-[#245BDB]"
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Scroll Hint Pill */}
      <div
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-400 ${
          showHint ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#142B52] bg-white/92 backdrop-blur-md px-4 py-2 rounded-full border border-[#D8DFEC] shadow-sm">
          <ArrowDown className="w-3.5 h-3.5 text-[#245BDB]" />
          <span>
            {locale === "fr"
              ? "Faites défiler pour vivre l'histoire"
              : "Scroll to explore the story"}
          </span>
        </div>
      </div>

      {/* 5 Scroll-Synchronized Story Chapters */}
      <div className="relative z-10">
        {CHAPTERS.map((ch, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === CHAPTERS.length - 1;

          return (
            <section
              key={ch.id}
              id={ch.id}
              ref={(el) => {
                sectionRefs.current[idx] = el;
              }}
              className="relative min-h-[108vh] flex items-end md:items-center px-4 sm:px-8 lg:px-16 pt-24 pb-16 md:py-24 overflow-hidden"
            >
              {/* Static photographic background only when WebGL is unavailable or reduced-motion */}
              {useStaticFallback && (
                <div className="absolute inset-0 -z-10">
                  <Image
                    src={ch.fallbackImage}
                    alt={ch.eyebrow[locale]}
                    fill
                    className="object-cover object-center"
                    priority={isFirst}
                  />
                  <div
                    className={`absolute inset-0 ${
                      ch.darkSurface ? "bg-[#142B52]/75" : "bg-[#F7F6F2]/75"
                    }`}
                  />
                </div>
              )}

              <div
                className={`${
                  isLast ? "w-full max-w-[920px]" : "w-full max-w-[490px]"
                } rounded-[20px] p-6 sm:p-8 backdrop-blur-md border shadow-[0_30px_60px_-30px_rgba(20,43,82,0.4)] ${
                  ch.darkSurface
                    ? "bg-[#142B52]/88 border-white/15 text-[#E9EEF7]"
                    : "bg-white/90 border-[#D8DFEC] text-[#4A5870]"
                }`}
              >
                <div
                  className={`text-xs font-semibold uppercase tracking-[0.14em] mb-3 ${
                    ch.darkSurface ? "text-[#7FA3F5]" : "text-[#245BDB]"
                  }`}
                >
                  {ch.eyebrow[locale]}
                </div>

                {isFirst ? (
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-[48px] font-bold text-[#142B52] leading-[1.06] tracking-[-0.025em] whitespace-pre-line mb-4">
                    {ch.headline[locale]}
                  </h1>
                ) : (
                  <h2
                    className={`font-display text-2xl sm:text-3xl lg:text-[36px] font-bold leading-[1.12] tracking-[-0.02em] mb-4 ${
                      ch.darkSurface ? "text-white" : "text-[#142B52]"
                    }`}
                  >
                    {ch.headline[locale]}
                  </h2>
                )}

                <p
                  className={`text-[15px] sm:text-base leading-relaxed mb-5 ${
                    ch.darkSurface ? "text-[#DCE6F8]" : "text-[#4A5870]"
                  }`}
                >
                  {ch.body[locale]}
                </p>

                {ch.points[locale].length > 0 && (
                  <ul className="grid gap-2 mb-6">
                    {ch.points[locale].map((pt) => (
                      <li
                        key={pt}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                          ch.darkSurface
                            ? "bg-white/10 text-white"
                            : "bg-[#E9EEF7] text-[#142B52]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            ch.darkSurface ? "bg-[#7FA3F5]" : "bg-[#245BDB]"
                          }`}
                        />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {isFirst && (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => jumpTo("cost-of-standing-still")}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#142B52] hover:bg-[#245BDB] text-white text-sm font-medium transition-colors"
                    >
                      <span>
                        {locale === "fr"
                          ? "Découvrir l'histoire"
                          : "Start the story"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <Link
                      href={getLocalizedPath("/work", locale)}
                      className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full border border-[#D8DFEC] bg-white hover:border-[#245BDB] text-[#142B52] text-sm font-medium transition-colors"
                    >
                      <span>{dict.nav.work}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {isLast && (
                  <div
                    id="contact"
                    className="grid lg:grid-cols-12 gap-8 mt-6 pt-6 border-t border-white/15 scroll-mt-24"
                  >
                    <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                      <div className="grid gap-3">
                        <Link
                          href={getLocalizedPath("/work", locale)}
                          className="inline-flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                        >
                          <span>
                            {locale === "fr"
                              ? "Explorer nos 7 réalisations"
                              : "Explore all 7 case studies"}
                          </span>
                          <ArrowUpRight className="w-4 h-4 text-[#7FA3F5]" />
                        </Link>
                        <Link
                          href={getLocalizedPath("/services", locale)}
                          className="inline-flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                        >
                          <span>
                            {locale === "fr"
                              ? "Découvrir nos services"
                              : "Explore our services"}
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#7FA3F5]" />
                        </Link>
                      </div>

                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 border border-white/15">
                        <Mail className="w-4 h-4 text-[#7FA3F5] shrink-0" />
                        <a
                          href={`mailto:${dict.contactPage.emailValue}`}
                          className="text-sm font-medium text-white hover:text-[#7FA3F5] transition-colors break-all"
                        >
                          {dict.contactPage.emailValue}
                        </a>
                      </div>
                    </div>

                    <div className="lg:col-span-7">
                      <ContactForm dict={dict.contactPage.form} />
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
