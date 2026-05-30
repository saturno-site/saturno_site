"use client";

// ──────────────────────────────────────────────────────
// TypeCharacter — Animated low-poly geometric character
// for an Enneagram type.
//
// Renders the character as an SVG composed of faceted
// polygon groups (head, body, arms, legs, accessories)
// with configurable animation presets.
// ──────────────────────────────────────────────────────

import { type JSX, useMemo } from "react";
import { motion } from "framer-motion";
import { CHARACTERS, type CharacterPolygon } from "./characterData";
import type { EnneagramTypeId } from "@/data/enneagram-system";

// ── Props ─────────────────────────────────────────────

export interface TypeCharacterProps {
  /** The Enneagram type to render. */
  typeId: EnneagramTypeId;
  /** Width and height in CSS pixels (default: 200). */
  size?: number;
  /**
   * Animation preset:
   * - `"enter"` — staggered entrance from opacity 0, scale 0.8
   * - `"idle"` — gentle breathing scale loop (1 ↔ 1.02, 4s)
   * - `"hover"` — sway on mouse enter (rotate 0→2→-2→0, 2s)
   * - `"none"` — fully static render
   *
   * @default "idle"
   */
  animation?: "idle" | "hover" | "enter" | "none";
  /** Optional CSS classes forwarded to the root wrapper. */
  className?: string;
}

// ── Color resolver ────────────────────────────────────

type FillKey = CharacterPolygon["fill"];
type ColorMap = Record<FillKey, string>;

/**
 * Maps a polygon's `fill` key to its resolved hex colour from the
 * character's palette.  Throws on unrecognised keys (fail-fast).
 */
function resolveColor(key: FillKey, colors: ColorMap): string {
  const hex = colors[key];
  if (!hex) {
    throw new Error(
      `TypeCharacter: Unknown colour key "${key}". ` +
        `Expected one of: primary, light, dark, mid, accent.`,
    );
  }
  return hex;
}

// ── Entrance stagger variants ────────────────────────

const groupVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  }),
};

// ── Polygon group renderer ────────────────────────────

/**
 * Renders an array of polygons as `<polygon>` elements.
 * Static by design — animation is applied at the group or container level.
 */
function StaticPolygonGroup({
  polygons,
  colors,
}: {
  polygons: CharacterPolygon[];
  colors: ColorMap;
}): JSX.Element {
  return (
    <>
      {polygons.map((poly, idx) => (
        <polygon
          key={idx}
          points={poly.points}
          fill={resolveColor(poly.fill, colors)}
          opacity={poly.opacity ?? 1}
        />
      ))}
    </>
  );
}

// ── SVG content (shared across all animation modes) ──

/**
 * Builds the ordered polygon groups so they can be rendered or mapped
 * into motion wrappers.
 */
function usePolygonGroups(charId: EnneagramTypeId) {
  return useMemo(() => {
    const charData = CHARACTERS[charId];
    if (!charData) return [];

    const groups: { label: string; polygons: CharacterPolygon[] }[] = [
      { label: "head", polygons: charData.pose.head },
      { label: "body", polygons: charData.pose.body },
      { label: "arms", polygons: charData.pose.arms },
      { label: "legs", polygons: charData.pose.legs },
    ];

    if (charData.pose.accessories && charData.pose.accessories.length > 0) {
      groups.push({
        label: "accessories",
        polygons: charData.pose.accessories,
      });
    }

    return groups;
  }, [charId]);
}

// ── Component ─────────────────────────────────────────

/**
 * A geometric low-poly character for an Enneagram type, rendered as
 * an SVG composed of faceted polygon groups.
 *
 * Each character is built from 9–15 polygons arranged into head, body,
 * arms, legs, and optional accessories.  Colours are resolved from the
 * type's colour palette.
 *
 * Animation presets control entrance, idle breathing, hover sway, or
 * a fully static render.
 *
 * @example
 * ```tsx
 * <TypeCharacter typeId="four" size={180} animation="idle" />
 * <TypeCharacter typeId="one" animation="enter" className="mx-auto" />
 * ```
 */
export default function TypeCharacter({
  typeId,
  size = 200,
  animation = "idle",
  className = "",
}: TypeCharacterProps): JSX.Element {
  /* ── Fail-fast: validate the typeId exists in our data ──────────── */
  const charData = CHARACTERS[typeId];
  if (!charData) {
    throw new Error(
      `TypeCharacter: Unknown Enneagram type "${typeId}". ` +
        "Expected one of: one, two, three, four, five, six, seven, eight, nine.",
    );
  }

  /* ── Resolve colour map once ───────────────────────────────────── */
  const colors: ColorMap = useMemo(
    () => ({
      primary: charData.colors.primary,
      light: charData.colors.light,
      dark: charData.colors.dark,
      mid: charData.colors.mid,
      accent: charData.colors.accent,
    }),
    [charData],
  );

  const groups = usePolygonGroups(typeId);

  /* ── SVG element (shared across modes) ─────────────────────────── */
  const svg = (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      style={{ overflow: "visible", display: "block" }}
      aria-hidden="true"
    >
      {/* ── Enter animation: staggered motion.g ─────────────── */}
      {animation === "enter"
        ? groups.map((group, gi) => (
            <motion.g
              key={group.label}
              custom={gi}
              variants={groupVariants}
              initial="hidden"
              animate="visible"
            >
              <StaticPolygonGroup polygons={group.polygons} colors={colors} />
            </motion.g>
          ))
        : /* ── All other modes: static groups ──────────────── */
          groups.map((group) => (
            <g key={group.label}>
              <StaticPolygonGroup polygons={group.polygons} colors={colors} />
            </g>
          ))}
    </svg>
  );

  /* ── Wrap in animation container matching the preset ──────────── */

  /* "none" — plain div, no animation overhead */
  if (animation === "none") {
    return (
      <div
        className={className}
        style={{ width: size, height: size, lineHeight: 0 }}
        role="img"
        aria-label={`${charData.name} (Type ${charData.number}) — ${charData.style.vibe}`}
      >
        {svg}
      </div>
    );
  }

  /* "enter" — already handled inside the SVG via motion.g */
  if (animation === "enter") {
    return (
      <div
        className={className}
        style={{ width: size, height: size, lineHeight: 0 }}
        role="img"
        aria-label={`${charData.name} (Type ${charData.number}) — ${charData.style.vibe}`}
      >
        {svg}
      </div>
    );
  }

  /* "idle" — gentle breathing scale oscillation */
  if (animation === "idle") {
    return (
      <motion.div
        className={className}
        style={{ width: size, height: size, lineHeight: 0, transformOrigin: "center center" }}
        role="img"
        aria-label={`${charData.name} (Type ${charData.number}) — ${charData.style.vibe}`}
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {svg}
      </motion.div>
    );
  }

  /* "hover" — sway on mouse enter */
  return (
    <motion.div
      className={className}
      style={{ width: size, height: size, lineHeight: 0, transformOrigin: "center center" }}
      role="img"
      aria-label={`${charData.name} (Type ${charData.number}) — ${charData.style.vibe}`}
      whileHover={{
        rotate: [0, 2, -2, 0],
        transition: { duration: 2, ease: "easeInOut", repeat: Infinity },
      }}
    >
      {svg}
    </motion.div>
  );
}
