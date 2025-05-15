"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { SUPPORTED_LANGUAGES, LANGUAGES_LIST } from "./settings";

// Idiomas suportados pelo DeepL
export const SUPPORTED_LANGUAGES = {
  pt: { name: "Português", flag: "🇵🇹", native: true },
  en: { name: "English", flag: "🇺🇸" },
  es: { name: "Español", flag: "🇪🇸" },
  fr: { name: "Français", flag: "🇫🇷" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  it: { name: "Italiano", flag: "🇮🇹" },
  nl: { name: "Nederlands", flag: "🇳🇱" },
  pl: { name: "Polski", flag: "🇵🇱" },
  ru: { name: "Русский", flag: "🇷🇺" },
  ja: { name: "日本語", flag: "🇯🇵" },
  zh: { name: "中文", flag: "🇨🇳" },
};

// Converter para array para uso em componentes
export const LANGUAGES_LIST = Object.entries(SUPPORTED_LANGUAGES).map(
  ([code, info]) => ({
    code,
    ...info,
  })
);

// Criar uma função para garantir que o i18n seja inicializado apenas uma vez
function initI18n() {
  // Se já estiver inicializado, retorne a instância existente
  if (i18n.isInitialized) {
    return i18n;
  }

  // Configuração básica do i18n
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "pt",
      supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
      ns: ["common"],
      defaultNS: "common",
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      detection: {
        order: ["querystring", "cookie", "localStorage", "navigator"],
        lookupQuerystring: "lng",
        lookupCookie: "i18next",
        lookupLocalStorage: "i18nextLng",
        caches: ["localStorage", "cookie"],
      },
      debug: process.env.NODE_ENV === "development",
    });

  // Adicionar tratamento para chaves faltantes
  i18n.on("missingKey", (lng, ns, key, value) => {
    console.log(`Missing translation: ${lng}:${ns}.${key}`);
  });

  return i18n;
}

// Garantir inicialização do i18n
const i18nInstance = initI18n();

export { SUPPORTED_LANGUAGES, LANGUAGES_LIST };
export default i18nInstance;
