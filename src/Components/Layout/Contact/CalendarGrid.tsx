// src/Pages/Contact/appointment/CalendarGrid.tsx
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import CalendarLegend from "./CalendarLegend";

export default function CalendarGrid({
  onPick,
  selected,
}: {
  onPick: (d: string) => void;
  selected?: string;
}) {
  const { t, i18n } = useTranslation("common");
  const label = t("contact.appointment.monthLabel", {
    defaultValue: "Eylül 2025",
  });
  const weekdays = useMemo(
    () =>
      (i18n.language?.startsWith("en")
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]) as string[],
    [i18n.language]
  );

  const cells = useMemo(() => {
    const arr: { n: number | null; other?: boolean; date?: string }[] = [];
    for (let i = 1; i <= 14; i++) arr.push({ n: i, other: true });
    for (let d = 15; d <= 30; d++)
      arr.push({ n: d, date: `2025-09-${String(d).padStart(2, "0")}` });
    for (let i = 1; i <= 21; i++) arr.push({ n: i, other: true });
    return arr;
  }, []);

  return (
    <div className="rounded-2xl p-4 ring-1 ring-slate-200">
      <div className="mb-3 flex items-center justify-between">
        <h5 className="text-lg font-semibold">{label}</h5>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-grid h-8 w-8 place-items-center rounded border border-indigo-200 text-[color:var(--primary-color)] hover:bg-indigo-50"
            aria-label="Prev"
          >
            <i className="fas fa-chevron-left" />
          </button>
          <button
            type="button"
            className="inline-grid h-8 w-8 place-items-center rounded border border-indigo-200 text-[color:var(--primary-color)] hover:bg-indigo-50"
            aria-label="Next"
          >
            <i className="fas fa-chevron-right" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-200 text-center text-xs text-slate-600">
        {weekdays.map((w) => (
          <div key={w} className="bg-white py-2 font-medium">
            {w}
          </div>
        ))}
        {cells.map((c, i) => (
          <button
            key={i}
            type="button"
            className={[
              "aspect-square bg-white text-sm transition",
              "hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              c.other ? "text-slate-300" : "text-slate-700",
              selected && selected === c.date
                ? "bg-amber-100 ring-2 ring-amber-400"
                : "",
            ].join(" ")}
            onClick={() => c.date && onPick(c.date)}
            disabled={!c.date}
          >
            <span className="inline-block">{c.n}</span>
          </button>
        ))}
      </div>

      <CalendarLegend />
    </div>
  );
}
