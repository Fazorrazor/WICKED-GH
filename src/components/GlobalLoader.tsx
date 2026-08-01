"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const FLASH_IMAGES = [
  "/garments/hero-cinematic.png",
  "/garments/placeholder_product_1.png",
  "/garments/placeholder_product_2.png",
  "/garments/hero-cinematic.png",
  "/garments/placeholder_product_1.png",
];

export default function GlobalLoader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [phase, setPhase] = useState("flashing"); // flashing -> holding -> exiting
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    // Only run loader once per session in production
    if (
      sessionStorage.getItem("fhgh-loaded") &&
      process.env.NODE_ENV === "production"
    ) {
      setTimeout(() => setIsLoaded(true), 0);
      return;
    }

    document.body.style.overflow = "hidden";

    // Flash interval for the image avalanche
    const flashInterval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % FLASH_IMAGES.length);
    }, 160);

    // Elegant timing sequence
    const holdTimer = setTimeout(() => {
      clearInterval(flashInterval);
      setPhase("holding");
    }, 1800);
    
    const exitTimer = setTimeout(() => setPhase("exiting"), 3800);
    
    const unmountTimer = setTimeout(() => {
      setIsLoaded(true);
      document.body.style.overflow = "";
      sessionStorage.setItem("fhgh-loaded", "true");
    }, 4800);

    return () => {
      clearInterval(flashInterval);
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (isLoaded) return null;

  return (
    <AnimatePresence>
      {phase !== "exiting" && (
        <motion.div
          key="elegant-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] pointer-events-auto"
        >
          {/* Flashing Carousel / Image Avalanche */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              {phase === "flashing" && (
                <motion.div
                  key="flash-container"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-64 h-[24rem] md:w-80 md:h-[30rem] overflow-hidden"
                >
                  {FLASH_IMAGES.map((src, i) => (
                    <Image
                      key={`${src}-${i}`}
                      src={src}
                      alt="Wicked Archive"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 300px"
                      className={`object-cover object-top transition-opacity duration-[50ms] ${
                        i === imgIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                  {/* Subtle dark gradient overlay to keep it moody */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logo Reveal */}
          <AnimatePresence>
            {phase === "holding" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col items-center"
              >
                <Image src="/logo-accent.png" alt="Wicked" width={160} height={80} priority className="h-16 md:h-20 w-auto object-contain opacity-90" />
                
                {/* Cinematic loading accent line */}
                <motion.div 
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 1.2, ease: "easeInOut" }}
                  className="w-32 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-[#781625] to-transparent mt-8"
                />

                {/* Subtext */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="mt-6 font-sans text-[0.55rem] uppercase tracking-[0.3em] text-white/40"
                >
                  Premium Tailoring · Accra
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
