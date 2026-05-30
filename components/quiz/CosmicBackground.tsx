"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type JSX, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type CosmicMood = "splash" | "body" | "heart" | "head" | "result";

export interface CosmicBackgroundProps {
  /**
   * Determines the gradient palette:
   * - `"splash"` — dark cosmic purple / indigo (landing / intro).
   * - `"body"` — warm amber / orange (instinctive triad).
   * - `"heart"` — soft pink / magenta / coral (feeling triad).
   * - `"head"` — cool teal / blue (thinking triad).
   * - `"result"` — merges `typeColor` with cosmic purple.
   * @default "splash"
   */
  mood?: CosmicMood;

  /**
   * Hex colour used only when `mood === "result"`. Paired with Saturno
   * purple to create a personalised result background.
   */
  typeColor?: string;

  /**
   * Additional CSS classes forwarded to the root element.
   * Useful for overriding z-index or positioning.
   */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Gradient map                                                        */
/* ------------------------------------------------------------------ */

type GradientMap = Record<CosmicMood, string>;

const GRADIENTS: GradientMap = {
  splash:
    "radial-gradient(ellipse 80% 60% at 30% 20%, #2d2357 0%, #1a1035 40%, #0d081a 100%)",
  body:
    "radial-gradient(ellipse 80% 60% at 30% 20%, #f59e0b 0%, #d97706 30%, #78350f 100%)",
  heart:
    "radial-gradient(ellipse 80% 60% at 30% 20%, #f472b6 0%, #db2777 30%, #831843 100%)",
  head:
    "radial-gradient(ellipse 80% 60% at 30% 20%, #06b6d4 0%, #0891b2 30%, #164e63 100%)",
  result:
    "radial-gradient(ellipse 80% 60% at 30% 20%, #6b4ef5 0%, #2d2357 50%, #0d081a 100%)",
};

/* ------------------------------------------------------------------ */
/*  Star-field overlay                                                  */
/* ------------------------------------------------------------------ */

/**
 * A repeating pattern of tiny dots at pseudo-random positions.
 * Created purely with CSS `radial-gradient` stops — no extra DOM or
 * canvas needed. The dots remain static while the gradient layer
 * crossfades beneath them.
 */
const STAR_FIELD_STYLE: Record<string, string> = {
  backgroundImage: [
    "radial-gradient(1px 1px at 15% 10%, rgba(255,255,255,0.35), transparent)",
    "radial-gradient(1.5px 1.5px at 28% 42%, rgba(255,255,255,0.25), transparent)",
    "radial-gradient(1px 1px at 45% 18%, rgba(255,255,255,0.40), transparent)",
    "radial-gradient(1px 1px at 62% 75%, rgba(255,255,255,0.20), transparent)",
    "radial-gradient(1.5px 1.5px at 78% 35%, rgba(255,255,255,0.30), transparent)",
    "radial-gradient(1px 1px at 90% 88%, rgba(255,255,255,0.25), transparent)",
    "radial-gradient(1px 1px at 8% 65%, rgba(255,255,255,0.30), transparent)",
    "radial-gradient(1.5px 1.5px at 52% 55%, rgba(255,255,255,0.20), transparent)",
    "radial-gradient(1px 1px at 35% 90%, rgba(255,255,255,0.35), transparent)",
    "radial-gradient(1px 1px at 70% 5%, rgba(255,255,255,0.25), transparent)",
    "radial-gradient(1.5px 1.5px at 82% 60%, rgba(255,255,255,0.20), transparent)",
    "radial-gradient(1px 1px at 5% 40%, rgba(255,255,255,0.30), transparent)",
    "radial-gradient(1px 1px at 55% 15%, rgba(255,255,255,0.25), transparent)",
    "radial-gradient(1.5px 1.5px at 40% 70%, rgba(255,255,255,0.20), transparent)",
    "radial-gradient(1px 1px at 95% 20%, rgba(255,255,255,0.30), transparent)",
  ].join(", "),
  backgroundSize: "100% 100%",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Resolves the CSS `background` value for the given mood and optional
 * type colour.
 */
function resolveGradient(mood: CosmicMood, typeColor: string | undefined): string {
  if (mood !== "result" || !typeColor) {
    return GRADIENTS[mood];
  }

  return (
    `radial-gradient(ellipse 80% 60% at 30% 20%, ${typeColor} 0%, ` +
    "#2d2357 50%, #0d081a 100%)"
  );
}

/* ------------------------------------------------------------------ */
/*  Animation config                                                    */
/* ------------------------------------------------------------------ */

/** Duration of the crossfade between mood gradients. */
const GRADIENT_TRANSITION_MS = 1.5;

/** Duration of one full "breathe" cycle (scale up & back). */
const BREATHE_CYCLE_S = 8;

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * An animated, full-screen gradient background that shifts its palette
 * based on the current Enneagram triad or phase.
 *
 * Features:
 * - **Rich radial gradients** — deep cosmic colours with a sense of depth.
 * - **Crossfade transitions** — gradients blend smoothly over ~1.5 s when
 *   `mood` changes (handled via `AnimatePresence`).
 * - **Breathing scale** — a slow, perpetual scale oscillation (1 → 1.03 → 1)
 *   that gives the background a living, organic feel.
 * - **Star field** — a pseudo-random dot overlay for celestial texture.
 * - **Non-interactive** — `pointer-events-none` so all clicks pass through.
 *
 * Renders as a `fixed` element covering the entire viewport behind
 * everything (z-index: -10 by default).
 *
 * @example
 * ```tsx
 * // Default splash gradient
 * <CosmicBackground />
 *
 * // Heart triad with a custom accent
 * <CosmicBackground mood="heart" />
 *
 * // Result screen with personalised type colour
 * <CosmicBackground mood="result" typeColor="#e11d48" />
 * ```
 */
export default function CosmicBackground({
  mood = "splash",
  typeColor,
  className = "",
}: CosmicBackgroundProps): JSX.Element {
  const gradient = useMemo(
    () => resolveGradient(mood, typeColor),
    [mood, typeColor],
  );

  return (
    <motion.div
      className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}
      /* -- Slow "breathing" scale, continuous, independent of mood ---- */
      animate={{ scale: [1, 1.03, 1] }}
      transition={{
        duration: BREATHE_CYCLE_S,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/*
       * Gradient layer with crossfade.
       * `AnimatePresence + key` ensures old gradient fades out while
       * the new one fades in whenever `mood` or `typeColor` changes.
       */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${mood}-${typeColor ?? "default"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: GRADIENT_TRANSITION_MS, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ background: gradient }}
        />
      </AnimatePresence>

      {/*
       * Star field — static overlay unaffected by the gradient crossfade.
       * Sits above the gradient layer, scaling with the breathing parent.
       */}
      <div
        className="absolute inset-0"
        style={STAR_FIELD_STYLE}
        aria-hidden="true"
      />
    </motion.div>
  );
}
