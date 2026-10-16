import type { Metadata } from "next";
import { Document } from "@/components/document";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: "Pricing · Stilbe",
  description: "Stilbe is a browser for Mac with an AI agent built in. Free to use, with Pro for more AI.",
};

function Plan({ name, price, points }: { name: string; price: string; points: string[] }) {
  return (
    <section className="rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5">
      <h2 className="!mt-0 font-wide !text-[22px] !font-light">{name}</h2>
      <p className="!mt-1 text-[15px] text-steel">{price}</p>
      <ul className="!mt-4 !list-none !pl-0 text-[14px]">
        {points.map((point) => (
          <li key={point} className="flex gap-2">
            <span aria-hidden="true" className="text-glint">
              ✦
            </span>
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PricingPage() {
  return (
    <Document title="Pricing">
      <p>
        Stilbe is a web browser for Mac with an AI agent built in. The agent works in your tabs as you would: it reads pages, clicks, fills in
        forms and works across tabs, and summarises and explains what you&rsquo;re reading. It asks before anything that can&rsquo;t be undone.
        Everything else you&rsquo;d expect from a browser is there too: tabs and split view, a password manager, an ad blocker, and a reader
        and PDF viewer.
      </p>
      <p>Each month comes with an allowance of AI use. The browser itself is free and unlimited.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Plan
          name="Free"
          price="$0"
          points={["The whole browser", "A monthly AI allowance for everyday use", "No account needed"]}
        />
        <Plan
          name="Pro"
          price={`${business.pro.price} a ${business.pro.period}, plus tax where it applies`}
          points={["Four times the free monthly AI allowance", "One plan for all your Macs", "Cancel any time"]}
        />
      </div>

      <h2>How the allowance works</h2>
      <p>
        AI use is counted by what it costs to run: a question about a page uses a little, a long task with many steps or screenshots uses more.
        Settings in Stilbe shows how much of this month&rsquo;s allowance you&rsquo;ve used. It resets on the 1st of each month. A new
        Mac&rsquo;s free allowance starts smaller and grows to the full amount over its first two weeks.
      </p>
      <p>When you reach it, the agent stops and tells you, and you can upgrade or wait for the next month. Nothing is ever charged without you choosing to subscribe.</p>

      <h2>Subscribing</h2>
      <p>
        Upgrade from Settings → Account in Stilbe. Payment is handled by Stripe; Stilbe never sees your card. Pro renews every month until
        you cancel, which you can do any time from Settings → Account → Manage subscription. You keep Pro until the end of the month
        you&rsquo;ve paid for. See the <a href="/refunds">refund policy</a> and <a href="/terms">terms</a>.
      </p>
      <p>
        Questions? Email <a href={`mailto:${business.email}`}>{business.email}</a>.
      </p>
    </Document>
  );
}
