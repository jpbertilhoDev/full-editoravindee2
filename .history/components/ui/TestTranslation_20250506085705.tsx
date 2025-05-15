"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TestTranslation() {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>('');
  
  useEffect(() => {
    setCurrentLanguage(i18n.language || 'pt');
  }, [i18n.language]);

  return (
    <Card className="max-w-md mx-auto my-8 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-[#08a4a7]">
          Sistema de Tradução
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-b pb-2">
          <p className="text-sm text-gray-500">Idioma atual:</p>
          <p className="font-bold">{currentLanguage}</p>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium">Traduções do Hero:</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-semibold">hero.tagline:</span>{" "}
              <span className="text-gray-700">{t('hero.tagline')}</span>
            </li>
            <li>
              <span className="font-semibold">hero.title:</span>{" "}
              <span className="text-gray-700">{t('hero.title')}</span>
            </li>
            <li>
              <span className="font-semibold">hero.description:</span>{" "} 
              <span className="text-gray-700">{t('hero.description')}</span>
            </li>
            <li>
              <span className="font-semibold">hero.shop_now:</span>{" "}
              <span className="text-gray-700">{t('hero.shop_now')}</span>
            </li>
            <li>
              <span className="font-semibold">hero.bestsellers:</span>{" "}
              <span className="text-gray-700">{t('hero.bestsellers')}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default TestTranslation; 