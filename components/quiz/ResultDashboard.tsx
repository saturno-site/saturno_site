"use client";

import { useMemo, type JSX } from "react";
import { motion } from "framer-motion";
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  springTransition,
} from "@/lib/animations";
import { getTypeColor, getTypeFull } from "@/lib/scoring-engine";
import {
  triads,
  integrationMap,
  disintegrationMap,
} from "@/data/enneagram-system";
import TypeCompass from "@/components/quiz/TypeCompass";
import GrowthPath from "@/components/quiz/GrowthPath";
import ShareCard, { ShareActions } from "@/components/quiz/ShareCard";
import type { QuizResult } from "@/lib/scoring-engine";
import type { EnneagramTypeId } from "@/data/enneagram-system";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ResultDashboardProps {
  /** The scoring result to display. */
  result: QuizResult;
  /** Callback to reset the quiz and start over. */
  onReset: () => void;
}

/* ------------------------------------------------------------------ */
/*  Stat Card (inline helper)                                          */
/* ------------------------------------------------------------------ */

/**
 * A compact stat display showing a label and value, used in the
 * "Type in Depth" stats grid.
 */
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
        {label}
      </span>
      <span className="mt-1.5 block text-sm font-medium leading-snug text-white/85">
        {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

/**
 * A reusable scroll-reveal section card that wraps content with the
 * standard dashboard section styling.
 */
function DashboardSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={`rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-soft backdrop-blur-sm sm:p-8 ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  ResultDashboard Component                                          */
/* ------------------------------------------------------------------ */

/**
 * A scrollable, richly sectioned results page that presents the user's
 * Enneagram type in full detail.  Sections appear with staggered
 * scroll-reveal animations as the user scrolls.
 *
 * Sections:
 * 1. Header — compact type card with core message.
 * 2. Type Compass — interactive Enneagram symbol.
 * 3. Type in Depth — full description + stats grid.
 * 4. Superpowers & Growth Edges — strength / challenge lists.
 * 5. Growth Path — integration / disintegration visualisation.
 * 6. Your Triad — centre-of-intelligence overview.
 * 7. Share — share card, actions, and retake button.
 *
 * @example
 * ```tsx
 * <ResultDashboard
 *   result={quizResult}
 *   onReset={() => setShowResults(false)}
 * />
 * ```
 */
export default function ResultDashboard({
  result,
  onReset,
}: ResultDashboardProps): JSX.Element {
  /* ── Derive rich type data from the scoring result ──────────── */
  const typeFull = useMemo(
    () => getTypeFull(result.primary.typeId),
    [result.primary.typeId],
  );
  const typeColor = useMemo(
    () => getTypeColor(result.primary.typeId),
    [result.primary.typeId],
  );
  const typeNum =
    ({
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
    } as const)[result.primary.typeId] ?? 0;

  /* ── Triad info ─────────────────────────────────────────────── */
  const triadInfo = triads[typeFull.triad];

  /* ── Growth path targets (from result, fall back to map) ───── */
  const integTarget: EnneagramTypeId =
    result.integrationPath ?? integrationMap[result.primary.typeId];
  const disintegTarget: EnneagramTypeId =
    result.disintegrationPath ?? disintegrationMap[result.primary.typeId];

  /* ── Fail-fast guard ────────────────────────────────────────── */
  if (!typeFull || !typeColor || !triadInfo) {
    /* istanbul ignore next — should never happen with valid QuizResult */
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-400">
          Unable to load your results. Please try again.
        </p>
      </div>
    );
  }

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-4 py-12 sm:px-6">
      {/* ── Title ──────────────────────────────────────────────── */}
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="text-center text-sm font-semibold uppercase tracking-[0.35em] text-white/40"
      >
        Your Cosmic Archetype
      </motion.h1>

      {/* ── Header: Compact Type Card ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springTransition, delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl shadow-2xl"
        style={{ background: typeColor.gradient }}
      >
        {/* Decorative pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 0.5px, transparent 0.5px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative flex flex-col items-center gap-4 px-6 py-10 text-white sm:px-10">
          {/* Type number badge */}
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full text-3xl font-black shadow-lg"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(4px)",
              color: typeColor.light ?? typeColor.primary,
            }}
            aria-label={`Type ${typeNum}`}
          >
            {typeNum}
          </span>

          {/* Name + Headline */}
          <div className="text-center">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              {typeFull.name}
            </span>
            <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
              {typeFull.headline}
            </h2>
          </div>

          {/* Archetype tag */}
          <span
            className="inline-block rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-[0.25em]"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(4px)",
            }}
          >
            ✦ {typeFull.archetype}
          </span>

          {/* Wounding message — the deep truth the heart longs to hear */}
          <blockquote className="mt-2 max-w-sm text-center text-sm italic leading-relaxed text-white/75">
            Your heart longs to hear:{" "}
            <span className="font-semibold text-white/90">
              &ldquo;{typeFull.woundingMessage}&rdquo;
            </span>
          </blockquote>
        </div>
      </motion.div>

      {/* ── Section 1: Type Compass ────────────────────────────── */}
      <DashboardSection>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
          <div className="w-48 shrink-0 sm:w-56">
            <TypeCompass
              primaryType={result.primary.typeId}
              possibleWing={result.possibleWing}
              integrationPath={integTarget}
              disintegrationPath={disintegTarget}
            />
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Your Type Compass
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              The Enneagram symbol maps nine interconnected personality
              patterns. Your type is highlighted — the points it connects to
              reveal your growth path (green arrow) and stress pattern
              (orange arrow).
            </p>
            {result.possibleWing && (
              <p className="text-sm leading-relaxed text-slate-500">
                <span className="font-semibold text-slate-300">Possible wing:</span>{" "}
                The adjacent type <strong>{result.possibleWing}</strong> showed
                strongly, suggesting it may flavour your core type.
              </p>
            )}
          </div>
        </div>
      </DashboardSection>

      {/* ── Section 2: Your Type in Depth ──────────────────────── */}
      <DashboardSection>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
          Your Type in Depth
        </h3>

        {/* Full description */}
        <div className="mb-6 space-y-3">
          {typeFull.description.split("\n\n").map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, ...springTransition }}
              className="text-sm leading-relaxed text-slate-400"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <StatCard label="Core Fear" value={typeFull.coreFear} />
          <StatCard label="Core Desire" value={typeFull.coreDesire} />
          <StatCard label="Core Weakness" value={typeFull.coreWeakness} />
          <StatCard label="Virtue" value={typeFull.virtue} />
        </div>
      </DashboardSection>

      {/* ── Section 3: Superpowers & Growth Edges ──────────────── */}
      <DashboardSection>
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Superpowers */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
              <span aria-hidden="true">✨</span> Your Superpowers
            </h3>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-2"
            >
              {typeFull.strengths.map((strength, i) => (
                <motion.li
                  key={i}
                  variants={staggerItem}
                  className="flex items-start gap-2.5 rounded-lg bg-white/5 px-4 py-2.5 text-sm text-slate-300"
                >
                  <span
                    className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: typeColor.primary }}
                    aria-hidden="true"
                  />
                  {strength}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Growth Edges */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
              <span aria-hidden="true">🌱</span> Growth Edges
            </h3>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-2"
            >
              {typeFull.challenges.map((challenge, i) => (
                <motion.li
                  key={i}
                  variants={staggerItem}
                  className="flex items-start gap-2.5 rounded-lg bg-white/5 px-4 py-2.5 text-sm text-slate-400"
                >
                  <span
                    className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500/40"
                    aria-hidden="true"
                  />
                  {challenge}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </DashboardSection>

      {/* ── Section 4: Your Growth Path ─────────────────────────── */}
      <DashboardSection>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
          Your Growth Path
        </h3>
        <GrowthPath
          typeId={result.primary.typeId}
          integrationType={integTarget}
          disintegrationType={disintegTarget}
        />

        {/* Growth tips */}
        {typeFull.growthTips.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Actionable Tips
            </h4>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-2"
            >
              {typeFull.growthTips.map((tip, i) => (
                <motion.li
                  key={i}
                  variants={staggerItem}
                  className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-slate-400"
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: `${typeColor.primary}30`,
                      color: typeColor.primary,
                    }}
                  >
                    {i + 1}
                  </span>
                  {tip}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        )}
      </DashboardSection>

      {/* ── Section 5: Your Triad ──────────────────────────────── */}
      <DashboardSection>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
          Your Triad
        </h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {/* Triad colour accent bar */}
          <div
            className="h-1 w-full shrink-0 rounded-full sm:h-24 sm:w-1.5"
            style={{ backgroundColor: triadInfo.color }}
            aria-hidden="true"
          />

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: triadInfo.color }}
              >
                {typeNum}
              </span>
              <div>
                <span className="block text-sm font-semibold text-white">
                  {triadInfo.name}
                </span>
                <span className="text-xs text-slate-500">
                  {triadInfo.center} · {triadInfo.emotion} as core emotion
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-400">
              {triadInfo.description}
            </p>

            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Balance Tip
              </span>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                Your intelligence center — the{" "}
                <span className="font-medium text-slate-300">
                  {triadInfo.center}
                </span>{" "}
                — is your natural home. When you feel out of balance, reconnect
                with this center through{" "}
                {typeFull.triad === "body"
                  ? "movement, breath, and physical presence."
                  : typeFull.triad === "heart"
                    ? "meaningful connection, self-compassion, and emotional honesty."
                    : "quiet reflection, journaling, and mental clarity."}
              </p>
            </div>
          </div>
        </div>
      </DashboardSection>

      {/* ── Section 6: Share ────────────────────────────────────── */}
      <DashboardSection>
        <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-widest text-white">
          Share Your Discovery
        </h3>

        <ShareCard
          typeId={result.primary.typeId}
          typeName={typeFull.name}
          headline={typeFull.headline}
          archetype={typeFull.archetype}
          summary={typeFull.summary}
          colors={typeColor}
        />

        <div className="mt-6">
          <ShareActions
            typeName={typeFull.name}
            headline={typeFull.headline}
          />
        </div>

        {/* Retake button */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 flex justify-center"
        >
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/70 shadow-sm backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Retake Quiz
          </button>
        </motion.div>
      </DashboardSection>

      {/* ── Footer spacer ───────────────────────────────────────── */}
      <div className="pb-12 text-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/20">
          Saturno · Enneagram Discovery
        </span>
      </div>
    </div>
  );
}
