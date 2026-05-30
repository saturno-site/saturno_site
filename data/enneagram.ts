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
      "You have an inner compass that always points toward integrity, improvement, and doing what's right.",
    growthTip:
      "Practise catching your inner critic and replacing judgment with curiosity — done is better than perfect.",
  },
  {
    id: "two",
    name: "Type Two",
    headline: "The Supporter",
    summary:
      "You have a gift for sensing what others need and an open heart that wants to help them feel seen and valued.",
    growthTip:
      "Practise asking for what you need, and give yourself permission to say no without explaining.",
  },
  {
    id: "three",
    name: "Type Three",
    headline: "The Achiever",
    summary:
      "You are driven, magnetic, and built to create impact — channelling your energy into goals that shine.",
    growthTip:
      "Ask yourself what you want when nobody is watching, and separate your worth from your to-do list.",
  },
  {
    id: "four",
    name: "Type Four",
    headline: "The Individualist",
    summary:
      "You feel the world in vivid colour — alive to beauty, meaning, and the ache of being truly yourself.",
    growthTip:
      "Practise gratitude for what is, not grief for what isn't — and find beauty in ordinary moments too.",
  },
  {
    id: "five",
    name: "Type Five",
    headline: "The Investigator",
    summary:
      "You see the world as a fascinating puzzle — and you'd rather observe, understand, and master it than rush in.",
    growthTip:
      "Share an unfinished idea with someone and trust the process — done beats perfect understanding.",
  },
  {
    id: "six",
    name: "Type Six",
    headline: "The Loyalist",
    summary:
      "Your mind is always scanning for what could go wrong — not because you're afraid, but because you care about being ready.",
    growthTip:
      "Question your doubts — not everything you fear is real. Practise courage as a muscle, one small step at a time.",
  },
  {
    id: "seven",
    name: "Type Seven",
    headline: "The Enthusiast",
    summary:
      "You move through life like a spark — chasing joy, possibility, and the next great adventure with infectious energy.",
    growthTip:
      "Practise the one-thing rule: do one thing fully before moving on, and let yourself be bored sometimes.",
  },
  {
    id: "eight",
    name: "Type Eight",
    headline: "The Challenger",
    summary:
      "You are a force of nature — built to protect, lead, and speak truth even when your voice shakes the room.",
    growthTip:
      "Practise vulnerability with people you trust — real strength includes softness and knowing when to listen.",
  },
  {
    id: "nine",
    name: "Type Nine",
    headline: "The Peacemaker",
    summary:
      "You carry a quiet, steady warmth that makes people feel at home — you harmonise without effort and see all sides with grace.",
    growthTip:
      "Practise stating your opinion first, before you hear everyone else's — your voice matters too.",
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
      {
        id: "d",
        label: "Focus deeply on understanding how things work.",
        weights: { five: 2, one: 1 },
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
        weights: { eight: 2, three: 1 },
      },
      {
        id: "b",
        label: "Listen carefully and look for consensus.",
        weights: { nine: 2, two: 1 },
      },
      {
        id: "c",
        label: "Express your individuality and speak from the heart.",
        weights: { four: 2, five: 1 },
      },
      {
        id: "d",
        label: "Rally everyone with energy and optimism.",
        weights: { three: 2, seven: 1 },
      },
    ],
  },
  {
    id: 3,
    prompt: "Your ideal day feels most energising when it includes…",
    answers: [
      {
        id: "a",
        label: "Achieving something meaningful with visible results.",
        weights: { three: 2, one: 1 },
      },
      {
        id: "b",
        label: "Exploring something new and letting curiosity lead.",
        weights: { seven: 2, five: 1 },
      },
      {
        id: "c",
        label: "Spending quality time with people you care about.",
        weights: { two: 2, four: 1 },
      },
      {
        id: "d",
        label: "A calm, peaceful day with no pressure or rush.",
        weights: { nine: 2, six: 1 },
      },
    ],
  },
  {
    id: 4,
    prompt: "When you feel stressed, you are most likely to…",
    answers: [
      {
        id: "a",
        label: "Become more critical and perfectionistic about everything.",
        weights: { one: 2, four: 1 },
      },
      {
        id: "b",
        label: "Withdraw and analyse every angle before responding.",
        weights: { five: 2, seven: 1 },
      },
      {
        id: "c",
        label: "Worry about worst-case scenarios and seek reassurance.",
        weights: { six: 2, three: 1 },
      },
      {
        id: "d",
        label: "Push harder and take charge of the situation.",
        weights: { eight: 2, nine: 1 },
      },
    ],
  },
  {
    id: 5,
    prompt: "People often describe you as…",
    answers: [
      {
        id: "a",
        label: "Strong, direct, and protective of the people you value.",
        weights: { eight: 2, one: 1 },
      },
      {
        id: "b",
        label: "Warm, generous, and attentive to everyone around you.",
        weights: { two: 2, three: 1 },
      },
      {
        id: "c",
        label: "Insightful, calm, and quietly thoughtful.",
        weights: { five: 2, four: 1 },
      },
      {
        id: "d",
        label: "Easygoing, supportive, and steady as a rock.",
        weights: { nine: 2, six: 1 },
      },
    ],
  },
  {
    id: 6,
    prompt: "Where do you feel most confident?",
    answers: [
      {
        id: "a",
        label: "When I'm bringing ease and harmony to a situation.",
        weights: { nine: 2, two: 1 },
      },
      {
        id: "b",
        label: "When I'm achieving big goals and being recognised.",
        weights: { three: 2, eight: 1 },
      },
      {
        id: "c",
        label: "When I'm expressing my authentic self without filters.",
        weights: { four: 2, one: 1 },
      },
      {
        id: "d",
        label: "When I'm fully prepared and know my stuff inside out.",
        weights: { six: 2, five: 1 },
      },
    ],
  },
  {
    id: 7,
    prompt: "The word that fits you best is…",
    answers: [
      {
        id: "a",
        label: "Principled and purposeful.",
        weights: { one: 2, nine: 1 },
      },
      {
        id: "b",
        label: "Adventurous and spontaneous.",
        weights: { seven: 2, three: 1 },
      },
      {
        id: "c",
        label: "Curious and analytical.",
        weights: { five: 2, six: 1 },
      },
      {
        id: "d",
        label: "Bold and commanding.",
        weights: { eight: 2, four: 1 },
      },
    ],
  },
  {
    id: 8,
    prompt: "Your strongest motivator is…",
    answers: [
      {
        id: "a",
        label: "A desire to protect people and stand up for what's fair.",
        weights: { eight: 2, two: 1 },
      },
      {
        id: "b",
        label: "A need to feel secure, supported, and connected.",
        weights: { six: 2, two: 1 },
      },
      {
        id: "c",
        label: "A wish to create something beautiful and deeply meaningful.",
        weights: { four: 2, seven: 1 },
      },
      {
        id: "d",
        label: "A drive to succeed, excel, and leave a mark.",
        weights: { three: 2, five: 1 },
      },
    ],
  },
  {
    id: 9,
    prompt: "How do you recharge after a long week?",
    answers: [
      {
        id: "a",
        label: "Quiet time in a peaceful, comfortable space.",
        weights: { nine: 2, five: 1 },
      },
      {
        id: "b",
        label: "A fun new experience — try something you've never done.",
        weights: { seven: 2, eight: 1 },
      },
      {
        id: "c",
        label: "Reflecting deeply, journalling, or making something creative.",
        weights: { four: 2, two: 1 },
      },
      {
        id: "d",
        label: "Getting organised — tidying up and checking things off.",
        weights: { one: 2, three: 1 },
      },
    ],
  },
  {
    id: 10,
    prompt: "When it comes to making decisions, you tend to…",
    answers: [
      {
        id: "a",
        label: "Weigh the pros and cons carefully before committing.",
        weights: { six: 2, five: 1 },
      },
      {
        id: "b",
        label: "Trust your gut and make the call quickly.",
        weights: { eight: 2, three: 1 },
      },
      {
        id: "c",
        label: "Follow your principles and do what feels right.",
        weights: { one: 2, two: 1 },
      },
      {
        id: "d",
        label: "Go with what feels most exciting and full of possibility.",
        weights: { seven: 2, two: 1 },
      },
    ],
  },
  {
    id: 11,
    prompt: "What do you value most in relationships?",
    answers: [
      {
        id: "a",
        label: "Deep emotional honesty and the freedom to be real.",
        weights: { four: 2, one: 1 },
      },
      {
        id: "b",
        label: "Loyalty, dependability, and someone who shows up.",
        weights: { six: 2, nine: 1 },
      },
      {
        id: "c",
        label: "Warmth, generosity, and a sense of mutual care.",
        weights: { two: 2, three: 1 },
      },
      {
        id: "d",
        label: "Freedom, fun, and a shared sense of adventure.",
        weights: { seven: 2, eight: 1 },
      },
    ],
  },
  {
    id: 12,
    prompt: "Your relationship with time is best described as…",
    answers: [
      {
        id: "a",
        label: "Fast and full — there's so much to experience!",
        weights: { seven: 2, three: 1 },
      },
      {
        id: "b",
        label: "Slow and present — you savour each moment as it comes.",
        weights: { nine: 2, four: 1 },
      },
      {
        id: "c",
        label: "Planned and prepared — you like to stay ahead.",
        weights: { six: 2, one: 1 },
      },
      {
        id: "d",
        label: "Deep and focused — you lose track of hours when engaged.",
        weights: { five: 2, eight: 1 },
      },
    ],
  },
  {
    id: 13,
    prompt: "When a conflict arises, you tend to…",
    answers: [
      {
        id: "a",
        label: "Stand your ground and speak your truth directly.",
        weights: { eight: 2, six: 1 },
      },
      {
        id: "b",
        label: "Smooth things over and find common ground for everyone.",
        weights: { nine: 2, two: 1 },
      },
      {
        id: "c",
        label: "Step back and process your feelings quietly.",
        weights: { four: 2, five: 1 },
      },
      {
        id: "d",
        label: "Focus on finding the right and fairest solution.",
        weights: { one: 2, three: 1 },
      },
    ],
  },
  {
    id: 14,
    prompt: "Deep down, what do you secretly worry about?",
    answers: [
      {
        id: "a",
        label: "That I'll make the wrong choice and regret it forever.",
        weights: { six: 2, one: 1 },
      },
      {
        id: "b",
        label: "That I'm not special enough to leave a real mark.",
        weights: { four: 2, three: 1 },
      },
      {
        id: "c",
        label: "That I'll be trapped or miss out on something amazing.",
        weights: { seven: 2, eight: 1 },
      },
      {
        id: "d",
        label: "That I'll be overwhelmed and not have enough to cope.",
        weights: { five: 2, two: 1 },
      },
    ],
  },
  {
    id: 15,
    prompt: "What are you proudest of in yourself?",
    answers: [
      {
        id: "a",
        label: "The depth of my care and loyalty to the people I love.",
        weights: { two: 2, six: 1 },
      },
      {
        id: "b",
        label: "My ability to aim high and turn dreams into reality.",
        weights: { three: 2, seven: 1 },
      },
      {
        id: "c",
        label: "My calm, accepting nature that puts others at ease.",
        weights: { nine: 2, eight: 1 },
      },
      {
        id: "d",
        label: "My integrity and commitment to doing what's right.",
        weights: { one: 2, five: 1 },
      },
    ],
  },
];
