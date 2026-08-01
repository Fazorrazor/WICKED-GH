"use client";

import React, { createContext, useContext, useState, useEffect, useRef, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type TransitionContextType = {
  navigate: (url: string) => void;
};

const TransitionContext = createContext<TransitionContextType | null>(null);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context)
    throw new Error("useTransition must be used within TransitionProvider");
  return context;
};

// Component to handle route events without opting the whole app into client-side rendering
function TransitionEvents({ 
  setIsTransitioning, 
  currentUrlRef 
}: { 
  setIsTransitioning: (v: boolean) => void;
  currentUrlRef: React.MutableRefObject<string>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsTransitioning(false);
    currentUrlRef.current = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
  }, [pathname, searchParams, setIsTransitioning, currentUrlRef]);

  return null;
}

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentUrlRef = useRef(pathname);

  const navigate = (url: string) => {
    if (currentUrlRef.current === url || url.startsWith(pathname + "#")) return;

    // Trigger the mask animation to drop down
    setIsTransitioning(true);

    // Wait for the curtain to drop (800ms) before physically pushing the route.
    // The curtain will stay down while router.push blocks for server data, 
    // and will only lift when the useEffect above fires.
    setTimeout(() => {
      router.push(url);
    }, 800);
  };

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      
      <Suspense fallback={null}>
        <TransitionEvents 
          setIsTransitioning={setIsTransitioning} 
          currentUrlRef={currentUrlRef} 
        />
      </Suspense>

      {/* KINETIC NAVIGATION MASK */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="mask"
            initial={{ x: "-100%" }} // Elegant wipe from left
            animate={{ x: 0 }}
            exit={{ x: "100%" }} // Wipe to right
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0a0a0a] border-r-4 border-[#781625]/80"
          >
            <div className="flex overflow-hidden relative pb-10">
              {/* Text Logo for Transition */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <img src="/logo-accent.png" alt="Wicked" className="h-12 md:h-16 w-auto object-contain" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

// Custom Link component to intercept navigation and trigger the mask
export function TransitionLink({
  href,
  children,
  className,
  onClick,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { navigate } = useTransition();

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
        if (onClick) onClick(e);
      }}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
