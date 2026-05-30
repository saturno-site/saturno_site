# Saturno decisions

- Version project-local Hermes context inside this git repo under `.hermes/`.
- Keep root `/home/athar/Projects/Saturno_site/.hermes` as optional local wrapper only; canonical versioned context lives here.
- Keep global Hermes memory minimal; prefer `.hermes/memory/` for repo-specific facts.
- Use `.hermes/plans_tasks/` for Plannotator plans and task-tracking artifacts.
- Keep default Hermes tool context lean for this project; re-enable heavy tools only when needed.
- Version non-secret `.hermes/` docs/skills/memory; ignore volatile local files via `.gitignore`.
