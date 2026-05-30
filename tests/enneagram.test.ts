import { describe, expect, it } from "vitest";
import { scoreQuiz } from "@/lib/enneagram";

describe("Enneagram quiz scoring", () => {
  it("returns the strongest type based on answered weights", () => {
    const answers = {
      1: "a",
      2: "a",
      3: "a",
      4: "a",
      5: "a",
    };

    const result = scoreQuiz(answers);

    expect(result.selectedType).toBe("one");
    expect(result.score).toBeGreaterThan(0);
    expect(result.breakdown.one).toBeGreaterThan(0);
  });
});
