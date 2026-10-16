import type { Metadata } from "next";
import { Suspense } from "react";
import { Panel } from "@/components/panel";
import { SignIn } from "./sign-in";

export const metadata: Metadata = {
  title: "Sign in · Stilbe",
  // A page for one person's link: not for search engines, and the link's
  // token is never sent on to another site.
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

/** Where the link in a sign-in email goes (SIGNIN_URL in server/wrangler.toml). */
export default function SignInPage() {
  return (
    <Suspense fallback={<Panel title="Sign in to Stilbe">Checking your link…</Panel>}>
      <SignIn />
    </Suspense>
  );
}
