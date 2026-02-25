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
            <header className="mb-4">
              <h1 className="text-2xl font-bold">Seed-like</h1>
              <p className="text-sm text-muted">Локальний трекер прогресу</p>
            </header>
            <SiteNav />
            {children}
          </main>
        </AppStateProvider>
      </body>
    </html>
  );
}
