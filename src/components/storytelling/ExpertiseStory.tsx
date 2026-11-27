import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/MotionPrimitives";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

interface ExpertiseStoryProps {
  locale: Locale;
  dict: Dictionary["home"]["services"];
}

const LABELS: Record<
  Locale,
  { problem: string; solution: string; value: string; learnMore: string }
> = {
  en: {
    problem: "Problem",
    solution: "Solution",
    value: "Client Value",
    learnMore: "Learn more",
  },
  fr: {
    problem: "Problème",
    solution: "Solution",
    value: "Valeur client",
    learnMore: "En savoir plus",
  },
};

const SERVICE_META: Record<
  string,
  Record<Locale, { problem: string; value: string }>
> = {
  "01": {
    en: {
      problem:
        "Slow, outdated websites fail to build trust or convert qualified visitors.",
      value:
        "Immediate brand credibility, search visibility, and higher lead conversion.",
    },
    fr: {
      problem:
        "Des sites lents ou datés peinent à inspirer confiance et à convertir les visiteurs.",
      value:
        "Crédibilité immédiate, visibilité SEO et meilleure conversion de prospects.",
    },
  },
  "02": {
    en: {
      problem:
        "Off-the-shelf tools force teams into fragmented spreadsheets and manual workarounds.",
      value:
        "Centralized business logic, fewer operational errors, and a durable owned asset.",
    },
    fr: {
      problem:
        "Les logiciels standards imposent des tableurs dispersés et des contournements manuels.",
      value:
        "Logique métier centralisée, moins d'erreurs et un actif durable qui vous appartient.",
    },
  },
  "03": {
    en: {
      problem:
        "Repetitive inquiries and manual triage drain capacity and delay customer responses.",
      value:
        "Faster response times and automated execution with reliable human guardrails.",
    },
    fr: {
      problem:
        "Les demandes répétitives et le tri manuel consomment du temps et ralentissent vos réponses.",
      value:
        "Réponses plus rapides et exécution automatisée avec des garde-fous fiables.",
    },
  },
  "04": {
    en: {
      problem:
        "Disconnected legacy systems and manual handoffs slow down the entire organization.",
      value:
        "Unified digital operations that replace friction with speed and accountability.",
    },
    fr: {
      problem:
        "Des outils cloisonnés et des transferts manuels freinent l'ensemble de l'organisation.",
      value:
        "Des opérations unifiées qui remplacent les frictions par la rapidité et la clarté.",
    },
  },
  "05": {
    en: {
      problem:
        "Hours are lost every week copying data across web portals, PDFs, and back-office tools.",
      value:
        "Deterministic execution that eliminates data-entry errors and frees team capacity.",
    },
    fr: {
      problem:
        "Des heures sont perdues chaque semaine à recopier des données entre portails et PDF.",
      value:
        "Exécution déterministe qui élimine les erreurs de saisie et libère vos équipes.",
    },
  },
};

export function ExpertiseStory({ locale, dict }: ExpertiseStoryProps) {
  const labels = LABELS[locale];

  return (
    <section
      className="py-20 sm:py-28 bg-[#F5F5F2] border-b border-[#111318]/10"
      id="services"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#8291EA] mb-3">
                {dict.label}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight leading-[1.08] text-[#111318] max-w-xl">
                {dict.title}
              </h2>
              <p className="mt-3 text-base text-[#777777] leading-relaxed max-w-lg">
                {dict.subtitle}
              </p>
            </div>
            <Link
              href={getLocalizedPath("/services", locale)}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#111318] hover:text-[#8291EA] transition-colors group shrink-0"
            >
              <span>{dict.exploreServices}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#111318]/10 border border-[#111318]/10">
          {dict.items.map((service, idx) => {
            const meta = SERVICE_META[service.index]?.[locale] ?? {
              problem: "",
              value: "",
            };
            return (
              <FadeIn
                key={service.index}
                delay={idx * 0.05}
                className="bg-white p-7 sm:p-8 flex flex-col justify-between group hover:bg-[#111318] transition-colors duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono text-[#8291EA]">
                      {service.index}
                    </span>
                    <Link
                      href={getLocalizedPath(service.href, locale)}
                      aria-label={`${labels.learnMore}: ${service.title}`}
                      className="text-[#111318]/30 group-hover:text-[#8291EA] transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <h3 className="font-display text-xl font-medium text-[#111318] group-hover:text-white mb-5 transition-colors">
                    <Link
                      href={getLocalizedPath(service.href, locale)}
                      className="group-hover:text-white"
                    >
                      {service.title}
                    </Link>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#8291EA] block mb-1">
                        {labels.problem}
                      </span>
                      <p className="text-sm text-[#777777] group-hover:text-white/65 leading-relaxed transition-colors">
                        {meta.problem}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#8291EA] block mb-1">
                        {labels.solution}
                      </span>
                      <p className="text-sm text-[#111318]/85 group-hover:text-white/85 leading-relaxed transition-colors">
                        {service.description}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#8291EA] block mb-1">
                        {labels.value}
                      </span>
                      <p className="text-sm text-[#111318] group-hover:text-white leading-relaxed font-medium transition-colors">
                        {meta.value}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href={getLocalizedPath(service.href, locale)}
                  className="inline-flex items-center gap-2 mt-7 pt-5 border-t border-[#111318]/10 group-hover:border-white/15 text-xs font-mono uppercase tracking-[0.14em] text-[#777777] group-hover:text-[#8291EA] transition-colors"
                >
                  <span>{labels.learnMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
