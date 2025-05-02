"use client";

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { imageOptimizer } from '@/lib/optimizations';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fallbackSrc?: string;
  isHero?: boolean;
  base64Placeholder?: string;
  wrapperClassName?: string;
}

export default function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc = '/images/image-placeholder.jpg',
  isHero = false,
  base64Placeholder,
  wrapperClassName,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  // Adiciona otimizações baseadas nas propriedades
  const optimizedProps = {
    ...imageOptimizer.responsiveSizes(),
    ...imageOptimizer.priority(isHero),
    ...imageOptimizer.blurPlaceholder(base64Placeholder),
  };

  return (
    <div className={cn(
      "relative overflow-hidden",
      isLoading && "animate-pulse bg-gray-200 dark:bg-gray-800",
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

      {/* Overlay de carregamento */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 bg-opacity-50">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
} 