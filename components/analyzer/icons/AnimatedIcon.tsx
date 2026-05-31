"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

type AnimatedIconProps = {
  icon: LucideIcon;
  className?: string;
  label?: string;
  decorative?: boolean;
  spin?: boolean;
};

export default function AnimatedIcon({ icon: Icon, className, label, decorative = true, spin = false }: AnimatedIconProps) {
  return (
    <motion.span
      aria-hidden={decorative ? "true" : undefined}
      aria-label={!decorative ? label : undefined}
      initial={false}
      whileHover={{ scale: 1.12, rotate: spin ? 16 : 0 }}
      whileTap={{ scale: 0.9 }}
      animate={spin ? { rotate: [0, 4, -4, 0] } : undefined}
      transition={{ duration: 0.45, repeat: spin ? Infinity : 0, repeatDelay: 2 }}
      className="inline-flex"
    >
      <Icon className={className} />
    </motion.span>
  );
}
