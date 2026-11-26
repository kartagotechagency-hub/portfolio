"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight } from "lucide-react";
import { HeroReveal } from "@/components/MotionPrimitives";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

gsap.registerPlugin(ScrollTrigger);

interface HeroStoryProps {
  locale: Locale;
  dict: Dictionary;
}

export function HeroStory({ locale, dict }: HeroStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMediaPreferences();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !bgRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { scale: 1.0, yPercent: 0 },
        {
          yPercent: 12,
          scale: 1.09,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100vh-5rem)] bg-[#111318] text-white overflow-hidden flex flex-col justify-between border-b border-white/10"
    >
      {/* Cinematic Architectural Environment with Smooth Scroll-Driven Camera Push */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none will-change-transform"
        aria-hidden="true"
      >
        <Image
          src="/assets/images/hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-85"
        />
      </div>

      {/* Editorial Vignette for crisp typography contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#111318]/92 via-[#111318]/55 to-[#111318]/20 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-[#111318]/45 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1360px] w-full mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20 flex-1 flex flex-col justify-between">
        <div>
          <HeroReveal>
            <div className="flex items-center gap-2.5 mb-8 sm:mb-10">
              <span className="w-2 h-2 bg-[#8291EA]" />
              <span className="text-xs font-mono uppercase tracking-[0.18em] text-white/70">
                {dict.home.hero.eyebrow}
              </span>
            </div>
          </HeroReveal>

          <HeroReveal delay={0.1}>
            <h1 className="font-display font-medium text-[clamp(2.75rem,6.5vw,5.75rem)] leading-[1.01] tracking-tightest text-white max-w-4xl">
              <span className="block">{dict.home.hero.headlineLine1}</span>
              <span className="block text-white/95">
                {dict.home.hero.headlineLine2}
              </span>
            </h1>
          </HeroReveal>

          <HeroReveal delay={0.2}>
            <p className="mt-8 sm:mt-10 text-lg sm:text-xl text-white/75 leading-relaxed max-w-xl">
              {dict.home.hero.supporting}
            </p>
          </HeroReveal>

          <HeroReveal delay={0.28}>
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href="#story"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 bg-[#8291EA] text-[#111318] font-medium text-sm tracking-wide hover:bg-[#6e7fe3] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>{dict.home.hero.exploreCta}</span>
                <ArrowDown className="w-4 h-4" />
              </a>
              <Link
                href={getLocalizedPath("/contact", locale)}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 border border-white/25 bg-white/5 backdrop-blur-sm text-white font-medium text-sm tracking-wide hover:border-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8291EA]"
              >
                <span>{dict.home.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </HeroReveal>
        </div>

        <HeroReveal delay={0.35}>
          <div className="mt-14 pt-6 border-t border-white/12 flex items-center justify-between text-xs font-mono uppercase tracking-[0.16em] text-white/55">
            <span>{dict.home.hero.location}</span>
            <span className="hidden sm:inline text-[#8291EA]">
              ↓ {dict.home.hero.scrollLabel}
            </span>
          </div>
        </HeroReveal>
      </div>
    </section>
  );
}
