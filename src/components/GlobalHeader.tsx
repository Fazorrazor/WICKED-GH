"use client";

import Image from "next/image";
import { TransitionLink } from "@/components/TransitionProvider";
import { useCollectionStore } from "@/store/useCollectionStore";
import { useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store";

// You will need to pass the setIsSidebarOpen function or manage sidebar state globally.
// For now, let's assume we can dispatch a custom event to open the sidebar.
export const openSidebar = () => {
  window.dispatchEvent(new Event("open-sidebar"));
};

export default function GlobalHeader() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoReady, setIsLogoReady] = useState(false);

  const router = useRouter();
  const { activeCategory, setActiveCategory, productCount } =
    useCollectionStore();
  const { items, openCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const isHomePage = pathname === "/";
  const isCollectionPage = pathname === "/collection";
  const isCheckoutPage = pathname === "/checkout";
  const isPreOrder = pathname.startsWith("/pre-order");
  const isAtelier = pathname.startsWith("/store-management");
  const isPDP =
    pathname.startsWith("/collection/") &&
    pathname.length > "/collection/".length;
  const needsDarkTheme = isScrolled || !isHomePage;
  const hasBackground = isScrolled || isCollectionPage;

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    const delay = !isDev && sessionStorage.getItem("fhgh-loaded") ? 0 : 6000;
    const timer = setTimeout(() => {
      setIsLogoReady(true);
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  if (isPreOrder || isAtelier) return null;

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: isLogoReady ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full flex flex-col z-[80] transition-colors duration-300 ${
        hasBackground
          ? "bg-[#FDFDFD] border-b border-black/10"
          : "bg-transparent"
      }`}
    >
      {/* Top Bar: Logo, Hamburger, Profile */}
      <div className="relative w-full h-[55px] md:h-[70px] px-5 md:px-6 flex justify-between items-center">
        {/* Left Action */}
        {isCheckoutPage ? (
          <TransitionLink
            href="/collection"
            className={`font-sans text-[0.65rem] font-medium tracking-[0.2em] uppercase hover:opacity-60 transition-opacity p-2 -ml-2 pointer-events-auto ${hasBackground ? 'text-[#121212]' : 'text-white'}`}
          >
            [ Back ]
          </TransitionLink>
        ) : isPDP ? (
          <TransitionLink
            href="/collection"
            className={`font-sans text-[0.65rem] font-medium tracking-[0.2em] uppercase hover:opacity-60 transition-opacity p-2 -ml-2 pointer-events-auto ${hasBackground ? 'text-[#121212]' : 'text-white'}`}
          >
            [ Back ]
          </TransitionLink>
        ) : (
          <button
            onClick={openSidebar}
            className="flex flex-col gap-[6px] group p-2 -ml-2 pointer-events-auto"
          >
            <span
              className={`w-6 h-[1px] transition-colors duration-300 group-hover:w-4 ${hasBackground ? 'bg-[#121212]' : (needsDarkTheme ? 'bg-[#121212]' : 'bg-white')}`}
            ></span>
            <span
              className={`w-6 h-[1px] transition-colors duration-300 group-hover:w-3 ${hasBackground ? 'bg-[#121212]' : (needsDarkTheme ? 'bg-[#121212]' : 'bg-white')}`}
            ></span>
          </button>
        )}

        {/* Center Logo */}
        <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center justify-center mt-1">
          <TransitionLink href="/" className="block">
            <img src="/logo-accent.png" alt="Wicked" className="h-8 md:h-10 w-auto object-contain transition-all duration-300" />
          </TransitionLink>
        </motion.div>

        {/* Right Actions */}
        <div className="flex gap-4 md:gap-6 items-center pointer-events-auto">
          {!isCheckoutPage && (
            <>
              {/* Desktop Left Action */}
              {isPDP ? (
                <button
                  className={`hidden md:block font-sans text-[0.65rem] font-medium tracking-[0.2em] uppercase hover:opacity-60 transition-opacity ${hasBackground ? 'text-[#121212]' : (needsDarkTheme ? 'text-[#121212]' : 'text-white')}`}
                >
                  Share
                </button>
              ) : null}
              
              {/* Unified Bag Button (Visible Everywhere except Checkout) */}
              <button
                onClick={openCart}
                className={`hover:opacity-70 transition-opacity flex items-center gap-1.5 ${hasBackground ? 'text-[#121212]' : (needsDarkTheme ? 'text-[#121212]' : 'text-white')}`}
                aria-label="Open Bag"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {totalItems > 0 && (
                  <span className="font-sans text-[0.65rem] font-bold mt-0.5">
                    {totalItems}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </div>


    </motion.nav>
  );
}
