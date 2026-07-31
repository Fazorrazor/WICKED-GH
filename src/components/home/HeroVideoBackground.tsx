"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function HeroVideoBackground() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#050505]">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.15 }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0 w-full h-full"
      >
        <Image
          src="/garments/hero_night_luxe.png"
          alt="Wicked Night Luxe Campaign"
          fill
          priority
          className="object-cover object-center opacity-90"
        />
      </motion.div>
    </div>
  );
}
