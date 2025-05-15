"use client";

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

interface TranslationProviderProps {
  children: React.ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [isI18nReady, setIsI18nReady] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  
  // Carregar o i18n apenas no cliente
  useEffect(() => {
    // Verificar se estamos no ambiente do cliente
    const isClient = typeof window !== "undefined";
    
    if (isClient) {
      // Garantir que o i18n foi inicializado antes de fazer qualquer operação
      const initializeI18n = async () => {
        try {
          if (!i18n.isInitialized) {
            // Tentar reinicializar se necessário
            await new Promise(resolve => {
              // Esperar um curto período para que a inicialização ocorra
              const checkInterval = setInterval(() => {
                if (i18n.isInitialized) {
                  clearInterval(checkInterval);
                  resolve(true);
                }
              }, 100);
              
              // Timeout após 2 segundos
              setTimeout(() => {
                clearInterval(checkInterval);
                resolve(false);
              }, 2000);
            });
          }
          
          console.log('i18n status in TranslationProvider:', i18n.isInitialized ? 'Initialized' : 'Not initialized');
          setIsI18nReady(true);
        } catch (error) {
          console.error('Erro ao inicializar i18n:', error);
          // Permitir que o aplicativo continue mesmo com erro de i18n
          setIsI18nReady(true);
        } finally {
          setIsLoadingComplete(true);
        }
      };
      
      initializeI18n();
    } else {
      // No lado do servidor, apenas continue
      setIsI18nReady(true);
      setIsLoadingComplete(true);
    }
  }, []);

  // Renderizar um indicador de carregamento enquanto i18n está sendo inicializado
  if (!isLoadingComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#08a4a7]"></div>
      </div>
    );
  }

  // Renderizar apenas um fragmento se i18n não estiver pronto
  if (!isI18nReady) {
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 