// src/Pages/Contact/appointment/AppointmentSection.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CalendarGrid from "./CalendarGrid";
import SectionTitle from "../Section/Title";
import AppointmentForm from "./AppoinmentForm";
import { FadeIn, FadeInItem, FadeInStagger } from "@/Components/Common/Motion";

export default function AppointmentSection() {
  const { t } = useTranslation("common");
  const [picked, setPicked] = useState<string | undefined>(undefined);
  const appointmentTips = [
    t("contact.appointment.tip1", {
      defaultValue: "Online toplantılar için Zoom bağlantısı paylaşıyoruz.",
    }),
    t("contact.appointment.tip2", {
      defaultValue: "Yüz yüze görüşmeler için ofisimizde ağırlıyoruz.",
    }),
    t("contact.appointment.tip3", {
      defaultValue: "Takviminizde görünmesi için davet e-postası gönderiyoruz.",
    }),
  ];

  return (
    <FadeIn
      as="section"
      id="iletisim-formu"
      className="relative overflow-hidden py-20"
      distance={38}
    >
      <div className="pointer-events-none absolute -right-32 top-1/3 hidden h-72 w-72 rounded-full bg-[rgba(76,106,255,0.2)] blur-[140px] md:block" />
      <div className="pointer-events-none absolute -left-28 bottom-12 hidden h-64 w-64 rounded-full bg-[rgba(24,34,89,0.15)] blur-[120px] md:block" />
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionTitle
          icon="fas fa-calendar-check"
          title1={t("contact.appointment.title1", { defaultValue: "Toplantı" })}
          title2={t("contact.appointment.title2", {
            defaultValue: "Randevusu",
          })}
          subtitle={t("contact.appointment.subtitle", {
            defaultValue: "Uygun tarih ve saat seçin.",
          })}
        />

        <div className="grid gap-8 lg:grid-cols-12">
          <FadeIn as="div" className="lg:col-span-7" distance={32}>
            <div className="rounded-[36px] bg-white/95 p-8 shadow-2xl shadow-indigo-100 ring-1 ring-indigo-100 backdrop-blur">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <FadeInStagger className="flex items-center gap-3" stagger={0.1}>
                  <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-indigo-100 text-[color:var(--primary-color)] shadow-sm">
                    <i className="fas fa-calendar-alt" />
                  </span>
                  <div>
                    <h4 className="text-lg font-semibold text-[color:var(--secondary-color)]">
                      {t("contact.appointment.calendarTitle", {
                        defaultValue: "Takvim",
                      })}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {t("contact.appointment.calendarDesc", {
                        defaultValue:
                          "Takvimden uygun gün ve saat seçerek randevunuzu oluşturun.",
                      })}
                    </p>
                  </div>
                </FadeInStagger>
                {picked && (
                  <FadeInItem
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-[color:var(--primary-color)]"
                    direction="left"
                    distance={10}
                  >
                    <i className="fas fa-check-circle" />
                    {t("contact.appointment.selected", { defaultValue: "Seçilen tarih" })}
                    <span className="font-bold">{picked}</span>
                    <button
                      type="button"
                      className="rounded-full bg-white px-2 py-1 text-[10px] text-slate-500 shadow"
                      onClick={() => setPicked(undefined)}
                    >
                      {t("contact.appointment.clear", { defaultValue: "Sıfırla" })}
                    </button>
                  </FadeInItem>
                )}
              </div>
              <CalendarGrid onPick={setPicked} selected={picked} />
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {appointmentTips.map((tip) => (
                  <div key={tip} className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-3 text-xs text-[color:var(--primary-color)]">
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn as="div" className="lg:col-span-5" distance={34} delay={0.05}>
            <div className="flex h-full flex-col gap-6">
              <div className="rounded-[32px] bg-white/95 p-8 shadow-2xl shadow-indigo-100 ring-1 ring-indigo-100 backdrop-blur">
                <AppointmentForm
                  pickedDate={picked}
                  onDateClear={() => setPicked(undefined)}
                />
              </div>

              <FadeIn className="rounded-[28px] bg-white/80 p-6 text-sm text-slate-600 shadow-lg shadow-indigo-100 ring-1 ring-indigo-50" distance={20}>
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[color:var(--primary-color)]">
                    <i className="fas fa-users" />
                  </span>
                  <div>
                    <h5 className="text-base font-semibold text-[color:var(--secondary-color)]">
                      {t("contact.appointment.teamNote", {
                        defaultValue: "Takım Notu",
                      })}
                    </h5>
                    <p className="mt-1 text-xs text-slate-500">
                      {t("contact.appointment.teamDesc", {
                        defaultValue:
                          "Toplantı öncesi kısa bir brifing notu paylaşırsanız görüşmeye daha hazırlıklı geliriz.",
                      })}
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </FadeIn>
        </div>
      </div>
    </FadeIn>
  );
}
