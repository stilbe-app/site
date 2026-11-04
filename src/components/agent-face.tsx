"use client";

import { Blobatar } from "blobatar/react";
import { happy, idle, thinking } from "blobatar/expression";

/** The glint's hue, as the app draws every agent: the name gives each its shape. */
const GLINT_HUE = 195;
const EXPRESSION = { idle, thinking, happy } as const;

/** An agent's face, as Stilbe draws it (AgentFace.tsx in the app). */
export function AgentFace({ name, size, mood = "idle", className = "" }: { name: string; size: number; mood?: keyof typeof EXPRESSION; className?: string }) {
  return (
    <Blobatar name={name} hue={GLINT_HUE} animate="always" expression={EXPRESSION[mood]} width={size} height={size} className={className} aria-hidden />
  );
}
