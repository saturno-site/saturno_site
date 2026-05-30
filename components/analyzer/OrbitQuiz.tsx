"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { quizQuestions } from "@/data/enneagram";
import { scoreQuiz, type QuizResult } from "@/lib/scoring-engine";
import { ChevronLeft, Sparkles, Check, Orbit } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface OrbitQuizProps {
  /** Fired with the scored result once the final question is answered. */
  onComplete: (result: QuizResult) => void;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Insight points awarded per answered question (purely cosmetic flair). */
const POINTS_PER_ANSWER = 12;

/** Delay before auto-advancing so the selection feedback can be enjoyed. */
const ADVANCE_DELAY_MS = 480;

/** Keyboard digit labels shown on each card (1-4 etc.). */
const DIGIT_HINTS = ["1", "2", "3", "4", "5", "6"] as const;

/* ------------------------------------------------------------------ */
/*  Slide / transition variants                                        */
/* ------------------------------------------------------------------ */

const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 360 : -360,
    opacity: 0,
    scale: 0.94,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? 360 : -360,
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.22, ease: "easeIn" },
  }),
};

/** Reduced-motion variants — fade only, no horizontal travel. */
const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/* ------------------------------------------------------------------ */
/*  Waypoint track — the gamified progress "game board"                */
/* ------------------------------------------------------------------ */

/**
 * A constellation-style progress track. Each question is a waypoint that
 * lights up as it is completed, the active one pulses, and a glowing comet
 * head rides along the connecting orbit line.
 */
function WaypointTrack({
  total,
  currentIndex,
  answeredCount,
  reduceMotion,
}: {
  total: number;
  currentIndex: number;
  answeredCount: number;
  reduceMotion: boolean | null;
}) {
  const progress = total > 1 ? currentIndex / (total - 1) : 0;

  return (
    <div
      className="relative mb-10"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={answeredCount}
      aria-label={`Question ${currentIndex + 1} of ${total}`}
    >
      {/* Orbit line (track) */}
      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-slate-800" />

      {/* Filled orbit line */}
      <motion.div
        className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-violet-400"
        style={{ boxShadow: "0 0 8px rgba(129,140,248,0.7)" }}
        initial={false}
        animate={{ width: `${progress * 100}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      />

      {/* Waypoint dots */}
      <ol className="relative flex items-center justify-between">
        {Array.from({ length: total }).map((_, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;

          return (
            <li key={i} className="relative">
              <motion.span
                className={[
                  "flex h-3 w-3 items-center justify-center rounded-full",
                  isDone
                    ? "bg-indigo-400"
                    : isActive
                      ? "bg-violet-300"
                      : "bg-slate-700",
                ].join(" ")}
                style={
                  isDone || isActive
                    ? { boxShadow: "0 0 10px rgba(167,139,250,0.8)" }
                    : undefined
                }
                animate={
                  isActive && !reduceMotion
                    ? { scale: [1, 1.5, 1] }
                    : { scale: isDone ? 1.1 : 1 }
                }
                transition={
                  isActive && !reduceMotion
                    ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                    : { type: "spring", stiffness: 300, damping: 20 }
                }
              />
              {/* Active waypoint halo ring */}
              {isActive && (
                <span
                  className="pointer-events-none absolute -inset-1.5 rounded-full border border-violet-300/40"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * **OrbitQuiz** — Act I of the Saturno analyzer, reimagined as a playful,
 * gamified "orbit" rather than a flat questionnaire.
 *
 * Gamification & UX features:
 * - **Waypoint track** that lights up as you progress, with a glowing
 *   orbit line and pulsing active node — clear, satisfying progress feedback.
 * - **Insight points** that count up on every answer for a sense of reward.
 * - **Number-key shortcuts** (1-4) plus full keyboard navigation; arrow-left
 *   / Backspace returns to the previous question.
 * - **Tactile choice feedback**: cards pop, glow, stamp a checkmark, and emit
 *   a floating "+points" cue on selection before auto-advancing.
 * - **Direction-aware animated transitions** that respect `prefers-reduced-motion`.
 *
 * The scoring contract is unchanged: `onComplete(scoreQuiz(answers))` fires
 * after the final question, so downstream acts keep working.
 */
export default function OrbitQuiz({ onComplete }: OrbitQuizProps) {
  const reduceMotion = useReducedMotion();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [direction, setDirection] = useState(0);
  const [locked, setLocked] = useState(false);
  const [burst, setBurst] = useState<{ key: number; points: number } | null>(
    null,
  );

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = quizQuestions.length;
  const currentQuestion = quizQuestions[currentIndex];

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers],
  );
  const insightPoints = answeredCount * POINTS_PER_ANSWER;
  const percentAligned = Math.round(((currentIndex + 1) / total) * 100);

  /* ── Cleanup any pending auto-advance on unmount ─────────────────── */
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  /* ── Selection handler ───────────────────────────────────────────── */
  const handleSelect = useCallback(
    (answerId: string) => {
      if (locked) return;
      setLocked(true);

      const nextAnswers = { ...answers, [currentQuestion.id]: answerId };
      setAnswers(nextAnswers);
      setBurst({ key: currentQuestion.id, points: POINTS_PER_ANSWER });

      advanceTimer.current = setTimeout(() => {
        if (currentIndex < total - 1) {
          setDirection(1);
          setCurrentIndex((i) => i + 1);
          setLocked(false);
        } else {
          onComplete(scoreQuiz(nextAnswers));
        }
      }, ADVANCE_DELAY_MS);
    },
    [answers, currentQuestion, currentIndex, total, onComplete, locked],
  );

  /* ── Back handler ────────────────────────────────────────────────── */
  const handleBack = useCallback(() => {
    if (currentIndex === 0 || locked) return;
    setDirection(-1);
    setCurrentIndex((i) => i - 1);
  }, [currentIndex, locked]);

  /* ── Keyboard shortcuts (number keys + back) ─────────────────────── */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        handleBack();
        return;
      }

      const digit = Number.parseInt(e.key, 10);
      if (!Number.isNaN(digit) && digit >= 1 && digit <= currentQuestion.answers.length) {
        e.preventDefault();
        handleSelect(currentQuestion.answers[digit - 1].id);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentQuestion, handleSelect, handleBack]);

  const variants = reduceMotion ? fadeVariants : slideVariants;

  return (
    <div className="relative min-h-[520px] w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-950 p-6 text-white shadow-2xl shadow-indigo-500/10 sm:p-8">
      {/* ── Ambient starfield glow ─────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-indigo-500/10 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-violet-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="mb-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Orbit className="h-5 w-5 text-indigo-400" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 sm:text-sm">
              Act I · The Orbit
            </span>
          </div>

          {/* Insight points + alignment */}
          <div className="flex items-center gap-4">
            <motion.div
              className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1"
              key={insightPoints}
              initial={reduceMotion ? false : { scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 16 }}
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" aria-hidden="true" />
              <span className="font-mono text-xs font-semibold tabular-nums text-indigo-200">
                {insightPoints} INSIGHT
              </span>
            </motion.div>
            <span className="hidden font-mono text-xs text-indigo-300 sm:inline">
              {percentAligned}% ALIGNED
            </span>
          </div>
        </div>

        {/* ── Gamified waypoint progress track ─────────────────────── */}
        <WaypointTrack
          total={total}
          currentIndex={currentIndex}
          answeredCount={answeredCount}
          reduceMotion={reduceMotion}
        />

        {/* ── Question + answers ───────────────────────────────────── */}
        <div className="relative flex-grow">
          {/* Floating "+points" reward cue */}
          <AnimatePresence>
            {burst && !reduceMotion && (
              <motion.span
                key={burst.key}
                className="pointer-events-none absolute right-2 top-0 z-20 font-mono text-sm font-bold text-indigo-300"
                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                animate={{ opacity: 1, y: -18, scale: 1 }}
                exit={{ opacity: 0, y: -34 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                onAnimationComplete={() => setBurst(null)}
                aria-hidden="true"
              >
                +{burst.points}
              </motion.span>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-7"
            >
              <h2 className="text-balance text-2xl font-light leading-snug sm:text-3xl">
                {currentQuestion.prompt}
              </h2>

              <div
                className="grid gap-3"
                role="radiogroup"
                aria-label={currentQuestion.prompt}
              >
                {currentQuestion.answers.map((answer, i) => {
                  const isSelected =
                    answers[currentQuestion.id] === answer.id;

                  return (
                    <motion.button
                      key={answer.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelect(answer.id)}
                      disabled={locked && !isSelected}
                      whileHover={reduceMotion ? undefined : { scale: 1.015 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={[
                        "group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-4 text-left outline-none transition-colors duration-300 sm:p-5",
                        "focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                        isSelected
                          ? "border-indigo-400 bg-indigo-500/15"
                          : "border-slate-800 bg-slate-900/50 hover:border-indigo-500/60 hover:bg-slate-800/70",
                      ].join(" ")}
                    >
                      {/* Number-key hint badge */}
                      <span
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-semibold transition-colors",
                          isSelected
                            ? "border-indigo-300/60 bg-indigo-400/20 text-indigo-100"
                            : "border-slate-700 bg-slate-900 text-slate-400 group-hover:border-indigo-500/40 group-hover:text-indigo-200",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        {DIGIT_HINTS[i] ?? i + 1}
                      </span>

                      <span
                        className={[
                          "relative z-10 flex-grow text-base font-light leading-relaxed transition-colors sm:text-lg",
                          isSelected
                            ? "text-white"
                            : "text-slate-200 group-hover:text-white",
                        ].join(" ")}
                      >
                        {answer.label}
                      </span>

                      {/* Selected checkmark stamp */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-400 text-slate-950"
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 18 }}
                          >
                            <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Sweep shimmer on selection */}
                      {isSelected && !reduceMotion && (
                        <motion.span
                          className="pointer-events-none absolute inset-0 z-0"
                          style={{
                            background:
                              "linear-gradient(105deg, transparent 30%, rgba(129,140,248,0.18) 50%, transparent 70%)",
                          }}
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          aria-hidden="true"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0 || locked}
            className="flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-slate-400 outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-slate-600 sm:inline">
              Tap or press 1–{currentQuestion.answers.length}
            </span>
            <span className="font-mono text-xs tabular-nums text-slate-500">
              {currentIndex + 1} / {total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
