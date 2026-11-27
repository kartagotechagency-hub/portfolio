/**
 * CinematicStoryPage — thin server component wrapper.
 * Renders the client-side CinematicStory with the Navbar + Footer shell.
 */
import React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

// CinematicStory uses GSAP + browser APIs, must be client-only
const CinematicStory = dynamic(
  () =>
    import("./CinematicStory").then((mod) => mod.CinematicStory),
  { ssr: false }
);

interface CinematicStoryPageProps {
  locale: Locale;
  dict: Dictionary;
}

export function CinematicStoryPage({ locale, dict }: CinematicStoryPageProps) {
  return (
    <div className="min-h-screen bg-[#111318] flex flex-col">
      <Navbar locale={locale} dict={dict} />
      <main className="flex-1">
        <CinematicStory locale={locale} dict={dict} />
      </main>
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
