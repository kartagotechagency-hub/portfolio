"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Cpu,
  Layers,
  Mail,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import { ContactForm } from "@/components/ContactForm";
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

type SpaceId =
  | "exterior"
  | "services"
  | "software-studio"
  | "ai-lab"
  | "automation-hub"
  | "digital-experiences"
  | "contact";

interface WingContent {
  id: SpaceId;
  index: string;
  name: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  problem: Record<Locale, string>;
  solution: Record<Locale, string>;
  interfaceTitle: string;
  interfaceRows: Array<{ label: string; value: string; status: string }>;
  serviceHref: string;
}

const WINGS: WingContent[] = [
  {
    id: "software-studio",
    index: "01",
    name: { en: "SOFTWARE STUDIO", fr: "SOFTWARE STUDIO" },
    subtitle: {
      en: "Websites, applications, custom software and digital platforms.",
      fr: "Sites web, applications, logiciels sur mesure et plateformes digitales.",
    },
    problem: {
      en: "Off-the-shelf tools force growing teams into disconnected spreadsheets and rigid workarounds.",
      fr: "Les outils génériques imposent aux équipes des tableurs dispersés et des contournements rigides.",
    },
    solution: {
      en: "We architect fast web platforms, multi-tenant SaaS products, and custom operational software tailored to your exact workflows.",
      fr: "Nous concevons des plateformes web rapides, des SaaS multi-locataires et des logiciels métier sur mesure adaptés à vos flux.",
    },
    interfaceTitle: "PLATFORM ARCHITECTURE // STUDIO",
    interfaceRows: [
      { label: "Web & Corporate", value: "Next.js · Editorial & SEO-ready", status: "ACTIVE" },
      { label: "Custom Systems", value: "Multi-tenant SaaS & Internal Portals", status: "SCALABLE" },
      { label: "API Layer", value: "ERP, CRM & Payment Integrations", status: "SYNCED" },
    ],
    serviceHref: "/services#custom-software",
  },
  {
    id: "ai-lab",
    index: "02",
    name: { en: "AI LAB", fr: "AI LAB" },
    subtitle: {
      en: "AI assistants, conversational AI, intelligent integrations and AI-powered tools.",
      fr: "Assistants IA, IA conversationnelle, intégrations intelligentes et outils propulsés par l'IA.",
    },
    problem: {
      en: "Teams spend hours searching fragmented knowledge or answering repetitive inquiries without reliable guardrails.",
      fr: "Les équipes perdent des heures à chercher dans des documents dispersés ou à répondre aux mêmes demandes.",
    },
    solution: {
      en: "We deploy grounded RAG assistants with verifiable citations, embeddable website copilots, and real-time voice agents.",
      fr: "Nous déployons des assistants RAG sourcés, des copilotes embarqués et des agents vocaux temps réel.",
    },
    interfaceTitle: "INTELLIGENT SYSTEMS // AI LAB",
    interfaceRows: [
      { label: "Grounded RAG", value: "Local & Cloud Document Search + Citations", status: "VERIFIED" },
      { label: "Conversational", value: "Embeddable Multi-Tenant AI Assistants", status: "EMBEDDED" },
      { label: "Realtime Voice", value: "Asterisk SIP + OpenAI Realtime Bridge", status: "LOW-LATENCY" },
    ],
    serviceHref: "/services#ai-automation",
  },
  {
    id: "automation-hub",
    index: "03",
    name: { en: "AUTOMATION HUB", fr: "AUTOMATION HUB" },
    subtitle: {
      en: "RPA, workflow automation and business process optimization.",
      fr: "RPA, automatisation des workflows et optimisation des processus métier.",
    },
    problem: {
      en: "Manual data entry across legacy portals, PDFs, and back-office tools drains operational capacity and creates errors.",
      fr: "La saisie manuelle entre portails, PDF et outils internes consomme du temps et génère des erreurs.",
    },
    solution: {
      en: "We build deterministic RPA pipelines for browser workflows, document extraction, data sync, and scheduled reporting.",
      fr: "Nous bâtissons des pipelines RPA déterministes pour l'automatisation navigateur, l'extraction documentaire et le reporting.",
    },
    interfaceTitle: "EXECUTION PIPELINE // RPA HUB",
    interfaceRows: [
      { label: "Browser Bots", value: "Automated Portal & Form Execution", status: "DETERMINISTIC" },
      { label: "Document Engine", value: "PDF, Invoice & Spreadsheet Structuring", status: "PARSED" },
      { label: "Reporting", value: "Scheduled Consolidation & Audit Logs", status: "SCHEDULED" },
    ],
    serviceHref: "/services#rpa-automation",
  },
  {
    id: "digital-experiences",
    index: "04",
    name: { en: "DIGITAL EXPERIENCES", fr: "EXPÉRIENCES DIGITALES" },
    subtitle: {
      en: "Digital transformation, connected systems and modern digital experiences.",
      fr: "Transformation digitale, systèmes connectés et expériences numériques modernes.",
    },
    problem: {
      en: "Legacy processes and siloed tools slow down customer journeys and limit visibility across operations.",
      fr: "Les processus hérités et outils cloisonnés ralentissent les parcours clients et limitent la visibilité.",
    },
    solution: {
      en: "We unify disconnected tools into coherent, Swiss-grade digital ecosystems designed for clarity across desktop and mobile.",
      fr: "Nous unifions vos outils en écosystèmes digitaux cohérents, conçus pour la clarté sur ordinateur et mobile.",
    },
    interfaceTitle: "CONNECTED ECOSYSTEM // EXPERIENCE",
    interfaceRows: [
      { label: "Unification", value: "Single Source of Truth Across Teams", status: "CONNECTED" },
      { label: "Interface Craft", value: "Accessible, High-Speed Responsive UI", status: "OPTIMIZED" },
      { label: "Modernization", value: "Step-by-Step Legacy Transition", status: "CONTROLLED" },
    ],
    serviceHref: "/services#digital-transformation",
  },
];

const COPY = {
  en: {
    exteriorEyebrow: "KARTAGOTECH HEADQUARTERS",
    exteriorHeadline: "A NEW WAY TO BUILD WHAT'S NEXT.",
    exteriorBody:
      "We build custom software, practical AI solutions, and intelligent automation for ambitious businesses across France and worldwide.",
    enterBuilding: "Enter the building",
    scrollCue: "Scroll to explore",
    atriumEyebrow: "CENTRAL ATRIUM",
    atriumTitle: "Four innovation spaces. One engineering standard.",
    atriumBody:
      "Step inside the KartagoTech ecosystem. Select a wing below or continue scrolling to explore how we solve real operational challenges.",
    exploreWork: "Explore selected work",
    problemLabel: "Challenge",
    solutionLabel: "Solution",
    interfaceLabel: "System View",
    viewService: "Service details",
    meetingEyebrow: "FINAL MEETING SPACE",
    meetingHeadline: "LET'S BUILD WHAT'S NEXT.",
    meetingBody:
      "Have a project, operational bottleneck, or digital transformation goal? Share your brief directly with our team.",
    directEmail: "Direct email",
    spaces: [
      { id: "exterior", label: "Exterior" },
      { id: "services", label: "Central Atrium" },
      { id: "software-studio", label: "Software Studio" },
      { id: "ai-lab", label: "AI Lab" },
      { id: "automation-hub", label: "Automation Hub" },
      { id: "digital-experiences", label: "Digital Experiences" },
      { id: "contact", label: "Meeting Space" },
    ],
  },
  fr: {
    exteriorEyebrow: "SIÈGE KARTAGOTECH",
    exteriorHeadline: "UNE NOUVELLE FAÇON DE BÂTIR LA SUITE.",
    exteriorBody:
      "Nous concevons des logiciels sur mesure, des solutions IA concrètes et des automatisations intelligentes pour les entreprises ambitieuses en France et à l'international.",
    enterBuilding: "Entrer dans le bâtiment",
    scrollCue: "Défiler pour visiter",
    atriumEyebrow: "ATRIUM CENTRAL",
    atriumTitle: "Quatre espaces d'innovation. Une même exigence d'ingénierie.",
    atriumBody:
      "Explorez l'écosystème KartagoTech. Sélectionnez un espace ci-dessous ou poursuivez le défilement pour découvrir nos solutions.",
    exploreWork: "Découvrir nos projets",
    problemLabel: "Enjeu",
    solutionLabel: "Solution",
    interfaceLabel: "Aperçu Système",
    viewService: "Détails du service",
    meetingEyebrow: "ESPACE RÉUNION",
    meetingHeadline: "CONSTRUISONS LA SUITE.",
    meetingBody:
      "Un projet, un blocage opérationnel ou un objectif de transformation digitale ? Partagez votre brief directement avec notre équipe.",
    directEmail: "E-mail direct",
    spaces: [
      { id: "exterior", label: "Extérieur" },
      { id: "services", label: "Atrium Central" },
      { id: "software-studio", label: "Software Studio" },
      { id: "ai-lab", label: "AI Lab" },
      { id: "automation-hub", label: "Automation Hub" },
      { id: "digital-experiences", label: "Expériences Digitales" },
      { id: "contact", label: "Salle de Réunion" },
    ],
  },
} as const;

const WING_ICONS = [Building2, Sparkles, Workflow, Layers];

export function HeadquartersExperience({
  locale,
  dict,
}: HeadquartersExperienceProps) {
  const c = COPY[locale];
  const { reducedMotion } = useMediaPreferences();
  const [webglFailed, setWebglFailed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    Record<string, "overview" | "interface">
  >({});
  const progressRef = useRef(0);

  const show3D = !reducedMotion && !webglFailed;

  useEffect(() => {
    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      progressRef.current = p;
      const idx = Math.min(c.spaces.length - 1, Math.round(p * (c.spaces.length - 1)));
      setActiveIndex(idx);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [c.spaces.length]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <div
      className={`relative ${
        show3D ? "bg-transparent" : "bg-[#ECEEF2]"
      } text-[#111318]`}
    >
      {/* Fixed 3D Architectural Canvas */}
      {show3D && (
        <HeadquartersCanvas
          progressRef={progressRef}
          onWebGLError={() => setWebglFailed(true)}
        />
      )}

      {/* Right Architectural Space Navigation Rail */}
      <nav
        aria-label="Building spaces"
        className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-3.5"
      >
        {c.spaces.map((space, idx) => {
          const active = activeIndex === idx;
          return (
            <button
              key={space.id}
              type="button"
              onClick={() => scrollToSection(space.id)}
              className={`group flex items-center gap-3 transition-opacity ${
                active ? "opacity-100" : "opacity-45 hover:opacity-90"
              }`}
              aria-label={space.label}
            >
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#111318] bg-white/85 backdrop-blur-sm px-2 py-0.5 border border-[#111318]/10">
                0{idx + 1} · {space.label}
              </span>
              <span
                className={`w-2.5 h-2.5 border transition-colors ${
                  active
                    ? "bg-[#8291EA] border-[#8291EA]"
                    : "bg-white/80 border-[#111318]/40"
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Scrollable Architectural Rooms */}
      <div className="relative z-10">
        {/* 1. EXTERIOR / HERO */}
        <section
          id="exterior"
          className="min-h-[92vh] flex items-end sm:items-center py-16 sm:py-24 px-5 sm:px-8 lg:px-12"
        >
          <div className="max-w-[1360px] w-full mx-auto">
            <div className="max-w-xl bg-white/88 backdrop-blur-md border border-[#111318]/12 p-7 sm:p-10 shadow-[0_24px_60px_-24px_rgba(17,19,24,0.22)]">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-2 h-2 bg-[#8291EA]" />
                <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#8291EA]">
                  {c.exteriorEyebrow}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-medium tracking-tight leading-[1.04] text-[#111318] mb-5">
                {c.exteriorHeadline}
              </h1>

              <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed mb-8">
                {c.exteriorBody}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection("services")}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#111318] text-white font-medium text-sm tracking-wide hover:bg-[#8291EA] hover:text-[#111318] transition-colors"
                >
                  <span>{c.enterBuilding}</span>
                  <ArrowDown className="w-4 h-4" />
                </button>
                <Link
                  href={getLocalizedPath("/work", locale)}
                  className="inline-flex items-center gap-2 px-5 py-3.5 border border-[#111318]/20 bg-white/70 text-[#111318] font-medium text-sm tracking-wide hover:border-[#111318] transition-colors"
                >
                  <span>{c.exploreWork}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CENTRAL ATRIUM (#services anchor) */}
        <section
          id="services"
          className="min-h-[95vh] flex items-center py-20 px-5 sm:px-8 lg:px-12 scroll-mt-20"
        >
          <div className="max-w-[1360px] w-full mx-auto">
            <div className="max-w-3xl bg-white/90 backdrop-blur-md border border-[#111318]/12 p-7 sm:p-10 shadow-[0_24px_60px_-24px_rgba(17,19,24,0.2)]">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#8291EA] mb-3">
                02 / {c.atriumEyebrow}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight leading-[1.08] text-[#111318] mb-4">
                {c.atriumTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed mb-8 max-w-2xl">
                {c.atriumBody}
              </p>

              {/* Interactive 4-Wing Directory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WINGS.map((wing, idx) => {
                  const Icon = WING_ICONS[idx] ?? Cpu;
                  return (
                    <button
                      key={wing.id}
                      type="button"
                      onClick={() => scrollToSection(wing.id)}
                      className="text-left p-4 border border-[#111318]/12 bg-[#F5F5F2]/80 hover:bg-[#111318] hover:text-white group transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono text-[#8291EA]">
                          {wing.index}
                        </span>
                        <Icon className="w-4 h-4 text-[#111318]/40 group-hover:text-[#8291EA] transition-colors" />
                      </div>
                      <p className="font-display text-base font-medium mb-1">
                        {wing.name[locale]}
                      </p>
                      <p className="text-xs text-[#777777] group-hover:text-white/70 leading-relaxed transition-colors">
                        {wing.subtitle[locale]}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 3–6. FOUR INNOVATION SPACES */}
        {WINGS.map((wing, idx) => {
          const isRight = idx % 2 === 1;
          const mode = activeTab[wing.id] ?? "overview";

          return (
            <section
              key={wing.id}
              id={wing.id}
              className="min-h-[95vh] flex items-center py-20 px-5 sm:px-8 lg:px-12 scroll-mt-20"
            >
              <div
                className={`max-w-[1360px] w-full mx-auto flex ${
                  isRight ? "justify-end" : "justify-start"
                }`}
              >
                <div className="w-full max-w-lg bg-white/92 backdrop-blur-md border border-[#111318]/12 p-7 sm:p-9 shadow-[0_24px_60px_-24px_rgba(17,19,24,0.22)]">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#8291EA]">
                      WING {wing.index}
                    </span>

                    {/* Interactive Tab Switcher */}
                    <div
                      className="inline-flex border border-[#111318]/15 bg-[#F5F5F2] text-[11px] font-mono"
                      role="tablist"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={mode === "overview"}
                        onClick={() =>
                          setActiveTab((prev) => ({
                            ...prev,
                            [wing.id]: "overview",
                          }))
                        }
                        className={`px-2.5 py-1 transition-colors ${
                          mode === "overview"
                            ? "bg-[#111318] text-white"
                            : "text-[#777777] hover:text-[#111318]"
                        }`}
                      >
                        {c.solutionLabel}
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={mode === "interface"}
                        onClick={() =>
                          setActiveTab((prev) => ({
                            ...prev,
                            [wing.id]: "interface",
                          }))
                        }
                        className={`px-2.5 py-1 transition-colors ${
                          mode === "interface"
                            ? "bg-[#111318] text-white"
                            : "text-[#777777] hover:text-[#111318]"
                        }`}
                      >
                        {c.interfaceLabel}
                      </button>
                    </div>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#111318] mb-2">
                    {wing.name[locale]}
                  </h2>
                  <p className="text-sm text-[#777777] mb-6">
                    {wing.subtitle[locale]}
                  </p>

                  {mode === "overview" ? (
                    <div className="space-y-4 mb-7">
                      <div className="p-4 bg-[#F5F5F2] border-l-2 border-[#111318]/25">
                        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#777777] block mb-1">
                          {c.problemLabel}
                        </span>
                        <p className="text-sm text-[#4A5568] leading-relaxed">
                          {wing.problem[locale]}
                        </p>
                      </div>

                      <div className="p-4 bg-[#111318] text-white border-l-2 border-[#8291EA]">
                        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#8291EA] block mb-1">
                          {c.solutionLabel}
                        </span>
                        <p className="text-sm text-white/90 leading-relaxed">
                          {wing.solution[locale]}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-7 bg-[#111318] text-white p-4 border border-[#111318]">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8291EA]">
                          {wing.interfaceTitle}
                        </span>
                        <span className="w-2 h-2 bg-[#8291EA]" />
                      </div>
                      <div className="space-y-2.5">
                        {wing.interfaceRows.map((row) => (
                          <div
                            key={row.label}
                            className="p-2.5 bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                          >
                            <div>
                              <p className="text-[10px] font-mono text-white/50">
                                {row.label}
                              </p>
                              <p className="text-xs font-medium text-white/95">
                                {row.value}
                              </p>
                            </div>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#8291EA]/20 text-[#8291EA] shrink-0">
                              {row.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#111318]/10 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href={getLocalizedPath(wing.serviceHref, locale)}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-[#111318] hover:text-[#8291EA] transition-colors"
                    >
                      <span>{c.viewService}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={getLocalizedPath("/work", locale)}
                      className="text-xs font-mono uppercase tracking-[0.14em] text-[#777777] hover:text-[#111318] transition-colors"
                    >
                      {c.exploreWork} →
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* 7. FINAL MEETING SPACE (#contact anchor) */}
        <section
          id="contact"
          className="min-h-screen flex items-center py-20 px-5 sm:px-8 lg:px-12 scroll-mt-20"
        >
          <div className="max-w-[1360px] w-full mx-auto">
            <div className="bg-[#111318]/95 backdrop-blur-md text-white border border-white/15 p-7 sm:p-12 shadow-[0_30px_70px_-24px_rgba(17,19,24,0.45)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                <div className="lg:col-span-5">
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8291EA] mb-4">
                    {c.meetingEyebrow}
                  </p>
                  <h2 className="font-display text-3xl sm:text-5xl font-medium leading-[1.04] tracking-tight text-white mb-5">
                    {c.meetingHeadline}
                  </h2>
                  <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-8">
                    {c.meetingBody}
                  </p>

                  <div className="flex items-start gap-3.5 p-4 border border-white/15 bg-white/5">
                    <Mail className="w-4 h-4 text-[#8291EA] shrink-0 mt-1" />
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/50 mb-0.5">
                        {c.directEmail}
                      </p>
                      <a
                        href={`mailto:${dict.contactPage.emailValue}`}
                        className="text-sm font-medium text-white hover:text-[#8291EA] transition-colors break-all"
                      >
                        {dict.contactPage.emailValue}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <ContactForm dict={dict.contactPage.form} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
