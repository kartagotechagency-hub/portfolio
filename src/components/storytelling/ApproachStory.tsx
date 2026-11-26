import React from "react";
import { FadeIn } from "@/components/MotionPrimitives";
import type { Dictionary } from "@/lib/dictionaries";

interface ApproachStoryProps {
  dict: Dictionary["home"]["approach"];
}

/**
 * Concise single-band presentation of KartagoTech's 5-step engineering process.
 */
export function ApproachStory({ dict }: ApproachStoryProps) {
  return (
    <section className="py-16 sm:py-20 bg-[#111318] text-white border-b border-white/10">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-2.5">
                {dict.label}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-editorial leading-[1.1] text-white max-w-2xl">
                {dict.title}
              </h2>
            </div>
            <p className="text-white/60 text-sm sm:text-base max-w-md">
              {dict.subtitle}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-l border-white/12">
          {dict.steps.map((step, idx) => (
            <FadeIn
              key={step.number}
              delay={idx * 0.04}
              className="border-r border-b border-white/12 p-6"
            >
              <span className="block text-xs font-mono text-[#8291EA] mb-3">
                {step.number}
              </span>
              <h3 className="font-display text-lg font-medium text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-white/65 leading-relaxed">
                {step.description}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
