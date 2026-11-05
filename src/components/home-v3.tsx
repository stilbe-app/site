"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AgentFace } from "@/components/agent-face";
import { SiteScene, type SiteId } from "@/components/site-scene";
import { usePrefersStill } from "@/components/motion";
import { DOWNLOAD } from "@/lib/download";

/** The bar along the top, dark over dark sections and light over light, as you scroll. */
export function SiteNav() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const read = () => {
      // The section under the bar's middle line.
      const under = document.elementsFromPoint(innerWidth / 2, 42).find((el) => el.closest("[data-tone]") && !el.closest("header"));
      setLight(under?.closest("[data-tone]")?.getAttribute("data-tone") === "light");
    };
    read();
    addEventListener("scroll", read, { passive: true });
    return () => removeEventListener("scroll", read);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex h-[76px] items-center justify-between px-[clamp(20px,3vw,40px)] backdrop-blur-xl transition-colors duration-500 ${
        light ? "bg-white/80 text-ink shadow-[0_1px_0_rgb(20_23_28/0.08)]" : "bg-[#0b1018]/40 text-white"
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <Image src="/stilbe-mark.png" alt="" width={28} height={28} priority />
        <span className="font-wide text-[20px] font-light">Stilbe</span>
      </Link>
      <nav className="hidden gap-9 text-[15px] font-medium md:flex">
        <a href="#errands" className="opacity-85 hover:opacity-100">Agent</a>
        <a href="#browser" className="opacity-85 hover:opacity-100">Browser</a>
        <a href="#start" className="opacity-85 hover:opacity-100">Getting started</a>
        <a href="#pricing" className="opacity-85 hover:opacity-100">Pricing</a>
      </nav>
      <div className="flex items-center gap-6 text-[15px] font-medium">
        <a href="#signin" className="hidden opacity-85 hover:opacity-100 sm:block">Sign in</a>
        <a href={DOWNLOAD} className={`inline-flex h-12 items-center px-6 transition-colors ${light ? "bg-ink text-white" : "bg-white text-ink"}`}>
          Download for Mac
        </a>
      </div>
    </header>
  );
}

const ERRANDS: { id: SiteId; tab: string; title: string; line: string; for: string; glow: string; glow2: string; ground: string }[] = [
  { id: "gmail", tab: "Email", title: "Answer your email", line: "It reads the thread, checks your calendar, drafts the reply in your voice, and asks before it sends.", for: "Founders · Freelancers · Anyone with an inbox", glow: "#3a2f6e", glow2: "#16465a", ground: "#0d1018" },
  { id: "outlook", tab: "Calendar", title: "Find a time that works", line: "It checks everyone's calendar, finds the hour that's free for all of you, and sends the invite when you say.", for: "Managers · Teams · Assistants", glow: "#12507a", glow2: "#2c2a5a", ground: "#0b1220" },
  { id: "zillow", tab: "Homes", title: "Find the right home", line: "It searches, opens every likely listing in tabs of its own, compares schools and commutes, and tells you which to visit.", for: "First-time buyers · Renters · Movers", glow: "#1f5e4b", glow2: "#4a3a1c", ground: "#0d1512" },
  { id: "wikipedia", tab: "Research", title: "Learn it properly", line: "It reads the article with you, explains the hard part simply, and turns it into flashcards.", for: "Students · Curious people · Teachers", glow: "#4a4a6e", glow2: "#1c4a4a", ground: "#0e1016" },
  { id: "docs", tab: "Writing", title: "Write it up", line: "It turns your notes into a draft inside the document itself, section by section, as you watch.", for: "Students · Writers · Product teams", glow: "#234a8a", glow2: "#2a5a4a", ground: "#0c1220" },
  { id: "canvas", tab: "Coursework", title: "Keep up with class", line: "It reads your assignments and readings, and tells you what's due and what the chapter says.", for: "Students · Parents · Tutors", glow: "#8a3a1c", glow2: "#3a1c4a", ground: "#180e0c" },
];

/**
 * Tabs over an endless row of big cards: the picked one in the middle, its
 * neighbours peeking either side, the row wrapping round, turning by itself
 * until you pick, with arrows too.
 */
export function ErrandLoop() {
  const n = ERRANDS.length;
  const [i, setI] = useState(n);
  const [touched, setTouched] = useState(false);
  const [animate, setAnimate] = useState(true);
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1440);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const watch = new ResizeObserver(() => setWidth(el.clientWidth));
    watch.observe(el);
    return () => watch.disconnect();
  }, []);
  useEffect(() => {
    if (touched || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setI((k) => k + 1), 7000);
    return () => clearTimeout(timer);
  }, [i, touched]);
  // Three copies in a row; after a move into the outer ones, jump back to the
  // middle copy without animating, so it wraps round for ever.
  useEffect(() => {
    if (i >= n && i < n * 2) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setI((k) => n + (((k % n) + n) % n));
    }, 760);
    return () => clearTimeout(t);
  }, [i, n]);
  useEffect(() => {
    if (animate) return;
    const f = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(f);
  }, [animate]);
  const active = ((i % n) + n) % n;
  const card = Math.min(1240, width * 0.84);
  const gap = 40;
  const shift = (width - card) / 2 - i * (card + gap);
  const go = (k: number) => {
    setTouched(true);
    setI(k);
  };
  const all = [...ERRANDS, ...ERRANDS, ...ERRANDS];
  return (
    <div>
      <div role="tablist" aria-label="Errands" className="flex flex-wrap justify-center gap-1.5 px-6">
        {ERRANDS.map((e, k) => (
          <button
            key={e.id}
            role="tab"
            aria-selected={k === active}
            onClick={() => go(i - active + k)}
            className={`h-12 rounded-full px-5 text-[17px] transition-colors ${k === active ? "bg-[#e7eaee] text-ink" : "text-slate hover:text-ink"}`}
          >
            {e.tab}
          </button>
        ))}
      </div>
      <div ref={box} className="mt-12 overflow-clip">
        <div className={`flex ${animate ? "transition-transform duration-[750ms] ease-[cubic-bezier(0.3,0.7,0.2,1)]" : ""}`} style={{ gap, transform: `translateX(${shift}px)` }}>
          {all.map((e, k) => {
            const here = k === i;
            return (
              <div
                key={k}
                onClick={() => !here && go(k)}
                className={`relative shrink-0 overflow-hidden text-white transition-opacity duration-700 ${here ? "opacity-100" : "cursor-pointer opacity-45 hover:opacity-65"}`}
                style={{ width: card, height: card * 0.56, background: `radial-gradient(80% 90% at 85% 10%, ${e.glow}, transparent 65%), radial-gradient(60% 70% at 0% 100%, ${e.glow2}, transparent 70%), ${e.ground}` }}
                aria-hidden={!here}
              >
                <div className="absolute top-[6%] left-[4%] max-w-[38%]">
                  <h3 className="font-wide text-[clamp(26px,3.4vw,46px)] leading-[1.06] font-light tracking-[-0.02em]">{e.title}</h3>
                  <p className="mt-3.5 text-[clamp(14px,1.3vw,17px)] leading-normal text-white/85">{e.line}</p>
                </div>
                <div className="absolute right-[5%] bottom-[12%] w-[60%]">
                  {Math.abs(k - i) <= 1 && <SiteScene site={e.id} playing={here} className="shadow-[0_50px_100px_-30px_rgb(0_0_0/0.7)]" />}
                </div>
                <div className="absolute bottom-[5%] left-[4%] text-[clamp(12px,1.1vw,15px)] text-white/85">Great for: {e.for}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-2.5 px-[clamp(24px,8vw,110px)]">
        <button onClick={() => go(i - 1)} aria-label="Previous errand" className="size-11 rounded-full border border-[#c3c9d0] bg-white text-[18px] hover:bg-[#f3f5f7]">‹</button>
        <button onClick={() => go(i + 1)} aria-label="Next errand" className="size-11 rounded-full border border-[#c3c9d0] bg-white text-[18px] hover:bg-[#f3f5f7]">›</button>
      </div>
    </div>
  );
}

const ASKS = [
  "Reply to Priya: Thursday works, and ask if lunch is covered",
  "Find a three-bed in Austin under $650K near a good school",
  "What's due this week in BIO 201?",
  "Turn my notes into a one-page brief",
  "Find an hour with Sam and Leo next week",
];

/** Where Squarespace asks for your domain: a big field that types errands to itself until you type your own. */
export function AskField() {
  const [text, setText] = useState("");
  const [typed, setTyped] = useState("");
  const [k, setK] = useState(0);
  const [asked, setAsked] = useState(false);
  const still = usePrefersStill();
  useEffect(() => {
    if (text || still) return;
    const line = ASKS[k % ASKS.length];
    let n = 0;
    let back = false;
    const timer = setInterval(() => {
      if (!back) {
        n++;
        if (n > line.length + 22) back = true;
      } else {
        n -= 2;
        if (n <= 0) {
          clearInterval(timer);
          setK((v) => v + 1);
        }
      }
      setTyped(line.slice(0, Math.max(0, Math.min(n, line.length))));
    }, 45);
    return () => clearInterval(timer);
  }, [k, text, still]);
  return (
    <form
      className="mx-auto w-full max-w-[760px]"
      onSubmit={(e) => {
        e.preventDefault();
        setAsked(true);
      }}
    >
      <label htmlFor="ask" className="sr-only">
        What would you hand it?
      </label>
      <div className="flex h-[68px] items-center gap-3 rounded-[14px] bg-[#1b2029] px-5 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] focus-within:shadow-[inset_0_0_0_1.5px_#35bfea,0_0_40px_rgb(53_191_234/0.25)]">
        <AgentFace name="Fern" size={26} mood={text ? "happy" : "thinking"} />
        <input
          id="ask"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setAsked(false);
          }}
          placeholder={still || text ? ASKS[0] : typed}
          className="h-full min-w-0 flex-1 bg-transparent text-[17px] text-white outline-none placeholder:text-[#8e99ab]"
        />
        <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-ink" aria-label="Ask">
          →
        </button>
      </div>
      <p className="mt-4 text-center text-[14px] text-[#8e99ab]" aria-live="polite">
        {asked ? (
          <>
            Stilbe can do that. <a href={DOWNLOAD} className="text-white underline decoration-[#35bfea] underline-offset-4">Download it</a> and ask it there.
          </>
        ) : (
          "Type an errand, the way you'd say it to someone."
        )}
      </p>
    </form>
  );
}

const FLY = [
  { name: "Gmail", host: "mail.google.com", bar: "#f6f8fc", ink: "#5f6368", a: "#d3e3fd" },
  { name: "Zillow", host: "zillow.com", bar: "#ffffff", ink: "#006aff", a: "#cfe3f5" },
  { name: "Outlook", host: "outlook.office.com", bar: "#0f6cbd", ink: "#ffffff", a: "#deecf9" },
  { name: "Canvas", host: "canvas.instructure.com", bar: "#2d3b45", ink: "#ffffff", a: "#f4e2d8" },
  { name: "Wikipedia", host: "en.wikipedia.org", bar: "#ffffff", ink: "#202122", a: "#eaecf0", shot: "/shots/wikipedia.png" },
  { name: "Docs", host: "docs.google.com", bar: "#f9fbfd", ink: "#1f1f1f", a: "#e8f0fe" },
  { name: "LinkedIn", host: "linkedin.com", bar: "#ffffff", ink: "#0a66c2", a: "#e7f0fa" },
  { name: "Airbnb", host: "airbnb.com", bar: "#ffffff", ink: "#ff385c", a: "#ffe3e8" },
  { name: "YouTube", host: "youtube.com", bar: "#ffffff", ink: "#ff0033", a: "#1f1f1f" },
  { name: "Notion", host: "notion.so", bar: "#ffffff", ink: "#191919", a: "#f1f1ef" },
  { name: "Expedia", host: "expedia.com", bar: "#191e3b", ink: "#ffd600", a: "#dfe8f5" },
  { name: "Reddit", host: "reddit.com", bar: "#ffffff", ink: "#ff4500", a: "#ffe9e0" },
];
/** Where each flies from: angle round the tunnel, and its start along it (0–1). */
const PATHS = FLY.map((_, k) => ({ angle: (k * 137.5) % 360, start: (k / FLY.length) }));

/** The sites it works on, flying out of the dark toward you, endlessly; the pill names the one nearest. */
export function FlyingSites() {
  const [clock, setT] = useState(0);
  const still = usePrefersStill();
  const t = still ? 0.35 : clock;
  useEffect(() => {
    if (still) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setT(((now - start) / 26000) % 1);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [still]);
  const tiles = FLY.map((f, k) => {
    const z = (PATHS[k].start + t) % 1;
    return { ...f, z, angle: PATHS[k].angle };
  });
  const nearest = tiles.reduce((a, b) => (b.z > a.z && b.z < 0.9 ? b : a), tiles[0]);
  return (
    <div className="relative h-[clamp(620px,64vw,920px)] overflow-clip bg-[#05070b] text-white [perspective:900px]" data-tone="dark">
      <div aria-hidden="true" className="absolute inset-0 [transform-style:preserve-3d]">
        {tiles.map((f) => {
          const r = 38 + f.z * 6;
          const x = Math.cos((f.angle * Math.PI) / 180) * r;
          const y = Math.sin((f.angle * Math.PI) / 180) * r * 0.62;
          const depth = -1800 + f.z * 2100;
          const fade = f.z < 0.12 ? f.z / 0.12 : f.z > 0.85 ? Math.max(0, (1 - f.z) / 0.15) : 1;
          return (
            <div
              key={f.name}
              className="absolute top-1/2 left-1/2 w-[22vw] max-w-[320px] overflow-hidden bg-white"
              style={{
                aspectRatio: "3 / 2",
                transform: `translate(-50%, -50%) translate3d(${x}vw, ${y}vw, ${depth}px) rotateY(${-x * 0.9}deg) rotateX(${y * 0.9}deg)`,
                opacity: fade * (f.name === nearest.name ? 1 : 0.55),
                boxShadow: f.name === nearest.name ? "0 0 0 3px #35bfea, 0 0 60px rgb(53 191 234 / 0.6)" : "none",
              }}
            >
              {f.shot ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.shot} alt="" className="size-full object-cover object-top" />
              ) : (
                <>
                  <div className="flex h-[22%] items-center px-[8%] text-[clamp(9px,1vw,15px)] font-bold" style={{ background: f.bar, color: f.ink }}>
                    {f.name}
                  </div>
                  <div className="grid grid-cols-3 gap-[6%] p-[6%]">
                    {[f.a, "#eef0f3", "#eef0f3", "#eef0f3", f.a, "#eef0f3"].map((c, j) => (
                      <span key={j} className="aspect-[3/2] rounded-[3px]" style={{ background: c }} />
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(36%_36%_at_50%_50%,rgb(5_7_11/0.9),transparent_72%)]" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center">
        <h2 className="font-wide text-[clamp(36px,4.6vw,66px)] leading-[1.05] font-light tracking-[-0.02em]">
          Works where
          <br />
          you already are
        </h2>
        <p className="mt-3.5 text-[17px] text-[#aab3c2]">No plug-ins, no connections to set up. If you can do it in a tab, so can it.</p>
      </div>
      <div className="absolute bottom-14 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-5 py-3 text-[16px] text-ink" aria-live="polite">
        <AgentFace name="Fern" size={18} mood="happy" />
        {nearest.host}
      </div>
    </div>
  );
}

/** Behind the closing words: a sphere of glinting points, turning slowly, as Squarespace's globe. */
export function GlintSphere({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const N = 1400;
    const pts = Array.from({ length: N }, (_, k) => {
      const y = 1 - (k / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = k * 2.399963;
      return [Math.cos(th) * r, y, Math.sin(th) * r] as const;
    });
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const draw = (now: number) => {
      const w = (c.width = c.clientWidth * devicePixelRatio);
      const h = (c.height = c.clientHeight * devicePixelRatio);
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.42;
      const a = still ? 0.6 : now / 9000;
      for (const [x, y, z] of pts) {
        const rx = x * Math.cos(a) - z * Math.sin(a);
        const rz = x * Math.sin(a) + z * Math.cos(a);
        const depth = (rz + 1) / 2;
        ctx.fillStyle = `rgba(${Math.round(120 + depth * 135)}, ${Math.round(200 + depth * 55)}, 255, ${0.15 + depth * 0.75})`;
        const s = (0.6 + depth * 1.6) * devicePixelRatio;
        ctx.fillRect(w / 2 + rx * R, h / 2 + y * R, s, s);
      }
      if (!still) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={canvas} aria-hidden="true" className={className} />;
}
