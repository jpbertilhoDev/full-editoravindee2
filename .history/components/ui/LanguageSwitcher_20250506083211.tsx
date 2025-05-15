"use client";

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'expanded';
  className?: string;
}

// Versão simplificada que apenas oferece alternar entre português e inglês
export function LanguageSwitcher({ 
  variant = 'default',
  className = ''
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  
  // Função para mudar o idioma
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
  };
  
  // Lista expandida de idiomas incluindo alemão e francês
  const languages = [
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];
  
  const currentLanguage = i18n.language?.substring(0, 2) || 'pt';
  const currentLangObject = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className={cn("gap-1 rounded-md p-1 bg-transparent", className)}
        >
          <Globe className="h-4 w-4 mr-1" />
          <span>{currentLangObject.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-sm border border-[#08a4a7]/20">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 cursor-pointer",
              lang.code === currentLanguage ? 'bg-[#08a4a7]/10 font-medium' : 'hover:bg-[#08a4a7]/5'
            )}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher; 