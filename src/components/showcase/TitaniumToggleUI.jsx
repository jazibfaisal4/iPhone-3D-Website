import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePhoneStore, { TITANIUM_VARIANTS, CAMERA_PRESETS } from '../../store/usePhoneStore';

gsap.registerPlugin(ScrollTrigger);

/**
 * TitaniumToggleUI — Professional color picker that uses GSAP to
 * lerp meshStandardMaterial.color + roughness for cinematic material transitions.
 * No texture swapping — purely shader property animation.
 */
const TitaniumToggleUI = () => {
  const sectionRef = useRef();
  const proxyRef = useRef(null);
  const activeTitanium = usePhoneStore((s) => s.activeTitanium);
  const setActiveTitanium = usePhoneStore((s) => s.setActiveTitanium);
  const setActiveSection = usePhoneStore((s) => s.setActiveSection);
  const setCameraPosition = usePhoneStore((s) => s.setCameraPosition);
  const setCameraTarget = usePhoneStore((s) => s.setCameraTarget);
  const setModelRotationY = usePhoneStore((s) => s.setModelRotationY);
  const setMaterialProxy = usePhoneStore((s) => s.setMaterialProxy);
  const materialProxy = usePhoneStore((s) => s.materialProxy);

  // Initialize proxy ref with current material values
  useEffect(() => {
    proxyRef.current = { ...materialProxy };
  }, []);

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
            setActiveSection('titanium');
            setModelRotationY(Math.PI / 6);
            setCameraPosition(CAMERA_PRESETS.titanium.position);
            setCameraTarget(CAMERA_PRESETS.titanium.target);
          },
          onLeaveBack: () => {
            setActiveSection('action');
            setCameraPosition(CAMERA_PRESETS.actionButton.position);
            setCameraTarget(CAMERA_PRESETS.actionButton.target);
            setModelRotationY(-Math.PI / 2.5);
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

  /**
   * Cinematic material transition — GSAP lerps color channels
   * and roughness on a proxy object, then pushes to Zustand each frame.
   */
  const handleSelectVariant = useCallback((variant) => {
    setActiveTitanium(variant);

    if (!proxyRef.current) {
      proxyRef.current = { ...materialProxy };
    }

    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches;

    gsap.to(proxyRef.current, {
      r: variant.color.r,
      g: variant.color.g,
      b: variant.color.b,
      roughness: variant.roughness,
      duration: isMobile ? 1.0 : 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        setMaterialProxy({ ...proxyRef.current });
      },
    });
  }, [materialProxy, setActiveTitanium, setMaterialProxy]);

  const variants = Object.values(TITANIUM_VARIANTS);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex items-center px-5 md:px-10 py-8 pointer-events-auto"
      id="titanium-section"
    >
      <div className="max-w-[420px] p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] mx-auto md:mx-0 md:ml-auto md:mr-[5%]">
        <div className="inline-block text-[12px] font-semibold tracking-[0.08em] uppercase text-gray px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
          Titanium Design
        </div>
        <h2 className="text-gray-100 md:text-[52px] text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] mb-4">
          Four stunning
          <br />
          <span className="text-gradient">finishes.</span>
        </h2>
        <p className="text-gray max-w-md text-base md:text-lg leading-relaxed mb-6">
          iPhone 15 Pro features a strong and light aerospace-grade titanium design
          with a textured matte glass back. Choose from four beautiful colors.
        </p>

        {/* Professional Color Picker */}
        <div className="titanium-picker">
          {variants.map((variant) => (
            <button
              key={variant.id}
              className={`titanium-swatch ${activeTitanium.id === variant.id ? 'titanium-swatch-active' : ''}`}
              onClick={() => handleSelectVariant(variant)}
              aria-label={variant.label}
            >
              <div
                className="titanium-swatch-color"
                style={{ backgroundColor: variant.accent }}
              />
              <span className="titanium-swatch-label">{variant.label}</span>
              {activeTitanium.id === variant.id && (
                <div className="titanium-swatch-indicator" />
              )}
            </button>
          ))}
        </div>

        {/* Material Properties Display */}
        <div className="titanium-properties">
          <div className="titanium-property">
            <span className="titanium-property-label">Roughness</span>
            <div className="titanium-property-bar">
              <div
                className="titanium-property-fill"
                style={{ width: `${activeTitanium.roughness * 100}%` }}
              />
            </div>
            <span className="titanium-property-value">{activeTitanium.roughness.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitaniumToggleUI;
