"use client";

export default function ThreeFallback({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-indigo-400/10 bg-slate-950/30 ${className}`} aria-hidden="true">
      <div className="absolute inset-8 rounded-full border border-indigo-400/20" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.14),transparent_55%)]" />
    </div>
  );
}
