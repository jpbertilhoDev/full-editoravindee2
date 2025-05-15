"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslation } from 'react-i18next';
import { LANGUAGES_LIST } from '@/app/i18n/settings';
import { ChevronDown, Globe } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.substring(0, 2) || 'pt';
  
  // Encontrar o idioma atual na lista
  const currentLanguage = LANGUAGES_LIST.find(lang => lang.code === currentLang) || LANGUAGES_LIST[0];
  
  // Função para mudar idioma
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 relative">
                <span className="text-lg">{currentLanguage.flag}</span>
                <ChevronDown className="h-3 w-3 absolute bottom-0 right-0 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">Mudar idioma</p>
          </TooltipContent>
        </Tooltip>
        
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center px-2 pt-1 pb-2 mb-1 border-b">
            <Globe className="mr-2 h-4 w-4" />
            <span className="text-xs font-medium">Idiomas ({LANGUAGES_LIST.length})</span>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
            {LANGUAGES_LIST.map((language) => (
              <DropdownMenuItem 
                key={language.code}
                className={`flex items-center gap-2 cursor-pointer ${currentLang === language.code ? 'bg-accent/50' : ''}`}
                onClick={() => changeLanguage(language.code)}
              >
                <span className="text-base mr-1">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="text-sm">{language.name}</span>
                  {language.native && (
                    <span className="text-xs text-muted-foreground">Idioma nativo</span>
                  )}
                </div>
                {currentLang === language.code && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary"></div>
                )}
              </DropdownMenuItem>
            ))}
          </div>
          
          <div className="p-2 pt-1 mt-1 border-t">
            <p className="text-[10px] text-muted-foreground">
              Traduções automáticas por DeepL
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
} 