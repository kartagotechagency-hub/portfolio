"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import type { Dictionary } from "@/lib/dictionaries";

gsap.registerPlugin(ScrollTrigger);

// Dedicated photorealistic 3D commercial scenes for Chapters 1–5
const CHAPTER_ENVS = [
  {
    src: "/assets/images/scene-1-challenge.jpg",
    grade: "brightness-95",
    position: "object-center",
  },
  {
    src: "/assets/images/scene-2-discovery.jpg",
    grade: "brightness-95",
    position: "object-center",
  },
  {
    src: "/assets/images/scene-3-transformation.jpg",
    grade: "brightness-95",
    position: "object-center",
  },
  {
    src: "/assets/images/scene-4-growth.jpg",
    grade: "brightness-95",
    position: "object-center",
  },
  {
    src: "/assets/images/scene-5-kartagotech.jpg",
    grade: "brightness-95",
    position: "object-center",
  },
];

interface TransformationStoryProps {
  dict: Dictionary["home"]["story"];
}

export function TransformationStory({ dict }: TransformationStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeChapter, setActiveChapter] = useState(0);
  const { reducedMotion } = useMediaPreferences();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
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

      if (stageRef.current) {
        gsap.fromTo(
          stageRef.current,
          { scale: 1.0 },
          {
            scale: 1.06,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const scrollToChapter = (idx: number) => {
    setActiveChapter(idx);
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
          {/* Left: 5 Commercial Story Chapters */}
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

          {/* Right: Sticky Cinematic Commercial Viewport (No floating abstract shapes) */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <div className="relative h-[380px] sm:h-[460px] lg:h-[580px] w-full overflow-hidden border border-white/12 bg-[#111318]">
              <div
                ref={stageRef}
                className="absolute inset-0 will-change-transform"
              >
                {CHAPTER_ENVS.map((env, idx) => (
                  <div
                    key={`${env.src}-${idx}`}
                    className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                      activeChapter === idx ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  >
                    <Image
                      src={env.src}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className={`object-cover ${env.position} ${env.grade}`}
                    />
                  </div>
                ))}
              </div>

              {/* Subtle cinematic vignette */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#111318]/90 via-transparent to-[#111318]/35 pointer-events-none"
                aria-hidden="true"
              />

              {/* Chapter Caption HUD */}
              <div className="absolute bottom-0 left-0 right-0 z-20 px-6 py-5 border-t border-white/12 bg-[#111318]/80 backdrop-blur-md">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.14em] mb-1.5">
                  <span className="text-[#8291EA]">
                    {dict.chapters[activeChapter]?.index} ·{" "}
                    {dict.chapters[activeChapter]?.tag}
                  </span>
                  <span className="text-white/45 hidden sm:inline">
                    KARTAGOTECH STORY
                  </span>
                </div>
                <p className="text-sm text-white/85 font-medium">
                  {dict.chapters[activeChapter]?.headline}
                </p>
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
