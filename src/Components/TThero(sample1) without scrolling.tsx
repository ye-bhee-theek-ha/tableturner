import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroSection_WithoutScroll = () => {
  const { scrollY } = useScroll();
  const [thresholdReached, setThresholdReached] = useState(false);

  // Parallax transforms for each image
  const parallaxLeft = useTransform(scrollY, [0, 300], [50, -50]);
  const parallaxRight = useTransform(scrollY, [0, 300], [50, -50]);
  const parallaxMiddle = useTransform(scrollY, [0, 300], [-60, 0]);

  // Video playback state and ref
  const [playVideo, setPlayVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Toggle video playback based on scroll threshold
  useEffect(() => {
    const handleScroll = () => {
      const threshold = 300;
      if (window.scrollY >= threshold && !thresholdReached) {
        setThresholdReached(true);
        setPlayVideo(true);
      } else if (window.scrollY < threshold && thresholdReached) {
        setThresholdReached(false);
        // Optionally pause or reset video here if desired:
        // setPlayVideo(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [thresholdReached]);

  // Auto-play the video once it is rendered
  useEffect(() => {
    if (playVideo && videoRef.current) {
      videoRef.current.play();
    }
  }, [playVideo]);

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center">
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
      <div className="relative flex flex-col md:flex-row justify-center items-center mt-10 w-full px-4 md:px-24">
        {/* Left Image */}
        <motion.img
          src={require("../images/left.png")}
          alt="Left Image"
          className="w-full md:w-1/4 rounded-lg px-4 mb-6 md:mb-0"
          style={{ y: parallaxLeft }}
        />

        {/* Middle Section with Video/Image and CTA */}
        <motion.div
          style={{ y: parallaxMiddle }}
          className="w-full md:w-1/2 rounded-lg px-4"
        >
          {playVideo ? (
            <video
              ref={videoRef}
              className="w-full rounded-lg"
              src={require("../images/mid.mp4")}
              autoPlay
              muted
              loop
            />
          ) : (
            <img
              src={require("../images/mid.png")}
              alt="Middle Image"
              className="w-full rounded-lg"
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
        <motion.img
          src={require("../images/right.png")}
          alt="Right Image"
          className="w-full md:w-1/4 rounded-lg px-4 mt-6 md:mt-0"
          style={{ y: parallaxRight }}
        />
      </div>
    </div>
  );
};

export default HeroSection_WithoutScroll;
