import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AgentAtWork } from "@/components/agent-at-work";
import { AgentFace } from "@/components/agent-face";
import { GlintMark } from "@/components/glint-mark";
import { SiteFooter } from "@/components/site-footer";
import { business } from "@/lib/business";
import { copy } from "@/lib/copy";
import { DOWNLOAD, REQUIREMENT } from "@/lib/download";

export const metadata: Metadata = { title: "Stilbe · Night", robots: { index: false, follow: false } };

const GLOWS = ["#35bfea", "#8a63ff", "#ff7aa8", "#5be3b4"];
const FACES = ["Fern", "Otto", "Pip", "Juno"];

/** A: mercury in the dark. The top on deep blue-black, its light drifting. */
export default function Night() {
  return (
    <div className="overflow-x-clip bg-[#0b1018] text-[#e8ecf2]">
      <div className="relative">
        {/* Light that drifts, behind everything at the top. */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-64 left-1/2 h-[1100px] w-[1500px] -translate-x-1/2">
          <div className="absolute inset-0 motion-safe:animate-drift bg-[radial-gradient(38%_42%_at_42%_40%,rgb(53_191_234/0.42),transparent_70%)]" />
          <div className="absolute inset-0 motion-safe:animate-drift-slow bg-[radial-gradient(34%_38%_at_62%_46%,rgb(138_99_255/0.38),transparent_70%)]" />
          <div className="absolute inset-0 motion-safe:animate-drift bg-[radial-gradient(30%_30%_at_50%_72%,rgb(255_140_190/0.16),transparent_70%)]" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(60%_45%_at_50%_25%,#000,transparent)]"
        />

        <header className="relative mx-auto flex max-w-[1180px] items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/stilbe-mark.png" alt="" width={30} height={30} priority />
            <span className="font-wide text-[20px] font-light">Stilbe</span>
          </Link>
          <nav className="flex items-center gap-1 text-[14px] text-[#aab3c2]">
            <a href="#how" className="rounded-full px-3.5 py-2.5 hover:text-white">How it works</a>
            <a href="#pricing" className="rounded-full px-3.5 py-2.5 hover:text-white">Pricing</a>
            <a href={DOWNLOAD} className="ml-1.5 rounded-full bg-white px-4.5 py-2.5 font-medium text-[#0b1018] hover:opacity-90">Download for Mac</a>
          </nav>
        </header>

        <section className="relative flex flex-col items-center px-6 pt-14 text-center">
          <div className="relative">
            <div aria-hidden="true" className="absolute -inset-16 rounded-full bg-[radial-gradient(closest-side,rgb(130_220_255/0.45),transparent)] motion-safe:animate-pulse" />
            <GlintMark className="relative w-[clamp(96px,14vmin,132px)]" />
          </div>
          <h1 className="font-wide mt-9 bg-gradient-to-b from-white from-30% to-[#9fb0c8] bg-clip-text text-[clamp(44px,6.4vw,88px)] leading-none font-light tracking-[-0.03em] text-transparent motion-safe:animate-arrive motion-safe:[animation-delay:0.8s]">
            {copy.headline}
          </h1>
          <p className="mt-6 text-[clamp(19px,2vw,23px)] font-light text-balance text-[#dbe3ee] motion-safe:animate-arrive motion-safe:[animation-delay:1s]">{copy.line}</p>
          <p className="mt-4 max-w-[36em] text-[16px] leading-relaxed text-pretty text-[#8e99ab] motion-safe:animate-arrive motion-safe:[animation-delay:1.15s]">{copy.lede}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-2.5 motion-safe:animate-arrive motion-safe:[animation-delay:1.3s]">
            <a
              href={DOWNLOAD}
              className="inline-flex min-h-[50px] items-center rounded-full bg-gradient-to-b from-white to-[#dfe6ef] px-6.5 text-[15.5px] font-medium text-[#0b1018] shadow-[0_0_0_1px_rgb(255_255_255/0.5),0_10px_40px_-8px_rgb(53_191_234/0.6)] hover:opacity-95"
            >
              Download for Mac
            </a>
            <a href="#pricing" className="inline-flex min-h-[50px] items-center rounded-full px-5.5 text-[15.5px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.22)] hover:bg-white/5">
              See pricing
            </a>
          </div>
          <p className="mt-4 text-[13px] text-[#6f7a8c]">Free. {REQUIREMENT}.</p>
        </section>

        <section aria-label="Stilbe at work" className="relative mx-auto max-w-[1100px] px-6 pt-20 pb-28">
          <div aria-hidden="true" className="absolute inset-x-[12%] bottom-12 h-32 rounded-full bg-[radial-gradient(closest-side,rgb(53_191_234/0.55),transparent)] blur-2xl motion-safe:animate-drift" />
          <div className="relative">
            <AgentAtWork tone="dark" />
          </div>
        </section>
      </div>

      <section id="how" className="mx-auto max-w-[1180px] scroll-mt-6 px-6 pb-28">
        <h2 className="font-wide text-[clamp(30px,3.6vw,44px)] leading-tight font-light tracking-[-0.02em]">{copy.featuresTitle}</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.features.map((f, i) => (
            <div key={f.title} className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-[20px] bg-[#121925] p-6 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)]">
              <div aria-hidden="true" className="absolute -top-20 -right-20 size-56 rounded-full opacity-50 blur-3xl transition-opacity duration-500 group-hover:opacity-80 motion-safe:animate-drift" style={{ background: GLOWS[i] }} />
              <AgentFace name={FACES[i]} size={40} mood={i === 3 ? "happy" : "idle"} className="relative" />
              <h3 className="relative mt-auto text-[18px] font-medium">{f.title}</h3>
              <p className="relative mt-2 text-[14px] leading-relaxed text-[#93a0b3]">{f.line}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="scroll-mt-6 bg-[#eef1f5] text-ink">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-12 px-6 py-24">
          <div className="flex-[1_1_300px]">
            <h2 className="font-wide text-[clamp(30px,3.6vw,44px)] font-light tracking-[-0.02em]">Pricing</h2>
            <p className="mt-3 max-w-[26em] text-[16px] leading-relaxed text-slate">{copy.pricingLine}</p>
          </div>
          <div className="flex flex-[1.4_1_480px] flex-wrap gap-4">
            <div className="flex-[1_1_220px] rounded-[20px] bg-white p-7 shadow-[0_0_0_1px_#d9dee4]">
              <div className="text-[18px] font-medium">Free</div>
              <div className="font-wide mt-3 text-[42px] font-light">$0</div>
              <p className="mt-2.5 text-[14px] leading-relaxed text-slate">{copy.free}</p>
            </div>
            <div className="flex-[1_1_220px] rounded-[20px] bg-[radial-gradient(120%_100%_at_100%_0%,rgb(138_99_255/0.55),transparent_60%),radial-gradient(120%_100%_at_0%_100%,rgb(53_191_234/0.45),transparent_60%),#0b1018] p-7 text-white">
              <div className="text-[18px] font-medium">Pro</div>
              <div className="mt-3">
                <span className="font-wide text-[42px] font-light">{business.pro.price}</span>
                <span className="text-[14px] text-[#aab3c2]"> a {business.pro.period}</span>
              </div>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[#c8d0dc]">{copy.pro}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-6 px-6 pt-24 pb-12 text-center">
        <p className="font-wide text-[28px] font-light">{copy.closing}</p>
        <a href={DOWNLOAD} className="inline-flex min-h-[50px] items-center rounded-full bg-white px-6.5 text-[15.5px] font-medium text-[#0b1018] hover:opacity-90">
          Download for Mac
        </a>
      </section>
      <SiteFooter className="px-6 pb-12 !text-[#6f7a8c]" />
    </div>
  );
}
