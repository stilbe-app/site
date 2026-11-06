import type { Metadata } from "next";
import { Document } from "@/components/document";
import { business } from "@/lib/business";

export const metadata: Metadata = { title: "Refund policy · Stilbe" };

/** DRAFT: the 14-day first-payment refund is a choice to confirm, not a requirement. */
export default function RefundsPage() {
  return (
    <Document title="Refund policy" updated={business.updated}>
      <h2>Cancelling</h2>
      <p>
        You can cancel Stilbe Pro any time, from Settings → Account → Manage subscription. Cancelling stops the next renewal; you keep Pro until
        the end of the month you&rsquo;ve already paid for, and you won&rsquo;t be charged again.
      </p>

      <h2>Your first payment</h2>
      <p>
        If Pro isn&rsquo;t for you, email <a href={`mailto:${business.email}`}>{business.email}</a> within 14 days of your first payment, from
        the address you signed in with, and we&rsquo;ll refund it in full and end the subscription.
      </p>

      <h2>Later payments</h2>
      <p>
        Renewals aren&rsquo;t refunded, including for unused allowance or part of a month, except where the law requires it or as described here.
        If you were charged after you tried to cancel, or charged twice, email us and we&rsquo;ll put it right.
      </p>

      <h2>If we stop providing Pro</h2>
      <p>We&rsquo;ll refund the unused part of the period you&rsquo;ve paid for.</p>

      <h2>How refunds arrive</h2>
      <p>Refunds go back to the card you paid with, through Stripe. They usually appear within 5 to 10 business days, depending on your bank.</p>

      <p>
        This policy doesn&rsquo;t limit any rights you have under the law where you live, such as a right to cancel within a set period in some
        countries.
      </p>
      <p className="note">This is a draft and isn&rsquo;t legal advice; it should be reviewed by a lawyer before Stilbe launches.</p>
    </Document>
  );
}
