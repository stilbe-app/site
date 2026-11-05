import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Stilbe · Looks", robots: { index: false, follow: false } };

const LOOKS = [
  { href: "/look/night", name: "Night", line: "Mercury in the dark: deep blue-black, drifting cyan and violet light." },
  { href: "/look/daylight", name: "Daylight", line: "A colourful wash, frosted glass, each feature on its own soft colour." },
  { href: "/look/blocks", name: "Colour blocks", line: "A huge headline and bold raspberry, saffron, navy and green bands." },
];

/** The home page's directions, side by side, for choosing one. Not linked from anywhere. */
export default function Looks() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <h1 className="font-wide text-[34px] font-light tracking-[-0.02em]">Three looks for the home page</h1>
      <ul className="flex flex-col divide-y divide-ink/10 border-y border-ink/10">
        {LOOKS.map((look) => (
          <li key={look.href}>
            <Link href={look.href} className="flex flex-col gap-1 py-5 hover:opacity-75">
              <span className="text-[18px] font-medium">{look.name}</span>
              <span className="text-[15px] text-slate">{look.line}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/" className="text-[14px] text-slate underline decoration-glint underline-offset-[3px]">
        The page as it is now
      </Link>
    </main>
  );
}
