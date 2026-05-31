"use client";

// ──────────────────────────────────────────────────────────────────────
// ProfileDashboard — Personal Enneagram Profile
//
// A rich, scrollable profile page presented after the quiz reveal.
// Sections:
//   1. Character Hero  — animated type character + number + archetype
//   2. Enneagram Compass — interactive board with type highlighted
//   3. Type Strength Breakdown — animated trait meters for all 9 types
//   4. Core Dynamics — fear / desire / weakness / virtue grid
//   5. Growth Path — integration & disintegration directions
//   6. Share + Actions — share card, social actions, retake & clear
// ──────────────────────────────────────────────────────────────────────

import { useMemo, useState, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  springTransition,
} from "@/lib/animations";
import { getTypeColor, getTypeFull } from "@/lib/scoring-engine";
import {
  enneagramTypesFull,
  integrationMap,
  disintegrationMap,
} from "@/data/enneagram-system";
import type { EnneagramTypeId } from "@/data/enneagram-system";
import type { QuizResult } from "@/lib/scoring-engine";
import { getTypeVisuals } from "@/lib/tokens";
import TypeCharacter from "@/components/characters/TypeCharacter";
import { EnneagramBoard } from "@/components/board/EnneagramBoard";
import TraitMeter from "@/components/profile/TraitMeter";
import GrowthPath from "@/components/quiz/GrowthPath";
import ShareCard, { ShareActions } from "@/components/quiz/ShareCard";
import { clearResult, loadHistory } from "@/lib/quizStorage";

// ── Constants ─────────────────────────────────────────

/** Maps every EnneagramTypeId to its numeric label 1–9. */
const TYPE_NUMBERS: Record<EnneagramTypeId, number> = {
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

// ── Props ─────────────────────────────────────────────

export interface ProfileDashboardProps {
  /** The scoring result to display. */
  result: QuizResult;
  /** Callback invoked when the user chooses to retake the quiz. */
  onReset: () => void;
}

// ── Section Wrapper ───────────────────────────────────

/**
 * Reusable scroll-reveal section card used for every dashboard section.
 * Fades up as it enters the viewport.
 */
function ProfileSection({
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

// ── Core Dynamic Card ─────────────────────────────────

/**
 * A compact card in the Core Dynamics 2×2 grid showing one of the four
 * core motivations (fear, desire, weakness, virtue).
 */
function CoreDynamicCard({
  label,
  value,
  accentColor,
  emoji,
}: {
  label: string;
  value: string;
  accentColor: string;
  emoji: string;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/[0.07]"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg" role="img" aria-hidden="true">
          {emoji}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
          {label}
        </span>
      </div>
      {/* Accent colour bar */}
      <div
        className="mb-2 h-0.5 w-8 rounded-full"
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />
      <span className="block text-sm font-medium leading-snug text-white/85">
        {value}
      </span>
    </motion.div>
  );
}

// ── Confirmation Dialog ──────────────────────────────

/**
 * Modal confirmation dialog shown before clearing saved results.
 * Prevents accidental data loss.
 */
function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  accentColor,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  accentColor: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={springTransition}
            className="mx-4 w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
          >
            <h3
              id="confirm-title"
              className="mb-2 text-lg font-bold text-white"
            >
              Clear Your Results?
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              This will permanently remove your saved Enneagram profile.
              You can always retake the quiz to discover your type again.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                style={{ backgroundColor: accentColor }}
              >
                Clear Results
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Comparison Overlay ────────────────────────────────

/**
 * Modal overlay comparing a past quiz result with the current result.
 * Shows side-by-side type info, a shift message, and score comparison bars.
 */
function ComparisonOverlay({
  pastResult,
  currentResult,
  onClose,
}: {
  pastResult: QuizResult;
  currentResult: QuizResult;
  onClose: () => void;
}) {
  const pastType = getTypeFull(pastResult.primary.typeId);
  const pastColor = getTypeColor(pastResult.primary.typeId);
  const currentType = getTypeFull(currentResult.primary.typeId);
  const currentColor = getTypeColor(currentResult.primary.typeId);
  const isSameType =
    pastResult.primary.typeId === currentResult.primary.typeId;

  /* ── Collect types with score >= 15% from either result ── */
  const significantTypes = new Set<EnneagramTypeId>();
  for (const s of pastResult.breakdown) {
    if (s.normalizedScore >= 15) significantTypes.add(s.typeId);
  }
  for (const s of currentResult.breakdown) {
    if (s.normalizedScore >= 15) significantTypes.add(s.typeId);
  }

  const comparisonBars = Array.from(significantTypes).map((typeId) => {
    const pastScore =
      pastResult.breakdown.find((s) => s.typeId === typeId)
        ?.normalizedScore ?? 0;
    const currentScore =
      currentResult.breakdown.find((s) => s.typeId === typeId)
        ?.normalizedScore ?? 0;
    const typeData = enneagramTypesFull.find((t) => t.id === typeId);
    return {
      typeId,
      pastScore,
      currentScore,
      name: typeData?.headline ?? typeId,
      number: typeData?.number ?? 0,
    };
  });

  const maxBarScore = Math.max(
    ...comparisonBars.map((b) => Math.max(b.pastScore, b.currentScore)),
    1,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={springTransition}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Compare past result"
      >
        {/* ── Close button ─────────────────────────────── */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close comparison"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── Side-by-side type cards ──────────────────── */}
        <div className="mb-6 mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Then */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Then
            </span>
            <div
              className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold"
              style={{
                backgroundColor: pastColor.light,
                color: pastColor.primary,
              }}
            >
              {pastType.number}
            </div>
            <p className="font-semibold text-white">{pastType.name}</p>
            <p className="text-xs text-slate-400">
              The {pastType.headline}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {pastResult.confidence >= 0.15 ? "Confident" : "Mixed"}
            </p>
          </div>

          {/* VS */}
          <div className="text-lg font-bold text-slate-600">vs</div>

          {/* Now */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Now
            </span>
            <div
              className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold"
              style={{
                backgroundColor: currentColor.light,
                color: currentColor.primary,
              }}
            >
              {currentType.number}
            </div>
            <p className="font-semibold text-white">
              {currentType.name}
            </p>
            <p className="text-xs text-slate-400">
              The {currentType.headline}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {currentResult.confidence >= 0.15
                ? "Confident"
                : "Mixed"}
            </p>
          </div>
        </div>

        {/* ── Shift message ────────────────────────────── */}
        <div className="mb-6 text-center text-sm text-slate-300">
          {isSameType ? (
            <span>✨ Your type hasn&apos;t changed</span>
          ) : (
            <span>
              📈 You shifted from{" "}
              <span style={{ color: pastColor.primary }}>
                {pastType.name}
              </span>{" "}
              to{" "}
              <span style={{ color: currentColor.primary }}>
                {currentType.name}
              </span>
            </span>
          )}
        </div>

        {/* ── Score comparison bars ────────────────────── */}
        <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Score Comparison
        </h4>

        <div className="space-y-4">
          {comparisonBars.map((bar) => (
            <div key={bar.typeId}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">
                  {bar.number}. {bar.name}
                </span>
                <span className="text-slate-500">
                  {bar.pastScore}% vs {bar.currentScore}%
                </span>
              </div>
              <div className="space-y-1">
                {/* Past bar — lighter, top */}
                <div
                  className="h-1.5 rounded-full opacity-50"
                  style={{
                    width: `${(bar.pastScore / maxBarScore) * 100}%`,
                    backgroundColor: pastColor.primary,
                  }}
                />
                {/* Current bar — solid, bottom */}
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${(bar.currentScore / maxBarScore) * 100}%`,
                    backgroundColor: currentColor.primary,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── ProfileDashboard Component ────────────────────────

/**
 * A rich, scrollable personal profile dashboard presenting the user's
 * Enneagram type across six sections:
 *
 * 1. **Character Hero** — animated geometric character + hero number + archetype
 * 2. **Enneagram Compass** — interactive board with the user's type highlighted
 * 3. **Type Strength Breakdown** — animated trait meters for all 9 types
 * 4. **Core Dynamics** — 2×2 grid of fear, desire, weakness, virtue
 * 5. **Growth Path** — integration and disintegration directions
 * 6. **Share + Actions** — share card, social sharing, retake & clear
 *
 * Each section uses a scroll-reveal fade-up animation via `whileInView`.
 *
 * @example
 * ```tsx
 * <ProfileDashboard result={quizResult} onReset={handleReset} />
 * ```
 */
export default function ProfileDashboard({
  result,
  onReset,
}: ProfileDashboardProps): JSX.Element {
  /* ── Derive rich type data from the scoring result ──────────── */
  const typeFull = useMemo(
    () => getTypeFull(result.primary.typeId),
    [result.primary.typeId],
  );
  const typeColor = useMemo(
    () => getTypeColor(result.primary.typeId),
    [result.primary.typeId],
  );
  const typeNum = TYPE_NUMBERS[result.primary.typeId] ?? 0;
  const visuals = useMemo(
    () => getTypeVisuals(result.primary.typeId),
    [result.primary.typeId],
  );

  /* ── Growth path targets ───────────────────────────────────── */
  const integTarget: EnneagramTypeId =
    result.integrationPath ?? integrationMap[result.primary.typeId];
  const disintegTarget: EnneagramTypeId =
    result.disintegrationPath ?? disintegrationMap[result.primary.typeId];

  /* ── Integration / disintegration type data for section 5 ──── */
  const integType = useMemo(
    () => enneagramTypesFull.find((t) => t.id === integTarget),
    [integTarget],
  );
  const disintegType = useMemo(
    () => enneagramTypesFull.find((t) => t.id === disintegTarget),
    [disintegTarget],
  );

  /* ── Confirmation dialog state ─────────────────────────────── */
  const [showConfirm, setShowConfirm] = useState(false);

  /* ── Past results state ─────────────────────────────────────── */
  const [history] = useState<QuizResult[]>(() => loadHistory());
  const [compareResult, setCompareResult] = useState<QuizResult | null>(null);

  /* ── Fail-fast guard ────────────────────────────────────────── */
  if (!typeFull || !typeColor || !visuals) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-400">
          Unable to load your profile. Please try again.
        </p>
      </div>
    );
  }

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6">
      {/* ────────────────────────────────────────────────────────── */}
      {/* SECTION 1: Character Hero                                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <ProfileSection className="relative overflow-hidden">
        {/* Type-coloured background gradient wash */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          aria-hidden="true"
          style={{ background: visuals.moods.vibrant }}
        />

        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* Animated geometric character */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springTransition, delay: 0.1 }}
            className="shrink-0"
          >
            <TypeCharacter
              typeId={result.primary.typeId}
              size={180}
              animation="idle"
            />
          </motion.div>

          {/* Text content */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            {/* Hero number — huge, translucent */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.2 }}
              className="text-number text-hero-number leading-none select-none"
              style={{ color: `${typeColor.primary}30` }}
              aria-hidden="true"
            >
              {typeNum}
            </motion.span>

            {/* Type name */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.3 }}
              className="-mt-2 text-2xl font-bold text-white sm:text-3xl"
            >
              {typeFull.name}
            </motion.h1>

            {/* Headline — coloured accent */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.4 }}
              className="mt-1 text-lg font-medium"
              style={{ color: typeColor.primary }}
            >
              {typeFull.headline}
            </motion.p>

            {/* Cosmic archetype tag */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.45 }}
              className="mt-2 inline-block rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/60"
              style={{ backgroundColor: `${typeColor.primary}20` }}
            >
              ✦ {typeFull.archetype}
            </motion.span>

            {/* Wounding message — italic quote */}
            <motion.blockquote
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.5 }}
              className="mt-4 max-w-sm text-sm italic leading-relaxed text-slate-400"
            >
              &ldquo;{typeFull.woundingMessage}&rdquo;
            </motion.blockquote>
          </div>
        </div>
      </ProfileSection>

      {/* ────────────────────────────────────────────────────────── */}
      {/* SECTION 2: Your Enneagram Compass                         */}
      {/* ────────────────────────────────────────────────────────── */}
      <ProfileSection>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* Compact interactive Enneagram board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={springTransition}
            className="w-56 shrink-0"
          >
            <EnneagramBoard
              selectedType={result.primary.typeId}
              compact
              mode="explore"
            />
          </motion.div>

          {/* Explanatory text */}
          <div className="flex-1 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Your Enneagram Compass
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              The Enneagram is a 9-pointed symbol that maps nine distinct
              personality patterns and their relationships. Each point
              represents a different way of seeing the world, powered by
              its own core motivation, fear, and gift.
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: typeColor.primary }}
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-slate-300">
                This point represents you —{" "}
                <span style={{ color: typeColor.primary }}>
                  {typeFull.name}
                </span>
              </span>
            </div>
            {result.possibleWing && (
              <p className="text-sm leading-relaxed text-slate-500">
                <span className="font-semibold text-slate-300">
                  Possible wing:
                </span>{" "}
                The adjacent type{" "}
                <strong>
                  {enneagramTypesFull.find((t) => t.id === result.possibleWing)
                    ?.headline ?? result.possibleWing}
                </strong>{" "}
                showed strongly, suggesting it may flavour your core type.
              </p>
            )}
          </div>
        </div>
      </ProfileSection>

      {/* ────────────────────────────────────────────────────────── */}
      {/* SECTION 3: Type Strength Breakdown (Trait Meters)         */}
      {/* ────────────────────────────────────────────────────────── */}
      <ProfileSection>
        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
          Type Strength Breakdown
        </h3>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-3"
        >
          {result.breakdown.map((score, index) => {
            const isPrimary = score.typeId === result.primary.typeId;
            const typeData = enneagramTypesFull.find(
              (t) => t.id === score.typeId,
            );
            return (
              <TraitMeter
                key={score.typeId}
                typeId={score.typeId}
                typeName={typeData?.headline ?? score.typeId}
                typeNumber={TYPE_NUMBERS[score.typeId]}
                score={score.normalizedScore}
                isPrimary={isPrimary}
                color={typeColor.primary}
                delay={index * 0.04}
              />
            );
          })}
        </motion.div>
      </ProfileSection>

      {/* ────────────────────────────────────────────────────────── */}
      {/* SECTION 4: Core Dynamics (2×2 Grid)                       */}
      {/* ────────────────────────────────────────────────────────── */}
      <ProfileSection>
        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
          Core Dynamics
        </h3>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-3 sm:gap-4"
        >
          <CoreDynamicCard
            label="Core Fear"
            value={typeFull.coreFear}
            accentColor={typeColor.primary}
            emoji="🛡️"
          />
          <CoreDynamicCard
            label="Core Desire"
            value={typeFull.coreDesire}
            accentColor={typeColor.primary}
            emoji="💫"
          />
          <CoreDynamicCard
            label="Core Weakness"
            value={typeFull.coreWeakness}
            accentColor={typeColor.primary}
            emoji="⚡"
          />
          <CoreDynamicCard
            label="Virtue"
            value={typeFull.virtue}
            accentColor={typeColor.primary}
            emoji="🌱"
          />
        </motion.div>
      </ProfileSection>

      {/* ────────────────────────────────────────────────────────── */}
      {/* SECTION 5: Growth Path                                    */}
      {/* ────────────────────────────────────────────────────────── */}
      <ProfileSection>
        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
          Growth Path
        </h3>

        {/* Integration direction */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-4 rounded-xl border border-green-500/20 bg-green-500/5 p-5"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg" role="img" aria-hidden="true">
              🌱
            </span>
            <span className="text-sm font-bold text-green-400">
              In Growth → {integType?.headline ?? integTarget}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            {integType?.description?.split("\n\n")[0] ??
              "Moving toward your integration type brings out your highest potential."}
          </p>
        </motion.div>

        {/* Disintegration direction */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-xl border border-red-500/20 bg-red-500/5 p-5"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg" role="img" aria-hidden="true">
              ⚠️
            </span>
            <span className="text-sm font-bold text-red-400">
              Under Stress → {disintegType?.headline ?? disintegTarget}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            {disintegType?.description?.split("\n\n")[0] ??
              "Recognising your stress pattern helps you find your way back to centre."}
          </p>
        </motion.div>

        {/* Full GrowthPath split-card for deep detail */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-6"
        >
          <GrowthPath
            typeId={result.primary.typeId}
            integrationType={integTarget}
            disintegrationType={disintegTarget}
          />
        </motion.div>
      </ProfileSection>

      {/* ────────────────────────────────────────────────────────── */}
      {/* SECTION 6: Past Results / History                         */}
      {/* ────────────────────────────────────────────────────────── */}
      {history.length > 0 && (
        <ProfileSection>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                📜 Your Journey
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Past quiz results
              </p>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {history.map((pastResult, i) => {
              const typeInfo = getTypeFull(pastResult.primary.typeId);
              const histColor = getTypeColor(pastResult.primary.typeId);
              return (
                <motion.button
                  key={i}
                  variants={staggerItem}
                  onClick={() => setCompareResult(pastResult)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:bg-white/[0.07]"
                >
                  {/* Small type number badge */}
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold"
                    style={{
                      backgroundColor: histColor.light,
                      color: histColor.primary,
                    }}
                  >
                    {typeInfo.number}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">
                      {typeInfo.name}{" "}
                      <span className="font-normal text-slate-400">
                        — The {typeInfo.headline}
                      </span>
                    </p>
                    <p className="text-sm text-slate-500">
                      {pastResult.confidence >= 0.15
                        ? "Confident"
                        : "Mixed"}{" "}
                      result
                    </p>
                  </div>

                  <span className="text-lg text-slate-600">→</span>
                </motion.button>
              );
            })}
          </motion.div>
        </ProfileSection>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SECTION 7: Share + Actions                                */}
      {/* ────────────────────────────────────────────────────────── */}
      <ProfileSection>
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

        {/* Action buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          {/* Retake the Quiz */}
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
            Retake the Quiz
          </button>

          {/* Clear My Results */}
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white/40 transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
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
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Clear My Results
          </button>
        </motion.div>
      </ProfileSection>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <div className="pb-12 text-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/20">
          Saturno · Enneagram Discovery
        </span>
      </div>

      {/* ── Confirmation Dialog (rendered at root for overlay) ──── */}
      <ConfirmDialog
        open={showConfirm}
        onConfirm={() => {
          clearResult();
          setShowConfirm(false);
          onReset();
        }}
        onCancel={() => setShowConfirm(false)}
        accentColor={typeColor.primary}
      />

      {/* ── Comparison Overlay (rendered at root for overlay) ──── */}
      <AnimatePresence>
        {compareResult && (
          <ComparisonOverlay
            pastResult={compareResult}
            currentResult={result}
            onClose={() => setCompareResult(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
