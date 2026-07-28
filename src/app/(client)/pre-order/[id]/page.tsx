"use client";

import { useState } from "react";
import Link from "next/link";
import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";

export default function PreOrderWizard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  const [step, setStep] = useState(1);
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    hips: "",
    inseam: "",
  });

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <main className="relative w-full min-h-[100svh] bg-[#121212] text-[white] flex flex-col items-center justify-center py-24 px-6 overflow-hidden">
      {/* TOP NAV */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-0 w-full px-6 py-8 flex justify-between items-center z-10"
      >
        <Link
          href={`/collection/${resolvedParams.id}`}
          className="font-sans text-[0.65rem] tracking-[0.2em] uppercase hover:text-[white]/70 transition-colors"
        >
          [ Cancel ]
        </Link>
        <span className="font-display font-bold tracking-widest text-sm uppercase">
          Commission
        </span>
        <span className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-[white]/40">
          Step {step}/4
        </span>
      </motion.nav>

      {/* WIZARD CONTAINER */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-xl mx-auto"
      >
        {/* PROGRESS BAR */}
        <motion.div
          variants={fadeUpVariant}
          className="w-full h-[1px] bg-[#050505]/10 mb-16 relative"
        >
          <motion.div
            className="absolute top-0 left-0 h-full bg-[#050505]"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>

        {/* STEP CONTENT WITH ANIMATE PRESENCE FOR SMOOTH CROSSFADES */}
        <AnimatePresence mode="wait">
          {/* STEP 1: AUTHENTICATION / ACCOUNT */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider">
                  Atelier Access
                </h2>
                <p className="font-sans text-xs md:text-sm text-[white]/60 tracking-widest uppercase">
                  Create a profile to securely save your bespoke specs.
                </p>
              </div>

              <div className="flex flex-col gap-6 mt-4">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-[white]/80">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-transparent border-b border-[white]/20 py-3 font-sans text-lg text-[white] focus:outline-none focus:border-[white] transition-colors rounded-none placeholder:text-[white]/20"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-[white]/80">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="bg-transparent border-b border-[white]/20 py-3 font-sans text-lg text-[white] focus:outline-none focus:border-[white] transition-colors rounded-none placeholder:text-[white]/20"
                  />
                </div>
              </div>

              <button
                onClick={handleNext}
                className="mt-8 bg-[#050505] text-[#121212] py-5 font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white transition-colors"
              >
                Authenticate
              </button>
            </motion.div>
          )}

          {/* STEP 2: MEASUREMENTS */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider">
                  Your Specs
                </h2>
                <p className="font-sans text-xs md:text-sm text-[white]/60 tracking-widest uppercase">
                  Precision tailored to your body.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-8 mt-4">
                {["chest", "waist", "hips", "inseam"].map((m) => (
                  <div key={m} className="flex flex-col gap-2">
                    <label className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-[white]/80">
                      {m} (cm)
                    </label>
                    <input
                      type="number"
                      placeholder="0.0"
                      value={measurements[m as keyof typeof measurements]}
                      onChange={(e) =>
                        setMeasurements({
                          ...measurements,
                          [m]: e.target.value,
                        })
                      }
                      className="bg-transparent border-b border-[white]/20 py-3 font-display text-2xl text-[white] focus:outline-none focus:border-[white] transition-colors rounded-none placeholder:text-[white]/10"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handlePrev}
                  className="w-1/3 border border-[white]/20 text-[white] py-5 font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:border-[white] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="w-2/3 bg-[#050505] text-[#121212] py-5 font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white transition-colors"
                >
                  Save to Profile
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SHIPPING */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider">
                  Delivery Details
                </h2>
                <p className="font-sans text-xs md:text-sm text-[white]/60 tracking-widest uppercase">
                  Where should we send the finished piece?
                </p>
              </div>

              <div className="flex flex-col gap-8 mt-4">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-[white]/80">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="bg-transparent border-b border-[white]/20 py-3 font-sans text-lg text-[white] focus:outline-none focus:border-[white] transition-colors rounded-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-[white]/80">
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    className="bg-transparent border-b border-[white]/20 py-3 font-sans text-lg text-[white] focus:outline-none focus:border-[white] transition-colors rounded-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handlePrev}
                  className="w-1/3 border border-[white]/20 text-[white] py-5 font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:border-[white] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="w-2/3 bg-[#050505] text-[#121212] py-5 font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white transition-colors"
                >
                  Review Order
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SUMMARY & PAYMENT */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider">
                  Commission Summary
                </h2>
                <p className="font-sans text-xs md:text-sm text-[white]/60 tracking-widest uppercase">
                  Final review before tailoring begins.
                </p>
              </div>

              <div className="border border-[white]/10 p-6 md:p-8 flex flex-col gap-5 mt-4 bg-[#1A1A1A]/30">
                <div className="flex justify-between items-center border-b border-[white]/10 pb-4">
                  <span className="font-sans text-[0.65rem] tracking-widest text-[white]/80 uppercase">
                    Piece
                  </span>
                  <span className="font-display text-sm md:text-base uppercase text-right">
                    Asymmetric Silk Dress (Bespoke)
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-[white]/10 pb-4">
                  <span className="font-sans text-[0.65rem] tracking-widest text-[white]/80 uppercase">
                    Material
                  </span>
                  <span className="font-display text-sm md:text-base uppercase text-right">
                    Heavyweight Silk
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-sans text-[0.65rem] tracking-widest text-[white]/80 uppercase">
                    Total Deposit
                  </span>
                  <span className="font-display text-3xl md:text-4xl font-bold">
                    $450
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handlePrev}
                  className="w-1/3 border border-[white]/20 text-[white] py-5 font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:border-[white] transition-colors"
                >
                  Back
                </button>
                <button className="w-2/3 bg-[#050505] text-[#121212] py-5 font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white transition-colors flex items-center justify-center gap-3 group">
                  <span>Pay Commission</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
