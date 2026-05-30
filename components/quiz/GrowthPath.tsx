"use client";

import { motion } from "framer-motion";
import { fadeUp, springTransition } from "@/lib/animations";
import { enneagramTypes, typeColors } from "@/data/enneagram-system";
import type { EnneagramTypeId } from "@/data/enneagram-system";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface GrowthPathProps {
  /** The user's core Enneagram type id. */
  typeId: EnneagramTypeId;
  /** The integration (growth) type id this type moves toward. */
  integrationType: EnneagramTypeId;
  /** The disintegration (stress) type id this type slips toward. */
  disintegrationType: EnneagramTypeId;
}

/* ------------------------------------------------------------------ */
/*  Direction Arrow SVG                                                */
/* ------------------------------------------------------------------ */

/** A thin animated arrow pointing to the right, drawn with an SVG path. */
function DirectionArrow({ color }: { color: string }) {
  return (
    <motion.svg
      width="36"
      height="20"
      viewBox="0 0 36 20"
      fill="none"
      aria-hidden="true"
      initial={{ x: -6, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ...springTransition, delay: 0.25 }}
    >
      <motion.path
        d="M2 10H30M24 4L32 10L24 16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.35 }}
      />
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Type Badge                                                         */
/* ------------------------------------------------------------------ */

interface TypeBadgeProps {
  typeId: EnneagramTypeId;
  color: string;
  side: "left" | "right";
}

/** Displays the source or destination type id with a coloured dot and name. */
function TypeBadge({ typeId, color, side }: TypeBadgeProps) {
  const typeInfo = enneagramTypes.find((t) => t.id === typeId);
  const name = typeInfo?.name ?? typeId;
  const headline = typeInfo?.headline ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...springTransition, delay: 0.15 }}
      className="flex flex-col gap-0.5"
    >
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
        {name}
      </span>
      <span className="text-sm font-medium text-slate-300">{headline}</span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Descriptive Lookup Maps                                            */
/* ------------------------------------------------------------------ */

/**
 * Describes how each Enneagram type grows when healthy — what positive
 * qualities they adopt from their integration type.
 * Keyed by the **source** type id.
 */
const integrationDescriptions: Record<EnneagramTypeId, string> = {
  one: "In growth, you loosen the inner critic and embrace spontaneity, joy, and the freedom to explore — like a healthy Seven.",
  two: "In growth, you reconnect with your own emotional reality, learning that your needs matter too — like a healthy Four.",
  three: "In growth, you slow down and connect with genuine loyalty and trust, finding safety in authentic relationships — like a healthy Six.",
  four: "In growth, you channel your emotional intensity into purposeful action and principled living — like a healthy One.",
  five: "In growth, you step into your personal power and lead with conviction, trusting your instincts in the material world — like a healthy Eight.",
  six: "In growth, you surrender to the present moment and find a deep, unshakable inner peace — like a healthy Nine.",
  seven: "In growth, you deepen your focus and find satisfaction in mastery and inner richness rather than external stimulation — like a healthy Five.",
  eight: "In growth, you open your heart and lead with warmth, generosity, and genuine connection — like a healthy Two.",
  nine: "In growth, you step into your ambition and own your voice, confidently pursuing what matters to you — like a healthy Three.",
};

/**
 * Describes how each Enneagram type behaves under stress — what
 * unhealthy patterns they slip into from their disintegration type.
 * Keyed by the **source** type id.
 */
const disintegrationDescriptions: Record<EnneagramTypeId, string> = {
  one: "Under stress, you may become overly critical, perfectionistic, and emotionally volatile — slipping into the reactive patterns of an unhealthy Four.",
  two: "Under stress, you may become aggressive, demanding, and controlling — taking on the domineering energy of an unhealthy Eight.",
  three: "Under stress, you may disengage, become passive-aggressive, and neglect your goals — withdrawing like an unhealthy Nine.",
  four: "Under stress, you may become overly needy, clinging, and preoccupied with others' approval — acting out the dependency of an unhealthy Two.",
  five: "Under stress, you may scatter your energy, overindulge, and avoid deep engagement — falling into the hectic patterns of an unhealthy Seven.",
  six: "Under stress, you may overwork, compete relentlessly, and lose touch with your own feelings — chasing achievement like an unhealthy Three.",
  seven: "Under stress, you may become rigid, judgmental, and hyper-critical — turning the enthusiasm against yourself like an unhealthy One.",
  eight: "Under stress, you may withdraw, overanalyse, and isolate yourself from connection — retreating like an unhealthy Five.",
  nine: "Under stress, you may become anxious, reactive, and catastrophising — spinning into the fearful vigilance of an unhealthy Six.",
};

/* ------------------------------------------------------------------ */
/*  Section Panel (Growth or Stress)                                   */
/* ------------------------------------------------------------------ */

interface PathPanelProps {
  title: string;
  emoji: string;
  sourceId: EnneagramTypeId;
  destId: EnneagramTypeId;
  sourceColor: string;
  destColor: string;
  description: string;
  side: "left" | "right";
}

/**
 * One half of the split card: shows the source type, an arrow, the
 * destination type, and a brief description of the dynamic.
 */
function PathPanel({
  title,
  emoji,
  sourceId,
  destId,
  sourceColor,
  destColor,
  description,
  side,
}: PathPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...springTransition, delay: 0.1 }}
      className="flex flex-1 flex-col gap-4 p-5"
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <span className="text-lg" role="img" aria-hidden="true">
          {emoji}
        </span>
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">
          {title}
        </h3>
      </div>

      {/* ── Type pathway ───────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{ backgroundColor: sourceColor }}
        >
          {sourceId === "one"
            ? "1"
            : sourceId === "two"
              ? "2"
              : sourceId === "three"
                ? "3"
                : sourceId === "four"
                  ? "4"
                  : sourceId === "five"
                    ? "5"
                    : sourceId === "six"
                      ? "6"
                      : sourceId === "seven"
                        ? "7"
                        : sourceId === "eight"
                          ? "8"
                          : "9"}
        </span>

        <DirectionArrow color={side === "left" ? destColor : sourceColor} />

        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{ backgroundColor: destColor }}
        >
          {destId === "one"
            ? "1"
            : destId === "two"
              ? "2"
              : destId === "three"
                ? "3"
                : destId === "four"
                  ? "4"
                  : destId === "five"
                    ? "5"
                    : destId === "six"
                      ? "6"
                      : destId === "seven"
                        ? "7"
                        : destId === "eight"
                          ? "8"
                          : "9"}
        </span>
      </div>

      {/* ── Destination type labels ────────────────────────── */}
      <TypeBadge typeId={destId} color={destColor} side={side} />

      {/* ── Description ────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springTransition, delay: 0.35 }}
        className="text-sm leading-relaxed text-slate-400"
      >
        {description}
      </motion.p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Returns a numeric string label for a given Enneagram type id.
 */
function typeNumberLabel(id: EnneagramTypeId): string {
  const map: Record<EnneagramTypeId, string> = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };
  return map[id];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * A split-card visualisation of the user's integration (growth) and
 * disintegration (stress) paths in the Enneagram system.
 *
 * Shows the source type, a directional arrow, and the destination type
 * for both growth and stress, along with a hand-crafted description of
 * each dynamic.  Each half uses its destination type's colour palette
 * for visual accents.
 *
 * @example
 * ```tsx
 * <GrowthPath
 *   typeId="one"
 *   integrationType="seven"
 *   disintegrationType="four"
 * />
 * ```
 */
export default function GrowthPath({
  typeId,
  integrationType,
  disintegrationType,
}: GrowthPathProps) {
  /* ── Guard: validate type colours exist ─────────────────── */
  const srcColor = typeColors[typeId];
  const intColor = typeColors[integrationType];
  const disColor = typeColors[disintegrationType];

  if (!srcColor || !intColor || !disColor) {
    return null;
  }

  const integrationDesc =
    integrationDescriptions[typeId] ?? "Explore how growth moves you forward.";
  const disintegrationDesc =
    disintegrationDescriptions[typeId] ??
    "Notice the patterns that emerge under stress.";

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-soft backdrop-blur-sm"
    >
      <div className="flex flex-col divide-y divide-white/10 sm:flex-row sm:divide-x sm:divide-y-0">
        {/* ── Growth side ──────────────────────────────────── */}
        <PathPanel
          title="In Growth"
          emoji="🌱"
          sourceId={typeId}
          destId={integrationType}
          sourceColor={srcColor.primary}
          destColor={intColor.primary}
          description={integrationDesc}
          side="left"
        />

        {/* ── Stress side ──────────────────────────────────── */}
        <PathPanel
          title="Under Stress"
          emoji="⚡"
          sourceId={typeId}
          destId={disintegrationType}
          sourceColor={srcColor.primary}
          destColor={disColor.primary}
          description={disintegrationDesc}
          side="right"
        />
      </div>

      {/* ── Source type summary bar ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springTransition, delay: 0.5 }}
        className="flex items-center gap-3 border-t border-white/5 bg-white/5 px-5 py-3"
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: srcColor.primary }}
        >
          {typeNumberLabel(typeId)}
        </span>
        <p className="text-xs text-slate-500">
          Your type{" "}
          <span className="font-semibold text-slate-300">
            {enneagramTypes.find((t) => t.id === typeId)?.name ?? typeId}
          </span>{" "}
          —{" "}
          <span className="italic">
            {enneagramTypes.find((t) => t.id === typeId)?.headline ?? ""}
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}
