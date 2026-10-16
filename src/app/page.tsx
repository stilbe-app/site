import { GlintMark } from "@/components/glint-mark";
import { SiteFooter } from "@/components/site-footer";

/**
 * Coming soon: the mark, the name and two words.
 *
 * Everything hangs off the mark, which is fixed to the centre of the smallest
 * viewport (svh, lifted a little to centre the group optically), so a phone's
 * toolbars sliding in and out never move it. The words hang below it.
 */
export default function Home() {
  return (
    <>
      <main className="fixed top-[calc(50svh-44px)] left-1/2 -translate-1/2">
        {/* A soft disc of light behind the mark, like a studio softbox. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(1000px,160vmin)] -translate-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.95),transparent_72%)]"
        />
        <GlintMark className="w-[clamp(180px,34vmin,340px)]" />
        <div className="absolute top-full left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
          <h1 className="font-wide mt-6 text-[clamp(34px,5vmin,52px)] leading-none font-light tracking-[-0.02em] motion-safe:animate-arrive motion-safe:[animation-delay:1.1s]">
            Stilbe
          </h1>
          <p className="mt-3.5 text-[15px] leading-5 text-steel motion-safe:animate-arrive motion-safe:[animation-delay:1.5s]">
            Coming soon
          </p>
        </div>
      </main>
      {/* Quiet, at the foot of the page, arriving after the words. */}
      <SiteFooter className="fixed inset-x-0 bottom-6 px-6 motion-safe:animate-arrive motion-safe:[animation-delay:1.9s]" />
    </>
  );
}
