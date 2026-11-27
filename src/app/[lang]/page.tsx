import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { isValidLocale, getLocalizedPath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { projects } from "@/data/projects";
import { FadeIn } from "@/components/MotionPrimitives";
import { ScrollVideoStory } from "@/components/storytelling/ScrollVideoStory";
import { ExpertiseStory } from "@/components/storytelling/ExpertiseStory";
import { ApproachStory } from "@/components/storytelling/ApproachStory";
import { FinaleStory } from "@/components/storytelling/FinaleStory";
import { ProjectVisual } from "@/components/ProjectVisual";
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

  // Show the first 4 projects on the homepage (all 7 visible on /work)
  const featuredProjects = projects.slice(0, 4);

  return (
    <>
      {/* 1. CINEMATIC STORY — 4 scroll-synchronized video chapters */}
      <ScrollVideoStory locale={locale} dict={dict} />

      {/* 2. AGENCY PRESENTATION */}
      <div id="agency-overview">

        {/* A. Services — with problem / solution / value */}
        <ExpertiseStory locale={locale} dict={dict.home.services} />

        {/* B. Selected Work — visual previews + project details */}
        <section className="py-20 sm:py-28 bg-white border-b border-[#111318]/10">
          <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
            <FadeIn>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#8291EA] mb-3">
                    {dict.home.selectedWork.label}
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight leading-[1.08] text-[#111318] max-w-xl">
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

            {/* Featured project cards — large visual + detail */}
            <div className="space-y-16 sm:space-y-20">
              {featuredProjects.map((project, idx) => (
                <FadeIn key={project.slug} delay={Math.min(idx * 0.06, 0.2)}>
                  <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start border-t border-[#111318]/10 pt-10">
                    {/* Visual mockup */}
                    <div className={`lg:col-span-7 ${idx % 2 !== 0 ? "lg:order-2" : ""}`}>
                      <Link
                        href={getLocalizedPath(`/work/${project.slug}`, locale)}
                        className="block group"
                        aria-label={`View case study: ${project.title[locale]}`}
                      >
                        <div className="relative overflow-hidden">
                          <ProjectVisual
                            type={project.visualType}
                            mockupLabel={dict.workPage.mockupLabel}
                          />
                          <div className="absolute inset-0 bg-[#111318]/0 group-hover:bg-[#111318]/8 transition-colors duration-300 pointer-events-none" />
                        </div>
                      </Link>
                    </div>

                    {/* Project details */}
                    <div className={`lg:col-span-5 ${idx % 2 !== 0 ? "lg:order-1" : ""} flex flex-col`}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-mono text-[#8291EA]">
                          {project.index}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#777777]">
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

                      {/* Challenge */}
                      <div className="mb-4">
                        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#8291EA] block mb-1.5">
                          {dict.workPage.challengeLabel}
                        </span>
                        <p className="text-sm text-[#777777] leading-relaxed">
                          {project.challenge[locale]}
                        </p>
                      </div>

                      {/* Solution */}
                      <div className="mb-5">
                        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#8291EA] block mb-1.5">
                          {dict.workPage.solutionLabel}
                        </span>
                        <p className="text-sm text-[#111318]/85 leading-relaxed">
                          {project.solution[locale]}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#111318] block mb-2.5">
                          {dict.workPage.featuresLabel}
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                          {project.features[locale].slice(0, 4).map((f) => (
                            <li
                              key={f}
                              className="text-sm text-[#777777] flex items-start gap-2"
                            >
                              <span className="w-1.5 h-1.5 bg-[#8291EA] mt-1.5 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Stack tags */}
                      <div className="flex flex-wrap gap-2 mb-7">
                        {project.stack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono uppercase tracking-[0.1em] px-2.5 py-1 border border-[#111318]/12 text-[#777777] bg-[#F5F5F2]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto pt-5 border-t border-[#111318]/10 flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#777777]">
                          {project.status[locale]}
                        </span>
                        <Link
                          href={getLocalizedPath(`/work/${project.slug}`, locale)}
                          className="inline-flex items-center gap-2 text-sm font-medium text-[#111318] border-b border-[#111318]/30 pb-0.5 hover:border-[#8291EA] hover:text-[#8291EA] transition-colors group/link"
                        >
                          <span>{dict.home.selectedWork.exploreCase}</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>

            {/* View all work CTA */}
            <FadeIn>
              <div className="mt-16 pt-10 border-t border-[#111318]/10 flex justify-center">
                <Link
                  href={getLocalizedPath("/work", locale)}
                  className="inline-flex items-center gap-2.5 px-8 py-4 border border-[#111318] text-[#111318] text-sm font-medium tracking-wide hover:bg-[#111318] hover:text-white transition-colors group"
                >
                  <span>{dict.home.selectedWork.viewAll}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* C. Our Approach */}
        <ApproachStory dict={dict.home.approach} />

        {/* D. About KartagoTech */}
        <section className="py-20 sm:py-28 bg-[#F5F5F2] border-b border-[#111318]/10">
          <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <FadeIn className="lg:col-span-5">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#8291EA] mb-3">
                {dict.home.about.label}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight leading-[1.08] text-[#111318] mb-5">
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

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#111318]/10">
              {dict.home.about.pillars.map((pillar, idx) => (
                <FadeIn
                  key={pillar.title}
                  delay={idx * 0.06}
                  className="bg-white p-6 sm:p-7"
                >
                  <span className="text-xs font-mono text-[#8291EA] block mb-3">
                    0{idx + 1}
                  </span>
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
