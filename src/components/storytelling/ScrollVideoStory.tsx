"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * Scroll-controlled cinematic story.
 *
 * - One tall "runway" gives the page its scroll length; a sticky 100svh stage stays pinned.
 * - Normal scrolling is never intercepted. Scroll progress (0..1) is split into 4 equal segments.
 * - Every scene has a poster <img> underneath and a muted, never-playing <video> on top whose
 *   currentTime is driven by scroll. A requestAnimationFrame loop does all DOM writes through refs,
 *   so React never re-renders while scrolling.
 * - The next scene is cross-faded in over the tail of the current one, while the current scene keeps
 *   rendering underneath, so no black frame is ever visible.
 */

const SCENE_COUNT = 4;
const FADE = 0.14; // portion of a segment used for the cross-fade into the next scene
const SEEK_EPSILON = 1 / 30;

interface Scene {
  id: "challenge" | "realization" | "transformation" | "growth";
  video: string;
  poster: string;
  posD: string; // object-position desktop
  posM: string; // object-position mobile (portrait crop)
  tag: Record<Locale, string>;
  title: Record<Locale, string>;
}

const SCENES: Scene[] = [
  {
    id: "challenge",
    video: "/videos/challenge.mp4",
    poster: "/images/story/challenge.webp",
    posD: "50% 30%",
    posM: "38% 30%",
    tag: { en: "THE CHALLENGE", fr: "LE DÉFI" },
    title: { en: "THE WORLD IS MOVING FORWARD.", fr: "LE MONDE AVANCE." },
  },
  {
    id: "realization",
    video: "/videos/realization.mp4",
    poster: "/images/story/realization.webp",
    posD: "50% 30%",
    posM: "26% 30%",
    tag: { en: "THE REALIZATION", fr: "LA PRISE DE CONSCIENCE" },
    title: { en: "IS YOUR BUSINESS?", fr: "ET VOTRE ENTREPRISE ?" },
  },
  {
    id: "transformation",
    video: "/videos/transformation.mp4",
    poster: "/images/story/transformation.webp",
    posD: "50% 30%",
    posM: "48% 30%",
    tag: { en: "THE TRANSFORMATION", fr: "LA TRANSFORMATION" },
    title: {
      en: "ADAPT. AUTOMATE. TRANSFORM.",
      fr: "ADAPTER. AUTOMATISER. TRANSFORMER.",
    },
  },
  {
    id: "growth",
    video: "/videos/growth.mp4",
    poster: "/images/story/growth.webp",
    posD: "50% 30%",
    posM: "42% 30%",
    tag: { en: "THE FUTURE", fr: "LE FUTUR" },
    title: { en: "BUILD SMARTER. MOVE FORWARD.", fr: "BUILD SMARTER. MOVE FORWARD." },
  },
];

const COPY = {
  en: {
    h1: "THE WORLD IS MOVING FORWARD. IS YOUR BUSINESS?",
    supporting:
      "Don't let outdated processes hold you back. Discover what technology, AI and automation can do for your business.",
    brand: "KARTAGOTECH — BUILD SMARTER. MOVE FORWARD.",
    scroll: "Scroll",
    chapters: "Story chapters",
  },
  fr: {
    h1: "LE MONDE AVANCE. ET VOTRE ENTREPRISE ?",
    supporting:
      "Ne laissez pas des processus dépassés vous freiner. Découvrez ce que la technologie, l'IA et l'automatisation peuvent apporter à votre entreprise.",
    brand: "KARTAGOTECH — BUILD SMARTER. MOVE FORWARD.",
    scroll: "Défiler",
    chapters: "Chapitres de l'histoire",
  },
} as const;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function ScrollVideoStory({ locale, dict }: Props) {
  const copy = COPY[locale];
  const { reducedMotion } = useMediaPreferences();

  const runwayRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const textRefs = useRef<Array<HTMLDivElement | null>>([]);
  const railRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const runway = runwayRef.current;
    if (!runway) return;

    const videos = videoRefs.current;
    const loaded = new Array(SCENE_COUNT).fill(false);
    const durations = new Array(SCENE_COUNT).fill(10);
    const cleanups: Array<() => void> = [];

    // Strategic loading: scene 0 immediately, scene N+1 when scene N becomes relevant.
    const load = (i: number) => {
      const v = videos[i];
      if (!v || i < 0 || i >= SCENE_COUNT || loaded[i]) return;
      loaded[i] = true;
      v.preload = "auto";
      v.src = SCENES[i].video;
      v.load();
    };

    videos.forEach((v, i) => {
      if (!v) return;
      const onMeta = () => {
        if (Number.isFinite(v.duration) && v.duration > 0) durations[i] = v.duration;
      };
      const onReady = () => {
        // Only reveal the video once a real frame is decodable; poster stays visible until then.
        v.dataset.ready = "true";
      };
      const onError = () => {
        v.dataset.ready = "false";
      };
      v.addEventListener("loadedmetadata", onMeta);
      v.addEventListener("loadeddata", onReady);
      v.addEventListener("error", onError);
      cleanups.push(() => {
        v.removeEventListener("loadedmetadata", onMeta);
        v.removeEventListener("loadeddata", onReady);
        v.removeEventListener("error", onError);
      });
    });

    load(0);
    const idle = (cb: () => void) => {
      const w = window as unknown as { requestIdleCallback?: (f: () => void) => number };
      if (w.requestIdleCallback) w.requestIdleCallback(cb);
      else window.setTimeout(cb, 1200);
    };
    idle(() => load(1));

    let raf = 0;
    let inView = true;
    let smoothed = -1;
    let lastActive = -1;

    const rawProgress = () => {
      const rect = runway.getBoundingClientRect();
      const scrollable = runway.offsetHeight - window.innerHeight;
      return scrollable <= 0 ? 0 : clamp(-rect.top / scrollable);
    };

    const tick = () => {
      raf = 0;
      const target = rawProgress();
      smoothed = smoothed < 0 ? target : smoothed + (target - smoothed) * 0.22;
      if (Math.abs(target - smoothed) < 0.0004) smoothed = target;
      const p = smoothed;

      const active = Math.min(SCENE_COUNT - 1, Math.floor(p * SCENE_COUNT));
      // Prefetch current, next and (for reverse scrolling) previous scenes.
      load(active);
      load(active + 1);
      load(active - 1);

      for (let i = 0; i < SCENE_COUNT; i++) {
        const layer = layerRefs.current[i];
        const video = videos[i];
        const text = textRefs.current[i];
        const segStart = i / SCENE_COUNT;
        const local = clamp((p - segStart) * SCENE_COUNT);

        // Layer opacity: scene i fades in over the tail of scene i-1; earlier scenes stay opaque beneath.
        if (layer) {
          const fadeIn =
            i === 0 ? 1 : smooth(clamp((p - (segStart - FADE / SCENE_COUNT)) / (FADE / SCENE_COUNT)));
          layer.style.opacity = String(fadeIn);
          // Scenes fully covered by the next one are hidden to spare compositing/decoding.
          const covered = i < SCENE_COUNT - 1 && p >= (i + 1) / SCENE_COUNT;
          layer.style.visibility = covered ? "hidden" : "visible";
        }

        // Scrub video currentTime. Skip while a seek is in flight so seeks never pile up.
        if (video && loaded[i] && video.readyState >= 1 && !video.seeking) {
          const dur = durations[i];
          const t = local * Math.max(0, dur - 0.05);
          if (Math.abs(video.currentTime - t) > SEEK_EPSILON) video.currentTime = t;
        }

        // Text overlay: staggered fade/translate based on local progress.
        if (text) {
          const items = text.querySelectorAll<HTMLElement>("[data-reveal]");
          const outStart = i === SCENE_COUNT - 1 ? 2 : 0.8; // last scene stays until the section ends
          const out = i === SCENE_COUNT - 1 ? 0 : smooth(clamp((local - outStart) / 0.14));
          items.forEach((el, k) => {
            const inT = i === 0 && k < 4 && p < 0.02 ? 1 : smooth(clamp((local - 0.04 - k * 0.035) / 0.1));
            const o = inT * (1 - out);
            el.style.opacity = o.toFixed(3);
            el.style.transform = `translate3d(0, ${((1 - inT) * 18 - out * 10).toFixed(1)}px, 0)`;
          });
          text.style.pointerEvents = local > 0.1 && local < 0.9 ? "auto" : "none";
          text.setAttribute("aria-hidden", local > 0.04 && local < 0.96 ? "false" : "true");
        }
      }

      if (active !== lastActive) {
        lastActive = active;
        railRefs.current.forEach((b, i) => b?.setAttribute("data-active", String(i === active)));
      }
      if (barRef.current) barRef.current.style.transform = `scaleY(${Math.max(0.02, p).toFixed(4)})`;
      if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - p * 18));

      // Keep animating while the smoothed value is catching up to the real scroll position.
      if (inView && smoothed !== target) schedule();
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => inView && schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) schedule();
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(runway);

    schedule();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      io.disconnect();
      cleanups.forEach((c) => c());
    };
  }, [reducedMotion]);

  const goTo = (i: number) => {
    const runway = runwayRef.current;
    if (!runway) return;
    const top = window.scrollY + runway.getBoundingClientRect().top;
    const scrollable = runway.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (scrollable * (i + 0.5)) / SCENE_COUNT, behavior: "smooth" });
  };

  const ctas = (
    <div className="flex flex-wrap items-center gap-3 mt-7">
      <Link
        href={getLocalizedPath("/contact", locale)}
        className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#8291EA] text-[#111318] font-medium text-sm tracking-wide hover:bg-[#6e7fe3] transition-colors"
      >
        <span>{dict.home.hero.primaryCta}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
      <a
        href="#agency-overview"
        className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/35 text-white font-medium text-sm tracking-wide hover:border-white transition-colors"
      >
        <span>{dict.home.services.exploreServices}</span>
        <ArrowDown className="w-4 h-4" />
      </a>
    </div>
  );

  // Reduced motion: static, accessible poster sequence. No video is loaded at all.
  if (reducedMotion) {
    return (
      <section className="bg-[#111318] text-white" aria-label={copy.h1}>
        <h1 className="sr-only">{copy.h1}</h1>
        {SCENES.map((s, i) => (
          <article key={s.id} className="relative min-h-[85svh] flex items-end overflow-hidden border-b border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.poster}
              alt=""
              width={1672}
              height={941}
              loading={i === 0 ? "eager" : "lazy"}
              className="story-media absolute inset-0 w-full h-full object-cover"
              style={{ ["--pos-d" as string]: s.posD, ["--pos-m" as string]: s.posM }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111318]/90 via-[#111318]/25 to-transparent" />
            <div className="relative z-10 max-w-[1360px] w-full mx-auto px-5 sm:px-8 lg:px-12 pb-12">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8291EA] mb-3">
                0{i + 1} / 0{SCENE_COUNT} — {s.tag[locale]}
              </p>
              <h2 className="font-display font-medium text-[clamp(2rem,5vw,4.2rem)] leading-[1.05] tracking-tight">
                {s.title[locale]}
              </h2>
              {i === 0 && <p className="mt-4 max-w-xl text-white/80">{copy.supporting}</p>}
              {i === SCENE_COUNT - 1 && ctas}
            </div>
          </article>
        ))}
      </section>
    );
  }

  return (
    <section aria-label={copy.h1}>
      <h1 className="sr-only">{copy.h1}</h1>
      <div ref={runwayRef} className="relative bg-[#111318] text-white h-[480svh] md:h-[440svh]">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#111318]">
          {/* Scenes */}
          {SCENES.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
              className="absolute inset-0 pointer-events-none"
              style={{ opacity: i === 0 ? 1 : 0, zIndex: i + 1 }}
              aria-hidden="true"
            >
              {/* Poster: first paint, loading placeholder and fallback if the video fails */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.poster}
                alt=""
                width={1672}
                height={941}
                fetchPriority={i === 0 ? "high" : "auto"}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="story-media absolute inset-0 w-full h-full object-cover"
                style={{ ["--pos-d" as string]: s.posD, ["--pos-m" as string]: s.posM }}
              />
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                muted
                playsInline
                preload="none"
                poster={s.poster}
                disablePictureInPicture
                tabIndex={-1}
                data-ready="false"
                className="story-media absolute inset-0 w-full h-full object-cover opacity-0 data-[ready=true]:opacity-100 transition-opacity duration-300"
                style={{ ["--pos-d" as string]: s.posD, ["--pos-m" as string]: s.posM }}
              />
            </div>
          ))}

          {/* Readability: soft bottom + left gradients, faces stay clear */}
          <div
            className="absolute inset-0 z-[10] pointer-events-none bg-gradient-to-t from-[#111318]/85 via-[#111318]/15 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 z-[10] pointer-events-none bg-gradient-to-r from-[#111318]/45 via-transparent to-transparent hidden md:block"
            aria-hidden="true"
          />

          {/* Text overlays (HTML, never baked into video) */}
          {SCENES.map((s, i) => {
            const last = i === SCENE_COUNT - 1;
            return (
              <div
                key={s.id}
                ref={(el) => {
                  textRefs.current[i] = el;
                }}
                className="absolute inset-x-0 bottom-0 z-[20] pointer-events-none"
                aria-hidden={i !== 0}
              >
                <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
                  <p
                    data-reveal
                    className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#8291EA] mb-3 opacity-0"
                  >
                    0{i + 1} / 0{SCENE_COUNT} — {s.tag[locale]}
                  </p>
                  <h2
                    data-reveal
                    className="font-display font-medium text-white text-[clamp(1.9rem,5.2vw,4.6rem)] leading-[1.04] tracking-tight max-w-4xl opacity-0"
                  >
                    {s.title[locale]}
                  </h2>
                  {i === 0 && (
                    <p data-reveal className="mt-4 max-w-xl text-sm sm:text-base text-white/80 leading-relaxed opacity-0">
                      {copy.supporting}
                    </p>
                  )}
                  {last && (
                    <>
                      <p
                        data-reveal
                        className="mt-4 text-xs sm:text-sm font-mono uppercase tracking-[0.18em] text-white/75 opacity-0"
                      >
                        {copy.brand}
                      </p>
                      <div data-reveal className="opacity-0">
                        {ctas}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Chapter rail */}
          <nav
            aria-label={copy.chapters}
            className="hidden md:flex absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 z-[30] flex-col items-end gap-4"
          >
            <div className="w-[2px] h-20 bg-white/20 relative overflow-hidden">
              <div ref={barRef} className="absolute inset-0 bg-[#8291EA] origin-top" style={{ transform: "scaleY(0.02)" }} />
            </div>
            {SCENES.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  railRefs.current[i] = el;
                }}
                type="button"
                data-active={i === 0}
                onClick={() => goTo(i)}
                aria-label={s.tag[locale]}
                className="group flex items-center gap-3 opacity-50 hover:opacity-100 data-[active=true]:opacity-100 transition-opacity"
              >
                <span className="hidden lg:inline text-[10px] font-mono uppercase tracking-[0.16em] text-white/80">
                  {s.tag[locale]}
                </span>
                <span className="block w-2 h-2 bg-white/60 group-data-[active=true]:bg-[#8291EA] transition-colors" />
              </button>
            ))}
          </nav>

          {/* Scroll hint */}
          <div
            ref={hintRef}
            className="absolute left-1/2 -translate-x-1/2 bottom-5 z-[30] flex flex-col items-center gap-1 text-white/70 pointer-events-none"
            aria-hidden="true"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.22em]">{copy.scroll}</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </section>
  );
}
