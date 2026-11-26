"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import type { Dictionary } from "@/lib/dictionaries";

gsap.registerPlugin(ScrollTrigger);

interface ApproachStoryProps {
  dict: Dictionary["home"]["approach"];
}

export function ApproachStory({ dict }: ApproachStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { reducedMotion } = useMediaPreferences();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (progressLineRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              end: "bottom 55%",
              scrub: 0.5,
            },
          }
        );
      }

      stepRefs.current.forEach((el, idx) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0.25, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: idx * 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 lg:py-32 bg-[#111318] text-white swiss-grid-bg-dark overflow-hidden"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-14 sm:mb-16">
          <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-3">
            {dict.label}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-editorial leading-[1.1] text-white mb-5">
            {dict.title}
          </h2>
          <p className="text-white/65 text-base sm:text-lg leading-relaxed">
            {dict.subtitle}
          </p>
        </div>

        {/* Scroll-driven horizontal progress rail */}
        <div className="hidden lg:block relative h-[2px] w-full bg-white/10 mb-8">
          <div
            ref={progressLineRef}
            className="absolute inset-y-0 left-0 w-full bg-[#8291EA] origin-left"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-l border-white/12">
          {dict.steps.map((step, idx) => (
            <div
              key={step.number}
              ref={(el) => {
                stepRefs.current[idx] = el;
              }}
              className="border-r border-b border-white/12 p-7 sm:p-8 flex flex-col justify-between bg-[#111318]/90"
            >
              <div>
                <span className="block text-xs font-mono text-[#8291EA] mb-6">
                  {step.number}
                </span>
                <h3 className="font-display text-xl font-medium text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/35">
                <span>STAGE {step.number}</span>
                {idx < dict.steps.length - 1 && (
                  <span className="text-[#8291EA]">→</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
