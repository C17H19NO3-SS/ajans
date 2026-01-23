import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation("common");
  return (
    <section className="py-16 mx-auto max-w-[1200px] px-6">
      <h1 className="text-3xl font-bold mb-4">{t("pages.terms.title", { defaultValue: "Kullanim Kosullari" })}</h1>
      <p>{t("pages.terms.description", { defaultValue: "Kullanim kosullari icerigi yakinda." })}</p>
    </section>
  );
}
