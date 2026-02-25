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
    <nav className="mb-6 flex gap-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-2 text-sm transition ${
              active
                ? "bg-cyan-600 text-white"
                : "border border-slate-300/70 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
