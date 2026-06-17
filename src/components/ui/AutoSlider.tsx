"use client";

import { useEffect, useRef } from "react";

interface AutoSliderProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // Time in ms between scrolls
  pauseOnHover?: boolean;
}

export default function AutoSlider({ 
  children, 
  className = "", 
  speed = 3000,
  pauseOnHover = true 
}: AutoSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = () => {
    if (!scrollRef.current) return;
    
    timerRef.current = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        // If we reached the end, scroll back to start, else scroll right by 1 item width (~280px)
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Assume average item width is about 280px, but it will snap anyway
          scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, speed);
  };

  const stopAutoScroll = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [speed]);

  return (
    <div 
      ref={scrollRef}
      className={className}
      onMouseEnter={pauseOnHover ? stopAutoScroll : undefined}
      onMouseLeave={pauseOnHover ? startAutoScroll : undefined}
      onTouchStart={pauseOnHover ? stopAutoScroll : undefined}
      onTouchEnd={pauseOnHover ? startAutoScroll : undefined}
    >
      {children}
    </div>
  );
}
