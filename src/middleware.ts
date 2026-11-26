import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "./lib/i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal Next.js routes, API routes, and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if pathname already starts with a supported locale
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (hasLocale) {
    return NextResponse.next();
  }

  // Rewrite default (English) unprefixed paths seamlessly to /en/...
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
