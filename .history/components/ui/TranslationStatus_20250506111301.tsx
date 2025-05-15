"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SUPPORTED_LANGUAGES } from '@/app/i18n/settings';

export default function TranslationStatus() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [expanded, setExpanded] = useState(false);
  
  // Lista de idiomas disponíveis para DeepL
  const supportedLanguages = Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
    code,
    name: info.name,
    flag: info.flag
  }));
  
  useEffect(() => {
    // Detectar idioma atual
    const langCode = i18n.language?.substring(0, 2) || 'pt';
    setCurrentLanguage(langCode);
  }, [i18n.language]);
  
  // Não mostrar em português (idioma padrão/nativo do site)
  if (currentLanguage === 'pt') {
    return null;
  }

  // Encontrar o idioma atual na lista de suportados
  const currentLangInfo = supportedLanguages.find(lang => lang.code === currentLanguage) || 
    { code: currentLanguage, name: currentLanguage, flag: '🌐' };

  return (
    <TooltipProvider>
      <div className={`fixed bottom-2 right-2 z-50 rounded-md bg-white/80 backdrop-blur-sm shadow-md border border-gray-200 transition-all duration-300 ${expanded ? 'min-w-[180px]' : ''}`}>
        {/* Cabeçalho minimizado */}
        <div className="flex items-center gap-2 p-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <Globe className="h-4 w-4 text-blue-500" />
          <div className="flex-grow">
            <span className="text-xs text-gray-700 flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="underline decoration-dotted">DeepL</span>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="w-[180px] text-xs">
                    Este site está sendo traduzido automaticamente por DeepL API para {currentLangInfo.name}
                  </p>
                </TooltipContent>
              </Tooltip>
              <span className="ml-1">
                {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </span>
            </span>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1 px-2">
            <span>{currentLangInfo.flag}</span>
            <span className="text-[10px]">{currentLangInfo.code.toUpperCase()}</span>
          </Badge>
        </div>
        
        {/* Painel expandido */}
        {expanded && (
          <div className="p-2 pt-0 border-t border-gray-100">
            <div className="text-[10px] text-gray-500 mb-1">
              Gerado por DeepL, o serviço de tradução nº 1
            </div>
            <div className="grid grid-cols-3 gap-1">
              {supportedLanguages.slice(0, 6).map(lang => (
                <div
                  key={lang.code}
                  className={`text-[10px] p-1 flex items-center gap-1 rounded hover:bg-gray-100 cursor-pointer ${
                    lang.code === currentLanguage ? 'bg-blue-50 font-medium' : ''
                  }`}
                  onClick={() => i18n.changeLanguage(lang.code)}
                >
                  <span>{lang.flag}</span>
                  <span className="truncate">{lang.code.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
} 