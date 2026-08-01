"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCartStore } from "@/lib/store";

export type DetailProduct = {
  id: string;
  title: string;
  price_cents: number;
  image_solo_url: string | null;
  image_worn_url: string | null;
  description: string | null;
  sku?: string;
  materials?: string;
  care_instructions?: string;
  our_commitment?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories?: any;
};

function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-black/10 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center font-sans text-[0.65rem] md:text-xs font-bold tracking-widest uppercase hover:opacity-70 transition-opacity"
      >
        <span>{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-[8px] md:text-[10px] text-[#121212]/50"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 font-sans text-xs md:text-sm text-[#121212]/70 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetailClient({
  product,
}: {
  product: DetailProduct;
}) {
  const [selectedVariation] = useState({
    id: "default",
    name: "Standard",
    image: product.image_solo_url,
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const { addItem } = useCartStore();

  const extraImages: Record<string, string[]> = {
    "6ff4e61f-427b-4d72-8060-5f1ff7f12b22": ["/garments/burgundy_detail.png"],
    "8f7e0606-bd47-4287-980f-944e1be0be8b": ["/garments/black_detail.png"],
    "d2f8c163-d14d-4245-a633-89de64f4189a": ["/garments/turquoise_detail.png"],
    "e80dfa33-8daa-4841-a78b-2ee84f9498ea": ["/garments/velvet_detail.png"],
    "a1b0764d-b8e4-42cc-b7f6-f3fb5afcfc26": ["/garments/emerald_detail.png"],
    "7274b7f3-d4a2-4a53-b41f-68c1063a8a52": ["/garments/crystal_detail.png"],
    "8a1c641f-2ca1-4aef-a295-bb3c1d0ac809": ["/garments/jumpsuit_detail.png"],
    "3b1093b1-ad44-45c7-8029-a2497bb3e1fd": ["/garments/ruby_detail.png"],
    "efa8798d-c222-4b45-bed2-48b1d9724d96": ["/garments/onyx_detail.png"],
  };

  const images = [
    product.image_worn_url || "/garments/placeholder_product_1.png",
    ...(extraImages[product.id] || []),
    product.image_solo_url || "/garments/placeholder_product_1.png",
  ];

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setActiveImageIndex(
      (prev) => (prev + newDirection + images.length) % images.length,
    );
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
    }),
    center: {
      zIndex: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
    }),
  };

  // Images array is now defined above to be used in paginate

  return (
    <main className="pdp-wrapper relative w-full bg-[#FDFDFD] text-[#121212] min-h-screen pt-[56px] md:pt-[70px] flex flex-col md:flex-row">
      {/* LEFT: Shuffling Image Gallery */}
      <div className="pdp-gallery w-full md:w-[55%] aspect-[4/5] md:aspect-auto md:h-[calc(100vh-70px)] flex flex-col bg-[#0e0e0e] relative group overflow-hidden shrink-0 border-r border-[#781625]/20">
        {/* Navigation Arrows */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 w-16 h-16 flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
          <span className="text-4xl md:text-5xl font-light">←</span>
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-16 h-16 flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
          <span className="text-4xl md:text-5xl font-light">→</span>
        </button>

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeImageIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1], // Classic hyper-smooth easing
              delay: 0.05,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;

              if (swipe < -10000) {
                paginate(1);
              } else if (swipe > 10000) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          >
            <Image
              src={images[activeImageIndex]}
              alt={`${product.title} view ${activeImageIndex + 1}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Shuffle indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeImageIndex ? "bg-white scale-150" : "bg-white/30"}`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Sticky Product Details */}
      <div className="pdp-details w-full md:w-[45%] relative bg-[#FDFDFD]">
        <div className="pdp-details__scroll-container md:sticky md:top-[70px] w-full md:h-[calc(100vh-70px)] overflow-y-auto flex flex-col px-6 py-12 md:px-12 lg:px-20 pb-32 md:pb-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-[420px] w-full mx-auto md:mx-0 pt-8 md:pt-24 pb-12 md:pb-24"
          >
            {/* Title & Price */}
            <h1 className="font-sans text-2xl md:text-[28px] leading-tight mb-2 font-light text-[#121212] tracking-tight">
              {product.title}
            </h1>
            <div className="font-sans text-sm tracking-widest mb-10 text-[#121212]/80">
              GH₵{(product.price_cents / 100).toFixed(2)}
            </div>

            {/* Variation */}
            {selectedVariation && (
              <div className="mb-10">
                <span className="font-sans text-[0.65rem] tracking-widest text-[#121212]/60 uppercase block mb-3">
                  Variation:{" "}
                  <span className="text-[#121212] font-semibold ml-1">
                    {selectedVariation.name}
                  </span>
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => {}}
                    className={`relative w-12 h-12 p-[2px] rounded-sm transition-all border border-[#121212]`}
                  >
                    <div className="relative w-full h-full bg-[#FAFAFA]">
                      {selectedVariation.image && (
                        <Image
                          src={selectedVariation.image}
                          alt={selectedVariation.name}
                          fill
                          sizes="48px"
                          className="object-cover opacity-80"
                        />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Purchase Button (Fixed Bottom on Mobile) */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-[#FDFDFD] border-t border-black/10 z-50 md:static md:p-0 md:border-none md:bg-transparent md:z-auto">
              <button
                onClick={() => {
                  if (product) {
                    addItem({
                      productId: product.id,
                      title: product.title,
                      price_cents: product.price_cents,
                      variationName: selectedVariation?.name || "Standard",
                      image: product.image_solo_url || "/garments/placeholder_product_1.png",
                    });
                  }
                }}
                className="w-full bg-[#FDFDFD] text-[#121212] border border-[#781625]/50 md:bg-[#121212] md:text-white px-8 py-4 font-sans text-[0.7rem] font-bold tracking-[0.2em] uppercase hover:bg-[#781625] hover:text-white transition-colors active:scale-[0.98] md:mb-12"
              >
                Add to Bag
              </button>
            </div>

            {/* Product Description */}
            <div className="mb-8">
              <h3 className="font-sans text-[0.7rem] font-bold tracking-widest uppercase mb-2">
                Product Description
              </h3>
              <p className="font-sans text-[0.65rem] tracking-wider text-[#121212]/50 mb-4">
                {product.sku
                  ? `STYLE ${product.sku}`
                  : `STYLE ${product.id.split("-")[0].toUpperCase()}`}
              </p>
              <p className="font-sans text-sm leading-relaxed text-[#121212]/80 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Accordions */}
            <div className="mb-12 border-t border-black/10">
              <Accordion title="Product Details">
                <div className="whitespace-pre-wrap font-sans text-xs md:text-sm text-[#121212]/70 leading-relaxed">
                  {product.materials || "Details coming soon."}
                </div>
              </Accordion>
              <Accordion title="Materials & Care">
                <div className="whitespace-pre-wrap font-sans text-xs md:text-sm text-[#121212]/70 leading-relaxed">
                  {product.care_instructions ||
                    "Care instructions coming soon."}
                </div>
              </Accordion>
              <Accordion title="Our Commitment">
                <div className="whitespace-pre-wrap font-sans text-xs md:text-sm text-[#121212]/70 leading-relaxed">
                  {product.our_commitment || "Commitment details coming soon."}
                </div>
              </Accordion>
            </div>

            {/* Breadcrumbs */}
            <div className="font-sans text-[0.55rem] md:text-[0.65rem] text-[#121212]/60 uppercase tracking-widest pt-8 pb-12 flex flex-wrap gap-2">
              {[
                "Men",
                "Ready to Wear",
                product.categories?.name || "Collection",
              ].map((crumb, idx, arr) => (
                <span key={idx} className="flex items-center">
                  <span className="hover:text-[#121212] hover:underline cursor-pointer transition-colors">
                    {crumb}
                  </span>
                  {idx < arr.length - 1 && (
                    <span className="mx-2 text-[#121212]/30">/</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
