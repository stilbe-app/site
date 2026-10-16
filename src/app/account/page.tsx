import type { Metadata } from "next";
import { Suspense } from "react";
import { Panel } from "@/components/panel";
import { BackFromStripe } from "./back-from-stripe";

export const metadata: Metadata = {
  title: "Your plan · Stilbe",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <Suspense fallback={<Panel title="All set">You can close this page and go back to Stilbe.</Panel>}>
      <BackFromStripe />
    </Suspense>
  );
}
