// Animation utilities for the Torba application
import { motion } from 'framer-motion';

// Create stagger animation variants
export const createStaggerAnimation = (delay = 0.05, duration = 0.5) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: delay,
      duration: duration
    }
  }
});

// Create slide in animation variants
export const createSlideInAnimation = (direction = "up", duration = 0.5) => {
  const position = {
    "up": { y: 20 },
    "down": { y: -20 },
    "left": { x: 20 },
    "right": { x: -20 }
  }[direction] || { y: 20 };

  return {
    hidden: { opacity: 0, ...position },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { duration }
    }
  };
};

// Create fade in animation variants
export const createFadeInAnimation = (duration = 0.5) => ({
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration }
  }
});

// Create scale animation variants
export const createScaleAnimation = (scale = 1.05, duration = 0.2) => ({
  rest: { scale: 1 },
  hover: { scale: scale },
  tap: { scale: 0.95 }
});

// Default entrance animation
export const entranceAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Stagger children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Button press animation
export const buttonPress = {
  rest: { scale: 1 },
  hover: { scale: 1.03 },
  tap: { scale: 0.98 }
};

// Card hover animation
export const cardHover = {
  rest: { 
    y: 0,
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"
  },
  hover: { 
    y: -5,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 }
  }
};

// Loading animation
export const loadingAnimation = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.3,
      staggerChildren: 0.1
    }
 }
};

// Success animation
export const successAnimation = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }
  }
};

// Error animation
export const errorAnimation = {
  hidden: { x: -10, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }
  },
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};

// Motion wrapper components
export const MotionDiv = motion.div;
export const MotionButton = motion.button;
export const MotionCard = motion.div;
export const MotionInput = motion.input;
export const MotionTextarea = motion.textarea;
