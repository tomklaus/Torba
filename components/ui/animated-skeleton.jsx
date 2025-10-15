"use client"

import { cn } from "../../lib/utils"
import { motion } from 'framer-motion'

const AnimatedSkeleton = ({ className, ...props }) => {
  return (
    <motion.div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props} />
  );
}

export { AnimatedSkeleton }
