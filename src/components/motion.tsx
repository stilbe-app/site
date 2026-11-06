"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

const MOTION = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (changed: () => void) => {
  const query = matchMedia(MOTION);
  query.addEventListener("change", changed);
  return () => query.removeEventListener("change", changed);
};

/** Whether the person asked for less motion (System Settings › Accessibility). */
export const usePrefersStill = () => useSyncExternalStore(subscribeMotion, () => matchMedia(MOTION).matches, () => false);

/** Whether `ref` has come into view, once. */
export function useSeen<T extends Element>(margin = "-12% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const watch = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          watch.disconnect();
        }
      },
      { rootMargin: margin },
    );
    watch.observe(el);
    return () => watch.disconnect();
  }, [margin, seen]);
  return { ref, seen };
}

/** Rises into place as it comes into view, `delay` ms after. Already there for reduced motion. */
export function Reveal({ children, delay = 0, className = "", style }: { children: ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const { ref, seen } = useSeen<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * A number that rolls into place digit by digit, as an odometer does, when it
 * comes into view: each digit's column of 0–9 slides to its own figure.
 */
export function Odometer({ value, prefix = "", suffix = "", className = "" }: { value: string; prefix?: string; suffix?: string; className?: string }) {
  const { ref, seen } = useSeen<HTMLSpanElement>("0px");
  return (
    <span ref={ref} className={`inline-flex items-baseline ${className}`} aria-label={`${prefix}${value}${suffix}`}>
      <span aria-hidden="true">{prefix}</span>
      {value.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} aria-hidden="true" className="relative inline-block h-[1em] overflow-hidden leading-none">
            <span
              className="flex flex-col transition-transform duration-[1600ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none"
              style={{ transform: `translateY(-${seen ? Number(ch) : 0}em)`, transitionDelay: `${i * 120}ms` }}
            >
              {Array.from({ length: 10 }, (_, d) => (
                <span key={d} className="h-[1em]">
                  {d}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden="true">
            {ch}
          </span>
        ),
      )}
      <span aria-hidden="true">{suffix}</span>
    </span>
  );
}
