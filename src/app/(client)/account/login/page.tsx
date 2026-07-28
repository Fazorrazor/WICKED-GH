"use client";

import { login, signup } from "./actions";
import { useState, use } from "react";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = use(searchParams);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-black rounded-full blur-[150px] opacity-[0.03] pointer-events-none"></div>

      <div className="w-full max-w-sm relative z-10 flex flex-col items-center mt-12">
        <h1 className="text-[#121212] font-sans text-xl font-bold tracking-[0.2em] uppercase mb-2">
          {isLogin ? "Sign In" : "Create Account"}
        </h1>
        <p className="text-[#121212]/40 text-[0.65rem] uppercase tracking-widest mb-10">
          {isLogin
            ? "Access your customer profile"
            : "Register for an account"}
        </p>

        <form className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[#121212]/60 text-[0.65rem] font-bold uppercase tracking-widest"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="bg-transparent border border-black/20 p-3 font-sans text-sm text-[#121212] outline-none focus:border-[#781625] transition-colors [&:-webkit-autofill]:shadow-[0_0_0_30px_#FDFDFD_inset] [&:-webkit-autofill]:text-fill-[#121212]"
              style={{ WebkitTextFillColor: "#121212" }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[#121212]/60 text-[0.65rem] font-bold uppercase tracking-widest"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="bg-transparent border border-black/20 p-3 font-sans text-sm text-[#121212] outline-none focus:border-[#781625] transition-colors [&:-webkit-autofill]:shadow-[0_0_0_30px_#FDFDFD_inset] [&:-webkit-autofill]:text-fill-[#121212]"
              style={{ WebkitTextFillColor: "#121212" }}
            />
          </div>

          {params.error && (
            <div className="text-[#781625] text-xs font-sans mt-2 tracking-wide font-bold text-center">
              {params.error}
            </div>
          )}

          {params.message && (
            <div className="text-[#121212]/80 border border-black/20 bg-black/5 p-3 text-xs font-sans mt-2 tracking-wide text-center">
              {params.message}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-4">
            <button
              formAction={isLogin ? login : signup}
              className="w-full bg-[#121212] text-white p-4 font-sans text-[0.75rem] font-bold tracking-[0.2em] uppercase hover:bg-[#781625] transition-colors"
            >
              {isLogin ? "Sign In" : "Register"}
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#121212]/50 text-[0.65rem] uppercase tracking-widest hover:text-[#121212] transition-colors underline underline-offset-4 decoration-black/20 hover:decoration-black/50"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
