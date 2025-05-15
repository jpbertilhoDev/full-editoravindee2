'use client';

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/app/i18n/client';

interface TranslationProviderProps {
  children: React.ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
} 