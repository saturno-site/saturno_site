"use client";

import { motion } from "framer-motion";
import { ENNEAGRAM_SHAPES, useFlubberAnimation } from "@/lib/useFlubber";
import { staggerContainer, staggerItem } from "@/lib/animations";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface SplashScreenProps {
  /** Callback fired when the user clicks "Begin the Journey". */
  onStart: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

/**
 * The animated intro screen before the quiz starts.
 *
 * Displays a full-viewport centered hero with:
 * - A continuously morphing Enneagram symbol as a semi-transparent
 *   decorative background behind the text (all 9 shapes cycle via
 *   `useFlubberAnimation`).
 * - A staggered entrance sequence for the subtitle, title, description,
 *   button, and meta line.
 * - A large "Begin the Journey" call-to-action with a glow hover effect
 *   and elastic spring tap.
 *
 * @example
 * ```tsx
 * <SplashScreen onStart={() => setPhase("quiz")} />
 * ```
 */
export default function SplashScreen({
  onStart,
}: SplashScreenProps) {
  /* ── Continuous shape morph ─────────────────────────────────── */
  const [morphPath] = useFlubberAnimation(ENNEAGRAM_SHAPES, 0.8);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-saturno-900 to-slate-950">
      {/* ── Decorative morphing Enneagram symbol ───────────────── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 100 100"
          className="h-[55vmin] w-[55vmin] opacity-[0.08] text-saturno-300 sm:h-[65vmin] sm:w-[65vmin]"
          aria-hidden="true"
        >
          <motion.path d={morphPath} fill="currentColor" />
        </svg>
      </motion.div>

      {/* ── Radial gradient vignette for depth ────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(107,78,245,0.12) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── Content ───────────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-2xl px-6 text-center"
      >
        {/* Subtitle */}
        <motion.p
          variants={staggerItem}
          className="mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-saturno-300"
        >
          9 types. Infinite depth. One you.
        </motion.p>

        {/* Title */}
        <motion.h1
          variants={staggerItem}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Discover Your{" "}
          <span className="bg-gradient-to-r from-saturno-400 to-fuchsia-400 bg-clip-text text-transparent">
            Cosmic Archetype
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={staggerItem}
          className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg"
        >
          Answer a few playful questions and uncover the Enneagram type
          that shapes how you show up in the world.
        </motion.p>

        {/* Button */}
        <motion.div variants={staggerItem} className="mt-10">
          <motion.button
            type="button"
            onClick={onStart}
            /* ── Glow hover ─────────────────────────────────── */
            whileHover={{
              boxShadow: "0 0 32px 6px rgba(168,85,247,0.45)",
              scale: 1.03,
            }}
            /* ── Elastic tap ────────────────────────────────── */
            whileTap={{ scale: 0.92 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
            className="inline-flex items-center gap-3 rounded-full bg-white px-10 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-saturno-500/20 transition-colors hover:bg-saturno-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saturno-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Begin the Journey
            <span
              className="text-lg"
              aria-hidden="true"
            >
              ✦
            </span>
          </motion.button>
        </motion.div>

        {/* Meta */}
        <motion.p
          variants={staggerItem}
          className="mt-6 text-sm text-slate-500"
        >
          12 questions · 4 minutes
        </motion.p>
      </motion.div>
    </section>
  );
}
