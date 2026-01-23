import { useTranslation } from "react-i18next";
import referanslar from "@/Images/referanslar.png";

// Örnek veri yapısı
const projects = [
  {
    id: 1,
    key: "cafe",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  {
    id: 2,
    key: "realestate",
    badgeColor: "bg-purple-100 text-purple-800",
  },
  {
    id: 3,
    key: "hotel",
    badgeColor: "bg-orange-100 text-orange-800",
  },
  {
    id: 4,
    key: "clinic",
    badgeColor: "bg-green-100 text-green-800",
  },
];

export default function References() {
  const { t } = useTranslation();

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 px-6 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {t("pages.references.heroTitle")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("pages.references.heroDesc")}
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-6 mx-auto max-w-[1200px]">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t("pages.references.projectsTitle")}
          </h2>
          <p className="text-gray-500">
            {t("pages.references.projectsSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="p-8 flex flex-col justify-center h-full">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${project.badgeColor}`}
                  >
                    {t(`pages.references.items.${project.key}.service`)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t(`pages.references.items.${project.key}.client`)}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t(`pages.references.items.${project.key}.desc`)}
                </p>

                <div className="mt-auto border-t border-gray-100 pt-4">
                  <p className="text-sm font-medium text-gray-500">
                    <span className="text-gray-900 font-bold">
                      {t("pages.references.resultLabel")}:{" "}
                    </span>
                    {t(`pages.references.items.${project.key}.result`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Image Section (Sadece Resim) */}
      <section className="mx-auto max-w-[1200px] px-6 mt-4 mb-16">
        <div className="rounded-2xl overflow-hidden shadow-2xl px-2">
          {/* Buradaki linki değiştirebilirsin */}
          <img
            src={referanslar}
            alt={t("pages.references.bottomImageAlt", {
              defaultValue: "References Cover",
            })}
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}
