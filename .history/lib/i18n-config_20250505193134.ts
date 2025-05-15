"use client";

// Configuração para internacionalização do aplicativo

// Define os idiomas suportados pelo aplicativo com suas respectivas bandeiras
export const locales = [
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

// Configurações monetárias para cada locale
export const currencySettings: Record<
  string,
  { currency: string; locale: string }
> = {
  pt: { currency: "BRL", locale: "pt-BR" },
  en: { currency: "USD", locale: "en-US" },
  de: { currency: "EUR", locale: "de-DE" },
  fr: { currency: "EUR", locale: "fr-FR" },
};

// Função para formatar preço de acordo com o locale
export function formatPrice(price: number, locale: string = "pt-BR"): string {
  // Extrai o código do idioma (primeiros 2 caracteres)
  const langCode = locale.substring(0, 2);

  // Obtém as configurações monetárias para o idioma
  const settings = currencySettings[langCode] || currencySettings.pt;

  // Formata o preço de acordo com o locale e a moeda
  return new Intl.NumberFormat(settings.locale, {
    style: "currency",
    currency: settings.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// Função para formatar datas de acordo com o locale
export function formatDateByLocale(
  date: Date | string,
  locale: string = "pt-BR"
): string {
  if (typeof date === "string") {
    date = new Date(date);
  }

  // Extrai o código do idioma (primeiros 2 caracteres)
  const langCode = locale.substring(0, 2);
  const localeMap: Record<string, string> = {
    pt: "pt-BR",
    en: "en-US",
    de: "de-DE",
    fr: "fr-FR",
  };

  const formattingLocale = localeMap[langCode] || "pt-BR";

  return new Intl.DateTimeFormat(formattingLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Função auxiliar que retorna a língua padrão para o aplicativo
export function getDefaultLanguage(): string {
  return "pt";
}

// Função que retorna todas as configurações de localização
export function getLocalizationSettings() {
  return {
    locales,
    currencySettings,
    defaultLanguage: getDefaultLanguage(),
  };
}
