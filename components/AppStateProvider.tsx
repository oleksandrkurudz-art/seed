"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { calculateStats } from "@/lib/streak";
import {
  addTriggerNote,
  defaultData,
  loadData,
  markToday,
  saveData,
  setCheckInTime,
  setMode,
  setTheme
} from "@/lib/storage";
import { AppData, DailyStatus, Mode, ThemeMode } from "@/types/models";

interface AppStateContextValue {
  data: AppData;
  stats: ReturnType<typeof calculateStats>;
  markDay: (status: DailyStatus) => void;
  saveTriggerNote: (note: string) => void;
  updateMode: (mode: Mode) => void;
  updateCheckInTime: (time: string) => void;
  updateTheme: (theme: ThemeMode) => void;
  resetAll: () => void;
  importFromText: (jsonText: string) => { ok: boolean; error?: string };
  exportData: () => string;
  justLeveledUp: boolean;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

function withPersist(next: AppData, setData: (v: AppData) => void) {
  setData(next);
  saveData(next);
}

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<AppData>(defaultData);
  const [hydrated, setHydrated] = useState(false);
  const [justLeveledUp, setJustLeveledUp] = useState(false);

  useEffect(() => {
    const loaded = loadData();
    setData(loaded);
    applyTheme(loaded.settings.theme);
    setHydrated(true);
  }, []);

  const stats = useMemo(() => calculateStats(data.dailyLogs), [data.dailyLogs]);

  const markDay = (status: DailyStatus) => {
    const previousLevel = calculateStats(data.dailyLogs).level;
    const next = markToday(data, status);
    const newLevel = calculateStats(next.dailyLogs).level;
    withPersist(next, setData);
    if (newLevel > previousLevel) {
      setJustLeveledUp(true);
      window.setTimeout(() => setJustLeveledUp(false), 1800);
    }
  };

  const saveTrigger = (note: string) => {
    const next = addTriggerNote(data, note);
    withPersist(next, setData);
  };

  const updateMode = (mode: Mode) => {
    const next = setMode(data, mode);
    withPersist(next, setData);
  };

  const updateCheckIn = (time: string) => {
    const next = setCheckInTime(data, time);
    withPersist(next, setData);
  };

  const updateThemeMode = (theme: ThemeMode) => {
    const next = setTheme(data, theme);
    withPersist(next, setData);
    applyTheme(theme);
  };

  const resetAll = () => {
    withPersist(defaultData, setData);
    applyTheme(defaultData.settings.theme);
  };

  const importFromText = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText) as Partial<AppData>;
      const imported: AppData = {
        ...defaultData,
        ...parsed,
        version: 1,
        dailyLogs: parsed.dailyLogs ?? {},
        triggerLogs: parsed.triggerLogs ?? [],
        settings: {
          ...defaultData.settings,
          ...(parsed.settings ?? {})
        }
      };
      withPersist(imported, setData);
      applyTheme(imported.settings.theme);
      return { ok: true };
    } catch {
      return { ok: false, error: "Невалідний JSON" };
    }
  };

  const exportData = () => JSON.stringify(data, null, 2);

  const value: AppStateContextValue = {
    data,
    stats,
    markDay,
    saveTriggerNote: saveTrigger,
    updateMode,
    updateCheckInTime: updateCheckIn,
    updateTheme: updateThemeMode,
    resetAll,
    importFromText,
    exportData,
    justLeveledUp
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="card animate-pulse">Loading...</div>
      </div>
    );
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return ctx;
}
