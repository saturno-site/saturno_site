"use client";

import { motion } from "framer-motion";
import { springTransition } from "@/lib/animations";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SIZE = 80;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2; // 37
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~232.48

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ProgressWheelProps {
  /** Current question index (0-based). */
  current: number;
  /** Total number of questions. */
  total: number;
  /** Optional additional CSS classes. */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * An animated SVG circular progress indicator branded for the Enneagram
 * quiz.  Draws a track circle at 20 % opacity and a purple progress arc
 * whose `pathLength` animates via Framer Motion whenever the fraction
 * `current / total` changes.  The numeric fraction (e.g. `4/15`) is
 * displayed in the centre.
 *
 * @example
 * ```tsx
 * <ProgressWheel current={4} total={15} />
 * ```
 */
export default function ProgressWheel({
  current,
  total,
  className = "",
}: ProgressWheelProps) {
  /* ── Guard: no total → nothing to render ──────────────────── */
  if (total <= 0) {
    return null;
  }

  const progress = Math.min(Math.max(current / total, 0), 1);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      aria-label={`Question ${current} of ${total}`}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* ── Track circle ──────────────────────────────────── */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          className="text-slate-950 opacity-20"
        />

        {/* ── Progress arc ──────────────────────────────────── */}
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="rgb(107,78,245)"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={false}
          animate={{ pathLength: progress }}
          transition={springTransition}
        />
      </svg>

      {/* ── Fraction label ──────────────────────────────────── */}
      <span
        className="absolute text-xs font-semibold text-slate-950 tabular-nums"
        aria-hidden="true"
      >
        {current}/{total}
      </span>
    </div>
  );
}
