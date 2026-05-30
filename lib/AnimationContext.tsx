"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type AnimationIntensity = "full" | "reduced" | "none";

export interface AnimationContextValue {
  /** True when animations should play (no reduced-motion preference). */
  animationsEnabled: boolean;
  /** True when the user prefers reduced motion via OS/accessibility settings. */
  prefersReducedMotion: boolean;
  /**
   * Animation intensity level.
   * - `"full"`: All animations play.
   * - `"reduced"`: Only essential motion (no spinning, bouncing).
   * - `"none"`: All animations disabled.
   */
  intensity: AnimationIntensity;
}

/* ------------------------------------------------------------------ */
/*  Context & Provider                                                  */
/* ------------------------------------------------------------------ */

const AnimationContext = createContext<AnimationContextValue>({
  animationsEnabled: true,
  prefersReducedMotion: false,
  intensity: "full",
});

export function AnimationProvider({ children }: { children: ReactNode }) {
  // Initialize from matchMedia using lazy state — avoids cascading renders
  // that would happen if we called setState synchronously inside the effect.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });
  // Initialize intensity from localStorage via lazy state — avoids
  // calling setState synchronously inside the effect (flagged by
  // react-hooks/set-state-in-effect).
  const [intensity] = useState<AnimationIntensity>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("saturno-animation-intensity");
        if (stored === "full" || stored === "reduced" || stored === "none") {
          return stored;
        }
      } catch {
        // localStorage may be blocked (incognito, sandboxed iframes, etc.)
      }
    }
    return "full";
  });

  // ── Media query listener for prefers-reduced-motion ────
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    function handleChange(event: MediaQueryListEvent): void {
      setPrefersReducedMotion(event.matches);
    }

    // Subscribe to OS-level preference changes
    mq.addEventListener("change", handleChange);

    return () => {
      mq.removeEventListener("change", handleChange);
    };
  }, []);

  // ── Sync data-reduced-motion attribute on <html> ─────
  useEffect(() => {
    const reduced = prefersReducedMotion || intensity === "none";
    document.documentElement.dataset.reducedMotion = reduced ? "true" : "false";
  }, [prefersReducedMotion, intensity]);

  // Derive animationsEnabled from raw state
  const animationsEnabled = intensity !== "none" && !prefersReducedMotion;

  // Memoise context value so consumers don't re-render unnecessarily
  const value = useMemo<AnimationContextValue>(
    () => ({ animationsEnabled, prefersReducedMotion, intensity }),
    [animationsEnabled, prefersReducedMotion, intensity],
  );

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function useAnimation(): AnimationContextValue {
  return useContext(AnimationContext);
}
