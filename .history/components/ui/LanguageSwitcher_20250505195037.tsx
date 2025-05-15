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

export default function LanguageSwitcher({ 
  variant = 'default',
  className
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  const handleLanguageChange = async (locale: string) => {
    try {
      setIsChangingLanguage(true);
      await i18n.changeLanguage(locale);
      localStorage.setItem('preferredLanguage', locale);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChangingLanguage(false);
    }
  };

  const currentLocale = locales.find(l => l.code === i18n.language) || locales[0];

  if (variant === 'expanded') {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">
            {t('accessibility.current_language')}: {currentLocale.name} {currentLocale.flag}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {locales.map((locale) => (
            <Button
              key={locale.code}
              variant={locale.code === i18n.language ? "default" : "outline"}
              className="justify-start"
              disabled={isChangingLanguage}
              onClick={() => handleLanguageChange(locale.code)}
            >
              <span className="mr-2 text-lg">{locale.flag}</span>
              {locale.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("rounded-full", className)}
            aria-label={t('accessibility.change_language')}
          >
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[150px]">
          {locales.map((locale) => (
            <DropdownMenuItem
              key={locale.code}
              onClick={() => handleLanguageChange(locale.code)}
              disabled={isChangingLanguage}
              className={cn(
                "flex items-center cursor-pointer",
                locale.code === i18n.language && "bg-accent font-medium"
              )}
            >
              <span className="mr-2 text-lg">{locale.flag}</span>
              {locale.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn("gap-1 px-2", className)}
          aria-label={t('accessibility.change_language')}
          disabled={isChangingLanguage}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLocale.name}</span>
          <span>{currentLocale.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLanguageChange(locale.code)}
            disabled={isChangingLanguage}
            className={cn(
              "flex items-center cursor-pointer",
              locale.code === i18n.language && "bg-accent font-medium"
            )}
          >
            <span className="mr-2 text-lg">{locale.flag}</span>
            {locale.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 