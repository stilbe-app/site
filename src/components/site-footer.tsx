import Link from "next/link";
import { business } from "@/lib/business";

const links = [
  { href: "/pricing", label: "Pricing" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refunds", label: "Refunds" },
];

/** Quiet links to the pages a buyer (and Stripe) looks for, and the contact address. */
export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[13px] text-steel ${className}`}>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="hover:text-ink">
          {link.label}
        </Link>
      ))}
      <a href={`mailto:${business.email}`} className="hover:text-ink">
        {business.email}
      </a>
    </footer>
  );
}
