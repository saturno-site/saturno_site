"use client";

import { motion } from "framer-motion";
import { useMemo, type JSX } from "react";
import {
  type EnneagramTypeId,
  typeColors,
  integrationMap,
  disintegrationMap,
} from "@/data/enneagram-system";
import { springTransition } from "@/lib/animations";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** SVG viewBox dimensions — centred at (100, 100). */
const CX = 100;
const CY = 100;
const R = 80; // radius of the outer circle

/** Number of types on the Enneagram. */
const TYPE_COUNT = 9;

/**
 * Angle (degrees from top, clockwise) for each Enneagram type number.
 *
 * The traditional Enneagram symbol places type 9 at the top, then
 * proceeds clockwise: 9 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8.
 */
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

/** Mapping from numeric type (1-9) to EnneagramTypeId. */
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

/** Reverse mapping: EnneagramTypeId → numeric type. */
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

/** Standard entrance delay (seconds) applied before stagger begins. */
const ENTRANCE_DELAY = 0.6;

/** Stagger interval between each type point appearing. */
const STAGGER_INTERVAL = 0.08;

/** Hexad connection order: 1 → 4 → 2 → 8 → 5 → 7 → 1. */
const HEXAD_TYPES = [1, 4, 2, 8, 5, 7] as const;

/** Colours for the internal Enneagram figure lines. */
const FIGURE_COLORS = {
  triangle: "#94a3b8",
  triangleOpacity: 0.35,
  hexad: "#94a3b8",
  hexadOpacity: 0.25,
  outerRing: "#cbd5e1",
} as const;

/** Colours for integration / disintegration arrows. */
const ARROW_COLORS = {
  integration: "#22c55e",
  disintegration: "#f97316",
} as const;

/** Minimum gap between type-number rows on the symbol's label ring. */
const LABEL_OFFSET = 14;

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface TypeCompassProps {
  /** The user's likely Enneagram type.  This point glows and pulses. */
  primaryType: EnneagramTypeId;
  /**
   * An optional wing to highlight.  When provided, the wing type's point
   * receives a semi-transparent ring.
   */
  possibleWing?: EnneagramTypeId | null;
  /**
   * The integration (growth) direction.  Defaults to the value from
   * `integrationMap` when omitted.
   */
  integrationPath?: EnneagramTypeId;
  /**
   * The disintegration (stress) direction.  Defaults to the value from
   * `disintegrationMap` when omitted.
   */
  disintegrationPath?: EnneagramTypeId;
  /** Optional CSS classes forwarded to the SVG root wrapper. */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Geometry helpers                                                   */
/* ------------------------------------------------------------------ */

/** Cartesian position of a type on the Enneagram circle. */
interface Point {
  x: number;
  y: number;
}

/**
 * Converts an angle given in degrees (measured clockwise from top) into
 * a cartesian point on the Enneagram circle.
 */
function angleToPoint(deg: number, cx: number, cy: number, r: number): Point {
  const rad = (deg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/**
 * Builds a cubic bezier curve that gently arcs from `from` to `to` so that
 * integration/disintegration arrows don't overlap with straight hexad/triangle
 * lines.  The arc bends outward (away from centre) by `bendRatio` of the
 * distance between the two points.
 */
function arcedPath(from: Point, to: Point, bendRatio = 0.15): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const nx = -dy;
  const ny = dx;
  const len = Math.hypot(dx, dy) || 1;
  const cpx = mx + (nx / len) * len * bendRatio;
  const cpy = my + (ny / len) * len * bendRatio;
  return `M ${from.x} ${from.y} Q ${cpx} ${cpy} ${to.x} ${to.y}`;
}

/* ------------------------------------------------------------------ */
/*  Geometry computation                                               */
/* ------------------------------------------------------------------ */

interface CompassGeometry {
  /** Position of each type (1-9) on the circle. */
  positions: Record<number, Point>;
  /** SVG path string for the 3-6-9 equilateral triangle. */
  trianglePath: string;
  /** SVG path string for the hexad (1-4-2-8-5-7). */
  hexadPath: string;
}

function computeGeometry(): CompassGeometry {
  const positions: Record<number, Point> = {};

  for (const [num, angleDeg] of Object.entries(TYPE_ANGLES_DEG)) {
    const n = Number(num);
    positions[n] = angleToPoint(angleDeg, CX, CY, R);
  }

  /* Triangle: 3 → 6 → 9 → 3. */
  const tp = positions;
  const trianglePath =
    `M ${tp[3].x} ${tp[3].y} ` +
    `L ${tp[6].x} ${tp[6].y} ` +
    `L ${tp[9].x} ${tp[9].y} Z`;

  /* Hexad: 1 → 4 → 2 → 8 → 5 → 7 → 1. */
  const hexadPoints = HEXAD_TYPES.map((n) => positions[n]);
  const hexadPath =
    hexadPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
    " Z";

  return { positions, trianglePath, hexadPath };
}

/* ------------------------------------------------------------------ */
/*  Arrow marker (reusable SVG def)                                    */
/* ------------------------------------------------------------------ */

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="integration-arrowhead"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto"
      >
        <path
          d="M 0 0 L 10 5 L 0 10 Z"
          fill={ARROW_COLORS.integration}
        />
      </marker>
      <marker
        id="disintegration-arrowhead"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto"
      >
        <path
          d="M 0 0 L 10 5 L 0 10 Z"
          fill={ARROW_COLORS.disintegration}
        />
      </marker>
    </defs>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * An animated interactive Enneagram symbol (the 9-pointed star diagram)
 * that shows the user's type in relation to other types, wings, and
 * integration/disintegration paths.
 *
 * Renders as a 200×200 SVG with:
 * - An outer ring that draws in on mount.
 * - The triangle (3-6-9) and hexad (1-4-2-8-5-7) internal connections.
 * - All 9 type points with numbered labels, staggered on entrance.
 * - The **primary type** glowing and pulsing in its type colour.
 * - **Wings** (adjacent types) with a subtle highlight ring.
 * - **Integration arrow** (dashed, green, pulsing).
 * - **Disintegration arrow** (dotted, orange).
 *
 * @example
 * ```tsx
 * <TypeCompass
 *   primaryType="four"
 *   possibleWing="five"
 *   className="mx-auto max-w-sm"
 * />
 * ```
 */
export default function TypeCompass({
  primaryType,
  possibleWing,
  integrationPath: integrationPathProp,
  disintegrationPath: disintegrationPathProp,
  className = "",
}: TypeCompassProps): JSX.Element {
  /* ── Resolve integration / disintegration targets ───────────────── */
  const integTarget = integrationPathProp ?? integrationMap[primaryType];
  const disintegTarget =
    disintegrationPathProp ?? disintegrationMap[primaryType];

  /* ── Fail-fast: verify we have valid targets ────────────────────── */
  if (!integTarget || !disintegTarget) {
    throw new Error(
      `TypeCompass: Could not resolve integration/disintegration path ` +
        `for type "${primaryType}".`,
    );
  }

  /* ── Numeric identifiers ─────────────────────────────────────────── */
  const primaryNum = ID_TO_NUM[primaryType];
  const integNum = ID_TO_NUM[integTarget];
  const disintegNum = ID_TO_NUM[disintegTarget];

  /* ── Wing types (adjacent numbers, wrapping 1-9) ─────────────────── */
  const wingNums = useMemo(() => {
    const prev = ((primaryNum - 2 + TYPE_COUNT) % TYPE_COUNT) + 1;
    const next = (primaryNum % TYPE_COUNT) + 1;
    return [prev, next];
  }, [primaryNum]);

  const possibleWingNum = possibleWing ? ID_TO_NUM[possibleWing] : null;

  /* ── Static geometry (computed once) ─────────────────────────────── */
  const geometry = useMemo(() => computeGeometry(), []);

  /* ── Arc paths for integration / disintegration arrows ───────────── */
  const integPath = useMemo(
    () => arcedPath(geometry.positions[primaryNum], geometry.positions[integNum]),
    [geometry, primaryNum, integNum],
  );
  const disintegPath = useMemo(
    () =>
      arcedPath(
        geometry.positions[primaryNum],
        geometry.positions[disintegNum],
        0.12, // slightly different bend for visual distinction
      ),
    [geometry, primaryNum, disintegNum],
  );

  /* ── All type numbers in clockwise order for staggered rendering ─── */
  const allTypeNumbers = useMemo(() => {
    const nums = [9, 1, 2, 3, 4, 5, 6, 7, 8];
    return nums;
  }, []);

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <div className={className}>
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full"
        role="img"
        aria-label={`Enneagram compass showing type ${primaryType} in relation to the other types`}
      >
        {/* ── Reusable arrow definitions ─────────────────────────── */}
        <ArrowDefs />

        {/* ── Outer ring (draws in on mount) ─────────────────────── */}
        <motion.circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke={FIGURE_COLORS.outerRing}
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        {/* ── Triangle (3-6-9) ──────────────────────────────────── */}
        <motion.path
          d={geometry.trianglePath}
          fill="none"
          stroke={FIGURE_COLORS.triangle}
          strokeOpacity={FIGURE_COLORS.triangleOpacity}
          strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
        />

        {/* ── Hexad (1-4-2-8-5-7) ────────────────────────────────── */}
        <motion.path
          d={geometry.hexadPath}
          fill="none"
          stroke={FIGURE_COLORS.hexad}
          strokeOpacity={FIGURE_COLORS.hexadOpacity}
          strokeWidth="0.6"
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
        />

        {/* ── Integration arrow (dashed, green, pulsing) ─────────── */}
        <motion.path
          d={integPath}
          fill="none"
          stroke={ARROW_COLORS.integration}
          strokeWidth="1.5"
          strokeDasharray="5 4"
          strokeLinecap="round"
          markerEnd="url(#integration-arrowhead)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: 1,
            strokeOpacity: [0.6, 1, 0.6],
          }}
          transition={{
            pathLength: { duration: 0.8, delay: 0.8, ease: "easeInOut" },
            opacity: { duration: 0.4, delay: 0.8 },
            strokeOpacity: {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            },
          }}
        />

        {/* ── Disintegration arrow (dotted, orange) ──────────────── */}
        <motion.path
          d={disintegPath}
          fill="none"
          stroke={ARROW_COLORS.disintegration}
          strokeWidth="1.5"
          strokeDasharray="2 5"
          strokeLinecap="round"
          markerEnd="url(#disintegration-arrowhead)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.8, delay: 0.9, ease: "easeInOut" },
            opacity: { duration: 0.4, delay: 0.9 },
          }}
        />

        {/* ── Type points & labels ───────────────────────────────── */}
        {allTypeNumbers.map((num, i) => {
          const pos = geometry.positions[num];
          const typeId = NUM_TO_ID[num];
          const isPrimary = num === primaryNum;
          const isWing = wingNums.includes(num);
          const isPossibleWing = possibleWingNum === num;
          const color = typeColors[typeId].primary;

          return (
            <motion.g
              key={num}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                ...springTransition,
                delay: ENTRANCE_DELAY + i * STAGGER_INTERVAL,
              }}
            >
              {/* ── Wing highlight ring ──────────────────────────── */}
              {isWing && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={8}
                  fill="none"
                  stroke={color}
                  strokeWidth={isPossibleWing ? 2 : 1.5}
                  strokeOpacity={isPossibleWing ? 0.7 : 0.35}
                />
              )}

              {/* ── Primary type: glowing, pulsing filled circle ─── */}
              {isPrimary && (
                <>
                  {/* Glow halo */}
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={12}
                    fill={color}
                    opacity={0.15}
                    animate={{ r: [12, 16, 12] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: ENTRANCE_DELAY + i * STAGGER_INTERVAL + 0.5,
                    }}
                  />
                  {/* Filled point */}
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={6}
                    fill={color}
                    animate={{ r: [6, 8, 6] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: ENTRANCE_DELAY + i * STAGGER_INTERVAL + 0.3,
                    }}
                  />
                </>
              )}

              {/* ── Regular point (unfilled for non-primary types) ── */}
              {!isPrimary && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={3.5}
                  fill="none"
                  stroke={isWing ? color : "#94a3b8"}
                  strokeWidth={isWing ? 2 : 1.2}
                  strokeOpacity={isWing ? 0.8 : 0.5}
                />
              )}

              {/* ── Number label ───────────────────────────────────── */}
              <text
                x={pos.x}
                y={
                  /* shift label downward so it sits below the point */
                  pos.y + LABEL_OFFSET
                }
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isPrimary ? color : isWing ? "#475569" : "#94a3b8"}
                fontSize={isPrimary ? 11 : 9}
                fontWeight={isPrimary ? 700 : 500}
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              >
                {num}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
