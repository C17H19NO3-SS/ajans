import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation("common");
  return (
    <section className="py-16 mx-auto max-w-[1200px] px-6">
      <h1 className="text-3xl font-bold mb-4">{t("pages.privacy.title", { defaultValue: "Gizlilik Politikasi" })}</h1>
      <p>{t("pages.privacy.description", { defaultValue: "Gizlilik politikasi icerigi yakinda." })}</p>
    </section>
  );
}
