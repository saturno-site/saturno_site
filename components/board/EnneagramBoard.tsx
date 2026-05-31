"use client";

// ──────────────────────────────────────────────────────────
// EnneagramBoard — Interactive Animated Enneagram Symbol
// ──────────────────────────────────────────────────────────
// Renders the 9-pointed Enneagram symbol as an interactive SVG
// with mount animations, hover states, selection pulsing, and
// three interaction modes (explore, wing, triad, connections).
//
// Accessibility: full keyboard navigation, ARIA labels, and
// `prefers-reduced-motion` support via AnimationContext.
// ──────────────────────────────────────────────────────────

import {
  useState,
  useCallback,
  useMemo,
  type JSX,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EnneagramTypeId } from "@/data/enneagram-system";
import {
  enneagramTypes,
  enneagramTypesFull,
  typeColors,
  integrationMap,
  disintegrationMap,
} from "@/data/enneagram-system";
import {
  BOARD_GEOMETRY,
  BOARD_CENTER,
  BOARD_VIEWBOX,
  POINT_RADIUS,
  getPosition,
  typeNumberMap,
  type PointPosition,
} from "@/components/board/boardGeometry";
import { useAnimation } from "@/lib/AnimationContext";

// ── Types ─────────────────────────────────────────────────

export type BoardMode = "explore" | "wing" | "triad" | "connections";

export interface EnneagramBoardProps {
  /** Type to highlight as selected (shows a pulsing glow ring). */
  selectedType?: EnneagramTypeId;
  /** Callback fired when the user clicks or presses Enter/Space on a point. */
  onSelectType?: (typeId: EnneagramTypeId) => void;
  /** Interaction mode — changes how points and connections are rendered. */
  mode?: BoardMode;
  /** Compact variant for dashboards/embeds (no tooltips, smaller points). */
  compact?: boolean;
  /** Whether to show type number labels next to each point (default: true). */
  showLabels?: boolean;
  /** Optional CSS classes forwarded to the root `<svg>` element. */
  className?: string;
}

// ── Constants ─────────────────────────────────────────────

const HIT_RADIUS = 30;
const COMPACT_POINT_RADIUS = 10;

const TRIAD_COLORS: Record<string, string> = {
  body: "#C41E3A",
  heart: "#7B3F9E",
  head: "#4A6CF7",
};

// ── Triad Membership ─────────────────────────────────────

const typeTriadMap: Record<EnneagramTypeId, "body" | "heart" | "head"> = {
  eight: "body",
  nine: "body",
  one: "body",
  two: "heart",
  three: "heart",
  four: "heart",
  five: "head",
  six: "head",
  seven: "head",
};

// ── Tooltip Helpers ──────────────────────────────────────

interface TooltipLayout {
  /** X position of the tooltip group. */
  x: number;
  /** Y position of the tooltip group. */
  y: number;
  /** Whether the tooltip appears above or below the point. */
  above: boolean;
}

/**
 * Compute tooltip position so it sits neatly alongside the point
 * without clipping outside the 400×400 viewBox.
 *
 * - For points on the left/centre half: tooltip appears to the right.
 * - For points on the right half: tooltip appears to the left.
 * - For points in the top third: tooltip appears below.
 * - Otherwise: tooltip appears above.
 */
function computeTooltipLayout(pos: PointPosition): TooltipLayout {
  const { x, y } = pos;
  const w = 130;
  const gap = 8;
  const isRightHalf = x > BOARD_CENTER.x;
  const isTopThird = y < BOARD_CENTER.y - 50;

  // Horizontal: anchor tooltip beside the point
  let tx = isRightHalf ? x - w - gap : x + gap;
  // Clamp so tooltip stays in view
  tx = Math.max(2, Math.min(tx, BOARD_VIEWBOX.width - w - 2));

  return {
    x: tx,
    y: isTopThird ? y + 25 : y - 46,
    above: !isTopThird,
  };
}

// ── Component ─────────────────────────────────────────────

/**
 * Interactive animated Enneagram symbol rendered as an SVG.
 *
 * The board shows all 9 type points on a circle with the classic
 * triangle (3-6-9) and hexad (1-4-2-8-5-7) connections, and
 * supports four interaction modes:
 *
 * - `"explore"` (default) — hover to see tooltips, click to select.
 * - `"wing"` — hover/select highlights the type and its two wings.
 * - `"triad"` — points are tinted by their triad (Body / Heart / Head).
 * - `"connections"` — shows integration and disintegration arrows
 *   for the hovered or selected type.
 *
 * @example
 * ```tsx
 * <EnneagramBoard
 *   selectedType="four"
 *   onSelectType={(id) => console.log(id)}
 *   mode="explore"
 * />
 * ```
 */
export function EnneagramBoard({
  selectedType,
  onSelectType,
  mode = "explore",
  compact = false,
  showLabels = true,
  className,
}: EnneagramBoardProps): JSX.Element {
  const [hoveredType, setHoveredType] = useState<EnneagramTypeId | null>(null);
  const { animationsEnabled } = useAnimation();

  const activeType = hoveredType ?? selectedType ?? null;

  // ── Handlers ──────────────────────────────────────────────

  const handleSelect = useCallback(
    (typeId: EnneagramTypeId) => {
      onSelectType?.(typeId);
    },
    [onSelectType],
  );

  const handleKeyDown = useCallback(
    (typeId: EnneagramTypeId, event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleSelect(typeId);
      }
    },
    [handleSelect],
  );

  // ── Point Opacity (for "wing" mode) ──────────────────────

  const getPointOpacity = useCallback(
    (typeId: EnneagramTypeId): number => {
      if (mode !== "wing" || !activeType) return 1;
      if (typeId === activeType) return 1;

      const fullType = enneagramTypesFull.find((t) => t.id === activeType);
      if (!fullType) return 0.3;
      return fullType.wingOptions.includes(typeId) ? 0.6 : 0.3;
    },
    [mode, activeType],
  );

  // ── Point Tint (for "triad" mode) ────────────────────────

  const getTriadTint = useCallback(
    (typeId: EnneagramTypeId): string | undefined => {
      if (mode !== "triad") return undefined;
      return TRIAD_COLORS[typeTriadMap[typeId]];
    },
    [mode],
  );

  // ── Animation transition tokens ─────────────────────────

  const dur = useCallback(
    (t: number) => (animationsEnabled ? t : 0),
    [animationsEnabled],
  );
  const spring = useMemo(
    () => ({ type: "spring" as const, stiffness: 300, damping: 15 }),
    [],
  );

  // ── Connection rendering helpers ────────────────────────

  const connectionEntries = useMemo(() => {
    if (mode !== "connections" || !activeType) return null;

    const integTarget = integrationMap[activeType];
    const disintegTarget = disintegrationMap[activeType];

    const entries: {
      type: "integration" | "disintegration";
      from: PointPosition;
      to: PointPosition;
      path: string;
    }[] = [];

    if (integTarget) {
      const f = getPosition(activeType);
      const t = getPosition(integTarget);
      entries.push({
        type: "integration",
        from: f,
        to: t,
        path: `M ${f.x} ${f.y} L ${t.x} ${t.y}`,
      });
    }
    if (disintegTarget) {
      const f = getPosition(activeType);
      const t = getPosition(disintegTarget);
      entries.push({
        type: "disintegration",
        from: f,
        to: t,
        path: `M ${f.x} ${f.y} L ${t.x} ${t.y}`,
      });
    }
    return entries;
  }, [mode, activeType]);

  // ── SVG Defs ──────────────────────────────────────────────

  const svgDefs = useMemo(
    () => (
      <defs>
        {/* Glow filter for hovered points */}
        <filter
          id="point-glow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Drop shadow for tooltips */}
        <filter
          id="tooltip-shadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity={0.18} />
        </filter>

        {/* Arrow marker for integration arrows */}
        <marker
          id="arrow-integration"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="#22c55e" />
        </marker>

        {/* Arrow marker for disintegration arrows */}
        <marker
          id="arrow-disintegration"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="#ef4444" />
        </marker>
      </defs>
    ),
    [],
  );

  // ── Points rendering ─────────────────────────────────────

  const pointRadius = compact ? COMPACT_POINT_RADIUS : POINT_RADIUS;

  const renderedPoints = useMemo(
    () =>
      BOARD_GEOMETRY.points.map((pos) => {
        const { typeId, typeNumber, x, y, labelX, labelY } = pos;
        const colors = typeColors[typeId];
        const opacity = getPointOpacity(typeId);
        const triadTint = getTriadTint(typeId);
        const isSelected = selectedType === typeId;
        const enneaType = enneagramTypes.find((t) => t.id === typeId);
        const typeName = enneaType?.name ?? `Type ${typeNumber}`;
        const ariaLabel = `Type ${typeNumber} — ${typeName}`;

        return (
          <motion.g
            key={typeId}
            initial={
              animationsEnabled
                ? { scale: 0, opacity: 0 }
                : { scale: 1, opacity }
            }
            animate={{
              scale: hoveredType === typeId && animationsEnabled ? 1.3 : 1,
              opacity,
            }}
            transition={{
              scale: spring,
              opacity: { duration: dur(0.2) },
              delay: animationsEnabled
                ? 0.9 + (typeNumber - 1) * 0.05
                : 0,
            }}
            style={{ originX: x, originY: y }}
          >
            {/* Invisible hit area */}
            <circle
              cx={x}
              cy={y}
              r={HIT_RADIUS}
              fill="transparent"
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={ariaLabel}
              onMouseEnter={() => setHoveredType(typeId)}
              onMouseLeave={() => setHoveredType(null)}
              onClick={() => handleSelect(typeId)}
              onKeyDown={(e) => handleKeyDown(typeId, e)}
            />

            {/* Outer glow ring for selected type */}
            {isSelected && (
              <motion.circle
                cx={x}
                cy={y}
                r={pointRadius + 5}
                fill="none"
                stroke={colors.primary}
                strokeWidth={2.5}
                initial={
                  animationsEnabled
                    ? { scale: 1, opacity: 0.6 }
                    : { scale: 1, opacity: 0.3 }
                }
                animate={
                  animationsEnabled
                    ? {
                        scale: [1, 1.15, 1],
                        opacity: [0.6, 0.25, 0.6],
                      }
                    : { scale: 1, opacity: 0.3 }
                }
                transition={
                  animationsEnabled
                    ? {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : undefined
                }
                style={{ originX: x, originY: y }}
              />
            )}

            {/* Triad tint ring */}
            {triadTint && (
              <circle
                cx={x}
                cy={y}
                r={pointRadius + 3}
                fill="none"
                stroke={triadTint}
                strokeWidth={2}
                opacity={0.5}
              />
            )}

            {/* Main visible circle */}
            <motion.circle
              cx={x}
              cy={y}
              r={pointRadius}
              fill={colors.primary}
              stroke={colors.dark}
              strokeWidth={1.5}
              whileHover={
                animationsEnabled
                  ? { filter: "url(#point-glow)" }
                  : undefined
              }
            />

            {/* Number label */}
            {showLabels && (
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={compact ? 9 : 11}
                fontWeight={700}
                fill={colors.dark}
                style={{ userSelect: "none" }}
              >
                {typeNumber}
              </text>
            )}
          </motion.g>
        );
      }),
    [
      animationsEnabled,
      compact,
      dur,
      getPointOpacity,
      getTriadTint,
      handleKeyDown,
      handleSelect,
      hoveredType,
      pointRadius,
      selectedType,
      showLabels,
      spring,
    ],
  );

  // ── Tooltip ──────────────────────────────────────────────

  const tooltip = useMemo(() => {
    if (compact || !hoveredType) return null;
    const pos = getPosition(hoveredType);
    const layout = computeTooltipLayout(pos);
    const enneaType = enneagramTypes.find((t) => t.id === hoveredType);
    const typeName = enneaType?.name ?? `Type ${typeNumberMap[hoveredType]}`;
    const headline = enneaType?.headline ?? "";

    return (
      <AnimatePresence>
        {hoveredType && (
          <motion.g
            key={hoveredType}
            initial={
              animationsEnabled
                ? { opacity: 0, y: layout.above ? -6 : 6 }
                : { opacity: 1, y: 0 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              animationsEnabled
                ? { opacity: 0, y: layout.above ? -6 : 6 }
                : { opacity: 0, y: 0 }
            }
            transition={{ duration: dur(0.15) }}
            transform={`translate(${layout.x}, ${layout.y})`}
            pointerEvents="none"
          >
            {/* Background rect */}
            <rect
              x={0}
              y={0}
              width={130}
              height={38}
              rx={8}
              fill="#ffffff"
              filter="url(#tooltip-shadow)"
            />

            {/* Type number + name */}
            <text
              x={10}
              y={16}
              fontSize={11}
              fontWeight={600}
              fill="#1f2937"
            >
              {typeName}
            </text>

            {/* Headline */}
            <text
              x={10}
              y={30}
              fontSize={10}
              fill="#6b7280"
            >
              {headline}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    );
  }, [compact, hoveredType, animationsEnabled, dur]);

  // ── Connection arrows (connections mode) ────────────────

  const connectionArrows = useMemo(() => {
    if (!connectionEntries) return null;

    return connectionEntries.map((entry, i) => {
      const markerId =
        entry.type === "integration"
          ? "url(#arrow-integration)"
          : "url(#arrow-disintegration)";
      const strokeColor =
        entry.type === "integration" ? "#22c55e" : "#ef4444";

      return (
        <motion.path
          key={`${entry.type}-${i}`}
          d={entry.path}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2}
          strokeDasharray={entry.type === "integration" ? "6 4" : "4 4"}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: dur(0.6),
            delay: dur(0.4 + i * 0.15),
            ease: "easeInOut",
          }}
          markerEnd={markerId}
          style={{ pointerEvents: "none" }}
        />
      );
    });
  }, [connectionEntries, dur]);

  // ── Legend for triad mode ───────────────────────────────

  const triadLegend = useMemo(() => {
    if (mode !== "triad") return null;

    const legendItems = [
      { label: "Body (8, 9, 1)", color: TRIAD_COLORS.body },
      { label: "Heart (2, 3, 4)", color: TRIAD_COLORS.heart },
      { label: "Head (5, 6, 7)", color: TRIAD_COLORS.head },
    ];

    return (
      <g
        transform="translate(10, 360)"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      >
        {legendItems.map((item, i) => (
          <g key={item.label} transform={`translate(0, ${i * 14})`}>
            <rect x={0} y={0} width={8} height={8} rx={2} fill={item.color} />
            <text
              x={14}
              y={8}
              fontSize={10}
              fill="#6b7280"
            >
              {item.label}
            </text>
          </g>
        ))}
      </g>
    );
  }, [mode]);

  // ── Render ───────────────────────────────────────────────

  return (
    <svg
      viewBox={`0 0 ${BOARD_VIEWBOX.width} ${BOARD_VIEWBOX.height}`}
      width={compact ? 200 : undefined}
      height={compact ? 200 : undefined}
      className={className}
      role="application"
      aria-roledescription="Enneagram symbol"
      aria-label="Interactive Enneagram board with 9 personality types"
      style={{
        display: "block",
        maxWidth: "100%",
        overflow: "visible",
      }}
    >
      {svgDefs}

      {/* Transparent background to catch pointer events outside points */}
      <rect
        width={BOARD_VIEWBOX.width}
        height={BOARD_VIEWBOX.height}
        fill="transparent"
      />

      {/* ── Outer Circle ────────────────────────────────── */}
      <motion.path
        d={BOARD_GEOMETRY.outerCirclePath}
        fill="none"
        stroke="#94a3b8"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
        initial={{ pathLength: animationsEnabled ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: dur(1.5), ease: "easeInOut" }}
        style={{ pointerEvents: "none" }}
      />

      {/* ── Triangle Connections (3-6-9) ────────────────── */}
      <motion.path
        d={BOARD_GEOMETRY.trianglePath}
        fill="none"
        stroke="#94a3b8"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.5}
        initial={{ pathLength: animationsEnabled ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: dur(0.8),
          delay: dur(0.3),
          ease: "easeInOut",
        }}
        style={{ pointerEvents: "none" }}
      />

      {/* ── Hexad Connections (1-4-2-8-5-7-1) ──────────── */}
      <motion.path
        d={BOARD_GEOMETRY.hexadPath}
        fill="none"
        stroke="#94a3b8"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
        strokeDasharray="6 4"
        initial={{ pathLength: animationsEnabled ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: dur(0.8),
          delay: dur(0.6),
          ease: "easeInOut",
        }}
        style={{ pointerEvents: "none" }}
      />

      {/* ── Connection Arrows (connections mode) ───────── */}
      {connectionArrows}

      {/* ── 9 Interactive Points ───────────────────────── */}
      {renderedPoints}

      {/* ── Tooltip ──────────────────────────────────────── */}
      {tooltip}

      {/* ── Triad Legend ─────────────────────────────────── */}
      {triadLegend}
    </svg>
  );
}

export default EnneagramBoard;
