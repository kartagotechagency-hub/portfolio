"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import type { Dictionary } from "@/lib/dictionaries";

const VisionScene = dynamic(() => import("@/components/scenes/VisionScene"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />,
});

gsap.registerPlugin(ScrollTrigger);

interface VisionStoryProps {
  dict: Dictionary["home"]["vision"];
}

export function VisionStory({ dict }: VisionStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<number>(0);
  const stageRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const { reducedMotion } = useMediaPreferences();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) {
      progressRef.current = 1;
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        end: "bottom 35%",
        scrub: 0.6,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          const activeStage = Math.min(
            dict.stages.length - 1,
            Math.floor(self.progress * dict.stages.length)
          );
          stageRefs.current.forEach((el, idx) => {
            if (!el) return;
            el.dataset.active = idx <= activeStage ? "true" : "false";
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, dict.stages.length]);

  return (
    <section
      id="vision"
      ref={sectionRef}
      className="relative bg-[#111318] text-white py-24 sm:py-32 lg:py-40 overflow-hidden"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Editorial Copy */}
        <div className="lg:col-span-6 relative z-10">
          <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-4">
            {dict.label}
          </p>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-medium tracking-tightest leading-[1.06] text-white mb-7">
            {dict.headline}
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl mb-10">
            {dict.body}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/12">
            {dict.stages.map((stage, idx) => (
              <span
                key={stage}
                ref={(el) => {
                  stageRefs.current[idx] = el;
                }}
                data-active={idx === 0 ? "true" : "false"}
                className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-[0.12em] border border-white/15 text-white/50 data-[active=true]:border-[#8291EA] data-[active=true]:text-[#8291EA] data-[active=true]:bg-[#8291EA]/10 transition-colors duration-300"
              >
                0{idx + 1} · {stage}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Scroll-Morphing 3D Idea Lattice */}
        <div className="lg:col-span-6 h-[320px] sm:h-[400px] lg:h-[460px] relative">
          <VisionScene progressRef={progressRef} />
        </div>
      </div>

      {/* Smooth architectural transition gradient into off-white #F5F5F2 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-[#F5F5F2] pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
