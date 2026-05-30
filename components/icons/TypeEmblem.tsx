// ──────────────────────────────────────────────────────
// TypeEmblem — Animated Enneagram Type Icon
//
// Renders a 64×64 viewBox SVG emblem for any Enneagram
// type, with optional Framer Motion animation on mount.
// ──────────────────────────────────────────────────────

"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { EnneagramTypeId } from "@/data/enneagram-system";
import { typeColors } from "@/data/enneagram-system";
import { TYPE_EMBLEMS, getFramePath } from "./typeEmblems";

// ── Props ─────────────────────────────────────────────

export interface TypeEmblemProps {
  /** The Enneagram type to render. */
  typeId: EnneagramTypeId;
  /** Emblem size in CSS pixels (default: 64). */
  size?: number;
  /** Whether to show the type number label (default: true). */
  showNumber?: boolean;
  /**
   * Enable mount animation:
   * - Frame draws in via `pathLength`
   * - Shape fades in after a small delay
   * - Number scales up from 0
   * (default: false)
   */
  animated?: boolean;
  /** Additional CSS classes for the root SVG element. */
  className?: string;
}

// ── Constants ─────────────────────────────────────────

/** Duration of the frame draw‑in animation (seconds). */
const FRAME_ANIM_DURATION = 0.6;

/** Delay before the shape & number appear (seconds). */
const CONTENT_DELAY = 0.3;

/** Duration of the content fade‑in (seconds). */
const CONTENT_DURATION = 0.4;

// ── Component ─────────────────────────────────────────

/**
 * Renders a distinctive emblem for an Enneagram type.
 *
 * The emblem combines:
 * - A **triad frame** (hexagon / circle / diamond) at 30 % opacity
 * - The type's **ENNEAGRAM_SHAPE** at 80 % opacity
 * - The **type number** positioned in the bottom‑right quadrant
 *
 * When `animated` is `true`, the frame stroke draws in, then the
 * shape and number fade up after a brief delay.
 *
 * @example
 * ```tsx
 * // Static usage
 * <TypeEmblem typeId="two" size={48} />
 *
 * // Animated with number hidden
 * <TypeEmblem typeId="five" animated showNumber={false} />
 * ```
 */
export function TypeEmblem({
  typeId,
  size = 64,
  showNumber = true,
  animated = false,
  className,
}: TypeEmblemProps): React.ReactElement {
  const emblem = TYPE_EMBLEMS[typeId];
  const colors = typeColors[typeId];
  const framePath = getFramePath(emblem.frame);
  const filterId = useId().replace(/:/g, "");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`Enneagram type ${emblem.number}`}
    >
      {/* ── Definitions ──────────────────────────────── */}
      <defs>
        {/* Soft glow filter for the emblem */}
        <filter id={`glow-${filterId}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Triad Frame ──────────────────────────────── */}
      {animated ? (
        <motion.path
          d={framePath}
          fill="none"
          stroke={colors.primary}
          strokeWidth="2.5"
          strokeOpacity={0.35}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: FRAME_ANIM_DURATION, ease: "easeOut" }}
        />
      ) : (
        <path
          d={framePath}
          fill={colors.primary}
          fillOpacity={0.3}
          stroke={colors.primary}
          strokeWidth="1.5"
          strokeOpacity={0.5}
        />
      )}

      {/* ── Type Shape ───────────────────────────────── */}
      {animated ? (
        <motion.path
          d={emblem.shape}
          fill={colors.primary}
          fillOpacity={0.8}
          filter={`url(#glow-${filterId})`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: CONTENT_DELAY,
            duration: CONTENT_DURATION,
            ease: "backOut",
          }}
        />
      ) : (
        <path
          d={emblem.shape}
          fill={colors.primary}
          fillOpacity={0.8}
          filter={`url(#glow-${filterId})`}
        />
      )}

      {/* ── Type Number ──────────────────────────────── */}
      {showNumber && (
        animated ? (
          <motion.text
            x={emblem.numberPosition.x}
            y={emblem.numberPosition.y}
            fill={colors.primary}
            fontFamily="system-ui, sans-serif"
            fontSize={14}
            fontWeight={700}
            textAnchor="middle"
            dominantBaseline="central"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: CONTENT_DELAY + 0.1,
              duration: CONTENT_DURATION,
              ease: "backOut",
            }}
          >
            {emblem.number}
          </motion.text>
        ) : (
          <text
            x={emblem.numberPosition.x}
            y={emblem.numberPosition.y}
            fill={colors.primary}
            fontFamily="system-ui, sans-serif"
            fontSize={14}
            fontWeight={700}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {emblem.number}
          </text>
        )
      )}
    </svg>
  );
}
