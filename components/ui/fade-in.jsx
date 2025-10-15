"use client"

import { cn } from "../../lib/utils"
import * as React from "react"
import { motion } from 'framer-motion'
import { createFadeInAnimation } from '../../lib/animations'

const FadeIn = React.forwardRef(({ className, delay = 0, duration = 0.5, children, ...props }, ref) => {
  const fadeInVariants = createFadeInAnimation(duration);
  
  return (
    <motion.div
      ref={ref}
      className={cn("", className)}
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration }}
      {...props}
    >
      {children}
    </motion.div>
  );
});
FadeIn.displayName = "FadeIn";

export { FadeIn };
