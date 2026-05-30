# Modern Enneagram Experience Planning Notes

Use this reference when asked to research, plan, or implement a better-than-standard Enneagram test for Saturno.

## Research targets

- Core model: 9 types, 3 centers, wings, stress/growth lines, top-type distribution.
- UX-safe framing: self-reflection and growth, never diagnosis or deterministic identity claims.
- Logic base: separate question answers from scoring dimensions; preserve transparent score explanations.
- Caveats: Enneagram is not a validated clinical instrument; phrase output as likely patterns.

## Product direction

Preferred concept: `Saturno Type Orbit`.

Make the test feel like a cosmic self-discovery game:
- Animated Enneagram constellation / orbit map.
- Scenario-based prompts instead of sterile trait statements.
- Progress shown as energy moving through centers/types.
- Result reveal with core type, likely wing, center, growth path, shadow/weather metaphor, and a small growth quest.
- Shareable result card and fun microcopy, while keeping serious caveats visible.

## Analyzer-specific plan

If working on `/analyzer`, use the active plan:
- `docs/plans/2026-05-30-analyzer-3d-sound-experience.md`

Known scope constraints:
- Keep `/quiz` untouched unless explicitly asked.
- Preserve existing scoring/question/API contracts.
- Use procedural React Three Fiber avatars/objects; do not assume a ready library of 9 rigged 3D character models.
- Add sound through Web Audio API; muted by default with explicit opt-in.
- Prefer lightweight, progressive enhancement over blocking the page on 3D/audio.

## Implementation sequencing

1. Read project context and active plan before coding.
2. Run `git status --short`; preserve untracked/user work.
3. Inspect current data/scoring/result shapes before changing UI assumptions.
4. Implement visual shell first with static/sample data if needed.
5. Wire to real analyzer/result state only after contracts are confirmed.
6. Verify with `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` for launch-impacting changes.

## Planning output style for Andre

- Caveman mode: concise bullets, no narrative.
- Include exact file path of created plan.
- Call out repo state and untouched/untracked files.
- If no commit is made due to user/other-agent work, say why briefly.
