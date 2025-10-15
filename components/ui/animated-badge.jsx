"use client"

import { cn } from "../../lib/utils"
import * as React from "react"
import { motion } from 'framer-motion'

const AnimatedBadge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <motion.span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80": variant === "default",
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80": variant === "destructive",
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "color-border bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
        },
        className
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props} />
  )
})
AnimatedBadge.displayName = "AnimatedBadge"

export { AnimatedBadge }
