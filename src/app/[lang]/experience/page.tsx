import React from "react";
import type { Metadata } from "next";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { HeadquartersExperience } from "@/components/architecture/HeadquartersExperience";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale: Locale = isValidLocale(params.lang) ? params.lang : "en";
  const dict = getDictionary(locale);

  return {
    title:
      locale === "fr"
        ? "Siège 3D — KartagoTech Agency"
        : "3D Headquarters — KartagoTech Agency",
    description: dict.meta.defaultDescription,
    alternates: {
      canonical: `/${locale}/experience`,
      languages: {
        en: "/en/experience",
        fr: "/fr/experience",
      },
    },
  };
}

export default function ExperiencePage({
  params,
}: {
  params: { lang: string };
}) {
  if (!isValidLocale(params.lang)) {
    notFound();
  }

  const locale: Locale = params.lang;
  const dict = getDictionary(locale);

  return <HeadquartersExperience locale={locale} dict={dict} />;
}
