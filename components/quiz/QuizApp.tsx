"use client";

import { useState, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";

import SplashScreen from "@/components/quiz/SplashScreen";
import QuestionScreen from "@/components/quiz/QuestionScreen";
import { getMoodForIndex } from "@/components/quiz/QuestionScreen";
import MidQuizBreak from "@/components/quiz/MidQuizBreak";
import ResultReveal from "@/components/quiz/ResultReveal";
import ResultDashboard from "@/components/quiz/ResultDashboard";
import CosmicBackground from "@/components/quiz/CosmicBackground";
import type { CosmicMood } from "@/components/quiz/CosmicBackground";

import { quizQuestions } from "@/data/enneagram";
import { scoreQuiz, getTypeColor } from "@/lib/scoring-engine";
import type { QuizResult } from "@/lib/scoring-engine";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Threshold index (0-based) for the first mid-quiz break at ~⅓. */
const BREAK_1_THRESHOLD = Math.floor(quizQuestions.length * 0.33);

/** Threshold index (0-based) for the second mid-quiz break at ~⅔. */
const BREAK_2_THRESHOLD = Math.floor(quizQuestions.length * 0.66);

/* ------------------------------------------------------------------ */
/*  Phase type                                                         */
/* ------------------------------------------------------------------ */

type QuizPhase =
  | "splash"
  | "questions"
  | "midbreak"
  | "revealing"
  | "result";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function QuizApp() {
  /* ── State ──────────────────────────────────────────────────────── */
  const [phase, setPhase] = useState<QuizPhase>("splash");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [breakCount, setBreakCount] = useState(0);

  /* ── Derived values ─────────────────────────────────────────────── */
  const totalQuestions = quizQuestions.length;

  /* ── Background mood ────────────────────────────────────────────── */
  const mood: CosmicMood = useMemo(() => {
    switch (phase) {
      case "splash":
        return "splash";
      case "questions":
      case "midbreak":
        return getMoodForIndex(currentIndex);
      case "revealing":
      case "result":
        return "result";
    }
  }, [phase, currentIndex]);

  /* ── Type colour for the result background ──────────────────────── */
  const typeColorHex: string | undefined = useMemo(() => {
    if (!result) return undefined;
    try {
      return getTypeColor(result.primary.typeId).primary;
    } catch {
      return undefined;
    }
  }, [result]);

  /* ── Handlers ───────────────────────────────────────────────────── */

  /** Kick off the quiz from the splash screen. */
  const handleStart = useCallback(() => {
    setPhase("questions");
    setCurrentIndex(0);
  }, []);

  /** Store the selected answer.  Auto-advance is handled by QuestionScreen. */
  const handleSelect = useCallback(
    (answerId: string) => {
      const questionId = quizQuestions[currentIndex].id;
      setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    },
    [currentIndex],
  );

  /**
   * Advance to the next question, check for mid-quiz breaks, or
   * finalise and score when the last question is reached.
   */
  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < totalQuestions) {
      /* ── Mid-quiz break check ────────────────────────────────── */
      if (breakCount === 0 && nextIndex >= BREAK_1_THRESHOLD) {
        setCurrentIndex(nextIndex);
        setBreakCount(1);
        setPhase("midbreak");
        return;
      }
      if (breakCount === 1 && nextIndex >= BREAK_2_THRESHOLD) {
        setCurrentIndex(nextIndex);
        setBreakCount(2);
        setPhase("midbreak");
        return;
      }

      setCurrentIndex(nextIndex);
    } else {
      /* ── Quiz complete — score and reveal ────────────────────── */
      const quizResult = scoreQuiz(answers);
      setResult(quizResult);
      setPhase("revealing");
    }
  }, [currentIndex, answers, breakCount, totalQuestions]);

  /** Navigate back to the previous question. */
  const handleBack = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  /** Resume the quiz after a mid-quiz break. */
  const handleContinue = useCallback(() => {
    setPhase("questions");
  }, []);

  /** Transition from the reveal animation to the result dashboard. */
  const handleRevealComplete = useCallback(() => {
    setPhase("result");
  }, []);

  /** Reset all state and return to the splash screen. */
  const handleReset = useCallback(() => {
    setPhase("splash");
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setBreakCount(0);
  }, []);

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <div className="relative min-h-screen">
      {/* ── Animated cosmic gradient behind everything ────────────── */}
      <CosmicBackground mood={mood} typeColor={typeColorHex} />

      {/* ── Phase-switched content ────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {phase === "splash" && (
          <SplashScreen key="splash" onStart={handleStart} />
        )}

        {phase === "questions" && (
          <div
            key={`q-${currentIndex}`}
            className="relative mx-auto max-w-2xl px-4 py-8"
          >
            <QuestionScreen
              question={quizQuestions[currentIndex]}
              selectedAnswer={answers[quizQuestions[currentIndex]?.id] ?? null}
              currentIndex={currentIndex}
              totalQuestions={totalQuestions}
              onSelect={handleSelect}
              onNext={handleNext}
              onBack={handleBack}
            />
          </div>
        )}

        {phase === "midbreak" && (
          <div
            key={`break-${breakCount}`}
            className="relative mx-auto max-w-2xl px-4 py-8"
          >
            <MidQuizBreak
              questionIndex={currentIndex}
              totalQuestions={totalQuestions}
              onContinue={handleContinue}
            />
          </div>
        )}

        {phase === "revealing" && result && (
          <div key="reveal" className="relative mx-auto max-w-2xl px-4 py-8">
            <ResultReveal
              result={result}
              onComplete={handleRevealComplete}
            />
          </div>
        )}

        {phase === "result" && result && (
          <div key="dashboard" className="relative mx-auto max-w-2xl px-4 py-8">
            <ResultDashboard result={result} onReset={handleReset} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
