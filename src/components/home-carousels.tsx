"use client";

import { useEffect, useRef, useState } from "react";
import { AgentFace } from "@/components/agent-face";
import { SiteScene, type SiteId } from "@/components/site-scene";

const HERO: { id: SiteId; name: string }[] = [
  { id: "gmail", name: "Gmail" },
  { id: "zillow", name: "Zillow" },
  { id: "outlook", name: "Outlook" },
  { id: "wikipedia", name: "Wikipedia" },
  { id: "docs", name: "Google Docs" },
  { id: "canvas", name: "Canvas" },
];
const at = (i: number) => HERO[(i + HERO.length) % HERO.length];

/**
 * The hero's real sites, as Squarespace fans its templates: one big in the
 * middle, cut off by the section's edge, one tilted at each side; Next brings
 * the next one to the middle.
 */
export function HeroSites() {
  const [i, setI] = useState(0);
  const side = "absolute bottom-[4%] w-[46%] max-w-[660px] opacity-90 transition-all duration-700 ease-[cubic-bezier(0.3,0.7,0.2,1)]";
  return (
    <div className="relative h-[clamp(300px,42vw,580px)]" aria-label={`The agent at work on ${at(i).name}`}>
      <div className={`${side} left-[-14%] [transform:perspective(1400px)_rotateY(16deg)_rotate(-2deg)]`}>
        <SiteScene key={`l${i}`} site={at(i - 1).id} playing={false} className="shadow-[0_40px_80px_-20px_rgb(0_0_0/0.6)]" />
      </div>
      <div className={`${side} right-[-14%] [transform:perspective(1400px)_rotateY(-16deg)_rotate(2deg)]`}>
        <SiteScene key={`r${i}`} site={at(i + 1).id} playing={false} className="shadow-[0_40px_80px_-20px_rgb(0_0_0/0.6)]" />
      </div>
      <div className="absolute bottom-[-22%] left-1/2 w-[66%] max-w-[940px] -translate-x-1/2">
        <SiteScene key={`c${i}`} site={at(i).id} className="shadow-[0_60px_120px_-30px_rgb(0_0_0/0.8),0_0_60px_rgb(53_191_234/0.3)]" />
      </div>
      <button
        onClick={() => setI(i + 1)}
        className="absolute top-[18%] right-[12%] h-14 rounded-full bg-white px-6.5 text-[18px] text-ink shadow-[0_10px_30px_rgb(0_0_0/0.35)] transition-transform hover:scale-105"
        aria-label={`Next: ${at(i + 1).name}`}
      >
        Next
      </button>
    </div>
  );
}

const FEATURES = [
  { title: "The agent", line: "In every tab, a card in the corner. Ask about the page, or hand it the errand.", glow: "#1e6f8a", ground: "#0d1a24", ui: "Fern", rows: [["Read the thread", ""], ["Drafted the reply", "Asks first"]], face: true },
  { title: "Tabs that keep together", line: "Each task gathers its tabs in a group under its agent's face.", glow: "#5b47b8", ground: "#15122a", ui: "Flat hunt", rows: [["Amwell Street", "tab"], ["Percy Circus", "tab"]], face: true },
  { title: "Passwords and cards", line: "Filled in with Touch ID and kept on your Mac. The agent never sees them.", glow: "#8a4a2e", ground: "#1d1410", ui: "Fill with Touch ID", rows: [["ada@example.com", "••••••"], ["Visa ending 6411", "Touch ID"]] },
  { title: "Ads and trackers, gone", line: "Blocked on every site from the first page, with nothing to set up.", glow: "#1f6b4f", ground: "#0c1914", ui: "On this page", rows: [["Ads", "Blocked"], ["Trackers", "Blocked"]] },
  { title: "Split view and reader", line: "Two pages side by side, or one without the clutter.", glow: "#8a2f55", ground: "#1c0f16", ui: "Split view", rows: [["Lecture notes", "left"], ["Chapter 4", "right"]] },
  { title: "Your extensions", line: "The Chrome extensions you already use, working as they do there.", glow: "#6d5a1f", ground: "#17140a", ui: "Extensions", rows: [["Password manager", "On"], ["Grammar checker", "On"]] },
  { title: "Moving in takes a minute", line: "Bookmarks, history and passwords from Chrome or Safari.", glow: "#3a4a6b", ground: "#0f1420", ui: "Import from Chrome", rows: [["Bookmarks", "Done"], ["Passwords", "Done"]] },
  { title: "Profiles", line: "School and personal kept apart, each with its own sign-ins.", glow: "#2e5f8a", ground: "#0d1520", ui: "Profiles", rows: [["Personal", "This window"], ["School", ""]] },
];

/** Scrolls `el` to `left` on an ease of its own: the browser's smooth scrolling
 *  doesn't always run, and snapping would fight each step, so it's off until
 *  the glide lands. Straight there for reduced motion. */
function glide(el: HTMLElement, left: number) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.scrollLeft = left;
    return;
  }
  const from = el.scrollLeft;
  const start = performance.now();
  const ms = 520;
  el.style.scrollSnapType = "none";
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    const eased = 1 - Math.pow(1 - t, 3);
    el.scrollLeft = from + (left - from) * eased;
    if (t < 1) requestAnimationFrame(step);
    else el.style.scrollSnapType = "";
  };
  requestAnimationFrame(step);
}

/** A row of tall cards that scrolls by a card: arrows, dots, and swipe or scroll as well. */
export function FeatureCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const card = el.firstElementChild as HTMLElement | null;
      const step = card ? card.offsetWidth + 32 : el.clientWidth;
      setPages(Math.max(1, Math.round((el.scrollWidth - el.clientWidth) / step) + 1));
      setPage(Math.round(el.scrollLeft / step));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const watch = new ResizeObserver(update);
    watch.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      watch.disconnect();
    };
  }, []);
  const go = (dir: number) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    // To a card's own place, not by an amount: snapping can swallow a nudge.
    const step = card.offsetWidth + 32;
    const to = Math.max(0, Math.min(pages - 1, Math.round(el.scrollLeft / step) + dir));
    glide(el, to * step);
  };
  return (
    <div>
      <div ref={track} className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-8 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FEATURES.map((f) => (
          <article
            key={f.title}
            className="group relative flex h-[min(560px,130vw)] w-[min(320px,78vw)] shrink-0 snap-start flex-col overflow-hidden p-7 text-white"
            style={{ background: `radial-gradient(90% 70% at 75% 15%, ${f.glow}, transparent 70%), ${f.ground}` }}
          >
            <h3 className="text-[25px] leading-tight font-normal tracking-[-0.01em]">{f.title}</h3>
            <p className="mt-2.5 text-[14.5px] leading-normal text-white/80">{f.line}</p>
            <div className="m-auto flex w-[240px] flex-col gap-2 rounded-[14px] bg-white p-3.5 text-ink shadow-[0_24px_50px_-16px_rgb(0_0_0/0.55)] transition-transform duration-500 group-hover:-translate-y-1.5">
              <div className="flex items-center gap-2 text-[12.5px] font-medium">
                {f.face ? <AgentFace name={f.ui} size={20} mood="thinking" /> : <span className="size-5 rounded-md bg-ink" />}
                {f.ui}
              </div>
              {f.rows.map(([a, b]) => (
                <div key={a} className="flex justify-between gap-2 rounded-lg bg-[#f3f5f7] px-2 py-1.5 text-[12px] text-slate">
                  <span>{a}</span>
                  <span className="font-medium text-[#0d86b5]">{b}</span>
                </div>
              ))}
            </div>
            <span aria-hidden="true" className="absolute right-6 bottom-6 text-[22px] transition-transform group-hover:translate-x-1">→</span>
          </article>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <span className="w-[88px]" />
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: pages }, (_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === page ? "w-9 bg-ink" : "w-1.5 bg-[#c3c9d0]"}`} />
          ))}
        </div>
        <div className="flex gap-2.5">
          <button onClick={() => go(-1)} disabled={page === 0} aria-label="Previous" className="size-10 rounded-full border border-[#c3c9d0] bg-white text-[18px] disabled:opacity-35">‹</button>
          <button onClick={() => go(1)} disabled={page >= pages - 1} aria-label="Next" className="size-10 rounded-full border border-[#c3c9d0] bg-white text-[18px] disabled:opacity-35">›</button>
        </div>
      </div>
    </div>
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

/** Tabs over one big card in the middle, its neighbours peeking either side, sliding as you pick. */
export function ErrandShowcase() {
  const [i, setI] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1440);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const watch = new ResizeObserver(() => setWidth(el.clientWidth));
    watch.observe(el);
    return () => watch.disconnect();
  }, []);
  const card = Math.min(1260, width * 0.86);
  const gap = 40;
  const shift = (width - card) / 2 - i * (card + gap);
  return (
    <div>
      <div role="tablist" aria-label="Errands" className="flex flex-wrap justify-center gap-2 px-6">
        {ERRANDS.map((e, n) => (
          <button
            key={e.id}
            role="tab"
            aria-selected={n === i}
            onClick={() => setI(n)}
            className={`h-12 rounded-full px-5 text-[17px] transition-colors ${n === i ? "bg-[#e7eaee] text-ink" : "text-slate hover:text-ink"}`}
          >
            {e.tab}
          </button>
        ))}
      </div>
      <div ref={box} className="mt-12 overflow-clip">
        <div className="flex transition-transform duration-700 ease-[cubic-bezier(0.3,0.7,0.2,1)]" style={{ gap, transform: `translateX(${shift}px)` }}>
          {ERRANDS.map((e, n) => (
            <button
              key={e.id}
              onClick={() => setI(n)}
              tabIndex={n === i ? -1 : 0}
              aria-label={n === i ? undefined : e.title}
              className={`relative shrink-0 overflow-hidden text-left text-white transition-opacity duration-700 ${n === i ? "cursor-default opacity-100" : "opacity-50 hover:opacity-70"}`}
              style={{ width: card, height: card * 0.57, background: `radial-gradient(80% 90% at 85% 10%, ${e.glow}, transparent 65%), radial-gradient(60% 70% at 0% 100%, ${e.glow2}, transparent 70%), ${e.ground}` }}
            >
              <div className="absolute top-[6%] left-[4%] max-w-[40%]">
                <h3 className="font-wide text-[clamp(26px,3.4vw,46px)] leading-[1.06] font-light tracking-[-0.02em]">{e.title}</h3>
                <p className="mt-3.5 text-[clamp(14px,1.3vw,17px)] leading-normal text-white/85">{e.line}</p>
              </div>
              <div className="absolute right-[5%] bottom-[12%] w-[60%]">
                <SiteScene site={e.id} playing={n === i} className="shadow-[0_50px_100px_-30px_rgb(0_0_0/0.7)]" />
              </div>
              <div className="absolute bottom-[5%] left-[4%] text-[clamp(12px,1.1vw,15px)] text-white/85">Great for: {e.for}</div>
              <span aria-hidden="true" className="absolute right-[3%] bottom-[4.5%] text-[24px]">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const TILES = [
  { name: "Gmail", host: "mail.google.com", bar: "#f6f8fc", ink: "#5f6368", a: "#d3e3fd", x: 3, y: 7, w: 21, tf: "rotateY(38deg) rotateX(-12deg) translateZ(-120px)" },
  { name: "Zillow", host: "zillow.com", bar: "#ffffff", ink: "#006aff", a: "#cfe3f5", x: 30, y: 4, w: 18, tf: "rotateX(-28deg) translateZ(-260px)" },
  { name: "Outlook", host: "outlook.office.com", bar: "#0f6cbd", ink: "#ffffff", a: "#deecf9", x: 53, y: 5, w: 17, tf: "rotateX(-28deg) translateZ(-260px)" },
  { name: "Canvas", host: "canvas.instructure.com", bar: "#2d3b45", ink: "#ffffff", a: "#f4e2d8", x: 76, y: 8, w: 21, tf: "rotateY(-38deg) rotateX(-12deg) translateZ(-120px)" },
  { name: "Wikipedia", host: "en.wikipedia.org", bar: "#ffffff", ink: "#202122", a: "#eaecf0", x: 0, y: 40, w: 22, tf: "rotateY(48deg) translateZ(-60px)" },
  { name: "Docs", host: "docs.google.com", bar: "#f9fbfd", ink: "#1f1f1f", a: "#e8f0fe", x: 78, y: 40, w: 22, tf: "rotateY(-48deg) translateZ(-60px)" },
  { name: "LinkedIn", host: "linkedin.com", bar: "#ffffff", ink: "#0a66c2", a: "#e7f0fa", x: 4, y: 73, w: 21, tf: "rotateY(38deg) rotateX(14deg) translateZ(-120px)" },
  { name: "Airbnb", host: "airbnb.com", bar: "#ffffff", ink: "#ff385c", a: "#ffe3e8", x: 31, y: 78, w: 17, tf: "rotateX(30deg) translateZ(-260px)" },
  { name: "YouTube", host: "youtube.com", bar: "#ffffff", ink: "#ff0033", a: "#1f1f1f", x: 53, y: 78, w: 17, tf: "rotateX(30deg) translateZ(-260px)" },
  { name: "Notion", host: "notion.so", bar: "#ffffff", ink: "#191919", a: "#f1f1ef", x: 76, y: 73, w: 21, tf: "rotateY(-38deg) rotateX(14deg) translateZ(-120px)" },
  { name: "Expedia", host: "expedia.com", bar: "#191e3b", ink: "#ffd600", a: "#dfe8f5", x: 36, y: 30, w: 12, tf: "translateZ(-520px)" },
  { name: "Reddit", host: "reddit.com", bar: "#ffffff", ink: "#ff4500", a: "#ffe9e0", x: 52, y: 58, w: 12, tf: "translateZ(-520px)" },
];

/** A tunnel of the sites it works on, as "Made with Squarespace": one lit at a time, named below. */
export function SiteTunnel() {
  const [live, setLive] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setLive((n) => (n + 1) % TILES.length), 2200);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="relative h-[clamp(560px,62vw,900px)] overflow-clip bg-[#05070b] text-white [perspective:1100px]">
      <div aria-hidden="true" className="absolute inset-0 [transform-style:preserve-3d] motion-safe:animate-tunnel">
        {TILES.map((t, n) => (
          <div
            key={t.name}
            className="absolute overflow-hidden bg-white transition-[opacity,box-shadow] duration-700"
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              width: `${t.w}%`,
              aspectRatio: "3 / 2",
              transform: t.tf,
              opacity: n === live ? 1 : 0.4,
              boxShadow: n === live ? "0 0 0 3px #35bfea, 0 0 60px rgb(53 191 234 / 0.6)" : "none",
            }}
          >
            <div className="flex h-[22%] items-center px-[8%] text-[clamp(8px,1vw,15px)] font-bold" style={{ background: t.bar, color: t.ink }}>
              {t.name}
            </div>
            <div className="grid grid-cols-3 gap-[6%] p-[6%]">
              {[t.a, "#eef0f3", "#eef0f3", "#eef0f3", t.a, "#eef0f3"].map((c, k) => (
                <span key={k} className="aspect-[3/2] rounded-[3px]" style={{ background: c }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_50%,rgb(5_7_11/0.85),transparent_70%)]" />
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
        {TILES[live].host}
      </div>
    </div>
  );
}
