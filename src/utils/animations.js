import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

/**
 * Animate an element into view using GSAP + ScrollTrigger.
 * Returns the tween so callers can kill it during cleanup if needed.
 *
 * @param {string} target - CSS selector for the target element
 * @param {object} animationProps - GSAP animation properties
 * @param {object} [scrollProps] - Optional ScrollTrigger overrides
 * @returns {gsap.core.Tween}
 */
export const animateWithGsap = (target, animationProps, scrollProps) => {
  return gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: 'restart reverse restart reverse',
      start: 'top 85%',
      ...scrollProps,
    }
  });
};

/**
 * Animate a model size switch using a GSAP timeline.
 * Rotates the 3D group and slides two view containers simultaneously.
 * Returns the timeline for potential cleanup.
 *
 * @param {gsap.core.Timeline} timeline
 * @param {React.RefObject} rotationRef - Ref to the THREE.Group
 * @param {number} rotationState - Target Y rotation
 * @param {string} firstTarget - CSS selector for source view
 * @param {string} secondTarget - CSS selector for destination view
 * @param {object} animationProps - GSAP animation properties (transform, duration, etc.)
 * @returns {gsap.core.Timeline}
 */
export const animateWithGsapTimeline = (timeline, rotationRef, rotationState, firstTarget, secondTarget, animationProps) => {
  timeline.to(rotationRef.current.rotation, {
    y: rotationState,
    duration: 1,
    ease: 'power2.inOut'
  });

  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: 'power2.inOut'
    },
    '<'
  );

  timeline.to(
    secondTarget,
    {
      ...animationProps,
      ease: 'power2.inOut'
    },
    '<'
  );

  return timeline;
};