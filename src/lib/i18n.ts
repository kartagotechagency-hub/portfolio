export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isValidLocale(lang: string): lang is Locale {
  return locales.includes(lang as Locale);
}

export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const withoutLocale = cleanPath.replace(/^\/(en|fr)(\/|$)/, "/");
  const normalized = withoutLocale === "/" ? "" : withoutLocale;
  return `/${locale}${normalized}`;
}
