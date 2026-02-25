"use client";

import { useEffect, useMemo, useState } from "react";

type Tab = "breath" | "timer" | "plan";

interface AntiUrgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNote: (note: string) => void;
}

const breathPhases = [
  { name: "Вдих", sec: 4 },
  { name: "Затримка", sec: 7 },
  { name: "Видих", sec: 8 }
];

export function AntiUrgeModal({ isOpen, onClose, onSaveNote }: AntiUrgeModalProps) {
  const [tab, setTab] = useState<Tab>("breath");
  const [cycle, setCycle] = useState(1);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseLeft, setPhaseLeft] = useState(breathPhases[0].sec);
  const [breathRunning, setBreathRunning] = useState(false);
  const [timerLeft, setTimerLeft] = useState(600);
  const [timerRunning, setTimerRunning] = useState(false);
  const [note, setNote] = useState("");

  const phase = breathPhases[phaseIndex];
  const timerLabel = useMemo(() => {
    const m = String(Math.floor(timerLeft / 60)).padStart(2, "0");
    const s = String(timerLeft % 60).padStart(2, "0");
    return `${m}:${s}`;
  }, [timerLeft]);

  useEffect(() => {
    if (!breathRunning) return;
    const id = window.setInterval(() => {
      setPhaseLeft((prev) => {
        if (prev > 1) return prev - 1;
        const nextIdx = (phaseIndex + 1) % breathPhases.length;
        const nextCycle = nextIdx === 0 ? cycle + 1 : cycle;
        if (nextCycle > 4) {
          setBreathRunning(false);
          return 0;
        }
        setPhaseIndex(nextIdx);
        setCycle(nextCycle);
        return breathPhases[nextIdx].sec;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [breathRunning, phaseIndex, cycle]);

  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setTimerLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  useEffect(() => {
    if (!isOpen) {
      setTab("breath");
      setBreathRunning(false);
      setTimerRunning(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <div className="card max-h-[90vh] w-full max-w-xl overflow-auto animate-pop-in">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Мене тригерить</h3>
          <button className="btn btn-ghost px-3 py-2" onClick={onClose}>
            Закрити
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <button className={`btn px-3 py-2 ${tab === "breath" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("breath")}>
            Дихання 4-7-8
          </button>
          <button className={`btn px-3 py-2 ${tab === "timer" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("timer")}>
            Таймер 10 хв
          </button>
          <button className={`btn px-3 py-2 ${tab === "plan" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("plan")}>
            Швидкий план
          </button>
        </div>

        {tab === "breath" && (
          <section className="card mb-4">
            <p className="text-sm text-muted">Цикл {Math.min(cycle, 4)}/4</p>
            <p className="mt-2 text-2xl font-semibold">{phaseLeft === 0 ? "Готово" : phase.name}</p>
            <p className="text-4xl font-bold text-cyan-500">{phaseLeft}</p>
            <div className="mt-3 flex gap-2">
              <button
                className="btn btn-success px-3 py-2"
                onClick={() => {
                  setCycle(1);
                  setPhaseIndex(0);
                  setPhaseLeft(breathPhases[0].sec);
                  setBreathRunning(true);
                }}
              >
                Старт 4 цикли
              </button>
              <button
                className="btn btn-ghost px-3 py-2"
                onClick={() => {
                  setBreathRunning(false);
                  setCycle(1);
                  setPhaseIndex(0);
                  setPhaseLeft(breathPhases[0].sec);
                }}
              >
                Скинути
              </button>
            </div>
          </section>
        )}

        {tab === "timer" && (
          <section className="card mb-4">
            <p className="text-sm text-muted">Потяг пройде</p>
            <p className="text-5xl font-bold text-cyan-500">{timerLabel}</p>
            <div className="mt-3 flex gap-2">
              <button className="btn btn-success px-3 py-2" onClick={() => setTimerRunning(true)}>
                Старт
              </button>
              <button className="btn btn-ghost px-3 py-2" onClick={() => setTimerRunning(false)}>
                Пауза
              </button>
              <button
                className="btn btn-ghost px-3 py-2"
                onClick={() => {
                  setTimerRunning(false);
                  setTimerLeft(600);
                }}
              >
                Скинути
              </button>
            </div>
          </section>
        )}

        {tab === "plan" && (
          <section className="card mb-4">
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              <li>Відійди від телефону/ПК на 2 хв</li>
              <li>20 віджимань або 1 хв планки</li>
              <li>Випий воду + відкрий Dashboard</li>
            </ol>
          </section>
        )}

        <section className="card">
          <label className="mb-2 block text-sm font-medium">Додати нотатку, що мене тригернуло</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-24 w-full rounded-lg border bg-transparent p-3 text-sm"
            placeholder="Наприклад: сам, втома, соцмережі..."
          />
          <button
            className="btn btn-primary mt-3 px-3 py-2"
            onClick={() => {
              onSaveNote(note);
              setNote("");
            }}
          >
            Зберегти нотатку
          </button>
        </section>
      </div>
    </div>
  );
}
