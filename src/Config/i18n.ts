import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// JSON sözlükleri
import tr from "@/Locales/tr/common.json";
import en from "@/Locales/en/common.json";

const resources = {
  tr: { common: tr },
  en: { common: en },
};

const DIR_MAP: Record<string, "ltr" | "rtl"> = {
  tr: "ltr",
  en: "ltr",
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // tek namespace kullanıyoruz
    ns: ["common"],
    defaultNS: "common",
    fallbackLng: "tr",
    supportedLngs: ["tr", "en"],
    // dil tespiti ve kalıcılık
    detection: {
      order: ["querystring", "localStorage", "htmlTag", "navigator"],
      caches: ["localStorage"],
      lookupQuerystring: "lng",
    },
    interpolation: { escapeValue: false },
    // keyler dot-notation ile: footer.contactInfo gibi
    keySeparator: ".",
    returnNull: false,
  });

// <html lang / dir> güncelle
function applyHtmlAttrs(lng: string) {
  const html = document.documentElement;
  html.setAttribute("lang", lng);
  html.setAttribute("dir", DIR_MAP[lng] || "ltr");
}

if (typeof document !== "undefined") {
  applyHtmlAttrs(i18n.resolvedLanguage || i18n.language);
  i18n.on("languageChanged", applyHtmlAttrs);
}
