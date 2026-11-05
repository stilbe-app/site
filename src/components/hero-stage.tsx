"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SiteScene, type SiteId } from "@/components/site-scene";

/** The sites the hero turns through, and the colours the mercury takes from each. */
const SLIDES: { id: SiteId; name: string; light: [string, string, string] }[] = [
  { id: "gmail", name: "Gmail", light: ["255 122 168", "138 99 255", "53 191 234"] },
  { id: "zillow", name: "Zillow", light: ["47 191 143", "53 191 234", "255 193 90"] },
  { id: "outlook", name: "Outlook", light: ["53 120 234", "53 191 234", "138 99 255"] },
  { id: "wikipedia", name: "Wikipedia", light: ["200 210 225", "53 191 234", "138 99 255"] },
  { id: "docs", name: "Google Docs", light: ["66 133 244", "47 191 143", "53 191 234"] },
  { id: "canvas", name: "Canvas", light: ["255 140 90", "255 193 90", "255 122 168"] },
];
const AUTOPLAY = 5200;

/** How far (0–1) the page has scrolled through `ref`, past its first screen. */
function useProgress(ref: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const read = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const run = r.height - innerHeight;
      setP(run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0);
    };
    read();
    addEventListener("scroll", read, { passive: true });
    addEventListener("resize", read);
    return () => {
      removeEventListener("scroll", read);
      removeEventListener("resize", read);
    };
  }, [ref]);
  return p;
}

/**
 * The hero, as Squarespace's: the mercury's light full bleed behind the
 * headline, the real sites in a carousel at its foot that turns by itself
 * (and with Previous and Next), the light taking each site's colours. It holds
 * while you scroll: the words go, the light dims, and the sites rise to fill
 * the screen.
 */
export function HeroStage({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const p = useProgress(section);
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (held || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setI((n) => n + 1), AUTOPLAY);
    return () => clearTimeout(timer);
  }, [i, held]);
  const n = SLIDES.length;
  const active = ((i % n) + n) % n;

  return (
    <section ref={section} className="relative h-[190vh] bg-[#0b1018] text-white" data-tone="dark">
      <div className="sticky top-0 h-screen overflow-clip">
        {/* The light, one per site, crossfading. */}
        {SLIDES.map((s, k) => (
          <div key={s.id} aria-hidden="true" className="absolute inset-0 transition-opacity duration-[1400ms]" style={{ opacity: k === active ? 1 : 0 }}>
            <div
              className="absolute top-[8%] left-1/2 size-[min(1500px,170vw)] -translate-x-1/2 rounded-full opacity-90 blur-[120px] motion-safe:animate-spin-slow"
              style={{ background: `conic-gradient(from 30deg, rgb(${s.light[0]} / 0.65), rgb(${s.light[1]} / 0.55), rgb(${s.light[2]} / 0.45), rgb(${s.light[0]} / 0.65))` }}
            />
          </div>
        ))}
        <div aria-hidden="true" className="absolute inset-0 bg-[#0b1018]" style={{ opacity: 0.25 + p * 0.7 }} />

        {/* The words, going as you scroll. */}
        <div className="relative px-6 pt-[clamp(110px,14vh,170px)] text-center" style={{ opacity: Math.max(0, 1 - p * 2.2), transform: `translateY(${-p * 120}px)` }}>
          {children}
        </div>

        {/* The sites, rising. */}
        <div
          className="absolute inset-x-0 bottom-0 h-[62vh] [perspective:1600px]"
          style={{ transform: `translateY(${(1 - p) * 26 - p * 14}vh) scale(${0.86 + p * 0.14})`, transformOrigin: "50% 100%" }}
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          aria-roledescription="carousel"
          aria-label={`The agent at work on ${SLIDES[active].name}`}
        >
          {SLIDES.map((s, k) => {
            // Where this one is from the middle: -2 … 3, wrapping round.
            let at = (k - active + n) % n;
            if (at > n / 2) at -= n;
            const shown = Math.abs(at) <= 1;
            return (
              <div
                key={s.id}
                className="absolute top-0 left-1/2 w-[min(64vw,980px)] transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.3,0.7,0.2,1)]"
                style={{
                  transform: `translateX(-50%) translateX(${at * 74}%) rotateY(${-at * 18}deg) scale(${at === 0 ? 1 : 0.78})`,
                  opacity: shown ? (at === 0 ? 1 : 0.7) : 0,
                  zIndex: 10 - Math.abs(at),
                  pointerEvents: shown ? "auto" : "none",
                }}
                aria-hidden={at !== 0}
              >
                <SiteScene site={s.id} playing={at === 0} className="shadow-[0_60px_120px_-30px_rgb(0_0_0/0.8)]" />
              </div>
            );
          })}
          <div className="absolute top-[-9%] right-[max(24px,6vw)] z-20 flex gap-2.5" style={{ opacity: Math.max(0, 1 - p * 3) }}>
            <button onClick={() => setI(i - 1)} aria-label="Previous site" className="size-14 rounded-full bg-white/90 text-[20px] text-ink shadow-[0_10px_30px_rgb(0_0_0/0.35)] hover:bg-white">‹</button>
            <button onClick={() => setI(i + 1)} className="h-14 rounded-full bg-white px-6.5 text-[18px] text-ink shadow-[0_10px_30px_rgb(0_0_0/0.35)] hover:scale-105" aria-label={`Next: ${SLIDES[(active + 1) % n].name}`}>
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
