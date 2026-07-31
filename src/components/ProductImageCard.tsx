"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

interface ProductImageCardProps {
  title: string;
  price: string | number;
  imageWornUrl: string;
  imageSoloUrl: string;
  startWithWorn?: boolean;
  className?: string;
  aspectClass?: string;
  index?: number;
  priority?: boolean;
}

// Custom loader for Supabase native image transformations (Version 3)
const supabaseLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  // Convert /object/public/ to /render/image/public/ for transformations
  const transformSrc = src.replace("/object/public/", "/render/image/public/");
  return `${transformSrc}?width=${width}&quality=${quality || 75}&format=webp`;
};

export default function ProductImageCard({
  title,
  price,
  imageWornUrl,
  imageSoloUrl,
  startWithWorn = false,
  className = "",
  aspectClass = "aspect-[4/5]",
  index = 0,
  priority = false,
}: ProductImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "0px 0px -200px 0px" });

  useEffect(() => {
    // Detect touch devices
    const matchMedia = window.matchMedia("(hover: none)");
    setTimeout(() => setIsMobile(matchMedia.matches), 0);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    matchMedia.addEventListener("change", handler);

    return () => matchMedia.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    // Auto-cycle for mobile devices if visible and no reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isHidden = document.hidden;
    if (!isMobile || !isInView || prefersReducedMotion || isHidden) return;

    const offset = index * 1000;
    let interval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      setAutoFlip((prev) => !prev);
      interval = setInterval(() => {
        if (!document.hidden) {
          setAutoFlip((prev) => !prev);
        }
      }, 3500); // 3.5s cycle
    }, offset);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [isMobile, index, isInView]);

  const isFlipped = isMobile ? autoFlip : isHovered;
  const showWornImage = startWithWorn ? !isFlipped : isFlipped;

  // The Prada background trick: set a solid minimalist gray background on the container.
  // Use mix-blend-multiply on the images so their white backgrounds disappear and they blend perfectly.
  // This makes the background look static while only the product crossfades!
  return (
    <div
      ref={containerRef}
      className={`flex flex-col group cursor-pointer h-full bg-[#FDFDFD] ${className}`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Image Container with Static Background */}
      <div className={`relative w-full overflow-hidden bg-[#F0F0F0] ${aspectClass}`}>
        <AnimatePresence initial={false}>
          {showWornImage ? (
            <motion.div
              key="worn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                loader={supabaseLoader}
                src={imageWornUrl}
                alt={`${title} on model`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority}
                className="object-cover object-center mix-blend-multiply"
              />
            </motion.div>
          ) : (
            <motion.div
              key="solo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              {/* VERSION 1: Current Vercel Optimization (Baseline) */}
              {/* <Image
                src={imageSoloUrl}
                alt={`${title} solo`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={priority && !showWornImage}
                className="object-cover object-center mix-blend-multiply"
              /> */}

              {/* VERSION 2: Direct unoptimized image (Uncomment to test) */}
              {/* <Image
                src={imageSoloUrl}
                alt={`${title} solo`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={priority && !showWornImage}
                unoptimized={true}
                className="object-cover object-center mix-blend-multiply"
              /> */}

              {/* VERSION 3: Supabase Transformed Image (Uncomment to test) */}
              <Image
                loader={supabaseLoader}
                src={imageSoloUrl}
                alt={`${title} solo`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority && !showWornImage}
                className="object-cover object-center mix-blend-multiply"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prada-style Dot Indicators for Mobile */}
        {isMobile && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-[5px] z-10">
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${!showWornImage ? "bg-[#121212]" : "bg-transparent border border-[#121212]"}`} />
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${showWornImage ? "bg-[#121212]" : "bg-transparent border border-[#121212]"}`} />
          </div>
        )}
      </div>

      {/* Typography */}
      <div className="flex flex-col shrink-0 px-3 py-4 md:px-4 md:py-5 bg-[#FDFDFD]">
        <h3 className="font-sans font-semibold text-[0.7rem] md:text-[0.75rem] leading-[1.3] text-black tracking-widest mb-1.5 min-h-[2.6em] line-clamp-2">
          {title}
        </h3>
        <span className="font-sans font-medium text-[0.65rem] md:text-[0.7rem] text-black/60">
          {price}
        </span>
      </div>
    </div>
  );
}
