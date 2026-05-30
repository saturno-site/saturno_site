export type EnneagramTypeId =
  | "one"
  | "two"
  | "three"
  | "four"
  | "five"
  | "six"
  | "seven"
  | "eight"
  | "nine";

export type EnneagramType = {
  id: EnneagramTypeId;
  name: string;
  headline: string;
  summary: string;
  growthTip: string;
};

export type QuizAnswer = {
  id: string;
  label: string;
  weights: Partial<Record<EnneagramTypeId, number>>;
};

export type QuizQuestion = {
  id: number;
  prompt: string;
  answers: QuizAnswer[];
};

export const enneagramTypes: EnneagramType[] = [
  {
    id: "one",
    name: "Type One",
    headline: "The Reformer",
    summary:
      "You care about doing the right thing, improving systems, and maintaining integrity.",
    growthTip:
      "Allow space for rest, accept imperfections, and remember that good enough is often enough.",
  },
  {
    id: "two",
    name: "Type Two",
    headline: "The Supporter",
    summary:
      "You express warmth, generosity, and care through helping others feel valued and seen.",
    growthTip:
      "Practice asking for what you need, and make space for your own boundaries.",
  },
  {
    id: "three",
    name: "Type Three",
    headline: "The Achiever",
    summary:
      "You focus on success, energy, and image, aiming to make a strong impact quickly.",
    growthTip:
      "Stay present with your real values rather than chasing only external rewards.",
  },
  {
    id: "four",
    name: "Type Four",
    headline: "The Individualist",
    summary:
      "You feel deeply, connect to soulful expression, and value authenticity in every moment.",
    growthTip:
      "Balance emotion with routine and celebrate your unique gifts without comparison.",
  },
  {
    id: "five",
    name: "Type Five",
    headline: "The Investigator",
    summary:
      "You seek clarity, insight, and independence through thoughtful observation.",
    growthTip:
      "Share your ideas sooner and trust that you have enough to contribute meaningfully.",
  },
  {
    id: "six",
    name: "Type Six",
    headline: "The Loyalist",
    summary:
      "You are grounded in responsibility, support, and thoughtful planning for safety.",
    growthTip:
      "Trust your instincts, and allow yourself to feel secure even when uncertainty appears.",
  },
  {
    id: "seven",
    name: "Type Seven",
    headline: "The Enthusiast",
    summary:
      "You chase possibility, fun, and freedom while staying curious about life’s options.",
    growthTip:
      "Slow down enough to savor the present moment and deepen what matters most.",
  },
  {
    id: "eight",
    name: "Type Eight",
    headline: "The Challenger",
    summary:
      "You bring strength, clarity, and bold protection for people and ideals you care about.",
    growthTip:
      "Practice vulnerability and soften your power with compassion and listening.",
  },
  {
    id: "nine",
    name: "Type Nine",
    headline: "The Peacemaker",
    summary:
      "You create calm, harmony, and steady support while prioritizing unity.",
    growthTip:
      "Stand up for your needs and honor your own voice alongside others’.",
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    prompt: "When you are most yourself, you tend to…",
    answers: [
      {
        id: "a",
        label: "Make a clear plan and follow it through.",
        weights: { one: 2, six: 1 },
      },
      {
        id: "b",
        label: "Stay open to new experiences and ideas.",
        weights: { seven: 2, four: 1 },
      },
      {
        id: "c",
        label: "Support others and make sure everyone feels included.",
        weights: { two: 2, nine: 1 },
      },
    ],
  },
  {
    id: 2,
    prompt: "In a group situation, you usually…",
    answers: [
      {
        id: "a",
        label: "Take charge and create momentum.",
        weights: { three: 2, eight: 1 },
      },
      {
        id: "b",
        label: "Listen carefully and look for consensus.",
        weights: { nine: 2, six: 1 },
      },
      {
        id: "c",
        label: "Express your individuality and what matters most.",
        weights: { four: 2, five: 1 },
      },
    ],
  },
  {
    id: 3,
    prompt: "Your ideal day feels most energizing when it includes…",
    answers: [
      {
        id: "a",
        label: "A meaningful goal with visible progress.",
        weights: { three: 2, one: 1 },
      },
      {
        id: "b",
        label: "Curiosity, creativity, and time to explore.",
        weights: { seven: 2, five: 1 },
      },
      {
        id: "c",
        label: "Warm connections and thoughtful support.",
        weights: { two: 2, nine: 1 },
      },
    ],
  },
  {
    id: 4,
    prompt: "When you feel stressed, you are most likely to…",
    answers: [
      {
        id: "a",
        label: "Double down on your principles and ideals.",
        weights: { one: 2, eight: 1 },
      },
      {
        id: "b",
        label: "Withdraw to process ideas quietly.",
        weights: { five: 2, four: 1 },
      },
      {
        id: "c",
        label: "Worry about possibility and look for safety.",
        weights: { six: 2, nine: 1 },
      },
    ],
  },
  {
    id: 5,
    prompt: "People often describe you as…",
    answers: [
      {
        id: "a",
        label: "Confident, decisive, and protective.",
        weights: { eight: 2, three: 1 },
      },
      {
        id: "b",
        label: "Compassionate, generous, and deeply caring.",
        weights: { two: 2, four: 1 },
      },
      {
        id: "c",
        label: "Reflective, curious, and quietly insightful.",
        weights: { five: 2, nine: 1 },
      },
    ],
  },
  {
    id: 6,
    prompt: "Where do you feel most confident?",
    answers: [
      {
        id: "a",
        label: "When I keep things smooth and welcome everyone.",
        weights: { nine: 2, two: 1 },
      },
      {
        id: "b",
        label: "When I have clear direction and can achieve big goals.",
        weights: { three: 2, eight: 1 },
      },
      {
        id: "c",
        label: "When I express my true perspective even if it’s different.",
        weights: { four: 2, one: 1 },
      },
    ],
  },
  {
    id: 7,
    prompt: "The word that fits you best is…",
    answers: [
      {
        id: "a",
        label: "Practical and principled.",
        weights: { one: 2, six: 1 },
      },
      {
        id: "b",
        label: "Energetic and adventurous.",
        weights: { seven: 2, three: 1 },
      },
      {
        id: "c",
        label: "Calm and steady.",
        weights: { nine: 2, five: 1 },
      },
    ],
  },
  {
    id: 8,
    prompt: "Your strongest motivator is…",
    answers: [
      {
        id: "a",
        label: "A desire to protect people and stand up for what’s fair.",
        weights: { eight: 2, one: 1 },
      },
      {
        id: "b",
        label: "A need to feel secure and supported.",
        weights: { six: 2, two: 1 },
      },
      {
        id: "c",
        label: "A wish to discover meaning and stay original.",
        weights: { four: 2, seven: 1 },
      },
    ],
  },
];
