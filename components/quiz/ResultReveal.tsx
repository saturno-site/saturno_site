"use client";

import { useState, useEffect, useMemo, useCallback, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ENNEAGRAM_SHAPES,
  useFlubberAnimation,
} from "@/lib/useFlubber";
import { getTypeColor, getTypeFull } from "@/lib/scoring-engine";
import {
  typeColors,
  type EnneagramTypeId,
} from "@/data/enneagram-system";
import { springTransition, bouncyTransition } from "@/lib/animations";
import ParticleBurst from "@/components/quiz/ParticleBurst";
import { TypeCharacter } from "@/components/characters";
import { EnneagramBoard } from "@/components/board";
import type { QuizResult } from "@/lib/scoring-engine";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ResultRevealProps {
  /** The scoring result with primary/secondary/breakdown. */
  result: QuizResult;
  /** Called when the reveal animation finishes and user clicks continue. */
  onComplete: () => void;
}

/** Internal stage labels for the multi-state animation. */
type RevealStage = "loading" | "spinning" | "revealing" | "celebrating" | "complete";

/* ------------------------------------------------------------------ */
/*  Constants — Enneagram Wheel Geometry                              */
/* ------------------------------------------------------------------ */

const CX = 100;
const CY = 100;
const R = 80;

/** Clockwise-from-top angles for each Enneagram number. */
const TYPE_ANGLES_DEG: Record<number, number> = {
  9: -90,
  1: -50,
  2: -10,
  3: 30,
  4: 70,
  5: 110,
  6: 150,
  7: 190,
  8: 230,
};

/** Maps numeric type → EnneagramTypeId. */
const NUM_TO_ID: Record<number, EnneagramTypeId> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
};

/** Maps EnneagramTypeId → numeric type. */
const ID_TO_NUM: Record<EnneagramTypeId, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

/** All 9 numbers in clockwise order (starting at 9). */
const ALL_NUMBERS = [9, 1, 2, 3, 4, 5, 6, 7, 8] as const;

/** Stage timing boundaries (ms from mount). */
const STAGE_TIMING = {
  spin: 1500,
  reveal: 3500,
  celebrate: 4500,
  complete: 6000,
} as const;

const STAGGER_DELAY = 0.08;
const ENTRANCE_DELAY = 0.3;

/* ------------------------------------------------------------------ */
/*  Geometry Helpers                                                   */
/* ------------------------------------------------------------------ */

interface Point {
  x: number;
  y: number;
}

function angleToPoint(deg: number, cx: number, cy: number, r: number): Point {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function computePositions(): Record<number, Point> {
  const positions: Record<number, Point> = {};
  for (const [num, deg] of Object.entries(TYPE_ANGLES_DEG)) {
    positions[Number(num)] = angleToPoint(deg, CX, CY, R);
  }
  return positions;
}

function computeTrianglePath(positions: Record<number, Point>): string {
  const p = positions;
  return `M ${p[3].x} ${p[3].y} L ${p[6].x} ${p[6].y} L ${p[9].x} ${p[9].y} Z`;
}

function computeHexadPath(positions: Record<number, Point>): string {
  const hexad = [1, 4, 2, 8, 5, 7] as const;
  const p = positions;
  return hexad
    .map((n, i) => `${i === 0 ? "M" : "L"} ${p[n].x} ${p[n].y}`)
    .join(" ") + " Z";
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/**
 * Pulsing loader dots rendered as three small circles with staggered
 * opacity animations.
 */
function PulsingDots(): JSX.Element {
  return (
    <div className="mt-6 flex items-center gap-2" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-white/60"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Animated Enneagram wheel — the circle, inner triangle, hexad, and
 * all number labels.  Wrapped in a `motion.g` that rotates.
 */
function EnneagramWheel({
  typeNum,
}: {
  typeNum: number;
}): JSX.Element {
  const [landed, setLanded] = useState(false);
  const positions = useMemo(() => computePositions(), []);
  const trianglePath = useMemo(() => computeTrianglePath(positions), [positions]);
  const hexadPath = useMemo(() => computeHexadPath(positions), [positions]);

  /* rotation target: land with `typeNum` at the pointer (top, angle -90°) */
  const targetAngle = 270 - TYPE_ANGLES_DEG[typeNum];
  const finalRotation = 5 * 360 + targetAngle;

  return (
    <svg
      viewBox="0 0 200 200"
      className="h-64 w-64 drop-shadow-2xl sm:h-72 sm:w-72"
      role="img"
      aria-label="Enneagram symbol spinning to reveal your type"
    >
      {/* ── Pointer (fixed at top) ─────────────────────────── */}
      <polygon
        points="100,6 92,20 108,20"
        fill="white"
        opacity={0.9}
      />

      {/* ── Rotating group ────────────────────────────────── */}
      <motion.g
        style={{ transformOrigin: "100px 100px" }}
        initial={{ rotate: 0 }}
        animate={{ rotate: finalRotation }}
        onAnimationComplete={() => setLanded(true)}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 9,
          mass: 1.2,
        }}
      >
        {/* Outer ring */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.2"
        />

        {/* Inner decorative ring */}
        <circle
          cx={CX}
          cy={CY}
          r={R * 0.55}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />

        {/* Triangle (3-6-9) */}
        <path
          d={trianglePath}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.8"
        />

        {/* Hexad (1-4-2-8-5-7) */}
        <path
          d={hexadPath}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.6"
          strokeDasharray="3 3"
        />

        {/* Centre dot */}
        <circle cx={CX} cy={CY} r={3} fill="rgba(255,255,255,0.3)" />

        {/* Number labels */}
        {ALL_NUMBERS.map((num) => {
          const pos = positions[num];
          const isTarget = num === typeNum;
          const targetColor = typeColors[NUM_TO_ID[num]]?.primary ?? "#fff";

          return (
            <g key={num}>
              {/* Glow ring for the target type once landed */}
              {landed && isTarget && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={11}
                  fill="none"
                  stroke={targetColor}
                  strokeWidth={2.5}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0.4, 1, 0.4], scale: 1 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Number text */}
              <text
                x={pos.x}
                y={pos.y + 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill={
                  landed && isTarget
                    ? targetColor
                    : "rgba(255,255,255,0.7)"
                }
                fontSize={landed && isTarget ? 14 : 11}
                fontWeight={landed && isTarget ? 800 : 500}
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                className="transition-all duration-500"
              >
                {num}
              </text>
            </g>
          );
        })}
      </motion.g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  ResultReveal Component                                             */
/* ------------------------------------------------------------------ */

/**
 * A dramatic multi-stage reveal animation that plays when the quiz
 * completes.  Cycles through five stages:
 *
 * 1. **Loading** — dark overlay, morphing shape, "calculating…" text.
 * 2. **Spin** — Enneagram wheel spins and lands on the user's type.
 * 3. **Reveal** — a type card explodes from centre with 3D flip.
 * 4. **Celebration** — particle confetti + star burst.
 * 5. **Complete** — "Explore your results" button appears.
 *
 * @example
 * ```tsx
 * <ResultReveal
 *   result={quizResult}
 *   onComplete={() => setShowDashboard(true)}
 * />
 * ```
 */
export default function ResultReveal({
  result,
  onComplete,
}: ResultRevealProps): JSX.Element | null {
  /* ── Derived data ──────────────────────────────────────────── */
  const typeFull = useMemo(
    () => getTypeFull(result.primary.typeId),
    [result.primary.typeId],
  );
  const typeColor = useMemo(
    () => getTypeColor(result.primary.typeId),
    [result.primary.typeId],
  );
  const typeNum = ID_TO_NUM[result.primary.typeId];

  /* ── Stage management ──────────────────────────────────────── */
  const [stage, setStage] = useState<RevealStage>("loading");
  const [starBurst, setStarBurst] = useState(false);

  /* Auto-advance through stages */
  useEffect(() => {
    const t1 = setTimeout(() => setStage("spinning"), STAGE_TIMING.spin);
    const t2 = setTimeout(() => setStage("revealing"), STAGE_TIMING.reveal);
    const t3 = setTimeout(() => setStage("celebrating"), STAGE_TIMING.celebrate);
    const t4 = setTimeout(() => setStage("complete"), STAGE_TIMING.complete);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  /* Secondary star burst fires 200 ms after celebration starts */
  useEffect(() => {
    if (stage !== "celebrating") return;
    const t = setTimeout(() => setStarBurst(true), 200);
    return () => clearTimeout(t);
  }, [stage]);

  /* ── Loading morph animation ───────────────────────────────── */
  const [morphPath] = useFlubberAnimation(ENNEAGRAM_SHAPES, 0.5);

  /* ── Handlers ──────────────────────────────────────────────── */
  const handleContinue = useCallback(() => {
    onComplete();
  }, [onComplete]);

  /* ── Guard: we need a valid type to render ─────────────────── */
  if (!typeFull || !typeColor) {
    /* This should never happen with a valid QuizResult, but if it
       does, emit a no-op fallback so the UI doesn't hang. */
    return null;
  }

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <motion.div
      className="fixed inset-0 z-50 flex select-none flex-col items-center justify-center overflow-hidden bg-slate-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Background atmosphere ───────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${typeColor.primary}20 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* ── Stage: LOADING ──────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Morphing shape */}
            <svg
              viewBox="0 0 100 100"
              className="h-32 w-32"
              aria-hidden="true"
            >
              <motion.path
                d={morphPath}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
            </svg>

            <p className="text-center text-lg font-light tracking-wide text-white/80">
              Calculating your cosmic archetype…
            </p>

            <PulsingDots />
          </motion.div>
        )}

        {/* ── Stage: SPINNING ───────────────────────────────── */}
        {stage === "spinning" && (
          <motion.div
            key="spinning"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <EnneagramWheel
              typeNum={typeNum}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ...springTransition }}
              className="text-sm font-medium uppercase tracking-[0.25em] text-white/50"
            >
              Discovering your pattern…
            </motion.p>
          </motion.div>
        )}

        {/* ── Stage: REVEALING / CELEBRATING / COMPLETE ─────── */}
        {(stage === "revealing" ||
          stage === "celebrating" ||
          stage === "complete") && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 360 }}
            transition={{
              ...bouncyTransition,
              opacity: { duration: 0.3 },
            }}
            className="relative mx-auto w-full max-w-sm perspective-1000"
            style={{ perspective: "1000px" }}
          >
            {/* ── Type Card ─────────────────────────────────── */}
            <motion.div
              className="relative overflow-hidden rounded-3xl shadow-2xl"
              style={{ background: typeColor.gradient }}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: STAGGER_DELAY, delayChildren: ENTRANCE_DELAY },
                },
              }}
            >
              {/* Decorative overlays */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 0.5px, transparent 0.5px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Enneagram compass decorative shape */}
              <svg
                viewBox="0 0 200 200"
                className="pointer-events-none absolute right-[-10%] top-[-10%] h-[140%] w-[140%] select-none opacity-[0.05]"
                aria-hidden="true"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="50"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
                <circle cx="100" cy="100" r="4" fill="white" />
                <line
                  x1="100"
                  y1="20"
                  x2="100"
                  y2="180"
                  stroke="white"
                  strokeWidth="0.4"
                />
                <line
                  x1="20"
                  y1="100"
                  x2="180"
                  y2="100"
                  stroke="white"
                  strokeWidth="0.4"
                />
              </svg>

              {/* ── Card Content ─────────────────────────────── */}
              <div className="relative flex flex-col items-center gap-6 px-8 py-12 text-white">
                {/* 1. Type Number */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: bouncyTransition,
                    },
                  }}
                >
                  <span
                    className="flex h-24 w-24 items-center justify-center rounded-full text-5xl font-black tracking-tight shadow-xl"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(6px)",
                      color: typeColor.light ?? typeColor.primary,
                    }}
                    aria-label={`Type ${typeNum}`}
                  >
                    {typeNum}
                  </span>
                </motion.div>

                {/* 2. Type Name + Headline */}
                <div className="text-center">
                  <motion.span
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0, transition: springTransition },
                    }}
                    className="mb-2 block text-sm font-semibold uppercase tracking-[0.3em] text-white/70"
                  >
                    {typeFull.name}
                  </motion.span>

                  <motion.h2
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0, transition: springTransition },
                    }}
                    className="text-3xl font-bold leading-tight"
                  >
                    {typeFull.headline}
                  </motion.h2>
                </div>

                {/* 3. Cosmic Archetype */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0, transition: springTransition },
                  }}
                >
                  <span
                    className="inline-block rounded-full px-5 py-1.5 text-xs font-bold uppercase tracking-[0.25em]"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    ✦ {typeFull.archetype}
                  </span>
                </motion.div>

                {/* 4. Summary */}
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0, transition: springTransition },
                  }}
                  className="max-w-xs text-center text-sm leading-relaxed text-white/80"
                >
                  {typeFull.summary}
                </motion.p>

                {/* 5. Confirmation */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0, transition: springTransition },
                  }}
                  className="mt-2"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                    ✨ That&apos;s you!
                  </span>
                </motion.div>
              </div>

              {/* ── Bottom bar (Saturno) ────────────────────── */}
              <div className="border-t border-white/10 px-8 py-3 text-center">
                <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/40">
                  Saturno · Enneagram Discovery
                </span>
              </div>
            </motion.div>

            {/* ── Type Character ──────────────────────────────── */}
            {(stage === "revealing" || stage === "celebrating" || stage === "complete") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.8,
                }}
                className="mt-8 flex justify-center"
              >
                <div className="relative">
                  <TypeCharacter
                    typeId={result.primary.typeId}
                    animation="enter"
                    size={160}
                    className="drop-shadow-2xl"
                  />
                  {/* Glow ring behind character */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-full opacity-30 blur-3xl"
                    style={{
                      background: typeColors[result.primary.typeId].primary,
                      transform: "scale(1.4)",
                    }}
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            )}

            {/* ── Continue button ──────────────────────────────── */}
            {stage === "complete" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ...springTransition }}
                className="mt-8 flex justify-center"
              >
                <button
                  type="button"
                  onClick={handleContinue}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  Explore your results
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </motion.div>
            )}

            {/* ── Enneagram Board ──────────────────────────────── */}
            {stage === "complete" && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...springTransition,
                  delay: 0.6,
                }}
                className="mt-10"
              >
                <div className="mb-4 text-center">
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
                    Explore the Enneagram
                  </span>
                </div>
                <EnneagramBoard
                  selectedType={result.primary.typeId}
                  onSelectType={() => {}}
                  mode="explore"
                  className="mx-auto max-w-[320px]"
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Particle Burst: confetti (on celebrate) ──────────── */}
      {stage === "celebrating" && (
        <ParticleBurst
          colors={[typeColor.primary, typeColor.light, typeColor.dark]}
          particleCount={300}
          type="confetti"
          spread={100}
          trigger
          duration={2500}
        />
      )}

      {/* ── Particle Burst: stars (delayed 200 ms) ──────────── */}
      {starBurst && (
        <ParticleBurst
          colors={[typeColor.light, "#ffffff"]}
          particleCount={100}
          type="stars"
          spread={80}
          trigger
          duration={2000}
        />
      )}
    </motion.div>
  );
}
