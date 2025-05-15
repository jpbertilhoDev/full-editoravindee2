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

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
  className?: string;
}

export function LanguageSwitcher({ 
  variant = 'default',
  className = ''
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Encontra o idioma atual
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  
  // Alterna o idioma
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    
    // Armazena a preferência de idioma do usuário em localStorage para persistência
    localStorage.setItem('i18nextLng', langCode);
  };
  
  // Renderiza versão minimal (apenas ícone) ou padrão
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
          aria-label="Mudar idioma"
        >
          {variant === 'minimal' ? (
            <Globe className="h-4 w-4" />
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-base">{currentLanguage.flag}</span>
              <span className="text-sm">{currentLanguage.code.toUpperCase()}</span>
              <Globe className="h-3.5 w-3.5 ml-0.5 text-gray-500" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="min-w-[140px] bg-white rounded-lg shadow-md p-1">
        {languages.map((language) => (
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