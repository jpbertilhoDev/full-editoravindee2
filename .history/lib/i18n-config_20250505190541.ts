export interface Locale {
  code: string;
  name: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
  dateFormat?: string;
  currencySymbol?: string;
  currencyCode?: string;
}

export const locales: Locale[] = [
  {
    code: 'pt',
    name: 'Português',
    flag: '🇵🇹',
    dir: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    currencySymbol: 'R$',
    currencyCode: 'BRL'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    currencySymbol: '$',
    currencyCode: 'USD'
  },
  {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    currencySymbol: '€',
    currencyCode: 'EUR'
  },
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    currencySymbol: '€',
    currencyCode: 'EUR'
  }
];

// Idioma padrão da aplicação
export const defaultLocale = locales[0];

// Formatar preço com base no locale
export function formatPrice(price: number, locale: string): string {
  const localeObj = locales.find(l => l.code === locale) || defaultLocale;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: localeObj.currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// Formatar data com base no locale
export function formatDate(date: Date | string, locale: string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// Verificar se o locale é RTL
export function isRTL(locale: string): boolean {
  const localeObj = locales.find(l => l.code === locale);
  return localeObj?.dir === 'rtl';
} 