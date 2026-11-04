import Image from "next/image";
import Link from "next/link";
import { AgentAtWork } from "@/components/agent-at-work";
import { AgentFace } from "@/components/agent-face";
import { GlintMark } from "@/components/glint-mark";
import { SiteFooter } from "@/components/site-footer";
import { business } from "@/lib/business";
import { DOWNLOAD, REQUIREMENT } from "@/lib/download";

function DownloadButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={DOWNLOAD}
      className={`inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ink px-6 text-[15.5px] font-medium text-paper transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glint ${className}`}
      data-download
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
      </svg>
      Download for Mac
    </a>
  );
}

/** One thing the agent does: a small picture of it, then a line or two. */
function Feature({ title, children, picture }: { title: string; children: React.ReactNode; picture: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div aria-hidden="true" className="flex h-[200px] rounded-2xl bg-paper p-5">
        {picture}
      </div>
      <h3 className="text-[19px] font-medium">{title}</h3>
      <p className="max-w-[32em] text-[15.5px] leading-relaxed text-slate">{children}</p>
    </div>
  );
}

/** A small card, as the agent's own are drawn in the pictures. */
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col gap-2 rounded-[14px] bg-white p-3 shadow-[0_0_0_1px_rgb(0_0_0/0.08)] ${className}`}>{children}</div>
);

const BROWSER = [
  ["Bring everything over.", "Bookmarks, history and passwords from Chrome or Safari."],
  ["Ads and trackers blocked.", "On every site, from the first page."],
  ["Passwords and cards, with Touch ID.", "Filled in for you, and kept on your Mac."],
  ["Your Chrome extensions.", "The ones you already use."],
  ["Split view and reader mode.", "Two pages side by side, or one without the clutter."],
  ["Profiles.", "School and personal kept apart."],
];

/**
 * stilbe.app: what Stilbe is, the agent shown at work, what it does, the
 * browser around it, the two plans, and the download throughout.
 */
export default function Home() {
  return (
    // Clipped across only: the light behind the mark is wider than a phone,
    // and mustn't widen the page; its top still shows over the header.
    <div className="overflow-x-clip">
      <header className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Stilbe home">
          <Image src="/stilbe-mark.png" alt="" width={30} height={30} priority />
          <span className="font-wide text-[20px] font-light tracking-[-0.01em]">Stilbe</span>
        </Link>
        <nav aria-label="Site" className="flex flex-wrap items-center gap-1 text-[14px] text-slate">
          <a href="#how" className="rounded-full px-3.5 py-2.5 hover:bg-ink/5 hover:text-ink">
            How it works
          </a>
          <a href="#pricing" className="rounded-full px-3.5 py-2.5 hover:bg-ink/5 hover:text-ink">
            Pricing
          </a>
          <a href={DOWNLOAD} className="ml-1.5 rounded-full bg-ink px-4.5 py-2.5 font-medium text-paper hover:opacity-90">
            Download for Mac
          </a>
        </nav>
      </header>

      <main>
        {/* What it is, under the mark and its soft light. */}
        <section className="relative mx-auto flex max-w-[1180px] flex-col items-center px-6 pt-12 pb-10 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-36 left-1/2 -z-10 aspect-square w-[min(900px,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.95),transparent_72%)]"
          />
          <GlintMark className="w-[clamp(96px,16vmin,128px)]" />
          <h1 className="font-wide mt-8 max-w-[14ch] text-[clamp(40px,6vw,72px)] leading-[1.02] font-light tracking-[-0.025em] motion-safe:animate-arrive motion-safe:[animation-delay:0.9s]">
            A browser with an agent in it
          </h1>
          <p className="mt-6 max-w-[34em] text-[18px] leading-relaxed text-slate motion-safe:animate-arrive motion-safe:[animation-delay:1.1s]">
            Browse the way you always have. When there&rsquo;s something to do, ask. It works in tabs of its own while you carry on, and asks
            before anything it can&rsquo;t undo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5 motion-safe:animate-arrive motion-safe:[animation-delay:1.3s]">
            <DownloadButton />
            <a href="#pricing" className="inline-flex min-h-12 items-center rounded-full px-5.5 text-[15.5px] shadow-[inset_0_0_0_1px_#c3c9d0] hover:bg-ink/5">
              See pricing
            </a>
          </div>
          <p className="mt-4 text-[13px] text-steel">Free. {REQUIREMENT}.</p>
        </section>

        <section aria-label="Stilbe at work" className="mx-auto max-w-[1180px] px-6 pt-2 pb-24">
          <AgentAtWork />
        </section>

        {/* What the agent does. */}
        <section id="how" className="scroll-mt-6 bg-white">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-16 px-6 py-24">
            <h2 className="font-wide max-w-[18ch] text-[clamp(30px,3.6vw,44px)] leading-[1.1] font-light tracking-[-0.02em]">
              Ask about a page, or hand it the whole errand
            </h2>
            <div className="grid gap-x-14 gap-y-14 md:grid-cols-2">
              <Feature
                title="It reads the page you're on"
                picture={
                  <Card className="mt-auto ml-auto w-[240px]">
                    <div className="self-end rounded-[10px] bg-[#f3f5f7] px-2.5 py-1.5 text-[12px]">What&rsquo;s the notice period?</div>
                    <div className="text-[12px] leading-snug">Two months, from either side, after the first six months (clause 4.2).</div>
                  </Card>
                }
              >
                A lease, a long thread, three laptops side by side. Ask what you&rsquo;d ask a friend looking over your shoulder, and it answers
                from what&rsquo;s in front of you.
              </Feature>
              <Feature
                title="It works in tabs of its own"
                picture={
                  <div className="flex w-full flex-col justify-center gap-2.5">
                    {[
                      ["Fern", "Flat hunt", 2],
                      ["Otto", "Gift for Sam", 1],
                    ].map(([name, task, tabs]) => (
                      <div key={name as string} className="flex items-center gap-1.5">
                        <span className="flex h-[26px] items-center gap-1.5 rounded-full bg-glint/15 pr-2.5 pl-1 text-[12px] font-medium text-[#0d6d93]">
                          <AgentFace name={name as string} size={18} mood="thinking" />
                          {task}
                        </span>
                        {Array.from({ length: tabs as number }, (_, i) => (
                          <span key={i} className="h-[26px] flex-1 rounded-lg bg-[#f3f5f7]" />
                        ))}
                      </div>
                    ))}
                  </div>
                }
              >
                It clicks, types and opens what it needs while you keep browsing. Several can work at once, each with its tabs gathered in a group
                under its face.
              </Feature>
              <Feature
                title="It asks before it can't take it back"
                picture={
                  <Card className="m-auto w-[260px] gap-2.5 p-3.5">
                    <div className="text-[13px] font-medium">Send the RSVP to Maya?</div>
                    <div className="text-[12px] text-slate">Two of you, Saturday at 7, no allergies.</div>
                    <div className="flex gap-1.5 text-[12px]">
                      <span className="flex-1 rounded-full bg-ink py-1.5 text-center text-paper">Allow</span>
                      <span className="flex-1 rounded-full py-1.5 text-center shadow-[inset_0_0_0_1px_#c3c9d0]">Don&rsquo;t</span>
                    </div>
                  </Card>
                }
              >
                Sending, buying, signing: it stops and asks. In auto mode it goes ahead on its own, and still asks before paying or using your
                saved details, which it never sees.
              </Feature>
              <Feature
                title="Agents of your own"
                picture={
                  <div className="flex w-full items-end justify-around px-4 pb-4">
                    {["Fern", "Otto", "Pip"].map((name, i) => (
                      <div key={name} className={`flex flex-col items-center gap-1.5 ${i === 1 ? "-translate-y-5" : ""}`}>
                        <AgentFace name={name} size={52} mood={i === 1 ? "happy" : "idle"} />
                        <span className="text-[11.5px] text-slate">{name}</span>
                      </div>
                    ))}
                  </div>
                }
              >
                Give one a name and a way of working, and its face comes from the name. It remembers what you tell it to, keeps its chats, and can
                run a task every morning, or when a page changes.
              </Feature>
            </div>
          </div>
        </section>

        {/* And the browser around it. */}
        <section className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="flex flex-wrap items-start gap-x-16 gap-y-10">
            <div className="flex flex-[1_1_380px] flex-col gap-4">
              <h2 className="font-wide text-[clamp(28px,3vw,38px)] leading-[1.12] font-light tracking-[-0.02em]">
                And a whole browser, if you never ask it anything
              </h2>
              <p className="text-[14px] leading-relaxed text-slate">
                Pages you just browse aren&rsquo;t sent anywhere. When you ask the agent about a page or give it a task, that page&rsquo;s text
                goes to the AI model to work it out.
              </p>
            </div>
            <ul className="grid flex-[1.6_1_480px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-10">
              {BROWSER.map(([title, line]) => (
                <li key={title} className="border-t border-[#c3c9d0] py-4 text-[15px] leading-normal">
                  <strong className="font-medium">{title}</strong> <span className="text-slate">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The two plans. */}
        <section id="pricing" className="scroll-mt-6 bg-white">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-10 px-6 py-24">
            <div className="flex max-w-[40em] flex-col gap-3">
              <h2 className="font-wide text-[clamp(30px,3.6vw,44px)] leading-[1.1] font-light tracking-[-0.02em]">Pricing</h2>
              <p className="text-[16px] leading-relaxed text-slate">Every feature is in the free plan. Pro only buys more of the agent&rsquo;s AI each month.</p>
            </div>
            <div className="flex flex-wrap gap-5">
              <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4 rounded-[20px] bg-[#f3f5f7] p-7 shadow-[inset_0_0_0_1px_#d9dee4]">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[20px] font-medium">Free</h3>
                  <span className="text-[13px] text-slate">No account needed</span>
                </div>
                <div className="font-wide text-[44px] font-light tracking-[-0.02em]">$0</div>
                <p className="text-[15px] leading-relaxed text-slate">The whole browser and the agent, with a monthly AI allowance for everyday use.</p>
                <DownloadButton className="mt-auto justify-center" />
              </div>
              <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4 rounded-[20px] bg-ink p-7 text-paper">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[20px] font-medium">Pro</h3>
                  <span className="text-[13px] text-paper/70">For daily use</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-wide text-[44px] font-light tracking-[-0.02em]">{business.pro.price}</span>
                  <span className="text-[14px] text-paper/70">a {business.pro.period}</span>
                </div>
                <p className="text-[15px] leading-relaxed text-paper/85">
                  The same browser and agent, with four times the free monthly AI allowance, on all your Macs. Cancel any time.
                </p>
                <a
                  href={DOWNLOAD}
                  className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full bg-paper text-[15.5px] font-medium text-ink hover:opacity-90"
                >
                  Download, then upgrade in Settings
                </a>
              </div>
            </div>
            <p className="text-[13.5px] text-slate">
              Plus tax where it applies. Payments are handled by Stripe. How the allowance works, and the rest, is on the{" "}
              <Link href="/pricing" className="underline decoration-glint underline-offset-[3px]">
                pricing page
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="mx-auto flex max-w-[1180px] flex-col items-center gap-6 px-6 pt-20 pb-10 text-center">
          <Image src="/stilbe-mark.png" alt="" width={56} height={56} />
          <p className="font-wide text-[24px] font-light tracking-[-0.015em]">Try it for a week instead of Chrome.</p>
          <DownloadButton />
          <p className="text-[13px] text-steel">{REQUIREMENT}.</p>
        </section>
      </main>
      <SiteFooter className="px-6 pt-8 pb-12" />
    </div>
  );
}
