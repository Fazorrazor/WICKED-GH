import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="min-h-screen bg-[#1a0a0e] flex flex-col justify-center items-center font-sans p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#781625] rounded-full blur-[180px] opacity-[0.12] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-5">
            <img src="/logo-white.png" alt="Wicked" className="h-12 w-auto object-contain opacity-90" />
          </div>
          <div className="w-8 h-[1px] bg-[#781625] mx-auto mb-4" />
          <p className="text-[0.55rem] font-bold tracking-[0.4em] uppercase text-[#9c1c30]/70">
            Store Management
          </p>
        </div>

        <form className="w-full flex flex-col gap-5" action={login}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[0.6rem] font-bold uppercase tracking-widest text-white/50"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="bg-[#ffffff08] border border-[#781625]/30 p-3.5 font-sans text-sm text-white outline-none focus:border-[#9c1c30] transition-colors placeholder:text-white/20"
              placeholder="your@email.com"
              style={{ WebkitTextFillColor: "white" }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[0.6rem] font-bold uppercase tracking-widest text-white/50"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="bg-[#ffffff08] border border-[#781625]/30 p-3.5 font-sans text-sm text-white outline-none focus:border-[#9c1c30] transition-colors"
              placeholder="••••••••"
              style={{ WebkitTextFillColor: "white" }}
            />
          </div>

          {resolvedSearchParams?.error && (
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[#9c1c30] text-center mt-1">
              {resolvedSearchParams.error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#781625] text-white px-6 py-4 mt-3 text-[0.7rem] font-bold tracking-[0.25em] uppercase hover:bg-[#9c1c30] transition-colors duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
