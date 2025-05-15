"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// Configuração para tradução automática com API
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
      .use(HttpBackend) // Carrega traduções de API
      .use(initReactI18next)
      .use(LanguageDetector)
      .init({
        // Configuração para usar a API de tradução
        backend: {
          // Em vez de carregar de arquivos, usamos nossa API de tradução
          loadPath: '/api/translate?lng={{lng}}&ns={{ns}}&key={{key}}',
          // Permitir consultas complexas na API
          parse: (data) => {
            return typeof data === 'string' ? JSON.parse(data) : data;
          },
          // Função para formatar o URL de requisição
          request: (options, url, payload, callback) => {
            try {
              fetch(url)
                .then(res => res.json())
                .then(data => {
                  callback(null, {
                    status: 200,
                    data: data,
                  });
                })
                .catch(e => {
                  console.error('Erro ao buscar traduções:', e);
                  callback(e, null);
                });
            } catch (e) {
              console.error('Erro na requisição de tradução:', e);
              callback(e, null);
            }
          },
          // Cache para performance
          requestOptions: {
            cache: 'default',
          },
        },
        load: "languageOnly", // Carrega somente o código do idioma (pt) e não a região (pt-BR)
        fallbackLng: "pt",
        supportedLngs: ["pt", "en", "es", "fr", "de"], // Idiomas suportados
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
        // Habilitar cache para melhorar performance
        saveMissing: true,
        missingKeyHandler: (lng, ns, key) => {
          // Log de chaves faltantes para debug
          console.log(`Chave faltante: ${key} em ${lng}/${ns}`);
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
