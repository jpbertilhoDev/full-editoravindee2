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
  return price.toFixed(2).replace('.', ',');
}

// Função para separar o valor inteiro e decimal do preço (formatação manual)
export function splitPrice(price: number): { integer: string, decimal: string } {
  const [integer, decimal] = price.toFixed(2).split('.');
  return {
    integer,
    decimal
  };
}
