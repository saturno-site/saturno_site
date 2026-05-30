import { type Variants, type Transition } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Shared Transitions                                                 */
/* ------------------------------------------------------------------ */

/** Standard spring — snappy without being jarring. */
export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};

/** Gentle spring — soft, slow, deliberate. */
export const gentleTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
};

/** Bouncy spring — dramatic overshoot. */
export const bouncyTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 10,
};

/** Elastic pop — quick snap with a small bounce. */
export const elasticPop: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 12,
};

/* ------------------------------------------------------------------ */
/*  Reusable Variant Presets                                           */
/* ------------------------------------------------------------------ */

/**
 * Fades element upward while revealing.
 * @example
 * ```tsx
 * <motion.div variants={fadeUp} initial="hidden" whileInView="visible" />
 * ```
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

/**
 * Scales element from 0.8 → 1 with opacity fade.
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
};

/**
 * Slides element in from the left.
 */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransition,
  },
};

/**
 * Slides element in from the right.
 */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransition,
  },
};

/**
 * Container that staggers its children on enter.
 * Use with {@link staggerItem} on children.
 *
 * @example
 * ```tsx
 * <motion.div variants={staggerContainer} initial="hidden" whileInView="visible">
 *   <motion.div variants={staggerItem} />
 *   <motion.div variants={staggerItem} />
 * </motion.div>
 * ```
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

/**
 * Faster variant of {@link staggerContainer}.
 */
export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

/**
 * Individual item variant designed to pair with `staggerContainer`.
 * Fades up from below when the parent triggers `visible`.
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

/**
 * Lifts element on hover with a subtle shadow.
 * @example
 * ```tsx
 * <motion.div variants={hoverLift} initial="rest" whileHover="hover" />
 * ```
 */
export const hoverLift: Variants = {
  rest: { y: 0, boxShadow: "0 0 0 0 rgba(0,0,0,0)" },
  hover: {
    y: -4,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    transition: springTransition,
  },
};

/**
 * Adds a coloured glow shadow on hover.
 */
export const hoverGlow: Variants = {
  rest: { boxShadow: "0 0 0 0 rgba(168,85,247,0)" },
  hover: {
    boxShadow: "0 0 24px 4px rgba(168,85,247,0.35)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

/**
 * Slight shrink on tap for tactile feedback.
 */
export const tapScale: Variants = {
  rest: { scale: 1 },
  tap: { scale: 0.95 },
};

/**
 * 3D card flip — wraps a rotating surface.
 *
 * **Usage note:** Apply `perspective: 1000` and `transformStyle: "preserve-3d"`
 * on the parent, then use `variants={cardFlip}` with `initial="front"`
 * and `animate={isFlipped ? "back" : "front"}`.
 *
 * @example
 * ```tsx
 * <motion.div style={{ perspective: 1000 }}>
 *   <motion.div
 *     style={{ transformStyle: "preserve-3d" }}
 *     variants={cardFlip}
 *     initial="front"
 *     animate={isFlipped ? "back" : "front"}
 *   >
 *     <Face />
 *   </motion.div>
 * </motion.div>
 * ```
 */
export const cardFlip: Variants = {
  front: {
    rotateY: 0,
    transition: springTransition,
  },
  back: {
    rotateY: 180,
    transition: springTransition,
  },
};

/**
 * SVG path draw animation for stroke-based artwork.
 * Requires `strokeDasharray` and `strokeLinecap` on the SVG element.
 *
 * @example
 * ```tsx
 * <motion.path
 *   d={...}
 *   variants={pathDraw}
 *   initial="hidden"
 *   whileInView="visible"
 * />
 * ```
 */
export const pathDraw: Variants = {
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 1,
    transition: { duration: 1.5, ease: "easeInOut" },
  },
};

/* ------------------------------------------------------------------ */
/*  Factory Helpers                                                    */
/* ------------------------------------------------------------------ */

/**
 * Creates a hover variant that combines scale, translation, and slight
 * rotation — mimicking the "magnetic pull" effect seen in modern UIs.
 *
 * Because Framer Motion variants cannot read cursor position directly,
 * the effect is approximated with a spring-based transform using the
 * supplied amplitude.
 *
 * @param amplitude - Maximum displacement in pixels (default: 10).
 *
 * @example
 * ```tsx
 * const magnetic = createMagneticHover(12);
 * <motion.div variants={magnetic} initial="rest" whileHover="hover" />
 * ```
 */
export function createMagneticHover(amplitude: number = 10): Variants {
  return {
    rest: { scale: 1, rotate: 0, x: 0, y: 0 },
    hover: {
      scale: 1.05,
      rotate: amplitude * 0.5,
      x: amplitude,
      y: -amplitude * 0.5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };
}
