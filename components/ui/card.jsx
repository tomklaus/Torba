"use client"

import { cn } from "../../lib/utils"
import * as React from "react"
import { motion } from 'framer-motion'
import { cardHover } from '../../lib/animations'

const Card = React.forwardRef(({ className, animated = false, ...props }, ref) => {
  if (animated) {
    return (
      <motion.div
        ref={ref}
        className={cn("rounded-lg border bg-card text-card-foreground shadow-xs", className)}
        variants={cardHover}
        whileHover="hover"
        {...props} />
    );
  }
  return (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-xs", className)}
      {...props} />
  );
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
 <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
 <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
