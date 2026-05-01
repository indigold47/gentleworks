"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type FadeInLeftProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** True for elements visible on page load (uses animate). False = whileInView. */
  onMount?: boolean;
};

export function FadeInLeft({ children, className, delay = 0, onMount = false }: FadeInLeftProps) {
  const prefersReduced = useReducedMotion();

  if (onMount) {
    return (
      <motion.div
        className={className}
        initial={prefersReduced ? false : { opacity: 0, filter: "blur(12px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 2, ease: [0.4, 0, 0.2, 1], delay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={prefersReduced ? false : { opacity: 0, filter: "blur(12px)" }}
      whileInView={prefersReduced ? undefined : { opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "150px" }}
      transition={{ duration: 2, ease: [0.4, 0, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
