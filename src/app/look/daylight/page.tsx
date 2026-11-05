import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AgentAtWork } from "@/components/agent-at-work";
import { AgentFace } from "@/components/agent-face";
import { SiteFooter } from "@/components/site-footer";
import { business } from "@/lib/business";
import { copy } from "@/lib/copy";
import { DOWNLOAD, REQUIREMENT } from "@/lib/download";

export const metadata: Metadata = { title: "Stilbe · Daylight", robots: { index: false, follow: false } };

/** Each feature on its own soft colour, with a word for it in that colour's ink. */
const TINTS = [
  { bg: "#ece3ff", ink: "#5b3fb0" },
  { bg: "#dff0ff", ink: "#1f5f99" },
  { bg: "#ffe6dc", ink: "#a4462a" },
  { bg: "#ddf5e8", ink: "#24734b" },
];
const FACES = ["Fern", "Otto", "Pip", "Juno"];

/** B: daylight. A colourful wash, as the new tab's backdrops but turned up, and frosted glass. */
export default function Daylight() {
  return (
    <div className="overflow-x-clip bg-[#f7f5fb] text-ink">
      <div className="relative">
        {/* The wash, its colours drifting. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -bottom-40">
          <div className="absolute -top-20 -left-40 size-[760px] rounded-full bg-[#e3d2ff] blur-[90px] motion-safe:animate-drift" />
          <div className="absolute -top-32 right-[-10%] size-[620px] rounded-full bg-[#ffd6c2] blur-[90px] motion-safe:animate-drift-slow" />
          <div className="absolute top-[40%] right-[5%] size-[700px] rounded-full bg-[#c9e6ff] blur-[100px] motion-safe:animate-drift" />
          <div className="absolute top-[55%] left-[5%] size-[560px] rounded-full bg-[#d2f3e2] blur-[100px] motion-safe:animate-drift-slow" />
        </div>

        <header className="relative mx-auto flex max-w-[1180px] items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/stilbe-mark.png" alt="" width={30} height={30} priority />
            <span className="font-wide text-[20px] font-light">Stilbe</span>
          </Link>
          <nav className="flex items-center gap-1 rounded-full bg-white/55 p-1.5 text-[14px] text-slate shadow-[inset_0_0_0_1px_rgb(255_255_255/0.8),0_6px_20px_-10px_rgb(60_40_120/0.25)] backdrop-blur-xl">
            <a href="#how" className="rounded-full px-3.5 py-2 hover:text-ink">How it works</a>
            <a href="#pricing" className="rounded-full px-3.5 py-2 hover:text-ink">Pricing</a>
            <a href={DOWNLOAD} className="rounded-full bg-ink px-4.5 py-2 font-medium text-white hover:opacity-90">Download for Mac</a>
          </nav>
        </header>

        <section className="relative mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-14 gap-y-12 px-6 pt-14 pb-28">
          <div className="flex-[1_1_380px]">
            <Image src="/stilbe-mark.png" alt="" width={64} height={64} className="motion-safe:animate-arrive" />
            <h1 className="font-wide mt-7 text-[clamp(44px,5vw,68px)] leading-[1.02] font-light tracking-[-0.03em] motion-safe:animate-arrive motion-safe:[animation-delay:0.2s]">{copy.headline}</h1>
            <p className="mt-5 text-[21px] leading-snug font-light text-balance text-[#2b2f37] motion-safe:animate-arrive motion-safe:[animation-delay:0.35s]">{copy.line}</p>
            <p className="mt-4 text-[15.5px] leading-relaxed text-pretty text-slate motion-safe:animate-arrive motion-safe:[animation-delay:0.5s]">{copy.lede}</p>
            <div className="mt-8 flex flex-wrap gap-2.5 motion-safe:animate-arrive motion-safe:[animation-delay:0.65s]">
              <a href={DOWNLOAD} className="inline-flex min-h-[50px] items-center rounded-full bg-ink px-6.5 text-[15.5px] font-medium text-white shadow-[0_12px_30px_-12px_rgb(60_40_120/0.55)] hover:opacity-90">
                Download for Mac
              </a>
              <a href="#pricing" className="inline-flex min-h-[50px] items-center rounded-full bg-white/60 px-5.5 text-[15.5px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.9)] backdrop-blur-xl hover:bg-white/80">
                See pricing
              </a>
            </div>
            <p className="mt-3.5 text-[13px] text-[#626a76]">Free. {REQUIREMENT}.</p>
          </div>
          {/* The window on frosted glass, turned a little toward the words. */}
          <div className="flex-[1.5_1_520px] [perspective:1800px]">
            <div className="rounded-[22px] bg-white/45 p-2.5 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.9),0_50px_90px_-40px_rgb(60_40_120/0.45)] backdrop-blur-2xl [transform:rotateY(-7deg)_rotateX(2deg)]">
              <AgentAtWork />
            </div>
          </div>
        </section>
      </div>

      <section id="how" className="relative mx-auto max-w-[1180px] scroll-mt-6 px-6 pt-6 pb-24">
        <h2 className="font-wide text-[clamp(30px,3.6vw,44px)] leading-tight font-light tracking-[-0.02em]">{copy.featuresTitle}</h2>
        <div className="mt-9 grid gap-4.5 md:grid-cols-2">
          {copy.features.map((f, i) => (
            <div key={f.title} className="flex min-h-[220px] items-end gap-6 rounded-[26px] p-8 transition-transform duration-300 hover:-translate-y-1" style={{ background: TINTS[i].bg }}>
              <div className="flex-1">
                <span className="inline-block rounded-full bg-white/70 px-3 py-1 text-[12px] font-medium" style={{ color: TINTS[i].ink }}>
                  {f.word}
                </span>
                <h3 className="mt-3 text-[22px] font-medium">{f.title}</h3>
                <p className="mt-2 max-w-[30em] text-[15px] leading-relaxed text-[#3e4550]">{f.line}</p>
              </div>
              <AgentFace name={FACES[i]} size={56} mood={i % 2 ? "happy" : "idle"} className="shrink-0" />
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-[1180px] scroll-mt-6 px-6 pb-24">
        <div className="flex max-w-[40em] flex-col gap-3">
          <h2 className="font-wide text-[clamp(30px,3.6vw,44px)] font-light tracking-[-0.02em]">Pricing</h2>
          <p className="text-[16px] leading-relaxed text-slate">{copy.pricingLine}</p>
        </div>
        <div className="mt-9 flex flex-wrap gap-4.5">
          <div className="flex-[1_1_300px] rounded-[26px] bg-white p-8 shadow-[0_0_0_1px_#ebe7f2]">
            <div className="text-[18px] font-medium">Free</div>
            <div className="font-wide mt-3 text-[46px] font-light">$0</div>
            <p className="mt-2.5 text-[15px] leading-relaxed text-slate">{copy.free}</p>
          </div>
          <div className="flex-[1_1_300px] rounded-[26px] bg-[linear-gradient(135deg,#e7d8ff,#cfe9ff_60%,#d9f5e6)] p-8">
            <div className="text-[18px] font-medium">Pro</div>
            <div className="mt-3">
              <span className="font-wide text-[46px] font-light">{business.pro.price}</span>
              <span className="text-[14px] text-slate"> a {business.pro.period}</span>
            </div>
            <p className="mt-2.5 text-[15px] leading-relaxed text-[#3e4550]">{copy.pro}</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-6 px-6 pt-10 pb-12 text-center">
        <p className="font-wide text-[28px] font-light">{copy.closing}</p>
        <a href={DOWNLOAD} className="inline-flex min-h-[50px] items-center rounded-full bg-ink px-6.5 text-[15.5px] font-medium text-white hover:opacity-90">
          Download for Mac
        </a>
      </section>
      <SiteFooter className="px-6 pb-12" />
    </div>
  );
}
