import usePhoneStore from '../../store/usePhoneStore';
import CameraLensUI from './CameraLensUI';
import ActionButtonUI from './ActionButtonUI';
import TitaniumToggleUI from './TitaniumToggleUI';

/**
 * UIOverlay — HTML layer positioned over the 3D Canvas.
 * Reads activeSection from Zustand to orchestrate section transitions.
 * All 3D logic stays in ShowcaseScene; this is purely presentational HTML.
 */
const UIOverlay = () => {
  const activeSection = usePhoneStore((s) => s.activeSection);

  return (
    <div className="pointer-events-none relative z-10 -mt-[300vh]">
      {/* Section scroll triggers — each controls the 3D scene via Zustand */}
      <CameraLensUI />
      <ActionButtonUI />
      <TitaniumToggleUI />

      {/* Persistent section indicator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-[50] pointer-events-auto">
        {['lens', 'action', 'titanium'].map((section) => (
          <div
            key={section}
            className={[
              'w-2 h-2 rounded-full bg-white/20 transition-all duration-400',
              activeSection === section
                ? 'bg-blue shadow-[0_0_12px_rgba(41,151,255,0.5)] scale-125'
                : '',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
};

export default UIOverlay;
