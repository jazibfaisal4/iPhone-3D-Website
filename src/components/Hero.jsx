import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroVideo, smallHeroVideo } from '../utils';
import { useMemo } from "react";
import useMediaQuery from "../hooks/useMediaQuery";

const Hero = () => {
  const isMobile = useMediaQuery('(max-width: 760px)');
  const videoSrc = useMemo(() => isMobile ? smallHeroVideo : heroVideo, [isMobile]);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(max-width: 760px)', () => {
      gsap.to('#hero', { opacity: 1, delay: 1.1, duration: 0.9 });
      gsap.to('#cta', { opacity: 1, y: -30, delay: 1.4, duration: 0.9 });
    });

    mm.add('(min-width: 761px)', () => {
      gsap.to('#hero', { opacity: 1, delay: 1.5, duration: 1 });
      gsap.to('#cta', { opacity: 1, y: -50, delay: 2, duration: 1 });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col">
        <p id="hero" className="hero-title">iPhone 15 Pro</p>
        <div className="md:w-10/12 w-9/12">
          <video className="pointer-events-none" autoPlay muted playsInline={true} key={videoSrc}>
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>
      <div id="cta" className="flex flex-col items-center opacity-0 translate-y-20">
        <a href="#highlights" className="btn">Buy</a>
        <p className="font-normal text-xl">From $199/month or $999</p>
      </div>
    </section>
  );
};

export default Hero;