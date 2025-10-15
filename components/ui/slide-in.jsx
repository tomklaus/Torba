"use client"

import { cn } from "../../lib/utils"
import * as React from "react"
import { motion } from 'framer-motion'
import { createSlideInAnimation } from '../../lib/animations'

const SlideIn = React.forwardRef(({ className, direction = "up", delay = 0, duration = 0.5, children, ...props }, ref) => {
  const slideInVariants = createSlideInAnimation(direction, duration);
  
  return (
    <motion.div
      ref={ref}
      className={cn("", className)}
      variants={slideInVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration }}
      {...props}
    >
      {children}
    </motion.div>
  );
});
SlideIn.displayName = "SlideIn";

export { SlideIn };
