import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
}

export function useCountUp({ end, start = 0, duration = 2000, delay = 0 }: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now() + delay;
    const startValue = start;
    const endValue = end;
    const totalDuration = duration;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      if (elapsed >= totalDuration) {
        setCount(endValue);
        return;
      }

      const progress = elapsed / totalDuration;
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeOutCubic;
      
      setCount(Math.floor(current));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, start, end, duration, delay]);

  return { count, ref: elementRef };
}