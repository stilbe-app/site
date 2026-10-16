/**
 * Stilbe's AI service (server/ in the repo): a Cloudflare Worker at its
 * workers.dev address. Set NEXT_PUBLIC_STILBE_API in Vercel's environment
 * variables; it's built into the page, and it isn't a secret.
 */
export const API = (process.env.NEXT_PUBLIC_STILBE_API ?? "").replace(/\/+$/, "");

export interface ApiError {
  error: { type: string; message: string };
}

/** POSTs `body` to the service. The service only answers this site's origin
 *  (ALLOWED_ORIGIN in its wrangler.toml). */
export async function post<T>(path: string, body: unknown): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  if (!API) return { ok: false, message: "This page isn't connected to Stilbe yet." };
  try {
    const response = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => null);
    if (response.ok) return { ok: true, data: data as T };
    return { ok: false, message: (data as ApiError | null)?.error?.message ?? "Something went wrong. Try again." };
  } catch {
    return { ok: false, message: "Couldn't reach Stilbe. Check your connection and try again." };
  }
}
