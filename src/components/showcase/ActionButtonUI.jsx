import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePhoneStore, { CAMERA_PRESETS } from '../../store/usePhoneStore';

gsap.registerPlugin(ScrollTrigger);

/**
 * ActionButtonUI — Reusable scroll/click interaction that zooms
 * the Three.js camera onto the Action Button (left side of phone).
 * Uses gsap.to() for smooth camera.position + orbitControls.target animation.
 */
const ActionButtonUI = () => {
  const sectionRef = useRef();
  const contentRef = useRef();
  const setActiveSection = usePhoneStore((s) => s.setActiveSection);
  const setCameraPosition = usePhoneStore((s) => s.setCameraPosition);
  const setCameraTarget = usePhoneStore((s) => s.setCameraTarget);
  const setModelRotationY = usePhoneStore((s) => s.setModelRotationY);
  const setActionButtonActive = usePhoneStore((s) => s.setActionButtonActive);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctxList = [];

    const create = ({ start, end }) => {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start,
          end,
          onEnter: () => {
            setActiveSection('action');
            setActionButtonActive(true);
            // Rotate model to show the left side (where the action button is)
            setModelRotationY(-Math.PI / 2.5);
            setCameraPosition(CAMERA_PRESETS.actionButton.position);
            setCameraTarget(CAMERA_PRESETS.actionButton.target);

            // Animate in the content panel
            gsap.fromTo(
              contentRef.current,
              { opacity: 0, x: 60 },
              { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out', delay: 0.35 }
            );
          },
          onLeaveBack: () => {
            setActiveSection('lens');
            setActionButtonActive(false);
            setModelRotationY(Math.PI);
            setCameraPosition(CAMERA_PRESETS.lens.position);
            setCameraTarget(CAMERA_PRESETS.lens.target);
          },
          onLeave: () => {
            setActiveSection(null);
            setActionButtonActive(false);
          },
        });
      }, sectionRef);

      ctxList.push(ctx);
    };

    mm.add('(max-width: 760px)', () => {
      create({ start: 'top 68%', end: 'bottom 22%' });
    });

    mm.add('(min-width: 761px)', () => {
      create({ start: 'top 60%', end: 'bottom 30%' });
    });

    return () => {
      ctxList.forEach((ctx) => ctx.revert());
      mm.revert();
    };
  }, []);

  /** Click handler for the "Explore" button — smoothly zooms camera */
  const handleZoomToButton = () => {
    setCameraPosition([-2.5, 0.15, 0.3]);
    setCameraTarget([-0.1, 0.15, 0]);
  };

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex items-center px-5 md:px-10 py-8 pointer-events-auto"
      id="action-button-section"
    >
      <div
        ref={contentRef}
        className="max-w-[420px] p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] mx-auto md:mx-0 md:ml-[5%] md:mr-auto"
        style={{ opacity: 0 }}
      >
        <div className="inline-block text-[12px] font-semibold tracking-[0.08em] uppercase text-gray px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
          All-New
        </div>
        <h2 className="text-gray-100 md:text-[52px] text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] mb-4">
          Action button.
          <br />
          <span className="text-gradient">Your call.</span>
        </h2>
        <p className="text-gray max-w-md text-base md:text-lg leading-relaxed">
          The new Action button is a fast track to your favorite feature.
          Set it to toggle Silent mode, launch Camera, start a Voice Memo,
          turn on the Flashlight, and more.
        </p>
        <div className="mt-6 mb-4">
          <button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue text-white font-semibold text-sm hover:bg-[#1d72c4] transition"
            onClick={handleZoomToButton}
          >
            <span>Zoom In</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        {/* Bento-style grid: single column on small screens */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {['Silent Mode', 'Camera', 'Flashlight', 'Voice Memo', 'Focus', 'Translate'].map((action) => (
            <div
              key={action}
              className="text-center px-3 py-2 rounded-3xl text-[12px] font-medium text-gray bg-white/5 border border-white/10 transition-colors hover:text-white hover:border-blue/30 hover:bg-blue/10"
            >
              {action}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActionButtonUI;
