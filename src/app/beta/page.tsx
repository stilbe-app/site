import type { Metadata } from "next";
import { GlintMark } from "@/components/glint-mark";

export const metadata: Metadata = {
  title: "Stilbe beta",
  description: "Download the Stilbe beta for Mac.",
  // Shared by link with the people trying the beta, not listed anywhere.
  robots: { index: false, follow: false },
};

/** The latest release's disk image, under a name that stays the same from
 *  one release to the next (scripts/release.mjs uploads it as Stilbe.dmg). */
const DOWNLOAD = "https://github.com/stilbe-app/browser-releases/releases/latest/download/Stilbe.dmg";

const EXPECT = [
  {
    title: "Free while it's in beta",
    body: "No account or card needed. Each copy gets a monthly AI allowance, which grows to its full size over the first two weeks.",
  },
  {
    title: "The agent asks first",
    body: "It clicks and types for you, but stops to ask before anything it can't undo, like sending, buying or deleting. Auto mode, if you turn it on, still asks before spending money.",
  },
  {
    title: "What it sends to the AI",
    body: "When you give the agent a task, ask it about a page, or translate one, that page's text goes to the AI model (DeepSeek) to work it out. Pages you just browse aren't sent anywhere.",
  },
  {
    title: "It keeps itself up to date",
    body: "New versions install on their own as the beta goes on.",
  },
];

/** The beta's download page: the mark, one button, and what to expect. */
export default function Beta() {
  return (
    <main className="relative mx-auto flex min-h-svh max-w-xl flex-col items-center px-6 pt-[12svh] pb-20 text-center">
      {/* The same soft light behind the mark as the home page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[30svh] left-1/2 -z-10 aspect-square w-[min(1000px,160vmin)] -translate-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.95),transparent_72%)]"
      />
      <GlintMark className="w-[clamp(120px,22vmin,180px)]" />
      <h1 className="font-wide mt-8 text-[clamp(32px,5vmin,44px)] leading-none font-light tracking-[-0.02em] motion-safe:animate-arrive motion-safe:[animation-delay:1.1s]">
        Stilbe beta
      </h1>
      <p className="mt-4 max-w-sm text-[15px] leading-6 text-steel motion-safe:animate-arrive motion-safe:[animation-delay:1.3s]">
        A browser for Mac with an agent built in. Thanks for trying it early.
      </p>

      <div className="mt-8 flex flex-col items-center gap-2.5 motion-safe:animate-arrive motion-safe:[animation-delay:1.5s]">
        <a
          href={DOWNLOAD}
          className="rounded-full bg-ink px-7 py-3 text-[15px] text-paper transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glint"
          data-beta-download
        >
          Download for Mac
        </a>
        <span className="text-[13px] text-steel">For Macs with Apple silicon, on macOS 12 or later</span>
      </div>

      <section aria-labelledby="expect" className="mt-16 w-full text-left motion-safe:animate-arrive motion-safe:[animation-delay:1.7s]">
        <h2 id="expect" className="font-wide text-xl font-light tracking-[-0.015em]">
          What to expect
        </h2>
        <dl className="mt-3 divide-y divide-ink/10 border-t border-ink/10">
          {EXPECT.map((item) => (
            <div key={item.title} className="py-4">
              <dt className="text-[15px] font-medium">{item.title}</dt>
              <dd className="mt-1 text-[15px] leading-6 text-steel">{item.body}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[15px] leading-6 text-steel">
          Something broken, or an idea? Write to{" "}
          <a href="mailto:support@stilbe.app" className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
            support@stilbe.app
          </a>
          .
        </p>
      </section>
    </main>
  );
}
