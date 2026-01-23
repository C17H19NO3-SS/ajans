// src/Pages/Contact/appointment/CalendarLegend.tsx
import { useTranslation } from "react-i18next";

export default function CalendarLegend() {
  const { t } = useTranslation("common");
  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-emerald-500" />
          {t("contact.appointment.legendAvailable", { defaultValue: "Müsait" })}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-rose-500" />
          {t("contact.appointment.legendUnavailable", {
            defaultValue: "Uygun değil",
          })}
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="h-3 w-3 rounded"
            style={{ backgroundColor: "#fd7e14" }}
          />
          {t("contact.appointment.legendFull", {
            defaultValue: "Kontenjan dolu",
          })}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-amber-400" />
          {t("contact.appointment.legendSelected", { defaultValue: "Seçili" })}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        <i className="fas fa-info-circle mr-1" />
        {t("contact.appointment.info", {
          defaultValue:
            "Sadece yeşil günleri seçebilirsiniz. Turuncu günlerde randevu limiti doludur.",
        })}
      </p>
    </div>
  );
}
