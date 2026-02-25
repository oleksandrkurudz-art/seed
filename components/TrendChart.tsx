interface Point {
  date: string;
  status: "clean" | "relapse" | "none";
}

interface TrendChartProps {
  points: Point[];
}

export function TrendChart({ points }: TrendChartProps) {
  const width = 900;
  const height = 220;
  const cleanCount = points.filter((p) => p.status === "clean").length;

  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Тренд за 30 днів</h2>
        <p className="text-sm text-muted">Clean days: {cleanCount}/30</p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {points.map((point, idx) => {
          const barW = width / points.length - 4;
          const x = idx * (width / points.length) + 2;
          const h = point.status === "clean" ? 150 : point.status === "relapse" ? 90 : 50;
          const y = height - h - 20;
          const fill =
            point.status === "clean" ? "#22c55e" : point.status === "relapse" ? "#ef4444" : "#64748b";
          return <rect key={point.date} x={x} y={y} width={barW} height={h} rx="3" fill={fill} opacity="0.9" />;
        })}
      </svg>
      <div className="mt-3 flex gap-4 text-xs text-muted">
        <span className="text-emerald-500">■ clean</span>
        <span className="text-rose-500">■ relapse</span>
        <span className="text-slate-400">■ no data</span>
      </div>
    </section>
  );
}
