import type { Metadata } from "next";
import Image from "next/image";
import { AgentFace } from "@/components/agent-face";
import { FeatureCarousel } from "@/components/home-carousels";
import { HeroStage } from "@/components/hero-stage";
import { AskField, ErrandLoop, FlyingSites, GlintSphere, SiteNav } from "@/components/home-v3";
import { Odometer, Reveal } from "@/components/motion";
import { SiteFooter } from "@/components/site-footer";
import { business } from "@/lib/business";
import { copy } from "@/lib/copy";
import { DOWNLOAD, REQUIREMENT } from "@/lib/download";

export const metadata: Metadata = { title: "Stilbe · Home, closer to Squarespace", robots: { index: false, follow: false } };

const H2 = "font-wide text-[clamp(36px,4.2vw,60px)] leading-[1.05] font-light tracking-[-0.025em]";
const LEDE = "text-[clamp(16px,1.4vw,19px)] leading-relaxed";

/** A big light card, as Squarespace's AI section's: a real picture of the app, a line, a link. */
function StartCard({ title, line, link, src, alt }: { title: string; line: string; link: string; src: string; alt: string }) {
  return (
    <a href={DOWNLOAD} className="group flex flex-col overflow-hidden bg-[#0b1018] text-white">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-col gap-2 p-8">
        <h3 className="text-[24px] font-normal">{title}</h3>
        <p className="max-w-[30em] text-[15px] leading-relaxed text-[#aab3c2]">{line}</p>
        <span className="mt-3 text-[16px] font-medium">
          {link} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </a>
  );
}

/**
 * The home page, built on Squarespace's: a hero that holds while its sites
 * rise, numbers that roll, the errands and the browser as carousels, getting
 * started, a field to hand it something, the agents, the sites it works on
 * flying past, safety and price, and the way out over a turning sphere.
 */
export default function HomeV3() {
  return (
    <div className="overflow-x-clip bg-white text-ink">
      <SiteNav />

      <HeroStage>
        <h1 className="font-wide text-[clamp(52px,7.4vw,108px)] leading-[0.98] font-light tracking-[-0.035em] motion-safe:animate-arrive">
          The AI&#8209;native
          <br />
          browser
        </h1>
        <div className="mt-10 flex justify-center motion-safe:animate-arrive motion-safe:[animation-delay:0.15s]">
          <a href={DOWNLOAD} className="inline-flex h-[60px] items-center bg-white px-10 text-[17px] font-medium text-[#0b1018] shadow-[0_12px_40px_-10px_rgb(53_191_234/0.7)] hover:opacity-90">
            Download for Mac
          </a>
        </div>
        <p className="mt-6 text-[clamp(16px,1.5vw,20px)] font-light text-[#dbe3ee] motion-safe:animate-arrive motion-safe:[animation-delay:0.3s]">{copy.line}</p>
      </HeroStage>

      {/* Numbers that roll in, as Squarespace's; ours are what's true of it. */}
      <section className="bg-[#0b1018] px-6 pt-10 pb-28 text-center text-white" data-tone="dark">
        <Reveal>
          <p className="text-[15px] text-[#aab3c2]">What it costs you, and what it never sees.</p>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-[1100px] gap-12 sm:grid-cols-3">
          {[
            { value: "0", prefix: "$", label: "To download and use, with no account" },
            { value: "4", suffix: "×", label: "More of the agent's AI each month, with Pro" },
            { value: "0", label: "Passwords or card numbers the agent ever sees" },
          ].map((s, k) => (
            <Reveal key={s.label} delay={k * 120}>
              <Odometer value={s.value} prefix={s.prefix} suffix={s.suffix} className="font-wide text-[clamp(64px,8vw,112px)] font-light tracking-[-0.03em]" />
              <p className="mt-3 text-[15px] text-[#c8d0dc]">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="errands" className="scroll-mt-20 pt-28 pb-28" data-tone="light">
        <Reveal className="px-6 text-center">
          <h2 className={H2}>Hand it the errand</h2>
          <p className={`mt-3.5 text-slate ${LEDE}`}>You ask. It does the clicking, on the sites you already use.</p>
        </Reveal>
        <Reveal delay={150} className="mt-10">
          <ErrandLoop />
        </Reveal>
      </section>

      <section id="browser" className="scroll-mt-20 px-6 pt-10 pb-28 md:px-10" data-tone="light">
        <Reveal className="grid gap-6 md:grid-cols-2 md:gap-16">
          <h2 className={H2}>Everything you need, in one browser</h2>
          <p className={`max-w-[30em] text-slate md:mt-2 ${LEDE}`}>The browser you&rsquo;d choose even if you never asked it anything, with an agent in every tab when you do.</p>
        </Reveal>
        <Reveal delay={150} className="mt-16">
          <FeatureCarousel />
        </Reveal>
      </section>

      {/* Getting started, as Squarespace's AI section: a soft light behind two big cards. */}
      <section id="start" className="relative scroll-mt-20 overflow-clip bg-[#e7eaee] px-6 py-32 md:px-10" data-tone="light">
        <div aria-hidden="true" className="absolute top-0 left-1/2 size-[1200px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.95),transparent)]" />
        <div aria-hidden="true" className="absolute right-[-10%] bottom-[-20%] size-[700px] rounded-full bg-[radial-gradient(closest-side,rgb(138_99_255/0.18),transparent)] motion-safe:animate-drift" />
        <Reveal className="relative text-center">
          <h2 className={H2}>
            Getting started
            <br />
            takes a minute
          </h2>
          <p className={`mt-4 text-slate ${LEDE}`}>No setup, and nothing to learn first.</p>
        </Reveal>
        <div className="relative mx-auto mt-14 grid max-w-[1200px] gap-6 lg:grid-cols-2">
          <Reveal>
            <StartCard
              title="A short tour"
              line="It brings your things over, signs you in, makes your first agent, and lets you watch it answer an invitation on a practice page."
              link="Download and take the tour"
              src="/app/tour-5-invitation.png"
              alt="Stilbe's tour: its practice page, the agent filling in an RSVP"
            />
          </Reveal>
          <Reveal delay={150}>
            <StartCard
              title="Moving in from Chrome"
              line="Bookmarks, history and passwords come over in one go, and you can make Stilbe your default browser from the same page."
              link="Download for Mac"
              src="/app/tour-1-welcome.png"
              alt="Stilbe's welcome: import from Chrome, and make it the default"
            />
          </Reveal>
        </div>
        <p className="relative mt-12 text-center text-[13px] text-slate">Pictures from Stilbe itself.</p>
      </section>

      {/* Where Squarespace asks for your domain. */}
      <section className="bg-[#0b1018] px-6 py-28 text-white" data-tone="dark">
        <Reveal className="text-center">
          <h2 className={H2}>What would you hand it?</h2>
        </Reveal>
        <Reveal delay={150} className="mt-10">
          <AskField />
        </Reveal>
      </section>

      {/* Its people, as Squarespace's faces: the agents themselves. */}
      <section className="bg-[#0b1018] px-6 pt-6 pb-16 text-center text-white" data-tone="dark">
        <Reveal>
          <div className="flex justify-center -space-x-3">
            {["Fern", "Otto", "Pip", "Juno", "Wren"].map((name, k) => (
              <span key={name} className="rounded-full bg-[#0b1018] p-1" style={{ zIndex: 5 - k }}>
                <AgentFace name={name} size={52} mood={k % 2 ? "happy" : "idle"} />
              </span>
            ))}
          </div>
          <p className="font-wide mt-8 text-[clamp(30px,3.4vw,48px)] leading-tight font-light tracking-[-0.02em]">
            Agents of your own,
            <br />
            on the sites you use
          </p>
        </Reveal>
      </section>

      <FlyingSites />

      <section id="trust" className="relative scroll-mt-20 overflow-clip bg-[#0b1018] px-6 py-32 text-white md:px-10" data-tone="dark">
        <div aria-hidden="true" className="absolute -top-52 -right-52 size-[800px] rounded-full bg-[radial-gradient(closest-side,rgb(53_191_234/0.35),transparent)]" />
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-16 lg:grid-cols-[1fr_440px]">
          <Reveal>
            <h2 className={H2}>It asks first</h2>
            <p className={`mt-5 max-w-[30em] text-[#c8d0dc] ${LEDE}`}>Before it sends, buys or signs, it pauses for you. It never sees your saved passwords or card numbers, and you can watch, take over or stop it at any point.</p>
          </Reveal>
          <Reveal delay={150}>
            <Image src="/app/tour-5-asking-card.png" alt="The agent's card asking before it sends an RSVP" width={1433} height={1600} className="w-full rounded-[22px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6),0_0_80px_rgb(53_191_234/0.25)]" />
          </Reveal>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 bg-[#f3f5f7] px-6 py-28 md:px-10" data-tone="light">
        <div className="mx-auto grid max-w-[1280px] items-end gap-5 lg:grid-cols-3">
          <Reveal>
            <h2 className={H2}>Pricing</h2>
            <p className="mt-3.5 max-w-[22em] text-[17px] leading-relaxed text-slate">{copy.pricingLine}</p>
          </Reveal>
          <Reveal delay={100} className="bg-white p-8 shadow-[0_0_0_1px_#e1e5ea]">
            <div className="text-[18px] font-medium">Free</div>
            <div className="font-wide mt-3 text-[52px] font-light">$0</div>
            <p className="mt-2.5 text-[15px] leading-relaxed text-slate">{copy.free}</p>
          </Reveal>
          <Reveal delay={200} className="bg-[radial-gradient(120%_100%_at_100%_0%,rgb(138_99_255/0.55),transparent_60%),radial-gradient(120%_100%_at_0%_100%,rgb(53_191_234/0.45),transparent_60%),#0b1018] p-8 text-white">
            <div className="text-[18px] font-medium">Pro</div>
            <div className="mt-3">
              <span className="font-wide text-[52px] font-light">{business.pro.price}</span>
              <span className="text-[14px] text-[#aab3c2]"> a {business.pro.period}</span>
            </div>
            <p className="mt-2.5 text-[15px] leading-relaxed text-[#c8d0dc]">{copy.pro}</p>
          </Reveal>
        </div>
      </section>

      {/* Help, as Squarespace's, then the way out over a turning sphere. */}
      <section className="bg-[#0b1018] px-6 pt-20 text-white" data-tone="dark">
        <div className="mx-auto grid max-w-[1100px] gap-px border-y border-white/10 sm:grid-cols-3">
          {[
            ["How the agent works", "What it can do, and when it asks"],
            ["Questions people ask", "Privacy, the AI it uses, and the plans"],
            ["Write to us", business.email],
          ].map(([title, line]) => (
            <a key={title} href={title === "Write to us" ? `mailto:${business.email}` : "/pricing"} className="group flex items-center justify-between gap-4 px-2 py-7">
              <span>
                <span className="block text-[18px]">{title}</span>
                <span className="block text-[14px] text-[#8e99ab]">{line}</span>
              </span>
              <span className="text-[20px] transition-transform group-hover:translate-x-1">→</span>
            </a>
          ))}
        </div>
      </section>
      <section className="relative overflow-clip bg-[#0b1018] px-6 py-40 text-center text-white" data-tone="dark">
        <GlintSphere className="absolute top-1/2 left-1/2 h-[720px] w-[720px] max-w-[110vw] -translate-x-1/2 -translate-y-1/2" />
        <Reveal className="relative">
          <p className="font-wide text-[clamp(36px,4.4vw,60px)] leading-tight font-light tracking-[-0.02em]">{copy.closing}</p>
          <p className="mt-4 text-[16px] text-[#aab3c2]">Free, and no account needed. {REQUIREMENT}.</p>
          <div className="mt-9 flex justify-center">
            <a href={DOWNLOAD} className="inline-flex h-[60px] items-center bg-white px-10 text-[17px] font-medium text-[#0b1018] hover:opacity-90">
              Download for Mac
            </a>
          </div>
        </Reveal>
      </section>
      <SiteFooter className="bg-[#0b1018] px-6 pt-2 pb-12 !text-[#6f7a8c]" />
    </div>
  );
}
