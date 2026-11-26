"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/MotionPrimitives";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

const FinaleScene = dynamic(() => import("@/components/scenes/FinaleScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-transparent" />,
});

gsap.registerPlugin(ScrollTrigger);

interface FinaleStoryProps {
  locale: Locale;
  dict: Dictionary;
}

export function FinaleStory({ locale, dict }: FinaleStoryProps) {
  const containerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMediaPreferences();

  useEffect(() => {
    if (reducedMotion || !containerRef.current || !bgRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { yPercent: -8, scale: 1.05 },
        {
          yPercent: 8,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "center top",
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={containerRef} className="relative bg-[#111318] overflow-hidden">
      {/* Upper dark cinematic architectural transition */}
      <div className="relative h-56 sm:h-72 lg:h-80 w-full overflow-hidden">
        <div
          ref={bgRef}
          className="absolute inset-0 pointer-events-none will-change-transform"
          aria-hidden="true"
        >
          <Image
            src="/assets/images/finale-bg.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-80"
          />
        </div>
        <FinaleScene />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#111318]/85 via-transparent to-[#F5F5F2] pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Clean Off-White Contact Resolution */}
      <div className="relative z-10 bg-[#F5F5F2] text-[#111318] py-20 sm:py-28 border-t border-[#111318]/10">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-4">
              {dict.home.contactCta.label}
            </p>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              <div>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tightest leading-[1.04] text-[#111318] max-w-3xl mb-5">
                  {dict.home.contactCta.headline}
                </h2>
                <a
                  href={`mailto:${dict.contactPage.emailValue}`}
                  className="text-sm font-mono text-[#777777] hover:text-[#8291EA] transition-colors"
                >
                  {dict.contactPage.emailValue}
                </a>
              </div>

              <Link
                href={getLocalizedPath("/contact", locale)}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#8291EA] text-[#111318] font-medium text-sm tracking-wide hover:bg-[#6e7fe3] transition-colors shrink-0"
              >
                <span>{dict.home.contactCta.button}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
