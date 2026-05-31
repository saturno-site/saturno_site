import { describe, expect, it, beforeEach } from "vitest";
import {
  saveQuizResult,
  loadLatestResult,
  loadHistory,
  clearResult,
} from "@/lib/quizStorage";
import { scoreQuiz } from "@/lib/scoring-engine";
import { quizQuestions } from "@/data/enneagram";

// ── Helpers ─────────────────────────────────────────────

/** All "a" answers — deterministic result used across tests. */
const ALL_A_ANSWERS: Record<number, string> = Object.fromEntries(
  quizQuestions.map((q) => [q.id, "a"]),
);

const ALL_B_ANSWERS: Record<number, string> = Object.fromEntries(
  quizQuestions.map((q) => [q.id, "b"]),
);

// ── Setup ───────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
});

describe("quizStorage lifecycle", () => {
  it("save and load return identical result", () => {
    const result = scoreQuiz(ALL_A_ANSWERS);

    saveQuizResult(result);

    const loaded = loadLatestResult();
    expect(loaded).not.toBeNull();
    expect(loaded!.primary.typeId).toBe(result.primary.typeId);
    expect(loaded!.breakdown).toHaveLength(9);
    expect(loaded!.confidence).toBe(result.confidence);
  });

  it("history returns results in order", () => {
    const resultA = scoreQuiz(ALL_A_ANSWERS);
    const resultB = scoreQuiz(ALL_B_ANSWERS);

    saveQuizResult(resultA);
    saveQuizResult(resultB);

    const history = loadHistory();
    expect(history).toHaveLength(1);

    // The first result (A) should have been archived when B was saved
    expect(history[0].primary.typeId).toBe(resultA.primary.typeId);
  });

  it("clearResult empties storage", () => {
    const result = scoreQuiz(ALL_A_ANSWERS);

    saveQuizResult(result);
    expect(loadLatestResult()).not.toBeNull();

    clearResult();
    expect(loadLatestResult()).toBeNull();

    // History should remain untouched by clearResult
    expect(loadHistory()).toEqual([]);
  });

  it("saveQuizResult is idempotent", () => {
    const result = scoreQuiz(ALL_A_ANSWERS);

    // First save: sets latest (no prior result to archive)
    saveQuizResult(result);
    // Second save: archives previous, sets latest again
    saveQuizResult(result);
    // Third save: archives previous again
    saveQuizResult(result);

    // After 3 saves of the same result, history holds 2 archived entries
    expect(loadHistory()).toHaveLength(2);

    // Latest result should still be the original
    const latest = loadLatestResult();
    expect(latest).not.toBeNull();
    expect(latest!.primary.typeId).toBe(result.primary.typeId);
  });
});

describe("quizStorage boundary conditions", () => {
  it("loadLatestResult returns null when nothing saved", () => {
    expect(loadLatestResult()).toBeNull();
  });

  it("loadHistory returns empty array when nothing saved", () => {
    expect(loadHistory()).toEqual([]);
  });

  it("history does not persist latest result across saves", () => {
    // Verify history is not modified on first save (no prior value)
    const result = scoreQuiz(ALL_A_ANSWERS);
    saveQuizResult(result);

    expect(loadHistory()).toEqual([]);
    expect(loadLatestResult()).not.toBeNull();
  });

  it("clearing then saving writes a fresh result", () => {
    const resultA = scoreQuiz(ALL_A_ANSWERS);
    const resultB = scoreQuiz(ALL_B_ANSWERS);

    saveQuizResult(resultA);
    clearResult();
    saveQuizResult(resultB);

    const latest = loadLatestResult();
    expect(latest).not.toBeNull();
    expect(latest!.primary.typeId).toBe(resultB.primary.typeId);
  });
});
