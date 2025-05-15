"use client";

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/app/i18n/client';

interface TranslationProviderProps {
  children: React.ReactNode;
}

// Versão simplificada e robusta que não usa useEffect, useState ou async
export function TranslationProvider({ children }: TranslationProviderProps) {
  // Não precisamos mais verificar se o i18n está pronto
  // pois o arquivo i18n.ts já faz isso por nós

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
} 