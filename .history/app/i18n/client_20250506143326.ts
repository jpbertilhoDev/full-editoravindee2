"use client";

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { getOptions } from './settings';

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

// Variável para controlar se o i18n já foi inicializado
let initialized = false;

/**
 * Inicializa o i18n apenas uma vez e retorna a instância
 */
function initI18next() {
  if (initialized) {
    return i18next;
  }

  i18next
    .use(HttpBackend) // Carrega traduções via http
    .use(LanguageDetector) // Detecta idioma do navegador
    .use(initReactI18next) // Passa o i18n para o react-i18next
    .init({
      ...getOptions(),
      // Configurações específicas para o cliente
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      // Opções de detecção de idioma
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'navigator'],
        lookupQuerystring: 'lang',
        lookupCookie: 'i18next',
        lookupLocalStorage: 'i18nextLng',
        caches: ['localStorage', 'cookie'],
      },
      // Gerenciamento de chaves faltantes
      saveMissing: process.env.NODE_ENV === 'development',
      missingKeyHandler: (lng, ns, key) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Chave de tradução faltando: [${lng}] ${ns}:${key}`);
        }
      },
    });

  initialized = true;
  return i18next;
}

// Inicializa e exporta a instância do i18n
export default initI18next();
