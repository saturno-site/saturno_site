// ──────────────────────────────────────────────────────
// Profile Page — `/profile`
//
// Client component wrapper that loads the user's quiz
// result from localStorage and renders the full
// ProfileDashboard — or an empty state if no result
// has been saved yet.
// ──────────────────────────────────────────────────────

"use client";

import { useState, type JSX } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import { loadLatestResult, clearResult } from "@/lib/quizStorage";
import type { QuizResult } from "@/lib/scoring-engine";

/**
 * Profile page — loads the latest quiz result from localStorage
 * and displays the full ProfileDashboard.
 *
 * **States handled:**
 * - **Empty**: "No profile yet" CTA with link to the quiz
 * - **Result**: full ProfileDashboard with all 6 sections
 *
 * State initialises synchronously from localStorage so no loading
 * phase or effect is needed (SSR-safe: returns null on the server).
 *
 * @example
 * ```tsx
 * // Route: /profile
 * <ProfilePage />
 * ```
 */
export default function ProfilePage(): JSX.Element {
  const [result, setResult] = useState<QuizResult | null>(() =>
    loadLatestResult(),
  );

  /**
   * Clears the saved result and resets the page to the empty state.
   * Called when the user clicks "Clear My Results" or "Retake" from
   * within the ProfileDashboard.
   */
  const handleReset = (): void => {
    clearResult();
    setResult(null);
  };

  /* ── Empty state: no saved result found ──────────────────────── */
  if (!result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <div className="mb-4 text-6xl" role="img" aria-hidden="true">
            🔮
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">
            No Profile Yet
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-400">
            Complete the Enneagram quiz to discover your cosmic archetype
            and unlock your personal profile.
          </p>
        </div>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          Take the Quiz →
        </Link>
      </div>
    );
  }

  /* ── Result found: render the full dashboard ─────────────────── */
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ProfileDashboard result={result} onReset={handleReset} />
      </motion.div>
    </AnimatePresence>
  );
}
