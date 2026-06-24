"use client";

import { useEffect, useRef } from "react";
import styles from "./AutoSlider.module.css";

interface AutoSliderProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // Time in ms between scrolls
  pauseOnHover?: boolean;
  showControls?: boolean;
  isInfinite?: boolean;
}

export default function AutoSlider({ 
  children, 
  className = "", 
  speed = 3000,
  pauseOnHover = true,
  showControls = false,
  isInfinite = false
}: AutoSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = () => {
    if (!scrollRef.current) return;
    
    timerRef.current = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        if (isInfinite) {
          // Seamless loop logic: if we reached the start of the cloned set
          if (scrollLeft >= scrollWidth / 2) {
            // Jump back to 0 instantly without animation
            scrollRef.current.scrollTo({ left: 0, behavior: "auto" });
            // Allow browser to register the jump before smooth scrolling again
            setTimeout(() => {
              if (scrollRef.current) {
                scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
              }
            }, 30);
          } else {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
          }
        } else {
          // Standard end-to-start jump
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
          }
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

  const handlePrev = () => {
    if (scrollRef.current) {
      if (isInfinite && scrollRef.current.scrollLeft <= 5) {
        // If at start, jump to the end of the first set instantly
        scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth / 2, behavior: "auto" });
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
          }
        }, 30);
      } else {
        scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
      }
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      if (isInfinite && scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2 - 10) {
        // If reached the cloned set, jump to start instantly
        scrollRef.current.scrollTo({ left: 0, behavior: "auto" });
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
          }
        }, 30);
      } else {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }
  };

  return (
    <div 
      className={styles.sliderWrapper}
      onMouseEnter={pauseOnHover ? stopAutoScroll : undefined}
      onMouseLeave={pauseOnHover ? startAutoScroll : undefined}
      onTouchStart={pauseOnHover ? stopAutoScroll : undefined}
      onTouchEnd={pauseOnHover ? startAutoScroll : undefined}
    >
      {showControls && (
        <button className={`${styles.controlBtn} ${styles.btnLeft}`} onClick={handlePrev} aria-label="Previous">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div ref={scrollRef} className={className}>
        {children}
      </div>

      {showControls && (
        <button className={`${styles.controlBtn} ${styles.btnRight}`} onClick={handleNext} aria-label="Next">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
