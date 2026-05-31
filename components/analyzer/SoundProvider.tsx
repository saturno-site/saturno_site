"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { playCue, type SoundCue } from "@/lib/audio/useSound";

type SoundContextValue = {
  muted: boolean;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
  play: (cue: SoundCue) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("saturno:sound-muted");
    return saved === null ? true : saved !== "false";
  });

  const setMuted = useCallback((nextMuted: boolean) => {
    setMutedState(nextMuted);
    window.localStorage.setItem("saturno:sound-muted", String(nextMuted));
  }, []);

  const toggleMuted = useCallback(() => setMuted(!muted), [muted, setMuted]);

  const play = useCallback((cue: SoundCue) => {
    void playCue(cue, muted);
  }, [muted]);

  const value = useMemo(() => ({ muted, setMuted, toggleMuted, play }), [muted, setMuted, toggleMuted, play]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    return {
      muted: true,
      setMuted: () => undefined,
      toggleMuted: () => undefined,
      play: () => undefined,
    } satisfies SoundContextValue;
  }
  return context;
}
