# Saturno local Hermes context

Scope: this git repo: `/home/athar/Projects/Saturno_site/saturno`.

Session start:
- Use `.hermes/SESSION_START.md` as compact checklist.
- Read `AGENTS.md`, `.hermes/context.md`, `.hermes/memory/project.md`, `.hermes/plans_tasks/active.md` before implementation.

Project goal:
- Build a modern, animated, fun Enneagram personality-test website.
- Product direction: “Saturno Type Orbit”.
- UX should feel like a cosmic self-discovery game, not a generic form.

Core rules:
- Caveman mode: concise, action-first, no filler.
- Context mode: read local `.hermes/` memory/plans before asking or guessing.
- Keep tool context lean.
- Treat Enneagram as self-reflection, not diagnosis.
- Prefer “likely pattern”, “reflection tool”, “growth path”.
- Avoid deterministic/clinical claims.

Project-local context stores:
- Start checklist: `.hermes/SESSION_START.md`
- Stable memory: `.hermes/memory/project.md`
- Decisions: `.hermes/memory/decisions.md`
- Lessons: `.hermes/memory/lessons.md`
- Active Plannotator/tasks: `.hermes/plans_tasks/active.md`
- Plans backlog: `.hermes/plans_tasks/backlog.md`
- Local skill: `.hermes/skills/saturno-enneagram-web/SKILL.md`

Preferred tools for this project:
- file, terminal, code_execution, web, skills, todo, delegation.
- Browser/vision/image/tts/messaging/cron only when explicitly needed.

Useful paths:
- Plan: `docs/plans/2026-05-30-modern-enneagram-experience.md`
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
