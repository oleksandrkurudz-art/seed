interface StatsCardsProps {
  totalCleanDays: number;
  totalRelapses: number;
  bestStreak: number;
  currentStreak: number;
}

export function StatsCards({
  totalCleanDays,
  totalRelapses,
  bestStreak,
  currentStreak
}: StatsCardsProps) {
  const items = [
    { label: "Total clean days", value: totalCleanDays, color: "text-emerald-500" },
    { label: "Total relapses", value: totalRelapses, color: "text-rose-500" },
    { label: "Best streak", value: bestStreak, color: "text-cyan-500" },
    { label: "Current streak", value: currentStreak, color: "text-violet-500" }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article key={item.label} className="card panel">
          <p className="text-sm text-muted">{item.label}</p>
          <p className={`mt-1 text-3xl font-semibold ${item.color}`}>{item.value}</p>
        </article>
      ))}
    </div>
  );
}
