import { useTranslation } from "react-i18next";

export default function KVKK() {
  const { t } = useTranslation("common");
  return (
    <section className="py-16 mx-auto max-w-[1200px] px-6">
      <h1 className="text-3xl font-bold mb-4">{t("pages.kvkk.title", { defaultValue: "KVKK Aydinlatma Metni" })}</h1>
      <p>{t("pages.kvkk.description", { defaultValue: "KVKK metni yakinda guncellenecek." })}</p>
    </section>
  );
}
