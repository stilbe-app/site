"use client";

import { useId, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { SiteScene, type SiteId } from "@/components/site-scene";

const ERRANDS: { id: SiteId; tab: string; site: string; task: string; outcome: string; wash: string; ink: string }[] = [
  { id: "gmail", tab: "Email", site: "Gmail", task: "Reply to Priya: Thursday works, and ask if lunch is covered.", outcome: "It reads the thread, checks your calendar, drafts the reply in your voice, and asks before sending.", wash: "#ece3ff", ink: "#5b3fb0" },
  { id: "outlook", tab: "Calendar", site: "Outlook", task: "Find an hour with Sam and Leo next week.", outcome: "It checks all three calendars, finds Tuesday at 2, and asks before sending the invite.", wash: "#dff0ff", ink: "#1f5f99" },
  { id: "zillow", tab: "Homes", site: "Zillow", task: "Three-beds under $650K in Austin, near good schools.", outcome: "It opens every likely home in tabs of its own, compares the schools, and tells you which two to visit.", wash: "#ddf5e8", ink: "#24734b" },
  { id: "wikipedia", tab: "Research", site: "Wikipedia", task: "Explain the light reactions simply, and make me five flashcards.", outcome: "It reads the article with you, explains the hard part in plain words, and turns it into flashcards.", wash: "#ece3ff", ink: "#5b3fb0" },
  { id: "docs", tab: "Writing", site: "Google Docs", task: "Turn my notes into a one-page brief.", outcome: "It writes the brief into the document itself, section by section, as you watch.", wash: "#e3ecff", ink: "#2a4fa8" },
  { id: "canvas", tab: "Coursework", site: "Canvas", task: "What’s due this week?", outcome: "It reads your assignments and gives you the deadlines, and what the reading says.", wash: "#ffe6dc", ink: "#a4462a" },
];

/**
 * The errands, as tabs over one panel: what was asked and what it does on
 * the left, the agent doing it on the real site on the right; the panel
 * takes the errand's soft colour, with the mercury's light in its corner.
 * Arrow keys move between the tabs, as tabs should.
 */
export function ErrandPanel() {
  const [i, setI] = useState(0);
  const base = useId();
  const e = ERRANDS[i];
  return (
    <div>
      <div
        role="tablist"
        aria-label="Errands"
        className="flex flex-wrap justify-center gap-1.5"
        onKeyDown={(ev) => {
          const dir = ev.key === "ArrowRight" ? 1 : ev.key === "ArrowLeft" ? -1 : 0;
          if (!dir) return;
          ev.preventDefault();
          const next = (i + dir + ERRANDS.length) % ERRANDS.length;
          setI(next);
          document.getElementById(`${base}-tab-${next}`)?.focus();
        }}
      >
        {ERRANDS.map((x, n) => (
          <button
            key={x.id}
            id={`${base}-tab-${n}`}
            role="tab"
            aria-selected={n === i}
            aria-controls={`${base}-panel`}
            tabIndex={n === i ? 0 : -1}
            onClick={() => setI(n)}
            className={`h-11 rounded-full px-4.5 text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glint ${
              n === i ? "bg-ink text-white" : "bg-[#f3f5f7] text-slate hover:bg-[#e7eaee] hover:text-ink"
            }`}
          >
            {x.tab}
          </button>
        ))}
      </div>
      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${i}`}
        className="relative mt-8 grid items-center gap-9 overflow-hidden rounded-[24px] p-[clamp(18px,2.4vw,30px)] transition-colors duration-500 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]"
        style={{ background: e.wash }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-56 -left-44 size-[560px] rounded-full bg-[conic-gradient(from_0deg,rgb(53_191_234/0.55),rgb(138_99_255/0.45),rgb(255_122_168/0.35),rgb(255_193_90/0.3),rgb(53_191_234/0.55))] opacity-70 blur-[70px] motion-safe:animate-spin-slow" />
        <div className="relative" key={e.id}>
          <div className="flex items-center gap-2 text-[13px] font-medium motion-safe:animate-arrive" style={{ color: e.ink }}>
            <BrandLogo id={e.id} size={16} />
            {e.site}
          </div>
          <h3 className="font-wide mt-2.5 text-[clamp(22px,2.2vw,28px)] leading-[1.18] font-light tracking-[-0.01em] motion-safe:animate-arrive">{e.task}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-[#3e4550] motion-safe:animate-arrive">{e.outcome}</p>
        </div>
        <div className="relative">
          <SiteScene key={e.id} site={e.id} className="shadow-[0_30px_70px_-30px_rgb(20_23_28/0.45)]" />
        </div>
      </div>
    </div>
  );
}
