"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AgentFace } from "@/components/agent-face";

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
      { x: 420, y: 120, label: "Reading the thread", done: "Read the thread" },
      { x: 300, y: 210, label: "Checking your calendar", done: "Checked your calendar for the 14th" },
      { x: 380, y: 330, label: "Writing the reply", done: "Drafted the reply" },
    ],
    ask: "Send the reply to Priya?",
  },
  outlook: {
    tab: "Calendar", icon: "#0f6cbd", host: "outlook.office.com", path: "/calendar/view/workweek", group: "Find a time", agent: "Otto",
    asked: "Find an hour with Sam and Leo next week and send an invite.",
    moves: [
      { x: 330, y: 200, label: "Checking Monday", done: "Checked three calendars" },
      { x: 470, y: 330, label: "Checking Tuesday", done: "Tuesday 2 to 3 is free for all of you" },
      { x: 470, y: 330, label: "Writing the invite", done: "Wrote the invite" },
    ],
    ask: "Send “Roadmap review” to Sam and Leo for Tue 2 PM?",
  },
  zillow: {
    tab: "Austin homes", icon: "#006aff", host: "www.zillow.com", path: "/austin-tx/", group: "House hunt", agent: "Juno",
    asked: "Three-beds under $650K in Austin near good schools, with a yard.",
    moves: [
      { x: 330, y: 40, label: "Searching 3+ beds under $650K", done: "Searched 3+ beds under $650K" },
      { x: 620, y: 150, label: "Opening 4108 Avenue H", done: "Opened 6 homes in tabs of its own" },
      { x: 780, y: 150, label: "Comparing schools", done: "Compared the school ratings" },
    ],
    answer: "Two are worth a visit: 4108 Avenue H, $612K, with a big yard and a 9/10 school, and 711 E 46th St.",
  },
  wikipedia: {
    tab: "Photosynthesis", icon: "#202122", host: "en.wikipedia.org", path: "/wiki/Photosynthesis", group: "Bio notes", agent: "Pip",
    asked: "Explain the light reactions simply, and make me five flashcards.",
    moves: [
      { x: 300, y: 150, label: "Reading the article", done: "Read the article" },
      { x: 300, y: 300, label: "Reading Light reactions", done: "Read the light reactions section" },
      { x: 520, y: 220, label: "Writing flashcards", done: "Made five flashcards" },
    ],
    answer: "Light hits chlorophyll, which splits water: oxygen goes out, and the energy is stored as ATP and NADPH for making sugar.",
  },
  docs: {
    tab: "Launch notes", icon: "#4285f4", host: "docs.google.com", path: "/document/d/…/edit", group: "Launch brief", agent: "Fern",
    asked: "Turn my notes into a one-page launch brief.",
    moves: [
      { x: 380, y: 160, label: "Reading your notes", done: "Read your notes" },
      { x: 420, y: 250, label: "Writing “What we’re shipping”", done: "Wrote what you’re shipping" },
      { x: 440, y: 330, label: "Writing “Who it’s for”", done: "Wrote who it’s for" },
    ],
    answer: "The brief is in your document: three sections, one page. Have a look at “Who it’s for”.",
  },
  canvas: {
    tab: "BIO 201", icon: "#e66000", host: "canvas.instructure.com", path: "/courses/1182/assignments", group: "This week", agent: "Juno",
    asked: "What’s due this week, and summarise the chapter 4 reading.",
    moves: [
      { x: 360, y: 140, label: "Reading your assignments", done: "Read your assignments" },
      { x: 360, y: 260, label: "Opening Chapter 4", done: "Opened the chapter 4 reading" },
      { x: 520, y: 200, label: "Summarising", done: "Summarised the chapter" },
    ],
    answer: "Two are due: the lab report on Thursday and the quiz on Friday. Chapter 4 is about how cells signal: here are the six ideas.",
  },
};

const STEP = 2200;

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
  const [shot, setShot] = useState(false);
  useEffect(() => {
    let live = true;
    fetch(`/shots/${site}.png`, { method: "HEAD" }).then(
      (r) => live && setShot(r.ok && (r.headers.get("content-type") ?? "").startsWith("image/")),
      () => {},
    );
    return () => {
      live = false;
    };
  }, [site]);
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
            <span className="size-[13px] rounded" style={{ background: scene.icon }} />
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

/** The site itself, drawn, for until there's a screenshot. Near enough to know it, not a copy. */
function Drawn({ site, stage }: { site: SiteId; stage: number }) {
  if (site === "gmail")
    return (
      <div className="flex h-full bg-[#f6f8fc] text-[13px] text-[#3c4043]">
        <div className="flex w-[200px] flex-col gap-1 px-3 py-4">
          <div className="px-2.5 pb-3 text-[20px] text-[#5f6368]">Gmail</div>
          <div className="mb-2 self-start rounded-2xl bg-[#c2e7ff] px-5 py-3 font-medium">Compose</div>
          <div className="flex justify-between rounded-full bg-[#d3e3fd] px-3 py-1.5 font-semibold"><span>Inbox</span><span>12</span></div>
          <div className="px-3 py-1.5">Starred</div><div className="px-3 py-1.5">Sent</div><div className="px-3 py-1.5">Drafts</div>
        </div>
        <div className="mt-2.5 mr-2.5 flex flex-1 flex-col gap-3 rounded-t-2xl bg-white px-7 py-5">
          <div className="text-[20px]">Re: Q3 offsite dates</div>
          <div className="text-[#5f6368]"><b className="font-semibold text-[#1f1f1f]">Priya Shah</b> to me · 9:41 AM</div>
          <div className="max-w-[470px] text-[14px] leading-relaxed text-[#1f1f1f]">Hi, could you do Thursday the 14th or Friday the 15th for the planning day? We&rsquo;d start at 10. Let me know either way.</div>
          {stage >= 2 && (
            <div className="w-[470px] rounded-xl p-4 text-[14px] leading-relaxed shadow-[0_0_0_2px_#35bfea] motion-safe:animate-arrive">
              <div className="mb-1.5 text-[12px] text-[#5f6368]">Reply to Priya Shah</div>
              Thursday the 14th works for me. Is lunch covered, or should I bring something?
            </div>
          )}
        </div>
      </div>
    );
  if (site === "outlook") {
    const days = ["Mon 16", "Tue 17", "Wed 18", "Thu 19", "Fri 20"];
    const events: Record<string, [number, number, string, boolean?]> = {
      a: [0, 0, "Stand-up"], b: [1, 1, "Design review"], c: [2, 1, "Dentist"], d: [0, 2, "1:1 with Sam"], e: [2, 3, "Lunch"], f: [4, 3, "Team lunch"], g: [0, 6, "Planning"], h: [2, 7, "Interview"],
    };
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-11 items-center bg-[#0f6cbd] px-4.5 text-[15px] font-semibold text-white">Outlook</div>
        <div className="flex flex-1">
          <div className="flex w-[180px] flex-col gap-2 border-r border-[#edebe9] p-4 text-[13px] text-[#424242]"><b className="font-semibold">November 2026</b><span>My calendars</span><span>· Calendar</span><span>· Sam Ortiz</span><span>· Leo Park</span></div>
          <div className="relative grid flex-1 grid-cols-[50px_repeat(5,minmax(0,1fr))] grid-rows-[34px_repeat(8,46px)] text-[11.5px] text-[#605e5c]">
            <div />
            {days.map((d) => <div key={d} className="p-2">{d}</div>)}
            {Array.from({ length: 8 }, (_, r) => (
              <div key={r} className="contents">
                <div className="border-t border-[#f3f2f1] px-1.5 py-1">{r + 9 > 12 ? `${r - 3} PM` : `${r + 9} ${r + 9 === 12 ? "PM" : "AM"}`}</div>
                {days.map((d, c) => {
                  const ev = Object.values(events).find(([x, y]) => x === c && y === r);
                  const invite = stage >= 2 && c === 1 && r === 5;
                  return (
                    <div key={d} className="border-t border-l border-[#f3f2f1] p-[3px]">
                      {ev && <div className="h-full rounded border-l-[3px] border-[#0f6cbd] bg-[#deecf9] px-1.5 py-0.5 text-[#11100f]">{ev[2]}</div>}
                      {invite && <div className="h-full rounded border-l-[3px] border-[#35bfea] bg-[#35bfea]/20 px-1.5 py-0.5 text-[#11100f] motion-safe:animate-arrive">Roadmap review</div>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (site === "zillow")
    return (
      <div className="flex h-full flex-col text-[13px] text-[#2a2a33]">
        <div className="flex h-[52px] items-center gap-4.5 border-b border-[#e6e6e6] px-5">
          <span className="text-[19px] font-bold text-[#006aff]">Zillow</span><span>Buy</span><span>Rent</span><span>Sell</span>
          <span className="ml-4 rounded-lg px-3.5 py-1.5 shadow-[0_0_0_2px_#35bfea]">Austin, TX · 3+ bd · under $650K</span>
        </div>
        <div className="flex flex-1">
          <div className="relative flex-[1.1] overflow-hidden bg-[linear-gradient(135deg,#e8efe6,#dfe9ef)]">
            <div className="absolute inset-0 bg-[linear-gradient(#fff_2px,transparent_2px),linear-gradient(90deg,#fff_2px,transparent_2px)] [background-size:80px_70px] opacity-80" />
            {[[60, 80, "$612K"], [180, 150, "$589K"], [290, 90, "$645K"], [120, 260, "$630K"], [260, 300, "$598K"], [360, 200, "$640K"]].map(([x, y, p]) => (
              <span key={p as string} className="absolute rounded-md bg-[#d1335b] px-2 py-0.5 text-[11.5px] font-bold text-white" style={{ left: x as number, top: y as number }}>{p}</span>
            ))}
          </div>
          <div className="grid flex-1 grid-cols-2 content-start gap-3 p-3.5">
            {[["$612,000", "4108 Avenue H"], ["$589,000", "5402 Avenue G"], ["$630,000", "711 E 46th St"], ["$645,000", "4512 Duval St"]].map(([p, s], i) => (
              <div key={s} className={`overflow-hidden rounded-[10px] ${stage >= 1 && i < 3 ? "shadow-[0_0_0_2px_#35bfea]" : "shadow-[0_0_0_1px_#e6e6e6]"}`}>
                <div className="h-[90px] bg-[linear-gradient(160deg,#cfe3f5_55%,#9cc29a_55%)]" />
                <div className="px-2.5 py-2 text-[12px] leading-snug"><b className="text-[15px]">{p}</b><br />3 bd · 2 ba<br /><span className="text-[#596b82]">{s}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  if (site === "wikipedia")
    return (
      <div className="flex h-full font-serif text-[#202122]">
        <div className="w-[170px] px-4 py-5 font-sans text-[12.5px] text-[#3366cc]"><div className="mb-4 text-[14px] text-[#202122]">Wikipedia</div>Main page<br />Contents<br />Current events<br />Random article</div>
        <div className="flex-1 px-8 py-5">
          <div className="border-b border-[#a2a9b1] pb-1 text-[28px]">Photosynthesis</div>
          <p className="mt-3 max-w-[560px] font-sans text-[13.5px] leading-relaxed">Photosynthesis is a system of biological processes by which photosynthetic organisms, such as most plants, algae and cyanobacteria, convert light energy into chemical energy&hellip;</p>
          <div className={`mt-5 max-w-[560px] rounded ${stage >= 1 ? "bg-[#35bfea]/12 shadow-[0_0_0_2px_rgb(53_191_234/0.5)]" : ""}`}>
            <div className="border-b border-[#a2a9b1] pb-1 text-[20px]">Light-dependent reactions</div>
            <p className="mt-2 font-sans text-[13.5px] leading-relaxed">In the light-dependent reactions, one molecule of the pigment chlorophyll absorbs one photon and loses one electron&hellip; water is split, releasing oxygen.</p>
          </div>
        </div>
      </div>
    );
  if (site === "docs")
    return (
      <div className="flex h-full flex-col bg-[#f9fbfd]">
        <div className="flex h-[50px] items-center gap-3 px-4.5 text-[14px] text-[#1f1f1f]"><span className="h-7 w-[22px] rounded-sm bg-[#4285f4]" />Launch notes<span className="text-[12px] text-[#5f6368]">File  Edit  View  Insert  Format</span></div>
        <div className="flex flex-1 justify-center pt-3.5">
          <div className="w-[560px] bg-white px-14 py-10 text-[13px] leading-[1.7] text-[#1f1f1f] shadow-[0_1px_3px_rgb(60_64_67/0.3)]">
            <div className="mb-2.5 text-[22px]">Launch brief</div>
            {stage >= 1 && <><b className="font-semibold">What we&rsquo;re shipping</b><div className="motion-safe:animate-arrive">A first-run tour, the agent&rsquo;s card, and new tab backgrounds.</div></>}
            {stage >= 2 && <><b className="mt-2 block font-semibold">Who it&rsquo;s for</b><div className="rounded-sm bg-[#35bfea]/15 motion-safe:animate-arrive">Students and people who live in their browser, and want errands done.</div></>}
          </div>
        </div>
      </div>
    );
  return (
    <div className="flex h-full text-[13px] text-[#2d3b45]">
      <div className="flex w-[84px] flex-col items-center gap-4 bg-[#2d3b45] pt-4.5 text-[10px] text-white"><span className="size-[34px] rounded-full bg-[#e66000]" />Account<span>Courses</span><span>Calendar</span><span>Inbox</span></div>
      <div className="flex-1 px-7 py-5">
        <div className="text-[12px] text-[#6b7780]">BIO 201 · Assignments</div>
        <div className="mt-1.5 mb-3.5 text-[22px]">Assignments</div>
        {[["Lab report 3: Enzyme kinetics", "Due Thu, Nov 19 at 11:59 PM", "50 pts"], ["Quiz 4: Cell signalling", "Due Fri, Nov 20 at 9 AM", "20 pts"], ["Reading: Chapter 4", "Before Thursday’s lecture", ""], ["Discussion: Week 11", "Due Sun, Nov 22", "10 pts"]].map(([n, d, p], i) => (
          <div key={n} className={`mb-2 flex justify-between rounded-md bg-white px-3.5 py-3 ${stage >= 1 && i < 2 ? "shadow-[0_0_0_2px_#35bfea]" : "shadow-[0_0_0_1px_#e1e4e6]"}`}>
            <div><b className="font-semibold">{n}</b><br /><span className="text-[#6b7780]">{d}</span></div><span className="text-[#6b7780]">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
