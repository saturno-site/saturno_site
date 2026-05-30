// ──────────────────────────────────────────────────────────
// Board barrel export
// ──────────────────────────────────────────────────────────

export { EnneagramBoard } from "./EnneagramBoard";
export type { EnneagramBoardProps, BoardMode } from "./EnneagramBoard";

export {
  BOARD_GEOMETRY,
  BOARD_CENTER,
  BOARD_RADIUS,
  BOARD_VIEWBOX,
  POINT_RADIUS,
  LABEL_OFFSET,
  typeNumberMap,
  numberToTypeId,
  pointPositions,
  getPosition,
} from "./boardGeometry";

export type {
  BoardGeometry,
  BoardConnection,
  PointPosition,
} from "./boardGeometry";
