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
  
  // Função simplificada para mudar o idioma
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
  };
  
  // Lista simplificada de idiomas
  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];
  
  const currentLanguage = i18n.language?.startsWith('pt') ? 'pt' : 'en';
  const currentLangObject = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`gap-1 ${className}`}
        >
          <Globe className="h-4 w-4 mr-1" />
          <span>{currentLangObject.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center gap-2 px-3 py-2 ${
              lang.code === currentLanguage ? 'bg-gray-100 font-medium' : ''
            }`}
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