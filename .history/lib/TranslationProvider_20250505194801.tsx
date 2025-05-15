"use client";

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

interface TranslationProviderProps {
  children: React.ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  // Carregar o i18n apenas no cliente
  useEffect(() => {
    // Garantir que o i18n foi inicializado antes de fazer qualquer operação
    if (!i18n.isInitialized) {
      // As configurações já estão no arquivo i18n.ts importado
      console.log('i18n initialized in TranslationProvider');
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 