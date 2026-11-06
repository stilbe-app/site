import Image from "next/image";
import Link from "next/link";
import { AgentFace } from "@/components/agent-face";
import { LogoTile, type LogoId } from "@/components/brand-logo";
import { ErrandPanel } from "@/components/errand-panel";
import { GlintMark } from "@/components/glint-mark";
import { Reveal } from "@/components/motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteScene } from "@/components/site-scene";
import { business } from "@/lib/business";
import { copy } from "@/lib/copy";
import { DOWNLOAD, REQUIREMENT } from "@/lib/download";

/** Pro's card: the mercury's violet and cyan lighting the night. A whole
 *  `background`, as a gradient list ending in a colour isn't a Tailwind class. */
const PRO = "radial-gradient(120% 100% at 100% 0%, rgb(138 99 255 / 0.55), transparent 60%), radial-gradient(120% 100% at 0% 100%, rgb(53 191 234 / 0.45), transparent 60%), #0b1018";

const H2 = "font-wide text-[clamp(32px,3.6vw,46px)] leading-[1.1] font-light tracking-[-0.02em]";

const CARDS: { word: string; title: string; line: string; glow: string; ground: string; logos?: LogoId[]; faces?: string[] }[] = [
  { word: "Ask", title: "Reads the page in front of you", line: "An article, a doc, a long thread: the answer comes from the page itself.", glow: "#5b47b8", ground: "#15122a", logos: ["wikipedia", "docs", "gmail"] },
  { word: "Hand it over", title: "Works in tabs of its own", line: "Mail, calendars, listings, coursework: it clicks, types and opens what it needs while you browse.", glow: "#1e6f8a", ground: "#0d1a24", logos: ["gmail", "outlook", "zillow", "canvas"] },
  { word: "Still a browser", title: "Fast, private, complete", line: "Ads blocked, passwords with Touch ID, and the Chrome extensions you already use.", glow: "#8a4a2e", ground: "#1d1410", logos: ["ublock", "bitwarden", "chrome"] },
  { word: "Yours", title: "Agents of your own", line: "Give one a name and a way of working, and its face follows from the name.", glow: "#1f6b4f", ground: "#0c1914", faces: ["Fern", "Otto", "Pip", "Juno", "Wren"] },
];

/** A rounded button: white on the night, graphite on the day. */
function Download({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <a
      href={DOWNLOAD}
      className={`inline-flex h-[50px] items-center gap-2.5 rounded-full px-6.5 text-[15.5px] font-medium transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glint ${
        tone === "light" ? "bg-gradient-to-b from-white to-[#dfe6ef] text-[#0b1018] shadow-[0_10px_40px_-8px_rgb(53_191_234/0.6)]" : "bg-ink text-white"
      } ${className}`}
      data-download
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
      </svg>
      Download for Mac
    </a>
  );
}

/**
 * stilbe.app, "Night into day": the night's drifting light at the top with
 * the agent at work on three real sites fanned over its edge; then day,
 * where the errands play on the sites themselves, the four cards carry the
 * mercury and the logos of what it works with, safety is a bold band, and
 * the price is plain.
 */
export default function Home() {
  return (
    <div className="overflow-x-clip bg-white text-ink">
      {/* Night */}
      <section className="relative bg-[#0b1018] text-[#e8ecf2]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-72 left-1/2 h-[1100px] w-[1500px] -translate-x-1/2">
            <div className="absolute inset-0 bg-[radial-gradient(38%_42%_at_42%_40%,rgb(53_191_234/0.42),transparent_70%)] motion-safe:animate-drift" />
            <div className="absolute inset-0 bg-[radial-gradient(34%_38%_at_62%_46%,rgb(138_99_255/0.38),transparent_70%),radial-gradient(30%_30%_at_50%_72%,rgb(255_140_190/0.16),transparent_70%)] motion-safe:animate-drift-slow" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(60%_45%_at_50%_25%,#000,transparent)]" />
        </div>

        <header className="relative mx-auto flex max-w-[1180px] items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Stilbe home">
            <Image src="/stilbe-mark.png" alt="" width={30} height={30} priority />
            <span className="font-wide text-[20px] font-light">Stilbe</span>
          </Link>
          <nav aria-label="Site" className="flex items-center gap-1 text-[14px]">
            <a href="#errands" className="hidden rounded-full px-3.5 py-2.5 text-[#aab3c2] hover:text-white sm:block">What it does</a>
            <a href="#pricing" className="hidden rounded-full px-3.5 py-2.5 text-[#aab3c2] hover:text-white sm:block">Pricing</a>
            <a href={DOWNLOAD} className="ml-1.5 rounded-full bg-white px-4.5 py-2.5 font-medium text-[#0b1018] hover:opacity-90">Download for Mac</a>
          </nav>
        </header>

        <div className="relative px-6 pt-[clamp(40px,6vw,70px)] text-center">
          <GlintMark className="mx-auto w-[clamp(84px,9vw,104px)]" />
          <h1 className="font-wide mt-7 bg-gradient-to-b from-white from-30% to-[#9fb0c8] bg-clip-text text-[clamp(44px,6.2vw,88px)] leading-none font-light tracking-[-0.03em] text-transparent motion-safe:animate-arrive motion-safe:[animation-delay:0.8s]">
            {copy.headline}
          </h1>
          <p className="mt-5 text-[clamp(18px,1.8vw,22px)] font-light text-balance text-[#dbe3ee] motion-safe:animate-arrive motion-safe:[animation-delay:1s]">{copy.line}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5 motion-safe:animate-arrive motion-safe:[animation-delay:1.15s]">
            <Download />
            <a href="#pricing" className="inline-flex h-[50px] items-center rounded-full px-5.5 text-[15.5px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.22)] hover:bg-white/5">
              See pricing
            </a>
          </div>
          <p className="mt-3.5 text-[13px] text-[#6f7a8c]">Free. {REQUIREMENT}.</p>
        </div>

        {/* The agent at work on three real sites, fanned over the night's edge. */}
        <div className="relative mx-auto mt-[clamp(40px,5vw,64px)] h-[clamp(200px,30vw,420px)] max-w-[1440px]">
          <div className="absolute -bottom-[16%] left-[3%] hidden w-[38%] motion-safe:animate-float md:block" style={{ animationDelay: "0.8s" }}>
            <div className="-rotate-[5deg]">
              <SiteScene site="zillow" playing={false} className="shadow-[0_40px_80px_-20px_rgb(0_0_0/0.6)]" />
            </div>
          </div>
          <div className="absolute right-[3%] -bottom-[16%] hidden w-[38%] motion-safe:animate-float md:block" style={{ animationDelay: "1.6s" }}>
            <div className="rotate-[5deg]">
              <SiteScene site="outlook" playing={false} className="shadow-[0_40px_80px_-20px_rgb(0_0_0/0.6)]" />
            </div>
          </div>
          <div className="absolute -bottom-[22%] left-1/2 w-[min(92%,726px)] -translate-x-1/2 motion-safe:animate-float">
            <SiteScene site="gmail" className="shadow-[0_50px_100px_-20px_rgb(0_0_0/0.7),0_0_60px_rgb(53_191_234/0.35)]" />
          </div>
        </div>
      </section>

      {/* Day */}
      <section className="px-6 pt-[clamp(140px,14vw,190px)] pb-16 text-center">
        <Reveal>
          <p className="font-wide mx-auto max-w-[20em] text-[clamp(28px,3.4vw,44px)] leading-[1.15] font-light text-balance tracking-[-0.02em]">It works on the sites you already use, signed in as you.</p>
        </Reveal>
      </section>

      <section id="errands" className="mx-auto max-w-[1180px] scroll-mt-6 px-6 pb-24">
        <Reveal>
          <ErrandPanel />
        </Reveal>
      </section>

      {/* The four cards: dark, each with its own light, and what it works with. */}
      <section className="mx-auto max-w-[1180px] px-6 pb-24">
        <h2 className="sr-only">What it does</h2>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, k) => (
            <Reveal key={c.word} delay={k * 90}>
              <article
                className="group relative flex h-full min-h-[340px] flex-col gap-2 overflow-hidden rounded-[22px] p-6.5 text-white"
                style={{ background: `radial-gradient(90% 70% at 80% 10%, ${c.glow}, transparent 70%), ${c.ground}` }}
              >
                {c.logos && (
                  <div className="flex gap-2">
                    {c.logos.map((id) => (
                      <LogoTile key={id} id={id} />
                    ))}
                  </div>
                )}
                {c.faces && (
                  <div className="-ml-1 flex items-end">
                    {c.faces.map((name, n) => (
                      <span key={name} className="-mr-0.5 flex flex-col items-center gap-1 motion-safe:animate-float" style={{ animationDelay: `${n * 0.5}s` }}>
                        <AgentFace name={name} size={[50, 44, 54, 42, 46][n]} mood={n % 2 ? "idle" : "happy"} />
                        <span className="text-[11px] text-white/75">{name}</span>
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-auto flex flex-col gap-2">
                  <span className="self-start rounded-full bg-white/14 px-2.75 py-1 text-[12px] font-medium">{c.word}</span>
                  <h3 className="text-[20px] font-medium">{c.title}</h3>
                  <p className="text-[14px] leading-normal text-white/78">{c.line}</p>
                </div>
                <span aria-hidden="true" className="absolute right-5.5 bottom-5 text-[20px] transition-transform group-hover:translate-x-1">→</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* A bold band: it asks first. */}
      <section className="px-6 pb-24">
        <Reveal className="relative mx-auto grid max-w-[1240px] items-center gap-12 overflow-hidden rounded-[32px] bg-[#1d2a4d] p-[clamp(28px,5vw,64px)] text-white lg:grid-cols-[minmax(0,1fr)_440px]">
          <div aria-hidden="true" className="absolute -top-24 -right-24 size-[220px] rounded-full bg-glint/25 motion-safe:animate-drift sm:-top-30 sm:-right-30 sm:size-[420px]" />
          <div className="relative">
            <h2 className="font-wide text-[clamp(44px,6vw,72px)] leading-none font-light tracking-[-0.03em]">It asks first</h2>
            <p className="mt-4.5 max-w-[28em] text-[18px] leading-relaxed text-[#c6d0ea]">Before it sends, buys or signs, it pauses for you. It never sees your passwords or card numbers, and you can stop it or take over at any point.</p>
          </div>
          <div className="relative rounded-[20px] bg-white p-5 text-ink shadow-[0_30px_60px_-24px_rgb(0_0_0/0.5)]">
            <div className="flex items-center gap-2.5">
              <AgentFace name="Fern" size={32} mood="thinking" />
              <div><div className="text-[14px] font-medium">Fern</div><div className="text-[12px] text-[#0d86b5]">Waiting for you</div></div>
            </div>
            <div className="mt-3.5 rounded-[14px] bg-[#e7f6fc] p-3.5">
              <div className="text-[15px] font-medium">Send the reply to Priya?</div>
              <div className="mt-1 text-[13px] text-slate">&ldquo;Thursday the 14th works for me. Is lunch covered, or should I bring something?&rdquo;</div>
              <div className="mt-3 flex gap-2 text-[13px]">
                <span className="rounded-full bg-ink px-5 py-2 text-white">Allow</span>
                <span className="px-3.5 py-2">Don&rsquo;t</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="pricing" className="mx-auto max-w-[1180px] scroll-mt-6 px-6 pb-28">
        <div className="grid gap-4.5 lg:grid-cols-3">
          <Reveal>
            <h2 className={H2}>Pricing</h2>
            <p className="mt-3 max-w-[24em] text-[16px] leading-relaxed text-slate">{copy.pricingLine}</p>
          </Reveal>
          <Reveal delay={100} className="rounded-[24px] bg-white p-7 shadow-[0_0_0_1px_#e6e3ee]">
            <div className="text-[18px] font-medium">Free</div>
            <div className="font-wide mt-3 text-[44px] font-light">$0</div>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-slate">{copy.free}</p>
            <Download tone="dark" className="mt-6" />
          </Reveal>
          <Reveal delay={200} className="rounded-[24px] p-7 text-white" style={{ background: PRO }}>
            <div className="text-[18px] font-medium">Pro</div>
            <div className="mt-3">
              <span className="font-wide text-[44px] font-light">{business.pro.price}</span>
              <span className="text-[14px] text-[#aab3c2]"> a {business.pro.period}</span>
            </div>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#c8d0dc]">{copy.pro}</p>
            <p className="mt-6 text-[13px] text-[#aab3c2]">Upgrade any time in Stilbe&rsquo;s Settings.</p>
          </Reveal>
        </div>
        <p className="mt-6 text-[13px] text-slate">
          Plus tax where it applies. Payments are handled by Stripe. More on the{" "}
          <Link href="/pricing" className="underline decoration-glint underline-offset-[3px]">pricing page</Link>.
        </p>
      </section>

      <footer className="relative overflow-hidden bg-[#0b1018] px-6 pt-28 pb-12 text-center text-white">
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 h-[600px] w-[900px] -translate-1/2 bg-[radial-gradient(40%_50%_at_40%_50%,rgb(53_191_234/0.35),transparent_70%),radial-gradient(40%_50%_at_60%_50%,rgb(138_99_255/0.3),transparent_70%)] motion-safe:animate-drift" />
        <Image src="/stilbe-mark.png" alt="" width={64} height={64} className="relative mx-auto" />
        <p className="font-wide relative mt-5 text-[clamp(28px,3vw,40px)] font-light">{copy.closing}</p>
        <div className="relative mt-6.5 flex justify-center">
          <Download />
        </div>
        <SiteFooter className="relative mt-20 !text-[#6f7a8c]" />
      </footer>
    </div>
  );
}
