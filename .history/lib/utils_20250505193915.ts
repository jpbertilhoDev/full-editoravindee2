import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatPrice as i18nFormatPrice } from "./i18n-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Use a formatação de acordo com o locale atual
export function formatPrice(price: number): string {
  // Verificar se estamos no browser antes de acessar localStorage ou navigator
  const isClient = typeof window !== "undefined";
  
  // Default locale para o servidor
  const locale = isClient 
    ? localStorage.getItem("i18nextLng") || navigator.language
    : "pt-BR";

  return i18nFormatPrice(price, locale);
}

// Mantidas para compatibilidade com código existente
export function formatPriceEUR(price: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// Função para formatar preço sem o símbolo de moeda, usando vírgula para decimal (padrão europeu)
export function formatPriceWithoutSymbol(price: number): string {
  return price.toFixed(2).replace(".", ",");
}

// Função para separar o valor inteiro e decimal do preço (formatação manual)
export function splitPrice(price: number): {
  integer: string;
  decimal: string;
} {
  const [integer, decimal] = price.toFixed(2).split(".");
  return {
    integer,
    decimal,
  };
}

// Hook personalizado para formatar preço de acordo com o locale atual no i18n
export function useLocalizedPrice() {
  // A obtenção do idioma deve ser feita em um componente cliente, não aqui diretamente
  return (price: number, locale = "pt-BR") => {
    return i18nFormatPrice(price, locale);
  };
}

// Função para criar um valor chave de cache
export function createCacheKey(
  prefix: string,
  ...values: (string | number | boolean | undefined)[]
): string {
  const key = values
    .filter(Boolean)
    .map((value) => String(value).toLowerCase().trim())
    .join("-");
  return `${prefix}:${key}`;
}

// Hook para throttle de funções
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...funcArgs: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall < wait) return;
    lastCall = now;
    return func(...args);
  };
}

// Função para formatação de preço - DEPRECATED em favor de useLocalizedPrice
export function formatCurrency(
  value: number,
  locale = "pt-BR",
  currency = "BRL"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Função para limitar o tamanho de uma string com ellipsis
export function truncateString(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

// Função para converter objeto para query string
export function objectToQueryString(obj: Record<string, any>): string {
  return Object.keys(obj)
    .filter(
      (key) => obj[key] !== undefined && obj[key] !== null && obj[key] !== ""
    )
    .map((key) => {
      const value =
        typeof obj[key] === "object" ? JSON.stringify(obj[key]) : obj[key];
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join("&");
}

// Função para gerar slug a partir de um texto
export function generateSlug(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

// Função de debounce otimizada para reduzir chamadas de função excessivas
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Cache em memória simplificado com expiração
export class MemoryCache {
  private cache: Map<string, { value: any; expiry: number }> = new Map();

  // Definir item no cache com TTL em segundos (padrão 5 minutos)
  set(key: string, value: any, ttlSeconds = 300): void {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiry });
  }

  // Obter item do cache, retorna undefined se expirado ou não encontrado
  get(key: string): any | undefined {
    const item = this.cache.get(key);

    // Verificar se o item existe e não expirou
    if (item && item.expiry > Date.now()) {
      return item.value;
    }

    // Se o item expirou, remover do cache
    if (item) {
      this.cache.delete(key);
    }

    return undefined;
  }

  // Verificar se item existe e é válido
  has(key: string): boolean {
    const item = this.cache.get(key);

    if (item && item.expiry > Date.now()) {
      return true;
    }

    if (item) {
      this.cache.delete(key);
    }

    return false;
  }

  // Remover item do cache
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Limpar todo o cache
  clear(): void {
    this.cache.clear();
  }
}

// Singleton para uso em toda a aplicação
export const appCache = new MemoryCache();

// Formatador de data para uso em todo o aplicativo
export function formatDate(date: Date | string, locale = "pt-BR"): string {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Função para truncar texto com quantidade específica de palavras
export function truncateText(text: string, maxWords: number): string {
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

// Função para gerar slugs a partir de texto
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

// Função para extrair iniciais de um nome
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
