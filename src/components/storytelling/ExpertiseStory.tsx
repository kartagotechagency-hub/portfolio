import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/MotionPrimitives";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

interface ExpertiseStoryProps {
  locale: Locale;
  dict: Dictionary["home"]["services"];
}

/**
 * Compact, refined presentation of KartagoTech's 5 capabilities after the story.
 */
export function ExpertiseStory({ locale, dict }: ExpertiseStoryProps) {
  return (
    <section className="py-16 sm:py-20 bg-[#F5F5F2] border-b border-[#111318]/12">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-2.5">
                {dict.label}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-editorial leading-[1.1] text-[#111318] max-w-2xl">
                {dict.title}
              </h2>
            </div>
            <Link
              href={getLocalizedPath("/services", locale)}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#111318] hover:text-[#8291EA] transition-colors group shrink-0"
            >
              <span>{dict.exploreServices}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border-t border-l border-[#111318]/12 bg-white">
          {dict.items.map((service, idx) => (
            <FadeIn
              key={service.index}
              delay={idx * 0.04}
              className="border-r border-b border-[#111318]/12 p-6 flex flex-col justify-between group hover:bg-[#F5F5F2]/60 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-[#8291EA]">
                    {service.index}
                  </span>
                  <Link
                    href={getLocalizedPath(service.href, locale)}
                    aria-label={service.title}
                    className="text-[#111318]/40 group-hover:text-[#8291EA] transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
                <h3 className="font-display text-lg font-medium text-[#111318] mb-2.5">
                  <Link
                    href={getLocalizedPath(service.href, locale)}
                    className="hover:text-[#8291EA] transition-colors"
                  >
                    {service.title}
                  </Link>
                </h3>
                <p className="text-sm text-[#777777] leading-relaxed">
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
