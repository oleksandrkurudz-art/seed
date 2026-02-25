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
      <section className="card panel relative overflow-hidden">
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" />
        <p className="text-sm uppercase tracking-wide text-muted">Current streak</p>
        <p className="text-5xl font-bold leading-tight">{stats.currentStreak} днів</p>
        <p className="mt-1 text-sm text-muted">Тримай ритм. Один чистий день за раз.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card panel">
          <p className="mb-2 text-sm text-muted">Поточний рівень</p>
          <p className="mb-4 text-3xl font-bold">Level {stats.level}</p>
          <ProgressBar value={stats.progressToNext} max={7} />
        </article>
        <article className="card panel">
          <p className="text-sm text-muted">Еволюція orb (stage {stats.orbStage}/6)</p>
          <Orb stage={stats.orbStage} />
        </article>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <button className="btn btn-success" onClick={() => markDay("clean")}>
          ✅ Check-in сьогодні (без зриву)
        </button>
        <button className="btn btn-danger" onClick={() => markDay("relapse")}>
          ⚠️ Зрив сьогодні
        </button>
        <button className="btn btn-primary animate-pulse" onClick={() => setModalOpen(true)}>
          🔥 Мене тригерить
        </button>
      </section>

      <section className="card panel">
        <p className="text-sm uppercase tracking-wide text-muted">Фраза дня</p>
        <p className="mt-1 text-lg font-medium">{quote}</p>
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
