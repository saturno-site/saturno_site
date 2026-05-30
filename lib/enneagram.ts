import { quizQuestions } from "@/data/enneagram";
import { enneagramTypesFull, typeColors, triads, integrationMap, disintegrationMap } from "@/data/enneagram-system";
import type { EnneagramTypeId } from "@/data/enneagram-system";
import { type QuizResult } from "@/lib/scoring-engine";

export type { EnneagramTypeId, QuizResult };

// Re-export the core scoring logic
export { scoreQuiz, getTypeColor } from "@/lib/scoring-engine";

export function getTypeDetails(typeId: EnneagramTypeId) {
  const type = enneagramTypesFull.find((t) => t.id === typeId);
  if (!type) return enneagramTypesFull[0]; // Fallback
  return type;
}
