# Torba Text Storage - Enhanced with Animations

This project demonstrates a modern UI with smooth animations and transitions using Framer Motion and shadcn-inspired components.

## Features Added

### 1. Animation Components
- **Animated Button**: Hover and tap animations
- **Animated Card**: Hover lift effect with shadow transition
- **Animated Textarea**: Focus animation with subtle scaling
- **Animated Skeleton**: Enhanced loading state animations
- **FadeIn Component**: Fade-in animations with customizable delays
- **SlideIn Component**: Directional slide-in animations
- **Animated Badge**: Scale animations on hover
- **Animated Tooltip**: Hover-triggered tooltips with animations
- **Animated Popover**: Animated dropdown/popover component
- **Fireworks**: Spectacular fireworks animation for successful actions
- **Dissolve Animation**: Smooth dissolve animation when items are deleted

### 2. Animation Utilities
- Stagger animations for lists
- Entrance animations for components
- Success and error animations
- Loading animations

### 3. CSS Animation Utilities
- Custom keyframe animations (fadeIn, slideUp, scaleIn)
- Hover effects (hover-lift)
- Focus animations (focus-pulse)
- Reduced motion support for accessibility

### 4. Page-Level Animations
- Staggered loading of text entries
- Animated form submission
- Smooth success/error message transitions
- Layout animations when items are added/removed

## Implementation Details

### Framer Motion Integration
- Used `motion` components for interactive animations
- Applied `AnimatePresence` for exit animations
- Implemented `layout` prop for smooth layout transitions

### Accessibility Considerations
- Added `prefers-reduced-motion` media query to disable animations for users who prefer reduced motion
- Maintained keyboard navigation and focus states
- Ensured animations don't trigger seizures or discomfort

### Performance Optimizations
- Used hardware-accelerated properties (transform, opacity) for animations
- Implemented proper exit animations to prevent visual glitches
- Optimized component re-renders with proper keys

## Usage

The enhanced UI components can be used by importing from the components/ui directory:

```jsx
import { AnimatedButton, AnimatedCard, FadeIn, SlideIn } from '../components/ui';
```

Animations are implemented using Framer Motion's API with sensible defaults while allowing customization for specific use cases.

## Design Principles

This implementation follows shadcn UI principles with added animation enhancements:
- Subtle, purposeful animations that enhance user experience
- Consistent animation language throughout the application
- Performance-focused animations that don't impact usability
- Accessibility-first approach with reduced motion support
