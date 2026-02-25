import { AppData, DailyStatus, Mode, ThemeMode } from "@/types/models";
import { todayKey } from "./dates";

export const STORAGE_KEY = "seed_like_data_v1";

export const defaultData: AppData = {
  version: 1,
  dailyLogs: {},
  triggerLogs: [],
  settings: {
    mode: "no_porn",
    checkInTime: "21:00",
    theme: "dark"
  }
};

function normalize(payload: unknown): AppData {
  if (!payload || typeof payload !== "object") return defaultData;
  const maybe = payload as Partial<AppData>;
  return {
    version: 1,
    dailyLogs: maybe.dailyLogs ?? {},
    triggerLogs: Array.isArray(maybe.triggerLogs) ? maybe.triggerLogs : [],
    settings: {
      mode: maybe.settings?.mode ?? defaultData.settings.mode,
      checkInTime: maybe.settings?.checkInTime ?? defaultData.settings.checkInTime,
      theme: maybe.settings?.theme ?? defaultData.settings.theme,
      reduceFrequencyMaxPerWeek: maybe.settings?.reduceFrequencyMaxPerWeek
    }
  };
}

export function loadData(): AppData {
  if (typeof window === "undefined") return defaultData;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultData;
  try {
    return normalize(JSON.parse(raw));
  } catch {
    return defaultData;
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function markToday(data: AppData, status: DailyStatus): AppData {
  const key = todayKey();
  const existingNote = data.dailyLogs[key]?.note;
  return {
    ...data,
    dailyLogs: {
      ...data.dailyLogs,
      [key]: {
        date: key,
        status,
        note: existingNote
      }
    }
  };
}

export function addTriggerNote(data: AppData, note: string): AppData {
  const trimmed = note.trim();
  if (!trimmed) return data;
  const key = todayKey();
  const current = data.dailyLogs[key];
  const mergedNote = current?.note ? `${current.note}\n${trimmed}` : trimmed;
  return {
    ...data,
    triggerLogs: [...data.triggerLogs, { date: key, note: trimmed }],
    dailyLogs: {
      ...data.dailyLogs,
      [key]: {
        date: key,
        status: current?.status ?? "clean",
        note: mergedNote
      }
    }
  };
}

export function setMode(data: AppData, mode: Mode): AppData {
  return {
    ...data,
    settings: { ...data.settings, mode }
  };
}

export function setCheckInTime(data: AppData, time: string): AppData {
  return {
    ...data,
    settings: { ...data.settings, checkInTime: time }
  };
}

export function setTheme(data: AppData, theme: ThemeMode): AppData {
  return {
    ...data,
    settings: { ...data.settings, theme }
  };
}
