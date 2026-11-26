import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { isValidLocale, getLocalizedPath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { projects } from "@/data/projects";
import { ProjectVisual } from "@/components/ProjectVisual";
import { FadeIn, HeroReveal } from "@/components/MotionPrimitives";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale: Locale = isValidLocale(params.lang) ? params.lang : "en";
  const dict = getDictionary(locale);

  return {
    title: dict.meta.defaultTitle,
    description: dict.meta.defaultDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        fr: "/fr",
      },
    },
    openGraph: {
      title: dict.meta.defaultTitle,
      description: dict.meta.defaultDescription,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
  };
}

export default function HomePage({ params }: { params: { lang: string } }) {
  if (!isValidLocale(params.lang)) {
    notFound();
  }

  const locale: Locale = params.lang;
  const dict = getDictionary(locale);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative swiss-grid-bg border-b border-[#111318]/12 overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
          <HeroReveal>
            <div className="flex items-center gap-2.5 mb-8 sm:mb-10">
              <span className="w-2 h-2 bg-[#8291EA]" />
              <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#777777]">
                {dict.home.hero.eyebrow}
              </span>
            </div>
          </HeroReveal>

          <HeroReveal delay={0.08}>
            <h1 className="font-display font-medium text-[clamp(2.6rem,6.4vw,5.75rem)] leading-[1.01] tracking-tightest text-[#111318] max-w-5xl">
              <span className="block">{dict.home.hero.headlineLine1}</span>
              <span className="block">{dict.home.hero.headlineLine2}</span>
            </h1>
          </HeroReveal>

          <HeroReveal delay={0.16}>
            <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <p className="lg:col-span-6 text-lg sm:text-xl text-[#777777] leading-relaxed max-w-xl">
                {dict.home.hero.supporting}
              </p>

              <div className="lg:col-span-6 flex flex-col sm:flex-row sm:items-center lg:justify-end gap-4">
                <Link
                  href={getLocalizedPath("/contact", locale)}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#8291EA] text-[#111318] font-medium text-sm tracking-wide hover:bg-[#6e7fe3] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111318]"
                >
                  <span>{dict.home.hero.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={getLocalizedPath("/work", locale)}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 border border-[#111318]/25 bg-white/50 text-[#111318] font-medium text-sm tracking-wide hover:border-[#111318] hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8291EA]"
                >
                  <span>{dict.home.hero.secondaryCta}</span>
                </Link>
              </div>
            </div>
          </HeroReveal>

          <HeroReveal delay={0.24}>
            <div className="mt-14 sm:mt-20 pt-6 border-t border-[#111318]/12 flex items-center justify-between text-xs font-mono uppercase tracking-[0.16em] text-[#777777]">
              <span>{dict.home.hero.location}</span>
              <span className="hidden sm:inline text-[#111318]/50">
                ↓ {dict.home.hero.scrollLabel}
              </span>
            </div>
          </HeroReveal>
        </div>
      </section>

      {/* SECTION 1 — SELECTED WORK */}
      <section className="py-20 sm:py-28 lg:py-32 border-b border-[#111318]/12 bg-[#F5F5F2]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 sm:mb-16">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-3">
                  {dict.home.selectedWork.label}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-editorial leading-[1.1] text-[#111318] max-w-2xl">
                  {dict.home.selectedWork.title}
                </h2>
              </div>
              <Link
                href={getLocalizedPath("/work", locale)}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#111318] hover:text-[#8291EA] transition-colors group shrink-0"
              >
                <span>{dict.home.selectedWork.viewAll}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </FadeIn>

          <div className="space-y-16 sm:space-y-24">
            {projects.map((project, idx) => (
              <FadeIn key={project.slug} delay={idx * 0.06}>
                <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-10 border-t border-[#111318]/12">
                  <div className="lg:col-span-7">
                    <Link
                      href={getLocalizedPath(`/work/${project.slug}`, locale)}
                      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8291EA]"
                    >
                      <ProjectVisual
                        type={project.visualType}
                        mockupLabel={dict.workPage.mockupLabel}
                      />
                    </Link>
                  </div>

                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-mono text-[#8291EA]">
                          {project.index}
                        </span>
                        <span className="text-xs font-mono uppercase tracking-[0.12em] text-[#777777]">
                          {project.category[locale]}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#111318] mb-4">
                        <Link
                          href={getLocalizedPath(`/work/${project.slug}`, locale)}
                          className="hover:text-[#8291EA] transition-colors"
                        >
                          {project.title[locale]}
                        </Link>
                      </h3>

                      <p className="text-[#777777] text-base leading-relaxed mb-6">
                        {project.shortDescription[locale]}
                      </p>

                      <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#111318]/65 mb-8">
                        {project.status[locale]}
                      </p>
                    </div>

                    <div>
                      <Link
                        href={getLocalizedPath(`/work/${project.slug}`, locale)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#111318] border-b border-[#111318]/30 pb-1 hover:border-[#8291EA] hover:text-[#8291EA] transition-colors group"
                      >
                        <span>{dict.home.selectedWork.exploreCase}</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — WHAT WE DO */}
      <section className="py-20 sm:py-28 lg:py-32 bg-white border-b border-[#111318]/12">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 sm:mb-16">
              <div className="lg:col-span-7">
                <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-3">
                  {dict.home.services.label}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-editorial leading-[1.1] text-[#111318]">
                  {dict.home.services.title}
                </h2>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-end items-start lg:items-end">
                <p className="text-[#777777] text-base leading-relaxed mb-5 lg:text-right max-w-md">
                  {dict.home.services.subtitle}
                </p>
                <Link
                  href={getLocalizedPath("/services", locale)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#111318] hover:text-[#8291EA] transition-colors group"
                >
                  <span>{dict.home.services.exploreServices}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[#111318]/12">
            {dict.home.services.items.map((service, idx) => (
              <FadeIn
                key={service.index}
                delay={idx * 0.05}
                className="border-r border-b border-[#111318]/12 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-white hover:bg-[#F5F5F2]/70 transition-colors group"
              >
                <div>
                  <span className="block text-xs font-mono text-[#8291EA] mb-6">
                    {service.index}
                  </span>
                  <h3 className="font-display text-2xl font-medium tracking-tight text-[#111318] mb-4">
                    {service.title}
                  </h3>
                  <p className="text-[#777777] text-base leading-relaxed mb-8">
                    {service.description}
                  </p>
                </div>
                <div>
                  <Link
                    href={getLocalizedPath(service.href, locale)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#111318] group-hover:text-[#8291EA] transition-colors"
                  >
                    <span>{dict.home.services.exploreServices}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — OUR APPROACH */}
      <section className="py-20 sm:py-28 lg:py-32 bg-[#111318] text-white swiss-grid-bg-dark">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="max-w-3xl mb-16">
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-3">
                {dict.home.approach.label}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-editorial leading-[1.1] text-white mb-5">
                {dict.home.approach.title}
              </h2>
              <p className="text-white/65 text-base sm:text-lg leading-relaxed">
                {dict.home.approach.subtitle}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-l border-white/12">
            {dict.home.approach.steps.map((step, idx) => (
              <FadeIn
                key={step.number}
                delay={idx * 0.06}
                className="border-r border-b border-white/12 p-7 sm:p-8 flex flex-col justify-between bg-[#111318]/90"
              >
                <div>
                  <span className="block text-xs font-mono text-[#8291EA] mb-6">
                    {step.number}
                  </span>
                  <h3 className="font-display text-xl font-medium text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/65 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/35">
                  <span>STAGE {step.number}</span>
                  {idx < dict.home.approach.steps.length - 1 && (
                    <span className="text-[#8291EA]">→</span>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — ABOUT KARTAGOTECH */}
      <section className="py-20 sm:py-28 lg:py-32 bg-[#F5F5F2] border-b border-[#111318]/12">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <FadeIn className="lg:col-span-6">
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-3">
                {dict.home.about.label}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-editorial leading-[1.1] text-[#111318] mb-8">
                {dict.home.about.title}
              </h2>
              <div className="space-y-5 text-base sm:text-lg text-[#777777] leading-relaxed mb-8">
                <p>{dict.home.about.paragraph1}</p>
                <p>{dict.home.about.paragraph2}</p>
              </div>
              <Link
                href={getLocalizedPath("/about", locale)}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#111318] border-b border-[#111318]/30 pb-1 hover:border-[#8291EA] hover:text-[#8291EA] transition-colors group"
              >
                <span>{dict.home.about.cta}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </FadeIn>

            <div className="lg:col-span-6 flex flex-col justify-center divide-y divide-[#111318]/12 border-t border-b border-[#111318]/12">
              {dict.home.about.pillars.map((pillar, idx) => (
                <FadeIn key={pillar.title} delay={idx * 0.06} className="py-7">
                  <h3 className="font-display text-xl font-medium text-[#111318] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-[#777777] text-base leading-relaxed">
                    {pillar.description}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — CONTACT CTA */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-4">
              {dict.home.contactCta.label}
            </p>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tightest leading-[1.04] text-[#111318] max-w-3xl">
                {dict.home.contactCta.headline}
              </h2>
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
    </>
  );
}
