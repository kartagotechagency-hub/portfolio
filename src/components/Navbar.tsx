"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BrandLogo } from "./BrandLogo";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

interface NavbarProps {
  locale: Locale;
  dict: Dictionary;
}

export function Navbar({ locale, dict }: NavbarProps) {
  const pathname = usePathname() || `/${locale}`;
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { label: dict.nav.home, href: getLocalizedPath("/", locale), match: `/${locale}` },
    {
      label: dict.nav.services,
      href: getLocalizedPath("/services", locale),
      match: `/${locale}/services`,
    },
    {
      label: dict.nav.work,
      href: getLocalizedPath("/work", locale),
      match: `/${locale}/work`,
    },
    {
      label: dict.nav.about,
      href: getLocalizedPath("/about", locale),
      match: `/${locale}/about`,
    },
    {
      label: dict.nav.contact,
      href: getLocalizedPath("/contact", locale),
      match: `/${locale}/contact`,
    },
  ];

  const isActive = (match: string) => {
    if (match === `/${locale}`) {
      return pathname === `/${locale}` || pathname === "/";
    }
    return pathname.startsWith(match);
  };

  const enPath = getLocalizedPath(pathname, "en");
  const frPath = getLocalizedPath(pathname, "fr");

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F5F5F2]/90 backdrop-blur-md border-b border-[#111318]/10">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href={getLocalizedPath("/", locale)}
          className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8291EA]"
          aria-label="KartagoTech Agency Home"
        >
          <BrandLogo variant="dark" size="sm" />
        </Link>

        {/* Center/Right: Desktop Navigation */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-8 lg:gap-10"
        >
          {navItems.map((item) => {
            const active = isActive(item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[13px] tracking-[0.04em] uppercase font-medium transition-colors duration-200 py-1 ${
                  active
                    ? "text-[#111318]"
                    : "text-[#777777] hover:text-[#111318]"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#8291EA]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Language Switcher & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center border border-[#111318]/15 bg-white/60 text-[12px] font-mono"
            role="group"
            aria-label="Language switcher"
          >
            <Link
              href={enPath}
              className={`px-2.5 py-1.5 transition-colors ${
                locale === "en"
                  ? "bg-[#111318] text-white font-medium"
                  : "text-[#777777] hover:text-[#111318]"
              }`}
              aria-current={locale === "en" ? "page" : undefined}
            >
              EN
            </Link>
            <Link
              href={frPath}
              className={`px-2.5 py-1.5 transition-colors ${
                locale === "fr"
                  ? "bg-[#111318] text-white font-medium"
                  : "text-[#777777] hover:text-[#111318]"
              }`}
              aria-current={locale === "fr" ? "page" : undefined}
            >
              FR
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2 text-[#111318] border border-[#111318]/15 bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8291EA]"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? dict.nav.menuClose : dict.nav.menuOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-[#F5F5F2] border-b border-[#111318]/15"
          >
            <nav
              aria-label="Mobile"
              className="px-5 py-6 flex flex-col divide-y divide-[#111318]/10"
            >
              {navItems.map((item) => {
                const active = isActive(item.match);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`py-4 text-lg font-medium tracking-tight flex items-center justify-between ${
                      active ? "text-[#111318]" : "text-[#777777]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <span className="w-2 h-2 bg-[#8291EA]" />}
                  </Link>
                );
              })}
              <div className="pt-6">
                <Link
                  href={getLocalizedPath("/contact", locale)}
                  className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-[#8291EA] text-[#111318] font-medium text-sm tracking-wide hover:bg-[#6f80e5] transition-colors"
                >
                  {dict.nav.startProject}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
