import { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });
  const [loadedData, setLoadedData] = useState([]);
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(max-width: 760px)', () => {
      gsap.to('#slider', {
        transform: `translateX(${-100 * videoId}%)`,
        duration: 1.4,
        ease: 'power2.inOut',
      });

      gsap.to('#video', {
        scrollTrigger: {
          trigger: '#video',
          toggleActions: 'restart none none none',
          start: 'top 70%',
        },
        onComplete: () => {
          setVideo((pre) => ({
            ...pre,
            startPlay: true,
            isPlaying: true,
          }));
        },
      });
    });

    mm.add('(min-width: 761px)', () => {
      gsap.to('#slider', {
        transform: `translateX(${-100 * videoId}%)`,
        duration: 2,
        ease: 'power2.inOut',
      });

      gsap.to('#video', {
        scrollTrigger: {
          trigger: '#video',
          toggleActions: 'restart none none none',
          start: 'top 85%',
        },
        onComplete: () => {
          setVideo((pre) => ({
            ...pre,
            startPlay: true,
            isPlaying: true,
          }));
        },
      });
    });

    return () => mm.revert();
  }, [isEnd, videoId]);

  // Play/pause video based on state
  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleLoadedMetadata = (i, e) => setLoadedData((pre) => [...pre, e]);

  // Progress bar animation with proper cleanup
  useEffect(() => {
    let anim = null;
    let animUpdate = null;
    const span = videoSpanRef.current;
    let widthForUpdate = '4vw';

    // Width-dependent UX tweaks (keeps mobile progress bar closer to the finger)
    const mm = gsap.matchMedia();
    mm.add('(max-width: 1199px)', () => {
      widthForUpdate = '10vw';
    });
    mm.add('(min-width: 1200px)', () => {
      widthForUpdate = '4vw';
    });
    mm.revert();

    if (span[videoId]) {
      anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);

          gsap.to(videoDivRef.current[videoId], {
            width: widthForUpdate,
          });

          gsap.to(span[videoId], {
            width: `${progress}%`,
            backgroundColor: "white",
          });
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: '12px'
            });
            gsap.to(span[videoId], {
              backgroundColor: '#afafaf'
            });
          }
        }
      });

      if (videoId === 0) {
        anim.restart();
      }

      animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
          hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }

    // Cleanup: remove ticker callback and kill the tween
    return () => {
      if (animUpdate) {
        gsap.ticker.remove(animUpdate);
      }
      if (anim) {
        anim.kill();
      }
    };
  }, [videoId, startPlay]);

  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;
      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;
      case "video-reset":
        setVideo((pre) => ({ ...pre, isLastVideo: false, videoId: 0 }));
        break;
      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: true }));
        break;
      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: false }));
        break;
      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  className={`${
                    list.id === 2 && 'translate-x-44'}
                    pointer-events-none`}
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() =>
                    i !== 3
                      ? handleProcess('video-end', i)
                      : handleProcess('video-last')
                  }
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetadata(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full
          relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              ></span>
            </span>
          ))}
        </div>
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                  ? () => handleProcess("play")
                  : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
