import { describe, expect, it } from "vitest";
import { enneagramTypes, quizQuestions } from "@/data/enneagram";
import {
  enneagramTypesFull,
  integrationMap,
  disintegrationMap,
  typeColors,
  triads,
  instincts,
} from "@/data/enneagram-system";
import type { EnneagramTypeId } from "@/data/enneagram";

// ── Canonical Reference ─────────────────────────────────

const VALID_TYPE_IDS: EnneagramTypeId[] = [
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

const VALID_TYPE_ID_SET = new Set<string>(VALID_TYPE_IDS);

// ── Enneagram Types ─────────────────────────────────────

describe("enneagramTypes data model", () => {
  it("enneagramTypes has all 9 types", () => {
    expect(enneagramTypes).toHaveLength(9);
  });

  it("every type has all required fields", () => {
    for (const t of enneagramTypes) {
      expect(typeof t.id).toBe("string");
      expect(t.id.length).toBeGreaterThan(0);
      expect(typeof t.name).toBe("string");
      expect(t.name.length).toBeGreaterThan(0);
      expect(typeof t.headline).toBe("string");
      expect(t.headline.length).toBeGreaterThan(0);
      expect(typeof t.summary).toBe("string");
      expect(t.summary.length).toBeGreaterThan(0);
      expect(typeof t.growthTip).toBe("string");
      expect(t.growthTip.length).toBeGreaterThan(0);
    }
  });

  it("enneagramTypes IDs match the canonical set", () => {
    const ids = enneagramTypes.map((t) => t.id);
    for (const id of ids) {
      expect(VALID_TYPE_ID_SET.has(id)).toBe(true);
    }
  });
});

// ── Quiz Questions ──────────────────────────────────────

describe("quizQuestions data model", () => {
  it("quizQuestions has 15 items", () => {
    expect(quizQuestions).toHaveLength(15);
  });

  it("every question has 4 answers", () => {
    for (const q of quizQuestions) {
      expect(q.answers).toHaveLength(4);
    }
  });

  it("every answer has exactly 2 weights", () => {
    for (const q of quizQuestions) {
      for (const a of q.answers) {
        expect(Object.keys(a.weights)).toHaveLength(2);
      }
    }
  });

  it("every weight value is 1 or 2", () => {
    for (const q of quizQuestions) {
      for (const a of q.answers) {
        for (const value of Object.values(a.weights)) {
          expect(value === 1 || value === 2).toBe(true);
        }
      }
    }
  });

  it("all type IDs are valid EnneagramTypeId", () => {
    for (const q of quizQuestions) {
      for (const a of q.answers) {
        for (const key of Object.keys(a.weights)) {
          expect(VALID_TYPE_ID_SET.has(key)).toBe(true);
        }
      }
    }
  });

  it("no duplicate answer IDs within a question", () => {
    for (const q of quizQuestions) {
      const ids = q.answers.map((a) => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    }
  });
});

// ── Full Enneagram System Types ─────────────────────────

describe("enneagramTypesFull data model", () => {
  it("enneagramTypesFull has all 9 types", () => {
    expect(enneagramTypesFull).toHaveLength(9);
  });

  it("each full type has all critical fields", () => {
    for (const t of enneagramTypesFull) {
      // Core textual fields are non-empty strings
      expect(typeof t.coreFear).toBe("string");
      expect(t.coreFear.length).toBeGreaterThan(0);
      expect(typeof t.coreDesire).toBe("string");
      expect(t.coreDesire.length).toBeGreaterThan(0);
      expect(typeof t.coreWeakness).toBe("string");
      expect(t.coreWeakness.length).toBeGreaterThan(0);
      expect(typeof t.virtue).toBe("string");
      expect(t.virtue.length).toBeGreaterThan(0);

      // Integration / disintegration are valid type IDs
      expect(VALID_TYPE_ID_SET.has(t.integrationType)).toBe(true);
      expect(VALID_TYPE_ID_SET.has(t.disintegrationType)).toBe(true);

      // Wing options: exactly 2 valid IDs
      expect(t.wingOptions).toHaveLength(2);
      for (const wing of t.wingOptions) {
        expect(VALID_TYPE_ID_SET.has(wing)).toBe(true);
      }

      // List fields have minimum required length
      expect(t.strengths.length).toBeGreaterThanOrEqual(3);
      expect(t.challenges.length).toBeGreaterThanOrEqual(3);
      expect(t.famousExamples.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("enneagramTypesFull IDs match the canonical set", () => {
    const ids = enneagramTypesFull.map((t) => t.id);
    for (const id of ids) {
      expect(VALID_TYPE_ID_SET.has(id)).toBe(true);
    }
  });
});

// ── Integration / Disintegration Maps ───────────────────

describe("integration and disintegration maps", () => {
  it("integrationMap is a bijection", () => {
    const targets = new Set<EnneagramTypeId>();

    for (const typeId of VALID_TYPE_IDS) {
      const target = integrationMap[typeId];
      // Maps to a DIFFERENT type
      expect(target).not.toBe(typeId);
      // Each target is unique (injective)
      expect(targets.has(target)).toBe(false);
      targets.add(target);
    }

    // All 9 types are covered in domain and codomain
    expect(targets.size).toBe(9);
  });

  it("disintegrationMap is a bijection", () => {
    const targets = new Set<EnneagramTypeId>();

    for (const typeId of VALID_TYPE_IDS) {
      const target = disintegrationMap[typeId];
      expect(target).not.toBe(typeId);
      expect(targets.has(target)).toBe(false);
      targets.add(target);
    }

    expect(targets.size).toBe(9);
  });

  it("integration and disintegration follow the known Enneagram Arrow sequence", () => {
    // Integration sequence: 1 → 7 → 5 → 8 → 2 → 4 → 1
    const integrationSequence: EnneagramTypeId[] = [
      "one",
      "seven",
      "five",
      "eight",
      "two",
      "four",
      "one",
    ];

    for (let i = 0; i < integrationSequence.length - 1; i++) {
      expect(integrationMap[integrationSequence[i]]).toBe(
        integrationSequence[i + 1],
      );
    }

    // Disintegration sequence: 1 → 4 → 2 → 8 → 5 → 7 → 1
    const disintegrationSequence: EnneagramTypeId[] = [
      "one",
      "four",
      "two",
      "eight",
      "five",
      "seven",
      "one",
    ];

    for (let i = 0; i < disintegrationSequence.length - 1; i++) {
      expect(disintegrationMap[disintegrationSequence[i]]).toBe(
        disintegrationSequence[i + 1],
      );
    }

    // Verify the secondary cycle (3-6-9) for both maps
    expect(integrationMap["three"]).toBe("six");
    expect(integrationMap["six"]).toBe("nine");
    expect(integrationMap["nine"]).toBe("three");

    expect(disintegrationMap["three"]).toBe("nine");
    expect(disintegrationMap["nine"]).toBe("six");
    expect(disintegrationMap["six"]).toBe("three");
  });
});

// ── Colors ──────────────────────────────────────────────

describe("typeColors", () => {
  it("typeColors covers all 9 types", () => {
    for (const typeId of VALID_TYPE_IDS) {
      const color = typeColors[typeId];
      expect(color).toBeDefined();
      expect(typeof color.primary).toBe("string");
      expect(color.primary.length).toBeGreaterThan(0);
      expect(typeof color.light).toBe("string");
      expect(color.light.length).toBeGreaterThan(0);
      expect(typeof color.dark).toBe("string");
      expect(color.dark.length).toBeGreaterThan(0);
      expect(typeof color.gradient).toBe("string");
      expect(color.gradient.length).toBeGreaterThan(0);
    }
  });
});

// ── Triads ──────────────────────────────────────────────

describe("triads", () => {
  it("triads contains body, heart, head", () => {
    expect(triads).toHaveProperty("body");
    expect(triads).toHaveProperty("heart");
    expect(triads).toHaveProperty("head");
  });

  it("each triad has the expected shape", () => {
    for (const triad of Object.values(triads)) {
      expect(typeof triad.name).toBe("string");
      expect(triad.name.length).toBeGreaterThan(0);
      expect(typeof triad.center).toBe("string");
      expect(triad.center.length).toBeGreaterThan(0);
      expect(typeof triad.emotion).toBe("string");
      expect(triad.emotion.length).toBeGreaterThan(0);
      expect(Array.isArray(triad.types)).toBe(true);
      expect(triad.types.length).toBeGreaterThan(0);
      expect(typeof triad.description).toBe("string");
      expect(triad.description.length).toBeGreaterThan(0);
      expect(typeof triad.color).toBe("string");
      expect(triad.color.length).toBeGreaterThan(0);
    }
  });

  it("body triad contains eight, nine, one", () => {
    expect(triads.body.types).toEqual(["eight", "nine", "one"]);
  });

  it("heart triad contains two, three, four", () => {
    expect(triads.heart.types).toEqual(["two", "three", "four"]);
  });

  it("head triad contains five, six, seven", () => {
    expect(triads.head.types).toEqual(["five", "six", "seven"]);
  });

  it("each type appears in exactly one triad", () => {
    const allTriadTypes = [
      ...triads.body.types,
      ...triads.heart.types,
      ...triads.head.types,
    ];
    expect(allTriadTypes).toHaveLength(9);

    const uniqueTypes = new Set(allTriadTypes);
    expect(uniqueTypes.size).toBe(9);
  });
});

// ── Instincts ───────────────────────────────────────────

describe("instincts", () => {
  it("instincts contains all 3 variants", () => {
    expect(instincts).toHaveProperty("self-preservation");
    expect(instincts).toHaveProperty("social");
    expect(instincts).toHaveProperty("sexual");
  });

  it("each instinct has name, description, and focus", () => {
    for (const instinct of Object.values(instincts)) {
      expect(typeof instinct.name).toBe("string");
      expect(instinct.name.length).toBeGreaterThan(0);
      expect(typeof instinct.description).toBe("string");
      expect(instinct.description.length).toBeGreaterThan(0);
      expect(typeof instinct.focus).toBe("string");
      expect(instinct.focus.length).toBeGreaterThan(0);
    }
  });
});
