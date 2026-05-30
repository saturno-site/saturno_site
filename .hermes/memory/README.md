# Saturno local memory

Use this folder for project-specific durable context that should be versioned with the repo and should not pollute global Hermes memory.

## Files

- `project.md`: stable project facts and conventions.
- `decisions.md`: durable architecture/product decisions.
- `lessons.md`: reusable lessons learned while implementing/debugging.

## Rules

Save here when:
- The fact is specific to Saturno.
- It will matter in future sessions.
- It should travel with the repo.

Do not save here:
- Temporary task progress.
- Secrets, tokens, credentials.
- One-off command output.
- Stale artifact IDs unless still important.

Keep entries compact. Prefer bullets. Update existing facts instead of duplicating.
