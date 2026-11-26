"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

gsap.registerPlugin(ScrollTrigger);

interface ExpertiseStoryProps {
  locale: Locale;
  dict: Dictionary["home"]["services"];
}

export function ExpertiseStory({ locale, dict }: ExpertiseStoryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { reducedMotion } = useMediaPreferences();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      itemRefs.current.forEach((el, idx) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => setActiveIndex(idx),
          onEnterBack: () => setActiveIndex(idx),
        });
      });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  const activeService = dict.items[activeIndex] ?? dict.items[0];

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-[#F5F5F2] border-b border-[#111318]/12">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 sm:mb-20">
          <div className="lg:col-span-7">
            <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-3">
              {dict.label}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-editorial leading-[1.1] text-[#111318]">
              {dict.title}
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-end items-start lg:items-end">
            <p className="text-[#777777] text-base leading-relaxed mb-5 lg:text-right max-w-md">
              {dict.subtitle}
            </p>
            <Link
              href={getLocalizedPath("/services", locale)}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#111318] hover:text-[#8291EA] transition-colors group"
            >
              <span>{dict.exploreServices}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: Service Chapters */}
          <div className="lg:col-span-7 divide-y divide-[#111318]/12 border-t border-b border-[#111318]/12">
            {dict.items.map((service, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={service.index}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`py-8 sm:py-10 transition-all duration-300 cursor-pointer ${
                    isActive ? "opacity-100" : "opacity-65 hover:opacity-95"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 mb-3">
                      <span
                        className={`text-xs font-mono px-2 py-0.5 border transition-colors ${
                          isActive
                            ? "border-[#8291EA] bg-[#8291EA] text-[#111318] font-medium"
                            : "border-[#111318]/20 text-[#777777]"
                        }`}
                      >
                        {service.index}
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#111318]">
                        {service.title}
                      </h3>
                    </div>

                    <Link
                      href={getLocalizedPath(service.href, locale)}
                      className="p-2 text-[#111318] hover:text-[#8291EA] transition-colors shrink-0"
                      aria-label={service.title}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <p className="text-[#777777] text-base leading-relaxed max-w-xl pl-0 sm:pl-12">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Sticky Editorial Service Focus Card (No abstract 3D shapes) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-white border border-[#111318]/12 p-8 sm:p-10">
              <div className="flex items-center justify-between border-b border-[#111318]/10 pb-4 mb-8">
                <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA]">
                  {activeService?.index} — CAPABILITY
                </span>
                <span className="w-2 h-2 bg-[#8291EA]" />
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#111318] mb-5">
                {activeService?.title}
              </h3>

              <p className="text-[#777777] text-base leading-relaxed mb-8">
                {activeService?.description}
              </p>

              <Link
                href={getLocalizedPath(activeService?.href || "/services", locale)}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#111318] border-b border-[#111318]/30 pb-1 hover:border-[#8291EA] hover:text-[#8291EA] transition-colors group"
              >
                <span>{dict.exploreServices}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
