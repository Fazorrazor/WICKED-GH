import Link from "next/link";
import { logout } from "../login/actions";
import { SidebarNav } from "@/components/store-management/SidebarNav";

export default function AtelierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f4f0ee] text-[#1a0a0e] flex font-sans selection:bg-[#781625] selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a0a0e] border-r border-[#781625]/15 flex flex-col fixed h-full z-20">

        {/* Logo area */}
        <div className="px-6 pt-8 pb-6 border-b border-[#781625]/15">
          <Link
            href="/store-management"
            className="block mb-3 opacity-90 hover:opacity-100 transition-opacity"
          >
            <img src="/logo-white.png" alt="Wicked" className="h-8 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#9c1c30] animate-pulse" />
            <span className="text-[0.48rem] font-bold tracking-[0.35em] uppercase text-[#9c1c30]/60">
              Store Management
            </span>
          </div>
        </div>

        {/* Navigation */}
        <SidebarNav />

        {/* Log out */}
        <div className="px-6 py-5 border-t border-[#781625]/15">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 text-[#9c1c30]/40 hover:text-[#9c1c30]/80 transition-colors duration-200 cursor-pointer group w-full"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="font-sans text-[0.58rem] font-bold tracking-[0.25em] uppercase">
                Log Out
              </span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 relative min-h-screen flex flex-col w-full bg-[#f4f0ee]">
        {children}
      </main>
    </div>
  );
}
