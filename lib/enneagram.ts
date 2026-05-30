import { enneagramTypes, quizQuestions, type EnneagramTypeId } from "@/data/enneagram";

export type QuizScore = {
  selectedType: EnneagramTypeId;
  score: number;
  breakdown: Record<EnneagramTypeId, number>;
};

export function scoreQuiz(answers: Record<number, string>): QuizScore {
  const breakdown: Record<EnneagramTypeId, number> = {
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    five: 0,
    six: 0,
    seven: 0,
    eight: 0,
    nine: 0,
  };

  quizQuestions.forEach((question) => {
    const selectedId = answers[question.id];
    if (!selectedId) {
      return;
    }

    const answer = question.answers.find((item) => item.id === selectedId);
    if (!answer) {
      return;
    }

    Object.entries(answer.weights).forEach(([type, weight]) => {
      const key = type as EnneagramTypeId;
      breakdown[key] += weight ?? 0;
    });
  });

  const selectedType = Object.entries(breakdown).reduce<EnneagramTypeId>(
    (winner, [type, total]) => {
      if (breakdown[winner] === undefined || total > breakdown[winner]) {
        return type as EnneagramTypeId;
      }
      return winner;
    },
    "one"
  );

  return {
    selectedType,
    score: breakdown[selectedType],
    breakdown,
  };
}

export function getTypeDetails(typeId: EnneagramTypeId) {
  return enneagramTypes.find((type) => type.id === typeId) ?? enneagramTypes[0];
}
