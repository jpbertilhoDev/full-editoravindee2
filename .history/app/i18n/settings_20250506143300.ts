// Configurações e dados estáticos do i18n que podem ser importados em componentes de servidor

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

export const DEFAULT_LANGUAGE = "pt";
export const DEFAULT_NAMESPACE = "common";

// Mapeamento de códigos de idioma para o formato do DeepL
export const LANGUAGE_MAP: Record<string, string> = {
  pt: "PT-PT", // Português (Portugal)
  en: "EN", // Inglês
  es: "ES", // Espanhol
  fr: "FR", // Francês
  de: "DE", // Alemão
  nl: "NL", // Holandês
  it: "IT", // Italiano
  pl: "PL", // Polonês
  ru: "RU", // Russo
  ja: "JA", // Japonês
  zh: "ZH", // Chinês
};

export const fallbackLng = 'pt';
export const languages = ['pt', 'en', 'es', 'fr', 'de'];
export const defaultNamespace = 'common';

/**
 * Obtém as opções básicas de configuração do i18next
 * Estas opções são compartilhadas entre cliente e servidor
 */
export function getOptions(lng = fallbackLng, ns = defaultNamespace) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNamespace,
    defaultNS: defaultNamespace,
    ns,
    // Configurações gerais
    debug: process.env.NODE_ENV === 'development',
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
  };
}
