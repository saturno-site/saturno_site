# Perfectionist Next.js code review notes

Use when Andre asks for production cleanup, perfectionist review, code quality, references, routing, i18n, or Next.js polish.

## Session-derived lessons

### 1. Run checks before claiming quality
- `npm run lint` alone is not enough.
- Always run at least `npm run typecheck` before saying code references/imports are clean.
- In this project, lint passed while TypeScript caught an invalid import: `next-intl/link`.

### 2. next-intl navigation references
- Do not import from `next-intl/link`; this module may not exist in next-intl v4.
- Valid patterns:
  - Create project navigation helpers with `createNavigation` from `next-intl/navigation`, then import from that local module.
  - Or use `next/link` plus `next/navigation` and explicitly build locale-prefixed hrefs.
- For `LanguageSelector`, prefer explicit locale path generation, `hrefLang`, and `aria-current`.

### 3. Proper references pass
Check for stale/incorrect references after edits:
- imports that point to removed or non-existent modules
- links that bypass locale routing (`href="/quiz"`, `href="/analyzer"`) when the current route is locale-scoped
- docs/skills/AGENTS paths that mention renamed files
- package deps that no longer have a source import
- duplicate assets outside `public/`
- comments that explain obvious implementation instead of documenting intent

### 4. Dependency and asset cleanup discipline
- Detect unused deps with source search and package inspection.
- Do not remove deps or folders in the same shell command as other work unless user approved destructive cleanup.
- If cleanup is destructive/irreversible (`rm`, deleting folders, uninstalling packages), pause and ask or use an explicit approved cleanup step.
- Prefer `public/images/...` for web-served assets; avoid keeping duplicate root-level image folders unless source assets are intentionally versioned.

### 5. Perfectionist review shape
When user says “many issues” or asks for perfectionist review:
1. Inspect dirty files and distinguish user changes from agent changes.
2. Run lint + typecheck early to catch obvious broken references.
3. Review route/i18n boundaries, server/client boundaries, imports, asset paths, and package deps.
4. Fix small safe issues immediately.
5. Stop before destructive cleanup if approval is needed.
6. Verify with `lint`, `typecheck`, tests/build as scope requires.
