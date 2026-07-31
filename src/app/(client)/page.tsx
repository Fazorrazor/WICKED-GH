"use client";

import Image from "next/image";
import { TransitionLink } from "@/components/TransitionProvider";
import { HeroVideoBackground } from "@/components/home/HeroVideoBackground";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: i * 0.1 },
  }),
};

export default function Home() {
  return (
    <main className="relative w-full bg-[#050505] text-white overflow-hidden">

      {/* 1. THE HERO (Cinematic Full Bleed) */}
      <section className="relative w-full h-[100svh] overflow-hidden">
        <HeroVideoBackground />
        
        {/* Subtle overlay to enhance text readability over video */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 md:pb-32 z-20 pointer-events-none">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="flex flex-col items-center gap-6 pointer-events-auto"
          >
            <h2 className="font-sans text-[32px] md:text-[48px] font-bold text-white text-center leading-tight">
              Women's Fall/Winter 2026
            </h2>
            <div className="flex gap-4">
              <TransitionLink href="/collection">
                <button className="bg-[#781625] text-white px-8 py-3.5 font-sans text-[13px] md:text-[14px] font-bold hover:bg-[#9c1c30] transition-colors">
                  Discover
                </button>
              </TransitionLink>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. MERCHANDISING GRID (Strict Editorial Layout - Night Luxe) */}
      <section className="w-full border-t border-white/10">
        {/* Section Header */}
        <div className="w-full flex justify-between items-center px-5 md:px-12 py-8 border-b border-white/10 bg-[#050505]">
          <h3 className="font-sans text-[20px] md:text-[24px] font-bold text-white">
            Latest Arrivals
          </h3>
          <TransitionLink href="/collection" className="font-sans text-[13px] md:text-[14px] font-bold text-white/70 hover:text-white transition-colors underline underline-offset-4">
            View all
          </TransitionLink>
        </div>

        {/* 4-Column Grid with Hairline Borders */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10">
          {[
            { cat: "Evening Gowns", img: "/garments/emerald_solo.png", title: "Emerald Silk Gown" },
            { cat: "Mini Dresses", img: "/garments/crystal_solo.png", title: "Crystal Embellished Mini" },
            { cat: "Two-Piece Sets", img: "/garments/turquoise_solo.png", title: "Turquoise Silk Two-Piece" },
            { cat: "Corsets & Tops", img: "/garments/velvet_solo.png", title: "Velvet Corset Top" },
          ].map((item, i) => (
            <div key={i} className="bg-[#050505] relative group flex flex-col aspect-[3/4] overflow-hidden">
              <TransitionLink href={`/collection?category=${item.cat}`} className="flex-1 w-full h-full relative">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
                />
              </TransitionLink>
              
              {/* Product Info Block (Solid, no messy gradients) */}
              <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-[#0a0a0a]/80 backdrop-blur-md border-t border-white/5">
                <span className="font-sans text-[13px] md:text-[14px] font-bold text-white block">
                  {item.title}
                </span>
                <span className="font-sans text-[11px] md:text-[12px] text-[#781625] uppercase tracking-wider font-semibold mt-1 block">
                  {item.cat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CAMPAIGN BREAK */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 border-y border-white/10 bg-[#050505]">
        <div className="relative aspect-square md:aspect-auto md:h-[80vh] border-b md:border-b-0 md:border-r border-white/10 bg-[#0a0a0a] overflow-hidden">
          <Image
            src="/garments/hero-cinematic.png"
            alt="Campaign"
            fill
            className="object-cover object-center opacity-80"
          />
        </div>
        <div className="flex flex-col justify-center items-center text-center p-12 md:p-24 bg-[#050505]">
          <h3 className="font-sans text-[28px] md:text-[36px] font-bold text-white mb-6">
            The Night Luxe Collection
          </h3>
          <p className="font-sans text-[14px] md:text-[15px] text-white/60 max-w-md mx-auto mb-10 leading-relaxed">
            A radical shift in luxury. Discover garments built for the bold, featuring deep burgundy hues and uncompromising structure that define unapologetic glamour.
          </p>
          <TransitionLink href="/collection">
            <button className="bg-white text-[#050505] px-10 py-4 font-sans text-[13px] md:text-[14px] font-bold hover:bg-white/80 transition-colors">
              Explore Campaign
            </button>
          </TransitionLink>
        </div>
      </section>

      {/* 4. UTILITY FOOTER */}
      <footer className="w-full bg-[#0a0a0a] py-16 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          
          <div className="flex flex-col gap-6 w-full md:w-1/3">
            <img src="/logo-accent.png" alt="Wicked" className="h-8 md:h-10 w-auto object-contain object-left opacity-90" />
            <p className="font-sans text-[13px] md:text-[14px] text-white/50 leading-relaxed max-w-sm">
              Premium tailoring and uncompromising design. Born in Accra, worn globally.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-16 md:gap-24 w-full md:w-auto">
            <div className="flex flex-col gap-4">
              <span className="font-sans text-[14px] md:text-[15px] font-bold text-white">Boutique</span>
              {["Evening Gowns", "Mini Dresses", "Two-Piece Sets", "Accessories"].map(c => (
                <TransitionLink key={c} href={`/collection?category=${c}`} className="font-sans text-[13px] md:text-[14px] text-white/50 hover:text-[#781625] transition-colors">{c}</TransitionLink>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-sans text-[14px] md:text-[15px] font-bold text-white">Client Services</span>
              {[{ label: "Contact Us", href: "#" }, { label: "Shipping & Returns", href: "#" }, { label: "Track Order", href: "#" }, { label: "FAQ", href: "#" }].map(l => (
                <a key={l.label} href={l.href} className="font-sans text-[13px] md:text-[14px] text-white/50 hover:text-[#781625] transition-colors">{l.label}</a>
              ))}
            </div>
          </div>
          
        </div>
        
        <div className="max-w-screen-2xl mx-auto mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-sans text-[12px] md:text-[13px] text-white/30">
            © {new Date().getFullYear()} Wicked. All rights reserved.
          </span>
          <div className="flex gap-6">
             <a href="#" className="font-sans text-[12px] md:text-[13px] text-white/30 hover:text-white">Privacy Policy</a>
             <a href="#" className="font-sans text-[12px] md:text-[13px] text-white/30 hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
