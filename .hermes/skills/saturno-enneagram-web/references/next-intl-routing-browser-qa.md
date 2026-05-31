# Next-intl routing + browser QA notes

Use after route/layout changes, locale work, or analyzer navigation work in Saturno.

## Durable route pattern

This repo has both localized routes and non-localized app routes:
- localized: `app/[locale]/page.tsx`
- non-localized: `/analyzer`, `/quiz`, `/profile`, `/characters`

Keep a root app layout for non-localized routes:
- `app/layout.tsx` should own `<html>`, `<body>`, fonts, global CSS, and global providers such as `AnimationProvider`.
- `app/[locale]/layout.tsx` should be a nested locale/provider wrapper only; it must not emit a second `<html>` or `<body>`.

For next-intl:
- Wire the plugin in `next.config.ts` with `createNextIntlPlugin("./i18n.ts")`.
- In `i18n.ts`, do not assume `locale` is populated. Use `locale ?? await requestLocale`, validate against allowed locales, and fallback to `en`.
- Validate `/`, `/en`, and `/pt` with browser tools; it is possible for typecheck/build to pass while runtime locale data is wrong.

## Browser QA sequence

After starting dev server on a known free port:

```bash
npm run dev -- --port 3001
```

Browser-smoke in this order:
1. `/` redirects to `/en` and has no Next runtime overlay.
2. `/en` loads English copy; `/pt` loads Portuguese copy.
3. EN/PT buttons change `location.href` and visible copy.
4. `/analyzer` loads; sound starts muted; no console JS errors.
5. Click through Act I to Act II; verify a visible user-facing error appears if AI backend fails.
6. `/quiz` loads and Begin starts question flow.
7. `/profile` empty state loads.
8. `/characters` loads and filters/cards render.

Always inspect both browser console and dev-server logs. Browser console can be clean while server-side API failures are only visible in process logs.

## AI analyzer backend pitfall

The analyzer may enter Act II and then call Vertex AI. If the Vertex project/model is invalid, the API returns 500. Do not leave the UI blank/spinning; show a visible error message in `AiChatSession`.

Make the Vertex model configurable through `GOOGLE_VERTEX_MODEL`; avoid hard-coding a single deprecated/unavailable Gemini model.

## Known warnings to classify, not over-fix

- `THREE.Clock` deprecation warning from R3F/drei stack: report unless directly actionable.
- Google VertexAI SDK deprecation warning: plan migration to `@google/genai`, but do not block unrelated frontend QA.
- Next 16 middleware convention warning: migrate `middleware.ts` to `proxy.ts` in a focused routing cleanup.
