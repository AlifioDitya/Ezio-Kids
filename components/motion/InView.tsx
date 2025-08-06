// components/motion/InView.tsx
"use client";
import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

type Props = React.PropsWithChildren<{
  delay?: number;
  y?: number; // initial translateY
  once?: boolean; // animate only once
  className?: string;
}>;

export default function InView({
  children,
  delay = 0,
  y = 16,
  once = true,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once, margin: "0px 0px -10% 0px" }); // trigger a bit early

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
