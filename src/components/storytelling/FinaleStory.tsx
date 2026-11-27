import React from "react";
import { Mail, Globe, Languages } from "lucide-react";
import { FadeIn } from "@/components/MotionPrimitives";
import { ContactForm } from "@/components/ContactForm";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

interface FinaleStoryProps {
  locale: Locale;
  dict: Dictionary;
}

const FINALE_COPY: Record<
  Locale,
  {
    headlineLine1: string;
    headlineLine2: string;
    supporting: string;
    directEmailLabel: string;
  }
> = {
  en: {
    headlineLine1: "HAVE A BUSINESS",
    headlineLine2: "CHALLENGE?",
    supporting: "Let's find the right digital solution.",
    directEmailLabel: "Direct email",
  },
  fr: {
    headlineLine1: "UN DÉFI",
    headlineLine2: "MÉTIER ?",
    supporting: "Trouvons la bonne solution digitale.",
    directEmailLabel: "E-mail direct",
  },
};

/**
 * Final conversion section with inline working ContactForm and direct email fallback.
 */
export function FinaleStory({ locale, dict }: FinaleStoryProps) {
  const copy = FINALE_COPY[locale];

  return (
    <section
      className="bg-[#111318] text-white py-20 sm:py-28 scroll-mt-20"
      id="contact"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left — headline & direct contact info */}
            <div className="lg:col-span-5">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8291EA] mb-4">
                {dict.home.contactCta.label}
              </p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.03] tracking-tight text-white mb-5">
                {copy.headlineLine1}
                <br />
                {copy.headlineLine2}
              </h2>
              <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-md mb-10">
                {copy.supporting}
              </p>

              <div className="space-y-4 border-t border-white/12 pt-8">
                <div className="flex items-start gap-3.5 p-4 border border-white/12 bg-white/5">
                  <Mail className="w-4 h-4 text-[#8291EA] shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/50 mb-0.5">
                      {copy.directEmailLabel}
                    </p>
                    <a
                      href={`mailto:${dict.contactPage.emailValue}`}
                      className="text-sm font-medium text-white hover:text-[#8291EA] transition-colors break-all"
                    >
                      {dict.contactPage.emailValue}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 border border-white/12 bg-white/5">
                    <Globe className="w-4 h-4 text-[#8291EA] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/50 mb-0.5">
                        {dict.contactPage.presenceLabel}
                      </p>
                      <p className="text-xs font-medium text-white">
                        {dict.contactPage.presenceValue}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 border border-white/12 bg-white/5">
                    <Languages className="w-4 h-4 text-[#8291EA] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/50 mb-0.5">
                        {dict.contactPage.responseLabel}
                      </p>
                      <p className="text-xs font-medium text-white">
                        {dict.contactPage.responseValue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Working Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm dict={dict.contactPage.form} />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
