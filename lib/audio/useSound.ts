"use client";

export type SoundCue = "hover" | "select" | "advance" | "actTransition" | "reveal" | "message";

type SynthState = {
  context: AudioContext;
  master: GainNode;
};

let synth: SynthState | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return null;
  if (!synth) {
    const context = new AudioContextCtor();
    const master = context.createGain();
    master.gain.value = 0.12;
    master.connect(context.destination);
    synth = { context, master };
  }
  return synth.context;
}

async function ensureSynth(): Promise<SynthState | null> {
  const context = getAudioContext();
  if (!context || !synth) return null;
  if (context.state === "suspended") {
    await context.resume().catch(() => undefined);
  }
  return synth;
}

function tone(state: SynthState, frequency: number, start: number, duration: number, type: OscillatorType = "sine", gain = 0.5) {
  const oscillator = state.context.createOscillator();
  const envelope = state.context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(gain, start + 0.015);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(envelope);
  envelope.connect(state.master);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function sweep(state: SynthState, from: number, to: number, start: number, duration: number, gain = 0.35) {
  const oscillator = state.context.createOscillator();
  const envelope = state.context.createGain();
  const filter = state.context.createBiquadFilter();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(from, start);
  oscillator.frequency.exponentialRampToValueAtTime(to, start + duration);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(600, start);
  filter.frequency.exponentialRampToValueAtTime(3200, start + duration);
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(gain, start + 0.03);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(filter);
  filter.connect(envelope);
  envelope.connect(state.master);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

export async function playCue(cue: SoundCue, muted: boolean) {
  if (muted) return;
  const state = await ensureSynth();
  if (!state) return;
  const now = state.context.currentTime;

  switch (cue) {
    case "hover":
      tone(state, 520, now, 0.07, "sine", 0.18);
      break;
    case "select":
      tone(state, 620, now, 0.11, "sine", 0.26);
      tone(state, 930, now + 0.055, 0.13, "sine", 0.22);
      break;
    case "advance":
      sweep(state, 220, 880, now, 0.24, 0.22);
      break;
    case "actTransition":
      sweep(state, 180, 1180, now, 0.42, 0.25);
      tone(state, 740, now + 0.24, 0.18, "triangle", 0.16);
      break;
    case "reveal":
      [392, 523.25, 659.25, 783.99].forEach((freq, index) => {
        tone(state, freq, now + index * 0.075, 0.28, "sine", 0.28 - index * 0.03);
      });
      break;
    case "message":
      tone(state, 440, now, 0.08, "triangle", 0.16);
      tone(state, 660, now + 0.045, 0.08, "triangle", 0.12);
      break;
  }
}
