// src/Pages/Contact/FAQSection.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SectionTitle from "../Section/Title";
import { AnimatePresence, FadeIn, FadeInItem, FadeInStagger } from "@/Components/Common/Motion";
import { motion } from "framer-motion";

export default function FAQSection() {
  const { t } = useTranslation("common");
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const items = [
    {
      q: t("contact.faq.q1", { defaultValue: "Fiyatlar nasıl belirleniyor?" }),
      a: t("contact.faq.a1", {
        defaultValue:
          "Fiyatlar proje kapsamına ve ihtiyaca göre değişir. Size özel teklif için iletişime geçin.",
      }),
    },
    {
      q: t("contact.faq.q2", { defaultValue: "Proje süresi ne kadar?" }),
      a: t("contact.faq.a2", {
        defaultValue:
          "Süre, kapsam ve büyüklüğe göre değişir. Detaylarla birlikte netleşir.",
      }),
    },
    {
      q: t("contact.faq.q3", {
        defaultValue: "Hangi sektörlerle çalışıyorsunuz?",
      }),
      a: t("contact.faq.a3", {
        defaultValue:
          "Perakende, e-ticaret, gıda, sağlık, eğitim, teknoloji ve daha fazlası.",
      }),
    },
  ];

  const toggle = (idx: number) => {
    setActiveIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <FadeIn as="section" className="py-20" distance={30}>
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionTitle
          icon="fas fa-question-circle"
          title1={t("contact.faq.title1", { defaultValue: "Sıkça" })}
          title2={t("contact.faq.title2", { defaultValue: "Sorulan Sorular" })}
          subtitle={t("contact.faq.subtitle", {
            defaultValue: "Merak edilenler",
          })}
        />
        <div className="mx-auto max-w-3xl">
          <FadeIn className="rounded-[28px] bg-white/95 p-2 shadow-2xl shadow-indigo-100 ring-1 ring-indigo-100" distance={28}>
            <FadeInStagger className="space-y-3" stagger={0.08}>
              {items.map((it, idx) => {
                const active = activeIndex === idx;
                return (
                  <FadeInItem key={idx}>
                    <div
                      className={`rounded-2xl border px-5 py-4 transition ${
                        active
                          ? "border-indigo-200 bg-indigo-50/60"
                          : "border-transparent hover:border-indigo-100 hover:bg-indigo-50/30"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(idx)}
                        className="flex w-full items-start justify-between gap-4 text-left focus:outline-none"
                        aria-expanded={active}
                        aria-controls={`faq-panel-${idx}`}
                      >
                        <span className="text-base font-semibold text-[color:var(--secondary-color)]">
                          {it.q}
                        </span>
                        <span
                          className={`grid h-8 w-8 place-items-center rounded-full border transition ${
                            active
                              ? "rotate-45 border-[color:var(--primary-color)] bg-[color:var(--primary-color)] text-white"
                              : "border-indigo-100 bg-white text-[color:var(--primary-color)]"
                          }`}
                        >
                          +
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {active && (
                          <motion.div
                            key={`faq-${idx}`}
                            id={`faq-panel-${idx}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 text-sm leading-relaxed text-slate-600">
                              {it.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </FadeInItem>
                );
              })}
            </FadeInStagger>
            <FadeInItem
              className="mt-4 rounded-2xl bg-indigo-50/60 px-6 py-4 text-sm text-slate-600"
              direction="up"
              distance={10}
            >
              <i className="fas fa-headset mr-2 text-[color:var(--primary-color)]" />
              {t("contact.faq.footer", {
                defaultValue:
                  "Listede yer almayan sorularınız için iletişim kanallarımızı kullanabilirsiniz.",
              })}
            </FadeInItem>
          </FadeIn>
        </div>
      </div>
    </FadeIn>
  );
}
