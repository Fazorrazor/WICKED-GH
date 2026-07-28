"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HERO_VIDEOS = ["/videos/runway-walk.mp4", "/videos/paris-scenery.mp4"];

export function HeroVideoBackground() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#0a0a0a]">
      <AnimatePresence initial={false}>
        <motion.video
          key={activeVideoIndex}
          src={HERO_VIDEOS[activeVideoIndex]}
          autoPlay
          muted
          playsInline
          preload="none"
          onEnded={() =>
            setActiveVideoIndex((prev) => (prev + 1) % HERO_VIDEOS.length)
          }
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover object-center"
          poster="/hero-placeholder.jpg"
        />
      </AnimatePresence>
    </div>
  );
}

