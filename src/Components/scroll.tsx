import React, { useEffect, useRef, useState } from 'react';

const SnapScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const deltaRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const threshold = 100;
  const [currentSection, setCurrentSection] = useState<number>(0);
  const sections = [0, 1]; // Indices for our two sections

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
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
        const direction = deltaRef.current > 0 ? 1 : -1;
        const nextSection = Math.max(0, Math.min(sections.length - 1, currentSection + direction));
        
        if (nextSection !== currentSection) {
          setCurrentSection(nextSection);
          const scrollTop = nextSection * window.innerHeight;
          container.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }
        
        deltaRef.current = 0;
      }
    };

    // Attach the wheel event listener
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSection]);

  return (
    <div
      ref={containerRef}
      style={{ 
        height: '100vh', 
        overflow: 'auto',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth'
      }}
    >
      {/* First section */}
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          scrollSnapAlign: 'start',
          backgroundColor: '#3498db'
        }}
      >
        <h1 style={{ color: '#fff', fontSize: '2rem' }}>
          Section 1: Scroll with a strong gesture to trigger snapping!
        </h1>
      </div>
      
      {/* Second section */}
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          scrollSnapAlign: 'start',
          backgroundColor: '#e74c3c'
        }}
      >
        <h1 style={{ color: '#fff', fontSize: '2rem' }}>
          Section 2: You've snapped to the second section!
        </h1>
      </div>
    </div>
  );
};

export default SnapScroll;