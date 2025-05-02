"use client"

import React, { useState, memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Bookmark, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { cn, formatPriceWithoutSymbol } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import WishlistButton from './WishlistButton';
import OptimizedImage from '@/components/ui/image-loader';
import dynamic from 'next/dynamic';

// Otimização: Carregar botões com lazy loading
const QuickActionButtons = dynamic(() => import('./QuickActionButtons'), { ssr: false });

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

// Aplicar memo para evitar re-renderizações desnecessárias
const ProductCard = memo(({ product, featured = false }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  
  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300",
        featured && "md:col-span-2 lg:col-span-1"
      )}
      layout
    >
      <div className="relative">
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-[3/4] overflow-hidden relative">
            <OptimizedImage
              src={product.coverImage}
              alt={product.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              isHero={featured}
            />
            
            {/* Overlay on hover */}
            <div className={cn(
              "absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}></div>
          </div>
        </Link>
        
        {/* Quick action buttons - carregados apenas quando necessário */}
        {isHovered && (
          <div className={cn(
            "absolute top-3 right-3 flex flex-col gap-2 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300",
            isHovered ? "opacity-100 translate-x-0" : ""
          )}>
            <WishlistButton product={product} size="sm" />
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full shadow-md bg-white/90 dark:bg-gray-800/90 h-8 w-8 hover:bg-white"
            >
              <Bookmark className="h-4 w-4" />
              <span className="sr-only">Save for later</span>
            </Button>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md">
              Save {discountPercentage}%
            </span>
          )}
          {product.newRelease && (
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-md">
              New Release
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-md">
              Bestseller
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-1 text-sm text-muted-foreground">{product.author}</div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-lg mb-1 line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        
        {/* Rating - simplificado para melhor performance */}
        <div className="flex items-center space-x-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating) 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-lg">€ {formatPriceWithoutSymbol(product.price)}</span>
            {hasDiscount && (
              <span className="text-muted-foreground line-through text-sm">
                € {formatPriceWithoutSymbol(product.originalPrice!)}
              </span>
            )}
          </div>
          
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              className="w-full bg-[#08a4a7] hover:bg-[#0bdbb6] text-white shadow-sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Adicionando displayName para facilitar a depuração
ProductCard.displayName = 'ProductCard';

export default ProductCard;