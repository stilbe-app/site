"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AgentFace } from "@/components/agent-face";

const NAME = "Fern";
const ASKED = "Find two-beds under £2,400 within 20 minutes of Farringdon, and check which allow a cat.";
const STEPS = [
  "Searched two-beds under £2,400 near Farringdon",
  "Opened 3 listings in tabs of its own",
  "Checked the walk to Farringdon from each",
  "Read each one's pet policy",
];
/** What it's doing while each step is under way. */
const DOING = ["Searching listings", "Opening the listings", "Working out the walks", "Reading pet policies"];
const ANSWER =
  "Two fit. The one on Amwell Street is £2,350, 12 minutes away, and allows cats. The Exmouth Market flat is cheaper, but says no pets.";

const MOTION = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (changed: () => void) => {
  const query = matchMedia(MOTION);
  query.addEventListener("change", changed);
  return () => query.removeEventListener("change", changed);
};
const prefersStill = () => matchMedia(MOTION).matches;

/**
 * A Stilbe window with the agent's card over the page's corner, working
 * through one errand once as the page loads: a step at a time, the glint
 * round the page while it works, then its answer. Drawn, not a screenshot,
 * so it's sharp at any size; still and finished for reduced motion.
 */
export function AgentAtWork() {
  const still = useSyncExternalStore(subscribeMotion, prefersStill, () => false);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (still) return;
    const timer = setInterval(() => setStep((s) => (s >= STEPS.length ? s : s + 1)), 1300);
    return () => clearInterval(timer);
  }, [still]);
  const stage = still ? STEPS.length : step;
  const working = stage < STEPS.length;

  return (
    <figure className="m-0" aria-label={`Stilbe, with its agent ${NAME} finding a flat`}>
      <div className="overflow-hidden rounded-[14px] bg-paper shadow-[0_40px_80px_-40px_rgb(20_23_28/0.35),0_0_0_1px_rgb(20_23_28/0.08)]" aria-hidden="true">
        {/* Tabs on top, and the agent's tabs gathered in a group under its face. */}
        <div className="flex items-end gap-1 px-3 pt-2.5">
          <div className="flex gap-[7px] pr-2.5 pb-3 pl-1">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex h-[34px] min-w-0 items-center gap-2 rounded-t-[10px] bg-[#f3f5f7] px-3.5 text-[12.5px]">
            <span className="size-3.5 shrink-0 rounded bg-[#c3c9d0]" />
            <span className="truncate">Flats near Clerkenwell</span>
          </div>
          <div className="hidden h-[34px] items-center gap-1.5 px-2.5 text-[12.5px] text-slate sm:flex">
            <span className="flex h-[22px] items-center gap-1.5 rounded-full bg-glint/15 pr-2.5 pl-1 text-[11.5px] font-medium text-[#0d6d93]">
              <AgentFace name={NAME} size={16} mood={working ? "thinking" : "happy"} />
              Flat hunt
            </span>
            3 tabs
          </div>
        </div>
        <div className="flex items-center gap-2.5 border-b border-[#d9dee4] bg-[#f3f5f7] px-3 py-2">
          <div className="flex gap-3.5 px-1.5 text-[14px] text-steel">
            <span>‹</span>
            <span>›</span>
          </div>
          <div className="flex h-8 min-w-0 flex-1 items-center truncate rounded-full bg-[#e6e9ed] px-3.5 text-[13px] text-slate">rightmove.co.uk/flats/clerkenwell</div>
        </div>

        {/* The page, with the glint round it while the agent is at work. */}
        <div
          className={`relative h-[min(560px,120vw)] overflow-hidden bg-white transition-shadow duration-700 ${
            working ? "shadow-[inset_0_0_0_2px_var(--color-glint),inset_0_0_24px_2px_rgb(53_191_234/0.22)]" : ""
          }`}
        >
          <div className="flex max-w-[640px] flex-col gap-5 p-6 sm:p-10">
            <div className="h-5 w-56 rounded-md bg-[#e6e9ed]" />
            {[0.8, 0.7, 0.75].map((w, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-[110px] w-[38%] max-w-[190px] shrink-0 rounded-[10px] bg-[#dfe4e9]" />
                <div className="flex flex-1 flex-col gap-2.5 pt-1.5">
                  <div className="h-3.5 rounded bg-[#e6e9ed]" style={{ width: `${w * 100}%` }} />
                  <div className="h-3 w-1/2 rounded bg-[#eef0f3]" />
                  <div className="h-3 w-3/5 rounded bg-[#eef0f3]" />
                </div>
              </div>
            ))}
          </div>

          {/* The card. */}
          <div className="absolute right-3 bottom-3 flex w-[min(360px,calc(100%-24px))] flex-col gap-2.5 rounded-[18px] bg-white p-3.5 text-left shadow-[0_0_0_1px_rgb(0_0_0/0.1),0_18px_40px_-18px_rgb(20_23_28/0.3)] sm:right-5 sm:bottom-5 sm:p-4">
            <div className="flex items-center gap-2.5">
              <AgentFace name={NAME} size={28} mood={working ? "thinking" : "happy"} />
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-medium">{NAME}</div>
                <div className="text-[11.5px] text-[#0d86b5]">{working ? "Working" : "Done"}</div>
              </div>
            </div>
            <div className="rounded-xl bg-[#f3f5f7] px-3 py-2 text-[13px] leading-snug">{ASKED}</div>
            <ol className="m-0 flex list-none flex-col gap-1 p-0 text-[12.5px] leading-snug text-slate">
              {STEPS.slice(0, stage).map((step) => (
                <li key={step} className="flex gap-2 motion-safe:animate-arrive">
                  <span className="text-steel">·</span>
                  {step}
                </li>
              ))}
              {working && (
                <li className="flex gap-2 text-[#0d86b5]">
                  <span className="motion-safe:animate-pulse">●</span>
                  {DOING[stage]}
                </li>
              )}
            </ol>
            {!working && <p className="m-0 text-[13px] leading-normal motion-safe:animate-arrive">{ANSWER}</p>}
            <div className="flex h-[38px] items-center rounded-full bg-[#e6e9ed] pr-1.5 pl-3.5 text-[13px] text-steel">
              <span className="flex-1">Ask a follow-up…</span>
              <span className="size-7 rounded-full bg-ink/25" />
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-[13px] text-steel">The agent&rsquo;s card sits over the page&rsquo;s corner, so the page keeps its width. ⌘E folds it away.</figcaption>
    </figure>
  );
}
