// ──────────────────────────────────────────────────────
// Saturno Geometric Character Data
//
// Each Enneagram type gets a unique low-poly faceted
// humanoid figure built from SVG polygon faces in a
// 200×200 viewBox.
//
// Characters vary in shape, posture, and vibe to
// reflect the essence of each type.
// ──────────────────────────────────────────────────────

import { typeColors, type EnneagramTypeId } from "@/data/enneagram-system";

// ── Types ─────────────────────────────────────────────

/**
 * A single polygon face in the character's geometry.
 *
 * @example
 * ```ts
 * { points: "65,18 135,18 132,48 68,48", fill: "light", opacity: 1 }
 * ```
 */
export interface CharacterPolygon {
  /** SVG polygon points string — space-separated "x,y" pairs. */
  points: string;
  /**
   * Color mapping key. Resolved at render time against the character's
   * colour palette:
   * - `"primary"` — main body colour
   * - `"light"` — highlight areas (face, upper body)
   * - `"dark"` — shadow areas (lower body, under features)
   * - `"mid"` — transition / mid-tone areas
   * - `"accent"` — small detail areas (eyes, accessories)
   */
  fill: "primary" | "light" | "dark" | "mid" | "accent";
  /** Optional opacity override (default: 1). */
  opacity?: number;
}

/**
 * Groups of polygons that form the character's body parts.
 * Each group can be animated independently.
 */
export interface CharacterPose {
  head: CharacterPolygon[];
  body: CharacterPolygon[];
  arms: CharacterPolygon[];
  legs: CharacterPolygon[];
  /** Type-specific extra elements (glasses, emblems, etc.). */
  accessories?: CharacterPolygon[];
}

/**
 * Resolved colour palette for a character.
 */
export interface CharacterColors {
  primary: string;
  light: string;
  dark: string;
  mid: string;
  accent: string;
}

/**
 * Complete definition of a geometric Enneagram character.
 */
export interface CharacterData {
  id: EnneagramTypeId;
  /** Numeric id (1-9). */
  number: number;
  /** Human-readable name, e.g. "The Reformer". */
  name: string;
  /** Primary colour hex (convenience accessor). */
  baseColor: string;
  /** Resolved colour palette for this character. */
  colors: CharacterColors;
  /** Polygon groups forming the character's pose. */
  pose: CharacterPose;
  /**
   * Visual style descriptors used by consumers for layout or animation
   * selection.
   */
  style: {
    /** Overall silhouette shape. */
    bodyShape: string;
    /** How the character holds itself. */
    posture: string;
    /** Emotional / energy quality. */
    vibe: string;
  };
}

// ── Colour helpers ────────────────────────────────────

/**
 * Blend two hex colours at a given ratio (0 = all `a`, 1 = all `b`).
 */
function blend(a: string, b: string, ratio: number): string {
  const hex = (v: number) =>
    Math.round(Math.max(0, Math.min(255, v)))
      .toString(16)
      .padStart(2, "0");

  const parse = (c: string) => {
    const h = c.replace("#", "");
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16),
    };
  };

  const aC = parse(a);
  const bC = parse(b);

  return `#${hex(aC.r + (bC.r - aC.r) * ratio)}${hex(aC.g + (bC.g - aC.g) * ratio)}${hex(aC.b + (bC.b - aC.b) * ratio)}`;
}

/**
 * Build the 5-colour palette from the canonical 3-colour
 * `typeColors` record.
 */
function buildColors(
  palette: { primary: string; light: string; dark: string },
): CharacterColors {
  return {
    primary: palette.primary,
    light: palette.light,
    dark: palette.dark,
    mid: blend(palette.primary, palette.light, 0.5),
    accent: blend(palette.primary, palette.dark, 0.5),
  };
}

// ── Character Definitions ─────────────────────────────

/**
 * All 9 geometric characters keyed by their
 * {@link EnneagramTypeId}.
 *
 * Characters are rendered in a 200×200 SVG viewBox.  Each is
 * constructed from 9–15 polygon faces that tile together in a
 * low-poly / origami style.
 */
export const CHARACTERS: Record<EnneagramTypeId, CharacterData> = {
  // ═══════════════ TYPE ONE — THE REFORMER ═══════════════
  // Body Triad | Angular | Upright | Structured
  one: {
    id: "one",
    number: 1,
    name: "The Reformer",
    baseColor: typeColors.one.primary,
    colors: buildColors(typeColors.one),
    style: { bodyShape: "angular", posture: "upright", vibe: "structured" },
    pose: {
      head: [
        // Forehead / upper face (trapezoid, wider at top)
        { points: "65,18 135,18 132,48 68,48", fill: "light" },
        // Lower face / jaw (trapezoid, narrower at chin)
        { points: "68,48 132,48 128,58 72,58", fill: "primary" },
        // Neck
        { points: "80,58 120,58 118,68 82,68", fill: "mid" },
      ],
      body: [
        // Torso main (tall rectangle)
        { points: "58,68 142,68 138,105 62,105", fill: "primary" },
        // Chest facet (inner rectangle highlight)
        { points: "72,68 128,68 124,86 76,86", fill: "light" },
        // Lower torso / waist shadow
        { points: "62,86 138,86 138,105 62,105", fill: "dark" },
      ],
      arms: [
        // Left arm (straight at side, rigid)
        { points: "52,70 62,70 58,115 48,115", fill: "primary" },
        // Left forearm / hand
        { points: "48,115 58,115 54,145 44,145", fill: "mid" },
        // Right arm (straight at side, rigid)
        { points: "138,70 148,70 152,115 142,115", fill: "primary" },
        // Right forearm / hand
        { points: "142,115 152,115 156,145 146,145", fill: "mid" },
      ],
      legs: [
        // Left leg
        { points: "68,105 92,105 86,175 66,175", fill: "dark" },
        // Left shoe
        { points: "66,175 86,175 88,185 64,185", fill: "accent" },
        // Right leg
        { points: "108,105 132,105 134,175 114,175", fill: "dark" },
        // Right shoe
        { points: "114,175 134,175 136,185 112,185", fill: "accent" },
      ],
      accessories: [
        // Belt / buckle detail
        { points: "75,99 125,99 125,105 75,105", fill: "accent" },
      ],
    },
  },

  // ═══════════════ TYPE TWO — THE HELPER ═══════════════
  // Heart Triad | Rounded | Open | Warm
  two: {
    id: "two",
    number: 2,
    name: "The Helper",
    baseColor: typeColors.two.primary,
    colors: buildColors(typeColors.two),
    style: { bodyShape: "rounded", posture: "open", vibe: "warm" },
    pose: {
      head: [
        // Rounded head (hexagonal approximation)
        { points: "62,15 138,15 135,28 142,42 130,55 70,55 58,42 65,28", fill: "primary" },
        // Face highlight
        { points: "75,18 125,18 122,28 110,42 90,42 78,28", fill: "light" },
        // Neck
        { points: "86,55 114,55 112,65 88,65", fill: "mid" },
      ],
      body: [
        // Heart-like torso (wider at shoulders, curved at bottom)
        { points: "52,65 148,65 135,100 100,118 65,100", fill: "primary" },
        // Chest facet
        { points: "66,65 134,65 126,84 100,95 74,84", fill: "light" },
        // Lower torso shadow
        { points: "62,80 138,80 128,100 100,112 72,100", fill: "dark" },
      ],
      arms: [
        // Left arm reaching outward (welcoming)
        { points: "44,68 56,68 50,105 38,100", fill: "primary" },
        // Left forearm extended
        { points: "38,100 50,105 44,138 34,130", fill: "mid" },
        // Right arm reaching outward (welcoming)
        { points: "144,68 156,68 162,100 150,105", fill: "primary" },
        // Right forearm extended
        { points: "150,105 162,100 166,130 156,138", fill: "mid" },
      ],
      legs: [
        // Left leg
        { points: "72,105 95,105 90,175 70,175", fill: "dark" },
        // Left shoe
        { points: "70,175 90,175 92,185 68,185", fill: "accent" },
        // Right leg
        { points: "105,105 128,105 130,175 110,175", fill: "dark" },
        // Right shoe
        { points: "110,175 130,175 132,185 108,185", fill: "accent" },
      ],
      accessories: [
        // Heart accent on chest
        { points: "88,85 112,85 100,98", fill: "accent" },
      ],
    },
  },

  // ═══════════════ TYPE THREE — THE ACHIEVER ═══════════════
  // Heart Triad | Angular | Forward | Dynamic
  three: {
    id: "three",
    number: 3,
    name: "The Achiever",
    baseColor: typeColors.three.primary,
    colors: buildColors(typeColors.three),
    style: { bodyShape: "angular", posture: "forward", vibe: "dynamic" },
    pose: {
      head: [
        // Dynamic triangular head shape
        { points: "70,12 130,12 120,30 100,48 80,30", fill: "primary" },
        // Face highlight
        { points: "80,16 120,16 110,30 90,30", fill: "light" },
        // Neck leaning forward
        { points: "90,48 110,48 115,62 95,62", fill: "mid" },
      ],
      body: [
        // Streamlined torso (triangular, dynamic lean)
        { points: "55,62 142,62 138,90 95,110 60,90", fill: "primary" },
        // Chest facet
        { points: "70,62 130,62 125,80 95,95 75,80", fill: "light" },
        // Lower torso shadow
        { points: "62,80 138,80 130,95 95,108 70,95", fill: "dark" },
      ],
      arms: [
        // Left arm (drawn back, dynamic)
        { points: "50,64 60,64 56,108 42,108", fill: "primary" },
        // Left forearm
        { points: "42,108 56,108 48,138 38,135", fill: "mid" },
        // Right arm (forward, reaching)
        { points: "138,62 148,62 158,98 148,105", fill: "primary" },
        // Right forearm reaching
        { points: "148,105 158,98 162,132 150,135", fill: "mid" },
      ],
      legs: [
        // Left leg (back, in motion)
        { points: "68,105 88,105 78,175 62,175", fill: "dark" },
        // Left shoe
        { points: "62,175 78,175 82,185 58,185", fill: "accent" },
        // Right leg (forward stride)
        { points: "100,105 122,105 132,175 112,175", fill: "dark" },
        // Right shoe
        { points: "112,175 132,175 136,185 108,185", fill: "accent" },
      ],
      accessories: [
        // Motion trail — dynamic slash accent
        { points: "90,100 105,108 100,110 88,102", fill: "accent" },
      ],
    },
  },

  // ═══════════════ TYPE FOUR — THE INDIVIDUALIST ═══════════════
  // Heart Triad | Asymmetric | Still | Elegant
  four: {
    id: "four",
    number: 4,
    name: "The Individualist",
    baseColor: typeColors.four.primary,
    colors: buildColors(typeColors.four),
    style: { bodyShape: "asymmetric", posture: "still", vibe: "elegant" },
    pose: {
      head: [
        // Tilted, asymmetric head
        { points: "70,14 130,14 126,30 120,52 78,48 68,36", fill: "primary" },
        // Face highlight
        { points: "76,18 122,18 118,30 108,44 86,42 80,28", fill: "light" },
        // Slender neck
        { points: "86,50 114,50 112,62 88,62", fill: "mid" },
      ],
      body: [
        // Narrow asymmetric torso
        { points: "60,62 140,62 135,100 65,100", fill: "primary" },
        // Chest facet
        { points: "72,62 128,62 124,78 76,78", fill: "light" },
        // Lower torso shadow
        { points: "64,78 136,78 135,100 65,100", fill: "dark" },
      ],
      arms: [
        // Left arm (bent, elegant — different from right)
        { points: "52,64 62,64 56,88 48,92", fill: "primary" },
        { points: "48,92 56,88 50,118 42,115", fill: "mid" },
        // Right arm (straight down — different from left)
        { points: "138,64 148,64 154,115 144,115", fill: "primary" },
        { points: "144,115 154,115 158,145 148,145", fill: "mid" },
      ],
      legs: [
        // Left leg (different stance)
        { points: "68,100 88,100 82,170 62,170", fill: "dark" },
        { points: "62,170 82,170 85,185 58,185", fill: "accent" },
        // Right leg (offset stance)
        { points: "112,100 132,100 140,170 118,170", fill: "dark" },
        { points: "118,170 140,170 142,185 114,185", fill: "accent" },
      ],
      accessories: [
        // Elegant collar detail
        { points: "74,58 126,58 118,66 82,66", fill: "accent" },
      ],
    },
  },

  // ═══════════════ TYPE FIVE — THE INVESTIGATOR ═══════════════
  // Head Triad | Compact | Still | Observant
  five: {
    id: "five",
    number: 5,
    name: "The Investigator",
    baseColor: typeColors.five.primary,
    colors: buildColors(typeColors.five),
    style: { bodyShape: "compact", posture: "still", vibe: "observant" },
    pose: {
      head: [
        // Large head (enlarged relative to body — observer)
        { points: "60,10 140,10 136,30 142,50 130,62 70,62 58,50 64,30", fill: "primary" },
        // Face highlight
        { points: "72,14 128,14 124,28 116,46 84,46 76,28", fill: "light" },
        // Short neck
        { points: "86,62 114,62 112,70 88,70", fill: "mid" },
      ],
      body: [
        // Compact, hunched torso
        { points: "64,70 136,70 130,110 70,110", fill: "primary" },
        // Chest facet
        { points: "76,70 124,70 118,88 82,88", fill: "light" },
        // Lower torso shadow
        { points: "68,88 132,88 130,110 70,110", fill: "dark" },
      ],
      arms: [
        // Left arm (folded inward, protective)
        { points: "56,72 68,72 74,96 62,100", fill: "primary" },
        { points: "62,100 74,96 76,120 64,118", fill: "mid" },
        // Right arm (folded inward)
        { points: "132,72 144,72 138,100 126,96", fill: "primary" },
        { points: "126,96 138,100 136,118 124,120", fill: "mid" },
      ],
      legs: [
        // Cross-legged sitting posture
        { points: "70,110 90,110 78,150 58,148", fill: "dark" },
        { points: "58,148 78,150 82,160 54,158", fill: "accent" },
        // Right leg crossed over left
        { points: "110,110 130,110 142,148 122,150", fill: "dark" },
        { points: "122,150 142,148 146,158 118,160", fill: "accent" },
      ],
      accessories: [
        // Glasses (single connected polygon spanning both lenses)
        { points: "76,36 98,36 98,44 102,44 102,36 124,36 124,50 102,50 102,42 98,42 98,50 76,50", fill: "accent" },
      ],
    },
  },

  // ═══════════════ TYPE SIX — THE LOYALIST ═══════════════
  // Head Triad | Angular | Grounded | Alert
  six: {
    id: "six",
    number: 6,
    name: "The Loyalist",
    baseColor: typeColors.six.primary,
    colors: buildColors(typeColors.six),
    style: { bodyShape: "angular", posture: "grounded", vibe: "alert" },
    pose: {
      head: [
        // Helmet-like angular head
        { points: "62,14 138,14 135,32 140,48 128,58 72,58 60,48 65,32", fill: "primary" },
        // Face highlight
        { points: "74,18 126,18 122,30 116,46 84,46 78,30", fill: "light" },
        // Neck
        { points: "84,58 116,58 114,68 86,68", fill: "mid" },
      ],
      body: [
        // Shield-shaped broad torso
        { points: "52,68 148,68 140,110 60,110", fill: "primary" },
        // Chest facet
        { points: "64,68 136,68 128,86 72,86", fill: "light" },
        // Lower torso shadow
        { points: "58,86 142,86 140,110 60,110", fill: "dark" },
      ],
      arms: [
        // Left arm (guarded, slightly out)
        { points: "46,70 56,70 50,105 40,110", fill: "primary" },
        { points: "40,110 50,105 44,135 36,130", fill: "mid" },
        // Right arm (guarded, slightly out)
        { points: "144,70 154,70 160,110 150,105", fill: "primary" },
        { points: "150,105 160,110 164,130 156,135", fill: "mid" },
      ],
      legs: [
        // Left leg (wide stance)
        { points: "62,110 86,110 78,175 56,175", fill: "dark" },
        { points: "56,175 78,175 82,185 52,185", fill: "accent" },
        // Right leg (wide stance)
        { points: "114,110 138,110 144,175 122,175", fill: "dark" },
        { points: "122,175 144,175 148,185 118,185", fill: "accent" },
      ],
      accessories: [
        // Shield emblem on chest
        { points: "88,78 112,78 108,94 100,100 92,94", fill: "accent" },
      ],
    },
  },

  // ═══════════════ TYPE SEVEN — THE ENTHUSIAST ═══════════════
  // Head Triad | Rounded | Expansive | Playful
  seven: {
    id: "seven",
    number: 7,
    name: "The Enthusiast",
    baseColor: typeColors.seven.primary,
    colors: buildColors(typeColors.seven),
    style: { bodyShape: "rounded", posture: "expansive", vibe: "playful" },
    pose: {
      head: [
        // Wide, open, star-like head
        { points: "62,12 138,12 142,26 138,42 126,56 74,56 62,42 58,26", fill: "primary" },
        // Face highlight
        { points: "76,16 124,16 120,28 112,44 88,44 80,28", fill: "light" },
        // Neck
        { points: "86,56 114,56 112,66 88,66", fill: "mid" },
      ],
      body: [
        // Star-like expansive torso
        { points: "50,66 150,66 142,104 100,116 58,104", fill: "primary" },
        // Chest facet
        { points: "64,66 136,66 128,84 100,94 72,84", fill: "light" },
        // Lower torso shadow
        { points: "56,84 144,84 140,104 100,112 60,104", fill: "dark" },
      ],
      arms: [
        // Left arm (reaching UP — playful, expansive)
        { points: "42,68 54,68 44,40 34,44", fill: "primary" },
        { points: "44,40 34,44 28,18 38,14", fill: "mid" },
        // Right arm (open to side)
        { points: "146,68 158,68 168,80 160,88", fill: "primary" },
        { points: "160,88 168,80 178,98 168,102", fill: "mid" },
      ],
      legs: [
        // Left leg
        { points: "72,106 92,106 86,175 68,175", fill: "dark" },
        { points: "68,175 86,175 90,185 64,185", fill: "accent" },
        // Right leg
        { points: "108,106 128,106 132,175 114,175", fill: "dark" },
        { points: "114,175 132,175 136,185 110,185", fill: "accent" },
      ],
      accessories: [
        // Star / sparkle detail above head
        { points: "110,20 116,20 113,26 120,26 113,28 116,34 110,30 104,34 107,28 100,26 107,26", fill: "accent" },
      ],
    },
  },

  // ═══════════════ TYPE EIGHT — THE CHALLENGER ═══════════════
  // Body Triad | Broad | Grounded | Powerful
  eight: {
    id: "eight",
    number: 8,
    name: "The Challenger",
    baseColor: typeColors.eight.primary,
    colors: buildColors(typeColors.eight),
    style: { bodyShape: "broad", posture: "grounded", vibe: "powerful" },
    pose: {
      head: [
        // Blocky, strong head
        { points: "64,14 136,14 133,34 138,50 126,58 74,58 62,50 67,34", fill: "primary" },
        // Face highlight
        { points: "76,18 124,18 120,32 114,48 86,48 80,32", fill: "light" },
        // Thick neck
        { points: "82,58 118,58 116,70 84,70", fill: "mid" },
      ],
      body: [
        // Diamond-shaped broad torso
        { points: "42,70 158,70 148,100 100,118 52,100", fill: "primary" },
        // Chest facet
        { points: "56,70 144,70 134,86 100,100 66,86", fill: "light" },
        // Lower torso shadow
        { points: "48,86 152,86 148,100 100,116 52,100", fill: "dark" },
      ],
      arms: [
        // Left arm (slightly out, powerful)
        { points: "38,72 50,72 44,108 32,108", fill: "primary" },
        { points: "32,108 44,108 38,142 28,138", fill: "mid" },
        // Right arm (slightly out, powerful)
        { points: "150,72 162,72 168,108 156,108", fill: "primary" },
        { points: "156,108 168,108 172,138 162,142", fill: "mid" },
      ],
      legs: [
        // Left leg (wide, planted)
        { points: "64,110 90,110 82,175 58,175", fill: "dark" },
        { points: "58,175 82,175 86,185 54,185", fill: "accent" },
        // Right leg (wide, planted)
        { points: "110,110 136,110 142,175 118,175", fill: "dark" },
        { points: "118,175 142,175 146,185 114,185", fill: "accent" },
      ],
      accessories: [
        // Power emblem on chest
        { points: "90,78 110,78 116,92 100,102 84,92", fill: "accent" },
      ],
    },
  },

  // ═══════════════ TYPE NINE — THE PEACEMAKER ═══════════════
  // Body Triad | Rounded | Open | Peaceful
  nine: {
    id: "nine",
    number: 9,
    name: "The Peacemaker",
    baseColor: typeColors.nine.primary,
    colors: buildColors(typeColors.nine),
    style: { bodyShape: "rounded", posture: "open", vibe: "peaceful" },
    pose: {
      head: [
        // Soft, rounded head
        { points: "66,16 134,16 138,30 134,48 124,58 76,58 66,48 62,30", fill: "primary" },
        // Face highlight
        { points: "78,20 122,20 118,32 110,46 90,46 82,32", fill: "light" },
        // Neck
        { points: "88,58 112,58 110,68 90,68", fill: "mid" },
      ],
      body: [
        // Rounded, softly blended torso
        { points: "56,68 144,68 136,108 64,108", fill: "primary" },
        // Chest facet
        { points: "70,68 130,68 122,86 78,86", fill: "light" },
        // Lower torso shadow
        { points: "62,86 138,86 136,108 64,108", fill: "dark" },
      ],
      arms: [
        // Left arm (relaxed at side)
        { points: "50,70 60,70 56,112 46,112", fill: "primary" },
        { points: "46,112 56,112 50,142 42,140", fill: "mid" },
        // Right arm (relaxed at side)
        { points: "140,70 150,70 154,112 144,112", fill: "primary" },
        { points: "144,112 154,112 158,140 150,142", fill: "mid" },
      ],
      legs: [
        // Left leg
        { points: "72,108 92,108 86,175 70,175", fill: "dark" },
        { points: "70,175 86,175 90,185 66,185", fill: "accent" },
        // Right leg
        { points: "108,108 128,108 130,175 114,175", fill: "dark" },
        { points: "114,175 130,175 134,185 110,185", fill: "accent" },
      ],
      accessories: [
        // Peace circle / centred dot
        { points: "96,80 104,80 104,88 96,88", fill: "accent" },
      ],
    },
  },
} as const;
