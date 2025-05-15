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

// Inicializar i18next com todos os plugins necessários
// Este código executa apenas no cliente
function initI18n() {
  if (i18n.isInitialized) {
    return i18n;
  }

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
        requestOptions: {
          cache: "no-store",
        },
        allowMultiLoading: false,
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

  // Plugin personalizado para tradução automática
  i18n.on("missingKey", (lng, ns, key, value) => {
    if (lng !== "pt" && process.env.NODE_ENV === "production") {
      console.log(`Missing translation for [${lng}] ${ns}:${key}`);
    }
  });

  // Middleware para verificar tradução via API para idiomas não-nativos
  const originalLoadNamespaces = i18n.loadNamespaces;
  i18n.loadNamespaces = async function (ns, callback) {
    const result = await originalLoadNamespaces.call(i18n, ns, callback);

    // Verificar se precisamos carregar tradução da API
    const currentLang = i18n.language?.substring(0, 2);

    // Se não for idioma nativo e estiver em produção, usar API
    if (
      currentLang &&
      currentLang !== "pt" &&
      !SUPPORTED_LANGUAGES[currentLang]?.native &&
      typeof window !== "undefined"
    ) {
      // Carregar traduções via API para todos os namespaces
      try {
        const apiPath = `/api/translate?lang=${currentLang}`;
        const response = await fetch(apiPath);

        if (response.ok) {
          const data = await response.json();

          // Adicionar traduções ao i18n
          Object.entries(data).forEach(([namespace, resources]) => {
            i18n.addResourceBundle(
              currentLang,
              namespace,
              resources,
              true,
              true
            );
          });
        }
      } catch (error) {
        console.error("Failed to load translations from API:", error);
      }
    }

    return result;
  };

  return i18n;
}

// Garantir inicialização do i18n
const i18nInstance = initI18n();

export { SUPPORTED_LANGUAGES, LANGUAGES_LIST };
export default i18nInstance;
