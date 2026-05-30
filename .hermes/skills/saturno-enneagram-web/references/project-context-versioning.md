# Project Context Versioning Pattern

Use this when deciding where Saturno/Hermes project context should live.

## Decision

The canonical Saturno project context belongs inside the actual git repo:

- `/home/athar/Projects/Saturno_site/saturno/.hermes/`

The parent wrapper directory may contain pointers only:

- `/home/athar/Projects/Saturno_site/AGENTS.md`
- `/home/athar/Projects/Saturno_site/.hermes/context.md`

## Why

- `saturno/` is the real git repository.
- Versioned project memory, plans, skills, and startup docs should travel with the code.
- Wrapper-level `.hermes/` content is local and non-canonical.
- Keeping compact, text-only `.hermes/` files in repo improves continuity without polluting global Hermes memory.

## Recommended repo-local layout

- `.hermes/README.md` — explains repo-local context policy.
- `.hermes/SESSION_START.md` — startup checklist.
- `.hermes/context.md` — concise project overview.
- `.hermes/memory/project.md` — stable project facts.
- `.hermes/memory/decisions.md` — durable decisions.
- `.hermes/memory/lessons.md` — reusable lessons.
- `.hermes/plans_tasks/active.md` — current active plan/tasks.
- `.hermes/plans_tasks/backlog.md` — future work.
- `.hermes/skills/<skill>/SKILL.md` — project-local class-level skills.

## Gitignore policy

Version compact docs/skills/memory/plans under `.hermes/`.
Ignore volatile or private runtime artifacts:

- caches
- tmp/temp
- logs
- sessions
- `*.local.*`
- private/secrets files

## Hermes config pattern

Expose repo-local skills through `skills.external_dirs`, pointing at:

`/home/athar/Projects/Saturno_site/saturno/.hermes/skills`

Verify with:

```bash
hermes skills list
```

Expected: `saturno-enneagram-web` appears as local/enabled.

## Pitfall

Do not make the wrapper directory the canonical source of project context. If a future agent starts from `/home/athar/Projects/Saturno_site`, it should follow wrapper pointers into `saturno/` before editing or planning.
