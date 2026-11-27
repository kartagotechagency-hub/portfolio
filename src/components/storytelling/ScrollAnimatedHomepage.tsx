"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock,
  Cpu,
  FileSpreadsheet,
  Layers,
  MailWarning,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { ContactForm } from "@/components/ContactForm";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

const STORY_COPY = {
  en: {
    heroEyebrow: "KARTAGOTECH AGENCY · FRANCE & WORLDWIDE",
    heroTitle1: "The world moved on.",
    heroTitle2: "Has your business?",
    heroSubtitle:
      "We design and engineer custom software, practical AI, and intelligent automation—turning manual bottlenecks into calm, connected operations.",
    heroPrimary: "Start a project",
    heroSecondary: "Explore our work",
    scrollLabel: "Scroll to see the shift",
    stages: [
      {
        index: "01",
        tag: "THE COST OF STANDING STILL",
        title: "Manual work shouldn't run your business.",
        body: "Disconnected spreadsheets, repetitive copy-paste, and slow follow-ups quietly drain hours every week—leaving less room for customers and growth.",
        bullets: [
          "Fragmented tools & duplicate data entry",
          "Delayed responses to client inquiries",
          "Operational friction as volume grows",
        ],
      },
      {
        index: "02",
        tag: "A DIFFERENT WAY TO WORK",
        title: "Software & AI built around your real workflow.",
        body: "Instead of forcing teams into rigid templates, we connect your tools with custom software, grounded AI assistants, and reliable RPA pipelines.",
        bullets: [
          "Tailored web platforms & internal tools",
          "Practical AI grounded in your data",
          "Automated back-office & browser workflows",
        ],
      },
      {
        index: "03",
        tag: "TURN TECHNOLOGY INTO OPPORTUNITY",
        title: "Better operations. Better experiences. Real growth.",
        body: "When technology fits your business cleanly, teams move faster, customers get immediate clarity, and your company gains capacity to scale.",
        bullets: [
          "Faster, more attentive customer service",
          "Single source of truth across teams",
          "Durable systems ready for what's next",
        ],
      },
    ],
    finaleEyebrow: "04 — LET'S BUILD WHAT'S NEXT",
    finaleTitle: "Ready to modernize how your business works?",
    finaleBody:
      "Tell us about your operational bottlenecks or upcoming digital product. We respond directly with a clear technical perspective.",
  },
  fr: {
    heroEyebrow: "KARTAGOTECH AGENCY · FRANCE & INTERNATIONAL",
    heroTitle1: "Le monde a évolué.",
    heroTitle2: "Et votre entreprise ?",
    heroSubtitle:
      "Nous concevons des logiciels sur mesure, de l'IA pratique et de l'automatisation intelligente—pour transformer vos blocages manuels en opérations fluides.",
    heroPrimary: "Démarrer un projet",
    heroSecondary: "Voir nos projets",
    scrollLabel: "Faites défiler pour voir la transformation",
    stages: [
      {
        index: "01",
        tag: "LE COÛT DE L'IMMOBILISME",
        title: "Le travail manuel ne devrait pas freiner votre activité.",
        body: "Tableurs isolés, saisies répétitives et suivis lents consomment des heures chaque semaine—au détriment de vos clients et de votre croissance.",
        bullets: [
          "Outils déconnectés & double saisie",
          "Réponses tardives aux demandes clients",
          "Friction opérationnelle dès que le volume augmente",
        ],
      },
      {
        index: "02",
        tag: "UNE AUTRE FAÇON DE TRAVAILLER",
        title: "Logiciels & IA conçus autour de vos opérations réelles.",
        body: "Plutôt que d'imposer des modèles rigides, nous unifions vos outils avec du logiciel sur mesure, des assistants IA fiables et des pipelines RPA.",
        bullets: [
          "Plateformes web & outils internes sur mesure",
          "IA pratique ancrée dans vos données",
          "Automatisation des tâches répétitives",
        ],
      },
      {
        index: "03",
        tag: "TRANSFORMER LA TECH EN OPPORTUNITÉ",
        title: "Meilleures opérations. Meilleure expérience. Vraie croissance.",
        body: "Quand la technologie s'adapte à votre métier, vos équipes gagnent en rapidité, vos clients en clarté, et votre entreprise en capacité.",
        bullets: [
          "Service client plus rapide et réactif",
          "Vision unifiée pour toute l'équipe",
          "Systèmes durables prêts pour la suite",
        ],
      },
    ],
    finaleEyebrow: "04 — CONSTRUISONS LA SUITE",
    finaleTitle: "Prêt à moderniser votre fonctionnement ?",
    finaleBody:
      "Partagez vos enjeux opérationnels ou votre prochain projet digital. Nous répondons directement avec une vision technique claire.",
  },
} as const;

export function ScrollAnimatedHomepage({ locale, dict }: Props) {
  const prefersReduced = useReducedMotion();
  const copy = locale === "fr" ? STORY_COPY.fr : STORY_COPY.en;

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  // Hero scroll parallax
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroScroll, [0, 1], [0, prefersReduced ? 0 : 60]);
  const heroCardY = useTransform(heroScroll, [0, 1], [0, prefersReduced ? 0 : -45]);
  const heroOpacity = useTransform(heroScroll, [0, 0.85], [1, 0.2]);

  // Sticky transformation story scroll
  const storyRef = useRef<HTMLElement>(null);
  const { scrollYProgress: storyScroll } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });

  // Stage opacities for the 3-step sticky story
  const stage1Opacity = useTransform(storyScroll, [0, 0.25, 0.36], [1, 1, 0]);
  const stage2Opacity = useTransform(storyScroll, [0.28, 0.42, 0.62, 0.72], [0, 1, 1, 0]);
  const stage3Opacity = useTransform(storyScroll, [0.64, 0.78, 1], [0, 1, 1]);

  const stage1Y = useTransform(storyScroll, [0, 0.36], [0, prefersReduced ? 0 : -24]);
  const stage2Y = useTransform(storyScroll, [0.28, 0.42, 0.72], [24, 0, prefersReduced ? 0 : -24]);
  const stage3Y = useTransform(storyScroll, [0.64, 0.78], [24, 0]);

  const pipelineWidth = useTransform(storyScroll, [0.35, 0.62], ["0%", "100%"]);
  const curveLength = useTransform(storyScroll, [0.68, 0.94], [0, 1]);

  return (
    <div className="relative bg-[#F7F6F2] text-[#142B52] overflow-x-clip">
      {/* Top scroll progress bar */}
      <motion.div
        className="fixed top-20 left-0 right-0 h-[3px] bg-[#245BDB] origin-left z-[150] pointer-events-none"
        style={{ scaleX: smoothProgress }}
        aria-hidden="true"
      />

      {/* ── 1. HERO SECTION ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[calc(100vh-5rem)] flex items-center swiss-grid-bg border-b border-[#D8DFEC]"
      >
        <div className="max-w-[1360px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left: Kinetic Editorial Headline */}
            <motion.div
              style={{ y: heroTextY, opacity: heroOpacity }}
              className="lg:col-span-7"
            >
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="font-mono text-xs uppercase tracking-[0.16em] text-[#245BDB] font-semibold"
              >
                {copy.heroEyebrow}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 font-display font-bold text-[#142B52] text-[clamp(2.5rem,5.4vw,4.5rem)] leading-[1.02] tracking-tight"
              >
                <span className="block">{copy.heroTitle1}</span>
                <span className="block text-[#245BDB]">{copy.heroTitle2}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 text-lg sm:text-xl text-[#4A5870] leading-relaxed max-w-xl"
              >
                {copy.heroSubtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#142B52] text-white font-semibold text-sm hover:bg-[#245BDB] transition-colors"
                >
                  <span>{copy.heroPrimary}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href={getLocalizedPath("/work", locale)}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#142B52]/20 bg-white/80 text-[#142B52] font-semibold text-sm hover:border-[#245BDB] hover:text-[#245BDB] transition-colors"
                >
                  <span>{copy.heroSecondary}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Scroll-Parallax Live Architecture Card */}
            <motion.div
              style={{ y: heroCardY }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <div className="rounded-2xl bg-white border border-[#D8DFEC] shadow-[0_24px_60px_-20px_rgba(20,43,82,0.14)] p-6 sm:p-7">
                <div className="flex items-center justify-between pb-4 border-b border-[#E9EEF7]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#245BDB]" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#4A5870]">
                      KARTAGOTECH · SYSTEM CORE
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#E9EEF7] text-[#245BDB] font-semibold">
                    ONLINE
                  </span>
                </div>

                <div className="mt-5 space-y-3.5">
                  {[
                    {
                      icon: Layers,
                      title: locale === "fr" ? "Logiciels sur mesure" : "Custom Software",
                      sub:
                        locale === "fr"
                          ? "Plateformes web, portails & APIs"
                          : "Web platforms, portals & APIs",
                    },
                    {
                      icon: Bot,
                      title: locale === "fr" ? "IA Pratique" : "Practical AI",
                      sub:
                        locale === "fr"
                          ? "Assistants ancrés dans vos données"
                          : "Assistants grounded in your data",
                    },
                    {
                      icon: Workflow,
                      title: locale === "fr" ? "Automatisation & RPA" : "Automation & RPA",
                      sub:
                        locale === "fr"
                          ? "Zéro saisie manuelle répétitive"
                          : "Zero repetitive manual handoffs",
                    },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + idx * 0.1, duration: 0.45 }}
                        className="flex items-center gap-4 p-3.5 rounded-xl bg-[#F7F6F2] border border-[#D8DFEC]/80"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#142B52] text-white grid place-items-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-display font-bold text-sm text-[#142B52]">
                            {item.title}
                          </p>
                          <p className="text-xs text-[#4A5870] truncate">{item.sub}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-[#E9EEF7] flex items-center justify-between text-xs text-[#4A5870]">
                  <span className="font-mono">{copy.scrollLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#245BDB] rotate-90" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. STICKY SCROLL-DRIVEN TRANSFORMATION STORY ────────────────────── */}
      <section
        ref={storyRef}
        aria-label="Business transformation story"
        className="relative lg:h-[270vh] border-b border-[#D8DFEC]"
      >
        {/* Desktop Sticky Split View */}
        <div className="hidden lg:block sticky top-20 h-[calc(100vh-5rem)]">
          <div className="max-w-[1360px] h-full mx-auto px-8 lg:px-12 grid grid-cols-12 gap-12 items-center">
            {/* Left: Crossfading Narrative Stages */}
            <div className="col-span-5 relative h-[360px]">
              {[
                { data: copy.stages[0], op: stage1Opacity, y: stage1Y },
                { data: copy.stages[1], op: stage2Opacity, y: stage2Y },
                { data: copy.stages[2], op: stage3Opacity, y: stage3Y },
              ].map(({ data, op, y }) => (
                <motion.div
                  key={data.index}
                  style={{ opacity: op, y }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <span className="font-mono text-xs tracking-[0.16em] text-[#245BDB] font-semibold">
                    {data.index} — {data.tag}
                  </span>
                  <h2 className="mt-3 font-display font-bold text-4xl leading-[1.08] tracking-tight text-[#142B52]">
                    {data.title}
                  </h2>
                  <p className="mt-4 text-base text-[#4A5870] leading-relaxed">
                    {data.body}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {data.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-2.5 text-sm font-medium text-[#142B52]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#245BDB]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Right: Scroll-Morphing Interactive System Stage */}
            <div className="col-span-7 relative h-[480px] rounded-3xl bg-[#142B52] p-8 overflow-hidden shadow-[0_30px_70px_-20px_rgba(20,43,82,0.28)] border border-white/10">
              {/* Subtle grid inside dark stage */}
              <div className="absolute inset-0 swiss-grid-bg-dark pointer-events-none" />

              {/* Stage 1 Visual: Legacy Bottlenecks */}
              <motion.div
                style={{ opacity: stage1Opacity }}
                className="relative z-10 h-full flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs font-mono text-white/60">
                  <span>LEGACY_OPERATIONS.STATUS</span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                    BOTTLENECK DETECTED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 my-auto">
                  {[
                    {
                      icon: FileSpreadsheet,
                      title: "Disconnected Spreadsheets",
                      meta: "Manual sync required",
                    },
                    {
                      icon: MailWarning,
                      title: "Inbox Approvals",
                      meta: "Waiting on manual reply",
                    },
                    {
                      icon: Clock,
                      title: "Repetitive Data Entry",
                      meta: "Duplicate copy-paste",
                    },
                    {
                      icon: Layers,
                      title: "Fragmented Tools",
                      meta: "No shared visibility",
                    },
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.title}
                        className="rounded-xl bg-white/[0.06] border border-white/10 p-4"
                      >
                        <Icon className="w-5 h-5 text-amber-300 mb-3" />
                        <p className="font-display font-bold text-sm text-white">
                          {card.title}
                        </p>
                        <p className="text-xs text-white/55 mt-1">{card.meta}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-1/3 bg-amber-400/70 rounded-full" />
                </div>
              </motion.div>

              {/* Stage 2 Visual: Unified Architecture Pipeline */}
              <motion.div
                style={{ opacity: stage2Opacity }}
                className="absolute inset-8 z-10 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs font-mono text-white/60">
                  <span>UNIFIED_ARCHITECTURE.PIPELINE</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#245BDB]/30 text-[#8291EA] border border-[#8291EA]/30">
                    CONNECTED
                  </span>
                </div>

                <div className="relative my-auto">
                  <div className="h-[2px] bg-white/15 w-full absolute top-1/2 -translate-y-1/2">
                    <motion.div
                      className="h-full bg-[#245BDB]"
                      style={{ width: pipelineWidth }}
                    />
                  </div>

                  <div className="relative grid grid-cols-3 gap-4">
                    {[
                      { icon: Cpu, label: "Custom Software", sub: "Core business logic" },
                      { icon: Sparkles, label: "Practical AI", sub: "Grounded assistants" },
                      { icon: Workflow, label: "RPA Execution", sub: "Automated handoffs" },
                    ].map((node) => {
                      const Icon = node.icon;
                      return (
                        <div
                          key={node.label}
                          className="rounded-2xl bg-[#1B3563] border border-[#8291EA]/40 p-5 text-center shadow-lg"
                        >
                          <div className="w-11 h-11 rounded-xl bg-[#245BDB] text-white grid place-items-center mx-auto mb-3">
                            <Icon className="w-5 h-5" />
                          </div>
                          <p className="font-display font-bold text-sm text-white">
                            {node.label}
                          </p>
                          <p className="text-xs text-white/65 mt-1">{node.sub}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-xs font-mono text-white/55 flex justify-between">
                  <span>API · ERP · CRM · PORTALS</span>
                  <span className="text-[#8291EA]">END-TO-END SYNC</span>
                </div>
              </motion.div>

              {/* Stage 3 Visual: Operational Clarity & Growth Curve */}
              <motion.div
                style={{ opacity: stage3Opacity }}
                className="absolute inset-8 z-10 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs font-mono text-white/60">
                  <span>OPERATIONAL_CLARITY.OVERVIEW</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">
                    READY TO SCALE
                  </span>
                </div>

                <div className="my-auto grid grid-cols-12 gap-5 items-center">
                  <div className="col-span-7 rounded-2xl bg-white/[0.06] border border-white/10 p-5">
                    <p className="text-xs font-mono text-white/60 mb-3">
                      SYSTEM CAPACITY
                    </p>
                    <svg viewBox="0 0 320 140" className="w-full h-36 overflow-visible">
                      <path
                        d="M 10 120 C 90 116, 150 70, 305 18"
                        fill="none"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <motion.path
                        d="M 10 120 C 90 116, 150 70, 305 18"
                        fill="none"
                        stroke="#8291EA"
                        strokeWidth="4"
                        strokeLinecap="round"
                        style={{ pathLength: curveLength }}
                      />
                    </svg>
                  </div>

                  <div className="col-span-5 space-y-3">
                    {[
                      "Faster Client Response",
                      "Clean Team Workflows",
                      "Scalable Architecture",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2.5 rounded-xl bg-white/[0.07] border border-white/10 px-3.5 py-3 text-xs font-semibold text-white"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs font-mono text-white/55">
                  BUILT FOR LONG-TERM RELIABILITY
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Stacked Scroll-Reveal View */}
        <div className="lg:hidden px-5 sm:px-8 py-16 space-y-10">
          {copy.stages.map((st) => (
            <motion.div
              key={st.index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl bg-white border border-[#D8DFEC] p-6 shadow-sm"
            >
              <span className="font-mono text-xs tracking-[0.14em] text-[#245BDB] font-semibold">
                {st.index} — {st.tag}
              </span>
              <h2 className="mt-2 font-display font-bold text-2xl text-[#142B52]">
                {st.title}
              </h2>
              <p className="mt-3 text-sm text-[#4A5870] leading-relaxed">{st.body}</p>
              <ul className="mt-4 space-y-2">
                {st.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs font-medium text-[#142B52]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#245BDB]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 3. WHAT WE DO (SERVICES) ────────────────────────────────────────── */}
      <section id="services" className="py-20 lg:py-28 border-b border-[#D8DFEC]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
          >
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#245BDB] font-semibold">
                {dict.home.services.label}
              </p>
              <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#142B52] tracking-tight">
                {dict.home.services.title}
              </h2>
            </div>
            <Link
              href={getLocalizedPath("/services", locale)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#245BDB] hover:text-[#142B52] transition-colors shrink-0"
            >
              <span>{dict.home.services.exploreServices}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dict.home.services.items.map((item, idx) => (
              <motion.div
                key={item.index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
              >
                <Link
                  href={getLocalizedPath(item.href, locale)}
                  className="group block h-full rounded-2xl bg-white border border-[#D8DFEC] p-7 hover:border-[#245BDB] hover:shadow-[0_18px_40px_-18px_rgba(36,91,219,0.22)] transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-[#245BDB] font-semibold">
                      {item.index}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[#4A5870] group-hover:text-[#245BDB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#142B52] group-hover:text-[#245BDB] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#4A5870] leading-relaxed">
                    {item.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. ENGINEERING PROCESS ──────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-[#E9EEF7]/60 border-b border-[#D8DFEC]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl mb-14"
          >
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#245BDB] font-semibold">
              {dict.home.approach.label}
            </p>
            <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl text-[#142B52] tracking-tight">
              {dict.home.approach.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {dict.home.approach.steps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                className="rounded-2xl bg-white border border-[#D8DFEC] p-6"
              >
                <span className="font-mono text-xs text-[#245BDB] font-bold">
                  {step.number}
                </span>
                <h3 className="mt-3 font-display font-bold text-lg text-[#142B52]">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs text-[#4A5870] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CONTACT FINALE ───────────────────────────────────────────────── */}
      <section id="contact" className="py-20 lg:py-28 bg-[#142B52] text-white">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5"
            >
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#8291EA] font-semibold">
                {copy.finaleEyebrow}
              </p>
              <h2 className="mt-4 font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.06] tracking-tight">
                {copy.finaleTitle}
              </h2>
              <p className="mt-5 text-base text-white/75 leading-relaxed">
                {copy.finaleBody}
              </p>

              <div className="mt-8 pt-8 border-t border-white/15 flex flex-wrap gap-4">
                <Link
                  href={getLocalizedPath("/work", locale)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/25 text-white text-sm font-semibold hover:bg-white hover:text-[#142B52] transition-colors"
                >
                  <span>{dict.home.selectedWork.viewAll}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7 rounded-3xl bg-[#F7F6F2] text-[#142B52] p-6 sm:p-10"
            >
              <ContactForm dict={dict.contactPage.form} />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
