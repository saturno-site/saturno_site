# Analyzer 3D + Sound Experience Implementation Plan

> **For Hermes:** Use `saturno-enneagram-web` and restricted toolsets. Preserve analyzer logic/API contracts. Do not touch `/quiz`.

**Goal:** Transform only `/analyzer` into a playful animated 3-act experience with procedural Three.js/R3F visuals, animated icons, and muted-by-default Web Audio cues.

**Architecture:** Keep scoring, question data, and AI report API unchanged. Add presentation-only layers: SoundProvider, animated SVG/lucide wrappers, lazy-loaded R3F scenes, and a cinematic Type III reveal. Use procedural 3D avatars for type characters because no rigged 9-character model library exists.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, framer-motion, canvas-confetti, Web Audio API, new deps `three`, `@react-three/fiber`, `@react-three/drei`.

---

## Scope

In scope:
- `/analyzer` only.
- Act I: `components/analyzer/OrbitQuiz.tsx`
- Act II: `components/analyzer/AiChatSession.tsx`
- Act III: `components/analyzer/ChronosReport.tsx`
- Shell: `app/analyzer/page.tsx`
- New analyzer sound/icons/three components.

Out of scope:
- `/quiz` quick test flow.
- Scoring engine behavior.
- Question content.
- AI report API contract.
- Email capture.
- Real GLB character art unless supplied later.

Current dependency state:
- Present: `framer-motion`, `flubber`, `canvas-confetti`, `lucide-react`.
- Missing: `three`, `@react-three/fiber`, `@react-three/drei`.
- Audio: no library needed; use Web Audio API.

Hard constraints:
- Sound muted by default.
- 3D loaded only client-side with `next/dynamic({ ssr: false })`.
- WebGL/reduced-motion fallback must keep full flow usable.
- Do not overwrite existing dirty/untracked files; `lib/enneagram.ts` is currently untracked and must be inspected before touching.

---

## UX concept

The analyzer becomes a 3-act “Saturno Type Orbit” cinematic:

1. Act I — Orbit
   - Existing gamified quiz remains.
   - Add answer hover/select/advance sound.
   - Add animated type/insight glyph flourishes.

2. Act II — Deep Dive
   - Gemini chat logic remains.
   - Add message sound cues, animated send icon, typing motion.
   - Keep 3D ambient board faint/background only.

3. Act III — Chronos Report
   - Report contract remains.
   - Lead with cinematic 3D TypeRevealScene.
   - Show board zoom to primary type node, procedural avatar entrance, reveal sound, confetti, then staggered report sections.

---

## Workstream 1: Sound system

### Task 1: Add sound context and hook

**Objective:** Provide muted-by-default Web Audio cues across analyzer.

**Files:**
- Create: `lib/audio/useSound.ts`
- Create: `components/analyzer/SoundProvider.tsx`
- Create: `components/analyzer/SoundToggle.tsx`

**Requirements:**
- Create `AudioContext` lazily on first user gesture.
- Muted by default.
- Persist muted preference in `localStorage`.
- Expose `play(cue)` and `muted/setMuted`.
- Cues: `hover`, `select`, `advance`, `actTransition`, `reveal`, `message`.
- Use oscillators + gain envelopes; no audio assets.
- Sound toggle uses accessible `aria-pressed`.

**Verification:**
- `npm run typecheck`

### Task 2: Wire sound into analyzer shell and acts

**Objective:** Trigger sound cues without changing logic.

**Files:**
- Modify: `app/analyzer/page.tsx`
- Modify: `components/analyzer/OrbitQuiz.tsx`
- Modify: `components/analyzer/AiChatSession.tsx`
- Modify: `components/analyzer/ChronosReport.tsx`

**Requirements:**
- Wrap analyzer page in `SoundProvider`.
- Add `SoundToggle` to shell.
- Play `actTransition` when act changes.
- Orbit: `hover/select/advance`.
- Chat: `message` send/receive.
- Report reveal: `reveal`.

**Verification:**
- `npm run typecheck && npm run lint`

---

## Workstream 2: Animated icons

### Task 3: Add animated icon primitives

**Objective:** Standardize animated SVG/lucide microinteractions.

**Files:**
- Create: `components/analyzer/icons/AnimatedIcon.tsx`
- Create: `components/analyzer/icons/TypeGlyph.tsx`

**Requirements:**
- `AnimatedIcon` wraps lucide icons with framer-motion hover/tap states.
- `TypeGlyph` maps Enneagram type IDs to animated SVG glyphs.
- Decorative icons use `aria-hidden`.
- Interactive icons keep labels/focus states.

**Verification:**
- `npm run typecheck`

### Task 4: Replace static icon moments in analyzer

**Objective:** Add motion without changing data flow.

**Files:**
- Modify: `components/analyzer/OrbitQuiz.tsx`
- Modify: `components/analyzer/AiChatSession.tsx`
- Modify: `components/analyzer/ChronosReport.tsx`

**Requirements:**
- Use TypeGlyph for insight/type moments.
- Use AnimatedIcon for send/share/restart/sound/back/next affordances where present.
- Preserve keyboard nav and focus rings.

**Verification:**
- `npm run typecheck && npm run lint`

---

## Workstream 3: Three.js/R3F layer

### Task 5: Install 3D dependencies

**Objective:** Add required R3F packages.

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Command:**
```bash
npm install three @react-three/fiber @react-three/drei
```

**Verification:**
- `npm ls three @react-three/fiber @react-three/drei`
- `npm run typecheck`

### Task 6: Add Lazy3D boundary

**Objective:** Keep 3D client-only and fallback-safe.

**Files:**
- Create: `components/analyzer/three/Lazy3D.tsx`
- Create: `components/analyzer/three/ThreeFallback.tsx`

**Requirements:**
- Use `next/dynamic` with `ssr: false` at import boundary.
- Suspense fallback uses existing CSS glow/static SVG style.
- Detect reduced motion and no-WebGL where practical.
- Do not break SSR.

**Verification:**
- `npm run build`

### Task 7: Add EnneagramBoard3D

**Objective:** Render animated 3D enneagram board.

**Files:**
- Create: `components/analyzer/three/EnneagramBoard3D.tsx`

**Requirements:**
- Render ring, 9 nodes, triangle 3-6-9, hexad 1-4-2-8-5-7.
- Use type colors from existing type system data.
- Support props for active/primary node.
- Low-cost emissive look; no postprocessing for v1.
- Canvas config: capped DPR, high-performance gl, responsive.

**Verification:**
- `npm run typecheck`

### Task 8: Add procedural TypeAvatar3D

**Objective:** Create type-specific stylized 3D characters without model assets.

**Files:**
- Create: `components/analyzer/three/TypeAvatar3D.tsx`

**Requirements:**
- Each of 9 types has distinct silhouette, color, and idle motion.
- API: `<TypeAvatar3D type={...} />` so real GLB can replace later.
- Motion personalities:
  - Eight: bold assertive pulse.
  - Nine: calm slow float.
  - Seven: bouncy quick motion.
  - Five: compact still observing.
  - Other types get similarly differentiated motion.

**Verification:**
- `npm run typecheck`

### Task 9: Add TypeRevealScene

**Objective:** Build Act III cinematic reveal.

**Files:**
- Create: `components/analyzer/three/TypeRevealScene.tsx`
- Modify: `components/analyzer/ChronosReport.tsx`

**Requirements:**
- Board spin -> camera push -> primary node flare -> avatar rises -> confetti + reveal cue -> report content appears.
- Lazy mount only when entering/reporting Act III.
- Scales down and shortens on mobile.
- Fallback to static reveal if reduced motion/WebGL unavailable.

**Verification:**
- `npm run typecheck && npm run build`

---

## Workstream 4: Shell integration

### Task 10: Add ambient analyzer board

**Objective:** Make all three acts feel connected.

**Files:**
- Modify: `app/analyzer/page.tsx`

**Requirements:**
- Mount low-opacity/pointer-events-none ambient board behind act content.
- Dynamic import only.
- No layout shift.
- Existing CSS background remains fallback.

**Verification:**
- `npm run typecheck && npm run build`

### Task 11: Polish act-specific motion

**Objective:** Add liveliness while preserving flow.

**Files:**
- Modify: `components/analyzer/OrbitQuiz.tsx`
- Modify: `components/analyzer/AiChatSession.tsx`
- Modify: `components/analyzer/ChronosReport.tsx`

**Requirements:**
- Orbit: animated reward glyph on +INSIGHT.
- Chat: animated typing indicator + send icon.
- Report: stagger sections in, keep loading/error states intact.
- Do not change AI request/response handling.

**Verification:**
- `npm run typecheck && npm run lint`

---

## Accessibility/performance acceptance criteria

A11y:
- Full keyboard navigation preserved.
- Sound toggle has `aria-pressed` and visible focus.
- Decorative 3D/icons are hidden from screen readers.
- Reduced-motion users get static/fade fallback.
- WebGL disabled still permits full analyzer completion/report viewing.

Performance:
- 3D components dynamic import client-only.
- Capped `dpr={[1, 1.5]}`.
- Use `frameloop="demand"` where static.
- Lazy mount reveal only when needed.
- Clean timers, animation loops, audio nodes.
- No server bundle crashes from Three.js imports.

Responsive:
- Verify 375px mobile.
- Reveal scene scales and shortens on mobile.

---

## Final verification

Run from repo root:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Manual/browser verification:
- Desktop analyzer full 3-act walkthrough.
- 375px mobile walkthrough.
- Sound starts muted; toggle works.
- Board renders; fallback works.
- Reveal fires with avatar/confetti/sound.
- Report data intact.
- Keyboard-only pass.
- Reduced-motion pass.

---

## Resume protocol

Current status: plan captured, implementation not started.

Before coding:
```bash
git status --short
npm install three @react-three/fiber @react-three/drei
```

Done when:
- Analyzer feels animated and premium.
- `/quiz` untouched.
- Analyzer logic/API unchanged.
- Verification commands pass.
