// ──────────────────────────────────────────────────────
// Saturno Enneagram System — Expanded Knowledge Base
// ──────────────────────────────────────────────────────
// This is the single source of truth for all Enneagram
// data in the Saturno app. Every quiz, profile, and
// visualisation draws from this file.
// ──────────────────────────────────────────────────────

// ── Re-exports from the original (simpler) data file ──
// Keeps existing imports working without breaking changes.
export type { EnneagramType, QuizAnswer, QuizQuestion } from "./enneagram";
export { enneagramTypes, quizQuestions } from "./enneagram";

// ── Core Type Identifiers ─────────────────────────────

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

export type TriadType = "body" | "heart" | "head";

export type InstinctType = "self-preservation" | "social" | "sexual";

export type HornevianTriad = "assertive" | "withdrawn" | "compliant";

export type HarmonicTriad = "positive-outlook" | "competency" | "reactive";

// ── Full Type Shape ───────────────────────────────────

export type EnneagramTypeFull = {
  id: EnneagramTypeId;
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  name: string;
  archetype: string;
  headline: string;
  summary: string;
  description: string;
  coreFear: string;
  coreDesire: string;
  coreWeakness: string;
  virtue: string;
  egoFixation: string;
  holyIdea: string;
  woundingMessage: string;
  triad: TriadType;
  hornevianTriad: HornevianTriad;
  harmonicTriad: HarmonicTriad;
  wingOptions: [EnneagramTypeId, EnneagramTypeId];
  integrationType: EnneagramTypeId;
  disintegrationType: EnneagramTypeId;
  instinctualVariants: {
    selfPreservation: string;
    social: string;
    sexual: string;
  };
  strengths: string[];
  challenges: string[];
  growthTips: string[];
  famousExamples: string[];
  compatibleTypes: EnneagramTypeId[];
  challengingTypes: EnneagramTypeId[];
};

// ── Wing Key ──────────────────────────────────────────

export type WingKey = `${number}w${number}`;

// ── Color Palette ─────────────────────────────────────

export const typeColors: Record<
  EnneagramTypeId,
  { primary: string; light: string; dark: string; gradient: string }
> = {
  one: {
    primary: "#E8A838",
    light: "#F5D48A",
    dark: "#B87D1E",
    gradient: "linear-gradient(135deg, #E8A838, #B87D1E)",
  },
  two: {
    primary: "#E8535A",
    light: "#F29BA0",
    dark: "#C12E35",
    gradient: "linear-gradient(135deg, #E8535A, #C12E35)",
  },
  three: {
    primary: "#F4C430",
    light: "#F8D97A",
    dark: "#C79F12",
    gradient: "linear-gradient(135deg, #F4C430, #C79F12)",
  },
  four: {
    primary: "#7B3F9E",
    light: "#B882D4",
    dark: "#542B6E",
    gradient: "linear-gradient(135deg, #7B3F9E, #542B6E)",
  },
  five: {
    primary: "#1A8A8A",
    light: "#5CC4C4",
    dark: "#0F5C5C",
    gradient: "linear-gradient(135deg, #1A8A8A, #0F5C5C)",
  },
  six: {
    primary: "#4A6CF7",
    light: "#8EAAFA",
    dark: "#2645C7",
    gradient: "linear-gradient(135deg, #4A6CF7, #2645C7)",
  },
  seven: {
    primary: "#00B4A0",
    light: "#5EE0D0",
    dark: "#008573",
    gradient: "linear-gradient(135deg, #00B4A0, #008573)",
  },
  eight: {
    primary: "#C41E3A",
    light: "#E6687C",
    dark: "#8F1428",
    gradient: "linear-gradient(135deg, #C41E3A, #8F1428)",
  },
  nine: {
    primary: "#5B8C5A",
    light: "#95C094",
    dark: "#3D663C",
    gradient: "linear-gradient(135deg, #5B8C5A, #3D663C)",
  },
};

// ── Triads ────────────────────────────────────────────

export const triads: Record<
  TriadType,
  {
    name: string;
    center: string;
    emotion: string;
    types: EnneagramTypeId[];
    description: string;
    color: string;
  }
> = {
  body: {
    name: "Body / Gut",
    center: "Instinctive Center",
    emotion: "Anger",
    types: ["eight", "nine", "one"],
    description:
      "The Gut triad operates on instinct, intuition, and a visceral sense of knowing. These types have a direct, embodied relationship with anger — whether expressing it (8), repressing it (9), or channelling it into perfection (1). At their best, they trust their gut and act with grounded presence.",
    color: "#C41E3A",
  },
  heart: {
    name: "Heart / Feeling",
    center: "Emotional Center",
    emotion: "Shame",
    types: ["two", "three", "four"],
    description:
      "The Heart triad navigates the world through feeling, connection, and identity. These types are relationally attuned and grapple with shame — whether they overcome it by helping (2), outperform it (3), or wear it as identity (4). Their gift is deep emotional intelligence and empathy.",
    color: "#7B3F9E",
  },
  head: {
    name: "Head / Thinking",
    center: "Intellectual Center",
    emotion: "Fear",
    types: ["five", "six", "seven"],
    description:
      "The Head triad lives in the realm of thought, anticipation, and strategy. These types are driven by fear — whether they retreat into knowledge (5), fixate on security (6), or escape into possibility (7). When healthy, they channel their mental energy into wisdom and foresight.",
    color: "#4A6CF7",
  },
};

// ── Instincts ─────────────────────────────────────────

export const instincts: Record<
  InstinctType,
  {
    name: string;
    description: string;
    focus: string;
  }
> = {
  "self-preservation": {
    name: "Self-Preservation",
    description:
      "Focused on physical safety, comfort, resources, and wellbeing. This instinct drives you to secure shelter, health, and the material foundations of a stable life.",
    focus: "Security, health, resources, comfort, practical wellbeing",
  },
  social: {
    name: "Social",
    description:
      "Focused on belonging, community, relationships, and social structures. This instinct drives you to find your place within groups and contribute meaningfully to the collective.",
    focus: "Belonging, status, community, group dynamics, shared meaning",
  },
  sexual: {
    name: "Sexual / One-to-One",
    description:
      "Focused on intimate connection, intensity, chemistry, and creative life force. This instinct drives you toward deep bonding, attraction, and the electrifying experience of merging with another.",
    focus: "Intimacy, attraction, chemistry, intensity, creative union",
  },
};

// ── Integration (Growth) & Disintegration (Stress) ────

export const integrationMap: Record<EnneagramTypeId, EnneagramTypeId> = {
  one: "seven",
  two: "four",
  three: "six",
  four: "one",
  five: "eight",
  six: "nine",
  seven: "five",
  eight: "two",
  nine: "three",
};

export const disintegrationMap: Record<EnneagramTypeId, EnneagramTypeId> = {
  one: "four",
  two: "eight",
  three: "nine",
  four: "two",
  five: "seven",
  six: "three",
  seven: "one",
  eight: "five",
  nine: "six",
};

// ── Wing Descriptions ─────────────────────────────────

export const wingDescriptions: Record<WingKey, string> = {
  "1w9": `The Idealist. Quietly principled, you blend the One's high standards with the Nine's calm acceptance. You'd rather inspire change through example than confrontation. Your challenge is speaking up when peace costs integrity.`,
  "1w2": `The Advocate. Your reformer's fire is warmed by the Two's heart. You champion causes and care deeply about people. You can struggle with people-pleasing and burnout from over-giving.`,
  "2w1": `The Servant. Generosity meets principle. You give with both warmth and moral clarity — always looking to improve the lives of others. Watch out for resentment when your help goes unappreciated.`,
  "2w3": `The Host / Charmer. Warm, ambitious, and magnetic. You blend the Two's caring nature with the Three's drive to shine. You thrive in social circles but may lose touch with your own needs.`,
  "3w2": `The Charmer. Success meets charisma. You're an ambitious networker who wins people over with warmth and drive. Your edge: learning that genuine connection matters more than admiration.`,
  "3w4": `The Professional. Achievement with depth. You bring the Three's ambition and the Four's authenticity to everything you create. You can struggle with comparing yourself to others and feeling never enough.`,
  "4w3": `The Aristocrat. Creative, expressive, and image-conscious. You weave the Four's emotional depth with the Three's polish. You have flair — just watch out for the trap of performing your feelings rather than living them.`,
  "4w5": `The Bohemian. Introspective, original, and intellectually deep. You blend the Four's sensitivity with the Five's analytical sharpness. You crave meaning and solitude, but can drift into isolation.`,
  "5w4": `The Iconoclast. A visionary thinker who merges the Five's logic with the Four's creative spark. You see the world differently and aren't afraid to challenge conventions. Guard against cynicism and withdrawal.`,
  "5w6": `The Problem Solver. Analytical, loyal, and thorough. You combine the Five's thirst for knowledge with the Six's sense of responsibility. You're the person everyone trusts to figure things out — just don't let fear stall your action.`,
  "6w5": `The Defender. Loyalty meets intellect. You blend the Six's vigilance with the Five's depth, making you a thoughtful protector of the people and causes you believe in. Your mind is your shield.`,
  "6w7": `The Buddy. The most playful and social Six. You balance loyalty with a love for adventure and humour. You can keep things light while still planning for every contingency.`,
  "7w6": `The Entertainer. Spontaneous, witty, and social. You bring the Seven's love of fun and the Six's loyalty and charm. You light up a room — but may use humour to dodge your deeper feelings.`,
  "7w8": `The Realist. Bold, decisive, and adventurous. You combine the Seven's appetite for experience with the Eight's no-nonsense power. You get things done, but may steamroll quieter voices.`,
  "8w7": `The Maverick. Dynamic, assertive, and larger than life. You blend the Eight's intensity with the Seven's restless energy. You lead with charisma and courage, but your fast pace can exhaust others.`,
  "8w9": `The Bear. The most grounded Eight. You combine raw power with the Nine's steady calm. You protect without aggression and lead without ego. Your challenge is staying awake to your own needs.`,
  "9w8": `The Peacemaker. Approachable, grounded, and quietly powerful. You blend the Nine's easygoing nature with the Eight's quiet strength. You're a calming presence who can also draw a firm line.`,
  "9w1": `The Dreamer. Gentle, principled, and quietly idealistic. You blend the Nine's harmony-seeking with the One's sense of purpose. You imagine a better world but may struggle to take the first step.`,
};

// ── SVG Paths for Type Morphing ───────────────────────
// All paths contain exactly 8 control points, closed (Z),
// in a "0 0 100 100" viewBox for smooth Flubber.js morphing.

export const typePaths: Record<EnneagramTypeId, string> = {
  one: "M 25 15 L 70 10 L 85 35 L 80 65 L 70 85 L 35 90 L 15 70 L 15 35 Z",
  two: "M 50 10 L 80 20 L 90 45 L 80 75 L 55 90 L 30 80 L 15 55 L 20 25 Z",
  three: "M 50 8 L 85 30 L 85 55 L 65 85 L 50 92 L 30 80 L 15 55 L 20 25 Z",
  four: "M 40 10 L 75 20 L 80 50 L 85 80 L 55 92 L 25 82 L 18 52 L 30 18 Z",
  five: "M 35 12 L 65 12 L 82 32 L 78 65 L 62 88 L 38 88 L 18 65 L 22 32 Z",
  six: "M 50 6 L 82 28 L 86 58 L 72 82 L 50 94 L 28 82 L 14 58 L 18 28 Z",
  seven: "M 22 12 L 78 12 L 92 38 L 86 65 L 62 88 L 38 88 L 14 65 L 10 38 Z",
  eight: "M 30 8 L 70 8 L 88 35 L 92 65 L 72 92 L 28 92 L 8 65 L 12 35 Z",
  nine: "M 50 12 L 78 28 L 88 52 L 72 82 L 50 90 L 28 82 L 12 52 L 22 28 Z",
};

// ── Helper: enneagramTypeFromId ───────────────────────

/**
 * Returns the full type data for a given EnneagramTypeId.
 * Throws immediately if the id is unrecognised (fail-fast).
 */
export function enneagramTypeFromId(
  id: EnneagramTypeId,
): EnneagramTypeFull {
  const found = enneagramTypesFull.find((t) => t.id === id);
  if (!found) {
    throw new Error(
      `Unknown Enneagram type id: "${id}". Expected one of: one, two, three, four, five, six, seven, eight, nine.`,
    );
  }
  return found;
}

// ── Core Data: All 9 Types ────────────────────────────

export const enneagramTypesFull: EnneagramTypeFull[] = [
  // ═══════════════ TYPE ONE ═══════════════
  {
    id: "one",
    number: 1,
    name: "Type One",
    archetype: "The Architect",
    headline: "The Reformer",
    summary:
      "You have an inner compass that always points toward integrity, improvement, and doing what's right.",
    description:
      "Ones carry an innate sense of purpose — a quiet knowing that things can and should be better. You see the gap between how the world is and how it could be, and you feel called to close it. This isn't about being perfect for its own sake; it's about honouring a deep moral standard that lives inside you.\n\nWhen Ones are healthy, they become wise leaders who inspire others through principled action and gentle correction. They learn to hold their ideals with an open hand, accepting imperfection in themselves and others while still striving meaningfully for a better world.",
    coreFear: "Being corrupt, defective, or morally wrong",
    coreDesire: "To be good, balanced, and have integrity",
    coreWeakness: "Anger / Resentment",
    virtue: "Serenity",
    egoFixation: "Resentment",
    holyIdea: "Perfection / Holy Truth",
    woundingMessage: "It is not okay to make mistakes.",
    triad: "body",
    hornevianTriad: "compliant",
    harmonicTriad: "competency",
    wingOptions: ["nine", "two"],
    integrationType: "seven",
    disintegrationType: "four",
    instinctualVariants: {
      selfPreservation:
        "Worries about doing daily life correctly — health, routines, and finances must meet a high standard. Tension lives in the details.",
      social:
        "Wants to reform and improve the groups they belong to. Carries a sense of responsibility for the collective good and feels called to set an example.",
      sexual:
        "Seeks intensity through a perfect union — whether romantic, creative, or spiritual. Passionate about finding the 'right' connection.",
    },
    strengths: [
      "Principled and dependable — people trust your word",
      "Sharp eye for improvement and quality",
      "Fair-minded and justice-oriented",
      "Self-disciplined and methodical",
      "Wise mentor who elevates others",
    ],
    challenges: [
      "Harsh inner critic that never lets up",
      "Tendency toward black-and-white thinking",
      "Can hold onto resentment long after conflicts pass",
      "Difficulty relaxing and letting go of control",
      "Perfectionism that stalls action",
    ],
    growthTips: [
      "Practise catching your inner critic and replacing judgment with curiosity.",
      "Allow yourself 'good enough' — done is better than perfect.",
      "Channel anger into constructive action instead of silent resentment.",
      "Schedule guilt-free rest and play — you deserve it.",
    ],
    famousExamples: [
      "Michelle Obama — principled grace and quiet reform",
      "Morgan Freeman — calm, authoritative wisdom",
      "Cate Blanchett — meticulous craft and moral depth",
      "Nelson Mandela — integrity in leadership",
    ],
    compatibleTypes: ["seven", "nine", "two"],
    challengingTypes: ["four", "eight", "six"],
  },

  // ═══════════════ TYPE TWO ═══════════════
  {
    id: "two",
    number: 2,
    name: "Type Two",
    archetype: "The Nurturer",
    headline: "The Supporter",
    summary:
      "You have a gift for sensing what others need and an open heart that wants to help them feel seen and valued.",
    description:
      "Twos navigate the world through relationship. You intuitively pick up on the emotional temperature of a room and know exactly how to make someone feel welcomed, supported, or cared for. Your generosity is genuine — the warmth you offer others comes from a real desire to connect and contribute.\n\nThe gift of the Two is a capacity for love that is both practical and profound. Healthy Twos learn that their own needs matter just as much as everyone else's. They love freely without strings, and their support empowers others to flourish rather than depend on them.",
    coreFear: "Being unwanted, unloved, or unnecessary to others",
    coreDesire: "To be loved, wanted, and appreciated",
    coreWeakness: "Pride",
    virtue: "Humility",
    egoFixation: "Flattery",
    holyIdea: "Freedom / Holy Will",
    woundingMessage: "It is not okay to have your own needs.",
    triad: "heart",
    hornevianTriad: "compliant",
    harmonicTriad: "positive-outlook",
    wingOptions: ["one", "three"],
    integrationType: "four",
    disintegrationType: "eight",
    instinctualVariants: {
      selfPreservation:
        "'I need no one' — takes pride in self-sufficiency. Can refuse help while exhausting themselves giving it. Home and hearth as safe haven for chosen people.",
      social:
        "Wants to be valued by the group. Seeks influence through indispensable service. May become the unofficial organiser, connector, or caretaker of every community.",
      sexual:
        "Intense, seductive, and focused on a single electrifying connection. Gives everything to 'the one' and can feel crushed if the bond is threatened.",
    },
    strengths: [
      "Deeply empathetic and emotionally intuitive",
      "Generous with time, energy, and attention",
      "Natural connector and relationship-builder",
      "Celebrates others' wins with genuine joy",
      "Creates warmth and belonging wherever they go",
    ],
    challenges: [
      "Neglects own needs while caring for everyone else",
      "Can become manipulative to get appreciation",
      "Struggles to receive help or say no",
      "Pride in being indispensable — burnout risk",
      "Difficulty recognising their own anger or hurt",
    ],
    growthTips: [
      "Practise asking for help — even when you don't 'need' it.",
      "Give yourself permission to say no without explaining.",
      "Notice when 'helping' is really about being needed.",
      "Make a 'selfish' list: things you want just for you.",
    ],
    famousExamples: [
      "Fred Rogers — boundless warmth and gentle wisdom",
      "Maya Angelou — nurturing spirit and profound grace",
      "Dolly Parton — generosity wrapped in strength",
      "Selena Gomez — open-hearted advocacy and care",
    ],
    compatibleTypes: ["eight", "four", "one"],
    challengingTypes: ["five", "three", "nine"],
  },

  // ═══════════════ TYPE THREE ═══════════════
  {
    id: "three",
    number: 3,
    name: "Type Three",
    archetype: "The Star",
    headline: "The Achiever",
    summary:
      "You are driven, magnetic, and built to create impact — channelling your energy into goals that shine.",
    description:
      "Threes move through life with velocity and purpose. You have a natural ability to set a goal, craft an image, and inspire others to get on board. You're not just chasing success for the status — you genuinely want to create value and make a difference. The world feels like a place of infinite possibility, and you intend to explore every avenue.\n\nWhen healthy, Threes are authentic leaders who use their charisma to elevate others rather than just themselves. They learn that true worth doesn't come from external validation, and they discover the freedom of being seen for who they really are — not just what they achieve.",
    coreFear: "Being worthless, insignificant, or a failure",
    coreDesire: "To be valuable, admired, and worthwhile",
    coreWeakness: "Deceit / Vanity",
    virtue: "Authenticity / Hopefulness",
    egoFixation: "Vanity",
    holyIdea: "Hope / Holy Law",
    woundingMessage: "It is not okay to have your own feelings.",
    triad: "heart",
    hornevianTriad: "assertive",
    harmonicTriad: "competency",
    wingOptions: ["two", "four"],
    integrationType: "six",
    disintegrationType: "nine",
    instinctualVariants: {
      selfPreservation:
        "Invests energy in practical security — career, savings, and tangible markers of success. The 'work hard, play hard' Three.",
      social:
        "Driven by recognition, fame, and reputation. Wants to be seen as the best in their field. Charismatic and politically savvy.",
      sexual:
        "Wants to be the most attractive, desirable partner. The relationship itself becomes an achievement. Can confuse admiration with love.",
    },
    strengths: [
      "Exceptionally goal-oriented and productive",
      "Charismatic and inspiring to others",
      "Adapts quickly and thrives under pressure",
      "Generous with mentorship and encouragement",
      "Turns vision into tangible reality",
    ],
    challenges: [
      "Can prioritise image over authentic self",
      "Difficulty slowing down or being still",
      "Workaholic tendencies and burnout risk",
      "Struggles with vulnerability and failure",
      "Can compete even when collaboration is better",
    ],
    growthTips: [
      "Ask yourself: 'What do I want if nobody is watching?'",
      "Practise being unproductive — read, rest, daydream.",
      "Share a failure openly — it connects more than success.",
      "Separate your worth from your to-do list.",
    ],
    famousExamples: [
      "Taylor Swift — meteoric drive and creative reinvention",
      "Dwayne Johnson — ambition with genuine charisma",
      "Oprah Winfrey — legendary impact and media mastery",
      "Usain Bolt — excellence and confident presence",
    ],
    compatibleTypes: ["six", "seven", "nine"],
    challengingTypes: ["four", "two", "one"],
  },

  // ═══════════════ TYPE FOUR ═══════════════
  {
    id: "four",
    number: 4,
    name: "Type Four",
    archetype: "The Poet",
    headline: "The Individualist",
    summary:
      "You feel the world in vivid colour — alive to beauty, meaning, and the ache of being truly yourself.",
    description:
      "Fours experience life with a depth and intensity that's hard to put into words. You're drawn to what's authentic, original, and emotionally true. Small talk feels hollow; you crave conversation that touches the real. There's a part of you that has always felt different, and while that's sometimes lonely, it's also the source of your creative power.\n\nWhen healthy, Fours become channels of profound creative expression and emotional wisdom. They stop defining themselves by what's missing and start finding beauty in what is. Their unique perspective becomes a gift they share generously, rather than a burden they carry alone.",
    coreFear: "Having no identity or significance — being ordinary",
    coreDesire: "To be unique, authentic, and deeply significant",
    coreWeakness: "Envy / Melancholy",
    virtue: "Equanimity",
    egoFixation: "Melancholy",
    holyIdea: "Origin / Holy Truth",
    woundingMessage: "It is not okay to be you.",
    triad: "heart",
    hornevianTriad: "withdrawn",
    harmonicTriad: "reactive",
    wingOptions: ["three", "five"],
    integrationType: "one",
    disintegrationType: "two",
    instinctualVariants: {
      selfPreservation:
        "Endurance through suffering — 'I can manage with very little.' Stoic, tenacious, and protective of their inner world. Finds beauty in simplicity.",
      social:
        "Shame about not fitting in. Can feel excluded even when welcomed. Seeks belonging through making a unique, irreplaceable contribution to the group.",
      sexual:
        "Competitive intensity in love. Wants to be the most captivating, the most inspiring. The relationship must be charged with meaning and emotional electricity.",
    },
    strengths: [
      "Deeply creative with a rich inner world",
      "Emotionally attuned and empathetic",
      "Sees beauty and meaning others overlook",
      "Authentic — refuses to fake connection",
      "Resilient in navigating emotional depth",
    ],
    challenges: [
      "Tendency toward melancholy and comparison",
      "Can get lost in longing for what's missing",
      "Struggles with feeling 'too much' or 'not enough'",
      "Can romanticise suffering as identity",
      "Difficulty with routine and mundane tasks",
    ],
    growthTips: [
      "Practise gratitude for what is, not grief for what isn't.",
      "Create before you perfect — let art be messy.",
      "Find beauty in ordinary moments, not just dramatic ones.",
      "Build small daily rituals — structure is not the enemy of soul.",
    ],
    famousExamples: [
      "Frida Kahlo — emotional truth and iconic self-expression",
      "Prince — unparalleled originality and artistry",
      "Amy Winehouse — raw depth and soulful vulnerability",
      "Virginia Woolf — introspective brilliance and lyrical depth",
    ],
    compatibleTypes: ["one", "two", "nine"],
    challengingTypes: ["three", "seven", "eight"],
  },

  // ═══════════════ TYPE FIVE ═══════════════
  {
    id: "five",
    number: 5,
    name: "Type Five",
    archetype: "The Sage",
    headline: "The Investigator",
    summary:
      "You see the world as a fascinating puzzle — and you'd rather observe, understand, and master it than rush to participate.",
    description:
      "Fives approach life with a quiet, penetrating curiosity. You're not content with surface explanations — you want to understand the underlying system, the hidden architecture of things. Your mind is your sanctuary, and knowledge is your oxygen. You can spend hours or days lost in a subject, following threads of curiosity wherever they lead.\n\nWhen healthy, Fives become generous, grounded experts who share their insights freely. They learn that knowing isn't the same as living, and they step out of the observer's seat to engage with the world they've studied so carefully. Their wisdom becomes a gift that helps others see more clearly.",
    coreFear: "Being useless, incapable, or overwhelmed by demands",
    coreDesire: "To be capable, knowledgeable, and self-sufficient",
    coreWeakness: "Avarice / Withholding",
    virtue: "Detachment (Non-Attachment)",
    egoFixation: "Stinginess",
    holyIdea: "Omniscience / Holy Wisdom",
    woundingMessage: "Your needs are too much.",
    triad: "head",
    hornevianTriad: "withdrawn",
    harmonicTriad: "competency",
    wingOptions: ["four", "six"],
    integrationType: "eight",
    disintegrationType: "seven",
    instinctualVariants: {
      selfPreservation:
        "Creates a fortress of solitude — a private sanctuary where needs are minimal and control is maximal. Deep need for non-intrusion.",
      social:
        "The 'expert' in the group — earns belonging through knowledge. Can be the wise advisor who prefers the sidelines to the stage.",
      sexual:
        "Seeks a meeting of minds so intense it becomes almost mystical. Shares secret knowledge and deep fascination with a chosen partner.",
    },
    strengths: [
      "Keen analytical mind and strategic thinking",
      "Deep expertise in areas they care about",
      "Calm and composed under pressure",
      "Independent and self-directed",
      "Sees patterns and connections others miss",
    ],
    challenges: [
      "Can hoard time, energy, and information",
      "Tendency to isolate and withdraw from relationships",
      "May overthink rather than act",
      "Struggles with emotional expression in groups",
      "Can feel drained by social demands and small talk",
    ],
    growthTips: [
      "Share an unfinished idea with someone — trust the process.",
      "Practise 'good enough' research — done beats perfect understanding.",
      "Let people in before you feel fully ready.",
      "Use your body — move, create, engage your senses.",
    ],
    famousExamples: [
      "Albert Einstein — curiosity as a way of life",
      "Bill Gates — deep systems thinking and strategic focus",
      "Lauryn Hill — introspective depth and intellectual artistry",
      "Stephen Hawking — mastery of cosmic complexity",
    ],
    compatibleTypes: ["eight", "nine", "one"],
    challengingTypes: ["two", "seven", "three"],
  },

  // ═══════════════ TYPE SIX ═══════════════
  {
    id: "six",
    number: 6,
    name: "Type Six",
    archetype: "The Guardian",
    headline: "The Loyalist",
    summary:
      "Your mind is always scanning for what could go wrong — not because you're afraid, but because you care about being ready.",
    description:
      "Sixes have a gift for seeing risk. Your mind naturally anticipates obstacles and prepares for contingencies. This isn't pessimism — it's a deep sense of responsibility. You want to be ready, not just for yourself but for the people who count on you. Loyalty is your anchor; when you commit to a person, team, or cause, you're all in.\n\nWhen healthy, Sixes become courageous, trustworthy leaders who turn their vigilance into wisdom. They learn to trust themselves as much as they trust the systems around them, and they discover that the safety they've always sought was inside them all along.",
    coreFear: "Being without support, guidance, or security — being unsafe",
    coreDesire: "To be secure, supported, and protected",
    coreWeakness: "Fear / Cowardice (Doubt)",
    virtue: "Courage",
    egoFixation: "Worrying",
    holyIdea: "Faith / Holy Strength",
    woundingMessage: "It is not okay to trust. You are not safe.",
    triad: "head",
    hornevianTriad: "compliant",
    harmonicTriad: "reactive",
    wingOptions: ["five", "seven"],
    integrationType: "nine",
    disintegrationType: "three",
    instinctualVariants: {
      selfPreservation:
        "Creates cozy, warm security. Nest-building, family-oriented, and deeply concerned with physical safety. The 'warm and fuzzy' Six.",
      social:
        "Duty and loyalty to the group. Can be the most committed activist, the guardian of the tribe. Belongs by being steadfast and reliable.",
      sexual:
        "Strength-seeking — attracted to powerful, confident partners. Tests relationships to find the breaking point. Wants a bond that can survive anything.",
    },
    strengths: [
      "Fierce loyalty to people and causes you believe in",
      "Excellent foresight and risk assessment",
      "Thoughtful, thorough, and detail-oriented",
      "Witty and warm once trust is earned",
      "Stands by commitments through hardship",
    ],
    challenges: [
      "Can catastrophise and spiral into worst-case thinking",
      "Projecting doubt onto others' intentions",
      "May struggle to trust own judgment",
      "Can be overly suspicious or defensive",
      "Procrastinates from fear of making the wrong choice",
    ],
    growthTips: [
      "Question your doubts — not everything you fear is real.",
      "Find one small thing to trust in yourself each day.",
      "Share your worries aloud — they shrink in the light.",
      "Practise courage as a muscle: do one brave thing daily.",
    ],
    famousExamples: [
      "Princess Leia (Carrie Fisher) — defiant loyalty under pressure",
      "Tom Hanks — steady reliability and grounded warmth",
      "Ariana Grande — resilience and protective loyalty",
      "Malcolm X — fierce commitment to a cause",
    ],
    compatibleTypes: ["nine", "two", "three"],
    challengingTypes: ["seven", "one", "eight"],
  },

  // ═══════════════ TYPE SEVEN ═══════════════
  {
    id: "seven",
    number: 7,
    name: "Type Seven",
    archetype: "The Explorer",
    headline: "The Enthusiast",
    summary:
      "You move through life like a spark — chasing joy, possibility, and the next great adventure with infectious energy.",
    description:
      "Sevens are wired for freedom and possibility. You see a world brimming with options, and you want to taste as many as you can. Boredom is your kryptonite; enthusiasm is your superpower. You're the person who says 'yes' before anyone else, who finds the silver lining, who turns a mundane moment into a memory.\n\nWhen healthy, Sevens channel their boundless energy into meaningful pursuits. They learn to sit still long enough to find depth, discovering that true fulfilment doesn't come from more experiences but from deeper ones. Their joy becomes contagious in the best way — lifting spirits without running from sorrow.",
    coreFear: "Being trapped, deprived, or forced to face pain alone",
    coreDesire: "To be fulfilled, satisfied, and free",
    coreWeakness: "Gluttony / Excess",
    virtue: "Sobriety",
    egoFixation: "Planning",
    holyIdea: "Wisdom / Holy Plan",
    woundingMessage: "It is not okay to depend on anyone.",
    triad: "head",
    hornevianTriad: "assertive",
    harmonicTriad: "positive-outlook",
    wingOptions: ["six", "eight"],
    integrationType: "five",
    disintegrationType: "one",
    instinctualVariants: {
      selfPreservation:
        "Collects resources, options, and experiences as a safety net. 'My favourite things' — curates a life of delightful variety and comfort.",
      social:
        "Shares enthusiasm with the world — wants to uplift and inspire groups. A natural optimist who rallies people around exciting visions.",
      sexual:
        "Séduction and fascination. The electrifying charge of new connection. Can chase the thrill of 'the one' and move on when intensity fades.",
    },
    strengths: [
      "Infectious enthusiasm that lifts everyone's energy",
      "Quick thinking and creative problem-solving",
      "Sees possibilities where others see dead ends",
      "Generous, adventurous, and open-hearted",
      "Resilient — bounces back faster than most",
    ],
    challenges: [
      "Avoids painful emotions through constant stimulation",
      "Can overcommit and spread too thin",
      "Struggles with follow-through and depth",
      "Fears missing out — FOMO runs deep",
      "Difficulty sitting with discomfort or grief",
    ],
    growthTips: [
      "Practise the 'one thing' rule — do one thing fully before moving on.",
      "Let yourself be bored — that's where creativity deepens.",
      "Stay present for uncomfortable conversations without escaping.",
      "Journal what you're running from, not just what you're running toward.",
    ],
    famousExamples: [
      "Robin Williams — transcendent joy and raw vulnerability",
      "Beyoncé — relentless creativity and visionary range",
      "Walt Disney — boundless imagination and optimistic ambition",
      "Jennifer Lawrence — playful energy and fearless spontaneity",
    ],
    compatibleTypes: ["five", "one", "three"],
    challengingTypes: ["four", "six", "nine"],
  },

  // ═══════════════ TYPE EIGHT ═══════════════
  {
    id: "eight",
    number: 8,
    name: "Type Eight",
    archetype: "The Protector",
    headline: "The Challenger",
    summary:
      "You are a force of nature — built to protect, lead, and speak truth even when your voice shakes the room.",
    description:
      "Eights are wired for impact. You feel things viscerally, love intensely, and have zero tolerance for injustice or pretence. You're not trying to be intimidating — but your presence is undeniable, and you've learned that strength is what keeps you and the people you love safe. Underneath the armour, though, there's a tender heart that wants to protect, provide, and be seen fully.\n\nWhen healthy, Eights become magnificent leaders who use their power to uplift rather than dominate. They learn that real strength includes vulnerability, and that the people they lead don't just need protection — they need to see the Eight's whole, true heart.",
    coreFear: "Being harmed, controlled, or violated by others",
    coreDesire: "To protect self and others — to be independent and powerful",
    coreWeakness: "Lust / Excess",
    virtue: "Innocence",
    egoFixation: "Vengeance",
    holyIdea: "Truth / Holy Power",
    woundingMessage: "It is not okay to be vulnerable.",
    triad: "body",
    hornevianTriad: "assertive",
    harmonicTriad: "reactive",
    wingOptions: ["seven", "nine"],
    integrationType: "two",
    disintegrationType: "five",
    instinctualVariants: {
      selfPreservation:
        "Intensive, focused energy on material security. 'My territory, my resources, my people.' Survival-oriented and grounded.",
      social:
        "Friendship as fortress. Protects the group fiercely, demands loyalty, and champions the underdog. Justice is personal.",
      sexual:
        "The most intense and possessive Eight. Wants total connection, total surrender and total control. The relationship is a crucible of transformation.",
    },
    strengths: [
      "Natural leader with commanding presence",
      "Fearless in speaking truth to power",
      "Protective and fiercely loyal",
      "Decisive — takes action when others hesitate",
      "Generous with a heart as big as their intensity",
    ],
    challenges: [
      "Can be confrontational and domineering",
      "Struggles with vulnerability and softness",
      "Tendency to 'my way or the highway' thinking",
      "Can push people away when feeling threatened",
      "Difficulty admitting weakness or asking for help",
    ],
    growthTips: [
      "Practise vulnerability with people you trust — it won't weaken you.",
      "Pause before reacting — count to three and breathe.",
      "Ask yourself: 'Am I protecting or attacking right now?'",
      "Let someone lead — even when you know you could do it better.",
    ],
    famousExamples: [
      "Mister T — iconic strength with surprising tenderness",
      "Serena Williams — fierce power and champion's grace",
      "Franklin D. Roosevelt — decisive leadership through crisis",
      "Idris Elba — commanding presence and grounded strength",
    ],
    compatibleTypes: ["two", "five", "seven"],
    challengingTypes: ["one", "four", "nine"],
  },

  // ═══════════════ TYPE NINE ═══════════════
  {
    id: "nine",
    number: 9,
    name: "Type Nine",
    archetype: "The Mediator",
    headline: "The Peacemaker",
    summary:
      "You carry a quiet, steady warmth that makes people feel at home — you harmonise without effort and see all sides with grace.",
    description:
      "Nines have a gift for creating peace without saying a word. Your presence is calming, your perspective is broad, and you have an almost supernatural ability to see every side of an argument. You're not passive — you're deeply attuned to the energy around you, and you know that harmony is often more powerful than conflict.\n\nWhen healthy, Nines are powerful forces of unity and grounded wisdom. They stop losing themselves in others and discover that their own voice matters just as much as everyone else's. Their peace is no longer a quiet retreat from the world — it's a gift they actively share.",
    coreFear: "Loss, separation, fragmentation — being disconnected",
    coreDesire: "To have inner peace, wholeness, and harmony",
    coreWeakness: "Sloth / Numbing Out",
    virtue: "Right Action (Diligence)",
    egoFixation: "Indolence",
    holyIdea: "Love / Holy Love",
    woundingMessage: "Your presence does not matter. It is not okay to assert yourself.",
    triad: "body",
    hornevianTriad: "withdrawn",
    harmonicTriad: "positive-outlook",
    wingOptions: ["eight", "one"],
    integrationType: "three",
    disintegrationType: "six",
    instinctualVariants: {
      selfPreservation:
        "The 'appetite' Nine — seeks comfort through food, routine, and physical ease. Can zone out into daily habits and lose ambition.",
      social:
        "Merges with the group — wants to belong so deeply they lose themselves. The most adaptable Nine, can mirror whatever the group needs.",
      sexual:
        "The 'merger' Nine — fuses with a partner to the point of losing their own boundaries. The relationship becomes their identity.",
    },
    strengths: [
      "Deeply compassionate and non-judgmental",
      "Sees all perspectives with rare clarity",
      "Calming, stabilising presence in chaos",
      "Patient and genuinely accepting of others",
      "Quietly resilient — steady through storms",
    ],
    challenges: [
      "Can numb out and avoid conflict at all costs",
      "Struggles to identify and assert own needs",
      "Tendency toward complacency and procrastination",
      "Can lose self in relationships and routines",
      "Difficulty prioritising — everything seems equally important",
    ],
    growthTips: [
      "Practise stating your opinion first — before you hear everyone else's.",
      "Wake up with: 'What do I want today?' — not 'What should I do?'",
      "Notice when you're 'checking out' and gently return to presence.",
      "Anger is information — let it speak without acting on it.",
    ],
    famousExamples: [
      "Keanu Reeves — quiet presence and profound kindness",
      "The Dalai Lama — peace as a living practice",
      "Mister Rogers — radical gentleness as strength",
      "Zendaya — grounded presence and unifying grace",
    ],
    compatibleTypes: ["three", "seven", "two"],
    challengingTypes: ["eight", "six", "four"],
  },
];
