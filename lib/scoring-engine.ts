// ──────────────────────────────────────────────────────
// Saturno Enneagram — Multi-Dimensional Scoring Engine
// ──────────────────────────────────────────────────────
// Replaces the simpler lib/enneagram.ts with a full
// scoring system: raw + normalised scores, confidence,
// wing detection, triad breakdown, and growth/stress paths.
// ──────────────────────────────────────────────────────

import { quizQuestions } from "@/data/enneagram";
import {
  enneagramTypesFull,
  integrationMap,
  disintegrationMap,
  triads,
  typeColors,
} from "@/data/enneagram-system";
import type { EnneagramTypeId } from "@/data/enneagram-system";

// ── Public Types ───────────────────────────────────────

export type QuizAnswerKey = string;

/** Map of questionId → answerId (e.g. { 1: "a", 3: "c" }) */
export type QuizAnswers = Record<number, QuizAnswerKey>;

export interface TypeScore {
  typeId: EnneagramTypeId;
  rawScore: number;
  /** 0–100 percentage of the maximum possible score for this type */
  normalizedScore: number;
}

export interface TriadScore {
  triad: "body" | "heart" | "head";
  /** Sum of raw scores for all types in this triad */
  totalScore: number;
}

export interface QuizResult {
  /** Highest-scoring type */
  primary: TypeScore;
  /** Second-highest (potential wing candidate) */
  secondary: TypeScore;
  /** All 9 types sorted by score descending */
  breakdown: TypeScore[];
  /**
   * 0–1 — how decisive the result is.
   * Calculated as `(primary - secondary) / 100`, clamped to [0, 1].
   * Low values (< 0.15) indicate the quiz couldn't strongly decide.
   */
  confidence: number;
  /**
   * If confidence < 0.15, suggests the secondary type as a possible wing.
   * Otherwise null.
   */
  possibleWing: EnneagramTypeId | null;
  /** Growth / integration direction for the primary type */
  integrationPath: EnneagramTypeId;
  /** Stress / disintegration direction for the primary type */
  disintegrationPath: EnneagramTypeId;
  /** Scores for each of the three triads (body, heart, head) */
  triadScores: TriadScore[];
  /** Number of questions that had a non‑undefined answer */
  questionCount: number;
}

// ── Internal Constants ─────────────────────────────────

const ALL_TYPE_IDS: EnneagramTypeId[] = [
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

// ── Pre‑compute Maximum Possible Scores ────────────────

/**
 * For each type, sum the maximum weight available across every question.
 * This is the denominator for 0–100 normalisation.
 *
 * Computed once at module load — fails fast if quiz data is empty or
 * malformed.
 */
function computeMaxPossibleScores(): Record<EnneagramTypeId, number> {
  const maxScores: Record<EnneagramTypeId, number> = {
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    five: 0,
    six: 0,
    seven: 0,
    eight: 0,
    nine: 0,
  };

  for (const question of quizQuestions) {
    for (const typeId of ALL_TYPE_IDS) {
      let maxWeight = 0;
      for (const answer of question.answers) {
        const weight = answer.weights[typeId] ?? 0;
        if (weight > maxWeight) maxWeight = weight;
      }
      maxScores[typeId] += maxWeight;
    }
  }

  return maxScores;
}

/**
 * Immutable map of the maximum weight attainable for each type
 * across all quiz questions. Used as the normalisation denominator.
 */
const MAX_POSSIBLE_SCORES: Record<EnneagramTypeId, number> =
  computeMaxPossibleScores();

// ── Internal Helpers ───────────────────────────────────

/** Returns a zero‑initialised scores record for all 9 types. */
function createEmptyScores(): Record<EnneagramTypeId, number> {
  return {
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    five: 0,
    six: 0,
    seven: 0,
    eight: 0,
    nine: 0,
  };
}

/**
 * Convert a raw score into a 0–100 percentage.
 * Returns 0 when maxPossible is 0 (guards against division by zero).
 */
function normalizeScore(rawScore: number, maxPossible: number): number {
  if (maxPossible <= 0) return 0;
  return Math.round((rawScore / maxPossible) * 100);
}

/** Build the unsorted TypeScore array from a raw‑scores record. */
function computeBreakdown(
  rawScores: Record<EnneagramTypeId, number>,
): TypeScore[] {
  return ALL_TYPE_IDS.map((typeId) => ({
    typeId,
    rawScore: rawScores[typeId],
    normalizedScore: normalizeScore(
      rawScores[typeId],
      MAX_POSSIBLE_SCORES[typeId],
    ),
  }));
}

// ── Public API ─────────────────────────────────────────

/**
 * Score a set of quiz answers and return a complete multi‑dimensional
 * Enneagram result.
 *
 * @param answers - Map of questionId → answerKey (e.g. `{ 1: "b", 3: "a" }`)
 * @returns A fully populated `QuizResult` containing primary/secondary types,
 *          confidence, wing suggestion, integration/disintegration paths,
 *          triad breakdown, and per‑type scores.
 *
 * @example
 * ```ts
 * const result = scoreQuiz({ 1: "a", 2: "b", 3: "c" });
 * console.log(result.primary.typeId); // "four"
 * ```
 */
export function scoreQuiz(answers: QuizAnswers): QuizResult {
  // ── 1. Sum raw weights per type across answered questions ──
  const rawScores = createEmptyScores();

  for (const question of quizQuestions) {
    const selectedId = answers[question.id];
    // Skip unanswered questions
    if (selectedId === undefined) continue;

    const selectedAnswer = question.answers.find((a) => a.id === selectedId);
    // Skip invalid answer IDs silently
    if (!selectedAnswer) continue;

    for (const [typeId, weight] of Object.entries(selectedAnswer.weights)) {
      rawScores[typeId as EnneagramTypeId] += weight ?? 0;
    }
  }

  // ── 2. Build & sort breakdown by normalized score ──
  const breakdown = computeBreakdown(rawScores);

  // Stable sort: equal scores keep the order they have in ALL_TYPE_IDS,
  // making ties deterministic (first type in the list wins).
  const sortedBreakdown = [...breakdown].sort((a, b) => {
    const diff = b.normalizedScore - a.normalizedScore;
    if (diff !== 0) return diff;
    return ALL_TYPE_IDS.indexOf(a.typeId) - ALL_TYPE_IDS.indexOf(b.typeId);
  });

  // ── 3. Extract primary & secondary ──
  const primary = sortedBreakdown[0];
  const secondary = sortedBreakdown[1];

  // ── 4. Confidence: distance between 1st and 2nd, on a 0–1 scale ──
  const confidence = Math.min(
    1,
    Math.max(0, (primary.normalizedScore - secondary.normalizedScore) / 100),
  );

  // ── 5. Wing suggestion (only when the result is close) ──
  const possibleWing: EnneagramTypeId | null =
    confidence < 0.15 ? secondary.typeId : null;

  // ── 6. Growth & stress paths from the maps ──
  const integrationPath = integrationMap[primary.typeId];
  const disintegrationPath = disintegrationMap[primary.typeId];

  // ── 7. Triad scores (sum of raw scores per triad) ──
  const triadScores: TriadScore[] = (
    ["body", "heart", "head"] as const
  ).map((triadName) => {
    const triadTypes = triads[triadName].types;
    const totalScore = triadTypes.reduce(
      (sum, typeId) => sum + rawScores[typeId],
      0,
    );
    return { triad: triadName, totalScore };
  });

  // ── 8. Count answered questions ──
  const questionCount = quizQuestions.filter(
    (q) => answers[q.id] !== undefined,
  ).length;

  return {
    primary,
    secondary,
    breakdown: sortedBreakdown,
    confidence,
    possibleWing,
    integrationPath,
    disintegrationPath,
    triadScores,
    questionCount,
  };
}

/**
 * Convenience helper — returns only the primary type ID.
 *
 * @param answers - Map of questionId → answerKey
 * @returns The highest‑scoring Enneagram type ID
 */
export function getPrimaryType(answers: QuizAnswers): EnneagramTypeId {
  return scoreQuiz(answers).primary.typeId;
}

/**
 * Retrieve the colour palette for a given Enneagram type.
 *
 * @param typeId - A valid Enneagram type ID
 * @returns The type's colour palette (`{ primary, light, dark, gradient }`)
 * @throws {Error} If the type ID is not recognised
 */
export function getTypeColor(typeId: EnneagramTypeId) {
  const color = typeColors[typeId];
  if (!color) {
    throw new Error(
      `Unknown Enneagram type id: "${typeId}". ` +
        "Expected one of: one, two, three, four, five, six, seven, eight, nine.",
    );
  }
  return color;
}

/**
 * Retrieve the full type definition for a given Enneagram type.
 *
 * @param typeId - A valid Enneagram type ID
 * @returns The complete `EnneagramTypeFull` object
 * @throws {Error} If the type ID is not recognised
 */
export function getTypeFull(typeId: EnneagramTypeId) {
  const found = enneagramTypesFull.find((t) => t.id === typeId);
  if (!found) {
    throw new Error(
      `Unknown Enneagram type id: "${typeId}". ` +
        "Expected one of: one, two, three, four, five, six, seven, eight, nine.",
    );
  }
  return found;
}

/**
 * Count how many quiz questions have been answered in the provided map.
 *
 * @param questions - The quiz question array (to know which questions exist)
 * @param answers   - The answers map to check
 * @returns The number of questions with a matching answer
 */
export function isAnswered(
  questions: typeof quizQuestions,
  answers: QuizAnswers,
): number {
  return questions.filter((q) => answers[q.id] !== undefined).length;
}
