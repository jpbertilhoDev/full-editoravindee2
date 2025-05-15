"use client"

import React, { useState, memo, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Bookmark, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { cn, formatPriceWithoutSymbol } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import WishlistButton from './WishlistButton';
import OptimizedImage from '@/components/ui/image-loader';

// Optimization: Using constant motion config object to avoid recalculations
const motionConfig = {
  whileHover: { y: -5 }
};

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

// Using memo to avoid unnecessary re-renders
const ProductCard = memo(({ product, featured = false }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  
  // Optimized calculations using useMemo
  const productData = useMemo(() => {
    const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
    const discountPercentage = hasDiscount
      ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
      : 0;
      
    return { hasDiscount, discountPercentage };
  }, [product.originalPrice, product.price]);

  // Optimized handler to avoid recreation on each render
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Destructure for cleaner render function
  const { hasDiscount, discountPercentage } = productData;

  return (
    <motion.div
      {...motionConfig}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group bg-white dark:bg-brand-dark-blue rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300",
        featured && "md:col-span-2 lg:col-span-1"
      )}
      layout="position"
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
              disableAnimation={!isHovered}
            />
            
            {/* Hover overlay with brand color */}
            {isHovered && (
              <div className="absolute inset-0 bg-brand-dark-blue/5 opacity-100 transition-opacity duration-300"></div>
            )}
          </div>
        </Link>
        
        {/* Quick action buttons with updated styling */}
        {isHovered && (
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-100 transform translate-x-0 transition-all duration-300">
            <WishlistButton product={product} size="sm" />
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full shadow-soft bg-white/90 dark:bg-brand-dark-blue/90 h-8 w-8 hover:bg-brand-mint hover:text-brand-dark-blue"
            >
              <Bookmark className="h-4 w-4" />
              <span className="sr-only">Save for later</span>
            </Button>
          </div>
        )}
        
        {/* Badges with brand colors */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-brand-gold text-brand-dark-blue text-xs font-medium px-2 py-1 rounded-md">
              Save {discountPercentage}%
            </span>
          )}
          {product.newRelease && (
            <span className="bg-brand-mint text-brand-dark-blue text-xs font-medium px-2 py-1 rounded-md">
              New Release
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-brand-petrol text-white text-xs font-medium px-2 py-1 rounded-md">
              Bestseller
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-1 text-sm text-muted-foreground font-serif">{product.author}</div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-lg mb-1 line-clamp-2 hover:text-brand-petrol transition-colors">
            {product.title}
          </h3>
        </Link>
        
        {/* Star ratings with gold brand color */}
        <div className="flex items-center space-x-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating) 
                  ? 'text-brand-gold fill-current' 
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
        </div>
        
        {/* Price with brand styling */}
        <div className="flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-lg text-brand-petrol">€ {formatPriceWithoutSymbol(product.price)}</span>
            {hasDiscount && (
              <span className="text-muted-foreground line-through text-sm">
                € {formatPriceWithoutSymbol(product.originalPrice!)}
              </span>
            )}
          </div>
          
          {/* Add to Cart button with brand hover effect */}
          {isHovered && (
            <div className="mt-3 opacity-100 transition-opacity duration-300">
              <Button 
                className="w-full bg-brand-petrol hover:bg-brand-mint hover:text-brand-dark-blue text-white shadow-soft transition-colors duration-300"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// Add displayName for better debugging
ProductCard.displayName = 'ProductCard';

export default ProductCard;