import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { isValidLocale, getLocalizedPath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { projects } from "@/data/projects";
import { ProjectVisual } from "@/components/ProjectVisual";
import { FadeIn } from "@/components/MotionPrimitives";
import { HeroStory } from "@/components/storytelling/HeroStory";
import { TransformationStory } from "@/components/storytelling/TransformationStory";
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
      {/* 1. OPENING — "Your business can do more with technology." */}
      <HeroStory locale={locale} dict={dict} />

      {/* 2. THE 5-CHAPTER 3D BUSINESS TRANSFORMATION STORY */}
      <TransformationStory dict={dict.home.story} />

      {/* 3. OUR EXPERTISE — Off-White Editorial + Interactive 3D Metaphors */}
      <ExpertiseStory locale={locale} dict={dict.home.services} />

      {/* 4. SELECTED WORK — White Architectural Showcase */}
      <section className="py-20 sm:py-28 lg:py-32 border-b border-[#111318]/12 bg-white">
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
              <FadeIn key={project.slug} delay={Math.min(idx * 0.04, 0.2)}>
                <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-10 border-t border-[#111318]/12 group">
                  <div className="lg:col-span-7">
                    <Link
                      href={getLocalizedPath(`/work/${project.slug}`, locale)}
                      className="block transition-transform duration-500 group-hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8291EA]"
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
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#111318] border-b border-[#111318]/30 pb-1 hover:border-[#8291EA] hover:text-[#8291EA] transition-colors group/link"
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
        </div>
      </section>

      {/* 5. OUR APPROACH — Scroll-Triggered Sequence */}
      <ApproachStory dict={dict.home.approach} />

      {/* ABOUT BRIDGE — Clean Off-White */}
      <section className="py-20 sm:py-28 bg-[#F5F5F2] border-b border-[#111318]/12">
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

      {/* 6. FINAL SCENE — Cinematic 3D Transition to Contact */}
      <FinaleStory locale={locale} dict={dict} />
    </>
  );
}
