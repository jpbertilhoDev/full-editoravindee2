"use client";

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  product: Product;
  className?: string;
  iconClassName?: string;
  variant?: 'default' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const WishlistButton = ({ 
  product, 
  className = "", 
  iconClassName = "",
  variant = 'icon',
  size = 'md',
  showText = false
}: WishlistButtonProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isActive = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isActive) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return "h-3 w-3";
      case 'lg': return "h-5 w-5";
      default: return "h-4 w-4";
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return "h-7 w-7";
      case 'lg': return "h-10 w-10";
      default: return "h-8 w-8";
    }
  };

  const renderIcon = () => (
    <Heart className={cn(
      getIconSize(),
      isActive && "fill-current",
      iconClassName
    )} />
  );

  if (variant === 'text') {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-2",
          isActive ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50" : "",
          className
        )}
        onClick={handleToggleWishlist}
      >
        {renderIcon()}
        <span>{isActive ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</span>
      </Button>
    );
  }

  if (variant === 'default') {
    return (
      <Button
        variant={isActive ? "default" : "outline"}
        size="sm"
        className={cn(
          "gap-2 rounded-full",
          isActive 
            ? "bg-rose-500 hover:bg-rose-600 text-white" 
            : "border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300",
          className
        )}
        onClick={handleToggleWishlist}
      >
        {renderIcon()}
        {showText && (
          <span>{isActive ? 'Remover' : 'Favoritar'}</span>
        )}
      </Button>
    );
  }

  // Default icon variant
  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        getButtonSize(),
        "rounded-full shadow-md",
        isActive 
          ? "bg-rose-500 text-white hover:bg-rose-600" 
          : "bg-white/90 dark:bg-gray-800/90 hover:bg-white",
        className
      )}
      onClick={handleToggleWishlist}
    >
      {renderIcon()}
      <span className="sr-only">
        {isActive ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
      </span>
    </Button>
  );
};

export default WishlistButton; 