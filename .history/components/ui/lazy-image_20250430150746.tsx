"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  showPlaceholder?: boolean;
  aspectRatio?: string;
  eager?: boolean;
}

export default function LazyImage({
  src,
  alt,
  fallbackSrc = '',
  className,
  containerClassName,
  showPlaceholder = true,
  aspectRatio = 'aspect-video',
  eager = false,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isInView, setIsInView] = useState(eager);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Configurar observer para detectar quando a imagem está visível
  useEffect(() => {
    if (!imgRef.current || eager) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      });
    }, {
      rootMargin: '200px 0px', // Carrega a imagem quando está a 200px de entrar na viewport
      threshold: 0.01,
    });

    observer.observe(containerRef.current!);

    return () => {
      observer.disconnect();
    };
  }, [eager]);

  // Efeito para ativar transição em imagens lazy loaded
  useEffect(() => {
    if (loaded && containerRef.current?.parentElement?.classList.contains('lazy-load')) {
      containerRef.current.parentElement.classList.add('loaded');
    }
  }, [loaded]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-gray-100",
        aspectRatio,
        containerClassName
      )}
    >
      {/* Placeholder enquanto carrega */}
      {showPlaceholder && !loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <FileText className="w-8 h-8 text-gray-300" />
        </div>
      )}

      {/* Fallback em caso de erro */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <FileText className="h-10 w-10 text-gray-300" />
        </div>
      )}

      {/* Renderiza a imagem apenas quando visível */}
      {(isInView || eager) && (
        <img
          ref={imgRef}
          src={error && fallbackSrc ? fallbackSrc : src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
            "object-cover w-full h-full",
            className
          )}
          loading={eager ? "eager" : "lazy"}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
} 