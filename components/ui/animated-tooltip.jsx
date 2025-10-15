"use client"

import { cn } from "../../lib/utils"
import * as React from "react"
import { motion } from 'framer-motion'

const AnimatedTooltip = React.forwardRef(({ 
  children, 
  content, 
  position = "top", 
  delay = 0.3, 
  className, 
  ...props 
}, ref) => {
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
  }[position];

  return (
    <div className="relative inline-block" ref={ref}>
      {children}
      <motion.div
        className={cn(
          "absolute z-50 whitespace-nowrap bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg",
          positionClasses,
          className
        )}
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        whileHover={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        {content}
        <div className={cn(
          "absolute w-2 h-2 bg-gray-900 rotate-45",
          {
            top: "bottom-[-4px] left-1/2 transform -translate-x-1/2",
            bottom: "top-[-4px] left-1/2 transform -translate-x-1/2",
            left: "right-[-4px] top-1/2 transform -translate-y-1/2",
            right: "left-[-4px] top-1/2 transform -translate-y-1/2"
          }[position]
        )}></div>
      </motion.div>
    </div>
  );
});
AnimatedTooltip.displayName = "AnimatedTooltip";

export { AnimatedTooltip };
