# Saturno Plannotator plans/tasks

Use this folder for Plannotator-generated plans, task breakdowns, and execution state that should version with the repo.

## Suggested structure

- `active.md`: current active plan/task state.
- `backlog.md`: future tasks not yet active.
- `archive/`: completed or superseded plans.
- `YYYY-MM-DD-<topic>.md`: dated plan/task files.

## Task format

```md
## Task ID: short-name
Status: pending | in_progress | blocked | done
Owner: Hermes | user | subagent
Source plan: path/to/plan.md
Files: exact paths
Verify: exact command(s)
Notes: compact bullets only
```

## Rules

- Keep active plan small.
- Archive stale plans instead of deleting.
- Link to source `docs/plans/` files when possible.
- Use exact paths and commands.
- Do not store secrets.
