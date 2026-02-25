import type { Metadata } from "next";
import "./globals.css";
import { AppStateProvider } from "@/components/AppStateProvider";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Seed-like Tracker",
  description: "Streak, level and anti-urge helper"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body>
        <AppStateProvider>
          <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6">
            <header className="mb-4 rounded-2xl border border-slate-500/20 bg-slate-900/20 p-4 backdrop-blur">
              <h1 className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-3xl font-bold text-transparent">
                Seed-like
              </h1>
              <p className="text-sm text-muted">Локальний трекер прогресу та відновлення</p>
            </header>
            <SiteNav />
            {children}
          </main>
        </AppStateProvider>
      </body>
    </html>
  );
}
