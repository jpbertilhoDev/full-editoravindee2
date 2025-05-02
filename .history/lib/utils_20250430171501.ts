import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

  // Obter item do cache
  get(key: string): any {
    const item = this.cache.get(key);

    // Item não existe
    if (!item) return undefined;

    // Item expirou
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  // Remover item do cache
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Limpar itens expirados do cache
  purgeExpired(): void {
    const now = Date.now();
    this.cache.forEach((item, key) => {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    });
  }

  // Limpar todo o cache
  clear(): void {
    this.cache.clear();
  }
}

// Verificar se uma string é válida
export function isValidString(str: any): boolean {
  return typeof str === "string" && str.trim().length > 0;
}

// Formatador de preço para moeda EUR
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

// Gerar slug a partir de string
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

// Truncar texto com número específico de palavras e adicionar reticências
export function truncateWords(text: string, wordCount: number): string {
  if (!text) return "";

  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) return text;

  return words.slice(0, wordCount).join(" ") + "...";
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
