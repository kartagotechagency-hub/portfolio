import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Info } from "lucide-react";
import { isValidLocale, getLocalizedPath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { projects } from "@/data/projects";
import { ProjectVisual } from "@/components/ProjectVisual";
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
    title: dict.workPage.metaTitle,
    description: dict.workPage.metaDescription,
    alternates: {
      canonical: `/${locale}/work`,
      languages: {
        en: "/en/work",
        fr: "/fr/work",
      },
    },
    openGraph: {
      title: dict.workPage.metaTitle,
      description: dict.workPage.metaDescription,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
  };
}

export default function WorkPage({ params }: { params: { lang: string } }) {
  if (!isValidLocale(params.lang)) {
    notFound();
  }

  const locale: Locale = params.lang;
  const dict = getDictionary(locale);

  return (
    <>
      {/* Header */}
      <section className="swiss-grid-bg border-b border-[#111318]/12 py-20 sm:py-28">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#8291EA] mb-4">
              {dict.workPage.eyebrow}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tightest leading-[1.06] text-[#111318] max-w-4xl mb-8">
              {dict.workPage.title}
            </h1>
            <p className="text-lg sm:text-xl text-[#777777] leading-relaxed max-w-2xl mb-10">
              {dict.workPage.subtitle}
            </p>

            {/* Transparency Disclaimer */}
            <div className="inline-flex items-start gap-3 p-4 bg-white border border-[#111318]/12 max-w-3xl">
              <Info className="w-4 h-4 text-[#8291EA] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
                {dict.workPage.disclaimer}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-16 sm:py-24 bg-[#F5F5F2]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 space-y-20 sm:space-y-28">
          {projects.map((project, idx) => (
            <FadeIn key={project.slug} delay={idx * 0.05}>
              <article className="bg-white border border-[#111318]/12 p-6 sm:p-10 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                  {/* Visual */}
                  <div className="lg:col-span-7">
                    <Link
                      href={getLocalizedPath(`/work/${project.slug}`, locale)}
                      className="block"
                    >
                      <ProjectVisual
                        type={project.visualType}
                        mockupLabel={dict.workPage.mockupLabel}
                      />
                    </Link>
                  </div>

                  {/* Metadata & Features */}
                  <div className="lg:col-span-5 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between gap-4 border-b border-[#111318]/10 pb-4 mb-5">
                        <span className="text-xs font-mono text-[#8291EA]">
                          PROJECT {project.index}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#777777]">
                          {project.category[locale]}
                        </span>
                      </div>

                      <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#111318] mb-4">
                        <Link
                          href={getLocalizedPath(`/work/${project.slug}`, locale)}
                          className="hover:text-[#8291EA] transition-colors"
                        >
                          {project.title[locale]}
                        </Link>
                      </h2>

                      <p className="text-[#777777] text-base leading-relaxed mb-6">
                        {project.shortDescription[locale]}
                      </p>

                      <div className="mb-8">
                        <h3 className="text-xs font-mono uppercase tracking-[0.14em] text-[#111318] mb-3">
                          {dict.workPage.featuresLabel}
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                          {project.features[locale].map((feature) => (
                            <li
                              key={feature}
                              className="text-sm text-[#777777] flex items-start gap-2"
                            >
                              <span className="w-1.5 h-1.5 bg-[#8291EA] mt-2 shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#111318]/10 flex flex-wrap items-center justify-between gap-4">
                      <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#777777]">
                        {project.status[locale]}
                      </span>
                      <Link
                        href={getLocalizedPath(`/work/${project.slug}`, locale)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111318] text-white text-xs font-medium tracking-wide hover:bg-[#8291EA] hover:text-[#111318] transition-colors"
                      >
                        <span>{dict.workPage.viewCaseStudy}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
