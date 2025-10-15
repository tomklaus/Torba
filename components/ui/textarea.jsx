"use client"
import { cn } from "../../lib/utils"
import * as React from "react"
import { motion } from 'framer-motion'

const Textarea = React.forwardRef(({ className, animated = false, ...props }, ref) => {
  if (animated) {
    return (
      <motion.textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileFocus={{ scale: 1.01, borderColor: "hsl(222.2, 84%, 4.9%)" }}
        ref={ref}
        {...props} />
    );
  }
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
