"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  {
    src: "/assets/images/story-01-challenge.png",
    objectPos: "object-[center_18%]",
    fromScale: 1.0,
    toScale: 1.07,
    fromX: 0,
    toX: -1.0,
  },
  {
    src: "/assets/images/story-02-opportunity.png",
    objectPos: "object-[center_18%]",
    fromScale: 1.06,
    toScale: 1.0,
    fromX: -1.0,
    toX: 1.0,
  },
  {
    src: "/assets/images/story-03-transformation.png",
    objectPos: "object-[center_14%]",
    fromScale: 1.0,
    toScale: 1.07,
    fromX: 1.0,
    toX: -0.8,
  },
  {
    src: "/assets/images/story-04-growth.png",
    objectPos: "object-[center_14%]",
    fromScale: 1.06,
    toScale: 1.0,
    fromX: -0.8,
    toX: 0.8,
  },
  {
    src: "/assets/images/story-05-future.png",
    objectPos: "object-[center_18%]",
    fromScale: 1.0,
    toScale: 1.05,
    fromX: 0.8,
    toX: 0,
  },
];

interface CommercialStoryProps {
  locale: Locale;
  dict: Dictionary;
}

export function CommercialStory({ locale, dict }: CommercialStoryProps) {
  const chapters = dict.home.story.chapters;
  const runwayRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const textRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const { reducedMotion, isMobile } = useMediaPreferences();

  useEffect(() => {
    if (reducedMotion || isMobile || !runwayRef.current) {
      return;
    }

    const total = chapters.length;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: runwayRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => {
          const p = self.progress;
          const exact = p * (total - 1);
          const idx = Math.min(total - 1, Math.round(exact));
          setActiveScene(idx);

          if (progressBarRef.current) {
            progressBarRef.current.style.height = `${Math.max(8, p * 100)}%`;
          }

          // Smooth overlapping cross-dissolves & camera push/pan
          imageRefs.current.forEach((el, i) => {
            if (!el) return;
            const scene = SCENES[i];
            if (!scene) return;
            const dist = Math.abs(exact - i);
            const opacity = Math.max(0, 1 - dist * 1.12);
            const localT = Math.max(0, Math.min(1, exact - i + 0.5));
            const scale =
              scene.fromScale + (scene.toScale - scene.fromScale) * localT;
            const x = scene.fromX + (scene.toX - scene.fromX) * localT;

            el.style.opacity = String(opacity);
            el.style.transform = `scale(${scale.toFixed(4)}) translate3d(${x.toFixed(2)}%, 0, 0)`;
          });

          // Progressive text reveal per chapter
          textRefs.current.forEach((el, i) => {
            if (!el) return;
            const dist = Math.abs(exact - i);
            const textOpacity = Math.max(0, 1 - dist * 2.1);
            const signedOffset = (exact - i) * -28;
            el.style.opacity = String(textOpacity);
            el.style.transform = `translate3d(0, ${signedOffset.toFixed(1)}px, 0)`;
            el.style.pointerEvents = textOpacity > 0.4 ? "auto" : "none";
          });
        },
      });
    }, runwayRef);

    return () => ctx.revert();
  }, [reducedMotion, isMobile, chapters.length]);

  const jumpToScene = (idx: number) => {
    setActiveScene(idx);
    if (!runwayRef.current) return;
    if (isMobile || reducedMotion) {
      const target = document.getElementById(`story-chapter-${idx}`);
      target?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      return;
    }
    const rect = runwayRef.current.getBoundingClientRect();
    const docTop = window.scrollY + rect.top;
    const scrollable = runwayRef.current.offsetHeight - window.innerHeight;
    const targetY =
      docTop + (scrollable * idx) / Math.max(1, chapters.length - 1);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  // Mobile or reduced-motion: sequential full-bleed 92vh chapters (no broken desktop scrub)
  if (isMobile || reducedMotion) {
    return (
      <section className="bg-[#111318] text-white">
        {chapters.map((chapter, idx) => {
          const scene = SCENES[idx] ?? SCENES[0];
          const isLast = idx === chapters.length - 1;
          return (
            <article
              id={`story-chapter-${idx}`}
              key={chapter.index}
              className="relative min-h-[92vh] flex flex-col justify-end border-b border-white/10 overflow-hidden"
            >
              <Image
                src={scene.src}
                alt={`${chapter.index} — ${chapter.tag}`}
                fill
                priority={idx === 0}
                sizes="100vw"
                className={`object-cover ${scene.objectPos}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/45 to-[#111318]/25" />

              <div className="relative z-10 max-w-[1360px] w-full mx-auto px-5 sm:px-8 py-14">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-2 h-2 bg-[#8291EA]" />
                  <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#8291EA]">
                    {chapter.index} / 0{chapters.length} · {chapter.tag}
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight leading-[1.08] text-white mb-3">
                  {chapter.title}
                </h2>
                <p className="text-base text-white/85 leading-relaxed max-w-xl mb-6">
                  {chapter.headline}
                </p>
                {isLast ? (
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={getLocalizedPath("/contact", locale)}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#8291EA] text-[#111318] font-medium text-sm"
                    >
                      <span>{dict.home.hero.primaryCta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href="#agency-overview"
                      className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/30 bg-[#111318]/50 text-white font-medium text-sm"
                    >
                      <span>{dict.home.services.exploreServices}</span>
                      <ArrowDown className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => jumpToScene(idx + 1)}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-[#8291EA]"
                  >
                    <span>{dict.home.hero.scrollLabel}</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>
    );
  }

  return (
    <div
      ref={runwayRef}
      className="relative bg-[#111318] text-white"
      style={{ height: `${chapters.length * 120}vh` }}
    >
      {/* Native CSS Sticky 100vh Film Viewport — Zero Scroll Hijacking */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Layer 1: Continuous Cross-Dissolving Photorealistic Scenes */}
        {SCENES.map((scene, idx) => (
          <div
            key={scene.src}
            ref={(el) => {
              imageRefs.current[idx] = el;
            }}
            className="absolute inset-0 will-change-transform pointer-events-none"
            style={{
              opacity: idx === 0 ? 1 : 0,
              transform: `scale(${scene.fromScale})`,
            }}
            aria-hidden="true"
          >
            <Image
              src={scene.src}
              alt=""
              fill
              priority={idx < 2}
              sizes="100vw"
              className={`object-cover ${scene.objectPos}`}
            />
          </div>
        ))}

        {/* Cinematic Gradient Vignettes */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#111318]/88 via-[#111318]/32 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#111318]/94 via-[#111318]/20 to-[#111318]/35 pointer-events-none"
          aria-hidden="true"
        />

        {/* Top Film Header */}
        <div className="relative z-20 max-w-[1360px] w-full mx-auto px-8 lg:px-12 pt-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-[#8291EA]" />
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-white/85">
              {dict.home.hero.eyebrow}
            </span>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/60">
            {dict.home.hero.location}
          </span>
        </div>

        {/* Right Vertical Chapter Progress Rail */}
        <nav
          aria-label="Story chapters"
          className="hidden md:flex flex-col items-end gap-3 absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 z-30"
        >
          <div className="w-[2px] h-24 bg-white/15 relative mb-2 overflow-hidden">
            <div
              ref={progressBarRef}
              className="w-full bg-[#8291EA] absolute top-0 left-0"
              style={{ height: "12%" }}
            />
          </div>
          {chapters.map((ch, idx) => {
            const isActive = activeScene === idx;
            return (
              <button
                key={ch.index}
                type="button"
                onClick={() => jumpToScene(idx)}
                className={`group flex items-center gap-3 text-right transition-all ${
                  isActive ? "opacity-100" : "opacity-45 hover:opacity-85"
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/80 hidden lg:inline">
                  {ch.tag}
                </span>
                <span
                  className={`w-7 h-7 flex items-center justify-center text-[11px] font-mono border transition-colors ${
                    isActive
                      ? "border-[#8291EA] bg-[#8291EA] text-[#111318] font-medium"
                      : "border-white/25 bg-[#111318]/40 text-white"
                  }`}
                >
                  {ch.index}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Progressive Scroll-Driven Text Layers (One per Chapter) */}
        <div className="absolute inset-x-0 bottom-0 z-20 max-w-[1360px] mx-auto px-8 lg:px-12 pb-12 lg:pb-16">
          <div className="relative min-h-[260px] lg:min-h-[280px] flex items-end">
            {chapters.map((chapter, idx) => {
              const isLast = idx === chapters.length - 1;
              return (
                <div
                  key={chapter.index}
                  ref={(el) => {
                    textRefs.current[idx] = el;
                  }}
                  className="absolute bottom-0 left-0 max-w-3xl will-change-transform"
                  style={{
                    opacity: idx === 0 ? 1 : 0,
                    pointerEvents: idx === 0 ? "auto" : "none",
                  }}
                >
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#8291EA] mb-3">
                    {chapter.index} / 0{chapters.length} — {chapter.tag}
                  </p>

                  {idx === 0 ? (
                    <h1 className="font-display font-medium text-[clamp(2.4rem,4.5vw,4.3rem)] leading-[1.04] tracking-tightest text-white mb-4">
                      {chapter.title}
                    </h1>
                  ) : (
                    <h2 className="font-display font-medium text-[clamp(2.25rem,4.2vw,4rem)] leading-[1.05] tracking-tightest text-white mb-4">
                      {chapter.title}
                    </h2>
                  )}

                  <p className="text-lg text-white/90 leading-relaxed max-w-2xl mb-3">
                    {chapter.headline}
                  </p>
                  <p className="text-sm sm:text-base text-white/65 leading-relaxed max-w-xl mb-7">
                    {chapter.body}
                  </p>

                  <div className="flex items-center gap-4">
                    {!isLast ? (
                      <button
                        type="button"
                        onClick={() => jumpToScene(idx + 1)}
                        className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#8291EA] text-[#111318] font-medium text-sm tracking-wide hover:bg-[#6e7fe3] transition-colors"
                      >
                        <span>{dict.home.hero.scrollLabel}</span>
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    ) : (
                      <Link
                        href={getLocalizedPath("/contact", locale)}
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#8291EA] text-[#111318] font-medium text-sm tracking-wide hover:bg-[#6e7fe3] transition-colors"
                      >
                        <span>{dict.home.hero.primaryCta}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}

                    <a
                      href="#agency-overview"
                      className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/30 bg-[#111318]/45 backdrop-blur-sm text-white font-medium text-sm tracking-wide hover:border-white hover:bg-white/10 transition-colors"
                    >
                      <span>{dict.home.services.exploreServices}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
