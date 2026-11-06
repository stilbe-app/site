import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

/**
 * A page of reading: pricing and the legal pages. The mark (home) at the
 * top, a wide display title, readable text on the paper, the footer links.
 */
export function Document({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col px-6 pt-10 pb-12">
      <Link href="/" className="self-start" aria-label="Stilbe home">
        <Image src="/stilbe-mark.png" alt="" width={40} height={40} priority />
      </Link>
      <main className="mt-10 flex-1">
        <h1 className="font-wide text-[34px] leading-tight font-light tracking-[-0.02em]">{title}</h1>
        {updated && <p className="mt-2 text-[13px] text-steel">Last updated {updated}</p>}
        <div className="document mt-8">{children}</div>
      </main>
      <SiteFooter className="mt-16" />
    </div>
  );
}
