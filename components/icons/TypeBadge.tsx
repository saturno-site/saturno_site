// ──────────────────────────────────────────────────────
// TypeBadge — Compact Enneagram Type Pill
//
// A small, colour‑coded badge for displaying an Enneagram
// type in dense contexts such as cards, navigation bars,
// tables, or result summaries.
// ──────────────────────────────────────────────────────

"use client";

import type { EnneagramTypeId } from "@/data/enneagram-system";
import { typeColors, enneagramTypesFull } from "@/data/enneagram-system";

// ── Props ─────────────────────────────────────────────

export interface TypeBadgeProps {
  /** The Enneagram type to display. */
  typeId: EnneagramTypeId;
  /** Size preset (default: `"md"`). */
  size?: "sm" | "md" | "lg";
  /**
   * Visual variant (default: `"filled"`).
   *
   * - `"filled"` — solid type‑colour background, white text
   * - `"outline"` — type‑colour border, transparent background, coloured text
   * - `"ghost"`  — coloured text only, no border or background fill
   */
  variant?: "filled" | "outline" | "ghost";
  /** Whether to show the type name alongside the number (default: false). */
  showName?: boolean;
  /** Additional CSS classes for the badge element. */
  className?: string;
}

// ── Size Map ──────────────────────────────────────────

interface SizeSpec {
  height: string;
  fontSize: string;
  paddingX: string;
  gap: string;
}

const SIZE_MAP: Record<"sm" | "md" | "lg", SizeSpec> = {
  sm: {
    height: "h-5",
    fontSize: "text-[11px]",
    paddingX: "px-2",
    gap: "gap-0.5",
  },
  md: {
    height: "h-6",
    fontSize: "text-xs",
    paddingX: "px-2.5",
    gap: "gap-1",
  },
  lg: {
    height: "h-8",
    fontSize: "text-sm",
    paddingX: "px-3",
    gap: "gap-1.5",
  },
};

// ── Component ─────────────────────────────────────────

/**
 * A compact, colour‑coded pill badge for an Enneagram type.
 *
 * Three visual variants are available:
 * - **filled** — solid background with white text (high visibility)
 * - **outline** — coloured border with transparent background
 * - **ghost** — coloured text only, minimal footprint
 *
 * @example
 * ```tsx
 * // Small filled badge
 * <TypeBadge typeId="one" size="sm" />
 *
 * // Outline badge with type name
 * <TypeBadge typeId="four" variant="outline" showName />
 *
 * // Large ghost badge
 * <TypeBadge typeId="eight" variant="ghost" size="lg" />
 * ```
 */
export function TypeBadge({
  typeId,
  size = "md",
  variant = "filled",
  showName = false,
  className = "",
}: TypeBadgeProps): React.ReactElement {
  const colors = typeColors[typeId];
  const typeData = enneagramTypesFull.find((t) => t.id === typeId);
  const labelText = typeData?.headline ?? typeData?.name ?? "";

  const dim = SIZE_MAP[size];

  /* ── Build inline styles ──────────────────────────── */
  // Dynamic colours must use inline styles because Tailwind
  // v4's JIT compiler cannot resolve runtime hex values.
  const badgeStyle: React.CSSProperties =
    variant === "filled"
      ? { backgroundColor: colors.primary, color: "#ffffff" }
      : variant === "outline"
        ? {
            borderColor: colors.primary,
            color: colors.primary,
            borderWidth: "1.5px",
            borderStyle: "solid",
          }
        : { color: colors.primary };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-semibold leading-none",
        "select-none whitespace-nowrap",
        "transition-colors duration-150",
        dim.height,
        dim.fontSize,
        dim.paddingX,
        dim.gap,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={badgeStyle}
      role="status"
      aria-label={`Enneagram type ${typeData?.number ?? ""}`}
    >
      <span>{typeData?.number ?? ""}</span>
      {showName && labelText && <span className="opacity-90">{labelText}</span>}
    </span>
  );
}
