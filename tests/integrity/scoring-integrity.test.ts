import { describe, expect, it } from "vitest";
import { scoreQuiz } from "@/lib/scoring-engine";
import { quizQuestions } from "@/data/enneagram";

// ── Canonical Reference ─────────────────────────────────

const VALID_TYPE_IDS = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
] as const;

const VALID_TYPE_ID_SET = new Set<string>(VALID_TYPE_IDS);

// ── Helpers ─────────────────────────────────────────────

/** All "a" answers — deterministic, maximises type One. */
const ALL_A_ANSWERS: Record<number, string> = Object.fromEntries(
  quizQuestions.map((q) => [q.id, "a"]),
);

/** Build answers by mapping each question's index to the same answer char. */
function uniformAnswers(answerId: string): Record<number, string> {
  return Object.fromEntries(quizQuestions.map((q) => [q.id, answerId]));
}

// ── Tests ───────────────────────────────────────────────

describe("scoreQuiz invariants", () => {
  it("empty answers returns default result", () => {
    const result = scoreQuiz({});

    expect(result.primary.typeId).toBe("one");
    expect(result.breakdown).toHaveLength(9);
    expect(result.confidence).toBe(0);
  });

  it("all 'a' answers gives deterministic result", () => {
    const first = scoreQuiz(ALL_A_ANSWERS);
    const second = scoreQuiz(ALL_A_ANSWERS);

    expect(first.primary.typeId).toBe(second.primary.typeId);
    expect(first.breakdown).toEqual(second.breakdown);
  });

  it("confidence is always in [0, 1]", () => {
    const answerSets = [
      {},
      uniformAnswers("a"),
      uniformAnswers("b"),
      uniformAnswers("c"),
      uniformAnswers("d"),
      { 1: "a", 2: "b", 3: "c", 4: "d" },
      { 5: "c", 10: "b", 15: "a" },
      Object.fromEntries(quizQuestions.map((q) => [q.id, String.fromCharCode(97 + (q.id % 4))])),
    ];

    for (const answers of answerSets) {
      const result = scoreQuiz(answers);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    }
  });

  it("breakdown contains all 9 types", () => {
    const result = scoreQuiz(ALL_A_ANSWERS);

    expect(result.breakdown).toHaveLength(9);

    const typeIds = result.breakdown.map((t) => t.typeId);
    const uniqueIds = new Set(typeIds);
    expect(uniqueIds.size).toBe(9);

    for (const id of VALID_TYPE_IDS) {
      expect(uniqueIds.has(id)).toBe(true);
    }
  });

  it("normalizedScore is in [0, 100]", () => {
    const answerSets = [
      {},
      uniformAnswers("a"),
      uniformAnswers("b"),
      uniformAnswers("c"),
      uniformAnswers("d"),
      { 1: "a", 2: "c", 3: "b" },
    ];

    for (const answers of answerSets) {
      const result = scoreQuiz(answers);
      for (const typeScore of result.breakdown) {
        expect(typeScore.normalizedScore).toBeGreaterThanOrEqual(0);
        expect(typeScore.normalizedScore).toBeLessThanOrEqual(100);
      }
    }
  });

  it("normalized scores sum to a reasonable range", () => {
    const result = scoreQuiz(ALL_A_ANSWERS);

    const sum = result.breakdown.reduce(
      (acc, t) => acc + t.normalizedScore,
      0,
    );

    // Sum must be > 0 (some types scored) and < 900 (max 100 per type × 9)
    expect(sum).toBeGreaterThan(0);
    expect(sum).toBeLessThan(900);
  });

  it("integrationPath and disintegrationPath are valid type IDs", () => {
    const answerSets = [
      {},
      uniformAnswers("a"),
      uniformAnswers("b"),
      uniformAnswers("c"),
      uniformAnswers("d"),
      { 1: "b", 3: "c" },
    ];

    for (const answers of answerSets) {
      const result = scoreQuiz(answers);
      expect(VALID_TYPE_ID_SET.has(result.integrationPath)).toBe(true);
      expect(VALID_TYPE_ID_SET.has(result.disintegrationPath)).toBe(true);
    }
  });

  it("possibleWing is either null or a valid typeId", () => {
    const answerSets = [
      {},
      uniformAnswers("a"),
      uniformAnswers("b"),
      { 1: "a", 2: "c" },
    ];

    for (const answers of answerSets) {
      const result = scoreQuiz(answers);
      if (result.possibleWing === null) {
        expect(result.possibleWing).toBeNull();
      } else {
        expect(VALID_TYPE_ID_SET.has(result.possibleWing)).toBe(true);
      }
    }
  });

  it("triadScores has 3 entries", () => {
    const result = scoreQuiz(ALL_A_ANSWERS);

    expect(result.triadScores).toHaveLength(3);

    const triadNames = result.triadScores.map((t) => t.triad).sort();
    expect(triadNames).toEqual(["body", "head", "heart"]);
  });
});

// ── Confidence Edge Cases ───────────────────────────────

describe("scoreQuiz confidence edge cases", () => {
  it("single answered question yields low confidence", () => {
    const result = scoreQuiz({ 1: "a" });

    // With only 1 of 15 questions answered, the score spread is minimal
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThan(0.2);
    expect(result.questionCount).toBe(1);
  });

  it("all 15 questions answered yields relatively higher confidence", () => {
    const result = scoreQuiz(ALL_A_ANSWERS);

    // A uniform answer pattern should give a decisive enough result
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.questionCount).toBe(15);
  });

  it("partial answers give lower confidence than full answers", () => {
    const partial = scoreQuiz({ 1: "a", 2: "b", 3: "c" });
    const full = scoreQuiz(ALL_A_ANSWERS);

    // Answering all questions provides more data → confidence should be >=
    expect(full.confidence).toBeGreaterThanOrEqual(partial.confidence);
  });
});

// ── Result Shape Invariants ─────────────────────────────

describe("QuizResult shape invariants", () => {
  it("every TypeScore has the expected shape", () => {
    const result = scoreQuiz(ALL_A_ANSWERS);

    for (const ts of result.breakdown) {
      expect(ts).toHaveProperty("typeId");
      expect(ts).toHaveProperty("rawScore");
      expect(ts).toHaveProperty("normalizedScore");
      expect(typeof ts.rawScore).toBe("number");
      expect(ts.rawScore).toBeGreaterThanOrEqual(0);
    }
  });

  it("primary and secondary are first two breakdown entries", () => {
    const result = scoreQuiz(ALL_A_ANSWERS);

    expect(result.primary).toBe(result.breakdown[0]);
    expect(result.secondary).toBe(result.breakdown[1]);
  });

  it("questionCount matches number of answered questions", () => {
    const answers = { 1: "a", 3: "b", 5: "c", 7: "d", 9: "a" };
    const result = scoreQuiz(answers);

    expect(result.questionCount).toBe(5);
  });

  it("breakdown is sorted descending by normalizedScore", () => {
    const result = scoreQuiz(ALL_A_ANSWERS);
    const scores = result.breakdown.map((t) => t.normalizedScore);

    for (let i = 1; i < scores.length; i++) {
      expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i]);
    }
  });

  it("secondary is always the second-highest type", () => {
    const result = scoreQuiz(ALL_A_ANSWERS);

    const breakdownSorted = [...result.breakdown].sort(
      (a, b) => b.normalizedScore - a.normalizedScore,
    );
    expect(result.secondary).toBe(breakdownSorted[1]);
  });
});
