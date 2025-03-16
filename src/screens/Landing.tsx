import React, { useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';

// Import your components
import HeroSectionTest from '../Components/TThero test';

const Landing = () => {
  // Scroll state management
  const { scrollY } = useScroll();
  const appRef = useRef<HTMLDivElement>(null);
  const deltaRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const threshold = 500;
  
  // Current section tracking
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [sectionHeights, setSectionHeights] = useState<number[]>([]);
  
  // Fix: Use React.RefObject<HTMLDivElement>[] type and properly initialize refs
  const [sectionRefs, setSectionRefs] = useState<React.RefObject<HTMLDivElement | null>[]>([]);
  
  // Create refs for each section on component mount
  useEffect(() => {
    // Define how many sections you have here
    const numberOfSections = 3;
    
    const refs: React.RefObject<HTMLDivElement | null>[] = Array(numberOfSections)
      .fill(0)
      .map(() => React.createRef<HTMLDivElement>());
    
    setSectionRefs(refs);
  }, []);
  
  // Rest of your component remains the same
  
  // Measure all section heights after they've mounted
  useEffect(() => {
    if (sectionRefs.length === 0) return;
    
    const measureSectionHeights = () => {
      const heights = sectionRefs.map(ref => {
        return ref.current?.offsetHeight || 0;
      });
      
      setSectionHeights(heights);
      console.log("Section heights measured:", heights);
    };
    
    // Measure after a small delay to ensure components are rendered
    const timer = setTimeout(measureSectionHeights, 100);
    
    // Remeasure on window resize
    window.addEventListener('resize', measureSectionHeights);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureSectionHeights);
    };
  }, [sectionRefs]);
  
  // Calculate cumulative heights for scrolling
  const getSectionScrollPosition = (index: number): number => {
    return sectionHeights
      .slice(0, index)
      .reduce((total, height) => total + height, 0);
  };
  
  // Get the section index at a specific scroll position
  const getSectionIndexAtPosition = (scrollPos: number): number => {
    let cumulativeHeight = 0;
    for (let i = 0; i < sectionHeights.length; i++) {
      cumulativeHeight += sectionHeights[i];
      if (scrollPos < cumulativeHeight) {
        return i;
      }
    }
    return sectionHeights.length - 1;
  };
  
  // Main scroll handling logic
  useEffect(() => {
    if (sectionHeights.length === 0) return;
    
    const handleWheel = (e: WheelEvent) => {
      // Don't handle scrolling if animation is in progress
      if (isScrolling) return;
      
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

          // ----- Edge Case Handling -----
      // Prevent scrolling upward at the top
      if (currentSectionIndex === 0 && deltaRef.current < 0) {
        console.log("At top; ignoring upward scroll");
        deltaRef.current = 0;
        return;
      }
      // Prevent scrolling downward at the bottom
      if (currentSectionIndex === sectionHeights.length - 1 && deltaRef.current > 0) {
        console.log("At bottom; ignoring downward scroll");
        deltaRef.current = 0;
        return;
      }
      // --------------------------------
      
      // Only trigger scroll if accumulated delta exceeds threshold
      if (Math.abs(deltaRef.current) >= threshold) {
        const direction = deltaRef.current > 0 ? 1 : -1; // 1 for down, -1 for up
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        
        // Get current section information
        const currentIndex = getSectionIndexAtPosition(scrollPosition);
        const currentSectionRef = sectionRefs[currentIndex];
        const currentSectionTop = currentSectionRef.current?.getBoundingClientRect().top || 0;
        const currentSectionBottom = currentSectionRef.current?.getBoundingClientRect().bottom || 0;
        const isSectionTallerThanScreen = sectionHeights[currentIndex] > windowHeight;
        
        // Calculate position within current section
        const sectionScrollPosition = getSectionScrollPosition(currentIndex);
        const relativeScrollPosition = scrollPosition - sectionScrollPosition;
        const scrollPositionInSection = relativeScrollPosition / sectionHeights[currentIndex];
        
        
        // Determine where to scroll next
        let targetScrollPosition = scrollPosition;

        if (direction > 0) { // Scrolling DOWN
          if (isSectionTallerThanScreen) {
            // Always move down by a fixed increment (80% of viewport height)
            targetScrollPosition = scrollPosition + windowHeight;
            const maxSectionScroll = sectionScrollPosition + sectionHeights[currentIndex] - windowHeight;
            // If the new position is very close to the section's bottom, jump to next section
            if (targetScrollPosition >= maxSectionScroll) {
              const nextIndex = Math.min(currentIndex + 1, sectionHeights.length - 1);
              targetScrollPosition = getSectionScrollPosition(nextIndex);
              setCurrentSectionIndex(nextIndex);
            } else {
              // Otherwise, remain in the current section (clamped to section bounds)
              targetScrollPosition = Math.min(targetScrollPosition, maxSectionScroll);
            }
          } else {
            // For sections that fit within the screen, simply jump to the next section
            const nextIndex = Math.min(currentIndex + 1, sectionHeights.length - 1);
            targetScrollPosition = getSectionScrollPosition(nextIndex);
            setCurrentSectionIndex(nextIndex);
          }
        } else { // Scrolling UP
          if (isSectionTallerThanScreen) {
            // Always move up by a fixed increment (80% of viewport height)
            targetScrollPosition = scrollPosition - windowHeight;
            // If the new position is very close to the section's top, jump to previous section
            if (targetScrollPosition <= sectionScrollPosition) {
              const prevIndex = Math.max(currentIndex - 1, 0);
              targetScrollPosition = getSectionScrollPosition(prevIndex);
              setCurrentSectionIndex(prevIndex);
            } else {
              // Otherwise, remain within the current section
              targetScrollPosition = Math.max(targetScrollPosition, sectionScrollPosition);
            }
          } else {
            // For sections that fit on the screen, simply jump to the previous section
            const prevIndex = Math.max(currentIndex - 1, 0);
            targetScrollPosition = getSectionScrollPosition(prevIndex);
            setCurrentSectionIndex(prevIndex);
          }
        }        
        
        // Execute scroll
        setIsScrolling(true);
        window.scrollTo({
          top: targetScrollPosition,
          behavior: 'smooth'
        });
        
        // Reset delta and update state
        deltaRef.current = 0;
        
        // Clear scrolling lock after animation completes
        setTimeout(() => {
          setIsScrolling(false);
        }, 1000); // Match this to your scroll animation duration
      }
    };
    
    // Handle scroll completion detection
    const handleScrollEnd = () => {
      const scrollPosition = window.scrollY;
      const newIndex = getSectionIndexAtPosition(scrollPosition);
      if (newIndex !== currentSectionIndex) {
        setCurrentSectionIndex(newIndex);
      }
    };
    
    let scrollTimeout: number | null = null;
    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = window.setTimeout(handleScrollEnd, 150);
    };
    
    // Attach event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [sectionHeights, isScrolling, currentSectionIndex]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToNextSection();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToPreviousSection();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScrolling, currentSectionIndex, sectionHeights]);
  
  // Navigation functions (can be exported or passed to child components)
  const scrollToSection = (index: number) => {
    if (isScrolling || index < 0 || index >= sectionHeights.length) return;
    
    setIsScrolling(true);
    setCurrentSectionIndex(index);
    
    window.scrollTo({
      top: getSectionScrollPosition(index),
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };
  
  const scrollToNextSection = () => {
    scrollToSection(Math.min(currentSectionIndex + 1, sectionHeights.length - 1));
  };
  
  const scrollToPreviousSection = () => {
    scrollToSection(Math.max(currentSectionIndex - 1, 0));
  };
  
  // Export navigation methods for other components to use
  const scrollUtils = {
    scrollToSection,
    scrollToNextSection,
    scrollToPreviousSection,
    currentSectionIndex
  };
  
  return (
    <div ref={appRef} className="app">
      {/* First section with ref */}
      <div ref={sectionRefs[0]} className="section">
        <HeroSectionTest scrollUtils={scrollUtils} />
      </div>
      
      {/* Add your other sections here */}
      <div ref={sectionRefs[1]} className="section">
        {/* <OtherSection scrollUtils={scrollUtils} /> */}
        <div className="min-h-screen bg-gray-800 flex items-center justify-center">
          <h2 className="text-4xl text-white">Section 2</h2>
        </div>
      </div>
      
      <div ref={sectionRefs[2]} className="section">
        {/* <AnotherSection scrollUtils={scrollUtils} /> */}
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <h2 className="text-4xl text-white">Section 3</h2>
        </div>
      </div>
    </div>
  );
};

export default Landing;