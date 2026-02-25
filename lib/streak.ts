import { addDays, parseDateKey, todayKey, toDateKey } from "@/lib/dates";
import { DailyLog } from "@/types/models";

export interface DerivedStats {
  totalCleanDays: number;
  totalRelapses: number;
  currentStreak: number;
  bestStreak: number;
  level: number;
  progressToNext: number;
  orbStage: 1 | 2 | 3 | 4 | 5 | 6;
}

function countCurrentStreak(logMap: Record<string, DailyLog>): number {
  const today = todayKey();
  if (logMap[today]?.status !== "clean") {
    return 0;
  }

  let streak = 0;
  let cursor = today;
  while (logMap[cursor]?.status === "clean") {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function countBestStreak(logMap: Record<string, DailyLog>): number {
  const keys = Object.keys(logMap).sort();
  if (keys.length === 0) return 0;

  let best = 0;
  let current = 0;
  let prevDate: Date | null = null;

  for (const key of keys) {
    const log = logMap[key];
    const date = parseDateKey(key);

    if (log.status !== "clean") {
      current = 0;
      prevDate = date;
      continue;
    }

    if (!prevDate) {
      current = 1;
      best = Math.max(best, current);
      prevDate = date;
      continue;
    }

    const expectedNext = new Date(prevDate);
    expectedNext.setDate(expectedNext.getDate() + 1);
    const isConsecutive = toDateKey(expectedNext) === key;
    current = isConsecutive ? current + 1 : 1;
    best = Math.max(best, current);
    prevDate = date;
  }

  return best;
}

export function getOrbStage(level: number): 1 | 2 | 3 | 4 | 5 | 6 {
  if (level <= 2) return 1;
  if (level <= 4) return 2;
  if (level <= 6) return 3;
  if (level <= 9) return 4;
  if (level <= 12) return 5;
  return 6;
}

export function calculateStats(logMap: Record<string, DailyLog>): DerivedStats {
  const logs = Object.values(logMap);
  const totalCleanDays = logs.filter((item) => item.status === "clean").length;
  const totalRelapses = logs.filter((item) => item.status === "relapse").length;
  const currentStreak = countCurrentStreak(logMap);
  const bestStreak = countBestStreak(logMap);
  const level = Math.floor(totalCleanDays / 7) + 1;
  const progressToNext = totalCleanDays % 7;
  const orbStage = getOrbStage(level);

  return {
    totalCleanDays,
    totalRelapses,
    currentStreak,
    bestStreak,
    level,
    progressToNext,
    orbStage
  };
}

export function buildLast30Days(logMap: Record<string, DailyLog>) {
  const end = todayKey();
  const series: Array<{ date: string; status: "clean" | "relapse" | "none" }> = [];
  for (let i = 29; i >= 0; i -= 1) {
    const date = addDays(end, -i);
    const status = logMap[date]?.status ?? "none";
    series.push({ date, status });
  }
  return series;
}
