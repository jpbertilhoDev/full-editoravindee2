"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/types';
import OptimizedImage from '@/components/ui/image-loader';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

export interface BookCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  priority?: boolean;
  className?: string;
}

/**
 * Componente reutilizável para cards de livros
 * Suporta várias variantes e inclui acessibilidade integrada
 */
export function BookCard({ 
  product, 
  variant = 'default', 
  priority = false,
  className = '' 
}: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  
  // Calcular propriedades derivadas
  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;
  
  // Manipuladores de eventos acessíveis
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };
  
  // Diferentes layouts baseados na variante
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';
  
  return (
    <motion.div
      whileHover={isCompact ? {} : { y: -5 }}
      className={cn(
        "group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
        isFeatured && "md:col-span-2 lg:col-span-1",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        href={`/products/${product.slug}`} 
        className="block h-full"
        aria-label={`Ver detalhes de ${product.title} por ${product.author}`}
      >
        <div className={isCompact ? "flex gap-3" : "h-full flex flex-col"}>
          {/* Imagem do Livro com Otimização */}
          <div 
            className={cn(
              "relative overflow-hidden",
              isCompact ? "flex-shrink-0 w-20" : "aspect-[3/4]"
            )}
          >
            <OptimizedImage
              src={product.coverImage}
              alt={product.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              isHero={isFeatured}
            />
            
            {/* Badges (apenas para variantes não compactas) */}
            {!isCompact && (
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {hasDiscount && (
                  <span className="bg-red-500 text-white px-1.5 py-0.5 text-[10px] font-medium rounded shadow-sm">
                    {discountPercentage}% OFF
                  </span>
                )}
                {product.bestSeller && (
                  <span className="bg-amber-500 text-white px-1.5 py-0.5 text-[10px] font-medium rounded shadow-sm">
                    Bestseller
                  </span>
                )}
                {product.newRelease && (
                  <span className="bg-blue-500 text-white px-1.5 py-0.5 text-[10px] font-medium rounded shadow-sm">
                    New
                  </span>
                )}
              </div>
            )}
            
            {/* Overlay com botões de ação em hover (apenas desktop e modo não compacto) */}
            {!isCompact && isHovered && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-100 transform translate-y-0 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white hover:bg-[#08a4a7] hover:text-white text-[#08a4a7] rounded-full shadow-sm h-7 px-2.5 text-xs"
                    onClick={handleAddToCart}
                    aria-label={`Adicionar ${product.title} ao carrinho`}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 w-7 p-0 rounded-full flex items-center justify-center",
                      isInWishlist?.(product.id) 
                        ? "text-rose-500 bg-rose-50" 
                        : "text-gray-400 bg-white hover:text-rose-500"
                    )}
                    onClick={handleAddToWishlist}
                    aria-label={`${isInWishlist?.(product.id) ? 'Remover' : 'Adicionar'} ${product.title} aos favoritos`}
                  >
                    <Heart className={cn("h-3 w-3", isInWishlist?.(product.id) && "fill-current")} />
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Informações do Livro */}
          <div className={cn("flex flex-col", isCompact ? "" : "p-3 flex-grow")}>
            <div className="text-xs text-muted-foreground truncate">
              {product.author}
            </div>
            
            <h3 className={cn(
              "font-medium group-hover:text-[#08a4a7] transition-colors",
              isCompact ? "text-xs line-clamp-1" : "text-sm mt-0.5 line-clamp-2 min-h-[2.5rem]"
            )}>
              {product.title}
            </h3>
            
            {/* Avaliação em Estrelas */}
            {!isCompact && (
              <div className="flex items-center mt-auto pt-1.5">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={cn(
                        "fill-current",
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground ml-1" aria-label={`${product.rating} de 5 estrelas, ${product.reviewCount} avaliações`}>
                  ({product.reviewCount})
                </span>
              </div>
            )}
            
            {/* Preço */}
            <div className={cn(
              "flex items-baseline gap-1.5",
              isCompact ? "mt-1" : "mt-1"
            )}>
              <span className={cn(
                "font-bold",
                isCompact ? "text-xs" : "text-sm"
              )}>
                ${product.price.toFixed(2)}
              </span>
              
              {hasDiscount && (
                <span className={cn(
                  "text-muted-foreground line-through",
                  isCompact ? "text-[10px]" : "text-xs"
                )}>
                  ${product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 