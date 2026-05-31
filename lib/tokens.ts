// ────────────────────────────────────────────────────────
// Saturno Design Tokens — Single Source of Visual Truth
// ────────────────────────────────────────────────────────
// Centralises every visual constant in the system: mood
// gradients per Enneagram type, shadows, radii, animation
// timing, z-index, and spacing.
//
// Every component imports from here. No magic numbers.
// ────────────────────────────────────────────────────────

import type { EnneagramTypeId } from "@/data/enneagram-system";
import { typeColors } from "@/data/enneagram-system";

// ── Mood Gradients ────────────────────────────────────
// Each Enneagram type gets three mood variants derived
// from its existing colour palette (primary / light / dark).

export interface MoodGradients {
  /** Soft, muted gradient — for backgrounds, cards, subtle regions */
  calm: string;
  /** Bold, saturated gradient — for hero sections, highlights, CTAs */
  vibrant: string;
  /** Dark, rich gradient — for overlays, dramatic areas, deep containers */
  deep: string;
}

/**
 * Pre-computed mood gradients for every Enneagram type.
 *
 * - `calm`    blends light → primary for a soft wash
 * - `vibrant` enhances the existing gradient with a mid-tone stop
 * - `deep`    blends dark → deeper for dramatic depth
 */
export const typeMoodGradients: Record<EnneagramTypeId, MoodGradients> = {
  one: {
    calm: "linear-gradient(135deg, #F5D48A 0%, #E8A838 100%)",
    vibrant: "linear-gradient(135deg, #E8A838 0%, #D49228 50%, #B87D1E 100%)",
    deep: "linear-gradient(135deg, #B87D1E 0%, #8A6010 100%)",
  },
  two: {
    calm: "linear-gradient(135deg, #F29BA0 0%, #E8535A 100%)",
    vibrant: "linear-gradient(135deg, #E8535A 0%, #D74047 50%, #C12E35 100%)",
    deep: "linear-gradient(135deg, #C12E35 0%, #9A1B21 100%)",
  },
  three: {
    calm: "linear-gradient(135deg, #F8D97A 0%, #F4C430 100%)",
    vibrant:
      "linear-gradient(135deg, #F4C430 0%, #DDB122 50%, #C79F12 100%)",
    deep: "linear-gradient(135deg, #C79F12 0%, #A07E0E 100%)",
  },
  four: {
    calm: "linear-gradient(135deg, #B882D4 0%, #7B3F9E 100%)",
    vibrant:
      "linear-gradient(135deg, #7B3F9E 0%, #663584 50%, #542B6E 100%)",
    deep: "linear-gradient(135deg, #542B6E 0%, #3B1B4E 100%)",
  },
  five: {
    calm: "linear-gradient(135deg, #5CC4C4 0%, #1A8A8A 100%)",
    vibrant:
      "linear-gradient(135deg, #1A8A8A 0%, #147373 50%, #0F5C5C 100%)",
    deep: "linear-gradient(135deg, #0F5C5C 0%, #0A3D3D 100%)",
  },
  six: {
    calm: "linear-gradient(135deg, #8EAAFA 0%, #4A6CF7 100%)",
    vibrant:
      "linear-gradient(135deg, #4A6CF7 0%, #3858E0 50%, #2645C7 100%)",
    deep: "linear-gradient(135deg, #2645C7 0%, #1A309E 100%)",
  },
  seven: {
    calm: "linear-gradient(135deg, #5EE0D0 0%, #00B4A0 100%)",
    vibrant:
      "linear-gradient(135deg, #00B4A0 0%, #009C8A 50%, #008573 100%)",
    deep: "linear-gradient(135deg, #008573 0%, #005D4F 100%)",
  },
  eight: {
    calm: "linear-gradient(135deg, #E6687C 0%, #C41E3A 100%)",
    vibrant:
      "linear-gradient(135deg, #C41E3A 0%, #A81830 50%, #8F1428 100%)",
    deep: "linear-gradient(135deg, #8F1428 0%, #6B0D1D 100%)",
  },
  nine: {
    calm: "linear-gradient(135deg, #95C094 0%, #5B8C5A 100%)",
    vibrant:
      "linear-gradient(135deg, #5B8C5A 0%, #4C784B 50%, #3D663C 100%)",
    deep: "linear-gradient(135deg, #3D663C 0%, #2A4C29 100%)",
  },
} as const;

// ── Shadow Presets ─────────────────────────────────────

export interface ShadowSet {
  /** Subtle shadow for cards and low-elevation surfaces */
  sm: string;
  /** Standard shadow for elevated elements (dropdowns, toolbars) */
  md: string;
  /** Large shadow for modals, drawers, and focused overlays */
  lg: string;
  /** Inset shadow for depressed surfaces and depth cues */
  inner: string;
}

/**
 * Platform-neutral box-shadow presets.
 *
 * Glow shadows are handled separately via `glowShadow()` since they
 * require a colour argument at call site.
 */
export const shadows: ShadowSet = {
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
} as const;

const glowSizes: Record<string, string> = {
  sm: "0 0 8px",
  md: "0 0 16px",
  lg: "0 0 32px",
} as const;

/**
 * Returns a coloured `box-shadow` glow string.
 *
 * @param color  Any CSS colour value (hex, rgb, hsl, etc.).
 * @param size   Intensity spread — `"sm"` (8 px), `"md"` (16 px, default), `"lg"` (32 px).
 *
 * @example
 * ```ts
 * glowShadow("#E8A838")         // → "0 0 16px #E8A838"
 * glowShadow("oklch(0.6 0.2 25)", "lg")  // → "0 0 32px oklch(0.6 0.2 25)"
 * ```
 */
export function glowShadow(
  color: string,
  size: "sm" | "md" | "lg" = "md",
): string {
  return `0 0 ${glowSizes[size]} ${color}`;
}

// ── Border Radius Scale ────────────────────────────────

/** Consistent border-radius scale — use these everywhere. */
export const radii: Record<string, string> = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
  full: "9999px",
} as const;

// ── Animation Timing Tokens ────────────────────────────

/** Duration (seconds) for motion — maps to Framer Motion `duration`. */
export const animationTiming = {
  /** Hover states, micro-interactions, toggle flips */
  fast: 0.15,
  /** Standard transitions — colour shifts, element slides */
  normal: 0.3,
  /** Page transitions, content reveals, staggered children */
  slow: 0.6,
  /** Hero sequences, result reveals, climactic entrances */
  dramatic: 1.0,
  /** Spinning wheel, multi-stage reveals, orchestrated sequences */
  epic: 2.0,
} as const;

/** Named cubic-bezier curves for intentional motion design. */
export const easing = {
  /** Bouncy spring — playful entrance, pop-in effects */
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  /** Standard ease — the default for most transitions */
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Slow in, fast out — dramatic reveals, hero animations */
  dramatic: "cubic-bezier(0.22, 1, 0.36, 1)",
  /** Elastic bounce — celebratory motion, confetti triggers */
  bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
} as const;

// ── Type-Specific Visual Helpers ───────────────────────

/**
 * Gather every visual token for one Enneagram type into a single object.
 *
 * Callers never need to import `typeColors` and `typeMoodGradients`
 * separately — this function stitches them together with a type-coloured
 * shadow pre-computed from the primary colour.
 *
 * @throws {Error} If `typeId` is not a valid `EnneagramTypeId` (delegates to
 *                 `typeColors` which acts as the parse boundary).
 */
export function getTypeVisuals(
  typeId: EnneagramTypeId,
): {
  colors: (typeof typeColors)[EnneagramTypeId];
  moods: (typeof typeMoodGradients)[EnneagramTypeId];
  gradient: string;
  shadow: string;
} {
  const colors = typeColors[typeId];
  const moods = typeMoodGradients[typeId];

  return {
    colors,
    moods,
    gradient: colors.gradient,
    shadow: glowShadow(colors.primary, "md"),
  };
}

// ── Z-Index Scale ──────────────────────────────────────

/** Layering system — keeps stacking context predictable. */
export const zScale = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  navbar: 30,
  modal: 40,
  toast: 50,
  tooltip: 60,
} as const;

// ── Spacing Scale ──────────────────────────────────────

/** Consistent spacing units — maps closely to Tailwind v4 spacing. */
export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
  "4xl": "6rem",
} as const;
