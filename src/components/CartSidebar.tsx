"use client";

import { useCartStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { TransitionLink } from "@/components/TransitionProvider";
import { useEffect, useState } from "react";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } =
    useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const total = items.reduce(
    (acc, item) => acc + item.price_cents * item.quantity,
    0,
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] cursor-pointer"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="cart-sidebar fixed top-0 right-0 h-full w-full max-w-[450px] bg-[#0a0a0a] text-white z-[100] shadow-2xl flex flex-col border-l border-white/10"
          >
            {/* Header */}
            <div className="cart-sidebar__header flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-white">
                Your Bag ({items.length})
              </h2>
              <button
                onClick={closeCart}
                className="text-white/60 hover:text-white transition-colors"
              >
                <span className="text-xl font-light">×</span>
              </button>
            </div>

            {/* Items */}
            <div className="cart-sidebar__items flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/40 font-sans text-xs uppercase tracking-widest gap-4">
                  <p>Your bag is empty.</p>
                  <TransitionLink
                    href="/collection"
                    onClick={closeCart}
                    className="text-white border-b border-white/50 pb-1 hover:text-[#781625] hover:border-[#781625] transition-colors"
                  >
                    Continue Shopping
                  </TransitionLink>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-24 h-32 bg-[#050505] shrink-0 border border-white/5">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover opacity-80"
                      />
                    </div>
                    <div className="flex flex-col flex-1 py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-sans text-sm font-light leading-tight">
                          {item.title}
                        </h3>
                        <span className="font-sans text-xs tracking-wider">
                          GH₵{(item.price_cents / 100).toFixed(2)}
                        </span>
                      </div>
                      <p className="font-sans text-[0.6rem] uppercase tracking-widest text-white/50 mb-auto">
                        Var: {item.variationName}
                      </p>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-white/10">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center font-sans text-xs text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="font-sans text-[0.6rem] uppercase tracking-widest text-white/40 hover:text-[#781625] transition-colors border-b border-transparent hover:border-[#781625] pb-0.5"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="cart-sidebar__footer p-6 border-t border-white/10 bg-[#050505]">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-xs font-bold tracking-widest uppercase text-white">
                    Total
                  </span>
                  <span className="font-sans text-lg tracking-wider text-white">
                    GH₵{(total / 100).toFixed(2)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-white text-[#050505] px-8 py-4 flex justify-center font-sans text-[0.7rem] font-bold tracking-[0.2em] uppercase hover:bg-white/80 transition-colors active:scale-[0.98]"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
