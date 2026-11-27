import React from "react";
import type { Metadata } from "next";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { ScrollVideoStory } from "@/components/storytelling/ScrollVideoStory";
import { ExpertiseStory } from "@/components/storytelling/ExpertiseStory";
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
      {/* 1. CINEMATIC BRAND FILM — 4 scroll-synchronized scenes */}
      <ScrollVideoStory locale={locale} dict={dict} />

      {/* 2. CONCISE WHAT WE DO */}
      <ExpertiseStory locale={locale} dict={dict.home.services} />

      {/* 3. FINAL CONTACT SECTION */}
      <FinaleStory locale={locale} dict={dict} />
    </>
  );
}
