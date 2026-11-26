import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { isValidLocale, getLocalizedPath, locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { projects, getProjectBySlug } from "@/data/projects";
import { ProjectVisual } from "@/components/ProjectVisual";
import { FadeIn } from "@/components/MotionPrimitives";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    projects.map((project) => ({
      lang,
      slug: project.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  const locale: Locale = isValidLocale(params.lang) ? params.lang : "en";
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return { title: "Project Not Found — KartagoTech Agency" };
  }

  return {
    title: `${project.title[locale]} — KartagoTech Agency`,
    description: project.shortDescription[locale],
    alternates: {
      canonical: `/${locale}/work/${project.slug}`,
      languages: {
        en: `/en/work/${project.slug}`,
        fr: `/fr/work/${project.slug}`,
      },
    },
    openGraph: {
      title: `${project.title[locale]} — KartagoTech Agency`,
      description: project.shortDescription[locale],
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
  };
}

export default function CaseStudyPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  if (!isValidLocale(params.lang)) {
    notFound();
  }

  const locale: Locale = params.lang;
  const dict = getDictionary(locale);
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      {/* Top Breadcrumb & Title */}
      <section className="swiss-grid-bg border-b border-[#111318]/12 pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <Link
              href={getLocalizedPath("/work", locale)}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-[#777777] hover:text-[#111318] transition-colors mb-10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{dict.workPage.backToWork}</span>
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-5">
              <span className="text-xs font-mono text-[#8291EA]">
                PROJECT {project.index}
              </span>
              <span className="text-xs font-mono uppercase tracking-[0.12em] text-[#777777]">
                / {project.category[locale]}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tightest leading-[1.06] text-[#111318] max-w-4xl mb-8">
              {project.title[locale]}
            </h1>

            <p className="text-lg sm:text-xl text-[#777777] leading-relaxed max-w-3xl mb-10">
              {project.shortDescription[locale]}
            </p>

            {/* Metadata strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#111318]/12">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#777777] mb-1">
                  {dict.workPage.statusLabel}
                </p>
                <p className="text-sm font-medium text-[#111318]">
                  {project.status[locale]}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#777777] mb-2">
                  Stack & Architecture
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs font-mono bg-white border border-[#111318]/12 text-[#111318]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Hero Visual */}
      <section className="py-12 sm:py-16 bg-white border-b border-[#111318]/12">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <ProjectVisual
              type={project.visualType}
              mockupLabel={dict.workPage.mockupLabel}
            />
          </FadeIn>
        </div>
      </section>

      {/* Case Study Content */}
      <section className="py-20 sm:py-28 bg-[#F5F5F2] border-b border-[#111318]/12">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Context & Solution */}
          <div className="lg:col-span-7 space-y-12">
            <FadeIn>
              <h2 className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-4">
                {dict.workPage.challengeLabel}
              </h2>
              <p className="text-lg text-[#111318] leading-relaxed">
                {project.challenge[locale]}
              </p>
            </FadeIn>

            <FadeIn delay={0.08}>
              <h2 className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-4">
                {dict.workPage.solutionLabel}
              </h2>
              <p className="text-lg text-[#777777] leading-relaxed">
                {project.solution[locale]}
              </p>
            </FadeIn>

            <FadeIn delay={0.14}>
              <h2 className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-5">
                {dict.workPage.architectureLabel}
              </h2>
              <ul className="space-y-4 border-t border-[#111318]/12 pt-6">
                {project.architectureHighlights[locale].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-base text-[#111318]/85 leading-relaxed"
                  >
                    <span className="w-2 h-2 bg-[#8291EA] mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          {/* Right: Modules & CTA */}
          <div className="lg:col-span-5">
            <FadeIn delay={0.1}>
              <div className="bg-white border border-[#111318]/12 p-8">
                <h2 className="text-xs font-mono uppercase tracking-[0.16em] text-[#111318] mb-6">
                  {dict.workPage.capabilitiesLabel}
                </h2>
                <ul className="divide-y divide-[#111318]/10 mb-8">
                  {project.features[locale].map((feature, i) => (
                    <li
                      key={feature}
                      className="py-3.5 flex items-center justify-between text-sm text-[#111318]"
                    >
                      <span>{feature}</span>
                      <span className="text-xs font-mono text-[#8291EA]">
                        0{i + 1}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={getLocalizedPath("/contact", locale)}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-[#8291EA] text-[#111318] font-medium text-sm tracking-wide hover:bg-[#6e7fe3] transition-colors"
                >
                  <span>{dict.workPage.inquireSimilar}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Next Project Navigation */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#777777] mb-2">
              {dict.workPage.nextProjectLabel}
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#111318]">
              {nextProject.title[locale]}
            </h3>
          </div>
          <Link
            href={getLocalizedPath(`/work/${nextProject.slug}`, locale)}
            className="inline-flex items-center gap-2.5 px-7 py-4 border border-[#111318] text-[#111318] font-medium text-sm hover:bg-[#111318] hover:text-white transition-colors shrink-0"
          >
            <span>{dict.workPage.viewCaseStudy}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
