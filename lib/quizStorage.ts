// ──────────────────────────────────────────────────────
// Saturno Quiz Storage — localStorage Persistence
// ──────────────────────────────────────────────────────
// SSR-safe functions for saving, loading, and clearing
// quiz results in localStorage.
// ──────────────────────────────────────────────────────

import type { QuizResult } from "@/lib/scoring-engine";

// ── Constants ─────────────────────────────────────────

/** localStorage key for the most recent quiz result. */
const LATEST_RESULT_KEY = "saturno-latest-result";

/** localStorage key for the quiz result history array. */
const HISTORY_KEY = "saturno-history";

/** Maximum number of historical results to retain. */
const MAX_HISTORY_LENGTH = 10;

// ── Internal Helpers ─────────────────────────────────

/**
 * Safely reads a value from localStorage.
 *
 * Returns `null` when:
 * - `window` is undefined (SSR / server component context)
 * - The key does not exist
 * - `localStorage` throws (private browsing, quota exceeded, sandboxed iframe)
 */
function safeRead(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safely writes a value to localStorage.
 * Silently fails when localStorage is unavailable.
 */
function safeWrite(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently fail — localStorage may be blocked or quota exceeded
  }
}

/**
 * Safely removes a key from localStorage.
 * Silently fails when localStorage is unavailable.
 */
function safeRemove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently fail
  }
}

/**
 * Safely parses a JSON string into the expected type.
 * Returns `null` when the input is null or parsing fails.
 */
function safeParse<T>(raw: string | null): T | null {
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ── Public API ────────────────────────────────────────

/**
 * Save a quiz result to localStorage.
 *
 * Writes the result under `saturno-latest-result`. If a previous result
 * exists, it is archived into the `saturno-history` array (max 10 entries)
 * before being overwritten.
 *
 * @param result - The `QuizResult` to persist.
 *
 * @example
 * ```ts
 * saveQuizResult(quizResult);
 * ```
 */
export function saveQuizResult(result: QuizResult): void {
  /* ── Guard: SSR — nothing to save ─────────────────────────────── */
  if (typeof window === "undefined") return;

  /* ── Archive previous result into history before overwriting ──── */
  const previousRaw = safeRead(LATEST_RESULT_KEY);

  if (previousRaw !== null) {
    const parsed = safeParse<QuizResult>(previousRaw);
    if (parsed !== null) {
      const history = safeParse<QuizResult[]>(safeRead(HISTORY_KEY)) ?? [];
      history.unshift(parsed);
      safeWrite(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_LENGTH)));
    }
  }

  /* ── Persist the new result ───────────────────────────────────── */
  safeWrite(LATEST_RESULT_KEY, JSON.stringify(result));
}

/**
 * Load the most recently saved quiz result from localStorage.
 *
 * @returns The latest `QuizResult`, or `null` if none exists, parsing
 *          fails, or the function is called server-side.
 *
 * @example
 * ```ts
 * const result = loadLatestResult();
 * if (result) displayProfile(result);
 * ```
 */
export function loadLatestResult(): QuizResult | null {
  const raw = safeRead(LATEST_RESULT_KEY);
  return safeParse<QuizResult>(raw);
}

/**
 * Load the history array of past quiz results from localStorage.
 *
 * @returns An array of previous `QuizResult` objects (most recent first).
 *          Returns an empty array when no history exists.
 *
 * @example
 * ```ts
 * const history = loadHistory();
 * console.log(`Taken the quiz ${history.length + 1} time(s).`);
 * ```
 */
export function loadHistory(): QuizResult[] {
  const raw = safeRead(HISTORY_KEY);
  return safeParse<QuizResult[]>(raw) ?? [];
}

/**
 * Remove the saved quiz result from localStorage.
 * Does NOT clear the history array.
 *
 * @example
 * ```ts
 * clearResult();
 * ```
 */
export function clearResult(): void {
  safeRemove(LATEST_RESULT_KEY);
}
