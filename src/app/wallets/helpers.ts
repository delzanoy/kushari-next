/**
 * Wallet Transition Helper
 * Manages smooth transitions between wallet cards and wallet details pages
 */

// Check if View Transitions API is supported
export const supportsViewTransitions = () => {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
};

/**
 * Navigate with view transition
 * Wraps router.push with view transition if supported
 */
export const navigateWithTransition = async (
  router: any,
  url: string,
  callback?: () => void
) => {
  if (!supportsViewTransitions()) {
    // Fallback to normal navigation
    router.push(url);
    callback?.();
    return;
  }

  // Use View Transitions API
  const transition = (document as any).startViewTransition(() => {
    router.push(url);
    callback?.();
  });

  try {
    await transition.finished;
  } catch (error) {
    // Transition was skipped or interrupted
    console.log('Transition interrupted:', error);
  }
};

/**
 * Get view transition name for wallet element
 * Creates unique identifiers for shared elements
 */
export const getWalletTransitionName = (walletId: number, element: string) => {
  return `wallet-${walletId}-${element}`;
};

/**
 * Animation durations and easings
 * Customize these to match your design system
 */
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