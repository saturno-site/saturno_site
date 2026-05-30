---
name: saturno-enneagram-web
description: Project-local workflow for the Saturno modern animated Enneagram website.
version: 1.0.0
author: Hermes Agent
metadata:
  hermes:
    tags: [saturno, enneagram, nextjs, frontend, ux, animation]
---

# Saturno Enneagram Web Workflow

Use this skill when working in `/home/athar/Projects/Saturno_site/saturno`.

## Operating mode

- Caveman mode: concise, facts/fixes only.
- Context mode: read project-local memory/plans before asking or guessing.
- Keep context lean. Do not load broad creative/devops/ML skills unless needed.
- Prefer file/terminal/code_execution/web over browser-heavy workflows.
- Use delegation with restricted toolsets for big independent subtasks.

## Project-local context stores

Read as needed:
- `.hermes/SESSION_START.md` for startup checklist.
- `.hermes/memory/project.md` for stable project facts.
- `.hermes/memory/decisions.md` for durable decisions.
- `.hermes/memory/lessons.md` for recurring workflow lessons.
- `.hermes/plans_tasks/active.md` for current Plannotator/task state.
- `.hermes/plans_tasks/backlog.md` for future tasks.

Write updates there when project-specific facts/plans should persist without bloating global Hermes memory.

## Product goal

Build a premium, animated Enneagram personality-test experience.

Concept: `Saturno Type Orbit`
- Scenario-based questions.
- Animated enneagram constellation.
- Transparent scoring.
- Result reveal: core type, likely wing, center, top types, stress/growth path.
- Fun extras: type planet/avatar, shadow weather, 7-day growth quest, share card.

## Enneagram rules

- Present as self-reflection, not diagnosis.
- Use “likely pattern”, “reflection tool”, “growth path”.
- Avoid “you are definitely”, clinical claims, hiring/therapy claims.
- Core model: 9 types, 3 centers, wings, stress/growth lines.
- Instincts are phase 2 unless user asks.

## Repo paths

- Plan: `docs/plans/2026-05-30-modern-enneagram-experience.md`
- Quiz UI: `components/quiz/QuizApp.tsx`
- Data: `data/enneagram.ts`
- Scoring: `lib/enneagram.ts`
- Existing tests: `tests/enneagram.test.ts`
- Landing page: `app/page.tsx`

## Next.js warning

This project uses Next.js 16 / React 19. Before uncertain Next API work, inspect `node_modules/next/dist/docs/`.

## Implementation order

1. Read the plan.
2. Check current git status; do not overwrite user changes.
3. Update tests first for scoring/data work.
4. Expand Enneagram data contract.
5. Upgrade scoring engine.
6. Split quiz components.
7. Add animation components.
8. Build result reveal.
9. Run verification.

## Verification

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

Use narrower checks while iterating, but final launch-impacting changes need all four.

## Current caveat

Always inspect `git status --short` before editing and avoid clobbering existing work.
