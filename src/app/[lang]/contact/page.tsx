import React from "react";
import type { Metadata } from "next";
import { Mail, Globe, Languages } from "lucide-react";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { ContactForm } from "@/components/ContactForm";
import { FadeIn } from "@/components/MotionPrimitives";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale: Locale = isValidLocale(params.lang) ? params.lang : "en";
  const dict = getDictionary(locale);

  return {
    title: dict.contactPage.metaTitle,
    description: dict.contactPage.metaDescription,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        en: "/en/contact",
        fr: "/fr/contact",
      },
    },
    openGraph: {
      title: dict.contactPage.metaTitle,
      description: dict.contactPage.metaDescription,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
  };
}

export default function ContactPage({ params }: { params: { lang: string } }) {
  if (!isValidLocale(params.lang)) {
    notFound();
  }

  const locale: Locale = params.lang;
  const dict = getDictionary(locale);

  return (
    <>
      <section className="swiss-grid-bg border-b border-[#111318]/12 py-20 sm:py-28">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-4">
              {dict.contactPage.eyebrow}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tightest leading-[1.06] text-[#111318] max-w-4xl mb-8">
              {dict.contactPage.title}
            </h1>
            <p className="text-lg sm:text-xl text-[#777777] leading-relaxed max-w-2xl">
              {dict.contactPage.subtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[#F5F5F2]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Direct Contact Info */}
          <FadeIn className="lg:col-span-4 space-y-8">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-6">
                {dict.contactPage.directContactLabel}
              </h2>

              <div className="space-y-6 divide-y divide-[#111318]/12 border-t border-b border-[#111318]/12">
                <div className="pt-6 pb-2 flex items-start gap-3.5">
                  <Mail className="w-4 h-4 text-[#8291EA] shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.12em] text-[#777777] mb-1">
                      {dict.contactPage.emailLabel}
                    </p>
                    <a
                      href={`mailto:${dict.contactPage.emailValue}`}
                      className="text-base font-medium text-[#111318] hover:text-[#8291EA] transition-colors break-all"
                    >
                      {dict.contactPage.emailValue}
                    </a>
                  </div>
                </div>

                <div className="pt-6 pb-2 flex items-start gap-3.5">
                  <Globe className="w-4 h-4 text-[#8291EA] shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.12em] text-[#777777] mb-1">
                      {dict.contactPage.presenceLabel}
                    </p>
                    <p className="text-base font-medium text-[#111318]">
                      {dict.contactPage.presenceValue}
                    </p>
                  </div>
                </div>

                <div className="pt-6 pb-6 flex items-start gap-3.5">
                  <Languages className="w-4 h-4 text-[#8291EA] shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.12em] text-[#777777] mb-1">
                      {dict.contactPage.responseLabel}
                    </p>
                    <p className="text-base font-medium text-[#111318]">
                      {dict.contactPage.responseValue}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right: Inquiry Form */}
          <FadeIn delay={0.08} className="lg:col-span-8">
            <ContactForm dict={dict.contactPage.form} />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
