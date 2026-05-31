# Analyzer 3D + sound implementation notes

Use for future `/analyzer` upgrades on Saturno.

## Scope guardrails

- Change `/analyzer` only unless user explicitly asks otherwise.
- Preserve `/quiz`, question content, scoring logic, and `/api/analyzer` response contract.
- Treat Enneagram output as reflective/growth-oriented, not diagnostic.

## Implemented pattern

Dependencies:
- `three`
- `@react-three/fiber`
- `@react-three/drei`

3D layer:
- Keep R3F client-only behind `next/dynamic(..., { ssr: false })`.
- Route all 3D imports through a small lazy boundary (`components/analyzer/three/Lazy3D.tsx`).
- Provide a CSS/static fallback (`ThreeFallback`) for loading, reduced motion, or no-WebGL cases.
- Use procedural avatars for type characters unless real GLB art is supplied.
- Keep procedural avatar API stable (`TypeAvatar3D type=...`) so GLB assets can replace primitives later.

Sound layer:
- Use Web Audio API, not asset files or an audio package.
- Initialize `AudioContext` lazily after user gesture.
- Start muted by default and persist user preference in localStorage.
- Expose named cues via a provider/context: hover, select, advance, actTransition, reveal, message.

Analyzer wiring:
- `app/analyzer/page.tsx` owns act transitions, sound provider, sound toggle, ambient board.
- `OrbitQuiz.tsx` can play hover/select/advance cues and show animated type glyph flourishes.
- `AiChatSession.tsx` can play message cues and use animated send/brain/user icons.
- `ChronosReport.tsx` is the reveal centerpiece: 3D board + procedural avatar + confetti + staggered report cards.

## Verification checklist

Run all before reporting complete:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Then browser-smoke `/analyzer`:
- page loads with no Next runtime overlay
- sound toggle starts muted
- Act I advances to Act II
- if the AI backend fails, Act II shows a visible user-facing error instead of a blank/stuck state
- final report path still calls the same API contract
- no JS errors in console after refresh
- inspect dev-server logs too; server-side Vertex/API failures may not appear as browser JS errors

## Pitfalls

- Do not import `three`/R3F directly into server components.
- Do not add autoplay sound; browsers block it and it is bad UX.
- Do not keep heavy reveal scenes mounted across all acts.
- If lint warnings come from unrelated pre-existing user files, report them separately instead of rewriting those files.
