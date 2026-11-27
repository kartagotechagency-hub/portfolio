"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * KartagoTech — 4-Chapter Cinematic Scroll Story
 *
 * Architecture:
 * - One tall "runway" (480svh) gives scroll length. A sticky 100svh stage stays pinned.
 * - Native scroll is NEVER intercepted. Scroll progress (0–1) maps across 4 equal segments.
 * - Each scene has a poster <img> (first paint / fallback) + a muted <video> whose
 *   currentTime is scrubbed via rAF — zero autoplay, zero layout shift.
 * - Cross-fade is handled via CSS opacity driven from rAF. No GSAP dependency.
 * - All DOM writes go through refs so React never re-renders during scroll.
 * - Scenes 1-4 exactly match the 4 video/image assets.
 */

const SCENE_COUNT = 4;
const FADE = 0.15; // fraction of one segment used for the cross-fade into the next scene
const SEEK_EPSILON = 1 / 30; // skip seek if already within one frame
const SMOOTH_K = 0.2; // scroll-progress lerp coefficient (higher = snappier)

interface Scene {
  id: string;
  video: string;
  poster: string;
  posD: string; // object-position on desktop
  posM: string; // object-position on mobile (portrait crop, keep faces in frame)
  tag: Record<Locale, string>;
  headline: Record<Locale, string>;
  body: Record<Locale, string>;
}

const SCENES: Scene[] = [
  {
    id: "challenge",
    video: "/videos/challenge.mp4",
    poster: "/images/story/challenge.webp",
    posD: "50% 30%",
    posM: "40% 25%",
    tag: { en: "THE CHALLENGE", fr: "LE DÉFI" },
    headline: {
      en: "THE WORLD IS MOVING FORWARD.",
      fr: "LE MONDE AVANCE.",
    },
    body: {
      en: "Technology, AI and automation are changing how businesses operate. It's time to move forward.",
      fr: "La technologie, l'IA et l'automatisation transforment le fonctionnement des entreprises. Il est temps d'avancer.",
    },
  },
  {
    id: "realization",
    video: "/videos/realization.mp4",
    poster: "/images/story/realization.webp",
    posD: "50% 30%",
    posM: "28% 25%",
    tag: { en: "THE REALIZATION", fr: "LA PRISE DE CONSCIENCE" },
    headline: {
      en: "IS YOUR BUSINESS?",
      fr: "ET VOTRE ENTREPRISE ?",
    },
    body: {
      en: "Technology, AI and automation are no longer reserved for large corporations. They are practical tools that any ambitious business can use today.",
      fr: "La technologie, l'IA et l'automatisation ne sont plus réservées aux grandes entreprises. Ce sont des outils concrets que toute entreprise ambitieuse peut utiliser dès aujourd'hui.",
    },
  },
  {
    id: "transformation",
    video: "/videos/transformation.mp4",
    poster: "/images/story/transformation.webp",
    posD: "50% 30%",
    posM: "50% 25%",
    tag: { en: "THE TRANSFORMATION", fr: "LA TRANSFORMATION" },
    headline: {
      en: "ADAPT. AUTOMATE. TRANSFORM.",
      fr: "ADAPTER. AUTOMATISER. TRANSFORMER.",
    },
    body: {
      en: "Custom software, intelligent workflows and connected digital tools replace manual friction — so your team can focus on what matters.",
      fr: "Des logiciels sur mesure, des workflows intelligents et des outils digitaux connectés remplacent les frictions manuelles — pour que votre équipe se concentre sur l'essentiel.",
    },
  },
  {
    id: "growth",
    video: "/videos/growth.mp4",
    poster: "/images/story/growth.webp",
    posD: "50% 30%",
    posM: "44% 25%",
    tag: { en: "GROWTH", fr: "CROISSANCE" },
    headline: {
      en: "BUILD SMARTER. MOVE FORWARD.",
      fr: "CONSTRUIRE MIEUX. AVANCER.",
    },
    body: {
      en: "An organized operation, better customer experiences and the capacity to scale — that's what the right technology partner makes possible.",
      fr: "Une opération organisée, de meilleures expériences clients et la capacité de grandir — voilà ce que rend possible le bon partenaire technologique.",
    },
  },
];

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (t: number) => t * t * (3 - 2 * t); // smoothstep

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function ScrollVideoStory({ locale, dict }: Props) {
  const { reducedMotion } = useMediaPreferences();

  const runwayRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const textRefs = useRef<Array<HTMLDivElement | null>>([]);
  const railBtnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const runway = runwayRef.current;
    if (!runway) return;

    const videos = videoRefs.current;
    const loaded = new Array(SCENE_COUNT).fill(false);
    const durations = new Array(SCENE_COUNT).fill(10);
    const cleanup: Array<() => void> = [];

    // Strategic prefetch: load scene 0 immediately, others on demand
    const loadScene = (i: number) => {
      const v = videos[i];
      if (!v || loaded[i] || i < 0 || i >= SCENE_COUNT) return;
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
      const onReady = () => { v.dataset.ready = "true"; };
      const onError = () => { v.dataset.ready = "false"; };
      v.addEventListener("loadedmetadata", onMeta);
      v.addEventListener("loadeddata", onReady);
      v.addEventListener("error", onError);
      cleanup.push(() => {
        v.removeEventListener("loadedmetadata", onMeta);
        v.removeEventListener("loadeddata", onReady);
        v.removeEventListener("error", onError);
      });
    });

    loadScene(0);
    // Idle-load scene 1 so it's ready on first scroll
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idleId = win.requestIdleCallback
      ? win.requestIdleCallback(() => loadScene(1))
      : win.setTimeout(() => loadScene(1), 1200);
    cleanup.push(() => {
      if (win.cancelIdleCallback) win.cancelIdleCallback(idleId);
      else win.clearTimeout(idleId);
    });

    let raf = 0;
    let inView = true;
    let smoothP = -1;
    let lastActive = -1;

    const rawProgress = () => {
      const rect = runway.getBoundingClientRect();
      const scrollable = runway.offsetHeight - window.innerHeight;
      return scrollable <= 0 ? 0 : clamp(-rect.top / scrollable);
    };

    const tick = () => {
      raf = 0;
      const target = rawProgress();
      smoothP = smoothP < 0 ? target : smoothP + (target - smoothP) * SMOOTH_K;
      if (Math.abs(target - smoothP) < 0.0003) smoothP = target;
      const p = smoothP;

      const active = Math.min(SCENE_COUNT - 1, Math.floor(p * SCENE_COUNT));

      // Prefetch current + adjacent scenes
      loadScene(active);
      loadScene(active + 1);
      loadScene(active - 1);

      for (let i = 0; i < SCENE_COUNT; i++) {
        const layer = layerRefs.current[i];
        const video = videos[i];
        const text = textRefs.current[i];

        const segStart = i / SCENE_COUNT;
        const segEnd = (i + 1) / SCENE_COUNT;
        const local = clamp((p - segStart) * SCENE_COUNT); // 0–1 within this segment

        // ---- Layer opacity: fade-in at segment entry, hidden when fully covered ----
        if (layer) {
          const fadeInPoint = segStart - FADE / SCENE_COUNT;
          const fadeIn = i === 0 ? 1 : ease(clamp((p - fadeInPoint) / (FADE / SCENE_COUNT)));
          layer.style.opacity = String(fadeIn);
          // Hide completed scene only if fully covered by next
          const covered = i < SCENE_COUNT - 1 && p >= segEnd;
          layer.style.visibility = covered ? "hidden" : "visible";
        }

        // ---- Scrub video currentTime ----
        if (video && loaded[i] && video.readyState >= 1 && !video.seeking) {
          const dur = durations[i];
          const targetT = local * Math.max(0, dur - 0.05);
          if (Math.abs(video.currentTime - targetT) > SEEK_EPSILON) {
            video.currentTime = targetT;
          }
        }

        // ---- Text reveal / hide ----
        if (text) {
          const items = text.querySelectorAll<HTMLElement>("[data-reveal]");
          // Last scene stays visible until section ends
          const outStart = i === SCENE_COUNT - 1 ? 1.5 : 0.78;
          const outDur = i === SCENE_COUNT - 1 ? 0 : 0.14;
          const fadeOut = i === SCENE_COUNT - 1 ? 0 : ease(clamp((local - outStart) / outDur));
          items.forEach((el, k) => {
            const inStart = i === 0 && k < 4 && p < 0.03 ? 0 : 0.04 + k * 0.04;
            const inT = ease(clamp((local - inStart) / 0.12));
            const o = inT * (1 - fadeOut);
            el.style.opacity = o.toFixed(3);
            el.style.transform = `translate3d(0, ${((1 - inT) * 20 - fadeOut * 12).toFixed(1)}px, 0)`;
          });
          text.style.pointerEvents = local > 0.08 && local < 0.92 ? "auto" : "none";
          text.setAttribute("aria-hidden", local > 0.05 && local < 0.95 ? "false" : "true");
        }
      }

      // ---- Chapter rail ----
      if (active !== lastActive) {
        lastActive = active;
        railBtnRefs.current.forEach((btn, i) => {
          if (!btn) return;
          btn.setAttribute("data-active", String(i === active));
        });
      }

      // ---- Progress bar ----
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleY(${Math.max(0.02, p).toFixed(4)})`;
      }

      // ---- Scroll hint (fades out after small scroll) ----
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(clamp(1 - p * 20));
      }

      // Keep animating while catching up
      if (inView && smoothP !== target) schedule();
    };

    const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const onScroll = () => { if (inView) schedule(); };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) schedule();
      },
      { rootMargin: "120px 0px" }
    );
    io.observe(runway);
    schedule();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      io.disconnect();
      cleanup.forEach((fn) => fn());
    };
  }, [reducedMotion]);

  const goToScene = (i: number) => {
    const runway = runwayRef.current;
    if (!runway) return;
    const top = window.scrollY + runway.getBoundingClientRect().top;
    const scrollable = runway.offsetHeight - window.innerHeight;
    const target = top + (scrollable * (i + 0.5)) / SCENE_COUNT;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const finalCTAs = (
    <div className="flex flex-wrap items-center gap-3 mt-7" data-reveal>
      <Link
        href={getLocalizedPath("/contact", locale)}
        className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#8291EA] text-[#111318] font-medium text-sm tracking-wide hover:bg-[#6e7fe3] transition-colors"
      >
        <span>{dict.home.hero.primaryCta}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
      <a
        href="#services"
        className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/35 text-white font-medium text-sm tracking-wide hover:border-white/70 transition-colors"
      >
        <span>{dict.home.services.exploreServices}</span>
        <ArrowDown className="w-4 h-4" />
      </a>
    </div>
  );

  // ── Reduced-motion / no-JS fallback: static poster sequence ──────────────
  if (reducedMotion) {
    return (
      <section className="bg-[#111318] text-white" aria-label={SCENES[0].headline[locale]}>
        <h1 className="sr-only">
          {SCENES[0].headline[locale]} {SCENES[1].headline[locale]}
        </h1>
        {SCENES.map((s, i) => (
          <article
            key={s.id}
            className="relative min-h-[85svh] flex items-end overflow-hidden border-b border-white/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.poster}
              alt=""
              width={1672}
              height={941}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="story-media absolute inset-0 w-full h-full object-cover"
              style={
                {
                  "--pos-d": s.posD,
                  "--pos-m": s.posM,
                } as React.CSSProperties
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111318]/90 via-[#111318]/25 to-transparent" />
            <div className="relative z-10 max-w-[1360px] w-full mx-auto px-5 sm:px-8 lg:px-12 pb-14">
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#8291EA] mb-3">
                0{i + 1} / 0{SCENE_COUNT} — {s.tag[locale]}
              </p>
              <h2 className="font-display font-medium text-[clamp(2rem,5.5vw,4.4rem)] leading-[1.04] tracking-tight text-white mb-3">
                {s.headline[locale]}
              </h2>
              <p className="text-base text-white/75 max-w-lg leading-relaxed">
                {s.body[locale]}
              </p>
              {i === SCENE_COUNT - 1 && finalCTAs}
            </div>
          </article>
        ))}
      </section>
    );
  }

  // ── Full cinematic scroll experience ─────────────────────────────────────
  return (
    <section aria-label={`${SCENES[0].headline[locale]} ${SCENES[1].headline[locale]}`}>
      <h1 className="sr-only">
        {SCENES[0].headline[locale]} {SCENES[1].headline[locale]}
      </h1>

      {/* Runway — provides scroll length without layout shift */}
      <div
        ref={runwayRef}
        className="relative bg-[#111318] text-white"
        style={{ height: `${SCENE_COUNT * 120}svh` }}
      >
        {/* Sticky cinematic stage */}
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#111318]">

          {/* Scene layers */}
          {SCENES.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => { layerRefs.current[i] = el; }}
              className="absolute inset-0 pointer-events-none"
              style={{ opacity: i === 0 ? 1 : 0, zIndex: i + 1 }}
              aria-hidden="true"
            >
              {/* Poster — shown until video is decoded */}
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
                style={
                  {
                    "--pos-d": s.posD,
                    "--pos-m": s.posM,
                  } as React.CSSProperties
                }
              />
              {/* Video — scrubbed via rAF, fades in once ready */}
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                muted
                playsInline
                preload="none"
                poster={s.poster}
                disablePictureInPicture
                tabIndex={-1}
                data-ready="false"
                className="story-media absolute inset-0 w-full h-full object-cover opacity-0 data-[ready=true]:opacity-100 transition-opacity duration-500"
                style={
                  {
                    "--pos-d": s.posD,
                    "--pos-m": s.posM,
                  } as React.CSSProperties
                }
              />
            </div>
          ))}

          {/* Cinematic gradients — keep faces clear, text readable */}
          <div
            className="absolute inset-0 z-[10] pointer-events-none bg-gradient-to-t from-[#111318]/88 via-[#111318]/18 to-[#111318]/32"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 z-[10] pointer-events-none bg-gradient-to-r from-[#111318]/50 via-transparent to-transparent hidden md:block"
            aria-hidden="true"
          />

          {/* Text overlays — one per scene */}
          {SCENES.map((s, i) => {
            const isLast = i === SCENE_COUNT - 1;
            return (
              <div
                key={s.id}
                ref={(el) => { textRefs.current[i] = el; }}
                className="absolute inset-x-0 bottom-0 z-[20] pointer-events-none"
                aria-hidden={i !== 0}
              >
                <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
                  {/* Chapter label */}
                  <p
                    data-reveal
                    className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.24em] text-[#8291EA] mb-3 opacity-0"
                  >
                    0{i + 1} / 0{SCENE_COUNT} — {s.tag[locale]}
                  </p>

                  {/* Main headline */}
                  {i === 0 ? (
                    <>
                      <h2
                        data-reveal
                        className="font-display font-medium text-white text-[clamp(2.4rem,6vw,5.2rem)] leading-[1.02] tracking-tight opacity-0"
                      >
                        {s.headline[locale]}
                      </h2>
                      <h2
                        data-reveal
                        className="font-display font-medium text-[#8291EA] text-[clamp(2.4rem,6vw,5.2rem)] leading-[1.02] tracking-tight opacity-0"
                      >
                        {SCENES[1].headline[locale]}
                      </h2>
                    </>
                  ) : (
                    <h2
                      data-reveal
                      className="font-display font-medium text-white text-[clamp(2.2rem,5.5vw,4.8rem)] leading-[1.03] tracking-tight max-w-4xl opacity-0"
                    >
                      {s.headline[locale]}
                    </h2>
                  )}

                  {/* Supporting copy */}
                  <p
                    data-reveal
                    className="mt-4 max-w-xl text-sm sm:text-base text-white/75 leading-relaxed opacity-0"
                  >
                    {s.body[locale]}
                  </p>

                  {/* Final scene CTAs */}
                  {isLast && finalCTAs}

                  {/* Brand signature on last scene */}
                  {isLast && (
                    <p
                      data-reveal
                      className="mt-6 text-[11px] font-mono uppercase tracking-[0.2em] text-white/45 opacity-0"
                    >
                      KARTAGOTECH — BUILD SMARTER. MOVE FORWARD.
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Chapter navigation rail (right side) */}
          <nav
            aria-label="Story chapters"
            className="hidden md:flex absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 z-[30] flex-col items-end gap-4"
          >
            {/* Vertical progress bar */}
            <div className="w-[2px] h-20 bg-white/15 relative overflow-hidden mb-1">
              <div
                ref={progressBarRef}
                className="absolute inset-0 bg-[#8291EA] origin-top"
                style={{ transform: "scaleY(0.02)" }}
              />
            </div>

            {SCENES.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => { railBtnRefs.current[i] = el; }}
                type="button"
                data-active={i === 0}
                onClick={() => goToScene(i)}
                aria-label={s.tag[locale]}
                className="group flex items-center gap-3 opacity-45 hover:opacity-100 data-[active=true]:opacity-100 transition-opacity"
              >
                <span className="hidden lg:inline text-[10px] font-mono uppercase tracking-[0.16em] text-white/80 group-data-[active=true]:text-white transition-colors">
                  {s.tag[locale]}
                </span>
                <span className="block w-2 h-2 bg-white/50 group-data-[active=true]:bg-[#8291EA] transition-colors" />
              </button>
            ))}
          </nav>

          {/* Scroll hint */}
          <div
            ref={scrollHintRef}
            className="absolute left-1/2 -translate-x-1/2 bottom-6 z-[30] flex flex-col items-center gap-1.5 text-white/55 pointer-events-none"
            aria-hidden="true"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.24em]">Scroll</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
