"use client";

// ──────────────────────────────────────────────────────
// TraitMeter — Animated Horizontal Trait Bar
//
// Displays a single Enneagram type's score as an animated
// horizontal bar with a label, a colour-coded fill, and
// a percentage readout.  Primary (highest-scoring) types
// render with the type's colour; others use a muted grey.
// ──────────────────────────────────────────────────────

import { type JSX } from "react";
import { motion } from "framer-motion";
import { springTransition } from "@/lib/animations";
import type { EnneagramTypeId } from "@/data/enneagram-system";

// ── Props ─────────────────────────────────────────────

export interface TraitMeterProps {
  /** The Enneagram type identifier. */
  typeId: EnneagramTypeId;
  /** Human-readable type name, e.g. "The Reformer". */
  typeName: string;
  /** Numeric label (1–9). */
  typeNumber: number;
  /** Normalised score 0–100. */
  score: number;
  /** Whether this is the user's primary (highest-scoring) type. */
  isPrimary: boolean;
  /** Hex colour for the primary type's bar fill. */
  color: string;
  /** Optional stagger delay in seconds before the bar animates in. */
  delay?: number;
}

// ── Component ─────────────────────────────────────────

/**
 * An animated horizontal trait meter that displays an Enneagram type's
 * score as a proportionally filled bar.
 *
 * The bar fill animates from `0%` → `score%` using a gentle spring
 * transition.  Primary types render with the type's accent colour;
 * non-primary types use a muted slate fill.
 *
 * @example
 * ```tsx
 * <TraitMeter
 *   typeId="four"
 *   typeNumber={4}
 *   typeName="The Individualist"
 *   score={78}
 *   isPrimary={true}
 *   color="#7B3F9E"
 *   delay={0.1}
 * />
 * ```
 */
export default function TraitMeter({
  typeName,
  typeNumber,
  score,
  isPrimary,
  color,
  delay = 0,
}: TraitMeterProps): JSX.Element {
  /* ── Guard: clamp score to the valid 0–100 range ──────────────── */
  const clampedScore = Math.max(0, Math.min(100, score ?? 0));

  /* ── Bar fill colour: primary type uses its own colour; others grey */
  const fillColor = isPrimary ? color : "#334155";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...springTransition, delay }}
      className="flex items-center gap-3"
    >
      {/* ── Label: type number + name ────────────────────────────── */}
      <span className="w-32 shrink-0 text-right text-sm font-medium leading-none text-slate-300">
        {typeNumber}. {typeName}
      </span>

      {/* ── Bar track ────────────────────────────────────────────── */}
      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
        {/* ── Animated fill ──────────────────────────────────────── */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedScore}%` }}
          transition={{
            ...springTransition,
            delay,
            stiffness: 120,
            damping: 18,
          }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: fillColor }}
          aria-hidden="true"
        />
      </div>

      {/* ── Percentage readout ───────────────────────────────────── */}
      <span
        className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums"
        style={{ color: isPrimary ? color : "#64748b" }}
      >
        {Math.round(clampedScore)}%
      </span>
    </motion.div>
  );
}
