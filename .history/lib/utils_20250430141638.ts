import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

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

// Função para formatação de preço
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
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

// Função para debounce (útil para inputs de pesquisa)
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...funcArgs: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
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
