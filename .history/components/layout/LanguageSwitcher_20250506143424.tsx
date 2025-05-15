"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslation } from 'react-i18next';
import { LANGUAGES_LIST } from '@/app/i18n/settings';
import { ChevronDown, Globe } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { setCookie } from 'cookies-next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  
  const currentLanguage = i18n.language || 'pt';
  
  // Encontra as informações do idioma atual
  const currentLangInfo = LANGUAGES_LIST.find(lang => lang.code === currentLanguage) || 
    { code: 'pt', name: 'Português', flag: '🇵🇹', native: true };
  
  // Manipulador para alteração de idioma
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    
    // Armazena preferência de idioma no cookie (1 ano de validade)
    setCookie('i18next', langCode, { maxAge: 31536000, path: '/' });
    
    // Atualize a URL para refletir o novo idioma (opcional)
    if (pathname) {
      router.refresh();
    }
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 relative">
                <span className="text-lg">{currentLangInfo.flag}</span>
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
            {LANGUAGES_LIST.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center gap-2 cursor-pointer ${
                  currentLanguage === lang.code ? 'font-bold bg-accent' : ''
                }`}
              >
                <span className="text-base mr-1">{lang.flag}</span>
                <div className="flex flex-col">
                  <span className="text-sm">{lang.name}</span>
                  {lang.native && (
                    <span className="text-xs text-muted-foreground">Idioma nativo</span>
                  )}
                </div>
                {currentLanguage === lang.code && (
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