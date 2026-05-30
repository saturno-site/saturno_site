import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { interpolate } from "flubber";
import {
  useTransform,
  useMotionValue,
  animate,
  type MotionValue,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Enneagram Type Shapes                                              */
/* ------------------------------------------------------------------ */

/**
 * Nine SVG path strings representing each Enneagram type.
 *
 * Every path uses exactly the **same number of coordinate pairs** (8
 * line-to commands in a 100×100 view‑box) so that `flubber.interpolate`
 * can morph smoothly between any pair of shapes.
 *
 * | Index | Enneagram Type | Shape          |
 * |-------|----------------|----------------|
 * | 0     | 1 (Reformer)   | Square         |
 * | 1     | 2 (Helper)     | Heart          |
 * | 2     | 3 (Achiever)   | Triangle       |
 * | 3     | 4 (Individualist) | Spiral      |
 * | 4     | 5 (Investigator) | Hexagon      |
 * | 5     | 6 (Loyalist)   | Shield         |
 * | 6     | 7 (Enthusiast) | 4‑pointed Star |
 * | 7     | 8 (Challenger) | Diamond        |
 * | 8     | 9 (Peacemaker) | Circle         |
 */
export const ENNEAGRAM_SHAPES: readonly string[] = [
  /* Type 1 — Square: rectilinear, structured, principled. */
  "M 20,20 L 50,20 L 80,20 L 80,50 L 80,80 L 50,80 L 20,80 L 20,50 Z",

  /* Type 2 — Heart: generous, warm, people‑focused. */
  "M 50,75 L 20,45 L 15,25 L 30,15 L 50,35 L 70,15 L 85,25 L 80,45 Z",

  /* Type 3 — Triangle: dynamic, driven, success‑oriented. */
  "M 50,10 L 62,33 L 76,57 L 90,80 L 63,80 L 37,80 L 10,80 L 38,33 Z",

  /* Type 4 — Spiral: introspective, individualistic, organic. */
  "M 50,50 L 70,50 L 75,70 L 50,80 L 25,70 L 20,45 L 35,25 L 60,20 Z",

  /* Type 5 — Hexagon: analytical, systematic, knowledge‑seeking. */
  "M 50,15 L 80,33 L 80,50 L 80,68 L 50,85 L 20,68 L 20,50 L 20,33 Z",

  /* Type 6 — Shield: vigilant, security‑conscious, loyal. */
  "M 15,25 L 50,20 L 85,25 L 85,50 L 70,70 L 50,85 L 30,70 L 15,50 Z",

  /* Type 7 — 4‑pointed Star: spontaneous, versatile, high‑energy. */
  "M 50,5 L 70,30 L 95,50 L 70,70 L 50,95 L 30,70 L 5,50 L 30,30 Z",

  /* Type 8 — Diamond: assertive, powerful, direct. */
  "M 50,10 L 70,30 L 90,50 L 70,70 L 50,90 L 30,70 L 10,50 L 30,30 Z",

  /* Type 9 — Circle: harmonious, peaceful, accommodating. */
  "M 50,10 L 78,22 L 90,50 L 78,78 L 50,90 L 22,78 L 10,50 L 22,22 Z",
] as const;

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

/**
 * Creates a `MotionValue<string>` that yields the morphing SVG path
 * string as `progress` moves through the array of `paths`.
 *
 * @param progress - A `MotionValue<number>` that should range from `0` to
 *   `paths.length - 1`. Fractional values trigger morphing between the
 *   two adjacent shapes.
 * @param paths    - Array of SVG path strings (all must have the same
 *   number of control points for smooth interpolation).
 *
 * @returns A `MotionValue<string>` that can be passed directly to the
 *   `d` attribute of a `<motion.path>` element.
 *
 * @example
 * ```tsx
 * const progress = useMotionValue(0);
 * const path = useFlubber(progress, ENNEAGRAM_SHAPES);
 * return <motion.path d={path} />;
 * ```
 */
export function useFlubber(
  progress: MotionValue<number>,
  paths: readonly string[],
): MotionValue<string> {
  return useTransform(progress, (latest: number) => {
    /* ── guard: degenerate cases ──────────────────────────────── */
    if (paths.length < 2) {
      return paths[0] ?? "";
    }

    /* ── clamp to valid range ──────────────────────────────────── */
    const rawIndex = Math.floor(latest);
    const index = Math.max(0, Math.min(rawIndex, paths.length - 2));
    const localT = Math.max(0, Math.min(latest - index, 1));

    /* ── morph ─────────────────────────────────────────────────── */
    const interpolator = interpolate(paths[index], paths[index + 1], {
      maxSegmentLength: 1,
    });
    return interpolator(localT);
  });
}

/**
 * Drives an auto‑looping shape morph animation through a sequence of
 * SVG path strings.
 *
 * @param paths    - Array of SVG path strings to cycle through.
 * @param duration - Duration of each morph segment in seconds (default: 0.8).
 *
 * @returns A tuple of:
 *  - `path` – a `MotionValue<string>` suitable for `<motion.path d={…} />`.
 *  - `currentIndex` – the index of the *current* shape (0‑based).
 *  - `setCurrentIndex` – imperative setter to jump to a specific shape.
 *
 * @example
 * ```tsx
 * function MorphingIcon() {
 *   const [path, index] = useFlubberAnimation(ENNEAGRAM_SHAPES, 0.6);
 *   return (
 *     <svg viewBox="0 0 100 100">
 *       <motion.path d={path} fill="currentColor" />
 *     </svg>
 *   );
 * }
 * ```
 */
export function useFlubberAnimation(
  paths: readonly string[],
  duration: number = 0.8,
): readonly [
  MotionValue<string>,
  number,
  Dispatch<SetStateAction<number>>,
] {
  const progress = useMotionValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* Guard ref so stale state inside `animate` callback doesn't cause
     rapid re‑triggers on Strict‑Mode double‑invocation. */
  const animatingRef = useRef(false);

  const path = useFlubber(progress, paths);

  const animateToNext = useCallback(() => {
    if (animatingRef.current || paths.length < 2) return;
    animatingRef.current = true;

    const nextIndex = (currentIndex + 1) % paths.length;
    const controls = animate(progress, nextIndex, {
      duration,
      ease: "easeInOut",
      onComplete: () => {
        animatingRef.current = false;
        setCurrentIndex(nextIndex);
      },
    });

    return controls;
  }, [currentIndex, duration, paths.length, progress]);

  useEffect(() => {
    const controls = animateToNext();
    return () => {
      animatingRef.current = false;
      controls?.stop();
    };
  }, [animateToNext]);

  return [path, currentIndex, setCurrentIndex] as const;
}
