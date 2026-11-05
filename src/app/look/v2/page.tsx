import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AgentFace } from "@/components/agent-face";
import { ErrandShowcase, FeatureCarousel, HeroSites, SiteTunnel } from "@/components/home-carousels";
import { SiteFooter } from "@/components/site-footer";
import { business } from "@/lib/business";
import { copy } from "@/lib/copy";
import { DOWNLOAD, REQUIREMENT } from "@/lib/download";

export const metadata: Metadata = { title: "Stilbe · Home, after Squarespace", robots: { index: false, follow: false } };

/** The mercury's light: an iridescent turn behind dark, as the brand sheet has it. */
function Mercury({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,rgb(53_191_234/0.6),rgb(138_99_255/0.55),rgb(255_122_168/0.4),rgb(255_193_90/0.3),rgb(53_191_234/0.6))] opacity-100 blur-[120px] saturate-150 motion-safe:animate-spin-slow" />
    </div>
  );
}

const DownloadButton = ({ className = "" }: { className?: string }) => (
  <a href={DOWNLOAD} className={`inline-flex h-14 items-center px-8 text-[16px] font-medium transition-opacity hover:opacity-90 ${className}`}>
    Download for Mac
  </a>
);

/** The home page after Squarespace's: a full-bleed hero with the real sites fanned over its foot, the browser's cards, the errands, the sites it works on. */
export default function HomeV2() {
  return (
    <div className="overflow-x-clip bg-white text-ink">
      <header className="relative z-10 flex h-[84px] items-center justify-between bg-[#0b1018] px-[clamp(20px,3vw,40px)] text-white">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/stilbe-mark.png" alt="" width={30} height={30} priority />
          <span className="font-wide text-[21px] font-light">Stilbe</span>
        </Link>
        <nav className="hidden gap-9 text-[15px] font-medium md:flex">
          <a href="#browser" className="hover:text-[#c8d0dc]">Browser</a>
          <a href="#errands" className="hover:text-[#c8d0dc]">Agent</a>
          <a href="#trust" className="hover:text-[#c8d0dc]">Safety</a>
          <a href="#pricing" className="hover:text-[#c8d0dc]">Pricing</a>
        </nav>
        <div className="flex items-center gap-6 text-[15px] font-medium">
          <a href="#signin" className="hidden hover:text-[#c8d0dc] sm:block">Sign in</a>
          <DownloadButton className="h-[52px] bg-white text-[#0b1018]" />
        </div>
      </header>

      {/* Hero: the mercury's light, full bleed, the real sites rising from its foot. */}
      <section className="relative overflow-clip bg-[#0b1018] text-white">
        <Mercury className="top-20 left-1/2 size-[1400px] -translate-x-1/2" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_10%,transparent,rgb(11_16_24/0.45)_75%)]" />
        <div className="relative px-6 pt-[clamp(48px,7vw,90px)] text-center">
          <h1 className="font-wide text-[clamp(52px,7.4vw,108px)] leading-[0.98] font-light tracking-[-0.035em] motion-safe:animate-arrive">
            The AI&#8209;native
            <br />
            browser
          </h1>
          <div className="mt-10 flex justify-center motion-safe:animate-arrive motion-safe:[animation-delay:0.15s]">
            <DownloadButton className="h-[60px] bg-white px-10 text-[17px] text-[#0b1018] shadow-[0_12px_40px_-10px_rgb(53_191_234/0.7)]" />
          </div>
          <p className="mt-6 text-[clamp(16px,1.5vw,20px)] font-light text-[#dbe3ee] motion-safe:animate-arrive motion-safe:[animation-delay:0.3s]">{copy.line}</p>
        </div>
        <div className="relative mt-[clamp(40px,5vw,72px)]">
          <HeroSites />
        </div>
      </section>

      {/* Everything you need, in one browser. */}
      <section id="browser" className="scroll-mt-24 px-6 pt-[clamp(120px,14vw,200px)] pb-28 md:px-10">
        <div className="grid gap-6 md:grid-cols-2 md:gap-16">
          <h2 className="font-wide text-[clamp(36px,4.2vw,60px)] leading-[1.05] font-light tracking-[-0.025em]">Everything you need, in one browser</h2>
          <p className="max-w-[30em] text-[clamp(16px,1.4vw,19px)] leading-relaxed text-slate md:mt-2">The browser you&rsquo;d choose even if you never asked it anything, with an agent in every tab when you do.</p>
        </div>
        <div className="mt-16">
          <FeatureCarousel />
        </div>
      </section>

      {/* Hand it the errand. */}
      <section id="errands" className="scroll-mt-24 pb-32">
        <div className="px-6 text-center">
          <h2 className="font-wide text-[clamp(36px,4.2vw,60px)] font-light tracking-[-0.025em]">Hand it the errand</h2>
          <p className="mt-3.5 text-[clamp(16px,1.4vw,19px)] text-slate">You ask. It does the clicking, on the sites you already use.</p>
        </div>
        <div className="mt-10">
          <ErrandShowcase />
        </div>
      </section>

      <SiteTunnel />

      {/* It asks first. */}
      <section id="trust" className="relative scroll-mt-24 overflow-hidden bg-[#0b1018] px-6 py-32 text-white md:px-10">
        <div aria-hidden="true" className="absolute -top-52 -right-52 size-[800px] rounded-full bg-[radial-gradient(closest-side,rgb(53_191_234/0.35),transparent)]" />
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-16 lg:grid-cols-[1fr_480px]">
          <div>
            <h2 className="font-wide text-[clamp(36px,4.2vw,60px)] leading-[1.05] font-light tracking-[-0.025em]">It asks first</h2>
            <p className="mt-5 max-w-[30em] text-[clamp(16px,1.4vw,19px)] leading-relaxed text-[#c8d0dc]">
              Before it sends, buys or signs, it pauses for you. It never sees your saved passwords or card numbers, and you can watch, take over or stop it at any point.
            </p>
            <dl className="mt-8 flex flex-col gap-3 text-[15px]">
              <div><dt className="inline font-medium">Ask before acting. </dt><dd className="inline text-[#93a0b3]">It does the work, and asks before anything it can&rsquo;t undo.</dd></div>
              <div><dt className="inline font-medium">Auto. </dt><dd className="inline text-[#93a0b3]">It carries on by itself, and still asks before paying or using your details.</dd></div>
              <div><dt className="inline font-medium">Just answer. </dt><dd className="inline text-[#93a0b3]">It reads and explains, and doesn&rsquo;t click or type.</dd></div>
            </dl>
          </div>
          <div className="rounded-[22px] bg-white p-5.5 text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6),0_0_80px_rgb(53_191_234/0.25)]">
            <div className="flex items-center gap-3">
              <AgentFace name="Fern" size={34} mood="thinking" />
              <div><div className="text-[15px] font-medium">Fern</div><div className="text-[12.5px] text-[#0d86b5]">Waiting for you</div></div>
            </div>
            <div className="mt-4 rounded-[14px] bg-[#e7f6fc] p-4">
              <div className="text-[16px] font-medium">Send the reply to Priya?</div>
              <div className="mt-1.5 text-[13.5px] text-slate">&ldquo;Thursday the 14th works for me. Is lunch covered, or should I bring something?&rdquo;</div>
              <div className="mt-3.5 flex gap-2 text-[14px]">
                <span className="rounded-full bg-ink px-5.5 py-2 text-white">Allow</span>
                <span className="px-4 py-2">Don&rsquo;t</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 bg-[#f3f5f7] px-6 py-28 md:px-10">
        <div className="mx-auto grid max-w-[1280px] items-end gap-5 lg:grid-cols-3">
          <div>
            <h2 className="font-wide text-[clamp(36px,4.2vw,60px)] font-light tracking-[-0.025em]">Pricing</h2>
            <p className="mt-3.5 max-w-[22em] text-[17px] leading-relaxed text-slate">{copy.pricingLine}</p>
          </div>
          <div className="bg-white p-8 shadow-[0_0_0_1px_#e1e5ea]">
            <div className="text-[18px] font-medium">Free</div>
            <div className="font-wide mt-3 text-[52px] font-light">$0</div>
            <p className="mt-2.5 text-[15px] leading-relaxed text-slate">{copy.free}</p>
          </div>
          <div className="bg-[radial-gradient(120%_100%_at_100%_0%,rgb(138_99_255/0.55),transparent_60%),radial-gradient(120%_100%_at_0%_100%,rgb(53_191_234/0.45),transparent_60%),#0b1018] p-8 text-white">
            <div className="text-[18px] font-medium">Pro</div>
            <div className="mt-3">
              <span className="font-wide text-[52px] font-light">{business.pro.price}</span>
              <span className="text-[14px] text-[#aab3c2]"> a {business.pro.period}</span>
            </div>
            <p className="mt-2.5 text-[15px] leading-relaxed text-[#c8d0dc]">{copy.pro}</p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0b1018] px-6 py-32 text-center text-white">
        <Mercury className="top-1/2 left-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2" />
        <Image src="/stilbe-mark.png" alt="" width={72} height={72} className="relative mx-auto" />
        <p className="font-wide relative mt-6 text-[clamp(32px,3.8vw,52px)] font-light tracking-[-0.02em]">{copy.closing}</p>
        <div className="relative mt-8 flex justify-center">
          <DownloadButton className="bg-white text-[#0b1018]" />
        </div>
        <p className="relative mt-4 text-[13px] text-[#8e99ab]">{REQUIREMENT}.</p>
      </section>
      <SiteFooter className="bg-[#0b1018] px-6 pt-2 pb-12 !text-[#6f7a8c]" />
    </div>
  );
}
