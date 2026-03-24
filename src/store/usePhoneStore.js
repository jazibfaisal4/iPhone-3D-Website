import { create } from 'zustand';

/**
 * Zustand store for syncing 3D scene state with HTML UI.
 * Manages which interactive section is active, material properties,
 * and camera targets for all three premium modules.
 */

/** Camera presets for each interactive section */
const CAMERA_PRESETS = {
  default: { position: [0, 0, 4], target: [0, 0, 0] },
  lens: { position: [0, 0.3, -3.5], target: [0, 0.3, 0] },
  actionButton: { position: [-3.5, 0.2, 0.5], target: [0, 0.2, 0] },
  titanium: { position: [2, 0, 3], target: [0, 0, 0] },
};

/** Titanium material variants with color + roughness for GSAP lerp */
const TITANIUM_VARIANTS = {
  natural: {
    id: 'natural',
    label: 'Natural Titanium',
    color: { r: 0.56, g: 0.54, b: 0.51 },  // #8F8A81
    roughness: 0.45,
    accent: '#8F8A81',
  },
  blue: {
    id: 'blue',
    label: 'Blue Titanium',
    color: { r: 0.33, g: 0.35, b: 0.43 },  // #53596E
    roughness: 0.35,
    accent: '#53596E',
  },
  white: {
    id: 'white',
    label: 'White Titanium',
    color: { r: 0.79, g: 0.78, b: 0.76 },  // #C9C8C2
    roughness: 0.5,
    accent: '#C9C8C2',
  },
  black: {
    id: 'black',
    label: 'Black Titanium',
    color: { r: 0.27, g: 0.28, b: 0.29 },  // #454749
    roughness: 0.3,
    accent: '#454749',
  },
};

const usePhoneStore = create((set, get) => ({
  // --- Active section ---
  activeSection: null, // 'lens' | 'action' | 'titanium' | null
  setActiveSection: (section) => set({ activeSection: section }),

  // --- Camera ---
  cameraPresets: CAMERA_PRESETS,
  cameraPosition: CAMERA_PRESETS.default.position,
  cameraTarget: CAMERA_PRESETS.default.target,
  setCameraPosition: (position) => set({ cameraPosition: position }),
  setCameraTarget: (target) => set({ cameraTarget: target }),

  // --- Lens explode ---
  lensExplodeProgress: 0, // 0 = closed, 1 = fully exploded
  setLensExplodeProgress: (progress) => set({ lensExplodeProgress: progress }),

  // --- Model rotation ---
  modelRotationY: 0,
  setModelRotationY: (y) => set({ modelRotationY: y }),

  // --- Titanium material ---
  titaniumVariants: TITANIUM_VARIANTS,
  activeTitanium: TITANIUM_VARIANTS.natural,
  setActiveTitanium: (variant) => set({ activeTitanium: variant }),

  // --- Material lerp proxy (for GSAP to animate) ---
  materialProxy: { r: 0.56, g: 0.54, b: 0.51, roughness: 0.45 },
  setMaterialProxy: (proxy) => set({ materialProxy: proxy }),

  // --- Action button zoom ---
  actionButtonActive: false,
  setActionButtonActive: (active) => set({ actionButtonActive: active }),

  // --- Reset ---
  resetToDefault: () => set({
    activeSection: null,
    cameraPosition: CAMERA_PRESETS.default.position,
    cameraTarget: CAMERA_PRESETS.default.target,
    lensExplodeProgress: 0,
    modelRotationY: 0,
    actionButtonActive: false,
  }),
}));

export { CAMERA_PRESETS, TITANIUM_VARIANTS };
export default usePhoneStore;
