"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { TransitionLink } from "@/components/TransitionProvider";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleOpenSidebar = () => setIsSidebarOpen(true);
    window.addEventListener("open-sidebar", handleOpenSidebar);
    return () => window.removeEventListener("open-sidebar", handleOpenSidebar);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/80 z-[110] backdrop-blur-md"
            onClick={() => setIsSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="main-sidebar fixed top-0 left-0 w-full md:w-[400px] h-full bg-[#FAFAFA] border-r border-black/10 text-[#121212] z-[120] flex flex-col overflow-y-auto shadow-2xl"
          >
            <div className="main-sidebar__container w-full h-full flex flex-col px-8 md:px-12 py-12 md:py-20 relative">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-8 right-8 md:top-10 md:right-10 text-[0.65rem] font-sans font-bold tracking-[0.2em] uppercase text-[#121212] hover:text-[#781625] transition-colors z-10"
              >
                [ Close ]
              </button>

              <div className="main-sidebar__menu flex flex-col gap-12 mt-12 md:mt-8">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-10"
                >
                  {/* Primary Link */}
                  <motion.div variants={fadeUpVariant} className="group flex flex-col items-start">
                    <TransitionLink
                      onClick={() => setIsSidebarOpen(false)}
                      href="/collection"
                      className="font-display font-light text-3xl uppercase tracking-widest text-[#121212] hover:text-[#781625] transition-colors block"
                    >
                      Shop
                    </TransitionLink>
                    <div className="flex flex-col gap-4 mt-6">
                      {[
                        "Outerwear",
                        "Jackets",
                        "Shirts",
                        "Knitwear",
                        "Pants",
                        "Accessories",
                      ].map((cat) => (
                        <TransitionLink
                          key={cat}
                          onClick={() => setIsSidebarOpen(false)}
                          href={`/collection?category=${cat}`}
                          className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#121212]/50 hover:text-[#121212] transition-colors"
                        >
                          {cat}
                        </TransitionLink>
                      ))}
                    </div>
                  </motion.div>

                  {/* Secondary Link */}
                  <motion.div variants={fadeUpVariant} className="group">
                    <TransitionLink
                      onClick={() => setIsSidebarOpen(false)}
                      href="/store-management"
                      className="font-display font-light text-3xl uppercase tracking-widest text-[#121212] hover:text-[#781625] transition-colors block"
                    >
                      Store Login
                    </TransitionLink>
                  </motion.div>
                  
                  {/* Tertiary Links */}
                  <motion.div variants={fadeUpVariant} className="pt-8 mt-2 border-t border-black/10 flex flex-col gap-4">
                    <TransitionLink onClick={() => setIsSidebarOpen(false)} href="/about" className="font-sans text-xs tracking-[0.2em] uppercase text-[#121212]/60 hover:text-[#121212] transition-colors">About Us</TransitionLink>
                    <TransitionLink onClick={() => setIsSidebarOpen(false)} href="#" className="font-sans text-xs tracking-[0.2em] uppercase text-[#121212]/60 hover:text-[#121212] transition-colors">Customer Service</TransitionLink>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
