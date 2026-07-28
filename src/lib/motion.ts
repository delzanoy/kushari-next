import { Variants, Transition } from "framer-motion";

/**
 * ============================================================
 * LAYER 3 — MOTION SYSTEM
 * Token v2 — Transition & Variant Presets
 * ============================================================
 */

// --- 3a. Transition Presets ---

export const transitions = {
  fast: {
    duration: 0.15,
    ease: [0, 0, 0.2, 1], // ease-decelerate
  } as Transition,
  
  standard: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1], // ease-standard
  } as Transition,
  
  smooth: {
    duration: 0.3,
    ease: [0, 0, 0.2, 1], // ease-decelerate
  } as Transition,
  
  gentle: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1],
  } as Transition,
  
  slow: {
    duration: 0.8,
    ease: [0.4, 0, 0.2, 1],
  } as Transition,

  spring: {
    type: "spring",
    stiffness: 500,
    damping: 30,
    mass: 0.7,
  } as Transition,

  springBouncy: {
    type: "spring",
    stiffness: 400,
    damping: 15,
    mass: 1,
  } as Transition,

  springStiff: {
    type: "spring",
    stiffness: 700,
    damping: 40,
    mass: 0.5,
  } as Transition,

  springHeavy: {
    type: "spring",
    stiffness: 450,
    damping: 32,
    mass: 1,
  } as Transition,

  page: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1],
  } as Transition,
};

// --- 3b. Variant Presets ---

export const variants: Record<string, Variants> = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  fadeInFast: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: transitions.fast,
    },
    exit: { opacity: 0 },
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },

  slideUpSm: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 4 },
  },

  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },

  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  },

  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  },

  scaleInFast: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: transitions.fast,
    },
    exit: { opacity: 0, scale: 0.99 },
  },

  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },

  staggerFast: {
    animate: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  },

  pageTransition: {
    initial: { opacity: 0, x: -8 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: transitions.page,
    },
    exit: { opacity: 0, x: 8 },
  },

  blur: {
    initial: { filter: "blur(1.5px)" },
    animate: { filter: "blur(0px)" },
  },
};

// --- 3c. Micro-interaction Helpers ---

export const interactions = {
  hover: {
    lift: { y: -2, scale: 1.01 },
    scale: { scale: 1.03 },
    glow: { scale: 1.01 },
    iconSlide: { x: 3 },
    brighten: { opacity: 0.8 },
  },
  
  tap: {
    press: { scale: 0.96 },
    pressLight: { scale: 0.98 },
    pressStrong: { scale: 0.92 },
  },
};

// --- 3d. Composed Motion Props ---

export const motionProps = {
  fadeIn: {
    variants: variants.fadeIn,
    initial: "initial",
    animate: "animate",
    exit: "exit",
    transition: transitions.standard,
  },
  
  slideUp: {
    variants: variants.slideUp,
    initial: "initial",
    animate: "animate",
    exit: "exit",
    transition: transitions.smooth,
  },
  
  slideUpSm: {
    variants: variants.slideUpSm,
    initial: "initial",
    animate: "animate",
    exit: "exit",
    transition: transitions.standard,
  },
  
  stagger: {
    variants: variants.stagger,
    initial: "initial",
    animate: "animate",
  },
};

// --- Exports for Atom System ---
export const transition = transitions;
export const transitions_ref = transitions; // Alias for internal use if needed
export const fadeIn = variants.fadeIn;
export const slideUp = variants.slideUp;
export const scaleIn = variants.scaleIn;
