export function LevelUpConfetti({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 28 }).map((_, i) => {
        const left = (i * 37) % 100;
        const delay = (i % 8) * 80;
        const color = ["#22c55e", "#06b6d4", "#f59e0b", "#a78bfa"][i % 4];
        return (
          <span
            key={i}
            className="absolute top-0 h-3 w-2 animate-confetti rounded-sm"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              animationDelay: `${delay}ms`
            }}
          />
        );
      })}
    </div>
  );
}
