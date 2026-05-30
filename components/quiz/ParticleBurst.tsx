"use client";

import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface ParticleBurstProps {
  /**
   * Array of hex color strings for confetti particles.
   * Falls back to Saturno brand colours when omitted.
   */
  colors?: string[];

  /**
   * Total number of particles to distribute across all bursts.
   * @default 150
   */
  particleCount?: number;

  /**
   * Spread angle in degrees. Particles scatter within ±half this value.
   * @default 70
   */
  spread?: number;

  /**
   * Normalised origin point for the burst.
   * `{ x: 0.5, y: 0.5 }` is the centre of the viewport.
   * @default { x: 0.5, y: 0.5 }
   */
  origin?: { x: number; y: number };

  /**
   * When `true`, fires the burst. Toggle back to `false` and then to `true`
   * to re-trigger.
   * @default true
   */
  trigger?: boolean;

  /**
   * Total duration of the multi-burst sequence in milliseconds.
   * @default 2000
   */
  duration?: number;

  /**
   * Shape of the particles.
   * - `"confetti"` — mix of squares and circles (default).
   * - `"stars"` — star-shaped particles.
   * @default "confetti"
   */
  type?: "confetti" | "stars";
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                            */
/* ------------------------------------------------------------------ */

const DEFAULT_COLORS = ["#6b4ef5", "#b7a9ff", "#8a70ff", "#5939d2"];

/** Number of staggered sub-bursts per trigger. */
const BURST_COUNT = 3;

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Safely invokes `canvas-confetti`, handling ESM default-export quirks
 * that arise in certain bundler configurations.
 *
 * Some bundlers re-export the CommonJS module as `{ default: confettiFn }`
 * even when the type declaration says `export = confetti`. This helper
 * resolves whichever shape the runtime provides.
 */
function fireConfetti(options: confetti.Options): void {
  const fn =
    typeof confetti === "function"
      ? confetti
      : (confetti as unknown as { default?: typeof confetti }).default;

  if (!fn) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ParticleBurst] canvas-confetti not available as a function. " +
          "The burst has been skipped.",
      );
    }
    return;
  }

  fn(options);
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * A celebration particle effect that fires a layered burst of confetti
 * using `canvas-confetti`. Renders nothing to the DOM.
 *
 * Fires **three staggered sub-bursts** per trigger for a rich, layered
 * effect. Cleans up pending timers on unmount so no stray calls occur
 * after the component leaves the tree.
 *
 * @example
 * ```tsx
 * // Fire once on mount with Saturno brand colours
 * <ParticleBurst />
 *
 * // Fire star-shaped particles from the centre
 * <ParticleBurst
 *   type="stars"
 *   particleCount={200}
 *   colors={["#ffd700", "#ff6b6b"]}
 * />
 *
 * // Triggered by external state
 * const [celebrate, setCelebrate] = useState(false);
 * // … later: setCelebrate(true)
 * <ParticleBurst trigger={celebrate} />
 * ```
 */
export default function ParticleBurst({
  colors = DEFAULT_COLORS,
  particleCount = 150,
  spread = 70,
  origin = { x: 0.5, y: 0.5 },
  trigger = true,
  duration = 2000,
  type = "confetti",
}: ParticleBurstProps) {
  /** Guards against firing bursts during SSR / hydration. */
  const isClient = useRef(typeof window !== "undefined");

  useEffect(() => {
    /* -- Early exit: skip when not triggered or during SSR ----------- */
    if (!trigger) return;

    /* -- Early exit: guard against non-browser runtime --------------- */
    if (!isClient.current) return;

    const burstParticleCount = Math.floor(particleCount / BURST_COUNT);
    const interval = duration / BURST_COUNT;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < BURST_COUNT; i++) {
      const timer = setTimeout(() => {
        const options: confetti.Options = {
          particleCount: burstParticleCount,
          spread,
          origin,
          colors,
        };

        if (type === "stars") {
          options.shapes = ["star"];
        }

        fireConfetti(options);
      }, i * interval);

      timers.push(timer);
    }

    /* -- Cleanup: cancel pending sub-bursts on unmount --------------- */
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [trigger, colors, particleCount, spread, origin, duration, type]);

  return null;
}
