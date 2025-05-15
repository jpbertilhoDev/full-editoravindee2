"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Cpu, RefreshCw } from 'lucide-react';

export function TestTranslation() {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>('');
  const [isUsingApi, setIsUsingApi] = useState<boolean>(true);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  
  useEffect(() => {
    setCurrentLanguage(i18n.language || 'pt');
    
    // Simular tempo de carregamento da API
    const startTime = performance.now();
    
    // Verificar se as traduções foram carregadas
    const checkTranslations = () => {
      if (t('hero.tagline', { defaultValue: '' }) !== '') {
        const endTime = performance.now();
        setLoadTime(Math.round(endTime - startTime));
      } else {
        setTimeout(checkTranslations, 100);
      }
    };
    
    checkTranslations();
  }, [i18n.language, t]);

  return (
    <Card className="max-w-md mx-auto my-8 bg-white/90 backdrop-blur-sm">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#08a4a7] flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            Sistema de Tradução Automática
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`${
              isUsingApi 
              ? 'bg-green-50 text-green-600 border-green-200' 
              : 'bg-orange-50 text-orange-600 border-orange-200'
            }`}
          >
            {isUsingApi ? 'API' : 'Arquivo'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Idioma atual:</p>
            <p className="font-bold flex items-center">
              {currentLanguage === 'pt' ? '🇵🇹 Português' : 
               currentLanguage === 'en' ? '🇺🇸 English' : 
               currentLanguage === 'es' ? '🇪🇸 Español' : 
               currentLanguage === 'fr' ? '🇫🇷 Français' :
               currentLanguage === 'de' ? '🇩🇪 Deutsch' : currentLanguage}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Tempo de carregamento:</p>
            <p className="font-medium flex items-center justify-end">
              <RefreshCw className="mr-1 h-3 w-3 text-gray-500" />
              {loadTime ? `${loadTime}ms` : 'Carregando...'}
            </p>
          </div>
        </div>
        
        <div className="space-y-3 mt-2">
          <div className="flex items-center">
            <Cpu className="mr-2 h-4 w-4 text-blue-500" />
            <h3 className="font-medium">Traduções via API:</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="rounded-md p-2 bg-gray-50 border border-gray-100">
              <span className="font-semibold">hero.tagline:</span>{" "}
              <span className="text-gray-700">{t('hero.tagline')}</span>
            </li>
            <li className="rounded-md p-2 bg-gray-50 border border-gray-100">
              <span className="font-semibold">hero.title:</span>{" "}
              <span className="text-gray-700">{t('hero.title')}</span>
            </li>
            <li className="rounded-md p-2 bg-gray-50 border border-gray-100">
              <span className="font-semibold">hero.description:</span>{" "} 
              <span className="text-gray-700">{t('hero.description')}</span>
            </li>
            <li className="rounded-md p-2 bg-gray-50 border border-gray-100">
              <span className="font-semibold">hero.shop_now:</span>{" "}
              <span className="text-gray-700">{t('hero.shop_now')}</span>
            </li>
            <li className="rounded-md p-2 bg-gray-50 border border-gray-100">
              <span className="font-semibold">hero.bestsellers:</span>{" "}
              <span className="text-gray-700">{t('hero.bestsellers')}</span>
            </li>
          </ul>
          <p className="text-xs text-gray-500 italic mt-2">
            Esses textos são traduzidos automaticamente via API de tradução.
            {currentLanguage !== 'pt' && ' Os textos foram traduzidos para ' + 
              (currentLanguage === 'en' ? 'inglês' : 
              currentLanguage === 'es' ? 'espanhol' : 
              currentLanguage === 'fr' ? 'francês' : 
              currentLanguage === 'de' ? 'alemão' : currentLanguage)
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default TestTranslation; 