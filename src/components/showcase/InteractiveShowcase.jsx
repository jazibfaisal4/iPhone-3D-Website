import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ShowcaseScene from './ShowcaseScene';
import UIOverlay from './UIOverlay';
import usePhoneStore from '../../store/usePhoneStore';

/**
 * InteractiveShowcase — Parent wrapper with:
 * - A sticky Canvas for the 3D model (with AdaptiveDpr for performance)
 * - UIOverlay for HTML-based controls
 * - Three scroll sections that trigger different 3D interactions
 * - Canvas touch-action: pan-y so scrolling works on mobile
 *
 * Lives between <Model /> and <Features /> in App.jsx.
 */
const InteractiveShowcase = () => {
  const sectionRef = useRef();
  const resetToDefault = usePhoneStore((s) => s.resetToDefault);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(max-width: 760px)', () => {
      gsap.to('#showcase-heading', {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: '#showcase-heading',
          start: 'top 92%',
        },
      });
    });

    mm.add('(min-width: 761px)', () => {
      gsap.to('#showcase-heading', {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: '#showcase-heading',
          start: 'top 85%',
        },
      });
    });

    return () => mm.revert();
  }, []);

  // Cleanup: reset store state when component unmounts (navigating away)
  useEffect(() => {
    return () => resetToDefault();
  }, [resetToDefault]);

  return (
    <section ref={sectionRef} className="showcase-wrapper" id="interactive-showcase">
      {/* Section Header */}
      <div className="screen-max-width px-5 sm:px-10">
        <h1 id="showcase-heading" className="section-heading">
          Explore the Pro in detail.
        </h1>
      </div>

      {/* Sticky 3D Canvas */}
      <div className="showcase-canvas-container">
        <div className="showcase-canvas-sticky">
          <Canvas
            className="showcase-canvas"
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
            style={{ touchAction: 'pan-y' }}
          >
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
            <ShowcaseScene />
          </Canvas>
        </div>
      </div>

      {/* HTML Overlay with scroll-driven sections */}
      <UIOverlay />
    </section>
  );
};

export default InteractiveShowcase;
