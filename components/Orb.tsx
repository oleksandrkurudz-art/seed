interface OrbProps {
  stage: 1 | 2 | 3 | 4 | 5 | 6;
}

const stageConfig = {
  1: { core: "#22d3ee", ring: "#67e8f9", dots: 2 },
  2: { core: "#34d399", ring: "#6ee7b7", dots: 4 },
  3: { core: "#22c55e", ring: "#86efac", dots: 6 },
  4: { core: "#10b981", ring: "#34d399", dots: 8 },
  5: { core: "#14b8a6", ring: "#2dd4bf", dots: 10 },
  6: { core: "#0ea5e9", ring: "#22d3ee", dots: 12 }
} as const;

export function Orb({ stage }: OrbProps) {
  const cfg = stageConfig[stage];
  const points = Array.from({ length: cfg.dots });
  return (
    <div className="flex justify-center py-2">
      <svg
        viewBox="0 0 240 240"
        className="h-52 w-52 animate-glow transition-all duration-500"
        role="img"
        aria-label={`Orb stage ${stage}`}
      >
        <defs>
          <radialGradient id="orbCore" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor={cfg.core} stopOpacity="0.95" />
            <stop offset="100%" stopColor={cfg.core} stopOpacity="0.2" />
          </radialGradient>
        </defs>
        <circle cx="120" cy="120" r="80" fill="url(#orbCore)" />
        <circle cx="120" cy="120" r={95 - stage * 3} stroke={cfg.ring} strokeWidth="2.8" fill="none" />
        <g className="origin-center animate-drift">
          {points.map((_, i) => {
            const angle = (i / cfg.dots) * Math.PI * 2;
            const x = 120 + Math.cos(angle) * (68 + stage * 2);
            const y = 120 + Math.sin(angle) * (68 + stage * 2);
            return <circle key={i} cx={x} cy={y} r={2 + stage * 0.4} fill={cfg.ring} opacity="0.8" />;
          })}
        </g>
        {stage >= 4 && (
          <path
            d="M60 130 C 95 80, 145 170, 180 115"
            stroke={cfg.ring}
            strokeWidth="3"
            fill="none"
            opacity="0.45"
          />
        )}
        {stage >= 6 && (
          <path
            d="M55 95 C 110 50, 140 170, 185 95"
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
            opacity="0.55"
          />
        )}
      </svg>
    </div>
  );
}
