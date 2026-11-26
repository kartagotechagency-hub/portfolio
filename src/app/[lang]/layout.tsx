import React from "react";
import { notFound } from "next/navigation";
import { isValidLocale, locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isValidLocale(params.lang)) {
    notFound();
  }

  const locale: Locale = params.lang;
  const dict = getDictionary(locale);

  return (
    <div lang={locale} className="flex flex-col min-h-screen">
      <Navbar locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
