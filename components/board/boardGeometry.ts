// ──────────────────────────────────────────────────────────
// Saturno Animated Enneagram Board — Pre-computed Geometry
// ──────────────────────────────────────────────────────────
// All SVG coordinates are computed once at module load time
// so interactive components never calculate positions at
// runtime.  Uses a 400×400 viewBox.
// ──────────────────────────────────────────────────────────

import type { EnneagramTypeId } from "@/data/enneagram-system";

// ── Types ─────────────────────────────────────────────────

/** Position of a single Enneagram type point on the board. */
export interface PointPosition {
  /** The type identifier (e.g., "one", "two"). */
  typeId: EnneagramTypeId;
  /** Numeric label 1–9. */
  typeNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /** Angle in degrees (standard math: 0° = east, positive = counter-clockwise). */
  angle: number;
  /** SVG x-coordinate in the 400×400 viewBox. */
  x: number;
  /** SVG y-coordinate in the 400×400 viewBox. */
  y: number;
  /** SVG x-coordinate for the numeric label, offset radially outward by `LABEL_OFFSET`. */
  labelX: number;
  /** SVG y-coordinate for the numeric label, offset radially outward by `LABEL_OFFSET`. */
  labelY: number;
}

/** A single connection line between two type points. */
export interface BoardConnection {
  /** Start-point type identifier. */
  from: EnneagramTypeId;
  /** End-point type identifier. */
  to: EnneagramTypeId;
  /** SVG path data string (a straight line in both groups). */
  path: string;
  /** Which internal figure this connection belongs to. */
  group: "triangle" | "hexad";
}

/** Every geometric facet of the 9-pointed Enneagram symbol. */
export interface BoardGeometry {
  /** Center of the board. */
  center: { x: number; y: number };
  /** Radius of the outer circle. */
  radius: number;
  /** All 9 point positions (index 0 = type 1, … index 8 = type 9). */
  points: PointPosition[];
  /** Every connection that forms the triangle and hexad. */
  connections: BoardConnection[];
  /** Combined SVG path for the equilateral triangle (types 3–6–9–3). */
  trianglePath: string;
  /** Combined SVG path for the irregular hexad (1–4–2–8–5–7–1). */
  hexadPath: string;
  /** SVG path for the outer circle. */
  outerCirclePath: string;
}

// ── Constants ─────────────────────────────────────────────

/** Dimensions of the SVG viewBox — 400 × 400. */
export const BOARD_VIEWBOX = { width: 400, height: 400 } as const;

/** Pixel centre of the board in the 400×400 coordinate space. */
export const BOARD_CENTER = { x: 200, y: 200 } as const;

/** Radius of the outer circle (and of every point's orbital position). */
export const BOARD_RADIUS = 160 as const;

/** Radius (in pixels) of each interactive point circle. */
export const POINT_RADIUS = 20 as const;

/**
 * Distance outward from each point's centre to place its numeric label.
 * The label sits at `BOARD_RADIUS + LABEL_OFFSET` from the board centre.
 */
export const LABEL_OFFSET = 32 as const;

// ── Type ↔ Number Lookups ────────────────────────────────

/** Maps every `EnneagramTypeId` to its canonical number 1–9. */
export const typeNumberMap: Record<
  EnneagramTypeId,
  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
> = {
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

/** Reverse lookup — maps a number 1–9 to its `EnneagramTypeId`. */
export const numberToTypeId: Record<number, EnneagramTypeId> = {
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

// ── Angle Table ──────────────────────────────────────────
// Clockwise from top (12-o'clock position). The standard
// Enneagram diagram places type 9 at the top, then types
// 1–8 in clockwise order, each 40° apart.
//
//   Type 9  at  -90°   (top)
//   Type 1  at  -50°
//   Type 2  at  -10°
//   Type 3  at   30°
//   Type 4  at   70°
//   Type 5  at  110°
//   Type 6  at  150°
//   Type 7  at  190°   (= -170°)
//   Type 8  at  230°   (= -130°)

const TYPE_ANGLES: Record<EnneagramTypeId, number> = {
  nine: -90,
  one: -50,
  two: -10,
  three: 30,
  four: 70,
  five: 110,
  six: 150,
  seven: 190,
  eight: 230,
};

/** Ordered list of type IDs for computing positions 1→9. */
const TYPE_ORDER: EnneagramTypeId[] = [
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

// ── Geometry Helpers ─────────────────────────────────────

/**
 * Convert polar coordinates (centre + radius + angle) to
 * Cartesian (x, y) in the SVG coordinate space.
 */
function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/** Build an SVG line path between two points. */
function makeLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): string {
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

/** Build an SVG closed-polygon path from an ordered list of points. */
function makePolygon(points: { x: number; y: number }[]): string {
  return (
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ") + " Z"
  );
}

// ── Pre-compute All 9 Point Positions ────────────────────

export const pointPositions: PointPosition[] = TYPE_ORDER.map((typeId) => {
  const angle = TYPE_ANGLES[typeId];
  const { x, y } = polarToCartesian(
    BOARD_CENTER.x,
    BOARD_CENTER.y,
    BOARD_RADIUS,
    angle,
  );
  const label = polarToCartesian(
    BOARD_CENTER.x,
    BOARD_CENTER.y,
    BOARD_RADIUS + LABEL_OFFSET,
    angle,
  );
  return {
    typeId,
    typeNumber: typeNumberMap[typeId],
    angle,
    x,
    y,
    labelX: label.x,
    labelY: label.y,
  };
});

// ── Position Lookup Map ─────────────────────────────────

const positionMap: Record<EnneagramTypeId, PointPosition> = {} as Record<
  EnneagramTypeId,
  PointPosition
>;
for (const pos of pointPositions) {
  positionMap[pos.typeId] = pos;
}

/**
 * Retrieve the pre-computed `PointPosition` for a given type.
 *
 * @param typeId - The canonical type identifier.
 * @returns The point's position data.
 * @throws {Error} If the type id is unrecognised.
 */
export function getPosition(typeId: EnneagramTypeId): PointPosition {
  const pos = positionMap[typeId];
  if (!pos) {
    throw new Error(
      `Unknown Enneagram type id: "${typeId}". Expected one of: one, two, three, four, five, six, seven, eight, nine.`,
    );
  }
  return pos;
}

// ── Connection Definitions ───────────────────────────────

/**
 * Internal connection definitions — the Enneagram symbol has
 * two internal figures:
 *
 *   **Triangle** (equilateral): 3 → 6 → 9 → 3
 *   **Hexad** (irregular):      1 → 4 → 2 → 8 → 5 → 7 → 1
 */

interface ConnectionDef {
  from: EnneagramTypeId;
  to: EnneagramTypeId;
  group: "triangle" | "hexad";
}

const TRIANGLE_DEFS: ConnectionDef[] = [
  { from: "three", to: "six", group: "triangle" },
  { from: "six", to: "nine", group: "triangle" },
  { from: "nine", to: "three", group: "triangle" },
];

const HEXAD_DEFS: ConnectionDef[] = [
  { from: "one", to: "four", group: "hexad" },
  { from: "four", to: "two", group: "hexad" },
  { from: "two", to: "eight", group: "hexad" },
  { from: "eight", to: "five", group: "hexad" },
  { from: "five", to: "seven", group: "hexad" },
  { from: "seven", to: "one", group: "hexad" },
];

// ── Build Individual Connections ─────────────────────────

const connections: BoardConnection[] = [
  ...TRIANGLE_DEFS,
  ...HEXAD_DEFS,
].map(({ from, to, group }) => {
  const fromPos = positionMap[from];
  const toPos = positionMap[to];
  return {
    from,
    to,
    path: makeLine(fromPos.x, fromPos.y, toPos.x, toPos.y),
    group,
  };
});

// ── Combined Paths ───────────────────────────────────────
// These allow drawing all triangle or all hexad connections
// with a single `<path>` element.

const trianglePoints = TRIANGLE_DEFS.map((d) => positionMap[d.from]);
const trianglePath: string = makePolygon(trianglePoints);

const hexadPoints = HEXAD_DEFS.map((d) => positionMap[d.from]);
const hexadPath: string = makePolygon(hexadPoints);

// ── Outer Circle ─────────────────────────────────────────
// SVG arc command draws a full circle.  The tiny 0.01 px
// offset on the x-coordinate prevents the arc from collapsing
// to a zero-length segment.

const outerCirclePath: string =
  `M ${BOARD_CENTER.x} ${BOARD_CENTER.y - BOARD_RADIUS} ` +
  `A ${BOARD_RADIUS} ${BOARD_RADIUS} 0 1 1 ${BOARD_CENTER.x - 0.01} ${BOARD_CENTER.y - BOARD_RADIUS}`;

// ── Complete Geometry ────────────────────────────────────

/** Pre-computed geometry for the entire 9-pointed Enneagram board. */
export const BOARD_GEOMETRY: BoardGeometry = {
  center: BOARD_CENTER,
  radius: BOARD_RADIUS,
  points: pointPositions,
  connections,
  trianglePath,
  hexadPath,
  outerCirclePath,
};
