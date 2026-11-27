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
 * Concise "What We Do" section introducing KartagoTech's 5 core capabilities
 * after the cinematic brand film.
 */
export function ExpertiseStory({ locale, dict }: ExpertiseStoryProps) {
  return (
    <section
      id="services"
      className="py-20 sm:py-28 bg-[#F5F5F2] border-b border-[#111318]/10 scroll-mt-20"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#8291EA] mb-3">
                {dict.label}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-tight leading-[1.08] text-[#111318] max-w-2xl">
                {dict.title}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#777777] leading-relaxed max-w-md">
              {dict.subtitle}
            </p>
          </div>
        </FadeIn>

        <div className="divide-y divide-[#111318]/12 border-t border-b border-[#111318]/12">
          {dict.items.map((service, idx) => (
            <FadeIn key={service.index} delay={idx * 0.03}>
              <div className="py-6 sm:py-7 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline group">
                <div className="md:col-span-4 flex items-baseline gap-4">
                  <span className="text-xs font-mono text-[#8291EA] shrink-0">
                    {service.index}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-medium text-[#111318]">
                    <Link
                      href={getLocalizedPath(service.href, locale)}
                      className="hover:text-[#8291EA] transition-colors"
                    >
                      {service.title}
                    </Link>
                  </h3>
                </div>

                <div className="md:col-span-6">
                  <p className="text-sm sm:text-base text-[#777777] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="md:col-span-2 flex md:justify-end">
                  <Link
                    href={getLocalizedPath(service.href, locale)}
                    aria-label={service.title}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.14em] text-[#111318]/60 group-hover:text-[#8291EA] transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <Link
              href={getLocalizedPath("/services", locale)}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#111318] border-b border-[#111318]/30 pb-1 hover:border-[#8291EA] hover:text-[#8291EA] transition-colors group"
            >
              <span>{dict.exploreServices}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href={getLocalizedPath("/work", locale)}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#777777] hover:text-[#111318] transition-colors group"
            >
              <span>{dict.exploreServices === "Explore all services" ? "Explore selected work" : "Découvrir nos projets"}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
