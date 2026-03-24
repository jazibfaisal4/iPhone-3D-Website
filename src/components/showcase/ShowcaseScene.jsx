import * as THREE from 'three';
import { useRef, useEffect, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Lightformer } from '@react-three/drei';
import { useGLTF, useTexture, Html } from '@react-three/drei';
import gsap from 'gsap';
import usePhoneStore from '../../store/usePhoneStore';
import useResponsive from '../../hooks/useResponsive';
import Loader from '../Loader';
import useAdaptivePhoneTransform from '../../hooks/useAdaptivePhoneTransform';

// ─── Constants ────────────────────────────────────────────────────

const PROTECTED_MATERIALS = new Set([
  "zFdeDaGNRwzccye",
  "ujsvqBWRMnqdwPx",
  "hUlRcbieVuIiOXG",
  "jlzuBkUzuJqgiAK",
  "xNrofRCqOXXHVZt",
]);

/**
 * Lens annotation labels — positioned relative to the camera module.
 * Each label is offset along Z to simulate the "exploded" stack.
 */
const LENS_LABELS = [
  { text: '48MP Main', desc: 'ƒ/1.78 aperture', offset: 0.08 },
  { text: '12MP Ultra Wide', desc: 'ƒ/2.2 · 120°', offset: 0.16 },
  { text: '12MP Telephoto', desc: '5× optical zoom', offset: 0.24 },
];

// ─── ShowcasePhone (3D Model) ─────────────────────────────────────

function ShowcasePhone({ explodeProgress }) {
  const { nodes, materials } = useGLTF("/models/scene.glb");
  const groupRef = useRef();
  const materialProxy = usePhoneStore((s) => s.materialProxy);

  // Apply lerped material color + roughness from Zustand proxy
  useFrame(() => {
    Object.entries(materials).forEach(([name, mat]) => {
      if (!PROTECTED_MATERIALS.has(name)) {
        mat.color.setRGB(materialProxy.r, materialProxy.g, materialProxy.b);
        mat.roughness = materialProxy.roughness;
        mat.needsUpdate = true;
      }
    });
  });

  return (
    <group ref={groupRef} scale={[15, 15, 15]} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.ttmRoLdJipiIOmf.geometry} material={materials.hUlRcbieVuIiOXG} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.DjsDkGiopeiEJZK.geometry} material={materials.PaletteMaterial001} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.buRWvyqhBBgcJFo.geometry} material={materials.PaletteMaterial002} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.MrMmlCAsAxJpYqQ_0.geometry} material={materials.dxCVrUCvYhjVxqy} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.wqbHSzWaUxBCwxY_0.geometry} material={materials.MHFGNLrDQbTNima} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.QvGDcbDApaGssma.geometry} material={materials.kUhjpatHUvkBwfM} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.vFwJFNASGvEHWhs.geometry} material={materials.RJoymvEsaIItifI} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.evAxFwhaQUwXuua.geometry} material={materials.KSIxMqttXxxmOYl} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.USxQiqZgxHbRvqB.geometry} material={materials.mcPrzcBUcdqUybC} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.TvgBVmqNmSrFVfW.geometry} material={materials.pIhYLPqiSQOZTjn} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.GuYJryuYunhpphO.geometry} material={materials.eShKpuMNVJTRrgg} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.pvdHknDTGDzVpwc.geometry} material={materials.xdyiJLYTYRfJffH} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.CfghdUoyzvwzIum.geometry} material={materials.jpGaQNgTtEGkTfo} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.DjdhycfQYjKMDyn.geometry} material={materials.ujsvqBWRMnqdwPx} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.usFLmqcyrnltBUr.geometry} material={materials.sxNzrmuTqVeaXdg} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.xXDHkMplTIDAXLN.geometry} material={materials.pIJKfZsazmcpEiU} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.vELORlCJixqPHsZ.geometry} material={materials.zFdeDaGNRwzccye} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.EbQGKrWAqhBHiMv.geometry} material={materials.TBLSREBUyLMVtJa} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.EddVrWkqZTlvmci.geometry} material={materials.xNrofRCqOXXHVZt} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.KSWlaxBcnPDpFCs.geometry} material={materials.yQQySPTfbEJufve} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.TakBsdEjEytCAMK.geometry} material={materials.PaletteMaterial003} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.IykfmVvLplTsTEW.geometry} material={materials.PaletteMaterial004} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.wLfSXtbwRlBrwof.geometry} material={materials.oZRkkORNzkufnGD} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.WJwwVjsahIXbJpU.geometry} material={materials.yhcAXNGcJWCqtIS} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.YfrJNXgMvGOAfzz.geometry} material={materials.bCgzXjHOanGdTFV} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.DCLCbjzqejuvsqH.geometry} material={materials.vhaEJjZoqGtyLdo} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.CdalkzDVnwgdEhS.geometry} material={materials.jlzuBkUzuJqgiAK} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.NtjcIgolNGgYlCg.geometry} material={materials.PpwUTnTFZJXxCoE} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.pXBNoLiaMwsDHRF.geometry} material={materials.yiDkEwDSyEhavuP} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.IkoiNqATMVoZFKD.geometry} material={materials.hiVunnLeAHkwGEo} scale={0.01} />
      <mesh castShadow receiveShadow geometry={nodes.rqgRAGHOwnuBypi.geometry} material={materials.HGhEhpqSBZRnjHC} scale={0.01} />
    </group>
  );
}

// ─── Camera Controller ────────────────────────────────────────────

function CameraController({ controlsRef }) {
  const { camera } = useThree();
  const cameraPosition = usePhoneStore((s) => s.cameraPosition);
  const cameraTarget = usePhoneStore((s) => s.cameraTarget);
  const prevPosition = useRef(cameraPosition);
  const prevTarget = useRef(cameraTarget);

  useEffect(() => {
    if (
      prevPosition.current[0] !== cameraPosition[0] ||
      prevPosition.current[1] !== cameraPosition[1] ||
      prevPosition.current[2] !== cameraPosition[2]
    ) {
      // Mobile feels snappier; matchMedia keeps this split deterministic.
      const mm = gsap.matchMedia();
      let duration = 1.5;
      mm.add('(max-width: 760px)', () => {
        duration = 1.1;
      });
      mm.add('(min-width: 761px)', () => {
        duration = 1.5;
      });
      mm.revert();

      const tween = gsap.to(camera.position, {
        x: cameraPosition[0],
        y: cameraPosition[1],
        z: cameraPosition[2],
        duration,
        ease: 'power3.inOut',
      });
      prevPosition.current = cameraPosition;
      return () => tween.kill();
    }
  }, [cameraPosition, camera]);

  useEffect(() => {
    if (controlsRef.current) {
      const ctrl = controlsRef.current;
      const mm = gsap.matchMedia();
      let duration = 1.5;
      mm.add('(max-width: 760px)', () => {
        duration = 1.1;
      });
      mm.add('(min-width: 761px)', () => {
        duration = 1.5;
      });
      mm.revert();

      const tween = gsap.to(ctrl.target, {
        x: cameraTarget[0],
        y: cameraTarget[1],
        z: cameraTarget[2],
        duration,
        ease: 'power3.inOut',
        onUpdate: () => ctrl.update(),
      });
      prevTarget.current = cameraTarget;
      return () => tween.kill();
    }
  }, [cameraTarget, controlsRef]);

  return null;
}

// ─── Lens Explode Labels (3D Html) ────────────────────────────────

function LensLabels({ progress }) {
  if (progress < 0.3) return null;

  const opacity = Math.min((progress - 0.3) / 0.4, 1);

  return (
    <group position={[0.02, 0.06, -0.04]}>
      {LENS_LABELS.map((label, i) => (
        <Html
          key={label.text}
          position={[0.12, 0.02 - i * 0.03, -(label.offset * progress)]}
          center
          style={{
            opacity,
            transition: 'opacity 0.3s',
            pointerEvents: 'none',
          }}
        >
          <div className="showcase-label">
            <span className="showcase-label-title">{label.text}</span>
            <span className="showcase-label-desc">{label.desc}</span>
          </div>
        </Html>
      ))}
    </group>
  );
}

// ─── Showcase Lights ──────────────────────────────────────────────

function ShowcaseLights() {
  return (
    <group name="showcase-lights">
      <Environment resolution={256}>
        <group>
          <Lightformer form="rect" intensity={10} position={[-1, 0, -10]} scale={10} color={"#495057"} />
          <Lightformer form="rect" intensity={10} position={[-10, 2, 1]} scale={10} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={10} position={[10, 0, 1]} scale={10} rotation-y={Math.PI / 2} />
        </group>
      </Environment>
      <ambientLight intensity={0.3} />
      <spotLight position={[-2, 10, 5]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI * 0.2} color={"#f8f9fa"} />
      <spotLight position={[0, -25, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI * 0.2} color={"#f8f9fa"} />
      <spotLight position={[0, 15, 5]} angle={0.15} penumbra={1} decay={0.1} intensity={Math.PI * 3} />
    </group>
  );
}

// ─── Main ShowcaseScene ───────────────────────────────────────────

export default function ShowcaseScene() {
  const controlsRef = useRef();
  const modelGroupRef = useRef();
  const modelRotationY = usePhoneStore((s) => s.modelRotationY);
  const lensExplodeProgress = usePhoneStore((s) => s.lensExplodeProgress);
  const { fov, cameraZ, isMobile } = useResponsive();

  const { scale, position } = useAdaptivePhoneTransform(modelGroupRef, {
    variantScale: 1,
    fitPortrait: isMobile ? 0.84 : 0.86,
    fitLandscape: 0.9,
    portraitYOffset: isMobile ? 0.03 : 0,
  });

  // Smoothly lerp model rotation each frame
  useFrame(() => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        modelGroupRef.current.rotation.y,
        modelRotationY,
        0.05
      );
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, cameraZ]} fov={fov} />
      <ShowcaseLights />

      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={isMobile ? 0.3 : 0.4}
        target={[0, 0, 0]}
      />

      <CameraController controlsRef={controlsRef} />

      <group ref={modelGroupRef} position={position} scale={[scale, scale, scale]}>
        <Suspense fallback={<Loader />}>
          <ShowcasePhone explodeProgress={lensExplodeProgress} />
          <LensLabels progress={lensExplodeProgress} />
        </Suspense>
      </group>
    </>
  );
}
