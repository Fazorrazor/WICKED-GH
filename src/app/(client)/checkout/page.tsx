"use client";


import { useCartStore } from "@/lib/store";
import { useState, useEffect } from "react";
import Image from "next/image";
import { TransitionLink } from "@/components/TransitionProvider";
import { supabase } from "@/lib/supabase";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  const total = items.reduce(
    (acc, item) => acc + item.price_cents * item.quantity,
    0,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const digitalAddress = formData.get("digitalAddress") as string;
      const streetAddress = formData.get("address") as string;
      const combinedAddress = `${digitalAddress} - ${streetAddress}`;

      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const region = formData.get("region") as string;
      const city = formData.get("city") as string;

      // 1. Get current session to link to profile if logged in
      let clientId = null;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        clientId = session?.user?.id || null;
      } catch (sessionErr) {
        console.warn("Could not retrieve session:", sessionErr);
      }

      const fullShippingAddress = [
        `${firstName} ${lastName}`,
        phone,
        combinedAddress,
        `${city}, ${region}`,
        formData.get("notes") ? `Notes: ${formData.get("notes")}` : ""
      ].filter(Boolean).join("\n");

      if (clientId) {
        // Opportunistically update their profile with the latest shipping address
        supabase.from("profiles").update({
          first_name: firstName,
          last_name: lastName,
          shipping_address: fullShippingAddress
        }).eq("id", clientId).then(() => {}).catch(() => {});
      }

      // 2. Insert Order and Items via secure RPC (bypasses RLS read issues)
      // Fallback for older browsers just in case
      const orderId = typeof crypto.randomUUID === 'function' 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      const { error } = await supabase.rpc("submit_inquiry", {
        p_id: orderId,
        p_client_id: clientId,
        p_email: email,
        p_shipping_address: fullShippingAddress,
        p_total_cents: total,
        p_items: items.map(item => ({
          product_id: item.productId,
          price_cents: item.price_cents,
          quantity: item.quantity
        }))
      } as any);

      if (error) {
        console.error("Error submitting inquiry:", error);
        alert("There was an error submitting your request. Please try again.");
        return;
      }

      // 3. Send Email Confirmation (Fire and Forget to prevent blocking)
      fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          firstName: firstName,
          orderId: orderId,
          totalCents: total
        })
      }).catch(err => console.error("Failed to trigger email confirmation:", err));

      setIsSuccess(true);
      clearCart();
    } catch (err) {
      console.error("Unexpected error during submission:", err);
      alert("An unexpected error occurred while processing your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (isSuccess) {
    return (
      <div className="min-h-[100dvh] bg-[#FDFDFD] pt-32 pb-20 px-6 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Lottie Overlay */}
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="w-[500px] h-[500px]">
            <DotLottieReact
              src="https://lottie.host/d9cd8a9e-f63e-4241-894a-97d12badb7ce/u6uw7nBoTz.json"
              loop
              autoplay
            />
          </div>
        </div>

        <div className="max-w-md w-full text-center flex flex-col items-center z-10 text-[#121212]">
          <div className="w-16 h-16 border border-black/20 rounded-full flex items-center justify-center mb-8 bg-[#FAFAFA]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1 className="font-sans text-2xl md:text-3xl font-light tracking-wide mb-4">
            Inquiry Received
          </h1>
          <p className="font-sans text-sm font-light leading-relaxed text-[#121212]/60 mb-12">
            Thank you for your interest. Our team has received your request.
            We will review your selections and contact you via email
            within 24 hours to discuss custom measurements and final pricing.
          </p>
          <TransitionLink
            href="/collection"
            className="border-b border-[#121212] pb-1 font-sans text-xs uppercase tracking-[0.2em] hover:opacity-60 transition-opacity"
          >
            Return to Shop
          </TransitionLink>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[100dvh] bg-[#FDFDFD] pt-32 pb-20 px-6 flex flex-col items-center justify-center text-[#121212]">
        <h1 className="font-sans text-xl font-light tracking-widest uppercase mb-6">
          Your bag is empty
        </h1>
        <TransitionLink
          href="/collection"
          className="border-b border-[#121212] pb-1 font-sans text-xs uppercase tracking-[0.2em] hover:opacity-60 transition-opacity"
        >
          Explore Shop
        </TransitionLink>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FDFDFD] text-[#121212] pt-24 pb-16 px-5 md:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left Side: Order Summary */}
        <div className="w-full lg:w-5/12 flex flex-col order-2 lg:order-1 lg:sticky lg:top-24 h-fit isolate">
          <h2 className="font-sans text-xs font-bold tracking-[0.2em] uppercase border-b border-black/10 pb-3 mb-5">
            Order Summary
          </h2>

          <div className="flex flex-col gap-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 group">
                <div className="relative w-24 h-32 bg-white shrink-0 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="flex flex-col py-1 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-sans text-sm font-light leading-tight pr-4">
                      {item.title}
                    </h3>
                    <span className="font-sans text-xs tracking-wider whitespace-nowrap">
                      GH₵{(item.price_cents / 100).toFixed(2)}
                    </span>
                  </div>
                  <p className="font-sans text-[0.65rem] uppercase tracking-widest text-[#121212]/60 mb-auto">
                    Variant: {item.variationName}
                  </p>
                  <p className="font-sans text-[0.65rem] tracking-wider text-[#121212]/60">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-black/10 pt-4 mt-1">
            <div className="flex justify-between items-center">
              <span className="font-sans text-xs uppercase tracking-widest">
                Estimated Total
              </span>
              <span className="font-sans text-lg tracking-wider">
                GH₵{(total / 100).toFixed(2)}
              </span>
            </div>
            <p className="font-sans text-[0.65rem] text-[#121212]/60 mt-4 leading-relaxed">
              * This is an estimated cost. Final pricing may vary based on
              custom material selection and tailoring modifications.
              Shipping and taxes will be calculated during the final invoice
              phase.
            </p>
          </div>
        </div>

        {/* Right Side: Inquiry Form */}
        <div className="w-full lg:w-7/12 order-1 lg:order-2">
          <h1 className="font-sans text-3xl md:text-4xl font-light tracking-wide mb-8">
            Your Details
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="firstName"
                  className="font-sans text-[0.65rem] font-bold uppercase tracking-widest"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="bg-[#FAFAFA] border border-black/10 p-3 font-sans text-sm outline-none focus:border-[#781625] transition-colors rounded-none text-[#121212]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="lastName"
                  className="font-sans text-[0.65rem] font-bold uppercase tracking-widest"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="bg-[#FAFAFA] border border-black/10 p-3 font-sans text-sm outline-none focus:border-[#781625] transition-colors rounded-none text-[#121212]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="font-sans text-[0.65rem] font-bold uppercase tracking-widest"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="bg-[#FAFAFA] border border-black/10 p-3 font-sans text-sm outline-none focus:border-[#781625] transition-colors rounded-none text-[#121212]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="phone"
                className="font-sans text-[0.65rem] font-bold uppercase tracking-widest"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                placeholder="e.g. 024 123 4567"
                className="bg-[#FAFAFA] border border-black/10 p-3 font-sans text-sm outline-none focus:border-[#781625] transition-colors rounded-none placeholder:text-[#121212]/30 text-[#121212]"
              />
            </div>

            {/* Delivery Details (Ghana Specific) */}
            <div className="pt-8 mt-4 border-t border-black/10">
              <h2 className="font-sans text-xs font-bold tracking-[0.2em] uppercase mb-5">
                Delivery Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="region"
                    className="font-sans text-[0.65rem] font-bold uppercase tracking-widest"
                  >
                    Region *
                  </label>
                  <select
                    id="region"
                    name="region"
                    required
                    defaultValue=""
                    className="bg-[#FAFAFA] border border-black/10 p-3 font-sans text-sm outline-none focus:border-[#781625] transition-colors rounded-none appearance-none cursor-pointer text-[#121212]"
                  >
                    <option className="bg-white text-[#121212]" value="" disabled>
                      Select Region
                    </option>
                    <option className="bg-white text-[#121212]" value="Greater Accra">Greater Accra</option>
                    <option className="bg-white text-[#121212]" value="Ashanti">Ashanti</option>
                    <option className="bg-white text-[#121212]" value="Western">Western</option>
                    <option className="bg-white text-[#121212]" value="Central">Central</option>
                    <option className="bg-white text-[#121212]" value="Eastern">Eastern</option>
                    <option className="bg-white text-[#121212]" value="Volta">Volta</option>
                    <option className="bg-white text-[#121212]" value="Northern">Northern</option>
                    <option className="bg-white text-[#121212]" value="Upper East">Upper East</option>
                    <option className="bg-white text-[#121212]" value="Upper West">Upper West</option>
                    <option className="bg-white text-[#121212]" value="Bono">Bono</option>
                    <option className="bg-white text-[#121212]" value="Bono East">Bono East</option>
                    <option className="bg-white text-[#121212]" value="Ahafo">Ahafo</option>
                    <option className="bg-white text-[#121212]" value="Savannah">Savannah</option>
                    <option className="bg-white text-[#121212]" value="North East">North East</option>
                    <option className="bg-white text-[#121212]" value="Oti">Oti</option>
                    <option className="bg-white text-[#121212]" value="Western North">Western North</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="city"
                    className="font-sans text-[0.65rem] font-bold uppercase tracking-widest"
                  >
                    City / Town *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    className="bg-[#FAFAFA] border border-black/10 p-3 font-sans text-sm outline-none focus:border-[#781625] transition-colors rounded-none text-[#121212]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-5">
                <label
                  htmlFor="digitalAddress"
                  className="font-sans text-[0.65rem] font-bold uppercase tracking-widest flex justify-between"
                >
                  <span>Ghana Digital Address (GhanaPostGPS) *</span>
                </label>
                <input
                  type="text"
                  id="digitalAddress"
                  name="digitalAddress"
                  required
                  placeholder="e.g. GA-123-4567"
                  className="bg-[#FAFAFA] border border-black/10 p-3 font-sans text-sm outline-none focus:border-[#781625] transition-colors rounded-none placeholder:text-[#121212]/30 uppercase text-[#121212]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="address"
                  className="font-sans text-[0.65rem] font-bold uppercase tracking-widest"
                >
                  Street Address & Nearest Landmark *
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={2}
                  placeholder="e.g. Next to the blue pharmacy, Off Spintex Road..."
                  className="bg-[#FAFAFA] border border-black/10 p-4 font-sans text-sm outline-none focus:border-[#781625] transition-colors resize-none rounded-none placeholder:text-[#121212]/30 mt-1 text-[#121212]"
                ></textarea>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-8 mt-4 border-t border-black/10">
              <label
                htmlFor="notes"
                className="font-sans text-[0.65rem] font-bold uppercase tracking-widest flex justify-between"
              >
                <span>Custom Notes / Measurements</span>
                <span className="text-[#121212]/40 font-normal">Optional</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Include specific measurements or customization requests..."
                className="bg-[#FAFAFA] border border-black/10 p-4 font-sans text-sm outline-none focus:border-[#781625] transition-colors resize-none rounded-none placeholder:text-[#121212]/30 text-[#121212]"
              ></textarea>
            </div>

            <div className="flex items-start gap-3 mt-2">
              <input
                type="checkbox"
                id="consent"
                required
                className="mt-1 accent-black rounded-none shrink-0"
              />
              <label
                htmlFor="consent"
                className="font-sans text-[0.65rem] text-[#121212]/60 leading-relaxed cursor-pointer"
              >
                I agree that submitting this form does not constitute a final
                purchase. An artisan will contact me to finalize measurements,
                timeline, and payment.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 bg-[#781625] text-white px-8 py-4 flex justify-center items-center font-sans text-[0.75rem] font-bold tracking-[0.2em] uppercase hover:bg-[#781625]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
