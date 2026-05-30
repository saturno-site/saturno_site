// ──────────────────────────────────────────────────────
// Saturno Type Emblem Data
//
// Each Enneagram type gets a 64×64 viewBox emblem icon
// combining:
//   1. The type's ENNEAGRAM_SHAPE (scaled from 100×100)
//   2. A triad-specific frame (hexagon / circle / diamond)
//   3. The type number in the bottom-right quadrant
// ──────────────────────────────────────────────────────

import type { EnneagramTypeId, TriadType } from "@/data/enneagram-system";

// ── Types ─────────────────────────────────────────────

/**
 * Which frame shape encloses a given triad's emblems.
 *
 * - **hexagon** → Body triad (types 8, 9, 1) — instinct, gut, grounded
 * - **circle**  → Heart triad (types 2, 3, 4) — emotion, feeling, connection
 * - **diamond** → Head triad (types 5, 6, 7) — intellect, thought, analysis
 */
export type TriadFrame = "hexagon" | "circle" | "diamond";

/**
 * Complete definition for a single Enneagram type emblem.
 */
export interface TypeEmblem {
  /** Canonical type identifier. */
  id: EnneagramTypeId;
  /** Numeric label (1–9). */
  number: number;
  /**
   * Scaled SVG path string (64×64 viewBox) derived from
   * `ENNEAGRAM_SHAPES` in `lib/useFlubber.ts`.
   */
  shape: string;
  /** Frame shape determined by the type's triad. */
  frame: TriadFrame;
  /**
   * Position of the type‑number label in SVG user units
   * (should sit in the bottom‑right quadrant of the 64×64 viewBox).
   */
  numberPosition: { x: number; y: number };
}

// ── Frame Paths (64×64 viewBox) ───────────────────────

/**
 * SVG path for a regular hexagon centred at (32, 32) with
 * a radius of 28 (pointy‑top orientation).
 *
 * Used by the **Body / Gut triad** (types 8, 9, 1).
 */
export const HEXAGON_FRAME_PATH =
  "M 32,4 L 56,18 L 56,46 L 32,60 L 8,46 L 8,18 Z";

/**
 * SVG path for a circle centred at (32, 32) with radius 28.
 *
 * Used by the **Heart / Feeling triad** (types 2, 3, 4).
 */
export const CIRCLE_FRAME_PATH =
  "M 32,4 A 28,28 0 1,1 32,60 A 28,28 0 1,1 32,4 Z";

/**
 * SVG path for a diamond (rhombus) centred at (32, 32) with
 * vertices 28 units from centre on each axis.
 *
 * Used by the **Head / Thinking triad** (types 5, 6, 7).
 */
export const DIAMOND_FRAME_PATH =
  "M 32,4 L 60,32 L 32,60 L 4,32 Z";

// ── Triad → Frame mapping ────────────────────────────

/**
 * Map a type ID to its corresponding triad frame shape.
 *
 * @param typeId - The Enneagram type identifier.
 * @returns The triad frame shape key.
 *
 * @example
 * ```ts
 * getTriadFrame("one"); // "hexagon"
 * getTriadFrame("two"); // "circle"
 * ```
 */
export function getTriadFrame(typeId: EnneagramTypeId): TriadFrame {
  const triad = getTriadForType(typeId);
  return TRIAD_FRAME_MAP[triad];
}

/**
 * Internal helper that returns a type's triad group.
 */
function getTriadForType(typeId: EnneagramTypeId): TriadType {
  switch (typeId) {
    case "one":
    case "eight":
    case "nine":
      return "body";
    case "two":
    case "three":
    case "four":
      return "heart";
    case "five":
    case "six":
    case "seven":
      return "head";
  }
}

const TRIAD_FRAME_MAP: Record<TriadType, TriadFrame> = {
  body: "hexagon",
  heart: "circle",
  head: "diamond",
};

/**
 * Resolve the SVG path string for a given triad frame.
 */
export function getFramePath(frame: TriadFrame): string {
  switch (frame) {
    case "hexagon":
      return HEXAGON_FRAME_PATH;
    case "circle":
      return CIRCLE_FRAME_PATH;
    case "diamond":
      return DIAMOND_FRAME_PATH;
  }
}

// ── Scaled Shapes (64×64 viewBox) ─────────────────────
//
// These are the ENNEAGRAM_SHAPES from lib/useFlubber.ts
// (originally in a 100×100 viewBox) scaled by factor 0.64
// so they fit cleanly inside the 64×64 emblem canvas.

const SHAPES_64: Record<EnneagramTypeId, string> = {
  one: "M 12.8,12.8 L 32.0,12.8 L 51.2,12.8 L 51.2,32.0 L 51.2,51.2 L 32.0,51.2 L 12.8,51.2 L 12.8,32.0 Z",
  two: "M 32.0,48.0 L 12.8,28.8 L 9.6,16.0 L 19.2,9.6 L 32.0,22.4 L 44.8,9.6 L 54.4,16.0 L 51.2,28.8 Z",
  three:
    "M 32.0,6.4 L 39.7,21.1 L 48.6,36.5 L 57.6,51.2 L 40.3,51.2 L 23.7,51.2 L 6.4,51.2 L 24.3,21.1 Z",
  four:
    "M 32.0,32.0 L 44.8,32.0 L 48.0,44.8 L 32.0,51.2 L 16.0,44.8 L 12.8,28.8 L 22.4,16.0 L 38.4,12.8 Z",
  five:
    "M 32.0,9.6 L 51.2,21.1 L 51.2,32.0 L 51.2,43.5 L 32.0,54.4 L 12.8,43.5 L 12.8,32.0 L 12.8,21.1 Z",
  six: "M 9.6,16.0 L 32.0,12.8 L 54.4,16.0 L 54.4,32.0 L 44.8,44.8 L 32.0,54.4 L 19.2,44.8 L 9.6,32.0 Z",
  seven:
    "M 32.0,3.2 L 44.8,19.2 L 60.8,32.0 L 44.8,44.8 L 32.0,60.8 L 19.2,44.8 L 3.2,32.0 L 19.2,19.2 Z",
  eight:
    "M 32.0,6.4 L 44.8,19.2 L 57.6,32.0 L 44.8,44.8 L 32.0,57.6 L 19.2,44.8 L 6.4,32.0 L 19.2,19.2 Z",
  nine:
    "M 32.0,6.4 L 49.9,14.1 L 57.6,32.0 L 49.9,49.9 L 32.0,57.6 L 14.1,49.9 L 6.4,32.0 L 14.1,14.1 Z",
};

// ── Emblem Registry ──────────────────────────────────

/**
 * Number label positions (bottom‑right quadrant of 64×64 viewBox).
 * Varied slightly per type for visual rhythm while staying in
 * the ~(44–52, 44–52) zone.
 */
const NUMBER_POSITIONS: Record<EnneagramTypeId, { x: number; y: number }> = {
  one: { x: 48, y: 52 },
  two: { x: 48, y: 50 },
  three: { x: 50, y: 52 },
  four: { x: 46, y: 52 },
  five: { x: 48, y: 50 },
  six: { x: 50, y: 52 },
  seven: { x: 48, y: 52 },
  eight: { x: 50, y: 50 },
  nine: { x: 48, y: 52 },
};

/** Ordering of types for iteration. */
const TYPE_IDS: EnneagramTypeId[] = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

/** Numeric values keyed by type ID. */
const NUMBERS: Record<EnneagramTypeId, number> = {
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

/**
 * Complete registry of all 9 Enneagram type emblems.
 *
 * Each entry contains the scaled shape SVG path, the triad frame
 * type, and the number position — everything needed to render a
 * standalone 64×64 emblem.
 *
 * @example
 * ```ts
 * TYPE_EMBLEMS.one.shape;   // scaled SVG path string
 * TYPE_EMBLEMS.one.frame;   // "hexagon"
 * ```
 */
export const TYPE_EMBLEMS: Record<EnneagramTypeId, TypeEmblem> =
  Object.fromEntries(
    TYPE_IDS.map((id) => [
      id,
      {
        id,
        number: NUMBERS[id],
        shape: SHAPES_64[id],
        frame: getTriadFrame(id),
        numberPosition: NUMBER_POSITIONS[id],
      } satisfies TypeEmblem,
    ]),
  ) as Record<EnneagramTypeId, TypeEmblem>;

// ── SVG Builder ──────────────────────────────────────

/**
 * Build a complete SVG markup string for a type emblem.
 *
 * Useful for:
 * - Inline `<img src="data:image/svg+xml;utf8,..." />` usage
 * - Download / export scenarios
 * - Server‑side rendering where Framer Motion is unavailable
 *
 * @param emblem - The emblem definition (from `TYPE_EMBLEMS`).
 * @param color  - Primary hex colour for the emblem (e.g. `"#E8A838"`).
 * @returns A self‑contained SVG string with viewBox `"0 0 64 64"`.
 *
 * @example
 * ```tsx
 * const svg = getEmblemSvg(TYPE_EMBLEMS.two, "#E8535A");
 * // → "<svg xmlns=... viewBox='0 0 64 64'>..."
 * ```
 */
export function getEmblemSvg(emblem: TypeEmblem, color: string): string {
  const framePath = getFramePath(emblem.frame);
  const { x: nx, y: ny } = emblem.numberPosition;

  // Use inline presentation attributes rather than CSS classes so the
  // SVG string is safe to use in `<img src="data:image/svg+xml,...">`
  // across all browsers and embedding contexts.
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">`,
    `  <path d="${framePath}" fill="${color}" fill-opacity="0.3" stroke="${color}" stroke-width="1.5" stroke-opacity="0.5" />`,
    `  <path d="${emblem.shape}" fill="${color}" fill-opacity="0.8" />`,
    `  <text x="${nx}" y="${ny}" fill="${color}" font-family="system-ui,sans-serif" font-size="14" font-weight="700" text-anchor="middle" dominant-baseline="central">${emblem.number}</text>`,
    `</svg>`,
  ].join("\n");
}
