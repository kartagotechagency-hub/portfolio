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
    src: "/assets/images/scene-1-challenge.jpg",
    fromScale: 1.0,
    toScale: 1.08,
    fromX: 0,
    toX: -1.5,
  },
  {
    src: "/assets/images/scene-2-discovery.jpg",
    fromScale: 1.06,
    toScale: 1.0,
    fromX: -1.5,
    toX: 1.2,
  },
  {
    src: "/assets/images/scene-3-operations.jpg",
    fromScale: 1.0,
    toScale: 1.07,
    fromX: 1.2,
    toX: -1.0,
  },
  {
    src: "/assets/images/scene-3-transformation.jpg",
    fromScale: 1.06,
    toScale: 1.0,
    fromX: -1.0,
    toX: 1.0,
  },
  {
    src: "/assets/images/scene-4-growth.jpg",
    fromScale: 1.0,
    toScale: 1.06,
    fromX: 1.0,
    toX: 0,
  },
  {
    src: "/assets/images/scene-5-kartagotech.jpg",
    fromScale: 1.06,
    toScale: 1.0,
    fromX: 0,
    toX: 0,
  },
];

interface CommercialStoryProps {
  locale: Locale;
  dict: Dictionary;
}

export function CommercialStory({ locale, dict }: CommercialStoryProps) {
  const chapters = dict.home.story.chapters;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeScene, setActiveScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const { reducedMotion, isMobile } = useMediaPreferences();

  useEffect(() => {
    if (reducedMotion || isMobile || !wrapperRef.current || !pinnedRef.current) {
      return;
    }

    const total = chapters.length;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinnedRef.current,
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);

          const exact = p * (total - 1);
          const idx = Math.min(total - 1, Math.round(exact));
          setActiveScene(idx);

          // Continuous camera pan/zoom per scene
          imageRefs.current.forEach((el, i) => {
            if (!el) return;
            const scene = SCENES[i];
            const dist = Math.abs(exact - i);
            const opacity = Math.max(0, 1 - dist * 1.15);
            const localT = Math.max(0, Math.min(1, exact - i + 0.5));
            const scale =
              scene.fromScale + (scene.toScale - scene.fromScale) * localT;
            const x = scene.fromX + (scene.toX - scene.fromX) * localT;

            el.style.opacity = String(opacity);
            el.style.transform = `scale(${scale.toFixed(4)}) translate3d(${x.toFixed(2)}%, 0, 0)`;
          });
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [reducedMotion, isMobile, chapters.length]);

  const jumpToScene = (idx: number) => {
    setActiveScene(idx);
    if (!wrapperRef.current || isMobile || reducedMotion) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const docTop = window.scrollY + rect.top;
    const scrollable = wrapperRef.current.offsetHeight - window.innerHeight;
    const targetY = docTop + (scrollable * idx) / Math.max(1, chapters.length - 1);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  // Mobile or reduced-motion: clean sequential full-bleed commercial frames
  if (isMobile || reducedMotion) {
    return (
      <section className="bg-[#111318] text-white">
        {chapters.map((chapter, idx) => (
          <div
            key={chapter.index}
            className="relative min-h-[82vh] flex flex-col justify-end border-b border-white/10 overflow-hidden"
          >
            <Image
              src={SCENES[idx]?.src || SCENES[0].src}
              alt=""
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/45 to-[#111318]/30" />

            <div className="relative z-10 max-w-[1360px] w-full mx-auto px-5 py-12">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-2 h-2 bg-[#8291EA]" />
                <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#8291EA]">
                  {chapter.index} · {chapter.tag}
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight leading-[1.08] text-white mb-3">
                {chapter.title}
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl mb-6">
                {chapter.body}
              </p>
              {idx === chapters.length - 1 && (
                <Link
                  href={getLocalizedPath("/contact", locale)}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#8291EA] text-[#111318] font-medium text-sm"
                >
                  <span>{dict.home.hero.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </section>
    );
  }

  const current = chapters[activeScene] ?? chapters[0];

  return (
    <div
      ref={wrapperRef}
      className="relative bg-[#111318] text-white"
      style={{ height: `${chapters.length * 95}vh` }}
    >
      {/* Pinned Continuous Full-Screen Commercial Viewport */}
      <div
        ref={pinnedRef}
        className="relative h-screen w-full overflow-hidden flex flex-col justify-between"
      >
        {/* Cross-Fading Camera-Driven Photorealistic Scenes */}
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
              className="object-cover object-center"
            />
          </div>
        ))}

        {/* Cinematic Gradient Vignettes for Legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#111318]/85 via-[#111318]/35 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#111318]/92 via-transparent to-[#111318]/45 pointer-events-none"
          aria-hidden="true"
        />

        {/* Top Bar: Brand Identity + Scene Counter */}
        <div className="relative z-10 max-w-[1360px] w-full mx-auto px-8 lg:px-12 pt-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-[#8291EA]" />
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-white/80">
              {dict.home.hero.eyebrow}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {chapters.map((ch, idx) => {
              const isActive = activeScene === idx;
              return (
                <button
                  key={ch.index}
                  type="button"
                  onClick={() => jumpToScene(idx)}
                  className={`px-2.5 py-1 text-[11px] font-mono transition-colors border ${
                    isActive
                      ? "border-[#8291EA] bg-[#8291EA] text-[#111318] font-medium"
                      : "border-white/20 text-white/60 hover:text-white hover:border-white/50"
                  }`}
                >
                  {ch.index}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Editorial Story Overlay */}
        <div className="relative z-10 max-w-[1360px] w-full mx-auto px-8 lg:px-12 pb-12 lg:pb-16">
          <div className="grid grid-cols-12 gap-8 items-end">
            <div className="col-span-8">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#8291EA] mb-4">
                {current.index} / 0{chapters.length} — {current.tag}
              </p>

              <h1 className="font-display font-medium text-[clamp(2.4rem,4.7vw,4.5rem)] leading-[1.04] tracking-tightest text-white mb-5 max-w-3xl">
                {current.title}
              </h1>

              <p className="text-lg text-white/80 leading-relaxed max-w-2xl mb-7">
                {current.body}
              </p>

              <div className="flex items-center gap-4">
                {activeScene < chapters.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => jumpToScene(activeScene + 1)}
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
                  href="#services-section"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/25 bg-white/5 backdrop-blur-sm text-white font-medium text-sm tracking-wide hover:border-white hover:bg-white/10 transition-colors"
                >
                  <span>{dict.home.services.exploreServices}</span>
                </a>
              </div>
            </div>

            {/* Right: Minimal Commercial Progress Indicator */}
            <div className="col-span-4 flex flex-col items-end justify-end pb-1">
              <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/55 mb-3">
                {dict.home.hero.location}
              </p>
              <div className="w-48 h-[2px] bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-[#8291EA] transition-all duration-150"
                  style={{ width: `${Math.max(8, progress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
