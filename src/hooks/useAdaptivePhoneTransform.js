import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const clamp01 = (t) => Math.max(0, Math.min(1, t));
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Adaptive model scaling + centering.
 *
 * Goal:
 * - fit the model vertically within the current r3f viewport (no portrait clipping)
 * - keep it horizontally centered on desktop
 * - still feel consistent across ultra-wide / laptop / tablet / mobile
 */
export default function useAdaptivePhoneTransform(groupRef, options = {}) {
  const {
    // extra multiplier for "smaller/larger" view variants (kept conservative to avoid clipping)
    variantScale = 1,
    // how much of the vertical viewport the phone should occupy
    fitPortrait = 0.86,
    fitLandscape = 0.9,
    // small lift so the phone reads well under fixed headers
    portraitYOffset = 0,
  } = options;

  const { viewport } = useThree();
  const measuredRef = useRef(false);

  // Measured in the groupRef's local/object transform space at measurement time (usually scale=1).
  const [measure, setMeasure] = useState(() => ({
    height: null,
    width: null,
    center: new THREE.Vector3(0, 0, 0),
  }));

  const [screenWidth, setScreenWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const portrait = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerHeight >= window.innerWidth;
  }, [screenWidth]);

  // Measure the model once the group exists (after GLTF resolves).
  useFrame(() => {
    if (measuredRef.current) return;
    if (!groupRef?.current) return;

    // Bounding box in world space, but groupRef is positioned at the origin at start,
    // so this still yields a stable "local center" for centering.
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    if (size.y && Number.isFinite(size.y) && size.y > 0) {
      measuredRef.current = true;
      setMeasure({
        height: size.y,
        width: size.x,
        center,
      });
    }
  });

  const widthT = clamp01((screenWidth - 360) / (1600 - 360));

  // Fit factor changes slightly with width so the phone doesn't feel oversized
  // on mid-size laptops vs. ultra-wide monitors.
  const fitFactor = portrait
    ? lerp(fitPortrait * 0.98, fitPortrait, widthT)
    : lerp(fitLandscape * 0.98, fitLandscape, widthT);

  const desiredHeight = viewport.height * fitFactor;

  if (!measure.height) {
    // While measuring: keep a sane default so we don't pop.
    return { scale: 1, position: [0, 0, 0] };
  }

  const scaleFactor = (desiredHeight / measure.height) * variantScale;

  // Reposition so the model's bounding-box center sits at the world origin.
  const posX = -measure.center.x * scaleFactor;
  const posY = -measure.center.y * scaleFactor + (portrait ? portraitYOffset : 0);

  return {
    scale: scaleFactor,
    position: [posX, posY, 0],
  };
}

