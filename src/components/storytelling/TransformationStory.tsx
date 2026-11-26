"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import type { Dictionary } from "@/lib/dictionaries";

const TransformationScene = dynamic(
  () => import("@/components/scenes/TransformationScene"),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#111318]" />,
  }
);

gsap.registerPlugin(ScrollTrigger);

// Map each of the 5 chapters to our cinematic architectural backdrops
const CHAPTER_BACKDROPS = [
  "/assets/images/hero-bg.jpg", // 01: Dim architectural corridor (The Challenge)
  "/assets/images/vision-bg.jpg", // 02: Intelligence lattice entering (The Opportunity)
  "/assets/images/vision-bg.jpg", // 03: Connected systems active (The Transformation)
  "/assets/images/about-office.jpg", // 04: Clean bright modern studio (The Growth)
  "/assets/images/finale-bg.jpg", // 05: Ascending horizon (The Future)
];

interface TransformationStoryProps {
  dict: Dictionary["home"]["story"];
}

export function TransformationStory({ dict }: TransformationStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const chapterRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressRef = useRef<number>(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const { reducedMotion } = useMediaPreferences();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) {
      progressRef.current = 0.65;
      return;
    }

    const ctx = gsap.context(() => {
      // Overall 0 -> 1 scrub across the entire 5-chapter story
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        end: "bottom 40%",
        scrub: 0.5,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      // Individual chapter activation triggers
      chapterRefs.current.forEach((el, idx) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => setActiveChapter(idx),
          onEnterBack: () => setActiveChapter(idx),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const scrollToChapter = (idx: number) => {
    setActiveChapter(idx);
    progressRef.current = idx / Math.max(1, dict.chapters.length - 1);
    chapterRefs.current[idx]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
  };

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative bg-[#111318] text-white border-b border-white/10"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        {/* Section Eyebrow & Chapter Progress Rail */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-12 border-b border-white/12">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#8291EA]">
            {dict.sectionLabel}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {dict.chapters.map((ch, idx) => {
              const isActive = activeChapter === idx;
              return (
                <button
                  key={ch.index}
                  type="button"
                  onClick={() => scrollToChapter(idx)}
                  className={`px-3 py-1 text-[11px] font-mono uppercase tracking-[0.12em] border transition-colors ${
                    isActive
                      ? "border-[#8291EA] bg-[#8291EA] text-[#111318] font-medium"
                      : "border-white/15 text-white/50 hover:text-white hover:border-white/35"
                  }`}
                >
                  {ch.index}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Left: 5 Narrative Chapters */}
          <div className="lg:col-span-5 space-y-24 sm:space-y-32 py-4 lg:py-12">
            {dict.chapters.map((chapter, idx) => {
              const isActive = activeChapter === idx;
              return (
                <article
                  key={chapter.index}
                  ref={(el) => {
                    chapterRefs.current[idx] = el as HTMLDivElement | null;
                  }}
                  onClick={() => setActiveChapter(idx)}
                  className={`transition-opacity duration-500 cursor-pointer border-l-2 pl-6 sm:pl-8 ${
                    isActive
                      ? "opacity-100 border-[#8291EA]"
                      : "opacity-45 hover:opacity-80 border-white/15"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono text-[#8291EA]">
                      {chapter.index}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-[0.16em] text-white/60">
                      {chapter.tag}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-[1.12] text-white mb-4">
                    {chapter.title}
                  </h2>

                  <p className="text-base font-medium text-[#8291EA] mb-4">
                    {chapter.headline}
                  </p>

                  <p className="text-base text-white/70 leading-relaxed mb-6">
                    {chapter.body}
                  </p>

                  <ul className="space-y-2 pt-4 border-t border-white/10">
                    {chapter.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-xs font-mono text-white/75"
                      >
                        <span className="w-1.5 h-1.5 bg-[#8291EA] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          {/* Right: Sticky Persistent 3D Transformation Stage */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <div className="relative h-[380px] sm:h-[460px] lg:h-[580px] w-full overflow-hidden border border-white/12 bg-[#111318]">
              {/* Cross-fading AI-Generated Architectural Backdrops */}
              {CHAPTER_BACKDROPS.map((src, idx) => (
                <div
                  key={`${src}-${idx}`}
                  className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                    activeChapter === idx ? "opacity-40" : "opacity-0"
                  }`}
                  aria-hidden="true"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center"
                  />
                </div>
              ))}

              {/* Atmospheric gradient overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/35 to-[#111318]/65 pointer-events-none"
                aria-hidden="true"
              />

              {/* Interactive 3D Business Environment Diorama */}
              <div className="relative z-10 w-full h-full">
                <TransformationScene progressRef={progressRef} />
              </div>

              {/* Stage HUD Footer */}
              <div className="absolute bottom-0 left-0 right-0 z-20 px-5 py-3.5 border-t border-white/12 bg-[#111318]/80 backdrop-blur-sm flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.14em]">
                <span className="text-[#8291EA]">
                  {dict.chapters[activeChapter]?.index} ·{" "}
                  {dict.chapters[activeChapter]?.tag}
                </span>
                <span className="text-white/50 hidden sm:inline">
                  3D TRANSFORMATION STAGE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth architectural transition into Off-White Agency Showcase */}
      <div
        className="h-16 bg-gradient-to-b from-[#111318] to-[#F5F5F2] pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
