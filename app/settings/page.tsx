"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useAppState } from "@/components/AppStateProvider";
import { Mode, ThemeMode } from "@/types/models";

export default function SettingsPage() {
  const {
    data,
    updateMode,
    updateCheckInTime,
    updateTheme,
    exportData,
    importFromText,
    resetAll
  } = useAppState();
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = importFromText(text);
    setMessage(result.ok ? "Імпорт успішний" : result.error ?? "Помилка імпорту");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <section className="card panel space-y-3">
        <h2 className="text-lg font-semibold">Режим</h2>
        <select
          className="w-full rounded-lg border bg-transparent p-2"
          value={data.settings.mode}
          onChange={(e) => updateMode(e.target.value as Mode)}
        >
          <option value="no_porn">No Porn</option>
          <option value="no_pmo">No PMO</option>
          <option value="reduce_frequency">Reduce frequency (TODO max/week)</option>
        </select>
      </section>

      <section className="card panel space-y-3">
        <h2 className="text-lg font-semibold">Тема</h2>
        <div className="flex gap-2">
          {(["light", "dark"] as ThemeMode[]).map((theme) => (
            <button
              key={theme}
              className={`btn px-3 py-2 ${
                data.settings.theme === theme ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => updateTheme(theme)}
            >
              {theme === "light" ? "Світла" : "Темна"}
            </button>
          ))}
        </div>
      </section>

      <section className="card panel space-y-3">
        <h2 className="text-lg font-semibold">Нагадування (MVP UI)</h2>
        <label className="text-sm text-muted">Час чек-іну</label>
        <input
          className="w-full rounded-lg border bg-transparent p-2"
          type="time"
          value={data.settings.checkInTime}
          onChange={(e) => updateCheckInTime(e.target.value)}
        />
        <p className="text-xs text-muted">Push/notification для PWA додати пізніше (TODO)</p>
      </section>

      <section className="card panel space-y-3">
        <h2 className="text-lg font-semibold">Дані</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className="btn btn-success px-3 py-2"
            onClick={() => {
              const blob = new Blob([exportData()], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "seed-like-data.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export data
          </button>
          <label className="btn btn-ghost cursor-pointer px-3 py-2">
            Import data
            <input ref={fileInputRef} className="hidden" type="file" accept="application/json" onChange={handleImport} />
          </label>
          <button
            className="btn btn-danger px-3 py-2"
            onClick={() => {
              if (window.confirm("Точно скинути всі дані?")) {
                resetAll();
              }
            }}
          >
            Reset all data
          </button>
        </div>
        {message && <p className="text-sm text-muted">{message}</p>}
      </section>
    </div>
  );
}
