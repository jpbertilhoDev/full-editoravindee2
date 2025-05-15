"use client";

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

interface TranslationProviderProps {
  children: React.ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [isI18nReady, setIsI18nReady] = useState(false);
  
  // Carregar o i18n apenas no cliente
  useEffect(() => {
    // Verificar se estamos no ambiente do cliente
    const isClient = typeof window !== "undefined";
    
    if (isClient) {
      // Garantir que o i18n foi inicializado antes de fazer qualquer operação
      if (!i18n.isInitialized) {
        // As configurações já estão no arquivo i18n.ts importado
        console.log('i18n initialized in TranslationProvider');
      }
      setIsI18nReady(true);
    }
  }, []);

  // Renderizar apenas um fragmento até que i18n esteja pronto
  if (!isI18nReady) {
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 