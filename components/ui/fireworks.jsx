"use client"

import { cn } from "../../lib/utils"
import * as React from "react"
import { motion, AnimatePresence } from 'framer-motion'

const Fireworks = ({ show = false, onComplete, className, ...props }) => {
  // Create multiple particles for fireworks effect
  const particles = Array.from({ length: 15 }, (_, i) => i);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn("fixed inset-0 pointer-events-none z-50", className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...props}
        >
          {particles.map((i) => {
            const angle = (i * 2 * Math.PI) / particles.length;
            const distance = 100 + Math.random() * 100; // Random distance
            const duration = 0.8 + Math.random() * 0.4; // Random duration
            
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 60%)`, // Random color
                  left: '50%',
                  top: '50%',
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 1,
                  opacity: 1
                }}
                animate={{ 
                  x: Math.cos(angle) * distance, 
                  y: Math.sin(angle) * distance, 
                  scale: [1, 1.5, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{ 
                  duration: duration,
                  ease: "easeOut"
                }}
                onAnimationComplete={() => i === particles.length - 1 && onComplete && onComplete()}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Fireworks };
