"use client"

import { cn } from "../../lib/utils"
import * as React from "react"
import { motion, AnimatePresence } from 'framer-motion'

const AnimatedPopover = React.forwardRef(({ 
 children, 
  content, 
  isOpen, 
  onClose, 
  position = "bottom", 
  className, 
  ...props 
}, ref) => {
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
  }[position];

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose && onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, ref]);

  return (
    <div className="relative inline-block" ref={ref}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "absolute z-50 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 border border-gray-200 dark:border-gray-700",
              positionClasses,
              className
            )}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            {...props}
          >
            {content}
            <div className={cn(
              "absolute w-2 h-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rotate-45",
              {
                top: "bottom-[-4px] left-1/2 transform -translate-x-1/2",
                bottom: "top-[-4px] left-1/2 transform -translate-x-1/2",
                left: "right-[-4px] top-1/2 transform -translate-y-1/2",
                right: "left-[-4px] top-1/2 transform -translate-y-1/2"
              }[position]
            )}></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
AnimatedPopover.displayName = "AnimatedPopover";

export { AnimatedPopover };
