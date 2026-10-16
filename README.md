# Stilbe website

The public website for Stilbe. For now it's a single coming-soon page: the
mark, the name and two words. It's built with Next.js (App Router),
TypeScript and Tailwind CSS v4.

```bash
npm install
npm run dev
```

Opens at http://localhost:3000.

## Where things are

| Path | What's there |
| --- | --- |
| `src/app/page.tsx` | The coming-soon page |
| `src/app/signin/`, `src/app/account/` | Signing in, and back from Stripe |
| `src/components/panel.tsx` | The layout those two share |
| `src/lib/stilbe-api.ts` | Calls to the AI service |
| `src/app/layout.tsx` | Fonts (Archivo, with its width axis) and metadata |
| `src/app/globals.css` | The palette and type tokens in Tailwind's `@theme`, and `font-wide` |
| `src/components/glint-mark.tsx` | The mark and the glint that follows the pointer |
| `src/app/icon.png`, `public/stilbe-mark.png` | The mark, from `../browser/src-tauri/icons/app-icon.png` |

## Pages Stilbe sends people to

- `/signin` finishes signing in from the link in a sign-in email. It shows
  which address and the code Stilbe shows, and signs in only when you press
  Continue, so a mail scanner opening the link can't use it up. It's
  `SIGNIN_URL` in `../server/wrangler.toml`.
- `/account` is where Stripe sends people back after paying, with
  `?checkout=success` or `?checkout=cancel`, and from managing their plan.
  It's `BILLING_RETURN_URL` in `../server/wrangler.toml`.

Both talk to Stilbe's AI service (`../server/`). Set its address as an
environment variable in Vercel (Project → Settings → Environment Variables):

```bash
NEXT_PUBLIC_STILBE_API=https://browser-ai.<your-subdomain>.workers.dev
```

It's built into the page, so redeploy after setting it. It isn't a secret.
For local work, put the same line in `.env.development.local`, which git
ignores. The service only answers this site's own origin (`ALLOWED_ORIGIN`),
so on `localhost` the calls need a local copy of the service (`npx wrangler
dev` in `../server`, with `ALLOWED_ORIGIN` set to the local site).

The HTML mockups this came from, including fuller landing-page directions,
are in `../browser/design/site/`.

## The design

- **Palette:** mercury-grey paper `paper` (#e7eaee), graphite `ink`, `steel`
  for quiet text, and `glint`, the cyan of the mark's rim light. Light only.
- **Type:** Archivo in two widths. `font-wide` (width 125, light) for display;
  normal width for text.
- **Motion:** one sweep of light across the mark on load, then the name and
  "Coming soon" arrive. After that the light follows the pointer on a desktop
  and passes over now and then on a phone. With reduced motion on, nothing
  moves.
