"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { springTransition } from "@/lib/animations";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Decorative emojis shown at the top of the break card. */
const DECORATIONS = ["🌟", "🔮", "✨", "🧭"] as const;

/**
 * Content pool for the first break (~⅓ through the quiz).
 * Picked via index-based selection for deterministic rendering.
 */
const BREAK_ONE_FACTS = [
  "Did you know? The Enneagram has been used for over 2,000 years — its symbol dates back to ancient Greece.",
  "Fun fact: Your Enneagram type doesn't change over your lifetime — but how you express it can transform dramatically.",
  "Did you know? There are 27 unique subtypes when you combine Enneagram types with instinctual variants.",
] as const;

/**
 * Content pool for the second break (~⅔ through the quiz).
 * Each entry is a reflection prompt displayed as a question.
 */
const BREAK_TWO_REFLECTIONS = [
  "Pause for a moment. Which element calls to you right now?",
  "Quick check: When you think of 'home', what feeling comes first?",
  "A thought: The most interesting people are those who contain contradictions.",
] as const;

/**
 * Subtitle labels for each break tier.
 */
const BREAK_LABELS = {
  first: {
    tag: "Cosmic Check-in",
    subtitle: "A moment between questions",
  },
  second: {
    tag: "Reflection",
    subtitle: "Before we continue…",
  },
} as const;

/** Duration in ms before the continue button appears. */
const BUTTON_DELAY_MS = 1500;

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface MidQuizBreakProps {
  /** Current question index — used to determine which break screen to show. */
  questionIndex: number;
  /** Total number of questions in the quiz. */
  totalQuestions: number;
  /** Callback fired when the user taps "Continue". */
  onContinue: () => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Picks an item from a readonly array using a stable index derived from the
 * question position.  This avoids non-deterministic behaviour from Math.random
 * while still distributing content across quiz sessions.
 */
function pickFromPool<T>(pool: readonly T[], index: number): T {
  return pool[Math.abs(index) % pool.length];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * A playful interlude screen that appears at ~⅓ and ~⅔ through the quiz
 * to break up the rhythm.  The first break shows a fun Enneagram fact;
 * the second shows a reflective prompt.
 *
 * Features:
 * - **Animated entrance** — the card scales in with a fade-up on mount.
 * - **Deterministic content** — facts and decorations are chosen from small
 *   pools using an index derived from `questionIndex` for stable rendering.
 * - **Delayed continue button** — the action button slides in after a 1.5 s
 *   pause so the user has time to read before proceeding.
 * - **Pulsing CTA** — while waiting, the button pulses subtly to invite action.
 *
 * @example
 * ```tsx
 * {isBreakPoint && (
 *   <MidQuizBreak
 *     questionIndex={currentIndex}
 *     totalQuestions={questions.length}
 *     onContinue={resumeQuiz}
 *   />
 * )}
 * ```
 */
export default function MidQuizBreak({
  questionIndex,
  totalQuestions,
  onContinue,
}: MidQuizBreakProps) {
  /* ── Determine break tier ──────────────────────────────────────── */
  const isFirstBreak = questionIndex <= Math.floor(totalQuestions / 2);

  const { tag, subtitle } = isFirstBreak
    ? BREAK_LABELS.first
    : BREAK_LABELS.second;

  const pool = isFirstBreak ? BREAK_ONE_FACTS : BREAK_TWO_REFLECTIONS;
  const bodyText = useMemo(
    () => pickFromPool(pool, questionIndex),
    [pool, questionIndex],
  );

  const decoration = useMemo(
    () => pickFromPool(DECORATIONS, questionIndex),
    [questionIndex],
  );

  /* ── Delayed button appearance ────────────────────────────────── */
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), BUTTON_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  /* ── Render ────────────────────────────────────────────────────── */
  return totalQuestions <= 0 ? null : (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={springTransition}
      className="w-full"
    >
      <div className="w-full rounded-2xl border border-slate-200/60 bg-gradient-to-b from-slate-50 to-white p-8 shadow-soft sm:p-10">
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">
          {/* ── Decorative emoji ──────────────────────────────────── */}
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springTransition, delay: 0.2 }}
            className="mb-4 text-4xl sm:text-5xl"
            role="img"
            aria-hidden="true"
          >
            {decoration}
          </motion.span>

          {/* ── Tag label ─────────────────────────────────────────── */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.35 }}
            className="inline-block rounded-full bg-saturno-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-saturno-700"
          >
            {tag}
          </motion.span>

          {/* ── Subtitle ─────────────────────────────────────────── */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.45 }}
            className="mt-3 text-sm font-medium tracking-wide text-slate-500"
          >
            {subtitle}
          </motion.p>

          {/* ── Body text (fact or reflection) ────────────────────── */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.6 }}
            className="mt-6 text-balance text-lg leading-relaxed text-slate-800 sm:text-xl sm:leading-8"
          >
            {bodyText}
          </motion.p>

          {/* ── Continue button (delayed) ─────────────────────────── */}
          <AnimatePresence>
            {showButton && (
              <motion.button
                type="button"
                onClick={onContinue}
                initial={{ opacity: 0, y: 16 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: [1, 1.04, 1],
                }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  default: springTransition,
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saturno-500 focus-visible:ring-offset-2"
              >
                <span>Continue</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="mt-px"
                >
                  <path
                    d="M3 7h8M7 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          {/* ── Waiting indicator (shown before button appears) ──── */}
          {!showButton && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-8 text-xs tracking-widest text-slate-400"
            >
              Take your time…
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
