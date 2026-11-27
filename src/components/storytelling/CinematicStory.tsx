"use client";

/**
 * CinematicStory — full-viewport 5-chapter scroll experience.
 *
 * Layout:
 *  - A single tall scroll container (5 × 120 vh) that pins the viewport
 *    via GSAP ScrollTrigger while the user scrolls through each chapter.
 *  - Each chapter: image fills viewport (object-cover), text fades/slides in,
 *    subtle Ken-Burns zoom on the image layer.
 *  - Chapter progress rail on the right; click to jump.
 *  - Contact section below the story (unpinned, normal flow).
 */

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Mail } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

/* ─────────────────────── chapter data ─────────────────────── */

interface Chapter {
  id: string;
  index: string;
  tag: { en: string; fr: string };
  headline: { en: string; fr: string };
  body: { en: string; fr: string };
  image: string;
  /** dominant overlay gradient direction */
  gradientFrom: "left" | "right" | "bottom";
  /** text alignment */
  textSide: "left" | "right";
}

const CHAPTERS: Chapter[] = [
  {
    id: "challenge",
    index: "01",
    tag: { en: "THE CHALLENGE", fr: "LE DÉFI" },
    headline: {
      en: "Every growing business\nhits a wall.",
      fr: "Toute entreprise en croissance\ntouche un plafond.",
    },
    body: {
      en: "More customers, more complexity. Manual processes slow you down, errors multiply and your team spends its energy on the wrong things.",
      fr: "Plus de clients, plus de complexité. Les processus manuels ralentissent tout, les erreurs s'accumulent et votre équipe perd son énergie sur ce qui ne devrait pas l'occuper.",
    },
    image: "/images/story/story-01-challenge.png",
    gradientFrom: "right",
    textSide: "left",
  },
  {
    id: "opportunity",
    index: "02",
    tag: { en: "THE OPPORTUNITY", fr: "L'OPPORTUNITÉ" },
    headline: {
      en: "Technology is no longer\nan advantage — it's a necessity.",
      fr: "La technologie n'est plus\nun avantage — c'est une nécessité.",
    },
    body: {
      en: "AI, automation and intelligent software can remove friction, reclaim your time and give you the clarity to make better decisions.",
      fr: "L'IA, l'automatisation et les logiciels intelligents peuvent supprimer les frictions, vous redonner du temps et la clarté pour prendre de meilleures décisions.",
    },
    image: "/images/story/story-02-opportunity.png",
    gradientFrom: "left",
    textSide: "right",
  },
  {
    id: "transformation",
    index: "03",
    tag: { en: "THE TRANSFORMATION", fr: "LA TRANSFORMATION" },
    headline: {
      en: "Your team, amplified\nby the right tools.",
      fr: "Votre équipe, amplifiée\npar les bons outils.",
    },
    body: {
      en: "Connected systems, automated workflows and digital platforms free your team to focus on what actually creates value.",
      fr: "Des systèmes connectés, des flux automatisés et des plateformes digitales libèrent votre équipe pour se concentrer sur ce qui crée réellement de la valeur.",
    },
    image: "/images/story/story-03-transformation.png",
    gradientFrom: "right",
    textSide: "left",
  },
  {
    id: "growth",
    index: "04",
    tag: { en: "THE GROWTH", fr: "LA CROISSANCE" },
    headline: {
      en: "New possibilities\nopen at every level.",
      fr: "De nouvelles opportunités\ns'ouvrent à chaque étape.",
    },
    body: {
      en: "Stronger customer experiences, faster operations, new revenue opportunities — all made possible when your business runs on a solid digital foundation.",
      fr: "Une meilleure expérience client, des opérations plus rapides, de nouvelles sources de revenus — tout cela devient possible quand votre entreprise repose sur des bases digitales solides.",
    },
    image: "/images/story/story-04-growth.png",
    gradientFrom: "left",
    textSide: "right",
  },
  {
    id: "future",
    index: "05",
    tag: { en: "THE FUTURE", fr: "L'AVENIR" },
    headline: {
      en: "Build what comes next.\nWith the right partner.",
      fr: "Construisez ce qui vient ensuite.\nAvec le bon partenaire.",
    },
    body: {
      en: "KartagoTech brings together custom software, AI and automation to help your business move forward — confidently, at scale.",
      fr: "KartagoTech réunit logiciels sur mesure, IA et automatisation pour aider votre entreprise à avancer — avec confiance et à grande échelle.",
    },
    image: "/images/story/story-05-future.png",
    gradientFrom: "bottom",
    textSide: "left",
  },
];

/* ─────────────────────── overlay gradient ─────────────────── */

function overlayClass(from: Chapter["gradientFrom"]): string {
  if (from === "left")
    return "bg-gradient-to-r from-black/80 via-black/40 to-transparent";
  if (from === "right")
    return "bg-gradient-to-l from-black/80 via-black/40 to-transparent";
  return "bg-gradient-to-t from-black/80 via-black/40 to-transparent";
}

/* ─────────────────────── progress rail ────────────────────── */

interface ProgressRailProps {
  chapters: Chapter[];
  activeIndex: number;
  onJump: (i: number) => void;
  locale: Locale;
}

function ProgressRail({ chapters, activeIndex, onJump, locale }: ProgressRailProps) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 items-end pointer-events-auto select-none">
      {chapters.map((ch, i) => (
        <button
          key={ch.id}
          onClick={() => onJump(i)}
          aria-label={ch.tag[locale]}
          className="group flex items-center gap-2.5 cursor-pointer"
        >
          {/* label — visible on hover */}
          <span
            className={`text-[9px] font-mono tracking-[0.18em] uppercase transition-all duration-300 ${
              i === activeIndex
                ? "opacity-100 text-white"
                : "opacity-0 group-hover:opacity-60 text-white/70"
            }`}
          >
            {ch.tag[locale]}
          </span>
          {/* dot */}
          <span
            className={`block rounded-full transition-all duration-400 ${
              i === activeIndex
                ? "w-2.5 h-2.5 bg-[#8291EA]"
                : "w-1.5 h-1.5 bg-white/30 group-hover:bg-white/60"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────── chapter text overlay ─────────────── */

interface ChapterTextProps {
  chapter: Chapter;
  locale: Locale;
  isActive: boolean;
}

function ChapterText({ chapter, locale, isActive }: ChapterTextProps) {
  const side = chapter.textSide;
  return (
    <div
      className={`absolute inset-0 flex items-end pb-20 md:pb-28 px-6 md:px-16 lg:px-24 pointer-events-none z-20 ${
        side === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-lg transition-all duration-700 ease-out ${
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        } ${side === "right" ? "text-right" : "text-left"}`}
      >
        {/* chapter index + tag */}
        <div
          className={`flex items-center gap-3 mb-5 ${
            side === "right" ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#8291EA]">
            {chapter.index} / {String(CHAPTERS.length).padStart(2, "0")}
          </span>
          <span className="w-8 h-px bg-[#8291EA]/60" />
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-white/60">
            {chapter.tag[locale]}
          </span>
        </div>

        {/* headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight text-white mb-5 whitespace-pre-line">
          {chapter.headline[locale]}
        </h2>

        {/* body */}
        <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-sm">
          {chapter.body[locale]}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────── main component ───────────────────── */

interface CinematicStoryProps {
  locale: Locale;
  dict: Dictionary;
}

export function CinematicStory({ locale, dict }: CinematicStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [gsapReady, setGsapReady] = useState(false);

  /* ── GSAP ScrollTrigger pin + scrub ── */
  useEffect(() => {
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      setGsapReady(true);

      const container = containerRef.current;
      const sticky = stickyRef.current;
      if (!container || !sticky) return;

      const totalChapters = CHAPTERS.length;

      ctx = gsap.context(() => {
        // Pin the sticky viewport for the full scroll distance
        ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: () => `+=${container.offsetHeight - window.innerHeight}`,
          pin: sticky,
          pinSpacing: false,
          anticipatePin: 1,
          onUpdate: (self) => {
            const rawChapter = self.progress * totalChapters;
            const idx = Math.min(
              Math.floor(rawChapter),
              totalChapters - 1
            );
            setActiveChapter(idx);

            // Ken-Burns zoom on the active image layer
            const layers = sticky.querySelectorAll<HTMLDivElement>(
              "[data-chapter-layer]"
            );
            layers.forEach((layer, i) => {
              const chProgress =
                i === idx
                  ? rawChapter - idx // 0→1 within chapter
                  : i < idx
                  ? 1
                  : 0;

              // fade
              const opacity = i === idx ? 1 : i === idx - 1 ? 1 - (rawChapter - idx + 1) : 0;
              layer.style.opacity = String(Math.max(0, Math.min(1, i === idx ? 1 : i === idx - 1 ? Math.max(0, 1 - (rawChapter - (i + 1))) : 0)));

              // subtle zoom 1 → 1.06
              const scale = 1 + chProgress * 0.06;
              const img = layer.querySelector<HTMLElement>("img");
              if (img) img.style.transform = `scale(${scale})`;
            });
          },
        });
      }, container);
    })();

    return () => ctx?.revert();
  }, []);

  /* ── jump to chapter ── */
  const handleJump = (i: number) => {
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    if (!container) return;

    const totalHeight = container.offsetHeight - window.innerHeight;
    const targetScroll =
      container.offsetTop +
      (i / CHAPTERS.length) * totalHeight +
      1; // +1 to push into chapter band

    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  /* ── reduced-motion fallback: static grid ── */
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  if (reducedMotion) {
    return (
      <div className="bg-[#111318]">
        {CHAPTERS.map((ch) => (
          <section
            key={ch.id}
            className="relative min-h-screen flex items-end pb-24"
          >
            <Image
              src={ch.image}
              alt={ch.tag[locale]}
              fill
              className="object-cover object-center"
              priority
            />
            <div className={`absolute inset-0 ${overlayClass(ch.gradientFrom)}`} />
            <ChapterText chapter={ch} locale={locale} isActive />
          </section>
        ))}
        {/* contact */}
        <ContactSection locale={locale} dict={dict} />
      </div>
    );
  }

  return (
    <>
      {/* ─── progress rail (outside scroll container for fixed positioning) ─── */}
      <ProgressRail
        chapters={CHAPTERS}
        activeIndex={activeChapter}
        onJump={handleJump}
        locale={locale}
      />

      {/* ─── scroll container: tall enough for 5 chapters × 120vh ─── */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${CHAPTERS.length * 120}vh` }}
      >
        {/* sticky viewport */}
        <div
          ref={stickyRef}
          className="sticky top-0 h-screen w-full overflow-hidden bg-black"
          style={{ willChange: "transform" }}
        >
          {/* image layers (stacked, z-indexed by opacity) */}
          {CHAPTERS.map((ch, i) => (
            <div
              key={ch.id}
              data-chapter-layer={i}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <Image
                src={ch.image}
                alt={ch.tag[locale]}
                fill
                className="object-cover object-center transition-transform duration-[1200ms] ease-out"
                style={{ transformOrigin: "center center" }}
                priority={i === 0}
              />
              <div className={`absolute inset-0 ${overlayClass(ch.gradientFrom)}`} />
              {/* always render text; visibility driven by activeChapter state */}
              <ChapterText
                chapter={ch}
                locale={locale}
                isActive={activeChapter === i}
              />
            </div>
          ))}

          {/* scroll hint (chapter 0 only) */}
          {activeChapter === 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 opacity-70 animate-bounce">
              <ArrowDown className="w-4 h-4 text-white" />
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/60">
                scroll
              </span>
            </div>
          )}

          {/* chapter index (large, background) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 select-none pointer-events-none">
            <span className="text-[20vw] font-black text-white/[0.03] leading-none">
              {String(activeChapter + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* ─── post-story sections ─── */}
      <WhatWeDoSection locale={locale} dict={dict} />
      <ContactSection locale={locale} dict={dict} />
    </>
  );
}

/* ─────────────────────── What We Do section ───────────────── */

const CAPABILITIES = [
  {
    index: "01",
    en: { title: "Custom Software", body: "Bespoke applications, platforms and SaaS products built for real operational workflows." },
    fr: { title: "Logiciels Sur Mesure", body: "Applications, plateformes et produits SaaS conçus autour de vos flux opérationnels réels." },
  },
  {
    index: "02",
    en: { title: "AI & Intelligent Systems", body: "AI assistants, smart integrations and decision-support tools that work within your existing stack." },
    fr: { title: "IA & Systèmes Intelligents", body: "Assistants IA, intégrations intelligentes et outils d'aide à la décision qui s'intègrent à votre stack existant." },
  },
  {
    index: "03",
    en: { title: "Automation & RPA", body: "Workflow automation and robotic process automation that eliminate repetitive manual tasks." },
    fr: { title: "Automatisation & RPA", body: "Automatisation des workflows et des processus robotisés pour éliminer les tâches manuelles répétitives." },
  },
  {
    index: "04",
    en: { title: "Digital Transformation", body: "Connected systems, modern infrastructure and strategic guidance for businesses moving forward." },
    fr: { title: "Transformation Digitale", body: "Systèmes connectés, infrastructure moderne et accompagnement stratégique pour les entreprises en mouvement." },
  },
];

function WhatWeDoSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = locale === "fr";
  return (
    <section id="services" className="bg-[#111318] text-white py-28 md:py-36 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* eyebrow */}
        <div className="flex items-center gap-4 mb-14">
          <span className="w-8 h-px bg-[#8291EA]" />
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#8291EA]">
            {t ? "Ce que nous faisons" : "What We Do"}
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-light text-white mb-6 leading-tight max-w-2xl">
          {t
            ? "Nous bâtissons des systèmes digitaux qui font avancer les entreprises."
            : "We build digital systems that move businesses forward."}
        </h2>
        <p className="text-sm md:text-base text-white/50 max-w-lg mb-20 leading-relaxed">
          {t
            ? "KartagoTech est une agence technologique internationale spécialisée dans le logiciel sur mesure, l'IA et l'automatisation."
            : "KartagoTech is an international technology agency specialising in custom software, AI and automation."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/8 border border-white/8">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.index}
              className="bg-[#111318] p-8 md:p-10 hover:bg-white/[0.03] transition-colors duration-300 group"
            >
              <span className="text-[9px] font-mono tracking-[0.22em] text-[#8291EA] mb-4 block">
                {cap.index}
              </span>
              <h3 className="text-lg font-medium text-white mb-3 group-hover:text-[#8291EA] transition-colors">
                {cap[locale].title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {cap[locale].body}
              </p>
            </div>
          ))}
        </div>

        {/* links */}
        <div className="flex flex-wrap gap-6 mt-12">
          <Link
            href={getLocalizedPath("/services", locale)}
            className="flex items-center gap-2 text-sm text-white hover:text-[#8291EA] transition-colors group"
          >
            <span>{t ? "Voir nos services" : "View all services"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={getLocalizedPath("/work", locale)}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors group"
          >
            <span>{t ? "Voir nos projets" : "See our work"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Contact section ───────────────────── */

function ContactSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = locale === "fr";
  const c = dict.contactPage;
  return (
    <section
      id="contact"
      className="bg-black text-white py-28 md:py-36 px-6 md:px-16 lg:px-24 border-t border-white/8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-14">
          <span className="w-8 h-px bg-[#8291EA]" />
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#8291EA]">
            {t ? "Contactez-nous" : "Get in touch"}
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-3xl md:text-4xl font-light leading-tight text-white mb-6">
              {t
                ? "Un défi à relever ?\nParlons-en."
                : "Have a business\nchallenge? Let's talk."}
            </h2>
            <p className="text-sm text-white/50 leading-relaxed mb-10 max-w-sm">
              {t
                ? "Présentez-nous votre projet. Chaque demande est lue avec attention."
                : "Tell us about your project. Every enquiry is read with attention."}
            </p>
            <div className="flex items-start gap-3 p-4 border border-white/10 bg-white/[0.03]">
              <Mail className="w-4 h-4 text-[#8291EA] shrink-0 mt-1" />
              <div>
                <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-white/40 mb-1">
                  {t ? "Contact direct" : "Direct contact"}
                </p>
                <a
                  href={`mailto:${c.emailValue}`}
                  className="text-sm font-medium text-white hover:text-[#8291EA] transition-colors break-all"
                >
                  {c.emailValue}
                </a>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <ContactForm dict={c.form} />
          </div>
        </div>
      </div>
    </section>
  );
}
