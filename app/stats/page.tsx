"use client";

import { Calendar } from "@/components/Calendar";
import { StatsCards } from "@/components/StatsCards";
import { TrendChart } from "@/components/TrendChart";
import { useAppState } from "@/components/AppStateProvider";
import { buildLast30Days } from "@/lib/streak";

export default function StatsPage() {
  const { data, stats } = useAppState();
  const points = buildLast30Days(data.dailyLogs);

  return (
    <div className="space-y-4 animate-fade-in">
      <StatsCards
        totalCleanDays={stats.totalCleanDays}
        totalRelapses={stats.totalRelapses}
        bestStreak={stats.bestStreak}
        currentStreak={stats.currentStreak}
      />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <TrendChart points={points} />
        <Calendar logs={data.dailyLogs} />
      </div>
    </div>
  );
}
