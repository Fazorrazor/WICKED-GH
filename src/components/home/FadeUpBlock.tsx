"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

interface FadeUpSectionProps {
  children: ReactNode;
  className?: string;
  viewportAmount?: number;
}

export function FadeUpSection({
  children,
  className = "",
  viewportAmount = 0.15,
}: FadeUpSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

interface FadeUpDivProps {
  children: ReactNode;
  className?: string;
}

export function FadeUpDiv({ children, className = "" }: FadeUpDivProps) {
  return (
    <motion.div variants={fadeUpVariant} className={className}>
      {children}
    </motion.div>
  );
}

interface FadeUpHeadingProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function FadeUpHeading({
  children,
  className = "",
  as = "h2",
}: FadeUpHeadingProps) {
  const Component = motion[as];
  return (
    <Component variants={fadeUpVariant} className={className}>
      {children}
    </Component>
  );
}
