"use client";

import { motion } from "framer-motion";
import { elasticPop, springTransition } from "@/lib/animations";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface AnswerCardProps {
  /** Unique identifier for the answer option. */
  id: string;
  /** Display label that appears inside the card. */
  label: string;
  /** Whether this card represents the currently-selected answer. */
  selected: boolean;
  /** When `true`, the card becomes inert (no hover / tap / click). */
  disabled?: boolean;
  /** Callback fired on click with the answer `id`. */
  onSelect: (id: string) => void;
  /**
   * Optional zero-based index used to stagger the entrance animation.
   * Each card delays its enter transition by `index * 60 ms`.
   */
  index?: number;
  /**
   * Optional `layoutId` for **shared layout animations** via
   * `<AnimatePresence>`.  When the same `layoutId` appears in two
   * different trees, Framer Motion will animate the transition
   * smoothly.
   */
  layoutId?: string;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

/**
 * Per-property transition configuration.
 *
 * `opacity` and `y` only animate with a stagger delay **on mount** (they
 * stay at `1` / `0` afterward), so the delay never affects fast
 * subsequent selections.  All other properties (`scale`, `borderColor`,
 * `backgroundColor`) transition instantly via `springTransition`.
 */
function buildTransition(index: number | undefined) {
  const delayed = {
    ...springTransition,
    delay: index != null ? index * 0.06 : 0,
  };

  return {
    default: springTransition,
    opacity: delayed,
    y: delayed,
    scale: springTransition,
    borderColor: springTransition,
    backgroundColor: springTransition,
  };
}

/* ------------------------------------------------------------------ */
/*  Color tokens (brand-aware)                                         */
/* ------------------------------------------------------------------ */

const COLORS = {
  /** saturno-500 */
  brand: "#6b4ef5",
  /** saturno-50 */
  brandBg: "#f6f5ff",
  /** slate-200 */
  border: "#e2e8f0",
  /** white */
  bg: "#ffffff",
} as const;

/* ------------------------------------------------------------------ */
/*  Checkmark component                                                */
/* ------------------------------------------------------------------ */

/**
 * Animated checkmark badge — scales in with an elastic spring while the
 * SVG path draws itself.
 */
function CheckmarkBadge() {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={elasticPop}
      className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-saturno-500 text-white"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <motion.path
          d="M2 7L5.5 10.5L12 3.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </svg>
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * A premium animated answer card for quiz questions.
 *
 * Features entering stagger animation, spring-based hover lift, tap
 * feedback, and a smooth selected-state transition that changes the
 * border colour, background tint, and adds a checkmark badge.
 *
 * @example
 * ```tsx
 * <ul className="grid gap-4 sm:grid-cols-2">
 *   {answers.map((a, i) => (
 *     <AnswerCard
 *       key={a.id}
 *       id={a.id}
 *       label={a.label}
 *       selected={selectedId === a.id}
 *       index={i}
 *       onSelect={handleSelect}
 *     />
 *   ))}
 * </ul>
 * ```
 */
export default function AnswerCard({
  id,
  label,
  selected,
  disabled = false,
  onSelect,
  index,
  layoutId,
}: AnswerCardProps) {
  /* ── Guard: early exit on missing id ─────────────────────── */
  if (!id) {
    return null;
  }

  const transition = buildTransition(index);

  function handleClick() {
    if (disabled) {
      return;
    }
    onSelect(id);
  }

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      layout={true}
      layoutId={layoutId}
      aria-pressed={selected}
      className={[
        "relative w-full rounded-2xl p-5 text-left outline-none",
        "min-h-[4rem] focus-visible:ring-2 focus-visible:ring-saturno-500 focus-visible:ring-offset-2",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      ].join(" ")}
      style={{ border: "1px solid" }}
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.95,
        borderColor: COLORS.border,
        backgroundColor: COLORS.bg,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: selected ? 1.01 : 1,
        borderColor: selected ? COLORS.brand : COLORS.border,
        backgroundColor: selected ? COLORS.brandBg : COLORS.bg,
      }}
      whileHover={
        disabled
          ? undefined
          : {
              scale: 1.02,
              y: -3,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            }
      }
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={transition}
    >
      <span className="block text-sm font-semibold text-slate-950">
        {label}
      </span>

      {selected && <CheckmarkBadge />}
    </motion.button>
  );
}
