"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface ScrollToTopProps {
  threshold?: number;
  className?: string;
}

export function ScrollToTop({ threshold = 280, className = "" }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to Top"
      className={`fixed z-40 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/90 hover:bg-slate-950 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 border border-slate-700/80 backdrop-blur-md transition-all duration-200 group cursor-pointer animate-pop-fade ${className}`}
    >
      <ArrowUp className="h-5 w-5 text-emerald-400 group-hover:-translate-y-0.5 transition-transform" />
      <span className="sr-only">Back to top</span>
    </button>
  );
}
