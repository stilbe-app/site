import Image from "next/image";

/**
 * The small pages people land on from Stilbe (signing in, back from paying):
 * the mark, a heading and a few lines, centred on the paper like the
 * coming-soon page, at a reading size.
 */
export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-6 py-16 text-center">
      {/* The same soft light behind the mark as the home page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 left-1/2 -z-10 aspect-square w-[min(900px,150vmin)] -translate-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.9),transparent_72%)]"
      />
      <Image src="/stilbe-mark.png" alt="Stilbe" width={72} height={72} priority className="motion-safe:animate-arrive" />
      <h1 className="font-wide mt-6 text-[28px] leading-tight font-light tracking-[-0.02em] motion-safe:animate-arrive motion-safe:[animation-delay:0.1s]">
        {title}
      </h1>
      <div className="mt-4 space-y-4 text-[15px] leading-6 text-steel motion-safe:animate-arrive motion-safe:[animation-delay:0.2s]">{children}</div>
    </main>
  );
}

/** The one action on a page: graphite, with the glint as its focus ring. */
export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="mt-2 rounded-full bg-ink px-6 py-2.5 text-[15px] text-paper transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glint disabled:opacity-40"
    />
  );
}
