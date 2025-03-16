import React, { useRef, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

// Add scrollUtils type
type ScrollUtils = {
  scrollToSection: (index: number) => void;
  scrollToNextSection: () => void;
  scrollToPreviousSection: () => void;
  currentSectionIndex: number;
};

interface ParallaxSectionProps {
  scrollUtils: ScrollUtils;
}

const HeroSectionTest = ({ scrollUtils }: ParallaxSectionProps) => {
  // Scroll and parallax setup
  const { scrollY } = useScroll();
  const contentRef = useRef<HTMLDivElement>(null);
  const [playVideo, setPlayVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Parallax transforms for each image
  const parallaxLeft = useTransform(scrollY, [0, 300], [50, -50]);
  const parallaxRight = useTransform(scrollY, [0, 300], [50, -50]);
  const parallaxMiddle = useTransform(scrollY, [0, 300], [-60, 0]);

  // Listen for section visibility changes
  React.useEffect(() => {
    if (scrollUtils.currentSectionIndex === 0) {
      // This is when our section is in view
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            // If this component is more than 50% visible, play the video
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setPlayVideo(true);
            }
          });
        },
        {
          threshold: 0.5
        }
      );

      if (contentRef.current) {
        observer.observe(contentRef.current);
      }

      return () => {
        if (contentRef.current) {
          observer.unobserve(contentRef.current);
        }
      };
    }
  }, [scrollUtils.currentSectionIndex]);

  // Auto-play the video once it should be played
  React.useEffect(() => {
    if (playVideo && videoRef.current) {
      videoRef.current.play().catch(err => console.log("Video play failed:", err));
    }
  }, [playVideo]);

  return (
    <div ref={contentRef} className="relative py-24 bg-black">
      <div className="min-h-screen pb-24 text-white flex flex-col items-center justify-center">
        {/* Header Section */}
        <div className="text-center w-full z-20 px-4">
          <p className="text-sm uppercase tracking-wider mb-2">
            Digital solution that helps with online sales
          </p>
          <div className="w-full max-w-xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-light leading-tight font-creato text-center">
              A Digital System
            </h2>
            <h2 className="text-4xl md:text-6xl font-light leading-tight font-creato text-left">
              <span className="text-lime">that turns</span> your
            </h2>
            <h2 className="text-4xl md:text-6xl font-light leading-tight font-creato text-right">
              restaurant's <span className="text-lime">tables</span>
            </h2>
          </div>
        </div>

        {/* Image / Video and Call-to-Action Section */}
        <div className="relative columns-4 flex flex-col md:flex-row justify-center items-center mt-10 w-full px-4 lg:px-14 2xl::px-24">
          {/* Left Image */}
          <motion.div
            className="w-full md:w-1/4 rounded-lg px-4 mt-6 md:mt-0 col-span-2 lg:col-span-1"
            style={{ y: parallaxLeft }}
          >
            <motion.img
              src={require("../images/left.png")}
              alt="Left Image"
              className="w-full object-contain rounded-lg px-4 mt-6 "
              style={{ y: parallaxLeft }}
            />
          </motion.div>

          {/* Middle Section with Video/Image and CTA */}
          <motion.div
            style={{ y: parallaxMiddle }}
            className="w-full h-[400px] md:w-1/2 rounded-lg px-4 col-span-4 lg:col-span-2"
          >
            {playVideo ? (
              <video
                ref={videoRef}
                className="w-full rounded-lg h-full object-cover"
                src={require("../images/mid.mp4")}
                autoPlay
                muted
                loop
              />
            ) : (
              <img
                src={require("../images/mid.png")}
                alt="Middle Image"
                className="w-full rounded-lg h-full object-cover"
              />
            )}
            <div className="mt-10 bg-lime/20 border border-lime/70 text-white py-4 px-8 rounded-3xl flex flex-col lg:flex-row items-center">
              <p className="text-md font-creato font-extralight flex-1 text-center lg:text-start">
                Opening a new restaurant? Reach profitability faster with our limited-time software bundle.
              </p>
              <button 
                className="p-[1px] relative rounded-full h-fit mt-4 lg:mt-0 lg:ml-4"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-lime to-[#FF8509] rounded-full" />
                <div className="px-8 py-3 text-lg bg-black rounded-full relative group transition duration-200 text-white hover:bg-transparent">
                  Start Here
                </div>
              </button>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="w-full md:w-1/4 rounded-lg px-4 mt-6 md:mt-0 col-span-2 lg:col-span-1"
            style={{ y: parallaxRight }}
          >
            <motion.img
              src={require("../images/right.png")}
              alt="Right Image"
              className="w-full object-contain rounded-lg px-4 mt-6 "
              style={{ y: parallaxRight }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionTest;