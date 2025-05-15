"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';

export default function TranslationStatus() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [isAutoTranslated, setIsAutoTranslated] = useState(false);
  
  useEffect(() => {
    // Detectar idioma atual
    const langCode = i18n.language?.substring(0, 2) || 'pt';
    setCurrentLanguage(langCode);
    
    // Verificar se está usando tradução automática (API)
    // No mundo real, isso viria da configuração ou resposta da API
    setIsAutoTranslated(true);
  }, [i18n.language]);
  
  // Não mostrar em português (idioma padrão/nativo do site)
  if (currentLanguage === 'pt') {
    return null;
  }
  
  return (
    <div className="fixed bottom-2 right-2 z-50 flex items-center gap-2 p-2 rounded-md bg-white/80 backdrop-blur-sm shadow-md border border-gray-200">
      <InfoIcon className="h-4 w-4 text-blue-500" />
      <span className="text-xs text-gray-700">
        Tradução via <span className="font-semibold text-blue-600">DeepL API</span>:
      </span>
      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
        {currentLanguage === 'en' ? 'English' : 
         currentLanguage === 'es' ? 'Español' : 
         currentLanguage === 'fr' ? 'Français' :
         currentLanguage === 'de' ? 'Deutsch' : currentLanguage}
      </Badge>
    </div>
  );
} 