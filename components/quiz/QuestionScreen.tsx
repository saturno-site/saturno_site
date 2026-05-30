"use client";

import { type JSX, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type QuizQuestion } from "@/data/enneagram";
import ProgressWheel from "@/components/quiz/ProgressWheel";
import AnswerCard from "@/components/quiz/AnswerCard";
import {
  staggerContainer,
  staggerItem,
  springTransition,
  bouncyTransition,
} from "@/lib/animations";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface QuestionScreenProps {
  /** The current question data (id, prompt, answers). */
  question: QuizQuestion;
  /** ID of the currently selected answer, or `null` if none selected. */
  selectedAnswer: string | null;
  /** Zero-based index of the current question. */
  currentIndex: number;
  /** Total number of questions in the quiz. */
  totalQuestions: number;
  /** Callback fired with the answer ID when a card is clicked. */
  onSelect: (answerId: string) => void;
  /** Callback fired to advance to the next question (or submit). */
  onNext: () => void;
  /** Callback fired to go back to the previous question. */
  onBack: () => void;
}

/* ------------------------------------------------------------------ */
/*  Mood helper                                                        */
/* ------------------------------------------------------------------ */

/**
 * Derives a triad-based background mood from the question index.
 *
 * | Index range | Triad | Mood    |
 * |-------------|-------|---------|
 * | 0–3         | Head  | `"head"`  |
 * | 4–8         | Heart | `"heart"` |
 * | 9–14        | Body  | `"body"`  |
 *
 * Designed to be consumed by the parent component (e.g. `CosmicBackground`).
 *
 * @param index - Zero-based question index.
 * @returns A `CosmicMood` literal for the triad.
 *
 * @example
 * ```tsx
 * const mood = getMoodForIndex(currentIndex);
 * <CosmicBackground mood={mood} />
 * ```
 */
export function getMoodForIndex(
  index: number,
): "head" | "heart" | "body" {
  if (index <= 3) return "head";
  if (index <= 8) return "heart";
  return "body";
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

/** Slide direction for question transitions (forward / backward). */
type SlideDir = 1 | -1;

/**
 * Builds page-transition variants keyed on the slide direction.
 * Forward  (1)  → slides in from right, exits to left.
 * Backward (-1) → slides in from left,  exits to right.
 */
function pageTransitionVariants(dir: SlideDir) {
  return {
    initial: { opacity: 0, x: dir * 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -(dir * 60) },
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

/**
 * The animated question presentation screen.
 *
 * Features:
 * - **ProgressWheel** at the top with the current question number.
 * - **Question prompt** as large expressive text with a scale/fade entrance.
 * - **4 AnswerCards** in a responsive 2×2 grid (stacked on mobile) using
 *   `staggerContainer` / `staggerItem` for a cascading reveal.
 * - **Dim unselected cards** when one answer is picked.
 * - **Auto-advance**: 400 ms after selection (except on the last question,
 *   where a "See result" button appears instead).
 * - **Direction-aware page transitions** via `AnimatePresence mode="wait"`,
 *   tracking forward/backward navigation with a ref.
 *
 * @example
 * ```tsx
 * <QuestionScreen
 *   question={quizQuestions[0]}
 *   selectedAnswer={answers[1]}
 *   currentIndex={0}
 *   totalQuestions={15}
 *   onSelect={handleSelect}
 *   onNext={handleNext}
 *   onBack={handleBack}
 * />
 * ```
 */
export default function QuestionScreen({
  question,
  selectedAnswer,
  currentIndex,
  totalQuestions,
  onSelect,
  onNext,
  onBack,
}: QuestionScreenProps): JSX.Element {
  /* ── Derive navigation state ──────────────────────────────── */
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  /* ── Direction tracking for slide transitions ─────────────── */
  const [slideDir, setSlideDir] = useState<SlideDir>(1);
  const prevIndex = useRef(currentIndex);

  useEffect(() => {
    if (currentIndex !== prevIndex.current) {
      const dir: SlideDir = currentIndex > prevIndex.current ? 1 : -1;
      setSlideDir(dir);
      prevIndex.current = currentIndex;
    }
  }, [currentIndex]);

  /* ── Auto-advance on selection (except last question) ─────── */
  useEffect(() => {
    /* Early exit: nothing selected or this is the last question. */
    if (!selectedAnswer || isLast) return;

    const timer = setTimeout(() => {
      onNext();
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedAnswer, isLast, onNext]);

  const variants = pageTransitionVariants(slideDir);

  return (
    <div className="flex min-h-[70vh] flex-col justify-between gap-8">
      {/* ── Top: Progress + Question number ─────────────────────── */}
      <div className="flex items-start justify-between">
        <ProgressWheel
          current={currentIndex + 1}
          total={totalQuestions}
        />

        <motion.span
          key={`qnum-${question.id}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          className="text-sm font-medium text-slate-400 tabular-nums"
        >
          Question {currentIndex + 1} of {totalQuestions}
        </motion.span>
      </div>

      {/* ── Question with AnimatePresence transitions ──────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={bouncyTransition}
          className="space-y-8"
        >
          {/* Question prompt */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.1 }}
            className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
          >
            {question.prompt}
          </motion.h2>

          {/* Answer cards with stagger animation */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-3 sm:grid-cols-2"
          >
            {question.answers.map((answer, i) => {
              const isSelected = selectedAnswer === answer.id;

              return (
                <motion.div
                  key={answer.id}
                  variants={staggerItem}
                  /* ── Dim unselected cards when one is picked ── */
                  animate={{
                    opacity:
                      selectedAnswer !== null && !isSelected ? 0.55 : 1,
                  }}
                  transition={springTransition}
                >
                  <AnswerCard
                    id={answer.id}
                    label={answer.label}
                    selected={isSelected}
                    index={i}
                    onSelect={onSelect}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom: Navigation ───────────────────────────────────── */}
      <div className="flex items-center justify-between">
        {/* Back button */}
        <motion.button
          type="button"
          onClick={onBack}
          disabled={isFirst}
          whileTap={{ scale: 0.95 }}
          className={[
            "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold transition-colors",
            "hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saturno-500 focus-visible:ring-offset-2",
            isFirst ? "cursor-not-allowed opacity-50" : "",
          ].join(" ")}
          aria-label="Go back to previous question"
        >
          <span aria-hidden="true">←</span> Back
        </motion.button>

        {/* Next / See result button */}
        <motion.button
          type="button"
          onClick={onNext}
          disabled={!selectedAnswer}
          whileTap={{ scale: 0.95 }}
          className={[
            "inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-colors",
            "hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saturno-500 focus-visible:ring-offset-2",
            !selectedAnswer ? "cursor-not-allowed opacity-50" : "",
          ].join(" ")}
          aria-label={
            isLast ? "See your result" : "Go to next question"
          }
        >
          {isLast ? "See result" : "Next"}
          <span aria-hidden="true">→</span>
        </motion.button>
      </div>
    </div>
  );
}
