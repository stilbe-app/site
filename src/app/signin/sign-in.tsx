"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Panel, PrimaryButton } from "@/components/panel";
import { post } from "@/lib/stilbe-api";

type State =
  | { step: "checking" }
  | { step: "confirm"; email: string; matchCode: string }
  | { step: "signing-in"; email: string; matchCode: string }
  | { step: "done"; email: string }
  | { step: "problem"; message: string };

/**
 * Finishes signing in to Stilbe from the emailed link.
 *
 * It only asks what the link is for when it loads, and signs in on a click:
 * a mail scanner that opens every link can't use it up, and the code to
 * compare means someone who asked for a link to your address can't get you
 * to sign your account in on their Mac.
 */
export function SignIn() {
  const token = useSearchParams().get("token");
  const [state, setState] = useState<State>(() =>
    token ? { step: "checking" } : { step: "problem", message: "This page needs the link from your sign-in email. Ask Stilbe for a new one." },
  );

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    post<{ email: string; matchCode: string }>("/v1/auth/link", { token }).then((result) => {
      if (cancelled) return;
      setState(result.ok ? { step: "confirm", ...result.data } : { step: "problem", message: result.message });
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const confirm = async () => {
    if (state.step !== "confirm") return;
    setState({ ...state, step: "signing-in" });
    const result = await post<{ email: string }>("/v1/auth/verify", { token });
    // The link is used up either way: keep it out of the address bar and history.
    history.replaceState(null, "", "/signin");
    setState(result.ok ? { step: "done", email: result.data.email } : { step: "problem", message: result.message });
  };

  switch (state.step) {
    case "checking":
      return <Panel title="Sign in to Stilbe">Checking your link…</Panel>;
    case "confirm":
    case "signing-in":
      return (
        <Panel title="Sign in to Stilbe">
          <p>
            Signing in as <span className="text-ink">{state.email}</span>.
          </p>
          <p>Only continue if Stilbe on your Mac shows this code:</p>
          <p className="font-wide text-[26px] tracking-[0.08em] text-ink tabular-nums" data-match-code>
            {state.matchCode}
          </p>
          <PrimaryButton onClick={confirm} disabled={state.step === "signing-in"}>
            {state.step === "signing-in" ? "Signing in…" : "Continue"}
          </PrimaryButton>
          <p className="text-[13px]">If Stilbe doesn&rsquo;t show this code, or you didn&rsquo;t ask to sign in, close this page.</p>
        </Panel>
      );
    case "done":
      return (
        <Panel title="You're signed in">
          <p>
            Stilbe is signed in as <span className="text-ink">{state.email}</span>. You can close this page and go back to Stilbe.
          </p>
        </Panel>
      );
    case "problem":
      return (
        <Panel title="Couldn't sign in">
          <p>{state.message}</p>
        </Panel>
      );
  }
}
