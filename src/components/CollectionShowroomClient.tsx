"use client";

import { motion, Variants } from "framer-motion";
import { TransitionLink } from "@/components/TransitionProvider";
import ProductImageCard from "@/components/ProductImageCard";

import { useState, useMemo, useEffect } from "react";
import { useCollectionStore } from "@/store/useCollectionStore";

export type ClientProduct = {
  id: string;
  title: string;
  price_cents: number;
  image_solo_url: string;
  image_worn_url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories?: any;
};

// Simple grid structure instead of bento layout

export default function CollectionShowroomClient({
  initialProducts,
}: {
  initialProducts: ClientProduct[];
}) {
  const [dbProducts] = useState<ClientProduct[]>(initialProducts);
  const { activeCategory, setActiveCategory, setProductCount } =
    useCollectionStore();

  useEffect(() => {
    // Read query parameter on mount to set initial category filter
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat) {
      setTimeout(() => setActiveCategory(cat), 0);
    } else {
      setTimeout(() => setActiveCategory("View All"), 0);
    }
  }, [setActiveCategory]);

  const filteredProducts = useMemo(() => {
    if (!activeCategory || activeCategory === "View All") return dbProducts;
    return dbProducts.filter((p) => p.categories?.name === activeCategory);
  }, [activeCategory, dbProducts]);

  useEffect(() => {
    setProductCount(filteredProducts.length);
  }, [filteredProducts.length, setProductCount]);

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <main className="relative w-full bg-[#FDFDFD] text-[#121212] min-h-screen pt-[55px] md:pt-[70px] flex flex-col">
      {/* PREMIUM CATEGORY NAV & UTILITY BAR */}
      <div className="w-full sticky top-[55px] md:top-[70px] z-[70] bg-[#FDFDFD] flex flex-col transition-all duration-300">
        
        {/* Top: Category List */}
        <div className="w-full border-b border-black/10 px-5 md:px-12 pt-3 flex overflow-x-auto overflow-y-hidden scrollbar-hide gap-6 md:gap-8 items-center">
          <span className="shrink-0 font-sans text-[12px] md:text-[13px] font-bold text-[#121212] mr-2 pb-3">Ready to wear</span>
          {["View all", "Evening gowns", "Mini dresses", "Two-piece sets", "Jumpsuits", "Corsets & tops", "Accessories"].map(cat => {
             const normalizedCat = cat.toLowerCase() === "view all" ? "View All" : 
                                   cat.toLowerCase() === "evening gowns" ? "Evening Gowns" :
                                   cat.toLowerCase() === "mini dresses" ? "Mini Dresses" :
                                   cat.toLowerCase() === "two-piece sets" ? "Two-Piece Sets" :
                                   cat.toLowerCase() === "jumpsuits" ? "Jumpsuits" :
                                   cat.toLowerCase() === "corsets & tops" ? "Corsets & Tops" : "Accessories";
                                   
             const isActive = activeCategory === normalizedCat || (!activeCategory && normalizedCat === "View All");
             
             return (
               <button
                  key={cat}
                  onClick={() => setActiveCategory(normalizedCat)}
                  className={`shrink-0 font-sans text-[12px] md:text-[13px] transition-all pb-3 border-b-2 -mb-[1px] ${
                     isActive
                     ? "text-[#121212] font-bold border-[#121212]"
                     : "text-[#121212]/60 font-medium border-transparent hover:text-[#121212]"
                  }`}
               >
                  {cat}
               </button>
             );
          })}
        </div>
        
        {/* Bottom: Utility / Filter Bar */}
        <div className="w-full border-b border-black/10 px-5 md:px-12 py-2.5 flex justify-between items-center bg-[#FDFDFD]">
          {/* Left: Product Count */}
          <span className="font-sans text-[11px] md:text-[12px] text-[#121212]/60 font-medium uppercase">
            {filteredProducts.length} PRODUCTS
          </span>
          
          {/* Right: Filters & Sort */}
          <div className="flex items-center gap-2">
            <button className="font-sans text-[11px] md:text-[12px] text-[#121212] font-bold hover:opacity-70 transition-opacity uppercase">
              FILTERS
            </button>
            <span className="font-sans text-[11px] md:text-[12px] text-[#121212] mx-1 font-bold">·</span>
            <button className="font-sans text-[11px] md:text-[12px] text-[#121212] font-bold hover:opacity-70 transition-opacity flex items-center gap-1 uppercase">
              SORT BY: SUGGESTED
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* THE SHOWROOM GRID */}
      <section className="w-full pb-24 mt-0">
        {/* Simple 4-column Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-black/10">
          {filteredProducts.map((item, index) => {
            return (
              <motion.div
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                      delay: (index % 4) * 0.05,
                    },
                  },
                }}
                className="w-full flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-158px)]"
              >
                <TransitionLink
                  href={`/collection/${item.id}`}
                  className="h-full flex flex-col"
                >
                  <ProductImageCard
                    title={item.title}
                    price={"$" + (item.price_cents / 100).toFixed(2)}
                    imageSoloUrl={item.image_solo_url}
                    imageWornUrl={item.image_worn_url}
                    startWithWorn={false}
                    index={index}
                    priority={index < 4}
                    aspectClass="flex-1"
                    className="flex-1"
                  />
                </TransitionLink>
              </motion.div>
            );
          })}
        </div>
        
        {/* Optional Load More */}
        <div className="w-full flex justify-center mt-16 md:mt-24">
           <button className="font-sans text-[0.65rem] tracking-[0.2em] font-semibold uppercase border-b border-black/30 pb-1 text-[#121212] hover:border-black transition-colors">
              Load More
           </button>
        </div>
      </section>

      {/* ATELIER INTERMISSION */}
      <section className="w-full py-32 border-t border-black/10 text-center flex flex-col items-center bg-[#FAFAFA]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-2xl px-6"
        >
          <motion.span
            variants={fadeUpVariant}
            className="font-sans text-xs tracking-[0.3em] uppercase mb-6 font-bold block text-[#781625]"
          >
            The Process
          </motion.span>
          <motion.h3
            variants={fadeUpVariant}
            className="font-display font-bold text-2xl md:text-4xl uppercase leading-tight mb-8"
          >
            Every piece is cut exclusively to the measurements you provide.
          </motion.h3>
          <motion.div variants={fadeUpVariant}>
            <TransitionLink
              href="/about"
              className="inline-block border border-[#781625]/50 px-8 py-4 font-sans text-[0.65rem] font-semibold tracking-[0.2em] uppercase hover:bg-[#781625] hover:text-white transition-colors"
            >
              Discover Craftsmanship
            </TransitionLink>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
