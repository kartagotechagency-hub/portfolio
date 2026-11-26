import React from "react";
import Image from "next/image";
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
    title: dict.aboutPage.metaTitle,
    description: dict.aboutPage.metaDescription,
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        en: "/en/about",
        fr: "/fr/about",
      },
    },
    openGraph: {
      title: dict.aboutPage.metaTitle,
      description: dict.aboutPage.metaDescription,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
  };
}

export default function AboutPage({ params }: { params: { lang: string } }) {
  if (!isValidLocale(params.lang)) {
    notFound();
  }

  const locale: Locale = params.lang;
  const dict = getDictionary(locale);

  return (
    <>
      {/* Hero Header */}
      <section className="swiss-grid-bg border-b border-[#111318]/12 py-20 sm:py-28">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-4">
              {dict.aboutPage.eyebrow}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tightest leading-[1.06] text-[#111318] max-w-4xl mb-8">
              {dict.aboutPage.title}
            </h1>
            <p className="text-lg sm:text-xl text-[#777777] leading-relaxed max-w-2xl">
              {dict.aboutPage.subtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#111318]/12">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <FadeIn className="lg:col-span-5">
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-3">
                {dict.aboutPage.whoWeAre.label}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-editorial text-[#111318]">
                {dict.aboutPage.whoWeAre.title}
              </h2>
            </FadeIn>
            <FadeIn delay={0.08} className="lg:col-span-7 space-y-6">
              {dict.aboutPage.whoWeAre.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-lg text-[#777777] leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </FadeIn>
          </div>

          <FadeIn delay={0.12}>
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden border border-[#111318]/12 bg-[#111318]">
              <Image
                src="/assets/images/about-office.jpg"
                alt="KartagoTech Agency architectural studio environment"
                fill
                sizes="(max-width: 1360px) 100vw, 1360px"
                className="object-cover object-center"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Engineering Mindset & Philosophy */}
      <section className="py-20 sm:py-28 bg-[#F5F5F2] border-b border-[#111318]/12">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <FadeIn className="max-w-3xl mb-14">
            <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-3">
              {dict.aboutPage.mindset.label}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-editorial text-[#111318] mb-4">
              {dict.aboutPage.mindset.title}
            </h2>
            <p className="text-lg text-[#777777] leading-relaxed">
              {dict.aboutPage.mindset.body}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[#111318]/12">
            {dict.aboutPage.mindset.principles.map((principle, idx) => (
              <FadeIn
                key={principle.index}
                delay={idx * 0.05}
                className="border-r border-b border-[#111318]/12 p-8 sm:p-10 bg-white"
              >
                <span className="block text-xs font-mono text-[#8291EA] mb-5">
                  {principle.index}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-medium text-[#111318] mb-3">
                  {principle.title}
                </h3>
                <p className="text-base text-[#777777] leading-relaxed">
                  {principle.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 sm:py-28 bg-[#111318] text-white swiss-grid-bg-dark">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <FadeIn className="lg:col-span-5">
            <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-3">
              {dict.aboutPage.howWeWork.label}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-editorial text-white">
              {dict.aboutPage.howWeWork.title}
            </h2>
          </FadeIn>
          <FadeIn delay={0.08} className="lg:col-span-7">
            <p className="text-lg text-white/75 leading-relaxed mb-8">
              {dict.aboutPage.howWeWork.body}
            </p>
            <Link
              href={getLocalizedPath("/services", locale)}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#8291EA] hover:text-white transition-colors"
            >
              <span>{dict.home.services.exploreServices}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* International Positioning */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <FadeIn className="max-w-3xl mb-14">
            <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-3">
              {dict.aboutPage.international.label}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-editorial text-[#111318] mb-4">
              {dict.aboutPage.international.title}
            </h2>
            <p className="text-lg text-[#777777] leading-relaxed">
              {dict.aboutPage.international.body}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[#111318]/12 mb-16">
            {dict.aboutPage.international.regions.map((region, idx) => (
              <FadeIn
                key={region.name}
                delay={idx * 0.06}
                className="border-r border-b border-[#111318]/12 p-8 bg-[#F5F5F2]/60"
              >
                <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#8291EA] mb-2">
                  {region.role}
                </p>
                <h3 className="font-display text-2xl font-medium text-[#111318] mb-3">
                  {region.name}
                </h3>
                <p className="text-sm text-[#777777] leading-relaxed">
                  {region.detail}
                </p>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="pt-10 border-t border-[#111318]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#111318]">
                {dict.home.contactCta.headline}
              </h3>
              <Link
                href={getLocalizedPath("/contact", locale)}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#8291EA] text-[#111318] font-medium text-sm tracking-wide hover:bg-[#6e7fe3] transition-colors shrink-0"
              >
                <span>{dict.home.contactCta.button}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
