"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// Configuração abrangente e robusta
const initI18n = () => {
  // Verificar se estamos no browser para evitar erros durante SSR
  if (typeof window === "undefined") {
    // Retornar uma instância dummy para SSR
    return i18n;
  }

  // Se já estiver inicializado, não reinicializar
  if (i18n.isInitialized) {
    return i18n;
  }

  try {
    i18n
      .use(HttpBackend) // Carrega traduções de arquivos
      .use(initReactI18next)
      .use(LanguageDetector)
      .init({
        // Caminho para carregar os arquivos de tradução
        backend: {
          loadPath: "/locales/{{lng}}/{{ns}}.json",
          requestOptions: {
            cache: "no-store", // Desativar cache para resolver problemas de atualização
          },
        },
        load: "languageOnly", // Carrega somente o código do idioma (pt) e não a região (pt-BR)
        fallbackLng: "pt",
        supportedLngs: ["pt", "en", "de", "fr"],
        defaultNS: "common",
        ns: ["common"],
        interpolation: {
          escapeValue: false,
        },
        detection: {
          order: ["localStorage", "navigator"],
          caches: ["localStorage"],
          lookupLocalStorage: "i18nextLng",
        },
        react: {
          useSuspense: false,
        },
        // Debug em desenvolvimento
        debug: process.env.NODE_ENV === "development",
      });
  } catch (error) {
    console.error("Erro ao inicializar i18n:", error);
  }

  return i18n;
};

export default initI18n();
