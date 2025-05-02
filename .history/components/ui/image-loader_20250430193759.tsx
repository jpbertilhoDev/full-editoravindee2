"use client";

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  fadeIn?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  className,
  containerClassName,
  fadeIn = true,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(!priority);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(src as string);
  
  // Reset state when src changes
  useEffect(() => {
    if (src !== imageSrc && !error) {
      setImageSrc(src as string);
      if (!priority) setLoading(true);
    }
  }, [src, imageSrc, error, priority]);
  
  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/80 animate-pulse" />
      )}
      
      <Image
        src={error ? fallbackSrc : imageSrc}
        alt={alt}
        className={cn(
          className,
          fadeIn && "transition-opacity duration-500",
          loading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        priority={priority}
        {...props}
      />
    </div>
  );
}

export default OptimizedImage; 