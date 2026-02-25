import { daysInMonth, formatMonthYear, toDateKey, weekdayOffsetMondayFirst } from "@/lib/dates";
import { DailyLog } from "@/types/models";

interface CalendarProps {
  logs: Record<string, DailyLog>;
  monthDate?: Date;
}

export function Calendar({ logs, monthDate = new Date() }: CalendarProps) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const firstDayOffset = weekdayOffsetMondayFirst(new Date(year, month, 1));

  const cells = Array.from({ length: firstDayOffset + totalDays });
  return (
    <section className="card">
      <h2 className="mb-4 text-lg font-semibold capitalize">{formatMonthYear(monthDate)}</h2>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((_, idx) => {
          const dateNum = idx - firstDayOffset + 1;
          if (dateNum <= 0 || dateNum > totalDays) {
            return <div key={idx} className="h-10 rounded-md border border-transparent" />;
          }

          const key = toDateKey(new Date(year, month, dateNum));
          const status = logs[key]?.status;
          const classes =
            status === "clean"
              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
              : status === "relapse"
                ? "bg-rose-500/20 text-rose-600 dark:text-rose-300"
                : "bg-slate-200/60 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
          return (
            <div key={key} className={`h-10 rounded-md border border-slate-300/60 p-2 text-sm ${classes}`}>
              {dateNum}
            </div>
          );
        })}
      </div>
    </section>
  );
}
