"use client"

import { cn } from "../../lib/utils"
import * as React from "react"
import { motion } from 'framer-motion'
import { cardHover } from '../../lib/animations'

const AnimatedCard = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn("rounded-lg border bg-card text-card-foreground shadow-xs", className)}
    variants={cardHover}
    whileHover="hover"
    {...props} />
))
AnimatedCard.displayName = "AnimatedCard"

const AnimatedCardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props} />
))
AnimatedCardHeader.displayName = "AnimatedCardHeader"

const AnimatedCardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <motion.h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props} />
))
AnimatedCardTitle.displayName = "AnimatedCardTitle"

const AnimatedCardDescription = React.forwardRef(({ className, ...props }, ref) => (
 <motion.p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
AnimatedCardDescription.displayName = "AnimatedCardDescription"

const AnimatedCardContent = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
AnimatedCardContent.displayName = "AnimatedCardContent"

const AnimatedCardFooter = React.forwardRef(({ className, ...props }, ref) => (
 <motion.div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props} />
))
AnimatedCardFooter.displayName = "AnimatedCardFooter"

export { 
  AnimatedCard, 
  AnimatedCardHeader, 
  AnimatedCardFooter, 
  AnimatedCardTitle, 
  AnimatedCardDescription, 
  AnimatedCardContent 
}
