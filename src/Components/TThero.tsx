import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroSection = () => {
  // Scroll and parallax setup
  const { scrollY } = useScroll();
  const sectionRef = useRef<HTMLDivElement>(null);
  const deltaRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const threshold = 300;
  const [scrollStage, setScrollStage] = useState<number>(0); // 0: initial, 1: fully visible, 2: next component
  const [componentHeight, setComponentHeight] = useState<number>(0);

  // Parallax transforms for each image
  const parallaxLeft = useTransform(scrollY, [0, 300], [50, -50]);
  const parallaxRight = useTransform(scrollY, [0, 300], [50, -50]);
  const parallaxMiddle = useTransform(scrollY, [0, 300], [-60, 0]);

  // Video playback state and ref
  const [playVideo, setPlayVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get component height on mount and resize
  useEffect(() => {
    const updateComponentHeight = () => {
      if (sectionRef.current) {
        setComponentHeight(sectionRef.current.offsetHeight);
      }
    };

    // Initial measurement
    updateComponentHeight();

    // Update on resize
    window.addEventListener('resize', updateComponentHeight);
    return () => window.removeEventListener('resize', updateComponentHeight);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent default browser scrolling
      e.preventDefault();
      
      // Accumulate delta for more precise control
      deltaRef.current += e.deltaY;
  
      // Clear any previous reset timer and start a new one
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        deltaRef.current = 0;
      }, 1000);
  
      // If the accumulated delta exceeds our threshold, trigger a scroll
      if (Math.abs(deltaRef.current) >= threshold) {
        const direction = deltaRef.current > 0 ? 1 : -1; // 1 for down, -1 for up
        
        // Get current scroll position and component information
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const componentTop = sectionRef.current?.getBoundingClientRect().top || 0;
        const componentBottom = sectionRef.current?.getBoundingClientRect().bottom || 0;
        const isComponentTallerThanScreen = componentHeight > windowHeight;
        
        // Calculate the visible portion of the component
        const isFullyVisible = componentTop >= 0 && componentBottom <= windowHeight;
        const isPartiallyVisible = 
          (componentTop < 0 && componentBottom > 0) || // Top is above viewport, bottom is in viewport
          (componentTop < windowHeight && componentBottom > windowHeight); // Top is in viewport, bottom is below
        const isComponentTopAtViewportTop = Math.abs(componentTop) < 10; // Small threshold for rounding errors
        
        console.log({
          direction,
          scrollPosition,
          componentTop,
          componentBottom,
          windowHeight,
          componentHeight,
          isComponentTallerThanScreen,
          isFullyVisible,
          isPartiallyVisible,
          scrollStage
        });
  
        // Handle different scroll stages
        if (direction > 0) { // Scrolling DOWN
          if (scrollStage === 0) {
            // If we're at the top of the component and it's taller than screen
            if (isComponentTallerThanScreen && isComponentTopAtViewportTop) {
              // Scroll to reveal the entire component or as much as possible
              const scrollAmount = Math.min(
                componentHeight - windowHeight, // Don't scroll past component
                scrollPosition + windowHeight * 0.8 // Scroll by ~80% of viewport height
              );
              window.scrollTo({ top: scrollAmount, behavior: 'smooth' });
              setPlayVideo(true);
              setScrollStage(1);
            } 
            // If component is fully visible or smaller than viewport
            else if (isFullyVisible || !isComponentTallerThanScreen) {
              // Scroll to the next component
              window.scrollTo({ top: componentHeight, behavior: 'smooth' });
              setScrollStage(2);
            }
            // If component is partially visible but not at top
            else if (isPartiallyVisible) {
              // Just scroll to the bottom of this component
              const scrollAmount = scrollPosition + (componentBottom - windowHeight);
              window.scrollTo({ top: scrollAmount, behavior: 'smooth' });
              setPlayVideo(true);
              setScrollStage(1);
            }
          } 
          else if (scrollStage === 1) {
            // Already scrolled down once, now move to next component
            window.scrollTo({ top: componentHeight, behavior: 'smooth' });
            setScrollStage(2);
          }
          // If we're already at stage 2, let normal scrolling take over
        } 
        else { // Scrolling UP
          if (scrollStage === 2) {
            // Scroll back to see the full current component
            const scrollAmount = Math.max(0, componentHeight - windowHeight);
            window.scrollTo({ top: scrollAmount, behavior: 'smooth' });
            setScrollStage(1);
          } 
          else if (scrollStage === 1) {
            // Scroll back to top of component
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setScrollStage(0);
          }
          // If already at the top (stage 0), do nothing
        }
        
        // Reset delta after a scroll action
        deltaRef.current = 0;
      }
    };
  
    // Attach the wheel event listener
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [componentHeight, scrollStage]);

  // Auto-play the video once it should be played
  useEffect(() => {
    if (playVideo && videoRef.current) {
      videoRef.current.play();
    }
  }, [playVideo]);

  return (
    <div ref={sectionRef} className="relative py-24 bg-black">
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

export default HeroSection;