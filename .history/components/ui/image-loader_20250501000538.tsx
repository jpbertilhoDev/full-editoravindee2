"use client";

import React, { useState, useCallback, memo } from 'react';
import Image, { ImageProps } from 'next/image';
import { imageOptimizer } from '@/lib/optimizations';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fallbackSrc?: string;
  isHero?: boolean;
  base64Placeholder?: string;
  wrapperClassName?: string;
  disableAnimation?: boolean;
}

// Aplicando memo para evitar re-renderizações quando as props não mudam
const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc = '/images/image-placeholder.jpg',
  isHero = false,
  base64Placeholder,
  wrapperClassName,
  disableAnimation = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!props.priority);
  const [error, setError] = useState(false);

  // Usando useCallback para otimizar os handlers de eventos
  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    setIsLoading(false);
  }, []);

  // Adiciona otimizações baseadas nas propriedades
  const optimizedProps = {
    ...imageOptimizer.responsiveSizes(),
    ...imageOptimizer.priority(isHero),
    ...imageOptimizer.blurPlaceholder(base64Placeholder),
  };

  return (
    <div className={cn(
      "relative overflow-hidden",
      isLoading && !disableAnimation && "animate-pulse bg-gray-200 dark:bg-gray-800",
      wrapperClassName
    )}>
      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...optimizedProps}
        {...props}
      />

      {/* Overlay de carregamento - só exibe se estiver carregando e animações estiverem ativadas */}
      {isLoading && !disableAnimation && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 bg-opacity-50">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});

export default OptimizedImage; 