"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/** Where the light sits at rest: the mark's upper-right facet. */
const REST = 0.62;

/**
 * The band's transform for a light at `x`, where 0 is the mark's left edge and
 * 1 its right. The band is three marks wide with the light at its middle.
 */
const bandAt = (x: number) => `translateX(${(((x - 1.5) / 3) * 100).toFixed(3)}%)`;

/**
 * The Stilbe mark with a glint: a band of light, clipped to the mark's own
 * silhouette, that only ever moves by transform so the compositor can slide it
 * without repainting.
 *
 * The first sweep is plain CSS (`animate-glint`, in globals.css), so it starts
 * with the first paint on the same clock as the text and doesn't wait for
 * hydration. Once it has finished, the light follows the pointer on a desktop,
 * and passes over every few seconds (or on a tap) on a phone.
 */
export function GlintMark({ className = "" }: { className?: string }) {
  const band = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = band.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let stopped = false;
    const cleanups: (() => void)[] = [];

    const sweep = (to: number, ms: number) =>
      el.animate([{ transform: bandAt(-0.3) }, { transform: bandAt(to) }], {
        duration: ms,
        easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
      });

    const takeOver = () => {
      if (stopped) return;
      // Hand the band from the CSS sweep to inline styles, resting where it ended.
      el.style.transform = bandAt(REST);
      el.style.animation = "none";

      if (matchMedia("(pointer: fine)").matches) {
        let target = REST;
        let current = REST;
        const ease = () => {
          current += (target - current) * 0.1;
          el.style.transform = bandAt(current);
          frame = Math.abs(target - current) > 0.002 ? requestAnimationFrame(ease) : 0;
        };
        const onMove = (e: PointerEvent) => {
          target = 0.1 + e.clientX / innerWidth;
          if (!frame) frame = requestAnimationFrame(ease);
        };
        addEventListener("pointermove", onMove);
        cleanups.push(() => removeEventListener("pointermove", onMove));
      } else {
        const every = window.setInterval(() => sweep(1.3, 1600), 7000);
        const onTap = () => sweep(REST, 1200);
        addEventListener("pointerdown", onTap);
        cleanups.push(() => clearInterval(every), () => removeEventListener("pointerdown", onTap));
      }
    };

    // Hydration may land before, during or after the CSS sweep.
    const intro = el.getAnimations()[0];
    if (intro) intro.finished.then(takeOver, () => {});
    else takeOver();

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <div className={`relative aspect-square ${className}`} aria-hidden="true">
      {/* Unoptimized so the picture and the mask below are one download. */}
      <Image
        src="/stilbe-mark.png"
        alt=""
        fill
        unoptimized
        loading="eager"
        fetchPriority="high"
        className="object-contain drop-shadow-[0_26px_34px_rgb(20_30_45/0.16)]"
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen [mask:url(/stilbe-mark.png)_center/contain_no-repeat]">
        <div
          ref={band}
          className="absolute inset-y-0 left-0 w-[300%] [transform:translateX(-60%)] bg-[linear-gradient(112deg,transparent_44.2%,rgb(255_255_255/0.95)_49.2%,color-mix(in_srgb,var(--color-glint)_70%,white)_50%,transparent_54.1%)] will-change-transform motion-safe:animate-glint motion-reduce:[transform:translateX(-29.333%)]"
        />
      </div>
    </div>
  );
}
