"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard",  href: "/store-management" },
  { name: "Clientele",  href: "/store-management/clientele" },
  { name: "Catalog",    href: "/store-management/archive" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 py-8 flex flex-col gap-1">
      {navItems.map((item) => {
        const isDashboard = item.href === "/store-management";
        const isActive = isDashboard
          ? pathname === "/store-management" ||
            pathname.startsWith("/store-management/commissions")
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`relative flex items-center gap-3 px-4 py-3 text-[0.65rem] tracking-[0.2em] uppercase font-semibold transition-all duration-200 rounded-[2px] ${
              isActive
                ? "text-white bg-[#781625]/25 border-l-2 border-[#9c1c30]"
                : "text-white/30 hover:text-white/70 hover:bg-white/5 border-l-2 border-transparent"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
