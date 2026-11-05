"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AgentFace } from "@/components/agent-face";

const NAME = "Fern";
const ASKED = "Find two-beds under £2,400 near Farringdon, and check which allow a cat.";
const QUERY = "2 bed · Farringdon · under £2,400";
const ANSWER = "Two fit. Amwell Street is £2,350, 12 minutes' walk, and allows cats. Exmouth Market is cheaper, but says no pets.";

/** The scene is drawn at this size and scaled to fit, so every position is in its pixels. */
const W = 1100;
const H = 620;
/** One run through, then it starts again. */
const LOOP = 17000;

const LISTINGS = [
  { street: "Amwell Street", price: "£2,350", walk: "12 min", pets: "Cats allowed", ok: true, sky: "#cfe3f5", wall: "#e9c9a5" },
  { street: "Exmouth Market", price: "£2,180", walk: "8 min", pets: "No pets", ok: false, sky: "#dfe8f0", wall: "#c9b7a6" },
  { street: "Percy Circus", price: "£2,395", walk: "15 min", pets: "Cats allowed", ok: true, sky: "#d8e9e2", wall: "#d8bfa8" },
];

/** Where the agent's cursor goes, and what its label says, through one run (ms). */
const MOVES: { at: number; x: number; y: number; label: string }[] = [
  { at: 0, x: 520, y: 300, label: "Reading the page" },
  { at: 1200, x: 300, y: 112, label: "Typing in Search" },
  { at: 4300, x: 250, y: 228, label: "Opening Amwell Street" },
  { at: 5100, x: 250, y: 352, label: "Opening Exmouth Market" },
  { at: 5900, x: 250, y: 476, label: "Opening Percy Circus" },
  { at: 7000, x: 560, y: 262, label: "Reading the pet policy" },
  { at: 8300, x: 560, y: 386, label: "Reading the pet policy" },
  { at: 9600, x: 560, y: 510, label: "Reading the pet policy" },
  { at: 11000, x: 420, y: 224, label: "Checking the walk" },
];
const DONE = 12400;

const STEPS = [
  { at: 4200, text: "Searched two-beds under £2,400 near Farringdon" },
  { at: 6600, text: "Opened 3 listings in tabs of its own" },
  { at: 10800, text: "Read each one's pet policy" },
  { at: DONE, text: "Checked the walk to Farringdon from each" },
];

const MOTION = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (changed: () => void) => {
  const query = matchMedia(MOTION);
  query.addEventListener("change", changed);
  return () => query.removeEventListener("change", changed);
};
const prefersStill = () => matchMedia(MOTION).matches;

/** The scene's own clock, looping; held at the finished frame for reduced motion. */
function useClock(still: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (still) return;
    const start = performance.now();
    let frame = 0;
    let last = -1;
    const tick = (now: number) => {
      // A tenth of a second is fine enough, and keeps renders few.
      const at = Math.floor(((now - start) % LOOP) / 100) * 100;
      if (at !== last) {
        last = at;
        setT(at);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [still]);
  return still ? DONE + 2000 : t;
}

/** Scales the fixed-size scene to its box. */
function useFit() {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const watch = new ResizeObserver(() => setScale(el.clientWidth / W));
    watch.observe(el);
    return () => watch.disconnect();
  }, []);
  return { box, scale };
}

/**
 * A Stilbe window with the agent at work in it, as the app shows it: its face
 * is its cursor, labelled with what it's doing, gliding to the search box,
 * typing, opening listings into tabs gathered under its face, reading each
 * one; its card in the corner keeps up step by step, then answers. Drawn, so
 * it's sharp at any size, and it loops. Still, on the finished frame, for
 * reduced motion.
 */
export function AgentAtWork({ tone = "light" }: { tone?: "light" | "dark" }) {
  const still = useSyncExternalStore(subscribeMotion, prefersStill, () => false);
  const t = useClock(still);
  const { box, scale } = useFit();

  const working = t < DONE;
  const move = [...MOVES].reverse().find((m) => t >= m.at) ?? MOVES[0];
  const typed = QUERY.slice(0, Math.max(0, Math.min(QUERY.length, Math.floor((t - 1900) / 70))));
  const typing = t >= 1700 && t < 4300;
  const results = t >= 3900;
  const tabs = LISTINGS.filter((_, i) => t >= 4600 + i * 800).length;
  const read = (i: number) => t >= 7700 + i * 1300;
  const chosen = t >= 11000;
  const steps = STEPS.filter((s) => t >= s.at);
  const cursorShown = t > 300 && t < DONE + 600;
  const frame = tone === "dark" ? "#1b2029" : "#e7eaee";
  const strip = tone === "dark" ? "#262b34" : "#f3f5f7";
  const stripInk = tone === "dark" ? "#d7dde6" : "#14171c";

  return (
    <figure className="m-0" aria-label={`Stilbe, with its agent ${NAME} finding a flat: it searches, opens three listings in tabs of its own, reads each pet policy, and answers.`}>
      <div ref={box} className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }} aria-hidden="true">
        <div
          className="absolute top-0 left-0 overflow-hidden rounded-[14px] shadow-[0_40px_80px_-40px_rgb(20_23_28/0.45),0_0_0_1px_rgb(20_23_28/0.08)]"
          style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "0 0", background: frame }}
        >
          {/* Tabs on top: the site, then the agent's group filling as it opens listings. */}
          <div className="flex h-[44px] items-end gap-1 px-3">
            <div className="flex gap-[7px] pr-2.5 pb-3.5 pl-1">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex h-[34px] w-[200px] items-center gap-2 rounded-t-[10px] px-3.5 text-[12.5px]" style={{ background: strip, color: stripInk }}>
              <span className="size-3.5 rounded bg-[#5bbf8a]" />
              Homes near Clerkenwell
            </div>
            {tabs > 0 && (
              <div className="flex h-[34px] items-center gap-1.5 pl-2">
                <span className="flex h-[22px] items-center gap-1.5 rounded-full bg-[#35bfea]/20 pr-2.5 pl-1 text-[11.5px] font-medium text-[#0d86b5]">
                  <AgentFace name={NAME} size={16} mood={working ? "thinking" : "happy"} />
                  Flat hunt
                </span>
                {LISTINGS.slice(0, tabs).map((l) => (
                  <span
                    key={l.street}
                    className="flex h-[28px] w-[118px] items-center gap-1.5 rounded-t-[8px] px-2.5 text-[11.5px] motion-safe:animate-arrive"
                    style={{ background: strip, color: stripInk, boxShadow: "inset 0 2px 0 #35bfea" }}
                  >
                    <span className="size-3 shrink-0 rounded bg-[#5bbf8a]" />
                    <span className="truncate">{l.street}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex h-[44px] items-center gap-2.5 px-3" style={{ background: strip }}>
            <div className="flex gap-3.5 px-1.5 text-[14px] text-[#7c8591]">
              <span>‹</span>
              <span>›</span>
            </div>
            <div className="flex h-[30px] flex-1 items-center rounded-full bg-[#e6e9ed] px-3.5 text-[13px] text-[#4f5661]">homes.example/rent/clerkenwell</div>
          </div>

          {/* The page, with the glint round it while the agent works. */}
          <div
            className="relative bg-white transition-shadow duration-700"
            style={{ height: H - 88, boxShadow: working ? "inset 0 0 0 2px #35bfea, inset 0 0 26px 2px rgb(53 191 234 / 0.22)" : "none" }}
          >
            <div className="absolute top-0 left-0 w-[680px] px-10 pt-7">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-[#1d6b4b]">
                <span className="size-5 rounded-md bg-[#5bbf8a]" />
                Homes
              </div>
              {/* The search box, typed into. */}
              <div
                className={`mt-4 flex h-[46px] items-center rounded-xl border px-4 text-[15px] transition-colors ${
                  typing ? "border-[#35bfea] shadow-[0_0_0_4px_rgb(53_191_234/0.15)]" : "border-[#dfe3e8]"
                }`}
              >
                {typed ? <span className="text-[#14171c]">{typed}</span> : <span className="text-[#9aa2ad]">Where do you want to live?</span>}
                {typing && <span className="ml-px h-5 w-px animate-pulse bg-[#14171c]" />}
              </div>
              {/* The listings, as the search brings them. */}
              <div className="mt-4 flex flex-col gap-3">
                {LISTINGS.map((l, i) => (
                  <div
                    key={l.street}
                    className={`flex h-[112px] gap-4 rounded-2xl p-2.5 transition-all duration-500 ${results ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"} ${
                      chosen && i === 0 ? "shadow-[0_0_0_2px_#35bfea]" : "shadow-[0_0_0_1px_#e8ebef]"
                    }`}
                    style={{ transitionDelay: results ? `${i * 120}ms` : "0ms" }}
                  >
                    {/* A house, drawn. */}
                    <div className="relative w-[150px] shrink-0 overflow-hidden rounded-xl" style={{ background: l.sky }}>
                      <div className="absolute right-3 bottom-0 left-3 h-[58%] rounded-t-sm" style={{ background: l.wall }} />
                      <div className="absolute bottom-[58%] left-3 h-0 w-0 border-r-[62px] border-b-[22px] border-l-[62px] border-r-transparent border-b-[#8b5a4a] border-l-transparent" />
                      <div className="absolute bottom-3 left-7 size-5 rounded-sm bg-white/80" />
                      <div className="absolute right-7 bottom-3 size-5 rounded-sm bg-white/80" />
                      <div className="absolute bottom-0 left-1/2 h-8 w-5 -translate-x-1/2 rounded-t-sm bg-[#4a5a6b]" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
                      <div className="text-[15px] font-semibold text-[#14171c]">{l.street}</div>
                      <div className="text-[13px] text-[#4f5661]">
                        2 bed flat · {l.price} a month · {l.walk} to Farringdon
                      </div>
                      <div
                        className={`self-start rounded-full px-2.5 py-0.5 text-[12px] font-medium transition-opacity duration-500 ${read(i) ? "opacity-100" : "opacity-0"} ${
                          l.ok ? "bg-[#e3f4e8] text-[#17603a]" : "bg-[#fbe6e6] text-[#9b2c2c]"
                        }`}
                      >
                        {l.pets}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The agent's card over the page's corner. */}
            <div className="absolute right-5 bottom-5 flex w-[360px] flex-col gap-2.5 rounded-[18px] bg-white p-4 text-left text-[#14171c] shadow-[0_0_0_1px_rgb(0_0_0/0.1),0_18px_40px_-18px_rgb(20_23_28/0.3)]">
              <div className="flex items-center gap-2.5">
                <AgentFace name={NAME} size={28} mood={working ? "thinking" : "happy"} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-medium">{NAME}</div>
                  <div className="text-[11.5px] text-[#0d86b5]">{working ? "Working" : "Done"}</div>
                </div>
              </div>
              <div className="rounded-xl bg-[#f3f5f7] px-3 py-2 text-[13px] leading-snug">{ASKED}</div>
              <ol className="m-0 flex list-none flex-col gap-1 p-0 text-[12.5px] leading-snug text-[#4f5661]">
                {steps.map((s) => (
                  <li key={s.text} className="flex gap-2 motion-safe:animate-arrive">
                    <span className="text-[#7c8591]">·</span>
                    {s.text}
                  </li>
                ))}
                {working && (
                  <li className="flex gap-2 text-[#0d86b5]">
                    <span className="motion-safe:animate-pulse">●</span>
                    {move.label}
                  </li>
                )}
              </ol>
              {!working && <p className="m-0 text-[13px] leading-normal motion-safe:animate-arrive">{ANSWER}</p>}
            </div>

            {/* The agent's cursor: its face, and what it's doing. */}
            <div
              className="pointer-events-none absolute top-0 left-0 flex items-center gap-1.5 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.3,0.7,0.2,1)]"
              style={{ transform: `translate(${move.x}px, ${move.y}px)`, opacity: cursorShown ? 1 : 0 }}
            >
              <AgentFace name={NAME} size={26} mood="thinking" className="drop-shadow-[0_3px_6px_rgb(0_0_0/0.25)]" />
              <span className="rounded-full bg-[#14171c] px-2.5 py-1 text-[12px] whitespace-nowrap text-white shadow-[0_4px_12px_rgb(0_0_0/0.2)]">{move.label}</span>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
