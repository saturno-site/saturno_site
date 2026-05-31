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

Canonical project context lives inside the git repo at `saturno/.hermes/`; parent-level context is wrapper/pointer only. See `references/project-context-versioning.md` for the versioning pattern, recommended layout, gitignore policy, and Hermes `skills.external_dirs` verification.

For modern Enneagram research/planning/analyzer work, see `references/modern-enneagram-experience-planning.md` for session-derived product direction, analyzer constraints, and Andre-specific reporting style.

For the implemented `/analyzer` 3D + sound pattern, see `references/analyzer-3d-sound-implementation.md` for dependency choices, R3F/Web Audio guardrails, wiring points, verification, and pitfalls.

For route/runtime QA after layout, locale, or navigation changes, see `references/next-intl-routing-browser-qa.md` for the root-vs-locale layout pattern, next-intl `requestLocale` fallback, browser-smoke sequence, and analyzer backend error-state pitfall.

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

- Broad plan: `docs/plans/2026-05-30-modern-enneagram-experience.md`
- Analyzer 3D/sound plan: `docs/plans/2026-05-30-analyzer-3d-sound-experience.md`
- Analyzer shell: `app/analyzer/page.tsx`
- Analyzer Act I: `components/analyzer/OrbitQuiz.tsx`
- Analyzer Act II: `components/analyzer/AiChatSession.tsx`
- Analyzer Act III: `components/analyzer/ChronosReport.tsx`
- Analyzer API: `app/api/analyzer/route.ts`
- Analyzer scoring engine: `lib/scoring-engine.ts`
- Quick Test UI: `components/quiz/QuizApp.tsx`
- Quick Test data/scoring: `data/enneagram.ts`, `lib/enneagram.ts`
- Existing tests: `tests/enneagram.test.ts`
- Landing page: `app/page.tsx`

## Analyzer 3D + sound rules

- `/analyzer` upgrades must not change `/quiz` unless requested.
- Preserve question data, scoring logic, and AI report API contract unless the task explicitly targets them.
- Use client-only dynamic R3F imports; never import `three`/R3F into server components.
- Use procedural type avatars unless real GLB character art exists.
- Use Web Audio API synthesized cues, muted by default, initialized only after user gesture.
- Always keep reduced-motion/static fallback paths for 3D-heavy scenes.

## Next.js warning

This project uses Next.js 16 / React 19. Before uncertain Next API work, inspect `node_modules/next/dist/docs/`.

## Implementation order

1. Read the active project-local plan.
2. Check current git status; do not overwrite user changes.
3. For scoring/data work: update tests first, expand data contract, upgrade scoring engine.
4. For `/analyzer` presentation work: preserve logic/contracts first, then add provider/lazy boundaries, then wire components.
5. Add animation/3D components behind fallbacks.
6. Build reveal/report UI.
7. Run verification.

## Verification

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

Use narrower checks while iterating, but final launch-impacting changes need all four.

After layout, locale, navigation, or analyzer changes, also run browser QA against the dev server:
- `/`, `/en`, `/pt`
- EN/PT language switch
- `/analyzer` Act I → Act II
- `/quiz`, `/profile`, `/characters`
- browser console plus dev-server logs

See `references/next-intl-routing-browser-qa.md` for exact sequence and route-specific pitfalls.

## Current caveat

Always inspect `git status --short` before editing and avoid clobbering existing work.
