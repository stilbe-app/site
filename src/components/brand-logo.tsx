import { siBitwarden, siCanvas, siGmail, siGooglechrome, siGoogledocs, siUblockorigin, siWikipedia, siZillow, type SimpleIcon } from "simple-icons";

/**
 * The sites' and apps' own logos, from Simple Icons (simpleicons.org); each
 * is its company's trademark, used to say what Stilbe works with. Outlook
 * has none there (Microsoft had theirs taken out), so it's a plain mail
 * glyph in its blue.
 */
const LOGOS = {
  gmail: siGmail,
  zillow: siZillow,
  wikipedia: siWikipedia,
  docs: siGoogledocs,
  canvas: siCanvas,
  ublock: siUblockorigin,
  bitwarden: siBitwarden,
  chrome: siGooglechrome,
} satisfies Record<string, SimpleIcon>;

export type LogoId = keyof typeof LOGOS | "outlook";

const OUTLOOK = "M3.5 6.5h17v11h-17z M3.5 7l8.5 6.5L20.5 7";

/** A logo in its own colour (or `colour`), `size` px square. */
export function BrandLogo({ id, size = 24, colour, className = "" }: { id: LogoId; size?: number; colour?: string; className?: string }) {
  if (id === "outlook")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colour ?? "#0f6cbd"} strokeWidth="1.8" strokeLinejoin="round" role="img" aria-label="Outlook" className={className}>
        <path d={OUTLOOK} />
      </svg>
    );
  const icon = LOGOS[id];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={colour ?? `#${icon.hex}`} role="img" aria-label={icon.title} className={className}>
      <path d={icon.path} />
    </svg>
  );
}

/** A logo on a tile, as an app icon: white, or Outlook's blue with a white glyph. */
export function LogoTile({ id, size = 46 }: { id: LogoId; size?: number }) {
  const outlook = id === "outlook";
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[13px] shadow-[0_10px_22px_-10px_rgb(0_0_0/0.6)]"
      style={{ width: size, height: size, background: outlook ? "#0f6cbd" : "#ffffff" }}
    >
      <BrandLogo id={id} size={Math.round(size * 0.52)} colour={outlook ? "#ffffff" : undefined} />
    </span>
  );
}
