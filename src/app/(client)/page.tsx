"use client";

import Image from "next/image";
import { TransitionLink } from "@/components/TransitionProvider";
import { HeroVideoBackground } from "@/components/home/HeroVideoBackground";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: i * 0.12 },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

export default function Home() {
  const manifestoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: manifestoRef,
    offset: ["start end", "end start"],
  });
  const manifestoY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <main className="relative w-full bg-[#0a0a0a] text-white overflow-hidden">

      {/* ═══════════════════════════════════════════════════
          HERO — Full-Bleed Cinematic
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full h-[100svh] overflow-hidden bg-[#0a0a0a]">
        {/* Full-screen video */}
        <HeroVideoBackground />

        {/* Layered gradient overlays for depth */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 via-transparent to-transparent" />
        </div>

        {/* Hero copy — bottom-left anchored */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="absolute bottom-0 left-0 z-20 px-6 md:px-16 lg:px-24 pb-16 md:pb-24 max-w-3xl"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block font-sans text-[0.6rem] tracking-[0.4em] uppercase text-white/40 mb-6"
          >
            New Collection — 2025
          </motion.span>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display font-bold text-[clamp(3.5rem,10vw,8rem)] leading-[0.92] uppercase text-white mb-8"
          >
            Wicked
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="font-sans font-light text-sm tracking-[0.15em] text-white/50 leading-loose uppercase max-w-sm mb-10"
          >
            Garments built for the bold.<br />
            Stripped of excess. Defined by craft.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex items-center gap-6">
            <TransitionLink href="/collection">
              <span className="group inline-flex items-center gap-3 bg-[#781625] text-white px-8 py-4 font-sans text-[0.7rem] tracking-[0.25em] uppercase font-bold hover:bg-[#9c1c30] transition-colors duration-300">
                Shop Collection
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
                  <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </TransitionLink>
            <TransitionLink
              href="/collection"
              className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-white/40 hover:text-white border-b border-white/20 hover:border-white pb-0.5 transition-colors duration-300"
            >
              View All
            </TransitionLink>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 right-8 md:right-16 z-20 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/30 to-white/60"
          />
          <span className="font-sans text-[0.55rem] tracking-[0.3em] uppercase text-white/30 rotate-90 origin-center translate-y-4">
            Scroll
          </span>
        </motion.div>
      </section>


      {/* ═══════════════════════════════════════════════════
          MARQUEE TICKER — Separator
      ═══════════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden bg-[#781625] py-3 border-y border-[#9c1c30]/50">
        <motion.div
          animate={{ x: [0, -50 + "%"] }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          className="flex whitespace-nowrap gap-0"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="font-sans text-[0.6rem] tracking-[0.35em] uppercase text-white/60 px-10"
            >
              Wicked &nbsp;·&nbsp; Made to Measure &nbsp;·&nbsp; Accra, Ghana &nbsp;·&nbsp; Premium Tailoring &nbsp;·&nbsp;
            </span>
          ))}
        </motion.div>
      </div>


      {/* ═══════════════════════════════════════════════════
          EDITORIAL GRID — Dark
      ═══════════════════════════════════════════════════ */}
      <section className="w-full bg-[#0d0d0d] py-24 md:py-32 px-4 md:px-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Section label */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="flex items-center gap-6 mb-12 md:mb-16"
          >
            <div className="w-8 h-[1px] bg-[#781625]" />
            <motion.span
              variants={fadeUp}
              className="font-sans text-[0.6rem] tracking-[0.4em] uppercase text-white/30"
            >
              The Collection
            </motion.span>
          </motion.div>

          {/* Main grid */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-3">

            {/* Hero product — tall, 5 cols */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp}
              className="col-span-2 md:col-span-5 row-span-2 relative h-[65vw] md:h-auto md:min-h-[85vh] group overflow-hidden"
            >
              <TransitionLink href="/collection?category=Outerwear" className="block h-full">
                <Image
                  src="/garments/hero-cinematic.png"
                  alt="Wicked Outerwear"
                  fill
                  priority
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-[1400ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-10">
                  <span className="font-sans text-[0.55rem] tracking-[0.3em] uppercase text-[#9c1c30] font-bold block mb-2">
                    Outerwear
                  </span>
                  <span className="font-display text-xl md:text-3xl font-light uppercase tracking-wider text-white">
                    The Signature<br />Coat
                  </span>
                </div>
                {/* Hover accent line */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#781625] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </TransitionLink>
            </motion.div>

            {/* Top-right small */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp}
              custom={1}
              className="col-span-1 md:col-span-4 relative h-[45vw] md:h-auto md:min-h-[40vh] group overflow-hidden"
            >
              <TransitionLink href="/collection?category=Jackets" className="block h-full">
                <Image
                  src="/garments/placeholder_product_1.png"
                  alt="Wicked Jackets"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-[1400ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 md:p-6">
                  <span className="font-sans text-[0.5rem] tracking-[0.3em] uppercase text-[#9c1c30] font-bold block mb-1">Jackets</span>
                  <span className="font-display text-sm md:text-base font-light uppercase tracking-wider text-white">Leather Bomber</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#781625] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </TransitionLink>
            </motion.div>

            {/* Top-right text block */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp}
              custom={2}
              className="col-span-1 md:col-span-3 relative h-[45vw] md:h-auto md:min-h-[40vh] bg-[#781625] flex flex-col justify-between p-5 md:p-8"
            >
              <div className="w-6 h-[1px] bg-white/30" />
              <div>
                <p className="font-display text-base md:text-2xl font-light uppercase tracking-wider text-white leading-snug mb-4">
                  Every piece.<br />Measured<br />for you.
                </p>
                <TransitionLink
                  href="/collection"
                  className="inline-flex items-center gap-2 font-sans text-[0.6rem] tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors border-b border-white/20 hover:border-white pb-0.5"
                >
                  Shop Now
                </TransitionLink>
              </div>
            </motion.div>

            {/* Bottom-right large */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp}
              custom={3}
              className="col-span-2 md:col-span-7 relative h-[50vw] md:h-auto md:min-h-[43vh] group overflow-hidden"
            >
              <TransitionLink href="/collection?category=Knitwear" className="block h-full">
                <Image
                  src="/garments/placeholder_product_2.png"
                  alt="Wicked Knitwear"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-[1400ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 md:p-8">
                  <span className="font-sans text-[0.5rem] tracking-[0.3em] uppercase text-[#9c1c30] font-bold block mb-1">Knitwear</span>
                  <span className="font-display text-lg md:text-2xl font-light uppercase tracking-wider text-white">Structured Knit</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#781625] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </TransitionLink>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          MANIFESTO — Full-Width Dark
      ═══════════════════════════════════════════════════ */}
      <section
        ref={manifestoRef}
        className="relative w-full overflow-hidden bg-[#0a0a0a] py-32 md:py-48"
      >
        {/* Parallax BG image */}
        <motion.div
          style={{ y: manifestoY }}
          className="absolute inset-[-15%] z-0"
        >
          <Image
            src="/garments/hero_dark_luxe.png"
            alt=""
            fill
            className="object-cover object-center opacity-[0.08]"
          />
        </motion.div>

        {/* Top rule */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent via-[#781625] to-transparent z-10" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.span
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="inline-block font-sans text-[0.6rem] tracking-[0.4em] uppercase text-[#9c1c30] mb-8"
          >
            Our Mission
          </motion.span>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={1}
            className="font-display font-light text-[clamp(1.8rem,5vw,4rem)] uppercase tracking-[0.1em] leading-[1.2] text-white mb-10"
          >
            "We reject the ordinary.<br />
            We build garments that act<br />
            as armor for the modern world."
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={2}
          >
            <div className="w-8 h-[1px] bg-[#781625] mx-auto mb-8" />
            <TransitionLink
              href="/collection"
              className="inline-flex items-center gap-3 group font-sans text-[0.65rem] tracking-[0.3em] uppercase text-white/40 hover:text-white transition-colors duration-300"
            >
              <span className="w-8 h-[1px] bg-white/20 group-hover:bg-white transition-colors duration-300 group-hover:w-12" />
              Explore the Collection
            </TransitionLink>
          </motion.div>
        </div>

        {/* Bottom rule */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent via-[#781625] to-transparent z-10" />
      </section>




      {/* ═══════════════════════════════════════════════════
          SHOP BY CATEGORY — Image Cards
      ═══════════════════════════════════════════════════ */}
      <section className="w-full bg-[#0a0a0a] border-t border-white/5 py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Section label */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="flex items-center gap-6 mb-10 md:mb-14"
          >
            <div className="w-8 h-[1px] bg-[#781625]" />
            <motion.span
              variants={fadeUp}
              className="font-sans text-[0.6rem] tracking-[0.4em] uppercase text-white/30"
            >
              Shop by Category
            </motion.span>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
            {[
              { cat: "Outerwear",    img: "/garments/placeholder_product_2.png" },
              { cat: "Jackets",      img: "/garments/placeholder_product_1.png" },
              { cat: "Shirts",       img: "/garments/hero-cinematic.png" },
              { cat: "Knitwear",     img: "/garments/placeholder_product_2.png" },
              { cat: "Pants",        img: "/garments/placeholder_product_1.png" },
              { cat: "Accessories",  img: "/garments/detail-cinematic.png" },
            ].map((item, i) => (
              <motion.div
                key={item.cat}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeUp}
                custom={i}
              >
                <TransitionLink
                  href={`/collection?category=${item.cat}`}
                  className="group relative flex flex-col overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#111]">
                    <Image
                      src={item.img}
                      alt={item.cat}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-[1200ms] ease-out grayscale group-hover:grayscale-0 transition-all"
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-[#0a0a0a]/50 group-hover:bg-[#0a0a0a]/20 transition-colors duration-500" />
                    {/* Burgundy bottom accent line */}
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#781625] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                  {/* Label */}
                  <div className="pt-3 pb-1">
                    <span className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-white/40 group-hover:text-white transition-colors duration-300">
                      {item.cat}
                    </span>
                  </div>
                </TransitionLink>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer className="w-full bg-[#060606] border-t border-white/[0.06] pt-16 pb-10 px-6 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          {/* Top: logo + tagline */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-12 border-b border-white/[0.06]">
            <div>
              <img src="/logo-white.png" alt="Wicked" className="h-10 w-auto object-contain mb-3 opacity-80" />
              <p className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-white/20">
                Premium Tailoring · Accra, Ghana
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="flex flex-col gap-3">
                <span className="font-sans text-[0.55rem] tracking-[0.3em] uppercase text-white/20 mb-1">Shop</span>
                {["Outerwear", "Jackets", "Shirts", "Accessories"].map(c => (
                  <TransitionLink key={c} href={`/collection?category=${c}`} className="font-sans text-[0.65rem] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors">{c}</TransitionLink>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-sans text-[0.55rem] tracking-[0.3em] uppercase text-white/20 mb-1">Info</span>
                {[{ label: "About Us", href: "/about" }, { label: "Customer Service", href: "#" }, { label: "Instagram", href: "#" }].map(l => (
                  <a key={l.label} href={l.href} className="font-sans text-[0.65rem] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors">{l.label}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom: copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
            <span className="font-sans text-[0.55rem] tracking-[0.2em] uppercase text-white/15">
              © {new Date().getFullYear()} Wicked. All rights reserved.
            </span>
            <span className="font-sans text-[0.55rem] tracking-[0.2em] uppercase text-white/15">
              Made in Ghana.
            </span>
          </div>
        </div>
      </footer>

    </main>
  );
}
