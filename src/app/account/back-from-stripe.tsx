"use client";

import { useSearchParams } from "next/navigation";
import { Panel } from "@/components/panel";

/**
 * Where Stripe sends people back to (BILLING_RETURN_URL in
 * server/wrangler.toml): after Checkout, with ?checkout=success or cancel,
 * and from the subscription page, with nothing. The plan itself reaches
 * Stilbe through Stripe's webhook, not through this page.
 */
export function BackFromStripe() {
  const outcome = useSearchParams().get("checkout");
  if (outcome === "success") {
    return (
      <Panel title="Thank you">
        <p>Your Stilbe Pro subscription has started. Go back to Stilbe: your plan shows in Settings within a few moments.</p>
      </Panel>
    );
  }
  if (outcome === "cancel") {
    return (
      <Panel title="No charge made">
        <p>You left the payment page before subscribing, so nothing was charged. You can upgrade any time from Stilbe&rsquo;s Settings.</p>
      </Panel>
    );
  }
  return (
    <Panel title="All set">
      <p>You can close this page and go back to Stilbe.</p>
    </Panel>
  );
}
