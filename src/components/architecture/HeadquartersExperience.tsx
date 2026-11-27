"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import { ContactForm } from "@/components/ContactForm";
import { projects } from "@/data/projects";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

const HeadquartersCanvas = dynamic(
  () =>
    import("./HeadquartersCanvas").then((mod) => mod.HeadquartersCanvas),
  { ssr: false }
);

interface HeadquartersExperienceProps {
  locale: Locale;
  dict: Dictionary;
}

interface RoomContent {
  id: string;
  index: string;
  title: Record<Locale, string>;
  tag: Record<Locale, string>;
  description: Record<Locale, string>;
  capabilities: Record<Locale, string[]>;
  cta?: {
    label: Record<Locale, string>;
    href: string;
  };
}

const ROOMS: RoomContent[] = [
  {
    id: "entrance",
    index: "00",
    title: {
      en: "KartagoTech Agency",
      fr: "KartagoTech Agency",
    },
    tag: {
      en: "International Digital Technology Agency",
      fr: "Agence Technologique Internationale",
    },
    description: {
      en: "Custom software, web & mobile applications, applied AI, and workflow automation for ambitious businesses. Step inside to explore our building, department by department.",
      fr: "Logiciels sur mesure, applications web et mobiles, IA appliquée et automatisation des processus pour les entreprises ambitieuses. Poussez la porte : nous vous faisons visiter nos bureaux, département par département.",
    },
    capabilities: {
      en: [
        "Custom Software & Web Platforms",
        "AI Assistants & Intelligent Integrations",
        "RPA & Business Process Automation",
      ],
      fr: [
        "Logiciels sur Mesure & Plateformes Web",
        "Assistants IA & Intégrations Intelligentes",
        "RPA & Automatisation des Processus Métier",
      ],
    },
  },
  {
    id: "direction",
    index: "01",
    title: { en: "Direction", fr: "Direction" },
    tag: { en: "Vision and strategy", fr: "Vision et stratégie" },
    description: {
      en: "Where technical architecture meets business reality. Every engagement begins with structured scoping, clear milestones, and honest engineering guidance.",
      fr: "Là où se décident les orientations techniques de l'agence et où chaque projet est cadré avec clarté et rigueur.",
    },
    capabilities: {
      en: [
        "Technical Architecture & Product Scoping",
        "Digital Transformation Roadmaps",
        "Direct Senior Engineering Partnership",
      ],
      fr: [
        "Architecture Technique & Cadrage Produit",
        "Feuilles de Route Transformation Digitale",
        "Partenariat Direct avec l'Ingénierie",
      ],
    },
  },
  {
    id: "development",
    index: "02",
    title: { en: "Development", fr: "Développement" },
    tag: {
      en: "Websites, applications, custom software",
      fr: "Sites, applications, logiciels",
    },
    description: {
      en: "The engineering studio building your web platforms, mobile applications, multi-tenant SaaS products, and connected business software.",
      fr: "L'équipe qui construit vos plateformes web, vos applications mobiles, vos produits SaaS et vos logiciels métier sur mesure.",
    },
    capabilities: {
      en: [
        "Next.js, TypeScript & Modern Web Apps",
        "Multi-Tenant SaaS & API Integrations",
        "Maintainable, Documented Codebases",
      ],
      fr: [
        "Next.js, TypeScript & Applications Web",
        "SaaS Multi-Locataires & Intégrations API",
        "Bases de Code Maintenables et Documentées",
      ],
    },
    cta: {
      label: { en: "Explore software services", fr: "Voir le développement" },
      href: "/services#custom-software",
    },
  },
  {
    id: "design",
    index: "03",
    title: { en: "Design & 3D", fr: "Design & 3D" },
    tag: {
      en: "Interfaces and immersive experiences",
      fr: "Interfaces et expériences immersives",
    },
    description: {
      en: "Product interfaces, brand systems, and interactive 3D web experiences crafted for clarity, speed, and accessibility across desktop and mobile.",
      fr: "Maquettes d'interfaces, systèmes visuels et scènes 3D interactives conçus pour la clarté et la fluidité sur chaque écran.",
    },
    capabilities: {
      en: [
        "UI/UX Design Systems & Prototyping",
        "Interactive WebGL & Three.js Scenes",
        "Responsive & Accessible Interfaces",
      ],
      fr: [
        "Systèmes Design UI/UX & Prototypage",
        "Scènes Interactives WebGL & Three.js",
        "Interfaces Responsives et Accessibles",
      ],
    },
    cta: {
      label: { en: "Explore digital experiences", fr: "Voir nos services design" },
      href: "/services#web-development",
    },
  },
  {
    id: "ai",
    index: "04",
    title: { en: "AI & Automation", fr: "IA & automatisation" },
    tag: {
      en: "Assistants and workflows",
      fr: "Assistants et workflows",
    },
    description: {
      en: "Practical AI assistants, grounded RAG knowledge search, real-time voice agents, and deterministic RPA pipelines that eliminate repetitive manual work.",
      fr: "Des assistants IA fiables, moteurs de recherche RAG sourcés, agents vocaux temps réel et pipelines RPA déterministes qui automatisent les tâches répétitives.",
    },
    capabilities: {
      en: [
        "Grounded RAG & Conversational AI",
        "Real-Time Voice & Telephony Agents",
        "Deterministic RPA & Document Extraction",
      ],
      fr: [
        "RAG Sourcé & IA Conversationnelle",
        "Agents Vocaux Temps Réel & Téléphonie",
        "RPA Déterministe & Extraction Documentaire",
      ],
    },
    cta: {
      label: { en: "Explore AI & RPA", fr: "Voir IA & RPA" },
      href: "/services#ai-automation",
    },
  },
  {
    id: "clients",
    index: "05",
    title: { en: "Clients", fr: "Clients" },
    tag: {
      en: "Partnership and delivery",
      fr: "Relation et accompagnement",
    },
    description: {
      en: "We partner with ambitious organizations across Europe, MENA, and North America—delivering connected digital systems tailored to each industry's operational reality.",
      fr: "Nous accompagnons des entreprises ambitieuses en France et à l'international avec des systèmes digitaux connectés adaptés à chaque secteur d'activité.",
    },
    capabilities: {
      en: [
        "B2B SaaS, Legal & Knowledge Teams",
        "Education, Operations & Back-Office",
        "Bilingual EN / FR Remote Delivery",
      ],
      fr: [
        "SaaS B2B, Juridique & Équipes Métier",
        "Formation, Opérations & Back-Office",
        "Livraison Bilingue FR / EN à Distance",
      ],
    },
  },
  {
    id: "projects",
    index: "06",
    title: { en: "Projects", fr: "Projets" },
    tag: {
      en: "Delivery and realizations",
      fr: "Gestion et réalisations",
    },
    description: {
      en: "Explore real KartagoTech platforms spanning multi-tenant AI SaaS, legal RAG & voice agents, RPA workflow automation, and web platforms.",
      fr: "Découvrez nos réalisations concrètes : SaaS IA multi-locataires, RAG juridique & agent vocal, automatisation RPA et plateformes web.",
    },
    capabilities: {
      en: [],
      fr: [],
    },
    cta: {
      label: { en: "View all 7 projects", fr: "Voir les 7 projets" },
      href: "/work",
    },
  },
  {
    id: "contact",
    index: "07",
    title: { en: "Reception & Contact", fr: "Accueil & contact" },
    tag: {
      en: "Let's discuss your project",
      fr: "Parlons de votre projet",
    },
    description: {
      en: "Tell us about your operational challenge, timeline, and goals. Every inquiry is reviewed directly by our engineering team.",
      fr: "Décrivez-nous votre projet, vos enjeux et vos objectifs en quelques lignes. Chaque demande est étudiée directement par notre équipe.",
    },
    capabilities: {
      en: [],
      fr: [],
    },
  },
];

export function HeadquartersExperience({
  locale,
  dict,
}: HeadquartersExperienceProps) {
  const { reducedMotion } = useMediaPreferences();
  const [webglError, setWebglError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);

  const progressRef = useRef(0);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? Math.max(0, Math.min(1, scrollY / docHeight)) : 0;
      progressRef.current = p;
      setShowHint(scrollY < 60);

      // Determine active room closest to viewport center
      const centerY = window.innerHeight * 0.45;
      let bestIdx = 0;
      let bestDist = Infinity;
      sectionRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs(mid - centerY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });
      setActiveIndex(bestIdx);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToRoom = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  // Show a balanced set of 4 cross-industry projects in the Projects room card
  const featuredProjects = projects.filter((p) =>
    [
      "chatbotpro",
      "lexassist",
      "rpa-business-process-automation",
      "website-and-elearning-platform",
    ].includes(p.slug)
  );

  return (
    <div className="relative bg-[#F7F6F2] text-[#4A5870]">
      {/* Fixed 3D Architectural Canvas */}
      {!webglError && (
        <HeadquartersCanvas
          progressRef={progressRef}
          reducedMotion={reducedMotion}
          locale={locale}
          onWebGLError={() => setWebglError(true)}
        />
      )}

      {/* Right-Side Step Rail (matching original HTML .rail) */}
      <nav
        aria-label={
          locale === "fr" ? "Étapes de la visite" : "Building tour steps"
        }
        className="hidden md:grid fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 gap-3"
      >
        {ROOMS.map((room, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => scrollToRoom(room.id)}
              aria-label={room.title[locale]}
              title={room.title[locale]}
              className="group flex items-center justify-end gap-2.5 focus:outline-none"
            >
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? "opacity-100 bg-[#142B52] text-white"
                    : "opacity-0 group-hover:opacity-100 bg-white/90 text-[#142B52] border border-[#D8DFEC]"
                }`}
              >
                {room.title[locale]}
              </span>
              <span
                className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                  isActive
                    ? "bg-[#245BDB] border-[#245BDB] scale-110"
                    : "border-[#142B52] bg-white/60 hover:border-[#245BDB]"
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Scroll Hint Pill (matching original HTML .hint) */}
      <div
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-400 ${
          showHint ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#142B52] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#D8DFEC] shadow-sm">
          <ArrowDown className="w-3.5 h-3.5 text-[#245BDB]" />
          <span>
            {locale === "fr"
              ? "Faites défiler pour entrer dans le bâtiment"
              : "Scroll to enter the building"}
          </span>
        </div>
      </div>

      {/* Scroll-Synchronized Department Sections */}
      <div className="relative z-10">
        {ROOMS.map((room, idx) => {
          const isEntrance = room.id === "entrance";
          const isProjects = room.id === "projects";
          const isContact = room.id === "contact";

          return (
            <section
              key={room.id}
              id={room.id}
              ref={(el) => {
                sectionRefs.current[idx] = el;
              }}
              className="min-h-screen flex items-end md:items-center px-4 sm:px-8 lg:px-16 pt-24 pb-16 md:py-24"
            >
              <div
                className={`${
                  isContact ? "w-full max-w-[780px]" : "w-full max-w-[440px]"
                } bg-white/88 backdrop-blur-md border border-[#D8DFEC] rounded-[20px] p-6 sm:p-7 shadow-[0_30px_60px_-30px_rgba(20,43,82,0.38)]`}
              >
                {isEntrance ? (
                  <>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#245BDB] mb-3">
                      <span className="w-2 h-2 rounded-full bg-[#245BDB]" />
                      <span>{room.tag[locale]}</span>
                    </div>
                    <h1 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#142B52] leading-[1.08] tracking-[-0.02em] mb-4">
                      {room.title[locale]}
                    </h1>
                    <p className="text-[15px] sm:text-base text-[#4A5870] leading-relaxed mb-5">
                      {room.description[locale]}
                    </p>
                    <ul className="grid gap-2 mb-6">
                      {room.capabilities[locale].map((cap) => (
                        <li
                          key={cap}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#E9EEF7] text-sm font-medium text-[#142B52]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#245BDB] shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => scrollToRoom("direction")}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#142B52] hover:bg-[#245BDB] text-white text-sm font-medium transition-colors"
                      >
                        <span>
                          {locale === "fr"
                            ? "Entrer dans le bâtiment"
                            : "Enter the building"}
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
                  </>
                ) : isProjects ? (
                  <>
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#245BDB] mb-1">
                      {room.index} — {room.tag[locale]}
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142B52] leading-tight tracking-[-0.02em] mb-2">
                      {room.title[locale]}
                    </h2>
                    <p className="text-sm sm:text-[15px] text-[#4A5870] leading-relaxed mb-4">
                      {room.description[locale]}
                    </p>
                    <div className="grid gap-2 mb-5">
                      {featuredProjects.map((proj) => (
                        <Link
                          key={proj.slug}
                          href={getLocalizedPath(`/work/${proj.slug}`, locale)}
                          className="group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#E9EEF7] hover:bg-[#dce6f8] transition-colors"
                        >
                          <div>
                            <div className="text-sm font-semibold text-[#142B52] group-hover:text-[#245BDB] transition-colors">
                              {proj.title[locale]}
                            </div>
                            <div className="text-xs text-[#4A5870]">
                              {proj.category[locale]}
                            </div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-[#142B52] group-hover:text-[#245BDB] shrink-0" />
                        </Link>
                      ))}
                    </div>
                    {room.cta && (
                      <Link
                        href={getLocalizedPath(room.cta.href, locale)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#142B52] hover:bg-[#245BDB] text-white text-sm font-medium transition-colors"
                      >
                        <span>{room.cta.label[locale]}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </>
                ) : isContact ? (
                  <>
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#245BDB] mb-1">
                      {room.index} — {room.tag[locale]}
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142B52] leading-tight tracking-[-0.02em] mb-2">
                      {room.title[locale]}
                    </h2>
                    <p className="text-sm sm:text-[15px] text-[#4A5870] leading-relaxed mb-5">
                      {room.description[locale]}
                    </p>

                    <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#E9EEF7] border border-[#D8DFEC]">
                      <Mail className="w-4 h-4 text-[#245BDB] shrink-0" />
                      <a
                        href={`mailto:${dict.contactPage.emailValue}`}
                        className="text-sm font-medium text-[#142B52] hover:text-[#245BDB] transition-colors break-all"
                      >
                        {dict.contactPage.emailValue}
                      </a>
                    </div>

                    <ContactForm dict={dict.contactPage.form} />
                  </>
                ) : (
                  <>
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#245BDB] mb-1">
                      {room.index} — {room.tag[locale]}
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142B52] leading-tight tracking-[-0.02em] mb-2">
                      {room.title[locale]}
                    </h2>
                    <p className="text-sm sm:text-[15px] text-[#4A5870] leading-relaxed mb-4">
                      {room.description[locale]}
                    </p>
                    <ul className="grid gap-2 mb-5">
                      {room.capabilities[locale].map((cap) => (
                        <li
                          key={cap}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#E9EEF7] text-sm font-medium text-[#142B52]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#245BDB] shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                    {room.cta && (
                      <Link
                        href={getLocalizedPath(room.cta.href, locale)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#142B52] hover:text-[#245BDB] transition-colors"
                      >
                        <span>{room.cta.label[locale]}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
