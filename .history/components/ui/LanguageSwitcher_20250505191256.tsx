"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { locales } from '@/lib/i18n-config';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'expanded';
  className?: string;
}

export function LanguageSwitcher({ 
  variant = 'default',
  className = ''
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Encontra o idioma atual
  const currentLanguage = locales.find(lang => lang.code === i18n.language) || locales[0];
  
  // Alterna o idioma
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    
    // Armazena a preferência de idioma do usuário em localStorage para persistência
    localStorage.setItem('i18nextLng', langCode);
  };
  
  // Renderiza diferentes variantes
  if (variant === 'minimal') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className={cn(
              "rounded-full focus:ring-1 focus:ring-[#08a4a7] h-8 w-8 p-0",
              className
            )}
            aria-label={t('accessibility.change_language', 'Mudar idioma')}
            title={`${t('accessibility.current_language', 'Idioma atual')}: ${currentLanguage.name}`}
          >
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="min-w-[180px] bg-white rounded-lg shadow-md p-1">
          {locales.map((language) => (
            <DropdownMenuItem
              key={language.code}
              className={cn(
                "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm cursor-pointer focus:bg-gray-50 hover:bg-gray-50 transition-colors",
                language.code === i18n.language && "bg-gray-50 font-medium"
              )}
              onClick={() => changeLanguage(language.code)}
            >
              <span className="text-base">{language.flag}</span>
              <span className="flex-1">{language.name}</span>
              {language.code === i18n.language && (
                <div className="h-1.5 w-1.5 bg-[#08a4a7] rounded-full" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  if (variant === 'expanded') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={cn(
              "rounded-md focus:ring-1 focus:ring-[#08a4a7] px-3 min-w-[140px]",
              className
            )}
            aria-label={t('accessibility.change_language', 'Mudar idioma')}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-base">{currentLanguage.flag}</span>
              <span className="text-sm">{currentLanguage.name}</span>
              <Globe className="h-3.5 w-3.5 ml-auto text-gray-500" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="min-w-[180px] bg-white rounded-lg shadow-md p-1">
          {locales.map((language) => (
            <DropdownMenuItem
              key={language.code}
              className={cn(
                "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm cursor-pointer focus:bg-gray-50 hover:bg-gray-50 transition-colors",
                language.code === i18n.language && "bg-gray-50 font-medium"
              )}
              onClick={() => changeLanguage(language.code)}
            >
              <span className="text-base">{language.flag}</span>
              <span className="flex-1">{language.name}</span>
              {language.code === i18n.language && (
                <div className="h-1.5 w-1.5 bg-[#08a4a7] rounded-full" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  // Default variant
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className={cn(
            "rounded-full focus:ring-1 focus:ring-[#08a4a7]",
            className
          )}
          aria-label={t('accessibility.change_language', 'Mudar idioma')}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-base">{currentLanguage.flag}</span>
            <span className="text-sm">{currentLanguage.code.toUpperCase()}</span>
            <Globe className="h-3.5 w-3.5 ml-0.5 text-gray-500" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="min-w-[180px] bg-white rounded-lg shadow-md p-1">
        {locales.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={cn(
              "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm cursor-pointer focus:bg-gray-50 hover:bg-gray-50 transition-colors",
              language.code === i18n.language && "bg-gray-50 font-medium"
            )}
            onClick={() => changeLanguage(language.code)}
          >
            <span className="text-base">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {language.code === i18n.language && (
              <div className="h-1.5 w-1.5 bg-[#08a4a7] rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 