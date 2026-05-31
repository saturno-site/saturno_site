# Production cleanup + hardening notes

Use after feature work on Saturno before committing production-facing changes.

## Patterns proven useful

- Remove deprecated/unused SDKs instead of carrying compatibility ballast. For Analyzer AI, prefer `@google/genai` over old `@google-cloud/aiplatform` / `@google-cloud/vertexai` packages.
- Do not hardcode a fallback Google Cloud project ID. Analyzer AI should require either:
  - `GEMINI_API_KEY` or `GOOGLE_API_KEY`, or
  - Vertex config via `GOOGLE_CLOUD_PROJECT` plus `GOOGLE_CLOUD_LOCATION`.
- Keep model env-configurable:
  - `GOOGLE_VERTEX_MODEL`
  - `GEMINI_MODEL`
  - default can remain `gemini-2.0-flash` when compatible.
- For Next 16, use `proxy.ts` instead of legacy `middleware.ts` when touching locale/proxy routing.
- Run production dependency audit after package changes:
  - `npm audit --omit=dev`
  - `npm audit --audit-level=moderate`

## Analyzer API hardening checklist

- Force Node runtime for AI SDK routes: `export const runtime = "nodejs"`.
- Validate request body shape before using fields.
- Filter/normalize chat history server-side; accept only known roles and text parts.
- Return Enneagram results as reflection language, not certainty/diagnosis.
- For structured reports, request JSON schema output and include:
  - `required`
  - `additionalProperties: false`
  - fixed array bounds when UX expects exact counts, e.g. 3 historical figures.
- When using `@google/genai` chat calls, merge base generation config into per-request config:
  - `chat.sendMessage({ message, config: mergeConfig(config) })`
  - Pitfall: passing only per-request config can drop systemInstruction/generation defaults on report calls.

## Integrity test additions worth preserving

After data/scoring/storage changes, add or run tests for:
- every Enneagram type represented and metadata complete;
- question weights only target valid type IDs;
- scoring order/tie behavior stable;
- localStorage history save/load/clear lifecycle;
- no impossible result shape after partial or full quiz answers.

## Final production gate

Run all before final report/commit:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm audit --audit-level=moderate
```

Then smoke a production server (`npm run start -- --port <port>`) and check:
- `/en`, `/pt`, `/quiz`, `/profile`, `/characters`, `/analyzer` return 200;
- `/` redirects to `/en`;
- language switch works;
- `/analyzer` Act I can advance to Act II;
- browser console has no errors.

## Review loop

For production cleanup commits, run an independent pre-commit review focused on:
- security concerns;
- logic bugs in AI route/config merging;
- dependency/runtime compatibility;
- whether hardening changed public API contracts.

If review finds a blocker, patch it, rerun gates, then do a follow-up review before committing/reporting.