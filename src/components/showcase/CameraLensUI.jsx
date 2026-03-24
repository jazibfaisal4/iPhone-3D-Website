import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePhoneStore, { CAMERA_PRESETS } from '../../store/usePhoneStore';

gsap.registerPlugin(ScrollTrigger);

/**
 * CameraLensUI — Scroll-triggered section that:
 * 1. Rotates the 3D model to show the back (camera module)
 * 2. "Explodes" the lens layers apart
 * 3. Fades in annotation labels via Zustand state
 */
const CameraLensUI = () => {
  const sectionRef = useRef();
  const setActiveSection = usePhoneStore((s) => s.setActiveSection);
  const setModelRotationY = usePhoneStore((s) => s.setModelRotationY);
  const setLensExplodeProgress = usePhoneStore((s) => s.setLensExplodeProgress);
  const setCameraPosition = usePhoneStore((s) => s.setCameraPosition);
  const setCameraTarget = usePhoneStore((s) => s.setCameraTarget);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctxList = [];

    const create = ({ start, end }) => {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start,
          end,
          scrub: 1,
          onEnter: () => {
            setActiveSection('lens');
            setCameraPosition(CAMERA_PRESETS.lens.position);
            setCameraTarget(CAMERA_PRESETS.lens.target);
          },
          onLeaveBack: () => {
            setActiveSection(null);
            setCameraPosition(CAMERA_PRESETS.default.position);
            setCameraTarget(CAMERA_PRESETS.default.target);
          },
          onUpdate: (self) => {
            const progress = self.progress;
            // First half: rotate to back
            const rotationProgress = Math.min(progress * 2, 1);
            setModelRotationY(Math.PI * rotationProgress);
            // Second half: explode lenses
            const explodeProgress = Math.max((progress - 0.4) / 0.6, 0);
            setLensExplodeProgress(explodeProgress);
          },
          onLeave: () => {
            setModelRotationY(Math.PI);
            setLensExplodeProgress(1);
          },
        });
      }, sectionRef);

      ctxList.push(ctx);
    };

    mm.add('(max-width: 760px)', () => {
      create({ start: 'top 88%', end: 'bottom 12%' });
    });

    mm.add('(min-width: 761px)', () => {
      create({ start: 'top 80%', end: 'bottom 20%' });
    });

    return () => {
      ctxList.forEach((ctx) => ctx.revert());
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex items-center px-5 md:px-10 py-8 pointer-events-auto"
      id="camera-lens-section"
    >
      <div className="max-w-[420px] p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] mx-auto md:mx-0 md:ml-auto md:mr-[5%]">
        <div className="inline-block text-[12px] font-semibold tracking-[0.08em] uppercase text-gray px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
          Pro Camera System
        </div>
        <h2 className="text-gray-100 md:text-[52px] text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] mb-4">
          A camera that captures
          <br />
          <span className="text-gradient">your vision.</span>
        </h2>
        <p className="text-gray max-w-md text-base md:text-lg leading-relaxed mb-6">
          iPhone 15 Pro Max features a 48MP Main camera with a quad-pixel sensor,
          a 12MP Ultra Wide camera, and a 12MP Telephoto camera with 5× optical zoom —
          the longest on any iPhone.
        </p>
        {/* Bento-style grid: single column on small screens */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-[16px] bg-white/4 border border-white/10 text-center py-6">
            <span className="block text-gray-100 text-3xl font-semibold mb-1">48MP</span>
            <span className="block text-gray text-[11px] font-medium uppercase tracking-[0.05em]">
              Main Camera
            </span>
          </div>
          <div className="rounded-[16px] bg-white/4 border border-white/10 text-center py-6">
            <span className="block text-gray-100 text-3xl font-semibold mb-1">5×</span>
            <span className="block text-gray text-[11px] font-medium uppercase tracking-[0.05em]">
              Optical Zoom
            </span>
          </div>
          <div className="rounded-[16px] bg-white/4 border border-white/10 text-center py-6">
            <span className="block text-gray-100 text-3xl font-semibold mb-1">120°</span>
            <span className="block text-gray text-[11px] font-medium uppercase tracking-[0.05em]">
              Ultra Wide
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraLensUI;
