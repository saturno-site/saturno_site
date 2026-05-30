# Modern Enneagram Experience Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Research Enneagram logic deeply enough to build a trustworthy, modern, animated, fun personality-test experience for the Saturno website.

**Architecture:** Keep the scoring engine rule-based and transparent. Separate Enneagram knowledge, quiz items, scoring, animation UI, and results storytelling into small typed modules. Build a narrative “personality constellation” flow: users make situational choices, watch the enneagram graph react live, and receive a layered result with core type, likely wing, center, stress/growth paths, and playful next steps.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Vitest, CSS/SVG animations first; optional Framer Motion only if CSS/SVG cannot deliver the target motion quality.

---

## Research summary to guide product design

Use the Enneagram as a self-reflection model, not a clinical diagnosis.

Important logic:
- 9 core types, each centered on motivation, fear, desire, attention pattern, and coping strategy.
- Centers / triads:
  - Body / instinct: 8, 9, 1. Core theme: anger, autonomy, boundaries, control.
  - Heart / feeling: 2, 3, 4. Core theme: shame, image, love, identity.
  - Head / thinking: 5, 6, 7. Core theme: fear, security, planning, possibility.
- Wings: adjacent types flavor the core type, e.g. 4w3 or 4w5. Treat as secondary signal, not a separate main result.
- Stress and growth lines: each type has two connected movement paths. Present these as “when pressured” and “when grounded,” not deterministic truth.
- Instincts / subtypes: self-preservation, social, one-to-one. Good phase-2 enhancement, not required for first launch.
- Reliability caveat: empirical literature is mixed. The UI should say “reflection tool” and “likely pattern,” avoid “you are definitely X.”

Useful source directions:
- Truity technical document: large-scale psychometric framing, Cronbach alpha, construct validity language.
- OpenPsychometrics OEPS development notes: item-keying, multi-key scoring, limitations.
- Enneagram Institute / common Enneagram references: centers, wings, stress/growth lines.
- Psychiatry primer / systematic review: motivation/fear/desire framing and evidence caveats.

Product opportunity:
Most Enneagram tests are boring forms. Saturno can win by making the test feel like a cosmic story / animated self-discovery game while keeping the scoring honest and transparent.

---

## Current-state findings

Existing repo already has:
- `saturno/data/enneagram.ts`: basic type summaries and short multiple-choice questions.
- `saturno/lib/enneagram.ts`: simple weighted scoring, returning only top type.
- `saturno/components/quiz/QuizApp.tsx`: client quiz flow with basic cards and result.
- `saturno/tests/enneagram.test.ts`: current scoring tests.
- `saturno/app/page.tsx` and `saturno/app/quiz/page.tsx`: landing and quiz route.

Main gaps:
- Knowledge base is too shallow: no fears/desires, centers, wings, stress/growth, instincts, caveats, result depth.
- Scoring is too simple: no normalized percentages, ties, wing detection, center signal, confidence level, secondary types.
- UX is ordinary: static question cards, no narrative, no live animated enneagram, no reward loops.
- No data model for research-backed content or source notes.

---

## Target experience concept: “Saturno Type Orbit”

The test should feel like piloting through 9 personality planets.

Core interaction ideas:
1. Animated enneagram constellation
   - SVG 9-point enneagram ring.
   - Each answer sends glowing particles toward weighted types.
   - Nodes brighten as scores accumulate.
   - Center triads pulse in different colors.

2. Scenario-first questions
   - Replace generic prompts with tiny life scenes: conflict, praise, uncertainty, collaboration, boredom, pressure, intimacy, failure, success.
   - Each question offers 4-5 choices that map to motivations, not stereotypes.
   - Copy feels like a story, not an exam.

3. “Pattern lens” progress
   - Instead of just “Question 4/18,” show live but subtle signals:
     - Head / Heart / Body balance.
     - “Your orbit is forming…”
     - Avoid revealing likely type too early to reduce answer gaming.

4. Results as a reveal sequence
   - First reveal: “Your strongest orbit: Type X.”
   - Then wing reveal: “Your flavor: XwY.”
   - Then center reveal: “You process through Head/Heart/Body first.”
   - Then stress/growth animation along enneagram lines.
   - Then actionable cards: strength, blind spot, growth experiment, relationship tip, work tip.

5. Fun out-of-box extras
   - Type avatar / planet: each type gets icon, gradient, micro-animation.
   - “Shadow weather”: result card shows how user behaves under pressure.
   - “Growth quest”: one 7-day micro-challenge based on type.
   - Share card: generated text/visual summary, no private answers exposed.
   - Optional “compare with a friend” code later.

Accessibility / trust:
- Respect `prefers-reduced-motion`.
- Keyboard-first answer selection.
- ARIA labels on animated graph.
- Copy says “likely pattern,” “reflection,” and “not a diagnosis.”

---

## Data contract

Create/extend these types in `saturno/data/enneagram.ts` or split into `saturno/data/enneagramKnowledge.ts`:

```ts
export type EnneagramTypeId = "one" | "two" | "three" | "four" | "five" | "six" | "seven" | "eight" | "nine";
export type EnneagramCenter = "body" | "heart" | "head";
export type Instinct = "selfPreservation" | "social" | "oneToOne";

export type EnneagramType = {
  id: EnneagramTypeId;
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  name: string;
  archetype: string;
  center: EnneagramCenter;
  coreFear: string;
  coreDesire: string;
  motivation: string;
  attentionPattern: string;
  strength: string;
  blindSpot: string;
  growthTip: string;
  relationshipTip: string;
  workTip: string;
  stressType: EnneagramTypeId;
  growthType: EnneagramTypeId;
  wings: [EnneagramTypeId, EnneagramTypeId];
  color: string;
  gradient: string;
  symbol: string;
  sourceNotes: string[];
};

export type QuizAnswer = {
  id: string;
  label: string;
  microcopy?: string;
  weights: Partial<Record<EnneagramTypeId, number>>;
  centerWeights?: Partial<Record<EnneagramCenter, number>>;
  instinctWeights?: Partial<Record<Instinct, number>>;
};

export type QuizQuestion = {
  id: number;
  scene: string;
  prompt: string;
  intent: "motivation" | "stress" | "conflict" | "connection" | "work" | "uncertainty" | "joy";
  answers: QuizAnswer[];
};
```

Scoring result contract in `saturno/lib/enneagram.ts`:

```ts
export type QuizScore = {
  selectedType: EnneagramTypeId;
  wing: EnneagramTypeId | null;
  confidence: "low" | "medium" | "high";
  topTypes: Array<{ type: EnneagramTypeId; score: number; percent: number }>;
  breakdown: Record<EnneagramTypeId, number>;
  centerBreakdown: Record<EnneagramCenter, number>;
  instinctBreakdown?: Record<Instinct, number>;
};
```

---

## Phased task plan

### Phase 1: Research and knowledge base

#### Task 1: Create research notes document

**Objective:** Capture trustworthy Enneagram logic and caveats before coding.

**Files:**
- Create: `saturno/docs/research/enneagram-logic.md`

**Steps:**
1. Create the research doc with sections:
   - Nine types
   - Centers / triads
   - Wings
   - Stress/growth lines
   - Instincts / subtypes
   - Scoring design implications
   - Scientific caveats and copy rules
   - Source links
2. Include source links found above.
3. Add a “Do not claim” list:
   - No clinical diagnosis.
   - No deterministic life prediction.
   - No hiring/medical/therapy suitability claims.
4. Verify file exists.

**Run:** `test -f docs/research/enneagram-logic.md`
**Expected:** exit 0.

#### Task 2: Expand Enneagram type knowledge data

**Objective:** Give every type enough structured content for rich results.

**Files:**
- Modify: `saturno/data/enneagram.ts`
- Test: `saturno/tests/enneagram.test.ts`

**Steps:**
1. Add fields from the `EnneagramType` contract above.
2. Fill all 9 types with core fear, desire, motivation, attention pattern, strength, blind spot, relationship tip, work tip, stress/growth type, wings, visual tokens.
3. Add tests that assert all 9 types have required fields and valid references.
4. Run tests.

**Run:** `npm run test -- enneagram`
**Expected:** tests pass.

#### Task 3: Replace shallow quiz questions with scenario questions

**Objective:** Make questions measure motivation through situations, not generic labels.

**Files:**
- Modify: `saturno/data/enneagram.ts`
- Test: `saturno/tests/enneagram.test.ts`

**Steps:**
1. Create 18 questions minimum.
2. Each type should receive meaningful primary weights across at least 4 questions.
3. Each center should be represented across the set.
4. Add tests:
   - every question has 4-5 answers;
   - every answer has at least one positive type weight;
   - every type can win in a synthetic answer path;
   - no type is underrepresented.
5. Run tests.

**Run:** `npm run test -- enneagram`
**Expected:** tests pass.

---

### Phase 2: Scoring engine

#### Task 4: Add normalized scoring, top types, confidence

**Objective:** Move from raw winner-only scoring to explainable ranked scoring.

**Files:**
- Modify: `saturno/lib/enneagram.ts`
- Test: `saturno/tests/enneagram.test.ts`

**Steps:**
1. Update `scoreQuiz` to calculate raw breakdown.
2. Convert raw scores to percentages of total assigned points.
3. Return top 3 types sorted descending.
4. Confidence rules:
   - high: top score >= 15% above second;
   - medium: top score >= 7% above second;
   - low: otherwise.
5. Keep deterministic tie-breaks by stable type order.
6. Add tests for top sorting, percentages, confidence, and ties.
7. Run tests.

**Run:** `npm run test -- enneagram`
**Expected:** tests pass.

#### Task 5: Add wing and center detection

**Objective:** Return likely wing and center signal without overclaiming.

**Files:**
- Modify: `saturno/lib/enneagram.ts`
- Test: `saturno/tests/enneagram.test.ts`

**Steps:**
1. Wing = higher scoring adjacent type of selected core type.
2. If both wings are tied or both weak, return `null`.
3. Add center breakdown from type scores and explicit center weights when available.
4. Add tests for Type 4 choosing 4w3 vs 4w5, Type 9 choosing 9w8 vs 9w1, and null tie case.
5. Run tests.

**Run:** `npm run test -- enneagram`
**Expected:** tests pass.

---

### Phase 3: Animated visual system

#### Task 6: Create EnneagramConstellation component

**Objective:** Render the live animated 9-point enneagram graph.

**Files:**
- Create: `saturno/components/quiz/EnneagramConstellation.tsx`
- Create: `saturno/components/quiz/EnneagramConstellation.test.tsx` if test setup supports React rendering; otherwise test helpers only.

**Steps:**
1. Build SVG ring with 9 positioned nodes.
2. Draw classic enneagram internal lines.
3. Accept props:
   - `breakdown`
   - `activeTypes`
   - `selectedType?`
   - `reducedMotion?`
4. Node opacity/scale should depend on score.
5. Add accessible text labels for each node.
6. Use Tailwind/CSS keyframes, not heavy libraries yet.
7. Verify component imports without type errors.

**Run:** `npm run typecheck`
**Expected:** no TypeScript errors.

#### Task 7: Add answer “energy pulse” animation

**Objective:** Make each answer visibly affect the constellation.

**Files:**
- Modify: `saturno/components/quiz/QuizApp.tsx`
- Modify: `saturno/components/quiz/EnneagramConstellation.tsx`
- Modify: `saturno/app/globals.css` if keyframes are needed.

**Steps:**
1. Track last selected answer weights in QuizApp state.
2. Pass active weighted types to constellation.
3. Animate weighted nodes for 600-900ms after selection.
4. Respect `prefers-reduced-motion` with no particle movement.
5. Verify with keyboard and mouse.

**Run:** `npm run typecheck && npm run lint`
**Expected:** both pass.

#### Task 8: Create animated progress/orbit UI

**Objective:** Replace plain progress with memorable “orbit forming” feedback.

**Files:**
- Create: `saturno/components/quiz/QuizProgressOrbit.tsx`
- Modify: `saturno/components/quiz/QuizApp.tsx`

**Steps:**
1. Render circular progress based on answered count.
2. Show current scene name and question number.
3. Show subtle Head/Heart/Body balance bars only after 4+ answered questions.
4. Do not reveal predicted type before submission.
5. Verify mobile layout.

**Run:** `npm run typecheck`
**Expected:** no TypeScript errors.

---

### Phase 4: Quiz UX rewrite

#### Task 9: Split QuizApp into small components

**Objective:** Make quiz UI maintainable before adding heavier interactions.

**Files:**
- Modify: `saturno/components/quiz/QuizApp.tsx`
- Create: `saturno/components/quiz/QuestionCard.tsx`
- Create: `saturno/components/quiz/AnswerOption.tsx`
- Create: `saturno/components/quiz/QuizShell.tsx`

**Steps:**
1. Move outer layout to QuizShell.
2. Move question prompt and answers to QuestionCard.
3. Move answer button to AnswerOption.
4. Preserve existing behavior.
5. Run typecheck/lint/tests.

**Run:** `npm run typecheck && npm run lint && npm run test`
**Expected:** all pass.

#### Task 10: Add cinematic intro screen

**Objective:** Start the experience with story and trust, not a form.

**Files:**
- Modify: `saturno/components/quiz/QuizApp.tsx`
- Create: `saturno/components/quiz/QuizIntro.tsx`

**Steps:**
1. Add intro state before first question.
2. Copy:
   - “Map your inner orbit.”
   - “18 quick scenarios. No right answers. Just patterns.”
   - “This is a reflection tool, not a diagnosis.”
3. CTA: “Begin orbit scan.”
4. Include a mini animated enneagram preview.
5. Run typecheck.

**Run:** `npm run typecheck`
**Expected:** pass.

#### Task 11: Improve answer interactions

**Objective:** Make choices feel tactile and game-like.

**Files:**
- Modify: `saturno/components/quiz/AnswerOption.tsx`
- Modify: `saturno/components/quiz/QuestionCard.tsx`

**Steps:**
1. Add hover lift, selected glow, keyboard focus ring.
2. Add optional microcopy line per answer.
3. Add number keys 1-5 as shortcuts if simple to implement.
4. Add “why this matters” tiny line per scene, not per type.
5. Verify keyboard-only path.

**Run:** `npm run lint && npm run typecheck`
**Expected:** pass.

---

### Phase 5: Result experience

#### Task 12: Create ResultReveal component

**Objective:** Turn final result into a staged animated reveal.

**Files:**
- Create: `saturno/components/quiz/ResultReveal.tsx`
- Modify: `saturno/components/quiz/QuizApp.tsx`

**Steps:**
1. Accept full `QuizScore` and selected type details.
2. Show staged sections:
   - core type;
   - likely wing;
   - confidence language;
   - center;
   - top 3 bars;
   - stress/growth line.
3. Use “likely” language if confidence is low/medium.
4. Include retake button.
5. Run typecheck.

**Run:** `npm run typecheck`
**Expected:** pass.

#### Task 13: Add GrowthQuest cards

**Objective:** Make the result useful and fun after the reveal.

**Files:**
- Create: `saturno/components/quiz/GrowthQuestCards.tsx`
- Modify: `saturno/data/enneagram.ts`
- Modify: `saturno/components/quiz/ResultReveal.tsx`

**Steps:**
1. Add 3 cards:
   - “Your superpower” from strength.
   - “Shadow weather” from blindSpot / stressType.
   - “7-day growth quest” from growthTip.
2. Add relationship and work mini tips.
3. Avoid generic Barnum copy; make each type specific.
4. Run typecheck.

**Run:** `npm run typecheck`
**Expected:** pass.

#### Task 14: Add shareable summary copy

**Objective:** Let users share results safely and virally.

**Files:**
- Create: `saturno/lib/share.ts`
- Modify: `saturno/components/quiz/ResultReveal.tsx`
- Test: `saturno/tests/share.test.ts`

**Steps:**
1. Generate share text without exposing answers.
2. Include type, wing if present, and one strength line.
3. Use Web Share API if available, fallback to clipboard.
4. Add tests for text generation.
5. Run tests.

**Run:** `npm run test -- share`
**Expected:** pass.

---

### Phase 6: Landing page integration

#### Task 15: Upgrade homepage storytelling

**Objective:** Make homepage sell the new experience, not just mention it.

**Files:**
- Modify: `saturno/app/page.tsx`

**Steps:**
1. Replace feature cards with:
   - “Scenario-based, not stereotype-based.”
   - “Animated type orbit.”
   - “Core type + wing + growth path.”
2. Add visual preview of the constellation.
3. Update CTA to “Start your orbit scan.”
4. Keep layout fast and responsive.
5. Run typecheck/lint.

**Run:** `npm run typecheck && npm run lint`
**Expected:** pass.

#### Task 16: Add trust/caveat section

**Objective:** Build credibility and avoid overclaiming.

**Files:**
- Modify: `saturno/app/page.tsx`

**Steps:**
1. Add short section:
   - “Built from Enneagram theory: centers, wings, stress/growth paths.”
   - “Designed for self-reflection, not diagnosis.”
2. Link to future research/about page if created.
3. Run lint.

**Run:** `npm run lint`
**Expected:** pass.

---

### Phase 7: Quality, accessibility, launch

#### Task 17: Add accessibility pass

**Objective:** Ensure the animated test is usable by everyone.

**Files:**
- Modify as needed in `saturno/components/quiz/*.tsx`

**Steps:**
1. Verify keyboard navigation: intro -> answers -> back/next -> result.
2. Add ARIA labels to SVG graph.
3. Ensure color contrast on result cards.
4. Add `prefers-reduced-motion` CSS behavior.
5. Run lint/typecheck.

**Run:** `npm run lint && npm run typecheck`
**Expected:** pass.

#### Task 18: Add analytics event hooks behind no-op adapter

**Objective:** Prepare conversion/completion tracking without coupling to vendor.

**Files:**
- Create: `saturno/lib/analytics.ts`
- Modify: `saturno/components/quiz/QuizApp.tsx`
- Test: `saturno/tests/analytics.test.ts`

**Steps:**
1. Add `trackQuizStarted`, `trackQuestionAnswered`, `trackQuizCompleted` functions.
2. Default implementation logs nothing in production unless env/config is added later.
3. Add tests for payload shape.
4. Run tests.

**Run:** `npm run test -- analytics`
**Expected:** pass.

#### Task 19: Full verification

**Objective:** Prove the feature is ready.

**Files:**
- No code changes unless failures require fixes.

**Steps:**
1. Run full test suite.
2. Run typecheck.
3. Run lint.
4. Run build.
5. Fix any failures.

**Run:**
```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

**Expected:** all pass.

---

## Acceptance criteria

Research:
- `docs/research/enneagram-logic.md` exists with sources, caveats, and scoring implications.
- Type knowledge covers all 9 types with motivations, fears, desires, center, wings, stress/growth, and practical tips.

Scoring:
- Quiz returns selected type, top 3, percentages, confidence, center breakdown, and likely wing.
- Tie behavior is deterministic.
- Tests cover scoring, wings, confidence, data completeness, and share text.

UX:
- Quiz has intro, scenario cards, animated constellation, orbit progress, and staged result reveal.
- Result avoids clinical/deterministic claims.
- Mobile layout works.
- Reduced-motion users get a calm non-particle version.

Quality:
- `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build` pass.

---

## Immediate next 3 actions

1. Create `docs/research/enneagram-logic.md` with source-backed logic and caveats.
2. Expand `data/enneagram.ts` into the full knowledge contract.
3. Upgrade `lib/enneagram.ts` scoring and tests before touching animation.

---

## Resume protocol

Current phase: planning complete, implementation not started.

Next phase entry command:
```bash
cd /home/athar/Projects/Saturno_site/saturno
mkdir -p docs/research
```

Done-when for Phase 1:
- research doc exists;
- all type data fields are filled;
- question set is expanded;
- `npm run test -- enneagram` passes.
