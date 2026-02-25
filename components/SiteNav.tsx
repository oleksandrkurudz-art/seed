"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Dashboard" },
  { href: "/stats", label: "Stats" },
  { href: "/settings", label: "Settings" }
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-6 flex gap-2 rounded-2xl border border-slate-500/20 bg-slate-900/20 p-2 backdrop-blur">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-600/30"
                : "border border-slate-300/70 hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
