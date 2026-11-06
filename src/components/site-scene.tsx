"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AgentFace } from "@/components/agent-face";
import { BrandLogo, type LogoId } from "@/components/brand-logo";

/** Drawn at this size and scaled to fit its box, so every position is in its pixels. */
const W = 1100;
const H = 640;
const TOP = 84;

export type SiteId = "gmail" | "outlook" | "zillow" | "wikipedia" | "docs" | "canvas";

type Scene = {
  tab: string;
  icon: string;
  host: string;
  path: string;
  group: string;
  agent: string;
  asked: string;
  /** Where its cursor goes, what it says there, and the step done once it's moved on. */
  moves: { x: number; y: number; label: string; done: string }[];
  /** What it waits on you for at the end, or its answer. */
  ask?: string;
  answer?: string;
};

export const SCENES: Record<SiteId, Scene> = {
  gmail: {
    tab: "Inbox (12)", icon: "#ea4335", host: "mail.google.com", path: "/mail/u/0/#inbox", group: "Reply to Priya", agent: "Fern",
    asked: "Reply to Priya: Thursday works, and ask if lunch is covered.",
    moves: [
      { x: 560, y: 140, label: "Reading the thread", done: "Read the thread" },
      { x: 930, y: 112, label: "Checking your calendar", done: "Checked your calendar for the 14th" },
      { x: 470, y: 300, label: "Writing the reply", done: "Drafted the reply" },
    ],
    ask: "Send the reply to Priya?",
  },
  outlook: {
    tab: "Calendar", icon: "#0f6cbd", host: "outlook.office.com", path: "/calendar/view/workweek", group: "Find a time", agent: "Otto",
    asked: "Find an hour with Sam and Leo next week and send an invite.",
    moves: [
      { x: 330, y: 170, label: "Checking Monday", done: "Checked three calendars" },
      { x: 520, y: 300, label: "Checking Tuesday", done: "Tuesday 2 to 3 is free for all of you" },
      { x: 520, y: 350, label: "Writing the invite", done: "Wrote the invite" },
    ],
    ask: "Send “Roadmap review” to Sam and Leo for Tue 2 PM?",
  },
  zillow: {
    tab: "Austin homes", icon: "#006aff", host: "www.zillow.com", path: "/austin-tx/", group: "House hunt", agent: "Juno",
    asked: "Three-beds under $650K in Austin near good schools, with a yard.",
    moves: [
      { x: 330, y: 80, label: "Searching 3+ beds under $650K", done: "Searched 3+ beds under $650K" },
      { x: 660, y: 200, label: "Opening 4108 Avenue H", done: "Opened 6 homes in tabs of its own" },
      { x: 910, y: 200, label: "Comparing schools", done: "Compared the school ratings" },
    ],
    answer: "Two are worth a visit: 4108 Avenue H, $612K, with a big yard and a 9/10 school, and 711 E 46th St.",
  },
  wikipedia: {
    tab: "Photosynthesis", icon: "#202122", host: "en.wikipedia.org", path: "/wiki/Photosynthesis", group: "Bio notes", agent: "Pip",
    asked: "Explain the light reactions simply, and make me five flashcards.",
    moves: [
      { x: 260, y: 200, label: "Reading the article", done: "Read the article" },
      { x: 330, y: 340, label: "Reading the light reactions", done: "Read the light reactions section" },
      { x: 560, y: 260, label: "Writing flashcards", done: "Made five flashcards" },
    ],
    answer: "Light hits chlorophyll, which splits water: oxygen goes out, and the energy is stored as ATP and NADPH for making sugar.",
  },
  docs: {
    tab: "Launch notes", icon: "#4285f4", host: "docs.google.com", path: "/document/d/…/edit", group: "Launch brief", agent: "Fern",
    asked: "Turn my notes into a one-page launch brief.",
    moves: [
      { x: 400, y: 180, label: "Reading your notes", done: "Read your notes" },
      { x: 430, y: 250, label: "Writing \u201cWhat we\u2019re shipping\u201d", done: "Wrote what you\u2019re shipping" },
      { x: 450, y: 320, label: "Writing \u201cWho it\u2019s for\u201d", done: "Wrote who it\u2019s for" },
    ],
    answer: "The brief is in your document: three sections, one page. Have a look at “Who it’s for”.",
  },
  canvas: {
    tab: "BIO 201", icon: "#e66000", host: "canvas.instructure.com", path: "/courses/1182/assignments", group: "This week", agent: "Juno",
    asked: "What’s due this week, and summarise the chapter 4 reading.",
    moves: [
      { x: 440, y: 180, label: "Reading your assignments", done: "Read your assignments" },
      { x: 440, y: 300, label: "Opening Chapter 4", done: "Opened the chapter 4 reading" },
      { x: 620, y: 230, label: "Summarising", done: "Summarised the chapter" },
    ],
    answer: "Two are due: the lab report on Thursday and the quiz on Friday. Chapter 4 is about how cells signal: here are the six ideas.",
  },
};

const STEP = 2200;

/** The sites with a screenshot saved in public/shots/<site>.png (from a demo
 *  account; see the README there). Add a site's id here when its is saved. */
const SHOTS = new Set<SiteId>(["wikipedia"]);

const MOTION = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (changed: () => void) => {
  const query = matchMedia(MOTION);
  query.addEventListener("change", changed);
  return () => query.removeEventListener("change", changed);
};
const prefersStill = () => matchMedia(MOTION).matches;

/** Its stage through the scene: 0 to moves.length (the end), looping; at the end, still, for reduced motion. */
function useStage(count: number, playing: boolean) {
  const still = useSyncExternalStore(subscribeMotion, prefersStill, () => false);
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (still || !playing) return;
    const timer = setInterval(() => setStage((s) => (s + 1) % (count + 2)), STEP);
    return () => clearInterval(timer);
  }, [still, playing, count]);
  return still || !playing ? count : Math.min(stage, count);
}

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
 * A Stilbe window on a real site, the agent at work in it: its face as its
 * cursor moving from one thing to the next with a label, its card keeping up
 * a step at a time, then asking or answering. The page is a screenshot from
 * /shots/<site>.png when there is one (from demo accounts), else drawn.
 */
export function SiteScene({ site, playing = true, className = "" }: { site: SiteId; playing?: boolean; className?: string }) {
  const scene = SCENES[site];
  const stage = useStage(scene.moves.length, playing);
  const { box, scale } = useFit();
  // A screenshot of the real site, once one's been saved for it; drawn till then.
  const shot = SHOTS.has(site);
  const done = stage >= scene.moves.length;
  const move = scene.moves[Math.min(stage, scene.moves.length - 1)];

  return (
    <div ref={box} className={`relative w-full ${className}`} style={{ aspectRatio: `${W} / ${H}` }} aria-label={`${scene.agent}, the agent, on ${scene.host}: ${scene.asked}`} role="img">
      <div
        className="absolute top-0 left-0 overflow-hidden rounded-[14px] bg-[#e7eaee] shadow-[0_0_0_1px_rgb(20_23_28/0.08)]"
        style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "0 0" }}
      >
        {/* Stilbe's tabs and toolbar */}
        <div className="flex h-[42px] items-end gap-1.5 px-3">
          <div className="flex gap-[7px] pr-2.5 pb-3.5 pl-0.5">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex h-8 items-center gap-2 rounded-t-[10px] bg-[#f3f5f7] px-3.5 text-[12.5px]">
            <BrandLogo id={site as LogoId} size={14} />
            {scene.tab}
          </div>
          <span className="mb-[5px] flex h-[22px] items-center gap-1.5 rounded-full bg-[#35bfea]/20 pr-2.5 pl-1 text-[11.5px] font-medium text-[#0d86b5]">
            <AgentFace name={scene.agent} size={15} mood={done ? "happy" : "thinking"} />
            {scene.group}
          </span>
        </div>
        <div className="flex h-[42px] items-center gap-2.5 border-b border-[#dde1e6] bg-[#f3f5f7] px-3">
          <span className="px-1.5 text-[14px] text-[#7c8591]">‹ ›</span>
          <div className="flex h-7 flex-1 items-center rounded-full bg-[#e6e9ed] px-3.5 text-[13px] text-[#4f5661]">
            <span className="text-[#14171c]">{scene.host}</span>
            {scene.path}
          </div>
        </div>

        {/* The site */}
        <div
          className="relative overflow-hidden bg-white transition-shadow duration-700"
          style={{ height: H - TOP, boxShadow: done ? "none" : "inset 0 0 0 2px #35bfea, inset 0 0 24px 2px rgb(53 191 234 / 0.2)" }}
        >
          <Drawn site={site} stage={stage} />
          {shot && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/shots/${site}.png`} alt="" className="absolute inset-0 size-full object-cover object-top" />
          )}

          {/* The agent's card */}
          <div className="absolute right-[18px] bottom-[18px] flex w-[340px] flex-col gap-2.5 rounded-[18px] bg-white p-4 text-left shadow-[0_0_0_1px_rgb(0_0_0/0.1),0_20px_44px_-18px_rgb(20_23_28/0.35)]">
            <div className="flex items-center gap-2.5">
              <AgentFace name={scene.agent} size={28} mood={done ? "happy" : "thinking"} />
              <div>
                <div className="text-[13.5px] font-medium">{scene.agent}</div>
                <div className="text-[11.5px] text-[#0d86b5]">{done ? (scene.ask ? "Waiting for you" : "Done") : "Working"}</div>
              </div>
            </div>
            <div className="rounded-xl bg-[#f3f5f7] px-3 py-2 text-[12.5px] leading-snug">{scene.asked}</div>
            <ol className="m-0 flex list-none flex-col gap-0.5 p-0 text-[12px] leading-snug text-[#4f5661]">
              {scene.moves.slice(0, stage).map((m) => (
                <li key={m.done} className="motion-safe:animate-arrive">· {m.done}</li>
              ))}
              {!done && (
                <li className="text-[#0d86b5]">
                  <span className="motion-safe:animate-pulse">●</span> {move.label}
                </li>
              )}
            </ol>
            {done && scene.ask && (
              <div className="flex flex-col gap-2 rounded-xl bg-[#e7f6fc] p-3 motion-safe:animate-arrive">
                <div className="text-[12.5px] font-medium">{scene.ask}</div>
                <div className="flex gap-1.5 text-[12px]">
                  <span className="rounded-full bg-[#14171c] px-4 py-1.5 text-white">Allow</span>
                  <span className="px-3 py-1.5">Don&rsquo;t</span>
                </div>
              </div>
            )}
            {done && scene.answer && <p className="m-0 text-[12.5px] leading-normal motion-safe:animate-arrive">{scene.answer}</p>}
          </div>

          {/* The agent's cursor */}
          <div
            className="pointer-events-none absolute top-0 left-0 flex items-center gap-1.5 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.3,0.7,0.2,1)]"
            style={{ transform: `translate(${move.x}px, ${move.y}px)`, opacity: done ? 0 : 1 }}
          >
            <AgentFace name={scene.agent} size={24} mood="thinking" className="drop-shadow-[0_3px_6px_rgb(0_0_0/0.25)]" />
            <span className="rounded-full bg-[#14171c] px-2.5 py-1 text-[12px] whitespace-nowrap text-white">{move.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The site itself, drawn near enough to know it at a glance, with its own
 * logo: for until there's a screenshot of it from a demo account.
 */
function Drawn({ site, stage }: { site: SiteId; stage: number }) {
  if (site === "gmail")
    return (
      <div className="flex h-full flex-col bg-[#f6f8fc] font-[Roboto,Arial,sans-serif] text-[#1f1f1f]">
        <div className="flex h-[58px] items-center gap-3.5 px-4">
          <span className="w-5 text-[18px] text-[#444746]">☰</span>
          <BrandLogo id="gmail" size={30} />
          <span className="mr-11 text-[22px] text-[#444746]">Gmail</span>
          <span className="flex h-11 max-w-[620px] flex-1 items-center gap-3 rounded-full bg-[#e9eef6] px-4.5 text-[15px] text-[#444746]">⌕ Search mail</span>
          <span className="ml-auto flex size-8 items-center justify-center rounded-full bg-[#7c4dff] text-[14px] text-white">A</span>
        </div>
        <div className="flex min-h-0 flex-1">
          <div className="flex w-[220px] flex-col gap-0.5 px-2.5 py-1.5 text-[14px]">
            <div className="mb-3 flex h-14 items-center gap-3 self-start rounded-2xl bg-[#c2e7ff] pr-5.5 pl-4.5 font-medium">✎ Compose</div>
            <div className="flex h-8 items-center justify-between rounded-r-full bg-[#d3e3fd] pr-3 pl-6 font-bold"><span>Inbox</span><span>12</span></div>
            {["Starred", "Snoozed", "Sent", "Drafts"].map((n) => <div key={n} className="flex h-8 items-center pl-6">{n}</div>)}
          </div>
          <div className="mr-4 flex min-w-0 flex-1 flex-col gap-3 rounded-t-2xl bg-white px-6 py-4.5">
            <div className="flex items-center gap-2.5"><span className="text-[22px]">Re: Q3 offsite dates</span><span className="rounded bg-[#e8eaed] px-1.5 text-[12px] text-[#444746]">Inbox</span></div>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#e37400] text-[16px] text-white">P</span>
              <div className="text-[14px]"><b className="font-semibold">Priya Shah</b> <span className="text-[12px] text-[#5e5e5e]">&lt;priya@example.com&gt;</span><br /><span className="text-[12px] text-[#5e5e5e]">to me</span></div>
              <span className="ml-auto text-[12px] text-[#5e5e5e]">9:41 AM</span>
            </div>
            <div className="max-w-[520px] pl-13 text-[14px] leading-relaxed">Hi! Could you do Thursday the 14th or Friday the 15th for the planning day? We&rsquo;d start at 10. Let me know either way.<br /><br />Priya</div>
            {stage >= 2 && (
              <div className="ml-13 w-[520px] rounded-2xl px-4 py-3.5 text-[14px] leading-relaxed shadow-[0_1px_3px_rgb(60_64_67/0.3),0_0_0_2px_#35bfea] motion-safe:animate-arrive">
                <div className="mb-1.5 text-[12px] text-[#5e5e5e]">↩ Priya Shah</div>
                Thursday the 14th works for me. Is lunch covered, or should I bring something?
                <div className="mt-3"><span className="inline-flex h-9 items-center rounded-full bg-[#0b57d0] px-5.5 text-[14px] font-medium text-white">Send</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  if (site === "outlook") {
    const days = ["16 Mon", "17 Tue", "18 Wed", "19 Thu", "20 Fri"];
    const hours = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"];
    // [day, hour, title, colour]
    const events: [number, number, string, string][] = [
      [0, 0, "Stand-up", "#0f6cbd"], [4, 0, "Stand-up", "#0f6cbd"], [1, 1, "Design review", "#0f6cbd"], [2, 1, "Dentist", "#8764b8"],
      [0, 2, "1:1 with Sam", "#8764b8"], [2, 3, "Lunch", "#107c10"], [4, 3, "Team lunch", "#107c10"], [0, 6, "Planning", "#0f6cbd"], [2, 7, "Interview", "#8764b8"],
    ];
    return (
      <div className="flex h-full flex-col font-[Segoe_UI,-apple-system,sans-serif] text-[#242424]">
        <div className="flex h-12 items-center gap-3.5 bg-[#0f6cbd] px-3.5 text-white">
          <span className="text-[16px]">⋮⋮⋮</span>
          <span className="text-[16px] font-semibold">Outlook</span>
          <span className="ml-30 flex h-8 w-[440px] items-center rounded-md bg-white/92 px-3 text-[13px] text-[#616161]">⌕ Search</span>
          <span className="ml-auto flex size-[30px] items-center justify-center rounded-full bg-[#8764b8] text-[12px]">AK</span>
        </div>
        <div className="flex min-h-0 flex-1 bg-[#f5f5f5]">
          <div className="flex w-[52px] flex-col items-center gap-4.5 pt-3.5 text-[18px] text-[#616161]"><span>✉</span><span className="text-[#0f6cbd]">▦</span><span>☺</span><span>☑</span></div>
          <div className="flex w-[190px] flex-col gap-2.5 px-3 py-3.5 text-[13px]">
            <div className="flex h-8 items-center self-start rounded bg-[#0f6cbd] px-3.5 font-semibold text-white">+ New event</div>
            <b className="mt-1.5 font-semibold">November 2026</b>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[#616161]">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
              {Array.from({ length: 14 }, (_, i) => <span key={i} className={i + 9 === 16 ? "rounded-full bg-[#0f6cbd] text-white" : ""}>{i + 9}</span>)}
            </div>
            <div className="mt-2 font-semibold">My calendars</div>
            <div><span className="text-[#0f6cbd]">■</span> Calendar</div><div><span className="text-[#8764b8]">■</span> Sam Ortiz</div><div><span className="text-[#107c10]">■</span> Leo Park</div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col bg-white">
            <div className="flex h-11 items-center gap-3 border-b border-[#edebe9] px-4 text-[13px]"><b className="font-semibold">Today</b><span>‹ ›</span><span className="text-[15px] font-semibold">November 16 to 20, 2026</span><span className="ml-auto rounded bg-[#ebf3fc] px-2.5 py-1 text-[#0f6cbd]">Work week</span></div>
            <div className="grid flex-1 grid-cols-[46px_repeat(5,minmax(0,1fr))] grid-rows-[30px_repeat(8,44px)] text-[11.5px] text-[#616161]">
              <div />
              {days.map((d) => <div key={d} className="p-1.5">{d}</div>)}
              {hours.map((h, r) => (
                <div key={h} className="contents">
                  <div className="border-t border-[#f0f0f0] px-1.5 py-0.5">{h}</div>
                  {days.map((d, c) => {
                    const ev = events.find(([x, y]) => x === c && y === r);
                    const invite = stage >= 2 && c === 1 && r === 5;
                    return (
                      <div key={d} className="border-t border-l border-[#f0f0f0] p-0.5">
                        {ev && <div className="h-full rounded border-l-[3px] px-1.5 py-0.5 text-[#242424]" style={{ borderColor: ev[3], background: `${ev[3]}22` }}>{ev[2]}</div>}
                        {invite && <div className="h-full rounded border-l-[3px] border-[#35bfea] bg-[#35bfea]/20 px-1.5 py-0.5 text-[#242424] motion-safe:animate-arrive">Roadmap review</div>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (site === "zillow") {
    const homes = [
      { price: "$612,000", beds: "3 bds | 2 ba | 1,840 sqft", street: "4108 Avenue H", sky: "#9fc8ea", wall: "#e9d3b4", roof: "#6b4a3a", tag: "Open: Sat 1-3pm", broker: "MAGNOLIA REALTY" },
      { price: "$589,000", beds: "3 bds | 2 ba | 1,620 sqft", street: "5402 Avenue G", sky: "#b6d4ec", wall: "#d6dbe0", roof: "#4a5560", tag: "New", broker: "KELLER WILLIAMS" },
      { price: "$630,000", beds: "4 bds | 3 ba | 2,100 sqft", street: "711 E 46th St", sky: "#a9cde8", wall: "#c9b39a", roof: "#5a3f33", tag: "3D tour", broker: "COMPASS RE TEXAS" },
      { price: "$645,000", beds: "3 bds | 2 ba | 1,990 sqft", street: "4512 Duval St", sky: "#a3c6e4", wall: "#f0ead9", roof: "#7a5a46", tag: "Price cut", broker: "REDFIN" },
    ];
    const pins: [number, number, string][] = [[60, 80, "612K"], [180, 150, "589K"], [290, 90, "645K"], [120, 260, "630K"], [260, 300, "598K"], [360, 200, "640K"], [420, 330, "620K"]];
    return (
      <div className="flex h-full flex-col font-[Open_Sans,-apple-system,sans-serif] text-[#2a2a33]">
        <div className="flex h-[54px] items-center border-b border-[#e6e6e6] px-5.5 text-[13.5px] font-semibold">
          <span className="flex gap-5.5"><span>Buy</span><span>Rent</span><span>Sell</span><span>Get a mortgage</span><span>Find an agent</span></span>
          <span className="mx-auto flex items-center gap-1.5 text-[21px] font-bold text-[#006aff]"><BrandLogo id="zillow" size={22} />Zillow</span>
          <span className="flex items-center gap-5.5"><span>Manage rentals</span><span>Get help</span><span className="rounded-lg bg-[#0041d9] px-4 py-1.5 text-white">Sign in</span></span>
        </div>
        <div className="flex h-[54px] items-center gap-2 px-4 text-[13px] font-semibold">
          <span className="flex h-[38px] w-[230px] items-center rounded-lg px-3 font-normal shadow-[inset_0_0_0_1px_#a7a6ab,0_0_0_2px_#35bfea]">Austin TX</span>
          {["For sale ▾", "$0 to $650K ▾", "3+ bd ▾"].map((f) => <span key={f} className="flex h-[38px] items-center rounded-lg px-3.5 text-[#0041d9] shadow-[inset_0_0_0_1px_#0041d9]">{f}</span>)}
          <span className="flex h-[38px] items-center rounded-lg px-3.5 shadow-[inset_0_0_0_1px_#a7a6ab]">Home type ▾</span>
          <span className="ml-auto flex h-[38px] items-center rounded-lg bg-[#0041d9] px-4 text-white">Save search</span>
        </div>
        <div className="flex min-h-0 flex-1">
          <div className="relative flex-[1.05] overflow-hidden bg-[#e8eef2]">
            <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_47%,#fff_47%,#fff_49%,transparent_49%),linear-gradient(25deg,transparent_60%,#ffd77a_60%,#ffd77a_61.5%,transparent_61.5%),linear-gradient(#f7f9fa_2px,transparent_2px),linear-gradient(90deg,#f7f9fa_2px,transparent_2px)] [background-size:100%_100%,100%_100%,60px_52px,60px_52px]" />
            <div className="absolute top-[35%] left-[30%] h-[130px] w-[180px] rounded-full bg-[rgb(160_205_150/0.55)]" />
            {pins.map(([x, y, p]) => <span key={p} className="absolute rounded-[5px] bg-[#a6123f] px-1.5 py-0.5 text-[11px] font-bold text-white shadow-[0_1px_3px_rgb(0_0_0/0.3)]" style={{ left: x, top: y }}>{p}</span>)}
          </div>
          <div className="flex-1 overflow-hidden px-3.5 py-3">
            <div className="text-[17px] font-bold">Austin TX Real Estate &amp; Homes For Sale</div>
            <div className="mt-0.5 mb-2.5 text-[12px] text-[#596b82]">Sort: Homes for you</div>
            <div className="grid grid-cols-2 gap-3">
              {homes.map((h, i) => (
                <div key={h.street} className={`overflow-hidden rounded-lg bg-white shadow-[0_2px_4px_rgb(0_0_0/0.12)] ${stage >= 1 && i === 0 ? "ring-2 ring-[#35bfea]" : ""}`}>
                  <div className="relative h-24" style={{ background: `linear-gradient(180deg, ${h.sky} 0%, #dfeaf2 60%, #86ab78 60%)` }}>
                    <span className="absolute right-[14%] bottom-0 left-[14%] h-[52%] rounded-t-sm" style={{ background: h.wall }} />
                    <span className="absolute bottom-[52%] left-[10%] h-0 w-0 border-r-[72px] border-b-[24px] border-l-[72px] border-r-transparent border-l-transparent" style={{ borderBottomColor: h.roof }} />
                    <span className="absolute bottom-[14%] left-[24%] h-[20%] w-[16%] rounded-sm bg-[#dfeaf2]" />
                    <span className="absolute right-[24%] bottom-[14%] h-[20%] w-[16%] rounded-sm bg-[#dfeaf2]" />
                    <span className="absolute top-1.5 left-1.5 rounded bg-white/92 px-1.5 py-0.5 text-[10px] font-bold">{h.tag}</span>
                    <span className="absolute top-1 right-2 text-[16px] text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]">♡</span>
                  </div>
                  <div className="px-2.5 py-2 text-[11.5px] leading-snug"><b className="text-[16px] font-bold">{h.price}</b><br /><b className="font-semibold">{h.beds}</b> · House for sale<br />{h.street}, Austin, TX<br /><span className="text-[10px] text-[#596b82]">{h.broker}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (site === "wikipedia")
    return (
      <div className="flex h-full font-[Georgia,serif] text-[#202122]">
        <div className="w-[170px] px-4 py-5 font-sans text-[12.5px] text-[#3366cc]"><div className="mb-4 flex items-center gap-2 text-[14px] text-[#202122]"><BrandLogo id="wikipedia" size={22} />Wikipedia</div>Main page<br />Contents<br />Current events<br />Random article</div>
        <div className="flex-1 px-8 py-5">
          <div className="border-b border-[#a2a9b1] pb-1 text-[28px]">Photosynthesis</div>
          <p className="mt-3 max-w-[560px] font-sans text-[13.5px] leading-relaxed">Photosynthesis is a system of biological processes by which photosynthetic organisms, such as most plants, algae and cyanobacteria, convert light energy into chemical energy&hellip;</p>
        </div>
      </div>
    );
  if (site === "docs")
    return (
      <div className="flex h-full flex-col bg-[#f9fbfd] font-[Roboto,Arial,sans-serif] text-[#1f1f1f]">
        <div className="flex h-[58px] items-center gap-3 px-3.5">
          <BrandLogo id="docs" size={30} />
          <div>
            <div className="text-[18px]">Launch notes <span className="text-[14px] text-[#5f6368]">☆</span></div>
            <div className="flex gap-3.5 text-[13px] text-[#444746]">{["File", "Edit", "View", "Insert", "Format", "Tools", "Extensions", "Help"].map((m) => <span key={m}>{m}</span>)}</div>
          </div>
          <span className="ml-auto flex h-[38px] items-center rounded-full bg-[#c2e7ff] px-5.5 text-[14px] font-medium">Share</span>
          <span className="flex size-8 items-center justify-center rounded-full bg-[#7c4dff] text-[13px] text-white">A</span>
        </div>
        <div className="mx-3.5 flex h-10 items-center gap-4 rounded-full bg-[#edf2fa] px-4 text-[13px] text-[#444746]"><span>↶ ↷</span><span>100% ▾</span><span>Normal text ▾</span><span>Arial ▾</span><span>− 11 +</span><b>B</b><i>I</i><u>U</u><span>A</span></div>
        <div className="flex flex-1 justify-center overflow-hidden pt-3.5">
          <div className="w-[600px] bg-white px-16 py-11 font-[Arial,sans-serif] text-[13px] leading-[1.7] shadow-[0_1px_3px_rgb(60_64_67/0.15),0_0_0_1px_#e0e3e7]">
            <div className="mb-2.5 text-[24px]">Launch brief</div>
            {stage >= 1 && <><div className="mt-1.5 text-[16px]">What we&rsquo;re shipping</div><div className="motion-safe:animate-arrive">A first-run tour, the agent&rsquo;s card, and new tab backgrounds.</div></>}
            {stage >= 2 && <><div className="mt-2.5 text-[16px]">Who it&rsquo;s for</div><div className="rounded-sm bg-[#35bfea]/15 shadow-[0_0_0_2px_rgb(53_191_234/0.5)] motion-safe:animate-arrive">Students and people who live in their browser, and want errands done.</div></>}
          </div>
        </div>
      </div>
    );
  const assignments: [string, string, string][] = [
    ["Lab report 3: Enzyme kinetics", "Due Nov 19 at 11:59pm", "50 pts"],
    ["Quiz 4: Cell signalling", "Due Nov 20 at 9am", "20 pts"],
    ["Reading: Chapter 4", "Before Thursday’s lecture", ""],
    ["Discussion: Week 11", "Due Nov 22 at 11:59pm", "10 pts"],
  ];
  return (
    <div className="flex h-full font-[Lato,Helvetica_Neue,Arial,sans-serif] text-[#2d3b45]">
      <div className="flex w-[84px] flex-col items-center gap-4 bg-[#394b58] pt-3.5 text-center text-[10.5px] text-white">
        <BrandLogo id="canvas" size={40} colour="#ffffff" />
        <span><span className="mx-auto mb-0.5 block size-[26px] rounded-full bg-[#e66000]" />Account</span>
        <span>▤<br />Dashboard</span>
        <span className="w-full bg-white py-1.5 text-[#394b58]">▣<br />Courses</span>
        <span>▦<br />Calendar</span>
        <span>✉<br />Inbox</span>
      </div>
      <div className="flex w-[170px] flex-col gap-3 px-3 py-4.5 text-[14px] text-[#2b7abc]">
        <span>Home</span><span>Announcements</span><span className="-ml-3 border-l-[3px] border-[#2d3b45] pl-2.5 text-[#2d3b45]">Assignments</span><span>Discussions</span><span>Grades</span><span>Modules</span><span>Syllabus</span>
      </div>
      <div className="min-w-0 flex-1 px-6 py-4 text-[14px]">
        <div className="text-[#2b7abc]">BIO 201 <span className="text-[#6b7780]">›</span> <span className="text-[#2d3b45]">Assignments</span></div>
        <div className="my-3 flex h-9 w-[280px] items-center rounded px-2.5 text-[#6b7780] shadow-[inset_0_0_0_1px_#c7cdd1]">⌕ Search for Assignment</div>
        <div className="overflow-hidden rounded border border-[#c7cdd1]">
          <div className="bg-[#f5f5f5] px-3.5 py-2.5 font-bold">▾ Upcoming Assignments</div>
          {assignments.map(([n, d, p], i) => (
            <div key={n} className="flex items-center justify-between border-t border-[#e8eaec] px-3.5 py-2.5" style={{ boxShadow: stage >= 1 && i < 2 ? "inset 4px 0 0 #35bfea" : "none" }}>
              <div><b className="font-bold">{n}</b><br /><span className="text-[12.5px] text-[#6b7780]">{d}</span></div>
              <span className="text-[12.5px] text-[#6b7780]">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
