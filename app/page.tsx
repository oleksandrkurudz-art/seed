"use client";

import { useMemo, useState } from "react";
import { AntiUrgeModal } from "@/components/AntiUrgeModal";
import { LevelUpConfetti } from "@/components/LevelUpConfetti";
import { Orb } from "@/components/Orb";
import { ProgressBar } from "@/components/ProgressBar";
import { useAppState } from "@/components/AppStateProvider";
import { todayKey } from "@/lib/dates";
import { getDailyMotivation } from "@/lib/motivation";

export default function DashboardPage() {
  const { data, stats, markDay, saveTriggerNote, justLeveledUp } = useAppState();
  const [modalOpen, setModalOpen] = useState(false);
  const quote = useMemo(() => getDailyMotivation(todayKey()), []);

  return (
    <div className="space-y-4 animate-fade-in">
      <LevelUpConfetti visible={justLeveledUp} />
      <section className="card">
        <p className="text-sm text-muted">Streak</p>
        <p className="text-4xl font-bold">{stats.currentStreak} днів</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card">
          <p className="mb-2 text-sm text-muted">Поточний рівень</p>
          <p className="mb-4 text-3xl font-bold">Level {stats.level}</p>
          <ProgressBar value={stats.progressToNext} max={7} />
        </article>
        <article className="card">
          <p className="text-sm text-muted">Еволюція orb (stage {stats.orbStage}/6)</p>
          <Orb stage={stats.orbStage} />
        </article>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <button className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white" onClick={() => markDay("clean")}>
          ✅ Check-in сьогодні (без зриву)
        </button>
        <button className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-medium text-white" onClick={() => markDay("relapse")}>
          ⚠️ Зрив сьогодні
        </button>
        <button className="rounded-xl bg-cyan-600 px-4 py-3 text-sm font-medium text-white" onClick={() => setModalOpen(true)}>
          🔥 Мене тригерить
        </button>
      </section>

      <section className="card">
        <p className="text-sm text-muted">Фраза дня</p>
        <p className="mt-1 text-lg">{quote}</p>
        {data.dailyLogs[todayKey()]?.note && (
          <p className="mt-3 whitespace-pre-wrap text-sm text-muted">Нотатка: {data.dailyLogs[todayKey()]?.note}</p>
        )}
      </section>

      <AntiUrgeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaveNote={(note) => {
          saveTriggerNote(note);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
