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

const getBentoLayout = (
  index: number,
  totalItems: number,
  isViewAll: boolean,
) => {
  let gridClass = "col-span-1 md:col-span-1 row-span-1";
  let aspectClass = "aspect-[4/5]";

  if (isViewAll) {
    const maxCompleteBlocks = Math.floor(totalItems / 5);
    const blockIndex = Math.floor(index / 5);
    const indexInBlock = index % 5;

    if (blockIndex < maxCompleteBlocks) {
      const isLeftBlock = blockIndex % 2 === 0;
      if (isLeftBlock && indexInBlock === 0) {
        gridClass = "col-span-2 row-span-1 md:col-span-2 md:row-span-2";
        aspectClass = "aspect-[16/9] md:aspect-auto md:flex-1";
      } else if (!isLeftBlock && indexInBlock === 2) {
        gridClass =
          "col-span-2 row-span-1 md:col-span-2 md:row-span-2 md:col-start-3";
        aspectClass = "aspect-[16/9] md:aspect-auto md:flex-1";
      }
    } else {
      const remItems = totalItems - maxCompleteBlocks * 5;
      if (totalItems % 2 !== 0 && index === totalItems - 1) {
        gridClass = gridClass.replace("col-span-1", "col-span-2");
      }
      if (remItems === 1 && index === totalItems - 1) {
        gridClass = gridClass.replace("md:col-span-1", "md:col-span-4");
      } else if (remItems === 2 && index >= totalItems - 2) {
        gridClass = gridClass.replace("md:col-span-1", "md:col-span-2");
      } else if (remItems === 3 && index === totalItems - 1) {
        gridClass = gridClass.replace("md:col-span-1", "md:col-span-2");
      }
    }
  } else {
    // Standard logic for category views
    const remMobile = totalItems % 2;
    if (remMobile === 1 && index === totalItems - 1) {
      gridClass = gridClass.replace("col-span-1", "col-span-2");
    }

    const remDesktop = totalItems % 4;
    if (remDesktop === 1 && index === totalItems - 1) {
      // Cap at col-span-2 — never stretch a lone card full-width
      gridClass = gridClass.replace("md:col-span-1", "md:col-span-2");
    } else if (remDesktop === 2 && index >= totalItems - 2) {
      gridClass = gridClass.replace("md:col-span-1", "md:col-span-2");
    } else if (remDesktop === 3 && index === totalItems - 1) {
      gridClass = gridClass.replace("md:col-span-1", "md:col-span-2");
    }
  }

  return {
    gridClass: `${gridClass} border-r border-b border-black/5`,
    aspectClass,
  };
};

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
      {/* PREMIUM STICKY CATEGORY NAV */}
      <div className="w-full sticky top-[55px] md:top-[70px] z-[70] bg-[#FDFDFD] border-b border-black/10 px-5 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-300">
         <div className="flex w-full md:w-auto overflow-x-auto scrollbar-hide gap-8 items-center px-2">
            {["View All", "Outerwear", "Jackets", "Shirts", "Knitwear", "Pants", "Accessories"].map(cat => (
               <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 font-sans text-[9px] md:text-[10px] font-semibold tracking-[0.3em] uppercase transition-colors pb-1 ${
                     activeCategory === cat || (!activeCategory && cat === "View All")
                     ? "text-[#121212] border-b border-[#781625]"
                     : "text-[#121212]/40 hover:text-[#121212]"
                  }`}
               >
                  {cat}
               </button>
            ))}
         </div>
         
         <div className="flex items-center justify-end w-full md:w-auto shrink-0 mt-2 md:mt-0 px-2 md:px-0">
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#121212]/30">{filteredProducts.length} Pieces</span>
         </div>
      </div>

      {/* THE SHOWROOM GRID */}
      <section className="w-full pb-24 mt-4">
        {/* Editorial Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 px-0 bg-[#FDFDFD]">
          {filteredProducts.map((item, index) => {
            const isViewAll =
              !activeCategory ||
              activeCategory === "All" ||
              activeCategory === "View All";
            const { gridClass, aspectClass } = getBentoLayout(
              index,
              filteredProducts.length,
              isViewAll,
            );
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
                className={`w-full h-full flex flex-col ${gridClass}`}
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
                    priority={index < 2}
                    aspectClass={aspectClass}
                    className="flex-1"
                  />
                </TransitionLink>
              </motion.div>
            );
          })}
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
