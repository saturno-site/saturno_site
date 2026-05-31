"use client";

import dynamic from "next/dynamic";
import ThreeFallback from "@/components/analyzer/three/ThreeFallback";
import type { EnneagramTypeId } from "@/data/enneagram-system";

type BoardProps = {
  primaryType?: EnneagramTypeId;
  activeTypes?: EnneagramTypeId[];
  ambient?: boolean;
  className?: string;
};

type RevealProps = {
  type: EnneagramTypeId;
};

export const LazyEnneagramBoard3D = dynamic<BoardProps>(
  () => import("@/components/analyzer/three/EnneagramBoard3D").then((mod) => mod.EnneagramBoard3D),
  {
    ssr: false,
    loading: () => <ThreeFallback className="h-full min-h-[280px] w-full" />,
  },
);

export const LazyTypeRevealScene = dynamic<RevealProps>(
  () => import("@/components/analyzer/three/TypeRevealScene").then((mod) => mod.TypeRevealScene),
  {
    ssr: false,
    loading: () => <ThreeFallback className="h-[320px] w-full" />,
  },
);
