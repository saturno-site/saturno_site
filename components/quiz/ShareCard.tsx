"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  staggerContainer,
  staggerItem,
  scaleIn,
  springTransition,
} from "@/lib/animations";
import type { EnneagramTypeId } from "@/data/enneagram-system";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/**
 * The pre-formatted share text template.
 * `{typeName}` and `{headline}` are interpolated at runtime.
 */
const SHARE_TEMPLATE =
  "I discovered my Enneagram type: {typeName} — The {headline}! ✨ Find your cosmic archetype at Saturno";

/** Duration in ms for the auto-dismiss copy-feedback tooltip. */
const COPY_FEEDBACK_DURATION = 2000;

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ShareCardProps {
  /** The user's Enneagram type id. */
  typeId: EnneagramTypeId;
  /** Display name, e.g. "Type One". */
  typeName: string;
  /** Headline, e.g. "The Reformer". */
  headline: string;
  /** Cosmic archetype title, e.g. "The Architect". */
  archetype?: string;
  /** A short summary of the type. */
  summary: string;
  /** Colour palette for the type. */
  colors: { primary: string; light: string; dark: string; gradient: string };
}

/* ------------------------------------------------------------------ */
/*  Enneagram Compass Decorative Shape                                 */
/* ------------------------------------------------------------------ */

/**
 * A faint decorative Enneagram compass / enneagram-symbol outline
 * rendered as an SVG overlay in the background of the card.
 */
function EnneagramCompass({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="pointer-events-none absolute right-[-10%] top-[-10%] h-[140%] w-[140%] select-none opacity-[0.06]"
      aria-hidden="true"
    >
      {/* Outer circle */}
      <circle cx="100" cy="100" r="80" fill="none" stroke={color} strokeWidth="1" />
      {/* Inner circle */}
      <circle cx="100" cy="100" r="50" fill="none" stroke={color} strokeWidth="0.5" />
      {/* Center dot */}
      <circle cx="100" cy="100" r="4" fill={color} />
      {/* Three triad lines */}
      <line x1="100" y1="20" x2="100" y2="180" stroke={color} strokeWidth="0.4" />
      <line
        x1="20"
        y1="100"
        x2="180"
        y2="100"
        stroke={color}
        strokeWidth="0.4"
      />
      <line
        x1="43.4"
        y1="43.4"
        x2="156.6"
        y2="156.6"
        stroke={color}
        strokeWidth="0.4"
      />
      <line
        x1="156.6"
        y1="43.4"
        x2="43.4"
        y2="156.6"
        stroke={color}
        strokeWidth="0.4"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Decorative Pattern Overlay                                         */
/* ------------------------------------------------------------------ */

/**
 * A subtle geometric dot-grid pattern overlaid on the card background
 * to add texture and depth.
 */
function PatternOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 select-none opacity-[0.03]"
      aria-hidden="true"
      style={{
        backgroundImage:
          "radial-gradient(circle, white 0.5px, transparent 0.5px)",
        backgroundSize: "20px 20px",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  ShareCard Component                                                */
/* ------------------------------------------------------------------ */

/**
 * A visually rich, shareable card that displays an Enneagram type
 * result in a square-ish, premium layout.  Designed to be captured as
 * an image (via html-to-image or similar) or shown inline.
 *
 * The card renders with the type's gradient background, a prominent
 * type number badge, the type name and headline, cosmic archetype,
 * summary text, and Saturno branding.  Elements stagger in with a
 * slight rotation bounce on mount.
 *
 * @example
 * ```tsx
 * <ShareCard
 *   typeId="four"
 *   typeName="Type Four"
 *   headline="The Individualist"
 *   archetype="The Poet"
 *   summary="You feel the world in vivid colour..."
 *   colors={typeColors.four}
 * />
 * ```
 */
export default function ShareCard({
  typeId,
  typeName,
  headline,
  archetype,
  summary,
  colors,
}: ShareCardProps) {
  /* ── Guard: missing gradient → nothing to render ──────── */
  if (!colors?.gradient) {
    return null;
  }

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="relative mx-auto w-full max-w-[400px] overflow-hidden rounded-2xl shadow-2xl"
      style={{ aspectRatio: "4 / 5" }}
    >
      {/* ── Background layer ──────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{ background: colors.gradient }}
      />

      {/* ── Decorative overlays ───────────────────────────── */}
      <EnneagramCompass color={colors.light} />
      <PatternOverlay />

      {/* ── Content layer ─────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative flex h-full flex-col justify-between p-8 text-white"
      >
        {/* Top section */}
        <div>
          {/* ── Type Number Badge ────────────────────────── */}
          <motion.div
            variants={staggerItem}
            className="mb-6 flex items-center justify-center"
          >
            <span
              className="flex h-20 w-20 items-center justify-center rounded-full text-4xl font-black tracking-tight shadow-lg"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(4px)",
                color: colors.light,
              }}
              aria-label={`Type ${typeNumberLabel(typeId)}`}
            >
              {typeNumberLabel(typeId)}
            </span>
          </motion.div>

          {/* ── Type Name ────────────────────────────────── */}
          <motion.h2
            variants={staggerItem}
            className="mb-1 text-center text-lg font-semibold uppercase tracking-widest opacity-80"
          >
            {typeName}
          </motion.h2>

          {/* ── Headline ─────────────────────────────────── */}
          <motion.h1
            variants={staggerItem}
            className="mb-2 text-center text-3xl font-bold leading-tight"
          >
            {headline}
          </motion.h1>

          {/* ── Archetype tag ────────────────────────────── */}
          {archetype && (
            <motion.div
              variants={staggerItem}
              className="mb-6 text-center"
            >
              <span
                className="inline-block rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-widest"
                style={{
                  backgroundColor: colors.primary,
                  color: "#fff",
                }}
              >
                {archetype}
              </span>
            </motion.div>
          )}
        </div>

        {/* Bottom section */}
        <div>
          {/* ── Summary ──────────────────────────────────── */}
          <motion.p
            variants={staggerItem}
            className="mb-8 text-center text-sm leading-relaxed opacity-90"
          >
            {summary}
          </motion.p>

          {/* ── Saturno Branding ─────────────────────────── */}
          <motion.div
            variants={staggerItem}
            className="border-t border-white/20 pt-4 text-center"
          >
            <span className="text-xs font-medium uppercase tracking-[0.25em] opacity-60">
              Saturno
            </span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  ShareActions Component                                             */
/* ------------------------------------------------------------------ */

interface ShareActionsProps {
  /** The user's Enneagram type name (e.g. "Type Four"). */
  typeName: string;
  /** The headline (e.g. "The Individualist"). */
  headline: string;
}

/**
 * A row of share action buttons for the Enneagram result card.
 *
 * Includes:
 * - **Copy Link** — copies a pre-formatted share text to the clipboard.
 * - **Twitter / X** — opens `twitter.com/intent/tweet` with the share text.
 * - **WhatsApp** — opens `wa.me` with the share text.
 *
 * Each button is an icon-only button with a hover tooltip.
 *
 * @example
 * ```tsx
 * <ShareActions typeName="Type Four" headline="The Individualist" />
 * ```
 */
export function ShareActions({ typeName, headline }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = SHARE_TEMPLATE.replace("{typeName}", typeName)
    .replace("{headline}", headline);

  const encodedShareText = encodeURIComponent(shareText);

  /**
   * Copies the share text to the clipboard and shows a brief "Copied!"
   * tooltip before resetting.
   */
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION);
    } catch {
      /* Clipboard API unavailable — silently fail. */
    }
  }, [shareText]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-center gap-3"
    >
      {/* ── Copy Link ──────────────────────────────────────── */}
      <motion.div variants={staggerItem} className="relative">
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy share text to clipboard"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>

        {/* ── "Copied!" tooltip ──────────────────────────── */}
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={springTransition}
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-0.5 text-xs font-medium text-slate-900 shadow"
          >
            Copied!
          </motion.span>
        )}
      </motion.div>

      {/* ── Twitter / X ────────────────────────────────────── */}
      <motion.div variants={staggerItem}>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedShareText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X (Twitter)"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </motion.div>

      {/* ── WhatsApp ───────────────────────────────────────── */}
      <motion.div variants={staggerItem}>
        <a
          href={`https://wa.me/?text=${encodedShareText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Returns the numeric label for a given EnneagramTypeId.
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
