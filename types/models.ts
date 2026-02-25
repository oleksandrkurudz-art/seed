export type DailyStatus = "clean" | "relapse";

export interface DailyLog {
  date: string;
  status: DailyStatus;
  note?: string;
}

export interface TriggerLog {
  date: string;
  note: string;
}

export type Mode = "no_porn" | "no_pmo" | "reduce_frequency";
export type ThemeMode = "light" | "dark";

export interface AppSettings {
  mode: Mode;
  checkInTime: string;
  theme: ThemeMode;
  reduceFrequencyMaxPerWeek?: number;
}

export interface AppData {
  version: 1;
  dailyLogs: Record<string, DailyLog>;
  triggerLogs: TriggerLog[];
  settings: AppSettings;
}
