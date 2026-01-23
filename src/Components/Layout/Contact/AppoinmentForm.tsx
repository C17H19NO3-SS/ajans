// src/Pages/Contact/appointment/AppointmentForm.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";

const inputBase =
  "w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500";
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium text-slate-700">{children}</label>
);

export default function AppointmentForm({
  pickedDate,
  onDateClear,
}: {
  pickedDate?: string;
  onDateClear: () => void;
}) {
  const { t } = useTranslation("common");
  const [time, setTime] = useState("");
  const times = ["10:00", "11:00", "14:00", "15:00", "16:00"];

  return (
    <form noValidate aria-labelledby="appt-form-title">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <FieldLabel>
            {t("contact.appointment.form.name", { defaultValue: "Ad Soyad" })}
          </FieldLabel>
          <input className={inputBase} placeholder="Örn. Ali Yılmaz" required />
        </div>
        <div>
          <FieldLabel>
            {t("contact.appointment.form.email", { defaultValue: "E-posta" })}
          </FieldLabel>
          <input
            type="email"
            className={inputBase}
            placeholder="ornek@eposta.com"
            required
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <FieldLabel>
            {t("contact.appointment.form.phone", { defaultValue: "Telefon" })}
          </FieldLabel>
          <input
            type="tel"
            className={inputBase}
            placeholder="+90 5xx xxx xx xx"
          />
        </div>
        <div>
          <FieldLabel>
            {t("contact.appointment.form.service", { defaultValue: "Hizmet" })}
          </FieldLabel>
          <select className={inputBase} required defaultValue="">
            <option value="">
              {t("form.select", { defaultValue: "Seçiniz" })}
            </option>
            <option value="web-tasarim">
              {t("services.web", { defaultValue: "Web Tasarım" })}
            </option>
            <option value="web-yazilim">
              {t("services.dev", { defaultValue: "Web Yazılım" })}
            </option>
            <option value="mobil-uygulama">
              {t("services.mobile", { defaultValue: "Mobil Uygulama" })}
            </option>
            <option value="seo">
              {t("services.seo", { defaultValue: "SEO" })}
            </option>
            <option value="danismanlik">
              {t("services.consulting", { defaultValue: "Danışmanlık" })}
            </option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <FieldLabel>
          {t("contact.appointment.form.date", { defaultValue: "Tarih" })}
        </FieldLabel>
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
          <i className="fas fa-calendar text-slate-500" />
          <span className="text-slate-600">
            {pickedDate ||
              t("contact.appointment.pickDate", {
                defaultValue: "Takvimden tarih seçin",
              })}
          </span>
          {pickedDate && (
            <button
              type="button"
              onClick={onDateClear}
              className="ml-auto inline-grid h-7 w-7 place-items-center rounded border border-slate-300 text-slate-600 hover:bg-white"
              aria-label="clear date"
              title="Temizle"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <FieldLabel>
          {t("contact.appointment.form.time", { defaultValue: "Saat" })}
        </FieldLabel>
        <select
          className={inputBase}
          required
          disabled={!pickedDate}
          value={time}
          onChange={(e) => setTime(e.target.value)}
        >
          <option value="">
            {pickedDate
              ? t("contact.appointment.form.pickTime", {
                  defaultValue: "Saat seçin",
                })
              : t("contact.appointment.form.pickDateFirst", {
                  defaultValue: "Önce tarih seçin",
                })}
          </option>
          {pickedDate &&
            times.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
        </select>
      </div>

      <div className="mt-4">
        <FieldLabel>
          <span className="inline-flex items-center gap-2">
            <i className="fas fa-comment" />
            {t("contact.appointment.form.message", {
              defaultValue: "Not / Mesaj",
            })}
          </span>
        </FieldLabel>
        <textarea
          rows={4}
          className={inputBase}
          placeholder={t("contact.appointment.form.messagePh", {
            defaultValue: "Ek notlarınızı yazabilirsiniz…",
          })}
        />
        <p className="mt-1 text-xs text-slate-500">
          <i className="fas fa-info-circle mr-1" />
          {t("contact.appointment.form.messageHint", {
            defaultValue: "İsteğe bağlı alandır.",
          })}
        </p>
      </div>

      <label className="mt-4 flex items-start gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          required
          className="mt-1 rounded border-slate-300"
        />
        <a
          href="/gizlilik"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          {t("contact.appointment.form.privacy", {
            defaultValue: "Gizlilik politikasını kabul ediyorum",
          })}
        </a>
      </label>

      <input type="text" name="honeypot" className="hidden" />

      <button
        type="submit"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[color:var(--primary-color)] px-5 py-3 font-semibold text-white shadow hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <i className="fas fa-calendar-plus" />
        {t("contact.appointment.form.submit", { defaultValue: "Randevu Al" })}
      </button>
    </form>
  );
}
