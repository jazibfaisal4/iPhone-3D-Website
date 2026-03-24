import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Responsive 3D camera/scene configuration.
 *
 * This is intentionally driven primarily by `window.innerWidth` (per requirement),
 * with a small portrait/ultra-wide modifier to keep framing stable.
 *
 * @returns {{ fov, cameraZ, modelScale, isMobile, isTablet, isUltraWide, isPortrait, screenType }}
 */
const useResponsive = () => {
  const getConfig = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;

    const isPortrait = h >= w;
    const isUltraWide = aspect >= 2.2 || w >= 1800;

    // Width-first breakpoints; these map cleanly across Ultra-wide / laptops / tablets / phones.
    if (w <= 480) {
      return {
        fov: isPortrait ? 66 : 58,
        cameraZ: isPortrait ? 5.1 : 4.6,
        modelScale: 12,
        screenType: isPortrait ? 'mobile-portrait' : 'mobile-landscape',
        isMobile: true,
        isTablet: false,
        isUltraWide: false,
        isPortrait,
      };
    }

    if (w <= 760) {
      return {
        fov: isPortrait ? 61 : 54,
        cameraZ: isPortrait ? 4.9 : 4.5,
        modelScale: 13,
        screenType: 'mobile',
        isMobile: true,
        isTablet: false,
        isUltraWide: false,
        isPortrait,
      };
    }

    if (w <= 1024) {
      return {
        fov: isUltraWide ? 42 : 50,
        cameraZ: isUltraWide ? 4.75 : 4.25,
        modelScale: 14,
        screenType: 'tablet',
        isMobile: false,
        isTablet: true,
        isUltraWide: isUltraWide,
        isPortrait,
      };
    }

    // Desktop / ultra-wide
    return {
      fov: isUltraWide ? 40 : 45,
      cameraZ: isUltraWide ? 4.75 : 4.15,
      modelScale: 15,
      screenType: isUltraWide ? 'ultra-wide' : 'desktop',
      isMobile: false,
      isTablet: false,
      isUltraWide: isUltraWide,
      isPortrait,
    };
  }, []);

  const [config, setConfig] = useState(getConfig);

  useEffect(() => {
    const handleResize = () => setConfig(getConfig());
    const handleOrientationChange = () => {
      // Delay to allow viewport to settle after orientation change
      setTimeout(() => setConfig(getConfig()), 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [getConfig]);

  return config;
};

export default useResponsive;
