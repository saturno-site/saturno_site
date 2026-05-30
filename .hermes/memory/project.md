# Saturno project memory

Stable facts:
- Saturno is a modern animated Enneagram personality-test website.
- Product direction: “Saturno Type Orbit”.
- UX target: cosmic self-discovery game, not generic questionnaire.
- Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Vitest.
- Local project skill: `.hermes/skills/saturno-enneagram-web/SKILL.md`.
- Main plan: `docs/plans/2026-05-30-modern-enneagram-experience.md`.

Working rules:
- Caveman mode by default: concise, action-first, no filler.
- Keep context lean. Use only relevant tools/skills.
- Enneagram copy must frame results as self-reflection, not diagnosis.
- Use “likely pattern”, “reflection tool”, “growth path”.
- Avoid deterministic, clinical, hiring, therapy, or medical claims.
- Respect accessibility and `prefers-reduced-motion`.

Core files:
- Quiz UI: `components/quiz/QuizApp.tsx`
- Data: `data/enneagram.ts`
- Scoring: `lib/enneagram.ts`
- Tests: `tests/enneagram.test.ts`
- Landing: `app/page.tsx`

Verification:
- `npm run test`
- `npm run typecheck`
- `npm run lint`
- `npm run build` for launch-impacting work.
