import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function Footer({ locale, dict }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: dict.nav.home, href: getLocalizedPath("/", locale) },
    { label: dict.nav.services, href: getLocalizedPath("/services", locale) },
    { label: dict.nav.work, href: getLocalizedPath("/work", locale) },
    { label: dict.nav.about, href: getLocalizedPath("/about", locale) },
    { label: dict.nav.contact, href: getLocalizedPath("/contact", locale) },
  ];

  const serviceLinks = dict.servicesPage.sections.map((s) => ({
    label: s.title,
    href: `${getLocalizedPath("/services", locale)}#${s.id}`,
  }));

  return (
    <footer className="bg-[#111318] text-white border-t border-white/10">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-10 pb-14 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col justify-between gap-6">
            <div>
              <Link
                href={getLocalizedPath("/", locale)}
                className="inline-block mb-5"
              >
                <BrandLogo variant="light" size="md" />
              </Link>
              <p className="text-white/75 text-base max-w-sm leading-relaxed">
                {dict.footer.statement}
              </p>
            </div>
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#8291EA]">
              {dict.footer.location}
            </p>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-mono uppercase tracking-[0.14em] text-white/45 mb-5">
              {dict.footer.navigationTitle}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 hover:text-[#8291EA] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.14em] text-white/45 mb-5">
              {dict.footer.servicesTitle}
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 hover:text-[#8291EA] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social Column */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-mono uppercase tracking-[0.14em] text-white/45 mb-5">
              {dict.footer.contactTitle}
            </h3>
            <div className="space-y-4">
              <a
                href={`mailto:${dict.contactPage.emailValue}`}
                className="block text-sm text-white/90 hover:text-[#8291EA] transition-colors break-all"
              >
                {dict.contactPage.emailValue}
              </a>
              <div className="flex flex-col gap-2.5 pt-2">
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#8291EA]" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#8291EA]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/50">
          <p>
            © {currentYear} {dict.footer.rights}
          </p>
          <div className="flex items-center gap-4 font-mono">
            <Link
              href={getLocalizedPath("/", "en")}
              className={`hover:text-white transition-colors ${
                locale === "en" ? "text-[#8291EA]" : ""
              }`}
            >
              English
            </Link>
            <span>/</span>
            <Link
              href={getLocalizedPath("/", "fr")}
              className={`hover:text-white transition-colors ${
                locale === "fr" ? "text-[#8291EA]" : ""
              }`}
            >
              Français
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
