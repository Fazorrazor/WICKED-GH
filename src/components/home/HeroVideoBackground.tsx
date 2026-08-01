"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function HeroVideoBackground() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#050505]">
      {/* 
        We use a slow scale animation on the wrapper if desired, 
        but video naturally has motion. Let's just apply a subtle fade-in.
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover object-center w-full h-full opacity-80"
          // Provide your local video path here, e.g., src="/videos/hero-campaign.mp4"
          // For now using a placeholder or assuming the user provides one in public folder:
          src="/hero.mp4"
        />
      </motion.div>
    </div>
  );
}
