import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AgentAtWork } from "@/components/agent-at-work";
import { AgentFace } from "@/components/agent-face";
import { SiteFooter } from "@/components/site-footer";
import { business } from "@/lib/business";
import { copy } from "@/lib/copy";
import { DOWNLOAD, REQUIREMENT } from "@/lib/download";

export const metadata: Metadata = { title: "Stilbe · Colour blocks", robots: { index: false, follow: false } };

/** The bands: raspberry, saffron, navy, and a deep green for the fourth. */
const BANDS = [
  { bg: "#b3264f", ink: "#ffffff", soft: "#ffd9e3" },
  { bg: "#ffc15a", ink: "#2a1d05", soft: "#5a3e0a" },
  { bg: "#1d2a4d", ink: "#ffffff", soft: "#b9c6ea" },
  { bg: "#1f6b4f", ink: "#ffffff", soft: "#c6ecd9" },
];
const FACES = ["Fern", "Otto", "Pip", "Juno"];

/** C: colour blocks. A huge headline, then bold bands with the app on them. */
export default function Blocks() {
  return (
    <div className="overflow-x-clip bg-[#fbfaf7] text-ink">
      <header className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/stilbe-mark.png" alt="" width={30} height={30} priority />
          <span className="font-wide text-[20px] font-light">Stilbe</span>
        </Link>
        <nav className="flex items-center gap-1 text-[14px] text-slate">
          <a href="#how" className="rounded-full px-3.5 py-2.5 hover:text-ink">How it works</a>
          <a href="#pricing" className="rounded-full px-3.5 py-2.5 hover:text-ink">Pricing</a>
          <a href={DOWNLOAD} className="ml-1.5 rounded-full bg-ink px-4.5 py-2.5 font-medium text-white hover:opacity-90">Download for Mac</a>
        </nav>
      </header>

      <section className="mx-auto max-w-[1240px] px-6 pt-10">
        <h1 className="font-wide text-[clamp(56px,9vw,132px)] leading-[0.92] font-light tracking-[-0.04em] motion-safe:animate-arrive">
          The AI&#8209;native
          <br />
          browser
        </h1>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-[30em] motion-safe:animate-arrive motion-safe:[animation-delay:0.2s]">
            <p className="text-[clamp(20px,2vw,25px)] leading-snug font-light text-balance">{copy.line}</p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-pretty text-slate">{copy.lede}</p>
          </div>
          <div className="flex flex-col items-start gap-2.5 sm:items-end motion-safe:animate-arrive motion-safe:[animation-delay:0.35s]">
            <a href={DOWNLOAD} className="inline-flex min-h-[54px] items-center rounded-full bg-ink px-7.5 text-[16px] font-medium text-white hover:opacity-90">
              Download for Mac
            </a>
            <span className="text-[13px] text-[#626a76]">Free. {REQUIREMENT}.</span>
          </div>
        </div>
      </section>

      {/* The teal band, the window rising out of it, bubbles drifting. */}
      <section aria-label="Stilbe at work" className="mx-auto mt-12 max-w-[1240px] px-6">
        <div className="relative overflow-hidden rounded-[32px] bg-[#0f5c63] px-[clamp(20px,5vw,64px)] pt-[clamp(20px,5vw,64px)]">
          <div aria-hidden="true" className="absolute -top-28 -right-20 size-[420px] rounded-full bg-[#35bfea]/35 motion-safe:animate-drift" />
          <div aria-hidden="true" className="absolute bottom-10 -left-16 size-56 rounded-full bg-[#ffc15a]/50 motion-safe:animate-drift-slow" />
          <div aria-hidden="true" className="absolute top-24 left-[38%] size-16 rounded-full bg-[#ffd9e3]/40 motion-safe:animate-drift" />
          <div className="relative -mb-3">
            <AgentAtWork />
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto grid max-w-[1240px] scroll-mt-6 gap-6 px-6 pt-6 md:grid-cols-2">
        {copy.features.map((f, i) => (
          <div
            key={f.title}
            className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-[32px] p-[clamp(28px,3vw,40px)] transition-transform duration-300 hover:-translate-y-1"
            style={{ background: BANDS[i].bg, color: BANDS[i].ink }}
          >
            <AgentFace
              name={FACES[i]}
              size={84}
              mood="happy"
              className="absolute top-8 right-8 opacity-90 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
            />
            <div className="font-wide text-[clamp(48px,6vw,72px)] leading-none font-light tracking-[-0.03em]">{f.word}</div>
            <h3 className="mt-auto text-[22px] font-medium">{f.title}</h3>
            <p className="mt-2 max-w-[30em] text-[15px] leading-relaxed" style={{ color: BANDS[i].soft }}>
              {f.line}
            </p>
          </div>
        ))}
      </section>

      <section id="pricing" className="mx-auto grid max-w-[1240px] scroll-mt-6 items-end gap-6 px-6 pt-24 pb-24 lg:grid-cols-[1.1fr_1fr_1fr]">
        <div>
          <h2 className="font-wide text-[clamp(44px,5vw,64px)] leading-none font-light tracking-[-0.03em]">Pricing</h2>
          <p className="mt-4 max-w-[22em] text-[16px] leading-relaxed text-slate">{copy.pricingLine}</p>
        </div>
        <div className="rounded-[28px] bg-white p-8 shadow-[0_0_0_1.5px_#14171c]">
          <div className="text-[18px] font-medium">Free</div>
          <div className="font-wide mt-3 text-[52px] font-light">$0</div>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-slate">{copy.free}</p>
        </div>
        <div className="rounded-[28px] bg-[#ffc15a] p-8">
          <div className="text-[18px] font-medium">Pro</div>
          <div className="mt-3">
            <span className="font-wide text-[52px] font-light">{business.pro.price}</span>
            <span className="text-[14px]"> a {business.pro.period}</span>
          </div>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#4a3610]">{copy.pro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[32px] bg-ink px-[clamp(28px,4vw,56px)] py-12 text-white">
          <p className="font-wide text-[clamp(28px,3.4vw,44px)] leading-tight font-light tracking-[-0.02em]">{copy.closing}</p>
          <a href={DOWNLOAD} className="inline-flex min-h-[54px] items-center rounded-full bg-white px-7.5 text-[16px] font-medium text-ink hover:opacity-90">
            Download for Mac
          </a>
        </div>
      </section>
      <SiteFooter className="px-6 pb-12" />
    </div>
  );
}
