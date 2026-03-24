import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook that refreshes all GSAP ScrollTrigger instances on:
 * - Orientation change (phone rotation)
 * - Window resize (debounced)
 *
 * This ensures all scroll-driven animation markers and progress
 * are recalculated without breaking the scroll position.
 */
const useScrollTriggerRefresh = () => {
  useEffect(() => {
    let resizeTimeout;

    const handleOrientationChange = () => {
      // Wait for viewport to settle after orientation change
      setTimeout(() => {
        ScrollTrigger.refresh(true); // `true` = force recalculation
      }, 200);
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
};

export default useScrollTriggerRefresh;
