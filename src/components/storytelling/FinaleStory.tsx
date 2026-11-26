import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/MotionPrimitives";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

interface FinaleStoryProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Strong, clean final Contact CTA closing the homepage.
 */
export function FinaleStory({ locale, dict }: FinaleStoryProps) {
  return (
    <section className="bg-white text-[#111318] py-16 sm:py-24 border-t border-[#111318]/10">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <FadeIn>
          <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-3">
            {dict.home.contactCta.label}
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tightest leading-[1.06] text-[#111318] max-w-3xl mb-4">
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
    </section>
  );
}
