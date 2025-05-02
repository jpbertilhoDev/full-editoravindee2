import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { ImageProps } from 'next/image';

/**
 * Hook para carregar componentes apenas quando necessário (lazy loading)
 * @param condition Condição para carregar o componente
 * @returns Boolean indicando se o componente deve ser renderizado
 */
export function useDelayedRender(condition: boolean): boolean {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (condition && !shouldRender) {
      const timer = setTimeout(() => setShouldRender(true), 500);
      return () => clearTimeout(timer);
    }
    if (!condition && shouldRender) {
      setShouldRender(false);
    }
  }, [condition, shouldRender]);

  return shouldRender;
}

/**
 * Hook para evitar recarregar componentes quando a rota não muda efetivamente
 */
export function useEffectivePathChange() {
  const pathname = usePathname();
  const [effectivePath, setEffectivePath] = useState(pathname);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    // Apenas considera mudança efetiva quando a rota principal muda
    // Ignora mudanças de hash ou query params
    const mainPath = pathname?.split('#')[0].split('?')[0];
    const currentMainPath = effectivePath?.split('#')[0].split('?')[0];
    
    if (mainPath !== currentMainPath) {
      setEffectivePath(pathname);
      setHasChanged(true);
    } else {
      setHasChanged(false);
    }
  }, [pathname, effectivePath]);

  return { effectivePath, hasChanged };
}

/**
 * Funções para otimização de imagens
 */
export const imageOptimizer = {
  /**
   * Calcula tamanhos responsivos para imagens
   * @returns Configuração de tamanhos para componente Image do Next
   */
  responsiveSizes: (): Pick<ImageProps, 'sizes'> => ({
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  }),

  /**
   * Prioriza imagens essenciais para melhorar o LCP
   * @param isHero Se a imagem é uma imagem crítica (hero)
   * @returns Configuração de prioridade para componente Image do Next
   */
  priority: (isHero: boolean = false): Pick<ImageProps, 'priority' | 'loading'> => ({
    priority: isHero,
    loading: isHero ? 'eager' : 'lazy'
  }),

  /**
   * Gera placeholder blur (dica: usar junto com biblioteca plaiceholder)
   * @param base64 String base64 da imagem em baixa resolução
   * @returns Configuração de placeholder para componente Image do Next
   */
  blurPlaceholder: (base64?: string): Pick<ImageProps, 'placeholder' | 'blurDataURL'> => ({
    placeholder: base64 ? 'blur' : 'empty',
    blurDataURL: base64
  })
};

/**
 * Detecta se a página está sendo carregada no servidor ou cliente
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Executa código apenas no lado do cliente com segurança
 * @param callback Função a ser executada no lado do cliente
 */
export const runOnClient = (callback: () => void): void => {
  if (isBrowser) {
    callback();
  }
}; 