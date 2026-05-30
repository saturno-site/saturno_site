import { describe, expect, it } from "vitest";
import { scoreQuiz } from "@/lib/scoring-engine";

describe("Enneagram quiz scoring", () => {
  it("returns the strongest type based on answered weights", () => {
    const answers = {
      1: "a",
      2: "a",
      3: "a",
      4: "a",
      5: "a",
      6: "a",
      7: "a",
      8: "a",
      9: "a",
      10: "a",
      11: "a",
      12: "a",
      13: "a",
      14: "a",
      15: "a",
    };

    const result = scoreQuiz(answers);

    // With all "a" answers, type "one" should be highest (10 raw points)
    expect(result.primary.typeId).toBe("one");
    expect(result.primary.rawScore).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.breakdown).toHaveLength(9);

    // Verify all 9 type IDs are present in the breakdown
    const typeIds = result.breakdown.map((t) => t.typeId).sort();
    expect(typeIds).toEqual([
      "eight",
      "five",
      "four",
      "nine",
      "one",
      "seven",
      "six",
      "three",
      "two",
    ]);
  });

  it("correctly identifies a targeted type with optimal answer pattern", () => {
    // This answer pattern maximises type "four" across all 15 questions.
    // Question 10 has no "four" weight in any answer (all give 0), so any
    // answer works — "a" is chosen as a neutral filler.
    // Pattern: b,c,c,a,c,c,d,c,c,a,a,b,c,b,a
    const answers = {
      1: "b",  // four:1 (b: stay open — four:1)
      2: "c",  // four:2 (c: express individuality — four:2)
      3: "c",  // four:1 (c: quality time — two:2, four:1)
      4: "a",  // four:1 (a: critical/perfectionistic — one:2, four:1)
      5: "c",  // four:1 (c: insightful/calm — five:2, four:1)
      6: "c",  // four:2 (c: authentic self — four:2, one:1)
      7: "d",  // four:1 (d: bold/commanding — eight:2, four:1)
      8: "c",  // four:2 (c: create beauty — four:2, seven:1)
      9: "c",  // four:2 (c: reflecting/journalling — four:2, two:1)
      10: "a", // four:0 (no four weight in any answer — neutral fill)
      11: "a", // four:2 (a: emotional honesty — four:2, one:1)
      12: "b", // four:1 (b: slow/present — nine:2, four:1)
      13: "c", // four:2 (c: step back/process — four:2, five:1)
      14: "b", // four:2 (b: not special enough — four:2, three:1)
      15: "a", // four:0 (a: care/loyalty — two:2, six:1; four gets 0)
    };

    const result = scoreQuiz(answers);

    expect(result.primary.typeId).toBe("four");
    expect(result.primary.rawScore).toBeGreaterThan(0);
    expect(result.breakdown).toHaveLength(9);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);

    // Type four should have a clear margin over second place
    const first = result.breakdown[0];
    const second = result.breakdown[1];
    expect(first.normalizedScore).toBeGreaterThan(second.normalizedScore);
    expect(first.typeId).toBe("four");
  });
});
