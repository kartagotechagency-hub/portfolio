import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { isValidLocale, getLocalizedPath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
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
    title: dict.servicesPage.metaTitle,
    description: dict.servicesPage.metaDescription,
    alternates: {
      canonical: `/${locale}/services`,
      languages: {
        en: "/en/services",
        fr: "/fr/services",
      },
    },
    openGraph: {
      title: dict.servicesPage.metaTitle,
      description: dict.servicesPage.metaDescription,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
  };
}

export default function ServicesPage({ params }: { params: { lang: string } }) {
  if (!isValidLocale(params.lang)) {
    notFound();
  }

  const locale: Locale = params.lang;
  const dict = getDictionary(locale);

  return (
    <>
      {/* Page Header */}
      <section className="swiss-grid-bg border-b border-[#111318]/12 py-20 sm:py-28">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-4">
              {dict.servicesPage.eyebrow}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tightest leading-[1.06] text-[#111318] max-w-4xl mb-8">
              {dict.servicesPage.title}
            </h1>
            <p className="text-lg sm:text-xl text-[#777777] leading-relaxed max-w-2xl">
              {dict.servicesPage.subtitle}
            </p>
          </FadeIn>

          {/* Quick Anchor Bar */}
          <FadeIn delay={0.1}>
            <div className="mt-12 pt-6 border-t border-[#111318]/12 flex flex-wrap gap-x-8 gap-y-3">
              {dict.servicesPage.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-xs font-mono uppercase tracking-[0.12em] text-[#777777] hover:text-[#111318] transition-colors flex items-center gap-2"
                >
                  <span className="text-[#8291EA]">{section.index}</span>
                  <span>{section.title}</span>
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Detailed Service Sections */}
      <section className="bg-white divide-y divide-[#111318]/12">
        {dict.servicesPage.sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className="scroll-mt-24 py-20 sm:py-24 lg:py-28"
          >
            <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                {/* Left Column: Title & Business Value */}
                <FadeIn className="lg:col-span-5">
                  <span className="inline-block text-xs font-mono text-[#8291EA] mb-4">
                    {section.index}
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-editorial text-[#111318] mb-5">
                    {section.title}
                  </h2>
                  <p className="text-lg text-[#111318]/85 leading-relaxed mb-8">
                    {section.summary}
                  </p>

                  <div className="p-6 bg-[#F5F5F2] border border-[#111318]/10">
                    <h3 className="text-xs font-mono uppercase tracking-[0.14em] text-[#8291EA] mb-3">
                      {dict.servicesPage.businessValueLabel}
                    </h3>
                    <p className="text-sm sm:text-base text-[#777777] leading-relaxed">
                      {section.businessValue}
                    </p>
                  </div>
                </FadeIn>

                {/* Right Column: Deliverables Grid */}
                <div className="lg:col-span-7">
                  <FadeIn delay={0.08}>
                    <h3 className="text-xs font-mono uppercase tracking-[0.14em] text-[#777777] mb-6">
                      {dict.servicesPage.deliverablesLabel}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-[#111318]/12">
                      {section.deliverables.map((item) => (
                        <div
                          key={item.name}
                          className="border-r border-b border-[#111318]/12 p-7 bg-white hover:bg-[#F5F5F2]/60 transition-colors"
                        >
                          <h4 className="font-display text-lg font-medium text-[#111318] mb-2.5">
                            {item.name}
                          </h4>
                          <p className="text-sm text-[#777777] leading-relaxed">
                            {item.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#111318] text-white py-20 sm:py-24">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight mb-3">
              {dict.servicesPage.ctaTitle}
            </h2>
            <p className="text-white/65 text-base sm:text-lg max-w-xl">
              {dict.servicesPage.ctaDescription}
            </p>
          </div>
          <Link
            href={getLocalizedPath("/contact", locale)}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#8291EA] text-[#111318] font-medium text-sm tracking-wide hover:bg-[#6e7fe3] transition-colors shrink-0"
          >
            <span>{dict.servicesPage.ctaButton}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
