// /**
//  * Wallet Transition Helper
//  * Manages smooth transitions between wallet cards and wallet details pages
//  */

// // Check if View Transitions API is supported
// export const supportsViewTransitions = () => {
//   return typeof document !== 'undefined' && 'startViewTransition' in document;
// };

// /**
//  * Navigate with view transition
//  * Wraps router.push with view transition if supported
//  */
// export const navigateWithTransition = async (
//   router: any,
//   url: string,
//   callback?: () => void
// ) => {
//   if (!supportsViewTransitions()) {
//     // Fallback to normal navigation
//     router.push(url);
//     callback?.();
//     return;
//   }

//   // Use View Transitions API
//   const transition = (document as any).startViewTransition(() => {
//     router.push(url);
//     callback?.();
//   });

//   try {
//     await transition.finished;
//   } catch (error) {
//     // Transition was skipped or interrupted
//     console.log('Transition interrupted:', error);
//   }
// };

// /**
//  * Get view transition name for wallet element
//  * Creates unique identifiers for shared elements
//  */
// export const getWalletTransitionName = (walletId: number, element: string) => {
//   return `wallet-${walletId}-${element}`;
// };

// /**
//  * Animation durations and easings
//  * Customize these to match your design system
//  */
// export const TRANSITION_CONFIG = {
//   duration: {
//     fast: 200,
//     normal: 300,
//     slow: 400,
//   },
//   easing: {
//     smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
//     bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
//   },
// };


// /**
//  * Wallet Transition Helper (Debug Version)
//  * Manages smooth transitions between wallet cards and wallet details pages
//  * WITH DEBUGGING ENABLED
//  */

// // Check if View Transitions API is supported
// export const supportsViewTransitions = () => {
//   const supported = typeof document !== 'undefined' && 'startViewTransition' in document;
//   console.log('[View Transitions] Browser support:', supported);
//   return supported;
// };

// /**
//  * Navigate with view transition
//  * Wraps router.push with view transition if supported
//  */
// export const navigateWithTransition = async (
//   router: any,
//   url: string,
//   callback?: () => void
// ) => {
//   console.log('[View Transitions] navigateWithTransition called');
//   console.log('[View Transitions] Target URL:', url);
//   console.log('[View Transitions] Browser support:', supportsViewTransitions());

//   if (!supportsViewTransitions()) {
//     console.log('[View Transitions] Fallback to normal navigation');
//     router.push(url);
//     callback?.();
//     return;
//   }

//   try {
//     console.log('[View Transitions] Starting view transition...');
    
//     // Use View Transitions API
//     const transition = (document as any).startViewTransition(() => {
//       console.log('[View Transitions] Transition started, pushing route');
//       router.push(url);
//       callback?.();
//     });

//     console.log('[View Transitions] Waiting for transition to finish...');
//     await transition.finished;
//     console.log('[View Transitions] Transition completed successfully!');
//   } catch (error) {
//     // Transition was skipped or interrupted
//     console.warn('[View Transitions] Transition interrupted or failed:', error);
//   }
// };

// /**
//  * Get view transition name for wallet element
//  * Creates unique identifiers for shared elements
//  */
// export const getWalletTransitionName = (walletId: number, element: string) => {
//   const name = `wallet-${walletId}-${element}`;
//   console.log(`[View Transitions] Generated transition name: ${name}`);
//   return name;
// };

// /**
//  * Animation durations and easings
//  * Customize these to match your design system
//  */
// export const TRANSITION_CONFIG = {
//   duration: {
//     fast: 200,
//     normal: 300,
//     slow: 400,
//   },
//   easing: {
//     smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
//     bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
//   },
// };

// // Log when this module loads
// console.log('[View Transitions] Helper module loaded');
// console.log('[View Transitions] Browser support check:', supportsViewTransitions());




/**
 * Wallet Transition Helper (Production Version)
 */
export const supportsViewTransitions = () => {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
};

// export const navigateWithTransition = async (
//   router: any,
//   url: string,
//   callback?: () => void
// ) => {
//   if (!supportsViewTransitions()) {
//     router.push(url);
//     callback?.();
//     return;
//   }

//   try {
//     const transition = (document as any).startViewTransition(() => {
//       router.push(url);
//       callback?.();
//     });

//     await transition.finished;
//   } catch (error) {
//     // Transition was skipped or interrupted
//     console.error('Transition failed:', error);
//   }
// };

export const navigateWithTransition = async (
  router: any,
  url: string,
  options?: {
    callback?: () => void;
    fallbackTimeout?: number;
    onError?: (error: Error) => void;
  }
) => {
  const { callback, fallbackTimeout = 1000, onError } = options || {};

  if (!supportsViewTransitions()) {
    router.push(url);
    callback?.();
    return;
  }

  try {
    const transition = (document as any).startViewTransition(() => {
      router.push(url);
      callback?.();
    });

    // Add a timeout fallback in case the transition hangs
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Transition timeout')), fallbackTimeout);
    });

    await Promise.race([transition.finished, timeoutPromise]);
  } catch (error) {
    onError?.(error as Error);
    
    // Fallback to normal navigation
    router.push(url);
    callback?.();
  }
};

export const getWalletTransitionName = (walletId: number, element: string) => {
  return `wallet-${walletId}-${element}`;
};

export const TRANSITION_CONFIG = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 400,
  },
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};