import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { isValidLocale, getLocalizedPath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { projects } from "@/data/projects";
import { FadeIn } from "@/components/MotionPrimitives";
import { CommercialStory } from "@/components/storytelling/CommercialStory";
import { ExpertiseStory } from "@/components/storytelling/ExpertiseStory";
import { ApproachStory } from "@/components/storytelling/ApproachStory";
import { FinaleStory } from "@/components/storytelling/FinaleStory";
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
      {/* 1. THE MAIN EXPERIENCE — 5-Chapter Cinematic Business Transformation Film */}
      <CommercialStory locale={locale} dict={dict} />

      {/* 2. COMPACT AGENCY PRESENTATION (After Chapter 05 concludes) */}
      <div id="agency-overview">
        {/* A. Services */}
        <ExpertiseStory locale={locale} dict={dict.home.services} />

        {/* B. Selected Work (Clean Editorial List — Detailed Previews live inside Case Studies) */}
        <section className="py-16 sm:py-20 border-b border-[#111318]/12 bg-white">
          <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
            <FadeIn>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-2.5">
                    {dict.home.selectedWork.label}
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-editorial leading-[1.1] text-[#111318] max-w-2xl">
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

            <div className="divide-y divide-[#111318]/12 border-t border-b border-[#111318]/12">
              {projects.map((project, idx) => (
                <FadeIn key={project.slug} delay={Math.min(idx * 0.03, 0.18)}>
                  <article className="py-6 sm:py-7 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center group">
                    <div className="lg:col-span-4">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-xs font-mono text-[#8291EA]">
                          {project.index}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#777777]">
                          {project.category[locale]}
                        </span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-[#111318]">
                        <Link
                          href={getLocalizedPath(`/work/${project.slug}`, locale)}
                          className="hover:text-[#8291EA] transition-colors"
                        >
                          {project.title[locale]}
                        </Link>
                      </h3>
                    </div>

                    <div className="lg:col-span-5">
                      <p className="text-[#777777] text-sm sm:text-base leading-relaxed">
                        {project.shortDescription[locale]}
                      </p>
                    </div>

                    <div className="lg:col-span-3 flex lg:flex-col lg:items-end justify-between gap-2">
                      <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#111318]/60">
                        {project.status[locale]}
                      </span>
                      <Link
                        href={getLocalizedPath(`/work/${project.slug}`, locale)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#111318] border-b border-[#111318]/30 pb-0.5 hover:border-[#8291EA] hover:text-[#8291EA] transition-colors group/link shrink-0"
                      >
                        <span>{dict.home.selectedWork.exploreCase}</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </Link>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* C. Our Approach */}
        <ApproachStory dict={dict.home.approach} />

        {/* D. About KartagoTech */}
        <section className="py-16 sm:py-20 bg-[#F5F5F2] border-b border-[#111318]/12">
          <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <FadeIn className="lg:col-span-6">
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-2.5">
                {dict.home.about.label}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-editorial leading-[1.1] text-[#111318] mb-5">
                {dict.home.about.title}
              </h2>
              <p className="text-base text-[#777777] leading-relaxed mb-6">
                {dict.home.about.paragraph1}
              </p>
              <Link
                href={getLocalizedPath("/about", locale)}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#111318] border-b border-[#111318]/30 pb-1 hover:border-[#8291EA] hover:text-[#8291EA] transition-colors group"
              >
                <span>{dict.home.about.cta}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </FadeIn>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {dict.home.about.pillars.map((pillar, idx) => (
                <FadeIn
                  key={pillar.title}
                  delay={idx * 0.05}
                  className="bg-white border border-[#111318]/12 p-6"
                >
                  <h3 className="font-display text-lg font-medium text-[#111318] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#777777] leading-relaxed">
                    {pillar.description}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* E. Final Contact CTA */}
        <FinaleStory locale={locale} dict={dict} />
      </div>
    </>
  );
}
